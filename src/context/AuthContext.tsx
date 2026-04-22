import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi, cartApi } from "../services/api";
import { CartItem } from "../types";

interface User {
  _id: string;
  name: string;
  surname?: string;
  email: string;
  role: string;
  dob?: string;
  gender?: string;
  deliveryAddress?: any;
  residentialAddress?: any;
  phone?: string;
  theme?: string;
  preferredLanguage?: string;
  favorites: string[];
  cart: CartItem[];
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: any, localCart?: CartItem[]) => Promise<void>;
  register: (userData: any, localCart?: CartItem[]) => Promise<void>;
  updateProfile: (userData: any) => Promise<void>;
  deleteAccount: () => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  addToCart: (
    productId: string,
    quantity: number,
    selectedSize?: string,
    isGiftCard?: boolean,
    giftCardId?: string,
  ) => Promise<CartItem[]>;
  removeFromCart: (
    productId: string,
    selectedSize?: string,
    isGiftCard?: boolean,
  ) => Promise<CartItem[]>;
  updateCartQuantity: (
    productId: string,
    quantity: number,
    selectedSize?: string,
    isGiftCard?: boolean,
  ) => Promise<CartItem[]>;
  clearCart: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // Refresh profile to update cart information and check token validity
      const refreshProfile = async () => {
        try {
          const profileData = await authApi.getProfile(userData.token);
          // Preserve token from storedUser as profile endpoint might not return it
          const updatedUser = { ...userData, ...profileData };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error) {
          console.error("Failed to refresh user profile:", error);
          // If token is invalid or expired, clear user data
          if (
            (error as any).message?.includes("401") ||
            (error as any).message?.includes("token")
          ) {
            logout();
          }
        }
      };

      refreshProfile();
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: any, localCart?: CartItem[]) => {
    const data = await authApi.login(credentials);
    let finalUser = data;

    // Sync local cart to DB if logging in
    if (localCart && localCart.length > 0) {
      for (const item of localCart) {
        try {
          const updatedCart = await cartApi.add(
            data.token,
            item.id || (item as any)._id,
            item.quantity,
            item.selectedSize,
          );
          finalUser = { ...finalUser, cart: updatedCart };
        } catch (error) {
          console.error("Failed to sync item to cart:", error);
        }
      }
    }

    setUser(finalUser);
    localStorage.setItem("user", JSON.stringify(finalUser));
  };

  const register = async (userData: any, localCart?: CartItem[]) => {
    const data = await authApi.register(userData);
    let finalUser = data;

    // Sync local cart to DB if registering
    if (localCart && localCart.length > 0) {
      for (const item of localCart) {
        try {
          const updatedCart = await cartApi.add(
            data.token,
            item.id || (item as any)._id,
            item.quantity,
            item.selectedSize,
          );
          finalUser = { ...finalUser, cart: updatedCart };
        } catch (error) {
          console.error("Failed to sync item to cart:", error);
        }
      }
    }

    setUser(finalUser);
    localStorage.setItem("user", JSON.stringify(finalUser));
  };

  const updateProfile = async (userData: any) => {
    if (!user) return;
    const data = await authApi.updateProfile(user.token, userData);
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const deleteAccount = async () => {
    if (!user) return;
    await authApi.deleteAccount(user.token);
    logout();
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) return;
    const updatedFavorites = await authApi.toggleFavorite(
      user.token,
      productId,
    );
    const updatedUser = { ...user, favorites: updatedFavorites };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const addToCart = async (
    productId: string,
    quantity: number,
    selectedSize?: string,
    isGiftCard?: boolean,
    giftCardId?: string,
  ) => {
    if (!user) return [];
    const updatedCart = await cartApi.add(
      user.token,
      productId,
      quantity,
      selectedSize,
      isGiftCard,
      giftCardId,
    );
    const updatedUser = { ...user, cart: updatedCart };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedCart;
  };

  const removeFromCart = async (
    productId: string,
    selectedSize?: string,
    isGiftCard?: boolean,
  ) => {
    if (!user) return [];
    const updatedCart = await cartApi.remove(
      user.token,
      productId,
      selectedSize,
      isGiftCard,
    );
    const updatedUser = { ...user, cart: updatedCart };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedCart;
  };

  const updateCartQuantity = async (
    productId: string,
    quantity: number,
    selectedSize?: string,
    isGiftCard?: boolean,
  ) => {
    if (!user) return [];
    const updatedCart = await cartApi.update(
      user.token,
      productId,
      quantity,
      selectedSize,
      isGiftCard,
    );
    const updatedUser = { ...user, cart: updatedCart };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedCart;
  };

  const clearCart = () => {
    if (user) {
      const updatedUser = { ...user, cart: [] };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        updateProfile,
        deleteAccount,
        toggleFavorite,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
