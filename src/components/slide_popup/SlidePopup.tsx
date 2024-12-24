import React, { useEffect } from 'react';
import styles from './SlidePopup.module.css';
import CrossButton from '../buttons/Cross';
import { CartObject, useCart } from '@/providers/CartProvider';
import Image from 'next/image';

interface SlidePopupProps {
  isOpen: boolean;
  backdropClickCallback: () => void;
}

const SlidePopup: React.FC<SlidePopupProps> = ({ isOpen, backdropClickCallback }) => {
  const { cartData, setCartData, deleteCartData, removeCartData, getTotalPrice } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  const handleDeleteCartItem = async (itemId: string) => {
    await deleteCartData(itemId);
  };

  const handleIncrementItemQuantity = async (cartItem: CartObject) => {
    await setCartData(cartItem);
  };

  const handleDecrementItemQuantity = async (itemId: string) => {
    await removeCartData(itemId);
  };

  useEffect(() => {
    console.info('Cart data changed:', cartData);
  }, [cartData]);

  return (
    <>
      {isOpen && <div className={styles.overlay} aria-hidden="true" onClick={backdropClickCallback} />}
      <div className={`${styles.slidePanel} ${isOpen ? styles.open : ''}`} aria-expanded={isOpen}>
        <div className={styles.panelHeader}>
          <h1>Cart</h1>
          <div>
            <CrossButton onClickCallback={backdropClickCallback} />
          </div>
        </div>

        <div className={styles.productsList}>
          {Array.from(cartData.values()).map(({ id, name, price, quantity, imageUrl, category }) => (
            <div key={id} className={styles.contentsContainer}>
              <div className={styles.imageContainer}>
                <Image width={0} height={0} src={imageUrl} alt={name} sizes="10vw" />
              </div>
              <div className={styles.detailsContainer}>
                <h5>{name}</h5>
                <h5>{price}</h5>
                <div className={styles.quantityButtonContainer}>
                  <span onClick={() => handleIncrementItemQuantity({ id, name, quantity, price, category, imageUrl })}>
                    +
                  </span>
                  <h5>{quantity}</h5>
                  <span onClick={() => handleDecrementItemQuantity(id)}>-</span>
                </div>
              </div>

              <div className={styles.crossButtonContainerSecond}>
                <CrossButton onClickCallback={() => handleDeleteCartItem(id)} />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.checkoutContainer}>
          <button className={styles.checkoutButton}>
            <span>Checkout</span>
            <span>.</span>
            <span>{getTotalPrice()}</span>{' '}
          </button>
        </div>
      </div>
    </>
  );
};

export default SlidePopup;
