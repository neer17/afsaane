"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import styles from "./SlidingBanner.module.css";

const SlidingBanner = () => {
	const textItems = [
		"Welcome to our website!",
		"Discover amazing products.",
		"Enjoy seamless shopping.",
		"Contact us for more info.",
	];

	const [emblaRef] = useEmblaCarousel(
		{
			loop: true,
			duration: 8000,
		},
		[Autoplay({ delay: 2000, stopOnInteraction: false })],
	);

	return (
		<div className={styles.slidingBannerContainer}>
			<div className={styles.embla} ref={emblaRef}>
				<div className={styles.emblaContainer}>
					{textItems.map((text, index) => (
						<div key={index} className={styles.emblaSlide}>
							<div className={styles.textContainer}>{text}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default SlidingBanner;
