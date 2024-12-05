// components/ProductCarousel.js
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';
import styles from './Card.module.css';
import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Image from 'next/image';

const products = [
  {
    id: 1,
    image:
      'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1440&h=1440&dpr=2',
    name: 'Wireless Headphones',
    price: '$129.99',
  },
  {
    id: 2,
    image:
      'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1440&h=1440&dpr=2',
    name: 'Smart Watch',
    price: '$199.99',
  },
  {
    id: 3,
    image:
      'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1440&h=1440&dpr=2',
    name: 'Bluetooth Speaker',
    price: '$79.99',
  },
  {
    id: 4,
    image:
      'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1440&h=1440&dpr=2',
    name: 'Laptop Pro',
    price: '$999.99',
  },
  {
    id: 5,
    image:
      'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1440&h=1440&dpr=2',
    name: 'Gaming Mouse',
    price: '$59.99',
  },
  {
    id: 6,
    image:
      'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1440&h=1440&dpr=2',
    name: 'Mechanical Keyboard',
    price: '$149.99',
  },
];

const ProductCarousel = () => {
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
          <SwiperSlide key={product.id}>
            <div className={styles.productCard}>
              <div className={styles.productImage}>
                <Image src={product.image} alt={product.name} width={0} height={0} sizes="(max-width: 768px) 100vw, 50vw" />
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

export default ProductCarousel;
