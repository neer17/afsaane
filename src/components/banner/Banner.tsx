import React from 'react';
import styles from './banner.module.css';

interface BannerProps {
  title: string;
  description: string;
}

const Banner: React.FC<BannerProps> = ({ title, description }) => {
  return (
    <div className={styles.bannerContainer}>
      <span>{title}</span>
      <span>{description}</span>
    </div>
  );
};

export default Banner;
