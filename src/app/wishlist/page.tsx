/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import React from "react";
import styles from "./page.module.css";
import { useCart, useWishlist } from "@/context/CartContext";
import WishlistCard from "@/components/card/WishlistCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LeftArrow from "@/app/svgs/left_arrow.svg";

export default function Wishlist() {
  const { wishlistData, removeWishlistItem } = useWishlist();
  const { cartData, setCartData } = useCart();
  const router = useRouter();

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

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className={styles.wishlistPageContainer}>
      <div className={styles.goBackToShoppingContainer} onClick={handleGoBack}>
        <Image
          height={25}
          width={25}
          src={LeftArrow}
          alt="Go back to shopping"
        />
        <span>Go back to shopping</span>
      </div>

      <h3>Your Wishlist</h3>

      <div className={styles.productsContainer}>
        {Array.from(wishlistData.values()).map(
          ({ id, name, quantity, imageSrc, price }) => (
            <div key={id} className={styles.productCardWrapper}>
              <WishlistCard
                id={id}
                name={name}
                quantity={quantity}
                imageSrc={imageSrc}
                price={price}
                addToCardCallback={handleAddToCart}
                removeItemCallback={handleRemoveItem}
                incrementInQuantityCallback={handleIncrementQuantity}
                decrementInQuantityCallback={handleDecrementQuantity}
              />
            </div>
          ),
        )}
      </div>
    </div>
  );
}
