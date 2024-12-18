import React, { useEffect, useContext, useImperativeHandle, forwardRef } from 'react';
import styles from './SlidePopup.module.css';
import CrossButton from '../buttons/Cross';
import { useCart } from '@/providers/CartProvider';

interface SlidePopupProps {
  isOpen: boolean;
  backdropClickCallback: () => void;
}

const SlidePopup: React.FC<SlidePopupProps> = ({ isOpen, backdropClickCallback }) => {
  const { cartData, setCartData } = useCart();

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

  // useEffect(() => {
  // }, [cartData]);

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
};

export default SlidePopup;
