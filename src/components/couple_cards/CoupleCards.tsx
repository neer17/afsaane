import React from "react";
import Image from "next/image";
import styles from "./CoupleCards.module.css";

interface CoupleCardsProps {
	image: string;
	altText: string;
	texts: string[];
	doReverse?: boolean;
}

const CoupleCards: React.FC<CoupleCardsProps> = ({
	image,
	altText,
	texts,
	doReverse,
}) => {
	return (
		<div
			className={`${styles.coupleCardsContainer} ${doReverse ? styles.coupleCardsContainerReverse : ""}`}
		>
			{image && (
				<div className={styles.imageContainer}>
					<Image
						alt={altText}
						src="https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1440&h=1440&dpr=2"
						sizes="(max-width: 1024px) 100vw, 50vw"
						width={0}
						height={0}
					/>
				</div>
			)}
			<div className={styles.textContainer}>
				{texts.map((text, index) => (
					<span key={index} className={styles.textItem}>
						{text}
					</span>
				))}
			</div>
		</div>
	);
};

export default CoupleCards;
