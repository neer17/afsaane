import ProductCard from '@/components/productCard/ProductCard';
import React from 'react';
import styles from './page.module.css';

// type Props = {
//   params: {
//     dynamicName: string;
//   };
// };

const ProductCatalog = () => {
  // const { dynamicName } = params;

  const products = [
    {
      productTitle: 'Stripefront sweater - Olive',
      imageSizes: '(max-width: 1024px) 50vw, 25vw;',
      productPrice: 5000,
      imageSrc:
        'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1440&h=1440&dpr=2',
    },
    {
      productTitle: 'Cable-knit sweater - Blue',
      imageSizes: '(max-width: 1024px) 50vw, 25vw;',
      productPrice: 6000,
      imageSrc:
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1440&h=1440&dpr=2',
    },
    {
      productTitle: 'Classic hoodie - Black',
      imageSizes: '(max-width: 1024px) 50vw, 25vw;',
      productPrice: 7000,
      imageSrc:
        'https://images.pexels.com/photos/775219/pexels-photo-775219.jpeg?auto=compress&cs=tinysrgb&w=1440&h=1440&dpr=2',
    },
    {
      productTitle: 'Denim jacket - Light Wash',
      imageSizes: '(max-width: 1024px) 50vw, 25vw;',
      productPrice: 8000,
      imageSrc:
        'https://images.pexels.com/photos/1192601/pexels-photo-1192601.jpeg?auto=compress&cs=tinysrgb&w=1440&h=1440&dpr=2',
    },
    {
      productTitle: 'Leather jacket - Brown',
      imageSizes: '(max-width: 1024px) 50vw, 25vw;',
      productPrice: 10000,
      imageSrc:
        'https://images.pexels.com/photos/1292998/pexels-photo-1292998.jpeg?auto=compress&cs=tinysrgb&w=1440&h=1440&dpr=2',
    },
    {
      productTitle: 'Bomber jacket - Green',
      imageSizes: '(max-width: 1024px) 50vw, 25vw;',
      productPrice: 8500,
      imageSrc:
        'https://images.pexels.com/photos/2306774/pexels-photo-2306774.jpeg?auto=compress&cs=tinysrgb&w=1440&h=1440&dpr=2',
    },
    {
      productTitle: 'Oversized T-shirt - White',
      imageSizes: '(max-width: 1024px) 50vw, 25vw;',
      productPrice: 3000,
      imageSrc:
        'https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=1440&h=1440&dpr=2',
    },
  ];

  return (
    <div className={styles.productCatalogContainer}>
      <div className={styles.productsContainer}>
        {products.map(({ productTitle, productPrice, imageSizes }) => (
          <ProductCard
            key={productTitle}
            images={products.map((value) => value.imageSrc)}
            productTitle={productTitle}
            imageSizes={imageSizes}
            productPrice={productPrice}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;
