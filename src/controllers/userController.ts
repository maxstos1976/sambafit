import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { GiftCard } from '../models/GiftCard.js';

// Gestão de Usuários
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

const mapCartItem = (item: any) => {
  if (item.isGiftCard && item.giftCardId) {
    const gc = item.giftCardId;
    return {
      id: gc._id.toString(),
      _id: gc._id.toString(),
      isGiftCard: true,
      giftCardId: gc._id.toString(),
      name: `Cartão Presente - €${gc.value}`,
      nome_produto: `Cartão Presente - €${gc.value}`,
      price: gc.value,
      preco_unitario: gc.value,
      image: 'https://exlibris.store/cdn/shop/files/gift.webp',
      description: `Para: ${gc.recipientName}\nMsg: ${gc.message}`,
      quantity: item.quantity,
      quantidade: item.quantity,
      subtotal: gc.value * item.quantity
    };
  }

  if (!item.productId) return null;
  const productInfo = item.productId.toObject ? item.productId.toObject() : item.productId;
  return {
    ...productInfo,
    id: item.productId._id?.toString() || item.productId.id,
    _id: item.productId._id?.toString() || item.productId.id,
    quantity: item.quantity,
    quantidade: item.quantity,
    selectedSize: item.selectedSize,
    preco_unitario: productInfo.price,
    nome_produto: productInfo.name,
    subtotal: productInfo.price * item.quantity
  };
};

export const registerUser = async (req, res) => {
  const { name, surname, email, password, theme, preferredLanguage } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    surname,
    email,
    password: hashedPassword,
    theme: theme || 'light',
    preferredLanguage: preferredLanguage || 'ca',
  });

  if (user) {
    const populatedUser = await User.findById(user._id).populate(['cart.productId', 'cart.giftCardId']);
    res.status(201).json({
      _id: populatedUser._id,
      name: populatedUser.name,
      surname: populatedUser.surname,
      email: populatedUser.email,
      role: populatedUser.role,
      theme: populatedUser.theme,
      preferredLanguage: populatedUser.preferredLanguage,
      dob: populatedUser.dob,
      gender: populatedUser.gender,
      deliveryAddress: populatedUser.deliveryAddress,
      residentialAddress: populatedUser.residentialAddress,
      phone: populatedUser.phone,
      favorites: populatedUser.favorites,
      cart: populatedUser.cart.map(mapCartItem).filter(Boolean),
      token: generateToken(populatedUser._id.toString()),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

export const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate(['cart.productId', 'cart.giftCardId']);

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      theme: user.theme,
      preferredLanguage: user.preferredLanguage,
      dob: user.dob,
      gender: user.gender,
      deliveryAddress: user.deliveryAddress,
      residentialAddress: user.residentialAddress,
      phone: user.phone,
      favorites: user.favorites,
      cart: user.cart.map(mapCartItem).filter(Boolean),
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).populate(['cart.productId', 'cart.giftCardId']);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      theme: user.theme,
      preferredLanguage: user.preferredLanguage,
      dob: user.dob,
      gender: user.gender,
      deliveryAddress: user.deliveryAddress,
      residentialAddress: user.residentialAddress,
      phone: user.phone,
      favorites: user.favorites,
      cart: user.cart.map(mapCartItem).filter(Boolean),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.surname = req.body.surname || user.surname;
    user.email = req.body.email || user.email;
    user.dob = req.body.dob || user.dob;
    user.gender = req.body.gender || user.gender;
    user.deliveryAddress = req.body.deliveryAddress || user.deliveryAddress;
    user.residentialAddress = req.body.residentialAddress || user.residentialAddress;
    user.phone = req.body.phone || user.phone;
    user.theme = req.body.theme || user.theme;
    user.preferredLanguage = req.body.preferredLanguage || user.preferredLanguage;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      surname: updatedUser.surname,
      email: updatedUser.email,
      role: updatedUser.role,
      theme: updatedUser.theme,
      preferredLanguage: updatedUser.preferredLanguage,
      dob: updatedUser.dob,
      gender: updatedUser.gender,
      deliveryAddress: updatedUser.deliveryAddress,
      residentialAddress: updatedUser.residentialAddress,
      phone: updatedUser.phone,
      token: generateToken(updatedUser._id.toString()),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const deleteUserAccount = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User account deleted successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const addToCart = async (req, res) => {
  const { productId, quantity, selectedSize, isGiftCard, giftCardId } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    const cartItemIndex = user.cart.findIndex(
      (item: any) => {
        if (isGiftCard) {
          return item.giftCardId?.toString() === giftCardId;
        }
        return item.productId?.toString() === productId && item.selectedSize === selectedSize;
      }
    );

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      if (isGiftCard) {
        user.cart.push({ giftCardId, quantity, isGiftCard: true } as any);
      } else {
        user.cart.push({ productId, quantity, selectedSize });
      }
    }

    await user.save();
    const updatedUser = await User.findById(user._id).populate(['cart.productId', 'cart.giftCardId']);
    res.json(updatedUser.cart.map(mapCartItem).filter(Boolean));
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const removeFromCart = async (req, res) => {
  const { productId, selectedSize, isGiftCard } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    user.cart = user.cart.filter(
      (item: any) => {
        if (isGiftCard) {
          return item.giftCardId?.toString() !== productId;
        }
        return !(item.productId?.toString() === productId && item.selectedSize === selectedSize);
      }
    ) as any;
    await user.save();
    const updatedUser = await User.findById(user._id).populate(['cart.productId', 'cart.giftCardId']);
    res.json(updatedUser.cart.map(mapCartItem).filter(Boolean));
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const updateCartQuantity = async (req, res) => {
  const { productId, quantity, selectedSize, isGiftCard } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    const cartItemIndex = user.cart.findIndex(
      (item: any) => {
        if (isGiftCard) {
          return item.giftCardId?.toString() === productId;
        }
        return item.productId?.toString() === productId && item.selectedSize === selectedSize;
      }
    );

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity = quantity;
      await user.save();
      const updatedUser = await User.findById(user._id).populate(['cart.productId', 'cart.giftCardId']);
      res.json(updatedUser.cart.map(mapCartItem).filter(Boolean));
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const toggleFavorite = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);

  if (user) {
    const index = user.favorites.indexOf(productId as any);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(productId as any);
    }
    await user.save();
    res.json(user.favorites);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Admin Controllers
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete admin user' });
      }
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = req.body.role || user.role;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
