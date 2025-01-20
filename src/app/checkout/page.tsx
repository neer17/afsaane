// 'use client';

import PhoneAuth from '@/components/auth/phone/PhoneAuth';
import styles from './page.module.css';
import GoogleOneTap from '@/components/auth/google_one_tap/GoogleOneTap';

export default function LoginButton() {
  return (
    <div className={styles.container}>
      <GoogleOneTap />
      {/* <LoginButton /> */}
      <PhoneAuth />
      Chkecout Page
    </div>
  );
}
