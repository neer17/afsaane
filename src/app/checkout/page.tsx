'use client';

import React, { useRef } from 'react';
import usePhoneAuth from '@/hooks/PhoneAuth';
import styles from './page.module.css';
import GoogleOneTap from '@/components/auth/google_sign_in/GoogleOneTap';
import CheckoutForm, {
  DeliveryFormHandle,
} from '@/components/forms/CheckoutForm';
import Rupee from '@/components/symbols/Rupee';
import { useMediaQuery } from '@mantine/hooks';

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
} from '@mantine/core';
import { useCart } from '@/context/CartContext';
import CartProductCard from '@/components/card/CartProductCard';
// import SupabaseAuthPage from '@/components/firebase/SupabaseAuthPage'
import { useAuth } from '@/context/SupabaseAuthContext';
import SignOutButton from '@/components/auth/google_sign_in/Signout';

export default function LoginButton() {
  const { cartData, deleteCartData, getTotalPrice, getTotalQuantity } =
    useCart();
  const [isDiscountCouponApplied, setIsDiscountCouponApplied] =
    React.useState(false);
  const [isVerificationCodeSent, setIsVerificationCodeSent] =
    React.useState(false);

  const [isVerificationCodeVerified, setIsVerificationCodeVerified] =
    React.useState(false);

  const isSmallerThan1024 = useMediaQuery('(max-width: 1025px)');
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
    console.log(event.target.value);
  };

  const handleApplyDiscountCoupon = () => {
    console.log('Discount coupon applied');
    setIsDiscountCouponApplied(true);
  };

  // In prod this will not be needed as Firebase will handle this in the background in the paid plan
  function recaptchaSolvedCallback(response: string) {
    console.log('recaptchaSolvedCallback', response);
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

  // const handleFormSubmit = (event: React.MouseEvent) => {
  //   event.preventDefault();
  //   console.info('here');
  //   const formValues = formRef.current?.submitForm();
  // };

  const { user, supabase } = useAuth();

  //  return (
  //   <div>
  //     {user ? (
  //       <>
  //         <p>Welcome, {user.email}</p>
  //         <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
  //       </>
  //     ) : (
  //       <p>Loading or not signed in...</p>
  //     )}
  //   </div>
  // );

  return (
    <div style={{ paddingTop: '500px' }}>
      <GoogleOneTap />
    </div>
  );
}

// return (
//   <div className={styles.container}>
//     {/* <LoginButton /> */}
//     {/* Chkecout Page */}
//     {/* TODO: Add google interaction */}
//     {/* <Box>
//       <GoogleOneTap />
//     </Box> */}

//     <Paper p="xl" pb={50}>
//       <Grid overflow="hidden">
//         <Grid.Col span={{ base: 12, lg: 7 }}>
//           <CheckoutForm
//             ref={formRef}
//             sendOtpCallback={handleSendOtp}
//             isVerificationCodeSent={isVerificationCodeSent}
//             isVerificationCodeVerified={isVerificationCodeVerified}
//             verificationCodeEnteredCallback={handleVerificationCode}
//           />
//           {!isSmallerThan1024 && (
//             <Group mt={32}>
//               <Button
//                 type="submit"
//                 size="md"
//                 fullWidth
//                 onClick={handleFormSubmit}
//               >
//                 Pay Now
//               </Button>
//             </Group>
//           )}
//         </Grid.Col>
//         <Grid.Col span={{ base: 12, lg: 5 }} p={{ base: 0, md: 'md' }}>
//           <Stack>
//             <Title order={2}>Order Summary</Title>

//             <Box
//               pl={0}
//               mb={32}
//               pr="sm"
//               style={{
//                 overflowY: 'auto',
//                 maxHeight: '50vh',
//               }}
//             >
//               {Array.from(cartData.values()).map(
//                 ({ id, name, price, quantity, category, imageSrc }) => (
//                   <CartProductCard
//                     key={id}
//                     id={id}
//                     name={name}
//                     price={price}
//                     quantity={quantity}
//                     category={category}
//                     imageSrc={imageSrc}
//                     isOrderSummaryCard
//                     crossButtonWidth="10px"
//                     crossButtonHeight="10px"
//                     deleteCartItem={handleDeleteItem}
//                   />
//                 ),
//               )}
//             </Box>

//             <Box>
//               <Stack>
//                 <Group justify="space-between">
//                   <TextInput
//                     flex={1}
//                     placeholder="Discount code or gift card"
//                     onChange={handleDiscountCouponInputChange}
//                   />
//                   <Button onClick={handleApplyDiscountCoupon}>Apply</Button>
//                 </Group>
//                 {isDiscountCouponApplied && (
//                   <Text color="green">Discount coupon applied</Text>
//                 )}
//               </Stack>
//             </Box>

//             <Box mt={16}>
//               <Group justify="space-between" mb={16}>
//                 <Text>Subtotal . {getTotalQuantity()}</Text>
//                 <Text>{getTotalPrice()}</Text>
//               </Group>
//               <Group justify="space-between" mb={16}>
//                 <Text>Shipping</Text>
//                 <Text fw={700}>Free</Text>
//               </Group>

//               <Group justify="space-between" align="start">
//                 <Text fw={700}>Total</Text>
//                 <Stack align="end">
//                   <Text fw={700}>
//                     {<Rupee />}
//                     {getTotalPrice()}
//                   </Text>
//                   <Text fw={700} size="xs">
//                     Including {<Rupee />}10000 in taxes
//                   </Text>
//                 </Stack>
//               </Group>
//             </Box>
//           </Stack>
//         </Grid.Col>
//       </Grid>
//     </Paper>
//     {isSmallerThan1024 && (
//       <Button
//         style={{
//           position: 'fixed',
//           bottom: 10, // 20px from bottom
//           left: '50%',
//           transform: 'translateX(-50%)', // Center horizontally
//           zIndex: 1000, // Ensure it stays on top of other content
//           // Optional: Add width if needed
//           width: 'calc(100% - 32px)', // Full width minus margins
//         }}
//         onClick={handleFormSubmit}
//       >
//         Pay Now
//       </Button>
//     )}
//   </div>
// );

// return <SupabaseAuthPage />
