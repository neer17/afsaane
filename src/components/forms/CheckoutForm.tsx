'use client';

import Image from 'next/image';
import React, { useState, useRef } from 'react';
import { useForm } from '@mantine/form';
import {
  TextInput,
  Select,
  Checkbox,
  Button,
  Title,
  Grid,
  Stack,
  Radio,
  Box,
  Collapse,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import styles from './CheckoutForm.module.css';
import SendSVG from '@/app/svgs/send_button.svg';

interface DeliveryFormProps {
  isVerificationCodeSent: boolean;
  isVerificationCodeVerified: boolean;
  sendOtpCallback: (phoneNumber: string) => void;
  verificationCodeEnteredCallback: (verificationCode: string) => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({
  isVerificationCodeSent,
  sendOtpCallback,
  verificationCodeEnteredCallback,
  isVerificationCodeVerified,
}) => {
  const [useDifferentBilling, setUseDifferentBilling] = useState(false);
  const [opened, { toggle: toggleBillingForm }] = useDisclosure(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const form = useForm({
    initialValues: {
      country: 'India',
      firstName: '',
      lastName: '',
      shippingAddress: '',
      apartment: '',
      city: '',
      state: '',
      pinCode: '',
      phone: '',
      receiveOffers: false,
      billingFirstName: '',
      billingLastName: '',
      billingAddress: '',
      billingApartment: '',
      billingCity: '',
      billingState: '',
      billingPinCode: '',
      billingPhone: '',
      verificationCode: '',
    },
    validate: {
      firstName: (value) =>
        value.length < 2 ? 'First name is too short' : null,
      lastName: (value) => (value.length < 2 ? 'Last name is too short' : null),
      shippingAddress: (value) =>
        value.length < 5 ? 'Please enter a valid address' : null,
      city: (value) => (value.length < 2 ? 'Please enter a valid city' : null),
      pinCode: (value) =>
        /^\d{6}$/.test(value) ? null : 'PIN code must be 6 digits',
      phone: (value) => {
        if (!/^\d{10}$/.test(value)) {
          return 'Enter a valid 10 digit phone number';
        }

        if (isVerificationCodeSent && !isVerificationCodeVerified) {
          return 'Enter a valid OTP and verify';
        }
      },
      billingFirstName: (value) =>
        useDifferentBilling
          ? value.length < 2
            ? 'First name is too short'
            : null
          : null,
      billingLastName: (value) =>
        useDifferentBilling
          ? value.length < 2
            ? 'Last name is too short'
            : null
          : null,
      billingAddress: (value) =>
        useDifferentBilling
          ? value.length < 5
            ? 'Please enter a valid address'
            : null
          : null,
      billingCity: (value) =>
        useDifferentBilling
          ? value.length < 2
            ? 'Please enter a valid city'
            : null
          : null,
      billingPinCode: (value) =>
        useDifferentBilling
          ? /^\d{6}$/.test(value)
            ? null
            : 'PIN code must be 6 digits'
          : null,
      billingPhone: (value) =>
        useDifferentBilling
          ? /^\d{10}$/.test(value)
            ? null
            : 'Phone number must be 10 digits'
          : null,
      verificationCode: (value) =>
        isVerificationCodeSent ? null : 'Enter a valid OTP and verify',
    },
  });

  const indianStatesAndTerritory = [
    'Rajasthan',
    'Delhi',
    'Maharashtra',
    'Karnataka',
    'Tamil Nadu',
    'Uttar Pradesh',
    'Gujarat',
    'West Bengal',
    'Madhya Pradesh',
    'Bihar',
    'Andhra Pradesh',
    'Haryana',
    'Kerala',
    'Punjab',
    'Odisha',
    'Telangana',
    'Assam',
    'Jharkhand',
    'Chhattisgarh',
    'Uttarakhand',
    'Himachal Pradesh',
    'Tripura',
    'Meghalaya',
    'Manipur',
    'Nagaland',
    'Goa',
    'Arunachal Pradesh',
    'Mizoram',
    'Sikkim',
    'Jammu and Kashmir',
    'Puducherry',
    'Chandigarh',
    'Dadra and Nagar Haveli',
    'Daman and Diu',
    'Lakshadweep',
    'Andaman and Nicobar Islands',
  ];

  const handleSubmit = form.onSubmit((values) => {
    console.log('Form submitted:', values);
    // Handle form submission logic here
  });

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    console.info({
      value,
    });
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          <Stack gap="md">
            <Select
              label="Country/Region"
              placeholder="Select country"
              data={['India']}
              {...form.getInputProps('country')}
              disabled
            />

            <Grid gutter="md">
              <Grid.Col span={6}>
                <TextInput
                  label="First name"
                  placeholder="Enter first name"
                  {...form.getInputProps('firstName')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Last name"
                  placeholder="Enter last name"
                  {...form.getInputProps('lastName')}
                />
              </Grid.Col>
            </Grid>

            <TextInput
              label="Address"
              placeholder="Enter your address"
              {...form.getInputProps('shippingAddress')}
            />

            <TextInput
              label="Apartment, suite, landmark etc. (optional)"
              placeholder="Enter apartment details"
              {...form.getInputProps('apartment')}
            />

            <Grid gutter="md">
              <Grid.Col span={4}>
                <TextInput
                  label="City"
                  placeholder="Enter city"
                  {...form.getInputProps('city')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label="State"
                  placeholder="Select state"
                  data={indianStatesAndTerritory}
                  {...form.getInputProps('state')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="PIN code"
                  placeholder="Enter PIN code"
                  {...form.getInputProps('pinCode')}
                />
              </Grid.Col>
            </Grid>

            <TextInput
              label="Phone"
              placeholder="Enter phone number"
              {...form.getInputProps('phone')}
              onChange={(event) => {
                form.getInputProps('phone').onChange(event);
                handlePhoneChange(event);
              }}
              rightSection={
                form.values.phone.length == 10 && (
                  <Image
                    src={SendSVG}
                    alt="Send OTP button"
                    width={20}
                    height={20}
                    onClick={() => {
                      sendOtpCallback(form.values.phone);
                    }}
                  />
                )
              }
            />
            {isVerificationCodeSent && (
              <TextInput
                label="Verification Code"
                placeholder="Enter OTP"
                {...form.getInputProps('verificationCode')}
                // onChange={(event) => {
                //   form.getInputProps('verificationCode').onChange(event);
                //   verificationCodeEnteredCallback(event.target.value);
                // }}
                rightSection={
                  <Button
                    variant="light"
                    onClick={(_event) =>
                      verificationCodeEnteredCallback(
                        form.values.verificationCode,
                      )
                    }
                  >
                    Verify OTP
                  </Button>
                }
              />
            )}

            <Checkbox
              label="Text me with news and offers"
              {...form.getInputProps('receiveOffers', { type: 'checkbox' })}
            />
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
                toggleBillingForm();
              }}
            />
            <Stack>
              <Radio
                label="Use a different billing address"
                checked={useDifferentBilling}
                onChange={() => {
                  setUseDifferentBilling(true);
                  toggleBillingForm();
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
                        {...form.getInputProps('country')}
                        disabled
                      />

                      <Grid gutter="md">
                        <Grid.Col span={6}>
                          <TextInput
                            label="First name"
                            placeholder="Enter first name"
                            {...form.getInputProps('billingFirstName')}
                          />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <TextInput
                            label="Last name"
                            placeholder="Enter last name"
                            {...form.getInputProps('billingLastName')}
                          />
                        </Grid.Col>
                      </Grid>

                      <TextInput
                        label="Address"
                        placeholder="Enter your address"
                        {...form.getInputProps('billingAddress')}
                        onChange={(e) => {
                          console.info(e);
                        }}
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
                          />
                        </Grid.Col>
                        <Grid.Col span={4}>
                          <Select
                            label="State"
                            placeholder="Select state"
                            data={indianStatesAndTerritory}
                            {...form.getInputProps('billingState')}
                          />
                        </Grid.Col>
                        <Grid.Col span={4}>
                          <TextInput
                            label="PIN code"
                            placeholder="Enter PIN code"
                            {...form.getInputProps('billingPinCode')}
                          />
                        </Grid.Col>
                      </Grid>

                      <TextInput
                        label="Phone"
                        placeholder="Enter phone number"
                        {...form.getInputProps('billingPhone')}
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
};

export default DeliveryForm;
