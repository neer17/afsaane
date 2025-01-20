'use client';
import { useEffect } from 'react';
import { auth } from '../../../../lib/firebase/config';
import { GoogleAuthProvider, signInWithCredential, signOut } from 'firebase/auth';

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (momentListener?: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          cancel: () => void;
          revoke: (email: string, callback: () => void) => void;
        };
      };
    };
  }
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
              const credential = GoogleAuthProvider.credential(response.credential);
              await signInWithCredential(auth, credential);
              console.log('Successfully signed in');
            } catch (error) {
              console.error('Error signing in:', error);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: false,
          prompt_parent_id: 'google-one-tap',
          context: 'signin',
          itp_support: false, // Added to handle ITP issues
          use_fedcm_for_prompt: true, // Added to explicitly enable FedCM
          native_callback: (response: any) => {
            // Added native callback
            console.log('Native callback response:', response);
          },
        });

        // Render a button as fallback
        const buttonElement = document.getElementById('google-signin-button');
        if (buttonElement) {
          window.google.accounts.id.renderButton(buttonElement, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
          });
        }

        // Modified prompt timing and error handling
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            console.log('One Tap not displayed:', notification.getNotDisplayedReason());
            // Fallback to button if One Tap isn't displayed
            const buttonElement = document.getElementById('google-signin-button');
            if (buttonElement) {
              buttonElement.style.display = 'block';
            }
          } else if (notification.isSkippedMoment()) {
            console.log('One Tap skipped:', notification.getSkippedReason());
          } else if (notification.isDismissedMoment()) {
            console.log('One Tap dismissed:', notification.getDismissedReason());
          }
        });
      } catch (error) {
        console.error('Error in Google One Tap initialization:', error);
      }
    };

    // Check for Google script loading with retry mechanism
    let retryCount = 0;
    const maxRetries = 3;

    const checkAndInitialize = () => {
      if (window.google?.accounts?.id) {
        initializeGoogleOneTap();
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(checkAndInitialize, 1000);
      } else {
        console.error('Failed to load Google One Tap after multiple retries');
      }
    };

    checkAndInitialize();

    return () => {
      window.google?.accounts?.id?.cancel();
    };
  }, []);

  return (
    <div style={{ position: 'relative', zIndex: 1000 }}>
      <div id="google-one-tap"></div>
      <div id="google-signin-button" style={{ display: 'none' }}></div>
    </div>
  );
}
