"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import styles from "./ProductCard.module.css";
import Image from "next/image";
import WishlistSVG from "@/app/svgs/wishlist.svg";
import CartSVG from "@/app/svgs/cart.svg";

interface ProductCardProps {
  slug: string;
  images: string[];
  productTitle: string;
  imageSizes: string;
  productPrice: number;
}

export default function ProductCard({
  slug,
  images,
  productTitle,
  imageSizes,
  productPrice,
}: ProductCardProps) {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: false,
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const filteredImages = images.filter(
    (imageSrc) => !imageSrc.includes(".mp4"),
  );

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  const navigateToProductDetailsPage = (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    e.preventDefault();
    router.push(`/categories/rings/${slug}`);
  };

  const handleDotClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    e.preventDefault();
    scrollTo(index);
  };

  const handleActionClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className={styles.productContainer}
      onClick={navigateToProductDetailsPage}
    >
      <div className={styles.imageContainer}>
        <div className={styles.embla} ref={emblaRef}>
          <div className={styles.emblaContainer}>
            {filteredImages.map((imageSrc, index) => (
              <div className={styles.emblaSlide} key={`${imageSrc}-${index}`}>
                <Image
                  src={imageSrc}
                  alt={`${productTitle} - Image ${index + 1}`}
                  width={1920}
                  height={1080}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                  sizes={imageSizes}
                  priority={index === 0}
                  className={styles.productImage}
                />
              </div>
            ))}
          </div>
        </div>

        {filteredImages.length > 1 && (
          <div className={styles.emblaDots}>
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={`${styles.emblaDot} ${
                  index === selectedIndex ? styles.emblaDotSelected : ""
                }`}
                type="button"
                onClick={(e) => handleDotClick(e, index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.productDetailsContainer}>
        <div className={styles.textContainer}>
          <span className={styles.productTitle}>{productTitle}</span>
          <span className={styles.productPrice}>₹{productPrice}</span>
        </div>
        <div className={styles.buyContainer} onClick={handleActionClick}>
          <div className={styles.wishlistSvgContainer}>
            <Image
              src={WishlistSVG}
              alt="Add to Wishlist"
              width={20}
              height={20}
            />
          </div>
          <div className={styles.bagSvgContainer}>
            <Image src={CartSVG} alt="Add to Cart" width={20} height={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
