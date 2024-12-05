// TODO: make a separate component for these iamges os that the page can be SSR
'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import CartSVG from '@/app/svgs/cart.svg';

import { images } from '@/app/helpers/constants';
import Card from '@/components/similar_products/Card';
const price = 6000;
const colorInfo = 'Black & Oatmeal Stripes';
const materialInfo = '100% Organic Cotton Knit';
const deliveryDate = '2024-11-20';

export default function ProductDetails() {
  const [isProductDetailsExpanded, setIsProductDetailsExpanded] = useState<boolean>(true);

  const getProductSeeMoreText = () => {
    return isProductDetailsExpanded ? 'See less' : 'See more';
  };

  return (
    <div className={styles.productDetailsContainer}>
      <div className={styles.imageAndProductDetails}>
        {/* Will be visible on bigger screens > 1024px */}
        <div className={styles.imageContainerOnLargerScreens}>
          {images.map((imageSrc) => {
            return (
              <div className={styles.imageWrapper} key={imageSrc}>
                <Image width={0} height={0} sizes="(min-width: 1024px) 100vw, 50vw" alt="Product Image" src={imageSrc} />
              </div>
            );
          })}
        </div>

        {/* Will be visible for smaller screens < 1024px */}
        <div className={styles.imageContainerOnSmallScreens}>
          <Swiper spaceBetween={0} slidesPerView={1.1} className={styles.swiperContainer}>
            {images.map((imageSrc, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={imageSrc}
                  alt={`Product Image ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={styles.productImage}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className={styles.detailsContainer}>
          <div className={styles.productDescription}>
            <h1>Stripefront Sweater - Black & Oatmeal Stripes</h1>
            <h4>
              Sober and sophisticated in equal measure, the Stripe Front Sweater stands out all day long. Its comfy fit and
              clean lines can do it all - from a hot drink on a cold night to a sunny afternoon picnic.
            </h4>
          </div>
          <div className={styles.priceDetails}>
            <p>
              MRP <span>{price}</span> inclusive of all taxes
            </p>
          </div>
          <div className={styles.relatedDetails}>
            <p>
              Color: <span>{colorInfo}</span>
            </p>
          </div>
          <div className={styles.relatedDetails}>
            <p>
              Material: <span>{materialInfo}</span>
            </p>
          </div>
          <div className={styles.deliveryDetails}>
            <div>
              <Image src={CartSVG} width={25} height={25} alt="cart image" />

              <div>
                <p>Expect delivery by {deliveryDate}</p>
                <p>Free shipping on order above Rupee symbol 1000</p>
              </div>
            </div>
            <div>
              <Image src={CartSVG} width={25} height={25} alt="cart image" />

              <div>
                <p>Cash on Delivery(COD) available</p>
              </div>
            </div>
          </div>
          <div className={styles.shippingDetailsOnSmallerScreen}>
            {[
              { svgSrc: CartSVG, text: 'Easy Returns' },
              { svgSrc: CartSVG, text: 'Easy Returns' },
              { svgSrc: CartSVG, text: 'Easy Returns' },
              { svgSrc: CartSVG, text: 'Easy Returns' },
            ].map(({ svgSrc, text }) => (
              <div className={styles.box} key={text}>
                <Image src={svgSrc} width={20} height={20} alt={text} />
                <p>{text}</p>
              </div>
            ))}
          </div>

          <div className={styles.productDetails}>
            <div className={styles.fixedContainer}>
              <h1 className={styles.productDetailsHeading}>Product Details</h1>
              <a onClick={() => setIsProductDetailsExpanded(!isProductDetailsExpanded)}>{getProductSeeMoreText()}</a>
            </div>

            <div className={isProductDetailsExpanded ? styles.expandableContainerExpanded : styles.expandableContainer}>
              <div>
                <ul>
                  <li>100% Organic cotton yarn in black and oatmeal keeps you snug and comfy</li>
                  <li>100% Organic cotton yarn in black and oatmeal keeps you snug and comfy</li>
                </ul>
              </div>

              <div className={styles.detailsLabel}>
                <h1 className={styles.productDetailsHeading}>Size & Fit</h1>
                <ul>
                  <li>Fit: Regular</li>
                  <li>Fit: Regular</li>
                </ul>
              </div>

              <div className={styles.detailsLabel}>
                <h1 className={styles.productDetailsHeading}>Care Instructions</h1>
                <p>Hentle machine wash with similar, do not rinse yada yada yada</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.moreProducts}>
        <h1>More from this collection</h1>
        <Card />
      </div>
    </div>
  );
}
