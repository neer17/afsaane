'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import styles from './SlidingBanner.module.css';

const SlidingBanner = () => {
  const textItems = [
    'Welcome to our website!',
    'Discover amazing products.',
    'Enjoy seamless shopping.',
    'Contact us for more info.',
  ];

  return (
    <div className={styles.slidingBannerContainer}>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        speed={1000}
        className="text-swiper"
      >
        {textItems.map((text, index) => (
          <SwiperSlide key={index}>
            <div className={styles.textContainer}>{text}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SlidingBanner;
