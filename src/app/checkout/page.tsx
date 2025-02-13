'use client';

import PhoneAuth from '@/components/auth/phone/PhoneAuth';
import styles from './page.module.css';
import GoogleOneTap from '@/components/auth/google_one_tap/GoogleOneTap';
import CheckoutForm from '@/components/forms/CheckoutForm';

export default function LoginButton() {
  return (
    <div className={styles.container}>
      {/* <GoogleOneTap /> */}
      {/* <LoginButton /> */}
      {/* <PhoneAuth /> */}
      {/* Chkecout Page */}
      <CheckoutForm />
    </div>
  );
}
