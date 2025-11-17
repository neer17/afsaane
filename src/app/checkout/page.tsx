"use client";

import React, { useRef } from "react";
import usePhoneAuth from "@/hooks/PhoneAuth";
import styles from "./page.module.css";
import GoogleOneTap from "@/components/auth/google_sign_in/GoogleOneTap";
import CheckoutForm, {
  DeliveryFormHandle,
} from "@/components/forms/CheckoutForm";
import Rupee from "@/components/symbols/Rupee";
import { useMediaQuery } from "@mantine/hooks";
import { AuthProvider as SupabaseAuthProvider } from "@/context/SupabaseAuthContext";

import {
  Paper,
  Grid,
  Box,
  Title,
  Stack,
  TextInput,
  Group,
  Text,
  Button,
} from "@mantine/core";
import { useCart } from "@/context/CartContext";
import CartProductCard from "@/components/card/CartProductCard";
import { API_ENDPOINTS } from "../helpers/constants";
import { useAuth } from "@/context/AuthContext";

export default function Checkout() {
  const { cartData, deleteCartData, getTotalPrice, getTotalQuantity } =
    useCart();
  const [appliedDiscountCode, setAppliedDiscountCode] =
    React.useState<string>();

  // const [isVerificationCodeSent, setIsVerificationCodeSent] =
  //   React.useState(false);

  // const [isVerificationCodeVerified, setIsVerificationCodeVerified] =
  //   React.useState(false);

  const isSmallerThan1024 = useMediaQuery("(max-width: 1025px)");
  const formRef = useRef<DeliveryFormHandle>(null);

  // const [sendVerificationCode, verifyCode] = usePhoneAuth(
  //   recaptchaSolvedCallback,
  // );

  const handleDeleteItem = async (id: string) => {
    await deleteCartData(id);
  };

  const handleDiscountCouponInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const discountCode = event.target.value;
    setAppliedDiscountCode(discountCode);
  };

  const handleApplyDiscountCoupon = async () => {
    await applyDiscountCode(appliedDiscountCode);
  };

  const applyDiscountCode = async (
    discountCode: string | undefined,
  ): Promise<any> => {
    if (!discountCode) return;

    // Validate input parameters
    if (!discountCode || discountCode.trim().length === 0) {
      throw new Error("Discount code is required");
    }

    const DISCOUNT_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}/${API_ENDPOINTS.APPLY_DISCOUNT_CODE.URL}`;
    console.info({
      DISCOUNT_ENDPOINT,
    });
    const response = await fetch(DISCOUNT_ENDPOINT, {
      method: API_ENDPOINTS.APPLY_DISCOUNT_CODE.METHOD,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discountCode: discountCode.trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  };

  // In prod this will not be needed as Firebase will handle this in the background in the paid plan
  function recaptchaSolvedCallback(response: string) {
    console.log("recaptchaSolvedCallback", response);
  }

  // const handleSendOtp = async (phoneNumber: string) => {
  //   await sendVerificationCode(
  //     phoneNumber,
  //     verificationCodeSentCallback,
  //     verificationCodeSentErrorCallback,
  //   );

  //   async function verificationCodeSentCallback() {
  //     console.log('verificationCodeSentCallback');
  //     setIsVerificationCodeSent(true);
  //   }

  //   function verificationCodeSentErrorCallback() {
  //     console.log('verificationCodeSentErrorCallback');
  //     setIsVerificationCodeSent(false);
  //     // TODO: Add a try again mechanism through the UI
  //   }
  // };

  // const handleVerificationCode = async (verificationCode: string) => {
  //   await verifyCode(
  //     verificationCode,
  //     verificationCodeSuccessCallback,
  //     verificationCodeErrorCallback,
  //   );

  //   function verificationCodeSuccessCallback() {
  //     console.log('verificationCodeSuccessCallback');
  //     setIsVerificationCodeVerified(true);
  //   }

  //   function verificationCodeErrorCallback() {
  //     console.log('verificationCodeErrorCallback');
  //     setIsVerificationCodeVerified(false);
  //   }
  // };

  console.info({
    cartData,
  });

  const handleFormSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const formValues = formRef.current?.submitForm();
    const productIds = cartData
      .values()
      .map((productDetails) => productDetails.id);
  };

  return (
    <SupabaseAuthProvider>
      <div className={styles.container}>
        <Box>{/* <GoogleOneTap /> */}</Box>

        <Paper p="xl" pb={50}>
          <Grid overflow="hidden">
            <Grid.Col span={{ base: 12, lg: 7 }}>
              <CheckoutForm
                ref={formRef}
                sendOtpCallback={() => {}}
                isVerificationCodeSent={true}
                isVerificationCodeVerified={true}
                verificationCodeEnteredCallback={() => {}}
              />
              {!isSmallerThan1024 && (
                <Group mt={32}>
                  <Button
                    type="submit"
                    size="md"
                    fullWidth
                    onClick={handleFormSubmit}
                  >
                    Pay Now
                  </Button>
                </Group>
              )}
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 5 }} p={{ base: 0, md: "md" }}>
              <Stack>
                <Title order={2}>Order Summary</Title>

                <Box
                  pl={0}
                  mb={32}
                  pr="sm"
                  style={{
                    overflowY: "auto",
                    maxHeight: "50vh",
                  }}
                >
                  {Array.from(cartData.values()).map(
                    ({ id, name, price, quantity, category, imageSrc }) => (
                      <CartProductCard
                        key={id}
                        id={id}
                        name={name}
                        price={price}
                        quantity={quantity}
                        category={category}
                        imageSrc={imageSrc}
                        isOrderSummaryCard
                        crossButtonWidth="10px"
                        crossButtonHeight="10px"
                        deleteCartItem={handleDeleteItem}
                      />
                    ),
                  )}
                </Box>

                <Box>
                  <Stack>
                    <Group justify="space-between">
                      <TextInput
                        flex={1}
                        placeholder="Discount code or gift card"
                        onChange={handleDiscountCouponInputChange}
                      />
                      <Button
                        disabled={!appliedDiscountCode}
                        onClick={handleApplyDiscountCoupon}
                      >
                        Apply
                      </Button>
                    </Group>
                    {/* {isDiscountCouponApplied && (
                    <Text color="green">Discount coupon applied</Text>
                  )} */}
                  </Stack>
                </Box>

                <Box mt={16}>
                  <Group justify="space-between" mb={16}>
                    <Text>Subtotal . {getTotalQuantity()}</Text>
                    <Text>{getTotalPrice()}</Text>
                  </Group>
                  <Group justify="space-between" mb={16}>
                    <Text>Shipping</Text>
                    <Text fw={700}>Free</Text>
                  </Group>

                  <Group justify="space-between" align="start">
                    <Text fw={700}>Total</Text>
                    <Stack align="end">
                      <Text fw={700}>
                        {<Rupee />}
                        {getTotalPrice()}
                      </Text>
                      <Text fw={700} size="xs">
                        Including {<Rupee />}10000 in taxes
                      </Text>
                    </Stack>
                  </Group>
                </Box>
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>
        {isSmallerThan1024 && (
          <Button
            style={{
              position: "fixed",
              bottom: 10, // 20px from bottom
              left: "50%",
              transform: "translateX(-50%)", // Center horizontally
              zIndex: 1000, // Ensure it stays on top of other content
              // Optional: Add width if needed
              width: "calc(100% - 32px)", // Full width minus margins
            }}
            onClick={handleFormSubmit}
          >
            Pay Now
          </Button>
        )}
      </div>
    </SupabaseAuthProvider>
  );
}
