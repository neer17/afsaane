'use client';

import React, { useEffect, useState } from 'react';
import styles from './ProductCard.module.css';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import WishlistSVG from '@/app/svgs/wishlist.svg';
import CartSVG from '@/app/svgs/cart.svg';
import { AspectRatio } from '@mantine/core';

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

  return (
    <div className={styles.productContainer}>
      <Swiper
        // spaceBetween={0}
        slidesPerView={1}
        pagination={isSmallViewport ? { clickable: true } : false} // Use pagination if small viewport
        modules={[Pagination, Navigation]}
        navigation={!isSmallViewport}
        loop={true}
        className={styles.swiperContainer}
        //  lazy={false} // Disable Swiper's lazy loading
        watchSlidesProgress={true}
      >
        {images
          .filter((imageSrc) => !imageSrc.includes('.mp4'))
          .map((imageSrc, index) => (
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9', // Adjust based on your images
                // Or use a specific height if you prefer:
                // height: '400px'
              }}
            >
              <SwiperSlide key={imageSrc}>
                <Image
                  src={imageSrc}
                  alt={`${productTitle} - Image ${index + 1}`}
                  // width={1920}
                  // height={1080}
                  // style={{
                  //   width: '100%',
                  //   height: 'auto',
                  // }}
                  sizes={imageSizes}
                  className={styles.productImage}
                  fill
                  // Critical fixes:
                  // loading={index < 2 ? 'eager' : 'lazy'} // Load first 2 eagerly
                  // quality={85} // Optimize quality vs size
                  // unoptimized={false} // Ensure optimization is on
                  style={{
                    objectFit: 'contain', // Maintains aspect ratio, shows full image
                    // or objectFit: 'cover' // Fills container, may crop
                  }}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  priority={index === 0}
                />
              </SwiperSlide>
            </div>
          ))}
      </Swiper>

      <div className={styles.productDetailsContainer}>
        <div className={styles.textContainer}>
          <span className={styles.productTitle}>{productTitle}</span>
          <span className={styles.productPrice}>₹{productPrice}</span>
        </div>
        <div className={styles.buyContainer}>
          <div className={styles.wishlistSvgContainer}>
            <Image src={WishlistSVG} alt="Cart" width={20} height={20} />
          </div>
          <div className={styles.bagSvgContainer}>
            <Image src={CartSVG} alt="Cart" width={20} height={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
