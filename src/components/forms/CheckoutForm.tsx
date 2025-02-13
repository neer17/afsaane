'use client';

import { useState } from 'react';
import { useForm } from '@mantine/form';
import {
  TextInput,
  Select,
  Checkbox,
  Button,
  Paper,
  Title,
  Grid,
  Stack,
  Group,
  Radio,
  Box,
  Collapse,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import styles from './CheckoutForm.module.css';

const DeliveryForm = () => {
  const [useDifferentBilling, setUseDifferentBilling] = useState(false);
  const [opened, { toggle: toggleBillingForm }] = useDisclosure(false);

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
    },
    validate: {
      firstName: (value) =>
        value.length < 2 ? 'First name is too short' : null,
      lastName: (value) => (value.length < 2 ? 'Last name is too short' : null),
      shippingAddress: (value) => {
        console.info({
          value,
        });
        return value.length < 5 ? 'Please enter a valid address' : null;
      },
      city: (value) => (value.length < 2 ? 'Please enter a valid city' : null),
      pinCode: (value) =>
        /^\d{6}$/.test(value) ? null : 'PIN code must be 6 digits',
      phone: (value) =>
        /^\d{10}$/.test(value) ? null : 'Phone number must be 10 digits',
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

  return (
    <Paper p="xl" radius="md">
      <Grid>
        {/* First half */}
        <Grid.Col span={{ base: 12, md: 7 }}>
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
                />

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
                    {/* TODO: The animation does not works */}
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

            <Group mt={32}>
              <Button type="submit" size="md">
                Pay Now
              </Button>
            </Group>
          </form>
        </Grid.Col>

        {/* Second half */}
        <Grid.Col span={{ base: 12, md: 5 }}></Grid.Col>
      </Grid>
    </Paper>
  );
};

export default DeliveryForm;
