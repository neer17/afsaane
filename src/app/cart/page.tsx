'use client';

import React from 'react';
import styles from './page.module.css';
import { useCart } from '@/providers/CartProvider';

export default function page() {
  const { cartData, setCartData } = useCart();

  return <div></div>;
}
