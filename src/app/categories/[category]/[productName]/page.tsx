// TODO: make a separate component for these images so that the page can be SSR
'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import CartSVG from '@/app/svgs/cart.svg';

import { dummyProducts, images } from '@/app/helpers/constants';
import ScrollbarCarouselCards from '@/components/card/ScrollbarCarouselCards';
import RegularCard from '@/components/card/Card';
import SlidePopup from '@/components/slide_popup/SlidePopup';
import CartProvider, { useCart } from '@/providers/CartProvider';
import ExpandableContainer from '@/components/containers/ExpandableContainer';

const price = 6000;
const colorInfo = 'Black & Oatmeal Stripes';
const materialInfo = '100% Organic Cotton Knit';
const deliveryDate = '2024-11-20';

const dummyCartData = {
  id: '123',
  name: 'Test Product',
  category: 'Test',
  imageUrl: images[0],
  quantity: 1,
  price: 1000
}

export default function ProductDetails() {
  const [showCartPopup, setShowCartPopup] = useState<boolean>(false);

  const handleAddToCart = () => {
    toggleCartPopup();
  };

  const toggleCartPopup = () => {
    setShowCartPopup(!showCartPopup);
  };

  return (
    <div className={styles.productDetailsContainer}>
      <div className={styles.imageAndProductDetails}>
        {/* Will be visible on bigger screens > 1024px */}
        <div className={styles.imageContainerOnLargerScreens}>
          <div className={styles.imageContainerOnLargerScreensGrid}>
            {images.slice(0, 2).map((imageSrc) => {
              return (
                <div className={styles.imageWrapperGridItem} key={imageSrc}>
                  <Image
                    width={0}
                    height={0}
                    sizes="(min-width: 1024px) 100vw, 50vw"
                    alt="Product Image"
                    src={imageSrc}
                  />
                </div>
              );
            })}
          </div>
          <div className={styles.shippingDetailsOnLargerScreenGrid}>
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
          <div className={styles.imageContainerOnLargerScreensGridSecond}>
            {images.slice(2, 5).map((imageSrc) => {
              return (
                <div className={styles.imageWrapperGridItem} key={imageSrc}>
                  <Image
                    width={0}
                    height={0}
                    sizes="(min-width: 1024px) 100vw, 50vw"
                    alt="Product Image"
                    src={imageSrc}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Will be visible for smaller screens < 1024px */}
        {/* TODO: Make this a type of card */}
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
              Sober and sophisticated in equal measure, the Stripe Front Sweater stands out all day long. Its comfy fit
              and clean lines can do it all - from a hot drink on a cold night to a sunny afternoon picnic.
            </h4>
          </div>
          <div className={styles.priceDetails}>
            <p>
              MRP <span>{price}</span> inclusive of all taxes
            </p>
          </div>
          <div className={styles.colorDetails}>
            <p>
              Color: <span>{colorInfo}</span>
            </p>
          </div>
          <div className={styles.relatedDetails}>
            <p>
              Material: <span>{materialInfo}</span>
            </p>
          </div>

          {/* Button for larger screens */}
          <CartProvider>
            <AddToCartButton onClickCallback={handleAddToCart} />
          </CartProvider>

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

          {/* Product Details */}
          <div className={styles.productDetails}>
            <ExpandableContainer
              title={'Product Details'}
              contents={[
                '100% Organic cotton yarn in black and oatmeal keeps you snug',
                '100% Organic cotton yarn in black and oatmeal keeps you snug and comfy',
              ]}
              isExpandable
              isExpandedInitially
            >
              <ExpandableContainer
                title={'Size & Fit'}
                contents={['Fit: Slim fit', 'Fit: Regular']}
                isExpandable={false}
                isExpandedInitially
              />
              <ExpandableContainer
                title={'Details'}
                contents={['Gentle wash and care']}
                isExpandable={false}
                isExpandedInitially
              />
            </ExpandableContainer>
          </div>

          {/* Delivery and Payment */}
          <ExpandableContainer
            title={'Delivery Details'}
            contents={[
              '100% Organic cotton yarn in black and oatmeal keeps you snug',
              '100% Organic cotton yarn in black and oatmeal keeps you snug and comfy',
            ]}
            isExpandable
          />

          {/* Return & Exchange */}
          <ExpandableContainer
            title={'Return & Exchange'}
            contents={[
              '100% Organic cotton yarn in black and oatmeal keeps you snug',
              '100% Organic cotton yarn in black and oatmeal keeps you snug and comfy',
            ]}
            isExpandable
          />
        </div>
      </div>

      {/* TODO: Lazy load this */}

      {/* For larger screen */}
      <div className={styles.moreProductsLargerScreen}>
        <h1>More from this collection</h1>
        <div className={styles.moreProductsCardsWrapper}>
          {images.map((value) => (
            <div className={styles.moreProductsCardContainer} key="Image name">
              <RegularCard
                productDescription="SeggsY tshirt"
                price={1000}
                sizes="20vw"
                imageName="Image name"
                imageSrc={value}
              />
            </div>
          ))}
        </div>
      </div>

      {/* For smaller screen */}
      <div className={styles.moreProductsSmallerScreen}>
        <h1>More from this collection</h1>
        <ScrollbarCarouselCards products={dummyProducts} />
      </div>

      {/* Cart popup */}
      <CartProvider>
        <SlidePopup isOpen={showCartPopup} backdropClickCallback={handleAddToCart} />
      </CartProvider>
    </div>
  );
}

// Components used in the above page

type AddToCartButtonProps = {
  onClickCallback: () => void;
};
const AddToCartButton: React.FC<AddToCartButtonProps> = ({ onClickCallback }) => {
  'use client';

  const { setCartData } = useCart();

  return (
    <button
      className={styles.buttonForLargerScreen}
      onClick={() => {
        setCartData(dummyCartData)

        onClickCallback();
      }}
    >
      Add to cart
    </button>
  );
};
