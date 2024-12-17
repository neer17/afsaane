'use client';

import React, { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect, useContext } from 'react';

// Props for the CartProvider
interface CartProviderProps {
  children: ReactNode;
}

// Type for individual cart items
export type CartObject = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  quantity: number;
};

// Context type
interface CartContextType {
  cartData: CartObject[];
  setCartData: Dispatch<SetStateAction<CartObject[]>>;
}

// Create context with proper type and default value
export const CartContext = createContext<CartContextType | undefined>(undefined);

// CartProvider Component
export default function CartProvider({ children }: CartProviderProps) {
  const [cartData, setCartData] = useState<CartObject[]>([]);

  useEffect(() => {
    console.info({
      cartData,
    });
  }, [cartData]);

  return <CartContext.Provider value={{ cartData, setCartData }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
