import React from 'react';
import Image from 'next/image';
import styles from './CartProductCard.module.css';
import { Product } from '@/app/helpers/types';
import QuantityButton from '@/components/buttons/Quantity';
import CrossButton from '@/components/buttons/Cross';
import { Text, Group } from '@mantine/core';

interface CartProductCardProps extends Product {
  isOrderSummaryCard?: boolean;
  crossButtonWidth?: string;
  crossButtonHeight?: string;
  incrementCallback?: (id: string) => void;
  decrementCallback?: (id: string) => void;
  deleteCartItem?: (id: string) => void;
}

const CartProductCard: React.FC<CartProductCardProps> = ({
  id,
  name,
  quantity,
  price,
  imageSizes = '10vw',
  imageSrc,
  isOrderSummaryCard = false,
  crossButtonWidth = '20px',
  crossButtonHeight = '20px',
  incrementCallback,
  decrementCallback,
  deleteCartItem,
}) => {
  return (
    <div className={styles.contentsContainer}>
      <div className={styles.imageContainer}>
        <Image
          width={0}
          height={0}
          src={imageSrc}
          alt={name}
          sizes={imageSizes}
        />
      </div>
      <div className={styles.detailsContainer}>
        <h5>{name}</h5>
        <h5>{price}</h5>
        {isOrderSummaryCard && (
          <Group>
            <Text size="xs" fw={700} mr={4}>
              Qty
            </Text>
            <Text size="xs">{quantity}</Text>
          </Group>
        )}
        {!isOrderSummaryCard && (
          <QuantityButton
            id={id}
            quantity={quantity}
            incrementCallback={() => incrementCallback && incrementCallback(id)}
            decrementCallback={() => decrementCallback && decrementCallback(id)}
          />
        )}
      </div>

      <div className={styles.crossButtonContainer}>
        <CrossButton
          width={crossButtonWidth}
          height={crossButtonHeight}
          onClickCallback={() => deleteCartItem && deleteCartItem(id)}
        />
      </div>
    </div>
  );
};

export default CartProductCard;
