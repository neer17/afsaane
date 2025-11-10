'use client';

import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import Image from 'next/image';
import { useForm } from '@mantine/form';
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
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import styles from './CheckoutForm.module.css';
import { IndianStatesList } from '@/app/helpers/constants';
import WhatsApp from 'public/svgs/whatsapp.svg';
import { API_ENDPOINTS } from '@/app/helpers/constants';

interface DeliveryFormProps {
  isVerificationCodeSent: boolean;
  isVerificationCodeVerified: boolean;
  sendOtpCallback: (phoneNumber: string) => void;
  verificationCodeEnteredCallback: (verificationCode: string) => void;
}

interface DeliveryFormValues {
  userId: string;
  country: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddress: string;
  shippingApartment: string;
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
  isPhoneVerified: boolean;
}

export interface DeliveryFormHandle {
  submitForm: () => DeliveryFormValues | null;
  resetForm: () => void;
}

// API service function
const submitCheckoutForm = async (
  formData: DeliveryFormValues,
): Promise<any> => {
  const response = await fetch(API_ENDPOINTS.ORDER_CREATE.URL, {
    method: API_ENDPOINTS.ORDER_CREATE.METHOD,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json();
};

const DeliveryForm = forwardRef<DeliveryFormHandle, DeliveryFormProps>(
  (
    {
      isVerificationCodeSent,
      sendOtpCallback,
      verificationCodeEnteredCallback,
      isVerificationCodeVerified,
    },
    ref,
  ) => {
    const [useDifferentBilling, setUseDifferentBilling] = useState(false);
    const [opened, { toggle: toggleBillingForm }] = useDisclosure(false);
    const [sendingVerificationCode, setSendingVerificationCode] =
      useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const buttonRef = useRef<HTMLButtonElement>(null);

    const form = useForm({
      initialValues: {
        country: 'India',
        shippingFirstName: '',
        shippingLastName: '',
        shippingAddress: '',
        shippingApartment: '',
        shippingCity: '',
        shippingState: '',
        shippingPinCode: '',
        shippingPhone: '',
        billingFirstName: '',
        billingLastName: '',
        billingAddress: '',
        billingApartment: '',
        billingCity: '',
        billingState: '',
        billingPinCode: '',
        billingPhone: '',
        // TODO: change this after integrating msg91 and supabase
        isPhoneVerified: true,
        userId: 'random-user-id',
      },
      validate: {
        shippingFirstName: (value) => {
          if (!value || value.trim().length === 0) {
            return 'First name is required';
          }
          if (value.trim().length < 2) {
            return 'First name must be at least 2 characters';
          }
          if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
            return 'First name can only contain letters and spaces';
          }
          return null;
        },
        shippingLastName: (value) => {
          if (!value || value.trim().length === 0) {
            return 'Last name is required';
          }
          if (value.trim().length < 2) {
            return 'Last name must be at least 2 characters';
          }
          if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
            return 'Last name can only contain letters and spaces';
          }
          return null;
        },
        shippingAddress: (value) => {
          if (!value || value.trim().length === 0) {
            return 'Address is required';
          }
          if (value.trim().length < 5) {
            return 'Please enter a valid address (minimum 5 characters)';
          }
          return null;
        },
        shippingCity: (value) => {
          if (!value || value.trim().length === 0) {
            return 'City is required';
          }
          if (value.trim().length < 2) {
            return 'Please enter a valid city name';
          }
          if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
            return 'City name can only contain letters and spaces';
          }
          return null;
        },
        shippingState: (value) => {
          if (!value || value.trim().length === 0) {
            return 'State is required';
          }
          return null;
        },
        shippingPinCode: (value) => {
          if (!value || value.trim().length === 0) {
            return 'PIN code is required';
          }
          if (!/^\d{6}$/.test(value.trim())) {
            return 'PIN code must be exactly 6 digits';
          }
          return null;
        },
        shippingPhone: (value) => {
          if (!value || value.trim().length === 0) {
            return 'Phone number is required';
          }
          if (!/^\d{10}$/.test(value.trim())) {
            return 'Phone number must be exactly 10 digits';
          }
          if (isVerificationCodeSent && !isVerificationCodeVerified) {
            return 'Please verify your phone number with OTP';
          }
          return null;
        },
        // verificationCode: (value) => {
        //   if (isVerificationCodeSent && !isVerificationCodeVerified) {
        //     if (!value || value.trim().length === 0) {
        //       return 'Verification code is required';
        //     }
        //     if (!/^\d{6}$/.test(value.trim())) {
        //       return 'Verification code must be exactly 6 digits';
        //     }
        //   }
        //   return null;
        // },
        // Billing address validations (conditional)
        billingFirstName: (value) => {
          if (useDifferentBilling) {
            if (!value || value.trim().length === 0) {
              return 'Billing first name is required';
            }
            if (value.trim().length < 2) {
              return 'Billing first name must be at least 2 characters';
            }
            if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
              return 'Billing first name can only contain letters and spaces';
            }
          }
          return null;
        },
        billingLastName: (value) => {
          if (useDifferentBilling) {
            if (!value || value.trim().length === 0) {
              return 'Billing last name is required';
            }
            if (value.trim().length < 2) {
              return 'Billing last name must be at least 2 characters';
            }
            if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
              return 'Billing last name can only contain letters and spaces';
            }
          }
          return null;
        },
        billingAddress: (value) => {
          if (useDifferentBilling) {
            if (!value || value.trim().length === 0) {
              return 'Billing address is required';
            }
            if (value.trim().length < 5) {
              return 'Please enter a valid billing address (minimum 5 characters)';
            }
          }
          return null;
        },
        billingCity: (value) => {
          if (useDifferentBilling) {
            if (!value || value.trim().length === 0) {
              return 'Billing city is required';
            }
            if (value.trim().length < 2) {
              return 'Please enter a valid billing city name';
            }
            if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
              return 'Billing city name can only contain letters and spaces';
            }
          }
          return null;
        },
        billingState: (value) => {
          if (useDifferentBilling) {
            if (!value || value.trim().length === 0) {
              return 'Billing state is required';
            }
          }
          return null;
        },
        billingPinCode: (value) => {
          if (useDifferentBilling) {
            if (!value || value.trim().length === 0) {
              return 'Billing PIN code is required';
            }
            if (!/^\d{6}$/.test(value.trim())) {
              return 'Billing PIN code must be exactly 6 digits';
            }
          }
          return null;
        },
        billingPhone: (value) => {
          if (useDifferentBilling) {
            if (!value || value.trim().length === 0) {
              return 'Billing phone number is required';
            }
            if (!/^\d{10}$/.test(value.trim())) {
              return 'Billing phone number must be exactly 10 digits';
            }
          }
          return null;
        },
      },
    });

    const indianStatesAndTerritory = IndianStatesList;

    const handleSubmit = form.onSubmit(async (values) => {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        // Prepare form data for submission
        const formData: DeliveryFormValues = {
          ...values,
          // If not using different billing, copy shipping address to billing
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

        const response = await submitCheckoutForm(formData);

        // Show success notification
        notifications.show({
          title: 'Success!',
          message: 'Your order has been submitted successfully.',
          color: 'green',
        });

        // Reset form after successful submission
        form.reset();
        setUseDifferentBilling(false);

        console.log('Form submitted successfully:', response);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred';
        setSubmitError(errorMessage);

        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        });

        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    });

    // const handleSendOtp = async () => {
    //   const phoneValidation = form.validateField('phone');
    //   if (phoneValidation.hasError) {
    //     return;
    //   }

    //   setSendingVerificationCode(true);
    //   try {
    //     await sendOtpCallback(form.values.phone);
    //   } catch (error) {
    //     console.error('Error sending OTP:', error);
    //   } finally {
    //     setSendingVerificationCode(false);
    //   }
    // };

    // const handleVerifyOtp = async () => {
    //   const codeValidation = form.validateField('verificationCode');
    //   if (codeValidation.hasError) {
    //     return;
    //   }

    //   try {
    //     await verificationCodeEnteredCallback(form.values.verificationCode);
    //   } catch (error) {
    //     console.error('Error verifying OTP:', error);
    //   }
    // };

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        const result = form.validate();
        console.info('form validation');
        console.info({ result });
        if (!result.hasErrors) {
          return form.values;
        }
        return null;
      },
      resetForm: () => {
        form.reset();
        setUseDifferentBilling(false);
        setSubmitError(null);
      },
    }));

    return (
      <Box>
        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            {submitError && (
              <Alert color="red" title="Submission Error">
                {submitError}
              </Alert>
            )}

            <Stack gap="md">
              <Select
                label="Country/Region"
                placeholder="Select country"
                data={['India']}
                {...form.getInputProps('country')}
                disabled
                required
              />

              <Grid gutter="md">
                <Grid.Col span={6}>
                  <TextInput
                    label="First name"
                    placeholder="Enter first name"
                    {...form.getInputProps('shippingFirstName')}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Last name"
                    placeholder="Enter last name"
                    {...form.getInputProps('shippingLastName')}
                    required
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                label="Address"
                placeholder="Enter your address"
                {...form.getInputProps('shippingAddress')}
                required
              />

              <TextInput
                label="Apartment, suite, landmark etc. (optional)"
                placeholder="Enter apartment details"
                {...form.getInputProps('shippingApartment')}
              />

              <Grid gutter="md">
                <Grid.Col span={4}>
                  <TextInput
                    label="City"
                    placeholder="Enter city"
                    {...form.getInputProps('city')}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    label="State"
                    placeholder="Select state"
                    data={indianStatesAndTerritory}
                    {...form.getInputProps('state')}
                    required
                    searchable
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="PIN code"
                    placeholder="Enter PIN code"
                    {...form.getInputProps('pinCode')}
                    required
                  />
                </Grid.Col>
              </Grid>

              <Group align="end">
                <TextInput
                  flex={1}
                  label="Phone"
                  placeholder="Enter phone number"
                  {...form.getInputProps('phone')}
                  required
                />
                {/* <Button
                  onClick={handleSendOtp}
                  disabled={
                    form.values.phone.length !== 10 || isVerificationCodeSent
                  }
                  loading={sendingVerificationCode}
                >
                  {isVerificationCodeSent ? 'OTP Sent' : 'Send OTP'}
                </Button> */}
              </Group>
              <Group>
                <Text size="xs">
                  This number will be used to send order related communications
                  on Whatsapp
                </Text>
                <Image
                  src={WhatsApp}
                  width={15}
                  height={15}
                  alt="Whatsapp svg"
                />
              </Group>

              {/* {isVerificationCodeSent && (
                <Group align="end">
                  <TextInput
                    flex={1}
                    label="Verification Code"
                    placeholder="Enter OTP"
                    {...form.getInputProps('verificationCode')}
                    required
                  />
                  <Button
                    variant="light"
                    onClick={handleVerifyOtp}
                    disabled={
                      form.values.verificationCode.length !== 6 ||
                      isVerificationCodeVerified
                    }
                  >
                    {isVerificationCodeVerified ? 'Verified' : 'Verify OTP'}
                  </Button>
                </Group>
              )} */}
            </Stack>
          </Stack>

          <Stack className={styles.sectionMarginTop}>
            <Box bg="grey" w="100%" h={300}>
              Payment Section
            </Box>
          </Stack>

          <Stack gap="md" className={styles.sectionMarginTop}>
            <Title order={2}>Billing Address</Title>
            <Stack mt="md">
              <Radio
                label="Same as shipping address"
                checked={!useDifferentBilling}
                onChange={() => {
                  setUseDifferentBilling(false);
                  if (opened) toggleBillingForm();
                }}
              />
              <Stack>
                <Radio
                  label="Use a different billing address"
                  checked={useDifferentBilling}
                  onChange={() => {
                    setUseDifferentBilling(true);
                    if (!opened) toggleBillingForm();
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
                          data={['India']}
                          value="India"
                          disabled
                          required
                        />

                        <Grid gutter="md">
                          <Grid.Col span={6}>
                            <TextInput
                              label="First name"
                              placeholder="Enter first name"
                              {...form.getInputProps('billingFirstName')}
                              required
                            />
                          </Grid.Col>
                          <Grid.Col span={6}>
                            <TextInput
                              label="Last name"
                              placeholder="Enter last name"
                              {...form.getInputProps('billingLastName')}
                              required
                            />
                          </Grid.Col>
                        </Grid>

                        <TextInput
                          label="Address"
                          placeholder="Enter your address"
                          {...form.getInputProps('billingAddress')}
                          required
                        />

                        <TextInput
                          label="Apartment, suite, etc. (optional)"
                          placeholder="Enter apartment details"
                          {...form.getInputProps('billingApartment')}
                        />

                        <Grid gutter="md">
                          <Grid.Col span={4}>
                            <TextInput
                              label="City"
                              placeholder="Enter city"
                              {...form.getInputProps('billingCity')}
                              required
                            />
                          </Grid.Col>
                          <Grid.Col span={4}>
                            <Select
                              label="State"
                              placeholder="Select state"
                              data={indianStatesAndTerritory}
                              {...form.getInputProps('billingState')}
                              required
                              searchable
                            />
                          </Grid.Col>
                          <Grid.Col span={4}>
                            <TextInput
                              label="PIN code"
                              placeholder="Enter PIN code"
                              {...form.getInputProps('billingPinCode')}
                              required
                            />
                          </Grid.Col>
                        </Grid>

                        <TextInput
                          label="Phone"
                          placeholder="Enter phone number"
                          {...form.getInputProps('billingPhone')}
                          required
                        />
                      </Stack>
                    </Collapse>
                  )}
                </Box>
              </Stack>
            </Stack>
          </Stack>

          <Button type="submit" display={'none'} ref={buttonRef}>
            Dummy button to submit the form
          </Button>
        </form>
      </Box>
    );
  },
);

DeliveryForm.displayName = 'DeliveryForm';

export default DeliveryForm;
