import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';
import styles from './ScrollbarCarouselCards.module.css';
import 'swiper/css';
import 'swiper/css/scrollbar';
import Image from 'next/image';
import { Product } from '@/app/helpers/types';
import { v4 as uuid } from 'uuid';

interface ScrollbarCarouselCardsProps {
  products: Product[];
}

const ScrollbarCarouselCards: React.FC<ScrollbarCarouselCardsProps> = ({
  products,
}) => {
  return (
    <div className={styles.carouselContainer}>
      <Swiper
        className={styles.swiperContainer}
        modules={[Scrollbar]}
        spaceBetween={20}
        slidesPerView={1.2}
        scrollbar={{
          hide: false,
          draggable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={uuid()}>
            <div className={styles.productCard}>
              <div className={styles.productImage}>
                <Image
                  src={product.imageSrc}
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
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ScrollbarCarouselCards;
