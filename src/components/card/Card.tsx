import React from 'react';
import styles from './Card.module.css';
import Image from 'next/image';

interface CardProps {
  productDescription: string;
  price: number;
}

const Card: React.FC<CardProps> = ({ productDescription, price }) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.imageContainer}>
        <Image
          width={0}
          height={0}
          alt="Product Image"
          src="https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1440&h=1440&dpr=2"
          sizes="(max-width: 767px) 50vw, 25vw;"
        />
      </div>
      <div className={styles.textContainer}>
        <div className={styles.productDescription}>{productDescription}</div>
        <div className={styles.productPrice}>{price}</div>
      </div>
    </div>
  );
};

export default Card;
