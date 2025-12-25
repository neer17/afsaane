"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { useParams } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import CartSVG from "@/app/svgs/cart.svg";

import ScrollbarCarouselCards from "@/components/card/ScrollbarCarouselCards";
import RegularCard from "@/components/card/Card";
import SlidePopup from "@/components/slide_popup/SlidePopup";
import ExpandableContainer from "@/components/containers/ExpandableContainer";
import { Product } from "@/utils/types";
import { API_ENDPOINTS } from "@/utils/constants";

export default function ProductDetails() {
	const params = useParams();
	const slug = params.productName as string;

	const [product, setProduct] = useState<Product | null>(null);
	const [productCollectionId, setProductCollectionId] = useState<
		string | null
	>(null);
	const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
	const [showCartPopup, setShowCartPopup] = useState<boolean>(false);

	const [emblaRef] = useEmblaCarousel({
		loop: false,
		align: "start",
		slidesToScroll: 1,
		containScroll: "trimSnaps",
	});

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${API_ENDPOINTS.PRODUCTS.URL}?slug=${slug}`,
				);
				const { data } = await response.json();
				if (!data) return;

				const [product] = data;
				setProduct(product);
				setProductCollectionId(product.collectionId);
			} catch (error) {
				console.error("Error fetching product:", error);
			}
		};

		fetchProduct();
	}, [slug]);

	useEffect(() => {
		const fetchSimilarProducts = async () => {
			try {
				// Fetch similar products based on collectionId
				const similarResponse = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${API_ENDPOINTS.PRODUCTS.URL}?collectionId=${productCollectionId}`,
				);
				const { data } = await similarResponse.json();
				if (!data) return;
				setSimilarProducts(data);
			} catch (error) {
				console.error("Error fetching product:", error);
			}
		};

		if (productCollectionId) fetchSimilarProducts();
	}, [productCollectionId]);

	const handleAddToCart = () => {
		toggleCartPopup();
	};

	const toggleCartPopup = () => {
		setShowCartPopup(!showCartPopup);
	};

	if (!product) {
		return <div>Loading...</div>;
	}

	console.info({
		product,
		productCollectionId,
		similarProducts,
	});

	return (
		<div className={styles.productDetailsContainer}>
			<div className={styles.imageAndProductDetails}>
				<div className={styles.imagesContainerOnLargeScreen}>
					<div className={styles.imagesGalleryOnLargeScreen}>
						{product.images?.map((image) => {
							return (
								<div key={image.id}>
									{image.url.includes(".mp4") ? (
										<video
											width={1920}
											height={1080}
											style={{
												width: "100%",
												height: "auto",
												objectFit: "cover",
											}}
											src={image.url}
											autoPlay
											muted
											loop
										/>
									) : (
										<Image
											width={1920}
											height={1080}
											style={{
												width: "100%",
												height: "auto",
											}}
											sizes="(max-width: 1024px) 100vw, 33.3vw"
											alt={image.alt}
											src={image.url}
										/>
									)}
								</div>
							);
						})}
					</div>
				</div>

				<div className={styles.imageContainerOnSmallScreens}>
					<div className={styles.emblaContainer} ref={emblaRef}>
						<div className={styles.emblaSlides}>
							{product.images?.map((image) => (
								<div
									className={styles.emblaSlide}
									key={image.id}
								>
									{image.url.includes(".mp4") ? (
										<video
											width={1920}
											height={1080}
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
											}}
											src={image.url}
											autoPlay
											muted
											loop
										/>
									) : (
										<Image
											src={image.url}
											alt={image.alt}
											fill
											sizes="(max-width: 1024px) 100vw, 50vw"
											className={styles.productImage}
										/>
									)}
								</div>
							))}
						</div>
					</div>
				</div>

				<div className={styles.detailsContainer}>
					<div className={styles.productDescription}>
						<h1>{product.name}</h1>
						<h4>{product.description}</h4>
					</div>
					<div className={styles.priceDetails}>
						<p>
							MRP <span>₹ {product.price}</span> inclusive of all
							taxes
						</p>
					</div>
					<div className={styles.colorDetails}>
						<p>
							Material: <span>{product.material}</span>
						</p>
					</div>

					<AddToCartButton onClickCallback={handleAddToCart} />

					<div className={styles.deliveryDetails}>
						<div>
							<Image
								src={CartSVG}
								width={25}
								height={25}
								alt="cart image"
							/>
							<div>
								<p>
									Free shipping on order above Rupee symbol
									1000
								</p>
							</div>
						</div>
						<div>
							<Image
								src={CartSVG}
								width={25}
								height={25}
								alt="cart image"
							/>
							<div>
								<p>Cash on Delivery(COD) available</p>
							</div>
						</div>
					</div>
					<div className={styles.shippingDetailsOnSmallerScreen}>
						{[
							{ svgSrc: CartSVG, text: "Easy Return" },
							{ svgSrc: CartSVG, text: "Easy Retur" },
							{ svgSrc: CartSVG, text: "Easy Retu" },
							{ svgSrc: CartSVG, text: "Easy Ret" },
						].map(({ svgSrc, text }) => (
							<div className={styles.box} key={text}>
								<Image
									src={svgSrc}
									width={20}
									height={20}
									alt={text}
								/>
								<p>{text}</p>
							</div>
						))}
					</div>

					<ExpandableContainer
						title={"Product Details"}
						contents={[
							"100% Organic cotton yarn in black and oatmeal keeps you snug",
							"100% Organic cotton yarn in black and oatmeal keeps you snug and comfy",
						]}
						isExpandable
						isExpandedInitially
					>
						<ExpandableContainer
							title={"Size & Fit"}
							contents={["Fit: Slim fit", "Fit: Regular"]}
							isExpandable={false}
							isExpandedInitially
						/>
						<ExpandableContainer
							title={"Details"}
							contents={["Gentle wash and care"]}
							isExpandable={false}
							isExpandedInitially
						/>
					</ExpandableContainer>

					<ExpandableContainer
						title={"Delivery Details"}
						contents={[
							"100% Organic cotton yarn in black and oatmeal keeps you snug",
							"100% Organic cotton yarn in black and oatmeal keeps you snug and comfy",
						]}
						isExpandable
					/>

					<ExpandableContainer
						title={"Return & Exchange"}
						contents={[
							"100% Organic cotton yarn in black and oatmeal keeps you snug",
							"100% Organic cotton yarn in black and oatmeal keeps you snug and comfy",
						]}
						isExpandable
					/>
				</div>
			</div>
			<div className={styles.moreProductsLargerScreen}>
				<h1>More from this collection</h1>
				<div className={styles.moreProductsCardsWrapper}>
					{similarProducts
						?.filter(
							(product) =>
								product.images && product.images.length > 0,
						)
						?.map((similarProduct) => similarProduct.images[0])
						?.map((image) => (
							<div
								className={styles.moreProductsCardContainer}
								key={image.id}
							>
								<RegularCard
									productDescription={product.description}
									price={product.price}
									sizes="20vw"
									imageName={product.name}
									imageSrc={image.url}
								/>
							</div>
						))}
				</div>
			</div>

			<div className={styles.moreProductsSmallerScreen}>
				<h1>More from this collection</h1>
				<ScrollbarCarouselCards
					products={similarProducts}
					imageSizes="(min-width: 768px) 100vw 50vw"
				/>
			</div>

			<SlidePopup
				isOpen={showCartPopup}
				backdropClickCallback={handleAddToCart}
			/>
		</div>
	);
}

type AddToCartButtonProps = {
	onClickCallback: () => void;
};
const AddToCartButton: React.FC<AddToCartButtonProps> = ({
	onClickCallback,
}) => {
	"use client";

	return (
		<button
			className={styles.buttonForLargerScreen}
			onClick={() => {
				// for (let i = 0; i < 5; i++) {
				//   setCartData({
				//     id: i.toString(),
				//     name: "Test Product",
				//     category: "Test",
				//     images: [],
				//     quantity: 1,
				//     price: 1000,
				//   });
				// }
				onClickCallback();
			}}
		>
			Add to cart
		</button>
	);
};
