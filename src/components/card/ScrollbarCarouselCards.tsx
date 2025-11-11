import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import styles from './ScrollbarCarouselCards.module.css';
import Image from 'next/image';
import { Product } from '@/app/helpers/types';
import { v4 as uuid } from 'uuid';

interface ScrollbarCarouselCardsProps {
  products: Product[];
}

const ScrollbarCarouselCards: React.FC<ScrollbarCarouselCardsProps> = ({
  products,
}) => {
  // CHANGE: Initialize Embla carousel with responsive options
  const [emblaRef] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    breakpoints: {
      '(min-width: 640px)': { slidesToScroll: 2 },
      '(min-width: 768px)': { slidesToScroll: 3 },
      '(min-width: 1024px)': { slidesToScroll: 4 },
    }
  });

  console.info({
    products
  })

  return (
    <div className={styles.carouselContainer}>
      {/* CHANGE: Replace Swiper with Embla carousel structure */}
      <div className={styles.emblaContainer} ref={emblaRef}>
        <div className={styles.emblaSlides}>
          {products.map((product) => (
            <div className={styles.emblaSlide} key={uuid()}>
              <div className={styles.productCard}>
                <div className={styles.productImage}>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={0}
                    height={0}
                    sizes={product.imageSizes}
                  />
                </div>
                <div className={styles.productInfo}>
                  <h3>{product.name}</h3>
                  <p className={styles.price}>{product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* CHANGE: Add custom scrollbar indicator */}
      <div className={styles.scrollbarContainer}>
        <div className={styles.scrollbarTrack}>
          <div className={styles.scrollbarThumb}></div>
        </div>
      </div>
    </div>
  );
};

export default ScrollbarCarouselCards;