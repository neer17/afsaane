"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./page.module.css";
import CheckoutForm from "@/components/forms/CheckoutForm";
import { DeliveryFormRef } from "@/components/forms/CheckoutForm";
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
import { API_ENDPOINTS } from "@/utils/constants";
import {
  saveCheckoutState,
  loadCheckoutState,
  clearCheckoutState,
} from "@/utils/idb/checkout_idb";

export default function Checkout() {
  const { cartData, deleteCartData, getTotalPrice, getTotalQuantity } =
    useCart();
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<string>();

  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);

  const [isVerificationCodeVerified, setIsVerificationCodeVerified] =
    useState(false);

  const [otpRequestTimeoutError, setOtpRequestTimeoutError] =
    useState<string>();

  // Timer state
  const [otpExpiryTime, setOtpExpiryTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Loading state for IDB operations
  const [isStateLoaded, setIsStateLoaded] = useState(false);

  const isSmallerThan1024 = useMediaQuery("(max-width: 1025px)");

  // Create ref for the CheckoutForm
  const formRef = useRef<DeliveryFormRef>(null);

  // Load saved state on mount
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedState = await loadCheckoutState();
        if (savedState) {
          setIsVerificationCodeSent(savedState.isVerificationCodeSent);
          setIsVerificationCodeVerified(savedState.isVerificationCodeVerified);
          setOtpExpiryTime(savedState.otpExpiryTime);
          setTimeRemaining(savedState.timeRemaining);

          // Set form data in the form ref if available
          if (formRef.current && savedState.formData) {
            formRef.current.setFormData(
              savedState.formData,
              savedState.useDifferentBilling,
            );
          }
        }
      } catch (error) {
        console.error("Failed to load saved checkout state:", error);
      } finally {
        setIsStateLoaded(true);
      }
    };

    loadSavedState();
  }, []);

  // Save state whenever relevant state changes
  useEffect(() => {
    if (!isStateLoaded) return;

    const saveState = async () => {
      if (formRef.current) {
        const formData = formRef.current.getFormData();
        const useDifferentBilling = formRef.current.getUseDifferentBilling();

        await saveCheckoutState(
          { ...formData },
          isVerificationCodeSent,
          isVerificationCodeVerified,
          otpExpiryTime,
          timeRemaining,
          useDifferentBilling,
        );
      }
    };

    saveState();
  }, [
    isVerificationCodeSent,
    isVerificationCodeVerified,
    otpExpiryTime,
    timeRemaining,
    isStateLoaded,
  ]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (otpExpiryTime && timeRemaining > 0) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((otpExpiryTime - now) / 1000));
        setTimeRemaining(remaining);

        if (remaining === 0) {
          setOtpExpiryTime(null);
          setIsVerificationCodeSent(false);
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [otpExpiryTime, timeRemaining]);

  // Clear state on successful payment or when leaving
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Don't clear on page refresh, only on navigation away
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && formRef.current) {
        // Save current state when tab becomes hidden
        const formData = formRef.current.getFormData();
        const useDifferentBilling = formRef.current.getUseDifferentBilling();

        saveCheckoutState(
          { ...formData },
          isVerificationCodeSent,
          isVerificationCodeVerified,
          otpExpiryTime,
          timeRemaining,
          useDifferentBilling,
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    isVerificationCodeSent,
    isVerificationCodeVerified,
    otpExpiryTime,
    timeRemaining,
  ]);

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

  // TODO: remove
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const applyDiscountCode = async (
    discountCode: string | undefined,
  ): Promise<any> => {
    if (!discountCode) return;

    // Validate input parameters
    if (!discountCode || discountCode.trim().length === 0) {
      throw new Error("Discount code is required");
    }

    const DISCOUNT_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.APPLY_DISCOUNT_CODE.URL}`;
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
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const handleSendOtp = async (phoneNumber: string): Promise<void> => {
    if (!phoneNumber) return Promise.reject();

    // Validate input parameters
    if (!phoneNumber || phoneNumber.trim().length !== 10) {
      throw new Error("Phone number should be 10 digits long");
    }

    const SEND_OTP_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.SEND_OTP.URL}`;
    const response = await fetch(SEND_OTP_ENDPOINT, {
      method: API_ENDPOINTS.SEND_OTP.METHOD,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: `91${phoneNumber}`, // TODO: FO how to make it dynamic
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Show error message to wait certain minutes before requesting for OTP again
      if (
        response.status == 400 &&
        String(errorData.error).includes("Please wait")
      ) {
        setOtpRequestTimeoutError(errorData.error);
      }

      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`,
      );
    }

    // Update state on success - start 2 minute timer
    const expiryTime = Date.now() + 2 * 60 * 1000; // 2 minutes from now
    setOtpExpiryTime(expiryTime);
    setTimeRemaining(120); // 2 minutes in seconds
    setIsVerificationCodeSent(true);

    return response.json();
  };

  const handleOtpVerification = async (
    phoneNumber: string,
    verificationCode: string,
  ): Promise<void> => {
    if (!verificationCode || !phoneNumber)
      throw new Error("Verification code and phone number should be present");

    // Validate input parameters
    if (!verificationCode || verificationCode.trim().length !== 6) {
      throw new Error("verification code should be 6 digits long");
    }

    const VERIFY_OTP_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.VERIFY_OTP.URL}`;
    const response = await fetch(VERIFY_OTP_ENDPOINT, {
      method: API_ENDPOINTS.VERIFY_OTP.METHOD,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: `91${phoneNumber}`,
        otp: verificationCode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    // Update state on success - clear timer
    setIsVerificationCodeVerified(true);
    setOtpExpiryTime(null);
    setTimeRemaining(0);

    return response.json();
  };

  const handleOtpExpired = () => {
    setIsVerificationCodeSent(false);
    setOtpExpiryTime(null);
    setTimeRemaining(0);
  };

  const handlePayNow = async (data: any) => {
    console.log("Payment data:", data);
    await clearCheckoutState();
    // Implement your payment processing logic here
  };

  // Submit form from parent
  const handleFormSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  // Don't render until state is loaded
  if (!isStateLoaded) {
    return (
      <SupabaseAuthProvider>
        <div className={styles.container}>
          <Paper p="xl" pb={50}>
            <Text>Loading...</Text>
          </Paper>
        </div>
      </SupabaseAuthProvider>
    );
  }

  return (
    <SupabaseAuthProvider>
      <div className={styles.container}>
        <Paper p="xl" pb={50}>
          <Grid overflow="hidden">
            <Grid.Col span={{ base: 12, lg: 7 }}>
              <CheckoutForm
                ref={formRef}
                isVerificationCodeSent={isVerificationCodeSent}
                isVerificationCodeVerified={isVerificationCodeVerified}
                sendOtpCallback={handleSendOtp}
                verifyOtpCallback={handleOtpVerification}
                onPayNow={handlePayNow}
                otpExpiryTime={otpExpiryTime}
                timeRemaining={timeRemaining}
                onOtpExpired={handleOtpExpired}
                otpRequestTimeoutError={otpRequestTimeoutError}
              />
              {!isSmallerThan1024 && (
                <Group mt={32}>
                  <Button
                    type="button"
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
                    ({
                      id,
                      name,
                      price,
                      quantity,
                      category,
                      images,
                      slug,
                      material,
                      description,
                    }) => (
                      <CartProductCard
                        key={id}
                        id={id}
                        name={name}
                        price={price}
                        slug={slug}
                        material={material}
                        description={description}
                        images={images}
                        quantity={quantity}
                        category={category}
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
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              width: "calc(100% - 32px)",
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
