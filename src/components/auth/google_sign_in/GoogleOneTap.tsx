import { useEffect, useRef, useState } from 'react';
import GoogleSignInButton from './GoogleSignInButton';

// Type definitions for Google One Tap
interface CredentialResponse {
  credential: string;
  select_by: string;
}

interface GoogleAccounts {
  id: {
    initialize: (config: any) => void;
    prompt: (notification?: (notification: any) => void) => void;
    cancel: () => void;
  };
}

declare global {
  interface Window {
    google?: {
      accounts: GoogleAccounts;
    };
  }
}

// Replace these with your actual configuration
const SUPABASE_URL = 'https://fufjeihntairffrizntr.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1ZmplaWhudGFpcmZmcml6bnRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4Njg1NjcsImV4cCI6MjA3NjQ0NDU2N30.89VUV3PrW041_QHVHVY0B0lWtaXJfB6dzRPXMjg9X8I';
const GOOGLE_CLIENT_ID =
  '941002876266-epl8ea1t7grp19a4urmm65pfbp3asnqj.apps.googleusercontent.com';

// Simple Supabase client creator
const createSupabaseClient = () => {
  const getAccessToken = () => {
    try {
      const session = localStorage.getItem(
        `sb-${SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token`,
      );
      if (session) {
        const parsed = JSON.parse(session);
        return parsed?.access_token;
      }
    } catch (e) {
      console.error('Error reading session:', e);
    }
    return null;
  };

  return {
    auth: {
      getSession: async () => {
        const accessToken = getAccessToken();

        if (!accessToken) {
          return { data: { session: null }, error: null };
        }

        const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          return { data: { session: { user } }, error: null };
        }
        return { data: { session: null }, error: null };
      },
      signInWithIdToken: async ({ provider, token, nonce }: any) => {
        const response = await fetch(
          `${SUPABASE_URL}/auth/v1/token?grant_type=id_token`,
          {
            method: 'POST',
            headers: {
              apikey: SUPABASE_ANON_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              provider,
              id_token: token,
              nonce,
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();

          const storageKey = `sb-${SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token`;
          localStorage.setItem(storageKey, JSON.stringify(data));

          return { data, error: null };
        }

        const error = await response.json();
        return { data: null, error };
      },
    },
  };
};

// Generate nonce for secure authentication
const generateNonce = async (): Promise<[string, string]> => {
  // Create random bytes array
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);

  // Convert to base64 string without spread operator
  const nonce = btoa(
    Array.from(randomBytes, (byte) => String.fromCharCode(byte)).join(''),
  );

  const encoder = new TextEncoder();
  const encodedNonce = encoder.encode(nonce);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);

  // Use Array.from directly without spread operator
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedNonce = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return [nonce, hashedNonce];
};

const GoogleOneTap = () => {
  const initialized = useRef(false);
  const [showGoogleSignInButton, setShowGoogleSignInButton] = useState(false);

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (initialized.current) return;

    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      // Script already loaded, initialize directly
      if (window.google) {
        initializeGoogleOneTap();
      } else {
        // Wait for script to be ready
        existingScript.addEventListener('load', () => {
          setTimeout(() => initializeGoogleOneTap(), 100);
        });
      }
      return;
    }

    // Load Google One Tap script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('Google GSI script loaded');
      // Add small delay to ensure SDK is fully initialized
      setTimeout(() => {
        initializeGoogleOneTap();
      }, 100);
    };

    script.onerror = () => {
      console.error('Failed to load Google GSI script');
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, []);

  const initializeGoogleOneTap = async () => {
    // Prevent multiple initializations
    if (initialized.current) {
      console.log('Already initialized, skipping');
      return;
    }

    console.log('Initializing Google One Tap');

    // Validate configuration
    if (!GOOGLE_CLIENT_ID || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error(
        'Missing configuration: GOOGLE_CLIENT_ID, SUPABASE_URL, or SUPABASE_ANON_KEY',
      );
      return;
    }

    // Check if Google SDK is available
    if (!window.google?.accounts?.id) {
      console.error('Google accounts SDK not available');
      return;
    }

    try {
      // Generate nonce for security
      const [nonce, hashedNonce] = await generateNonce();
      console.log('Nonce generated successfully');

      // Create Supabase client
      const supabase = createSupabaseClient();

      // Check if user is already logged in
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
      }

      if (data.session) {
        console.log('User already logged in, skipping One Tap');
        return;
      }

      // Mark as initialized before calling initialize
      initialized.current = true;

      // Initialize Google One Tap
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: CredentialResponse) => {
          try {
            console.log('Google One Tap callback triggered');
            console.log('Credential received, signing in...');

            // Sign in with the ID token
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce,
            });

            if (error) {
              console.error('Supabase sign in error:', error);
              throw error;
            }

            console.log('Successfully logged in with Google One Tap');
            console.log('Session data:', data);

            // Redirect to home
            window.location.href = '/';
          } catch (error) {
            console.error('Error in Google One Tap callback:', error);

            // Show sign in button when Google One Tap fails
            setShowGoogleSignInButton(true);
          }
        },
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
        auto_select: false, // Set to false for debugging
        cancel_on_tap_outside: false,
        itp_support: true,
      });

      console.log('Google One Tap initialized, displaying prompt...');

      // Display the One Tap prompt with notification callback
      window.google.accounts.id.prompt((notification) => {
        console.log('Prompt notification:', notification);

        if (notification.isNotDisplayed()) {
          console.warn(
            'Prompt not displayed:',
            notification.getNotDisplayedReason(),
          );
          // opt_out_or_no_session means user is not signed into Google
          // This is normal - One Tap only works for signed-in Google users
        } else if (notification.isSkippedMoment()) {
          console.warn('Prompt skipped:', notification.getSkippedReason());
        } else if (notification.isDismissedMoment()) {
          console.warn('Prompt dismissed:', notification.getDismissedReason());
        }
      });

      console.log('Prompt called successfully');
    } catch (error) {
      console.error('Error in initializeGoogleOneTap:', error);
      initialized.current = false; // Reset on error

      // Show sign in button when Google One Tap fails
      setShowGoogleSignInButton(true);
    }
  };

  return showGoogleSignInButton ? <GoogleSignInButton /> : null;
};

export default GoogleOneTap;
