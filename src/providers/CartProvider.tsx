'use client';

import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { openDB, DBSchema } from 'idb';

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

// Context type
interface CartContextType {
  cartData: Map<string, CartObject>;
  setCartData: (cartObject: CartObject) => void;
  removeCartData: (itemId: string) => void;
  deleteCartData: (itemId: string) => void
}

// Define the database schema
interface CartDB extends DBSchema {
  cartStore: {
    key: string;
    value: CartObject;
  };
}

// Create context with proper type and default value
export const CartContext = createContext<CartContextType | undefined>(undefined);

// Initialize IndexedDB
const dbPromise = openDB<CartDB>('cartDB', 1, {
  upgrade(db) {
    db.createObjectStore('cartStore', { keyPath: 'id' });
  },
});

export default function CartProvider({ children }: CartProviderProps) {
  const [cartData, setCartDataState] = useState<Map<string, CartObject>>(new Map());

  const setCartData = async (cartItem: CartObject) => {
    const newCartData = new Map(cartData);
    if (newCartData.has(cartItem.id)) {
      const existingItem = newCartData.get(cartItem.id)!;
      existingItem.quantity += cartItem.quantity;
    } else {
      newCartData.set(cartItem.id, cartItem);
    }

    // Update IndexedDB
    const db = await dbPromise;
    await db.put('cartStore', newCartData.get(cartItem.id)!);

    setCartDataState(newCartData);
  };

  const removeCartData = async (itemId: string) => {
    const newCartData = new Map(cartData);
    if (newCartData.has(itemId)) {
      const item = newCartData.get(itemId)!;
      if (item.quantity > 1) {
        item.quantity--;
        // Update IndexedDB
        const db = await dbPromise;
        await db.put('cartStore', item);
      } else {
        newCartData.delete(itemId);
        // Remove from IndexedDB
        const db = await dbPromise;
        await db.delete('cartStore', itemId);
      }
    }

    setCartDataState(newCartData);
  };

  const deleteCartData = async (itemId: string) => {
    if (!cartData.has(itemId)) {
      console.error(`Cannot delete item with id: ${itemId} as it does not exists`)
    }
    
    const newCartData = new Map(cartData);
    newCartData.delete(itemId)
    const db = await dbPromise;
    await db.delete('cartStore', itemId);
  }

  useEffect(() => {
    // Load initial data from IndexedDB
    const loadCartData = async () => {
      const db = await dbPromise;
      const allItems = await db.getAll('cartStore');
      const initialCartData = new Map<string, CartObject>();
      allItems.forEach(item => initialCartData.set(item.id, item));
      setCartDataState(initialCartData);
    };

    loadCartData();
  }, []);

  return (
    <CartContext.Provider value={{ cartData, setCartData, removeCartData, deleteCartData }}>
      {children}
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
