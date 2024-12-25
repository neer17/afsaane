'use client';

import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Props for the CartProvider
interface CartProviderProps {
  children: ReactNode;
}

// Type for individual cart items
export type CartObject = {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  quantity: number;
};

// Type for individual wishlist items
export type WishlistObject = {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  quantity: number;
};

// Context type for Cart
interface CartContextType {
  cartData: Map<string, CartObject>;
  setCartData: (cartObject: CartObject) => Promise<void>;
  removeCartData: (itemId: string) => Promise<void>;
  deleteCartData: (itemId: string) => Promise<void>;
  getTotalPrice: () => number;
}

// Context type for Wishlist
interface WishlistContextType {
  wishlistData: Map<string, WishlistObject>;
  addWishlistItem: (wishlistObject: WishlistObject) => Promise<void>;
  removeWishlistItem: (itemId: string) => Promise<void>;
}

// Define the database schema
interface CartDB extends DBSchema {
  cartStore: {
    key: string;
    value: CartObject;
  };
  wishlistStore: {
    key: string;
    value: WishlistObject;
  };
}

// Create context with proper type and default value
const CartContext = createContext<CartContextType | undefined>(undefined);
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Initialize IndexedDB only if in the browser
let dbPromise: Promise<IDBPDatabase<CartDB>> | undefined;
if (typeof window !== 'undefined') {
  dbPromise = openDB<CartDB>('cartDB', 1, {
    upgrade(db) {
      db.createObjectStore('cartStore', { keyPath: 'id' });
      db.createObjectStore('wishlistStore', { keyPath: 'id' });
    },
  });
}

export default function CartProvider({ children }: CartProviderProps) {
  const [cartData, setCartDataState] = useState<Map<string, CartObject>>(new Map());
  const [wishlistData, setWishlistDataState] = useState<Map<string, WishlistObject>>(new Map());

  useEffect(() => {
    console.info({
      cartData,
      wishlistData,
    });
  }, [cartData, wishlistData]);

  useEffect(() => {
    const loadCartData = async () => {
      if (!dbPromise) return;

      try {
        const db = await dbPromise;
        const allCartItems = await db.getAll('cartStore');
        const initialCartData = new Map<string, CartObject>();
        allCartItems.forEach((item) => initialCartData.set(item.id, item));
        setCartDataState(initialCartData);
        console.info('Cart data loaded from IndexedDB');
      } catch (error) {
        console.error('Failed to load cart data:', error);
      }
    };

    const loadWishlistData = async () => {
      if (!dbPromise) return;

      try {
        const db = await dbPromise;
        const allWishlistItems = await db.getAll('wishlistStore');
        const initialWishlistData = new Map<string, WishlistObject>();
        allWishlistItems.forEach((item) => initialWishlistData.set(item.id, item));
        setWishlistDataState(initialWishlistData);
        console.info('Wishlist data loaded from IndexedDB');
      } catch (error) {
        console.error('Failed to load wishlist data:', error);
      }
    };

    loadCartData();
    loadWishlistData();
  }, []);

  const setCartData = async (cartItem: CartObject) => {
    if (!dbPromise) return;

    try {
      const newCartData = new Map(cartData);
      if (newCartData.has(cartItem.id)) {
        const existingItem = newCartData.get(cartItem.id)!;
        existingItem.quantity++;
      } else {
        newCartData.set(cartItem.id, cartItem);
      }

      const db = await dbPromise;
      await db.put('cartStore', newCartData.get(cartItem.id)!);
      setCartDataState(newCartData);
    } catch (error) {
      console.error('Failed to set cart data:', error);
    }
  };

  const removeCartData = async (itemId: string) => {
    if (!dbPromise) return;

    try {
      const newCartData = new Map(cartData);
      if (newCartData.has(itemId)) {
        const item = newCartData.get(itemId)!;
        if (item.quantity > 1) {
          item.quantity--;
          const db = await dbPromise;
          await db.put('cartStore', item);
        } else {
          newCartData.delete(itemId);
          const db = await dbPromise;
          await db.delete('cartStore', itemId);
        }
      }
      setCartDataState(newCartData);
    } catch (error) {
      console.error('Failed to remove cart data:', error);
    }
  };

  const deleteCartData = async (itemId: string) => {
    if (!dbPromise) return;

    try {
      if (!cartData.has(itemId)) {
        console.warn(`Item with id: ${itemId} does not exist`);
        return;
      }

      const newCartData = new Map(cartData);
      newCartData.delete(itemId);
      setCartDataState(newCartData);

      const db = await dbPromise;
      await db.delete('cartStore', itemId);
    } catch (error) {
      console.error('Failed to delete cart data:', error);
    }
  };

  const getTotalPrice = (): number => {
    return Array.from(cartData.values()).reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
  };

  const addWishlistItem = async (wishlistItem: WishlistObject) => {
    if (!dbPromise) return;

    console.info({
      wishlistItem,
    });
    try {
      const newWishlistData = new Map(wishlistData);
      newWishlistData.set(wishlistItem.id, wishlistItem);

      const db = await dbPromise;
      await db.put('wishlistStore', wishlistItem);
      setWishlistDataState(newWishlistData);
    } catch (error) {
      console.error('Failed to add wishlist item:', error);
    }
  };

  const removeWishlistItem = async (itemId: string) => {
    if (!dbPromise) return;

    try {
      const newWishlistData = new Map(wishlistData);
      if (newWishlistData.has(itemId)) {
        newWishlistData.delete(itemId);
        const db = await dbPromise;
        await db.delete('wishlistStore', itemId);
      }
      setWishlistDataState(newWishlistData);
    } catch (error) {
      console.error('Failed to remove wishlist item:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cartData, setCartData, removeCartData, deleteCartData, getTotalPrice }}>
      <WishlistContext.Provider value={{ wishlistData, addWishlistItem, removeWishlistItem }}>
        {children}
      </WishlistContext.Provider>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a CartProvider');
  }
  return context;
}
