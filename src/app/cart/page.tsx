/* eslint-disable react-hooks/rules-of-hooks */

'use client';

import React from 'react';
import styles from './page.module.css';
import { useCart } from '@/providers/CartProvider';
import CartProductCard from '@/components/card/CartProductCard';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LeftArrow from '@/app/svgs/left_arrow.svg';

export default function page() {
  const router = useRouter();
  const { cartData, setCartData, getTotalPrice, removeCartData, deleteCartData } = useCart();

  const handleQuantityIncrement = async (id: string) => {
    const item = cartData.get(id);

    if (item !== undefined) {
      await setCartData(item);
    }
  };

  const handleQuantityDecrement = async (id: string) => {
    await removeCartData(id);
  };

  const handleDeleteItem = async (id: string) => {
    await deleteCartData(id);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className={styles.cartDetailsContainer}>
      <div className={styles.goBackToShoppingContainer} onClick={handleGoBack}>
        <Image height={25} width={25} src={LeftArrow} alt="Go back to shopping" />
        <span>Go back to shopping</span>
      </div>
     <div style={{
      display: 'flex'
     }}>
     <div className={styles.productsContainer}>
        {Array.from(cartData.values()).map(({ id, name, price, quantity, category, imageSrc }) => (
          <CartProductCard
            key={id}
            id={id}
            name={name}
            price={price}
            quantity={quantity}
            imageSrc={imageSrc}
            category={category}
            imageSizes="10vw"
            incrementCallback={handleQuantityIncrement}
            decrementCallback={handleQuantityDecrement}
            deleteCartItem={handleDeleteItem}
          />
        ))}
      </div>

      <div className={styles.checkoutContainer}>
        <div className={styles.shippingDetailsContainer}></div>
        <div className={styles.orderDetailsContainer}>
          <h3>Order Summary</h3>
          <span className={styles.totalPriceContainer}>
            <h3>Total</h3> <span>{getTotalPrice()}</span>
          </span>
        </div>
        <button className={styles.checkoutButton}>Checkout</button>

        <div className={styles.queryContainer}></div>
      </div>
     </div>

      <div className={styles.checkoutContainerMobile}>
        <span>{getTotalPrice()}</span>
        <button className={styles.checkoutButton}>Checkout</button>
      </div>
    </div>
  );
}
