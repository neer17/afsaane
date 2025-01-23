'use client';

import React, { useEffect } from 'react';
import { auth } from '../../../../lib/firebase/config';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  setPersistence,
  browserLocalPersistence,
  linkWithCredential,
  onAuthStateChanged,
} from 'firebase/auth';

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (_config: GoogleOneTapConfig) => void;
          prompt: (momentListener?: PromptMomentListener) => void;
          renderButton: (element: HTMLElement, config: ButtonConfig) => void;
          cancel: () => void;
          revoke: (email: string, callback: () => void) => void;
        };
      };
    };
  }
}

interface GoogleOneTapConfig {
  client_id: string;
  callback: (response: CredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  prompt_parent_id?: string;
  context?: string;
  itp_support?: boolean;
  use_fedcm_for_prompt?: boolean;
  native_callback?: (response: CredentialResponse) => void;
  error?: (error: Error) => void;
}

interface CredentialResponse {
  credential: string;
}

type PromptMomentListener = (notification: PromptMomentNotification) => void;

interface PromptMomentNotification {
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => string;
  isSkippedMoment: () => boolean;
  getSkippedReason: () => string;
  isDismissedMoment: () => boolean;
  getDismissedReason: () => string;
}

interface ButtonConfig {
  theme: string;
  size: string;
  type: string;
}

export const handleSignOut = async () => {
  try {
    window.google?.accounts.id.cancel();
    await signOut(auth);
    const email = auth.currentUser?.email;
    if (email) {
      window.google?.accounts.id.revoke(email, () => {
        console.log('Google One Tap state cleared');
      });
    }
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

export default function GoogleOneTap() {
  useEffect(() => {
    console.log('Mounting GoogleOneTap');

    const initializeGoogleOneTap = () => {
      console.log('Initializing Google One Tap');

      if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        console.error('Missing Google Client ID');
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: async (response: any) => {
            console.log('Received response from Google:', response);
            try {
              const credential = GoogleAuthProvider.credential(
                response.credential,
              );
              await setPersistence(auth, browserLocalPersistence);
              const user = auth.currentUser;

              if (user) {
                await linkWithCredential(user, credential);
                console.log('Google account linked to the existing user');
              } else {
                await signInWithCredential(auth, credential);
                console.log('Successfully signed in with Google');
              }
            } catch (error) {
              console.error('Error signing in:', error);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: false,
          prompt_parent_id: 'google-one-tap',
          context: 'signin',
          itp_support: false,
          use_fedcm_for_prompt: true,
          native_callback: (response: any) => {
            console.log('Native callback response:', response);
          },
          error: (error: any) => {
            console.error('Google One Tap error:', error);
          },
        });
      } catch (error) {
        console.error('Error in Google One Tap initialization:', error);
      }
    };

    let retryCount = 0;
    const maxRetries = 3;
    let timeoutId: NodeJS.Timeout;

    const checkAndInitialize = () => {
      if (window.google?.accounts?.id) {
        initializeGoogleOneTap();

        // Only show the prompt for non-authenticated users
        onAuthStateChanged(auth, (user) => {
          if (!user) {
            window.google.accounts.id.prompt((notification: any) => {
              if (notification.isNotDisplayed()) {
                console.log(
                  'One Tap not displayed:',
                  notification.getNotDisplayedReason(),
                );
                const buttonElement = document.getElementById(
                  'google-signin-button',
                );
                if (buttonElement) {
                  buttonElement.style.display = 'block';
                  window.google.accounts.id.renderButton(buttonElement, {
                    theme: 'outline',
                    size: 'large',
                    type: 'standard',
                  });
                }
              } else if (notification.isSkippedMoment()) {
                console.log(
                  'One Tap skipped:',
                  notification.getSkippedReason(),
                );
              } else if (notification.isDismissedMoment()) {
                console.log(
                  'One Tap dismissed:',
                  notification.getDismissedReason(),
                );
              }
            });
          }
        });
      } else if (retryCount < maxRetries) {
        retryCount++;
        timeoutId = setTimeout(checkAndInitialize, 1000);
      } else {
        console.error('Failed to load Google One Tap after multiple retries');
      }
    };

    checkAndInitialize();

    return () => {
      window.google?.accounts?.id?.cancel();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', zIndex: 1000 }}>
      <div id="google-one-tap"></div>
      <div id="google-signin-button" style={{ display: 'none' }}></div>
    </div>
  );
}
