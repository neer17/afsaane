"use client";

import {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Select,
  Button,
  Title,
  Grid,
  Stack,
  Radio,
  Box,
  Collapse,
  Group,
  Alert,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import styles from "./CheckoutForm.module.css";
import { IndianStatesList, API_ENDPOINTS } from "@/utils/constants";
import { useAuth } from "@/context/SupabaseAuthContext";
import { loadCheckoutState, saveCheckoutState } from "@/utils/idb/checkout.idb";

interface DeliveryFormProps {
  isVerificationCodeSent: boolean;
  isVerificationCodeVerified: boolean;
  sendOtpCallback: (phoneNumber: string) => Promise<void>;
  verifyOtpCallback: (
    phoneNumber: string,
    verificationCode: string,
  ) => Promise<void>;
  onPayNow: (data: DeliveryFormValues) => void;
  otpExpiryTime?: number | null;
  timeRemaining?: number;
  onOtpExpired?: () => void;
  otpRequestTimeoutError?: string;
}

export interface DeliveryFormValues {
  userId: string;
  country: string;
  shippingFirstName: string;
  shippingLastName: string;
  email: string;
  shippingAddress: string;
  shippingApartment?: string;
  shippingCity: string;
  shippingState: string;
  shippingPinCode: string;
  shippingPhone: string;
  billingFirstName?: string;
  billingLastName?: string;
  billingAddress?: string;
  billingApartment?: string;
  billingCity?: string;
  billingState?: string;
  billingPinCode?: string;
  billingPhone?: string;
  verificationCode?: string;
  isPhoneVerified: boolean;
}

// Export the ref type so parent can use it
export interface DeliveryFormRef {
  submitForm: () => void;
  getFormData: () => DeliveryFormValues;
  setFormData: (
    data: Partial<DeliveryFormValues>,
    useDifferentBilling: boolean,
  ) => void;
  getUseDifferentBilling: () => boolean;
}

const DeliveryForm = forwardRef<DeliveryFormRef, DeliveryFormProps>(
  (
    {
      isVerificationCodeSent = false,
      isVerificationCodeVerified = false,
      sendOtpCallback,
      verifyOtpCallback,
      onPayNow,
      timeRemaining = 0,
      otpRequestTimeoutError,
    },
    ref,
  ) => {
    const { user, logout } = useAuth();
    const [useDifferentBilling, setUseDifferentBilling] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);

    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isFormLoaded, setIsFormLoaded] = useState(false);

    // Use ref to track if we should skip saving (during initial load)
    const isLoadingRef = useRef(true);
    // Use ref to prevent double-loading in Strict Mode
    const hasLoadedRef = useRef(false);

    const form = useForm<DeliveryFormValues>({
      initialValues: {
        country: "India",
        shippingFirstName: "",
        shippingLastName: "",
        email: user?.email || "",
        shippingAddress: "",
        shippingApartment: "",
        shippingCity: "",
        shippingState: "",
        shippingPinCode: "",
        shippingPhone: "",
        billingFirstName: "",
        billingLastName: "",
        billingAddress: "",
        billingApartment: "",
        billingCity: "",
        billingState: "",
        billingPinCode: "",
        billingPhone: "",
        verificationCode: "",
        isPhoneVerified: false,
        userId: user?.id || "",
      },
      validate: {
        shippingFirstName: (v) =>
          v.trim().length < 2 ? "First name required" : null,
        shippingLastName: (v) =>
          v.trim().length < 2 ? "Last name required" : null,
        email: (v) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Valid email required",
        shippingAddress: (v) =>
          v.trim().length < 5 ? "Valid address required" : null,
        shippingCity: (v) =>
          v.trim().length < 2 ? "Valid city required" : null,
        shippingState: (v) => (!v ? "State required" : null),
        shippingPinCode: (v) =>
          /^\d{6}$/.test(v) ? null : "Valid 6 digit PIN required",
        shippingPhone: (v) =>
          /^\d{10}$/.test(v) ? null : "Valid 10 digit phone required",

        verificationCode: (v) =>
          isVerificationCodeSent && !isVerificationCodeVerified
            ? /^\d{6}$/.test(v || "")
              ? null
              : "Enter valid OTP"
            : null,

        // Billing validations only when different billing is chosen
        billingFirstName: (v) =>
          useDifferentBilling && v && v.trim().length < 2
            ? "Billing first name required"
            : null,
        billingLastName: (v) =>
          useDifferentBilling && v && v.trim().length < 2
            ? "Billing last name required"
            : null,
        billingAddress: (v) =>
          useDifferentBilling && v && v.trim().length < 5
            ? "Billing address required"
            : null,
        billingCity: (v) =>
          useDifferentBilling && v && v.trim().length < 2
            ? "Billing city required"
            : null,
        billingState: (v) =>
          useDifferentBilling && !v ? "Billing state required" : null,
        billingPinCode: (v) =>
          useDifferentBilling && v && !/^\d{6}$/.test(v)
            ? "Billing PIN must be 6 digits"
            : null,
        billingPhone: (v) =>
          useDifferentBilling && v && !/^\d{10}$/.test(v)
            ? "Billing phone must be 10 digits"
            : null,
      },
    });

    // Load saved form data on component mount
    useEffect(() => {
      // Prevent double-loading in React Strict Mode
      if (hasLoadedRef.current) {
        console.log("⏭️ Skipping duplicate load (React Strict Mode)");
        return;
      }

      hasLoadedRef.current = true;

      const loadSavedFormData = async () => {
        try {
          console.log("🔍 Attempting to load checkout state from IndexedDB...");
          const savedState = await loadCheckoutState();
          console.log("📦 Loaded state from IndexedDB:", savedState);

          if (savedState && savedState.formData) {
            console.log("✅ Found saved form data, restoring...");
            console.log("Form data to restore:", savedState.formData);

            // Restore form values
            form.setValues(savedState.formData);

            // Restore billing preference
            const savedUseDifferentBilling =
              savedState.useDifferentBilling || false;
            setUseDifferentBilling(savedUseDifferentBilling);
            console.log(
              "Billing preference restored:",
              savedUseDifferentBilling,
            );

            // Open billing collapse if it was previously opened
            if (savedUseDifferentBilling) {
              open();
            } else {
              close();
            }

            console.log("✅ Form hydration complete");
          } else {
            console.log("ℹ️ No saved form data found in IndexedDB");
          }
        } catch (error) {
          console.error("❌ Failed to load saved form data:", error);
        } finally {
          setIsFormLoaded(true);
          // Allow saving after a short delay to ensure form is fully hydrated
          setTimeout(() => {
            isLoadingRef.current = false;
            console.log("✅ Form is now ready for auto-save");
          }, 100);
        }
      };

      loadSavedFormData();
    }, []); // Empty dependency array - only run once on mount

    // Autofill user's email from GoogleOneTap Dialog
    useEffect(() => {
      if (user?.email && user.email !== form.values.email) {
        form.setFieldValue("email", user.email);
      }
    }, [user?.email, form.setFieldValue]);

    // TODO: Hack to logout user
    //   useEffect(() => {
    //   logout()
    // }, [])

    // Save form data to IDB whenever form values change (only after initial load)
    useEffect(() => {
      // Skip saving during initial load
      if (isLoadingRef.current || !isFormLoaded) {
        console.log("⏸️ Skipping save - form is loading");
        return;
      }

      const timeoutId = setTimeout(async () => {
        try {
          console.log("💾 Saving form data to IndexedDB...");
          console.log("Form values being saved:", form.values);
          console.log("useDifferentBilling:", useDifferentBilling);

          // Create the data object with both form values and billing preference
          const dataToSave = {
            ...form.values,
            verificationCode: "",
          };

          await saveCheckoutState(
            dataToSave,
            false, // isVerificationCodeSent - handled by parent
            false, // isVerificationCodeVerified - handled by parent
            null, // otpExpiryTime - handled by parent
            0, // timeRemaining - handled by parent
            useDifferentBilling,
          );
          console.log("✅ Form data saved to IndexedDB successfully");

          // Verify the save by reading it back
          const verification = await loadCheckoutState();
          console.log("🔍 Verification read:", verification);
        } catch (error) {
          console.error("❌ Failed to save form data:", error);
        }
      }, 500); // Debounce saves by 500ms

      return () => clearTimeout(timeoutId);
    }, [form.values, useDifferentBilling, isFormLoaded]);

    // Format time remaining as MM:SS
    const formatTime = (seconds: number): string => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    // Send OTP
    const handleSendOtp = async () => {
      const result = form.validateField("shippingPhone");
      if (result.hasError) return;

      try {
        setSendingOtp(true);
        await sendOtpCallback(form.values.shippingPhone);
      } catch (err) {
        notifications.show({
          title: "Error",
          message: "Failed to send OTP. Please try again.",
          color: "red",
          position: "top-right",
        });
      } finally {
        setSendingOtp(false);
      }
    };

    // Verify OTP
    const handleVerifyOtp = async () => {
      const result = form.validateField("verificationCode");
      if (result.hasError) return;

      try {
        setVerifyingOtp(true);
        await verifyOtpCallback(
          form.values.shippingPhone,
          form.values.verificationCode!,
        );
      } catch (err) {
        notifications.show({
          title: "Error",
          message: "Failed to verify OTP. Please try again.",
          color: "red",
          position: "top-right",
        });
      } finally {
        setVerifyingOtp(false);
      }
    };

    // Final form submit handler
    const handleFormSubmit = (values: DeliveryFormValues) => {
      // If phone not verified, block submit
      if (!isVerificationCodeVerified) {
        notifications.show({
          title: "Phone verification required",
          message: "Please verify your phone number before placing the order.",
          color: "red",
          position: "top-right",
          styles: { root: { top: "100px" } }, // TODO: Make it dynamic and according to NavBar
        });
        return;
      }

      const finalData: DeliveryFormValues = {
        ...values,
        userId: user?.id || values.userId,
        isPhoneVerified: true,
        ...(useDifferentBilling
          ? {}
          : {
              billingFirstName: values.shippingFirstName,
              billingLastName: values.shippingLastName,
              billingAddress: values.shippingAddress,
              billingApartment: values.shippingApartment,
              billingCity: values.shippingCity,
              billingState: values.shippingState,
              billingPinCode: values.shippingPinCode,
              billingPhone: values.shippingPhone,
            }),
      };

      setSubmitError(null);
      onPayNow(finalData);
    };

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      submitForm: () => {
        form.onSubmit(handleFormSubmit)();
      },
      getFormData: () => form.values,
      setFormData: (
        data: Partial<DeliveryFormValues>,
        useDifferentBilling: boolean,
      ) => {
        form.setValues(data);
        setUseDifferentBilling(useDifferentBilling);
        if (useDifferentBilling && !opened) {
          open();
        } else if (!useDifferentBilling && opened) {
          close();
        }
      },
      getUseDifferentBilling: () => useDifferentBilling,
    }));

    const indianStatesAndTerritory = IndianStatesList;

    // Check if OTP can be sent (either not sent yet, or timer expired)
    const canSendOtp = !isVerificationCodeSent || timeRemaining === 0;

    // Show loading state while form data is being restored
    if (!isFormLoaded) {
      return (
        <Box>
          <Text>Loading form...</Text>
        </Box>
      );
    }

    console.info({
      user,
    });

    return (
      <Box>
        <form onSubmit={form.onSubmit(handleFormSubmit)}>
          <Stack gap="lg">
            {submitError && <Alert color="red">{submitError}</Alert>}

            <Stack gap="md">
              <Select
                label="Country/Region"
                placeholder="Select country"
                data={["India"]}
                {...form.getInputProps("country")}
                disabled
                required
              />

              <Grid gutter="md">
                <Grid.Col span={6}>
                  <TextInput
                    label="First name"
                    placeholder="Enter first name"
                    {...form.getInputProps("shippingFirstName")}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Last name"
                    placeholder="Enter last name"
                    {...form.getInputProps("shippingLastName")}
                    required
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                label="Email address"
                placeholder="Enter your email address"
                {...form.getInputProps("email")}
                required
                type="email"
              />

              <TextInput
                label="Address"
                placeholder="Enter your address"
                {...form.getInputProps("shippingAddress")}
                required
              />

              <TextInput
                label="Apartment, suite, landmark etc. (optional)"
                placeholder="Enter apartment details"
                {...form.getInputProps("shippingApartment")}
              />

              <Grid gutter="md">
                <Grid.Col span={4}>
                  <TextInput
                    label="City"
                    placeholder="Enter city"
                    {...form.getInputProps("shippingCity")}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    label="State"
                    placeholder="Select state"
                    data={indianStatesAndTerritory}
                    {...form.getInputProps("shippingState")}
                    required
                    searchable
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="PIN code"
                    placeholder="Enter PIN code"
                    {...form.getInputProps("shippingPinCode")}
                    required
                  />
                </Grid.Col>
              </Grid>

              <Group align="end">
                <TextInput
                  flex={1}
                  label="Phone"
                  placeholder="Enter phone number"
                  {...form.getInputProps("shippingPhone")}
                  required
                />
                <Button
                  onClick={handleSendOtp}
                  disabled={
                    form.values.shippingPhone.length !== 10 || !canSendOtp
                  }
                  loading={sendingOtp}
                >
                  {isVerificationCodeSent && timeRemaining > 0
                    ? "OTP Sent"
                    : "Send OTP"}
                </Button>
              </Group>

              {/* Timer display */}
              {isVerificationCodeSent && timeRemaining > 0 && (
                <Text size="sm" c="dimmed">
                  Resend OTP in {formatTime(timeRemaining)}
                </Text>
              )}

              {/* Timer expired message */}
              {isVerificationCodeSent &&
                timeRemaining === 0 &&
                !isVerificationCodeVerified && (
                  <Text size="sm" c="red">
                    OTP expired. Please request a new one.
                  </Text>
                )}

              {/* Timer expired message */}
              {otpRequestTimeoutError && (
                <Text size="sm" c="red">
                  {otpRequestTimeoutError}
                </Text>
              )}

              {isVerificationCodeSent && (
                <Group align="end">
                  <TextInput
                    flex={1}
                    label="Verification Code"
                    placeholder="Enter 6-digit OTP"
                    {...form.getInputProps("verificationCode")}
                    required
                    maxLength={6}
                  />
                  <Button
                    variant="light"
                    onClick={handleVerifyOtp}
                    disabled={
                      (form.values.verificationCode &&
                        form.values.verificationCode.length !== 6) ||
                      isVerificationCodeVerified ||
                      timeRemaining === 0
                    }
                    loading={verifyingOtp}
                  >
                    {isVerificationCodeVerified ? "Verified ✓" : "Verify OTP"}
                  </Button>
                </Group>
              )}
            </Stack>

            {/* Payment Section - preserve your CSS */}
            <Stack className={styles.sectionMarginTop}>
              <Box bg="grey" w="100%" h={300}>
                Payment Section
              </Box>
            </Stack>

            {/* Billing Address - preserve your CSS */}
            <Stack gap="md" className={styles.sectionMarginTop}>
              <Title order={2}>Billing Address</Title>
              <Stack mt="md">
                <Radio
                  label="Same as shipping address"
                  checked={!useDifferentBilling}
                  onChange={() => {
                    setUseDifferentBilling(false);
                    close();
                  }}
                />
                <Stack>
                  <Radio
                    label="Use a different billing address"
                    checked={useDifferentBilling}
                    onChange={() => {
                      setUseDifferentBilling(true);
                      open();
                    }}
                  />
                  <Box>
                    {useDifferentBilling && (
                      <Collapse
                        in={opened}
                        transitionDuration={1000}
                        transitionTimingFunction="ease"
                      >
                        <Stack gap="md">
                          <Select
                            label="Country/Region"
                            placeholder="Select country"
                            data={["India"]}
                            value="India"
                            disabled
                            required
                          />

                          <Grid gutter="md">
                            <Grid.Col span={6}>
                              <TextInput
                                label="First name"
                                placeholder="Enter first name"
                                {...form.getInputProps("billingFirstName")}
                                required
                              />
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <TextInput
                                label="Last name"
                                placeholder="Enter last name"
                                {...form.getInputProps("billingLastName")}
                                required
                              />
                            </Grid.Col>
                          </Grid>

                          <TextInput
                            label="Address"
                            placeholder="Enter your address"
                            {...form.getInputProps("billingAddress")}
                            required
                          />

                          <TextInput
                            label="Apartment, suite, etc. (optional)"
                            placeholder="Enter apartment details"
                            {...form.getInputProps("billingApartment")}
                          />

                          <Grid gutter="md">
                            <Grid.Col span={4}>
                              <TextInput
                                label="City"
                                placeholder="Enter city"
                                {...form.getInputProps("billingCity")}
                                required
                              />
                            </Grid.Col>
                            <Grid.Col span={4}>
                              <Select
                                label="State"
                                placeholder="Select state"
                                data={indianStatesAndTerritory}
                                {...form.getInputProps("billingState")}
                                required
                                searchable
                              />
                            </Grid.Col>
                            <Grid.Col span={4}>
                              <TextInput
                                label="PIN code"
                                placeholder="Enter PIN code"
                                {...form.getInputProps("billingPinCode")}
                                required
                              />
                            </Grid.Col>
                          </Grid>

                          <TextInput
                            label="Phone"
                            placeholder="Enter phone number"
                            {...form.getInputProps("billingPhone")}
                            required
                          />
                        </Stack>
                      </Collapse>
                    )}
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </form>
      </Box>
    );
  },
);

DeliveryForm.displayName = "DeliveryForm";

export default DeliveryForm;
