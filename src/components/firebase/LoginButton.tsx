'use client';

import { useAuth } from '@/context/AuthContext';
import { auth } from '../../../lib/firebase/config';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import styles from './LoginButton.module.css';
import { handleSignOut } from '@/components/auth/google_one_tap/GoogleOneTap';

export default function LoginButton() {
  const { user } = useAuth();

  const signInWithGoogle = async () => {
    if (user) {
      return await handleSignOut();
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  console.info('user', user);

  return (
    <div className={styles.container}>
      <button onClick={signInWithGoogle}>
        {user ? 'Sign Out' : 'Sign In with Google'}
      </button>
    </div>
  );
}
