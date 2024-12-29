import React from 'react';
import Image from 'next/image';
import styles from './CartProductCard.module.css';
import { Product } from '@/app/helpers/types';
import QuantityButton from '@/components/buttons/Quantity';
import CrossButton from '@/components/buttons/Cross';

interface CartProductCardProps extends Product {
  incrementCallback: (id: string) => void;
  decrementCallback: (id: string) => void;
  deleteCartItem: (id: string) => void;
}

const CartProductCard: React.FC<CartProductCardProps> = ({
  id,
  name,
  quantity,
  price,
  imageSizes = '10vw',
  imageSrc,
  incrementCallback,
  decrementCallback,
  deleteCartItem,
}) => {
  return (
    <div className={styles.contentsContainer}>
      <div className={styles.imageContainer}>
        <Image width={0} height={0} src={imageSrc} alt={name} sizes={imageSizes} />
      </div>
      <div className={styles.detailsContainer}>
        <h5>{name}</h5>
        <h5>{price}</h5>
        <QuantityButton
          id={id}
          quantity={quantity}
          incrementCallback={() => incrementCallback(id)}
          decrementCallback={() => decrementCallback(id)}
        />
      </div>

      <div className={styles.crossButtonContainer}>
        <CrossButton onClickCallback={() => deleteCartItem(id)} />
      </div>
    </div>
  );
};

export default CartProductCard;
