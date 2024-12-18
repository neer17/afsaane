'use client';

import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';

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
  setCartData: (cartObject: CartObject) => Error | undefined;
  removeCartData: (itemId: string) => Error | undefined;
}

// Create context with proper type and default value
export const CartContext = createContext<CartContextType | undefined>(undefined);

// CartProvider Component
export default function CartProvider({ children }: CartProviderProps) {
  const [cartData, setCartDataState] = useState<Map<string, CartObject>>(new Map());

  const setCartData = (cartItem: CartObject): Error | undefined => {
    const newCartData = new Map(cartData); // Create a new Map to trigger state change
    if (newCartData.has(cartItem.id)) {
      const existingItem = newCartData.get(cartItem.id)!;
      existingItem.quantity++;
    } else {
      newCartData.set(cartItem.id, cartItem);
    }

    setCartDataState(newCartData); // Update state with new Map
    return;
  };

  const removeCartData = (itemId: string): Error | undefined => {
    const newCartData = new Map(cartData); // Create a new Map to trigger state change
    if (newCartData.has(itemId)) {
      const item = newCartData.get(itemId)!;
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        newCartData.delete(itemId);
      }
    }

    setCartDataState(newCartData); // Update state with new Map
    return;
  };

  useEffect(() => {
    console.info({
      cartData: Array.from(cartData.values()), // Convert Map to array for logging
    });
  }, [cartData]);

  return (
    <CartContext.Provider value={{ cartData, setCartData, removeCartData }}>
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
