'use client';

import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../../../../lib/firebase/config';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  linkWithCredential,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

const PhoneAuth: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.info('PhoneAuth.tsx', 'useEffect', 'auth: currentUser', auth.currentUser);

    const cleanup = () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };

    const initRecaptcha = () => {
      cleanup();
      try {
        const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: (response: any) => {
            console.log('reCAPTCHA solved', response);
          },
          'expired-callback': () => {
            setError('reCAPTCHA expired. Please try again.');
            cleanup();
          },
        });
        window.recaptchaVerifier = verifier;
        verifier.render();
      } catch (error) {
        console.error('reCAPTCHA initialization error:', error);
        setError('Failed to initialize phone verification');
      }
    };

    if (recaptchaContainerRef.current) {
      initRecaptcha();
    }

    // Set persistence to local storage
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('Persistence set to local storage');
      })
      .catch((error) => {
        console.error('Error setting persistence:', error);
      });

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log('User is signed in:', currentUser);
      } else {
        console.log('No user is signed in');
      }
    });

    return () => {
      cleanup();
      unsubscribe();
    };
  }, []);

  const sendVerificationCode = async () => {
    setError(null);

    if (!phoneNumber) {
      setError('Please enter a phone number');
      return;
    }

    try {
      if (!window.recaptchaVerifier) {
        throw new Error('reCAPTCHA not initialized');
      }

      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, window.recaptchaVerifier);

      window.confirmationResult = confirmationResult;
      setVerificationId(confirmationResult.verificationId);
      console.log('Verification code sent');
    } catch (error: any) {
      console.error('Send code error:', error);
      setError(error.message || 'Failed to send verification code');

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    }
  };

  const verifyCode = async () => {
    setError(null);

    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    if (!verificationId) {
      setError('No verification ID found');
      return;
    }

    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      const currentUser = auth.currentUser;

      if (currentUser) {
        await linkWithCredential(currentUser, credential);
        console.log('Phone number linked to the existing user');
      } else {
        await signInWithCredential(auth, credential);
        console.log('Phone number verified and user signed in');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setError(error.message || 'Invalid verification code');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Phone Authentication</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {!verificationId ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full p-2 border rounded"
            />
          </div>

          <div id="recaptcha-container" ref={recaptchaContainerRef}></div>

          <button
            onClick={sendVerificationCode}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Send Verification Code
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium mb-1">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full p-2 border rounded"
            />
          </div>

          <button onClick={verifyCode} className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Verify Code
          </button>
        </div>
      )}
    </div>
  );
};

export default PhoneAuth;
