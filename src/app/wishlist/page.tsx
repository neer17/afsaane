'use client';

import React from 'react';
import styles from './page.module.css';
import { useCart, useWishlist } from '@/providers/CartProvider';
import WishlistCard from '@/components/card/WishlistCard';

export default function Wishlist() {
  const { wishlistData, removeWishlistItem } = useWishlist();
  const { cartData, setCartData } = useCart();

  const handleIncrementQuantity = async (id: string) => {
    const item = cartData.get(id);

    if (item === undefined) {
      console.error(`${id} does not exists`);
      return;
    }

    item.quantity++;
    await setCartData(item);
  };

  const handleDecrementQuantity = async (id: string) => {
    const item = cartData.get(id);

    if (item === undefined) {
      console.error(`${id} does not exists`);
      return;
    }

    item.quantity--;
    await setCartData(item);
  };

  const handleAddToCart = async (id: string) => {
    const item = wishlistData.get(id);

    if (item === undefined) {
      console.error(`${id} does not exists in the wishlist`);
      return;
    }

    await removeWishlistItem(id);
    await setCartData(item);
  };

  const handleRemoveItem = async (id: string) => {
    const item = wishlistData.get(id);

    if (item === undefined) {
      console.error(`${id} does not exists in the wishlist`);
      return;
    }

    await removeWishlistItem(id);
  };

  return (
    <div className={styles.wishlistPageContainer}>
      <h3>Your Wishlist</h3>

      <div className={styles.productsContainer}>
        {Array.from(wishlistData.values()).map(({ id, name, quantity, imageUrl, price }) => (
          <div className={styles.productCardWrapper}>
            <WishlistCard
              id={id}
              name={name}
              quantity={quantity}
              imageSrc={imageUrl}
              price={price}
              addToCardCallback={handleAddToCart}
              removeItemCallback={handleRemoveItem}
              incrementInQuantityCallback={handleIncrementQuantity}
              decrementInQuantityCallback={handleDecrementQuantity}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
