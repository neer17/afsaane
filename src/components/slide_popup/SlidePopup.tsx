import React, { useEffect, useContext, useImperativeHandle, forwardRef } from 'react';
import styles from './SlidePopup.module.css';
import CrossButton from '../buttons/Cross';
import { CartContext, CartObject } from '@/providers/CartProvider';

interface SlidePopupProps {
  isOpen: boolean;
  backdropClickCallback: () => void;
}

const SlidePopup = forwardRef(({ isOpen, backdropClickCallback }: SlidePopupProps, ref) => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error('CartContext must be used within a CartProvider');
  }

  const { cartData, setCartData } = cartContext;

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

  useEffect(() => {
    console.info({
      cartData,
    });
  }, [cartData]);

  const _addDataToCart = (newData: CartObject) => {
    setCartData((prevCartData) => [...prevCartData, newData]);
  };

  useImperativeHandle(ref, () => ({
    addDataToCart: _addDataToCart,
  }));

  return (
    <>
      {isOpen && <div className={styles.overlay} aria-hidden="true" onClick={() => backdropClickCallback()} />}
      <div className={`${styles.slidePanel} ${isOpen ? styles.open : ''}`} aria-expanded={isOpen}>
        <div className={styles.panelHeader}>
          <h1>Cart</h1>
          <div>
            <CrossButton onClickCallback={backdropClickCallback} />
          </div>
        </div>
      </div>
    </>
  );
});

export default SlidePopup;
