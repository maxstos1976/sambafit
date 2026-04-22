import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true, min: 1 },
  selectedSize: { type: String },
  isGiftCard: { type: Boolean, default: false },
  giftCardId: { type: mongoose.Schema.Types.ObjectId, ref: 'GiftCard' }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  residentialAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  phone: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [cartItemSchema],
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  preferredLanguage: { type: String, enum: ['ca', 'es', 'pt', 'en'], default: 'ca' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
