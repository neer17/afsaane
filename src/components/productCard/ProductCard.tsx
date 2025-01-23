'use client';

import React, { useEffect, useState } from 'react';
import styles from './ProductCard.module.css';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface ProductCardProps {
  images: string[];
  productTitle: string;
  imageSizes: string;
  productPrice: number;
}

export default function ProductCard({
  images,
  productTitle,
  imageSizes,
  productPrice,
}: ProductCardProps) {
  const [isSmallViewport, setIsSmallViewport] = useState<boolean>(false);

  useEffect(() => {
    // Check if the code is running in the browser (client-side)
    if (typeof window !== 'undefined') {
      setIsSmallViewport(window.innerWidth < 1024);

      const handleResize = () => {
        setIsSmallViewport(window.innerWidth < 1024);
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  console.info({
    isSmallViewport,
  });

  return (
    <div className={styles.productContainer}>
      <div className={styles.imageContainer}>
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          pagination={isSmallViewport ? { clickable: true } : false} // Use pagination if small viewport
          modules={[Pagination, Navigation]}
          navigation={!isSmallViewport}
          loop={true}
          className={styles.swiperContainer}
        >
          {images.map((imageSrc, index) => (
            <SwiperSlide key={index}>
              <Image
                src={imageSrc}
                alt={`${productTitle} - Image ${index + 1}`}
                width={500}
                height={500}
                sizes={imageSizes}
                priority
                className={styles.productImage}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className={styles.textContainer}>
        <span className={styles.productTitle}>{productTitle}</span>
        <span className={styles.productPrice}>${productPrice}</span>
      </div>
    </div>
  );
}
