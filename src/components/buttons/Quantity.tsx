import React from "react";
import styles from "./Quantity.module.css";

interface QuantityButtonProps {
	id: string;
	quantity: number;
	incrementCallback: (id: string) => void;
	decrementCallback: (id: string) => void;
}

const QuantityButton: React.FC<QuantityButtonProps> = ({
	id,
	quantity = 1,
	incrementCallback,
	decrementCallback,
}) => {
	return (
		<div className={styles.quantityButtonContainer}>
			<span onClick={() => incrementCallback(id)}>+</span>
			<h5>{quantity}</h5>
			<span onClick={() => decrementCallback(id)}>-</span>
		</div>
	);
};

export default QuantityButton;
