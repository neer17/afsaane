import React, { useEffect } from "react";
import styles from "./SlidePopup.module.css";
import CrossButton from "../buttons/Cross";
import { useCart } from "@/context/CartContext";
import CartProductCard from "../card/CartProductCard";
import { useRouter } from "next/navigation";

interface SlidePopupProps {
	isOpen: boolean;
	backdropClickCallback: () => void;
}

const SlidePopup: React.FC<SlidePopupProps> = ({
	isOpen,
	backdropClickCallback,
}) => {
	const {
		cartData,
		setCartData,
		deleteCartData,
		removeCartData,
		getTotalPrice,
	} = useCart();

	const router = useRouter();

	useEffect(() => {
		if (isOpen) {
			document.body.classList.add("no-scroll");
		} else {
			document.body.classList.remove("no-scroll");
		}

		return () => {
			document.body.classList.remove("no-scroll");
		};
	}, [isOpen]);

	const handleDeleteCartItem = async (itemId: string) => {
		await deleteCartData(itemId);
	};

	const handleIncrementItemQuantity = async (id: string) => {
		const item = cartData.get(id);
		if (item === undefined) {
			console.error(`Item does not exists for id: ${id}`);
			return;
		}

		await setCartData(item);
	};

	const handleDecrementItemQuantity = async (itemId: string) => {
		await removeCartData(itemId);
	};

	const navigateToCheckoutPage = () => {
		router.push("/checkout");
	};

	useEffect(() => {
		console.info("Cart data changed:", cartData);
	}, [cartData]);

	return (
		<>
			{isOpen && (
				<div
					className={styles.overlay}
					aria-hidden="true"
					onClick={backdropClickCallback}
				/>
			)}
			<div
				className={`${styles.slidePanel} ${isOpen ? styles.open : ""}`}
				aria-expanded={isOpen}
			>
				<div className={styles.panelHeader}>
					<h1>Cart</h1>
					<div>
						<CrossButton onClickCallback={backdropClickCallback} />
					</div>
				</div>

				<div className={styles.productsList}>
					{Array.from(cartData.values()).map(
						({
							id,
							name,
							price,
							quantity,
							images,
							category,
							slug,
							material,
							description,
						}) => (
							<CartProductCard
								key={id}
								id={id}
								name={name}
								price={price}
								quantity={quantity}
								images={images}
								slug={slug}
								material={material}
								description={description}
								category={category}
								incrementCallback={handleIncrementItemQuantity}
								decrementCallback={handleDecrementItemQuantity}
								deleteCartItem={handleDeleteCartItem}
								imageSizes="10vw"
							/>
						),
					)}
				</div>

				<div className={styles.checkoutContainer}>
					<div className={styles.checkoutButton}>
						<button onClick={navigateToCheckoutPage}>
							Checkout
						</button>
						<span>.</span>
						<span>{getTotalPrice()}</span>{" "}
					</div>
				</div>
			</div>
		</>
	);
};

export default SlidePopup;
