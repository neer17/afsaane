"use client";

import { useState, useEffect } from "react";
import { Modal, TextInput, Button, Text, Divider, Box } from "@mantine/core";
import Image from "next/image";
import Google from "@/app/svgs/google.svg";
import styles from "./SignIn.module.css";
import { useAuth } from "@/context/SupabaseAuthContext";

interface SignInModalProps {
	sendOTPCallback: (phoneNumber: string) => void;
	inputChangeCallback: (input: string) => void;
	onClose: () => void;
}

export default function SignInModal({
	sendOTPCallback,
	inputChangeCallback,
	onClose,
}: SignInModalProps) {
	const [input, setInput] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { supabase } = useAuth();

	// Validate input whenever it changes
	useEffect(() => {
		// Check if input is a valid email
		const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

		// Check if input is a valid 10-digit phone number
		const isPhone = /^\d{10}$/.test(input);

		// Set validity based on either condition being true
		setIsValid(isEmail || isPhone);
	}, [input]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
		inputChangeCallback(e.target.value);
	};

	const handleGoogleSignIn = async () => {
		try {
			setIsLoading(true);
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
				},
			});

			if (error) {
				console.error("Google sign-in error:", error);
				throw error;
			}

			// The redirect will happen automatically, but we'll close the modal
			onClose();
		} catch (error) {
			console.error("Failed to sign in with Google:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal
			opened={true}
			onClose={onClose}
			centered
			size="md"
			padding="xl"
			radius="md"
			classNames={{
				body: styles.modalBody,
				header: styles.modalHeader,
			}}
			withCloseButton
		>
			<Box className={styles.container}>
				<Text className={styles.logo}>QALA CHOWK</Text>

				<Text className={styles.heading}>Hello there!</Text>

				<Text className={styles.subheading}>Sign in with</Text>

				<form className={styles.form}>
					<TextInput
						placeholder="Email ID / Mobile number"
						size="md"
						value={input}
						onChange={handleInputChange}
						classNames={{
							input: styles.input,
						}}
					/>

					<Button
						fullWidth
						size="lg"
						className={`${styles.continueButton} ${isValid ? styles.validButton : ""}`}
						variant="filled"
						disabled={!isValid}
						style={{
							backgroundColor: isValid ? "black" : undefined,
						}}
						onClick={() => sendOTPCallback(input)}
					>
						CONTINUE
					</Button>
				</form>

				<Divider
					label="or"
					labelPosition="center"
					my="xl"
					classNames={{
						label: styles.dividerLabel,
					}}
				/>

				<Button
					fullWidth
					size="lg"
					variant="outline"
					leftSection={
						<Image
							src={Google}
							width={20}
							height={20}
							alt="Google logo"
						/>
					}
					className={styles.googleButton}
					onClick={handleGoogleSignIn}
					loading={isLoading}
				>
					Continue with Google
				</Button>

				<Text className={styles.terms}>
					By signing in, you accept our{" "}
					<a href="#" className={styles.link}>
						T&Cs
					</a>{" "}
					and{" "}
					<a href="#" className={styles.link}>
						Privacy Policy
					</a>
					.
				</Text>
			</Box>
		</Modal>
	);
}
