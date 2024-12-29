import React, { useEffect } from 'react';
import styles from './SlidePopup.module.css';
import CrossButton from '../buttons/Cross';
import { useCart } from '@/providers/CartProvider';
import CartProductCard from '../card/CartProductCard';

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

  const handleIncrementItemQuantity = async (id: string) => {
    const item = cartData.get(id);
    if (item === undefined) {
      console.error(`Item does not exists for id: ${id}`);
      return;
    }

    await setCartData(item);
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
          {Array.from(cartData.values()).map(({ id, name, price, quantity, imageSrc, category }) => (
            <CartProductCard
              key={id}
              id={id}
              name={name}
              price={price}
              quantity={quantity}
              imageSrc={imageSrc}
              category={category}
              incrementCallback={handleIncrementItemQuantity}
              decrementCallback={handleDecrementItemQuantity}
              deleteCartItem={handleDeleteCartItem}
              imageSizes="10vw"
            />
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
