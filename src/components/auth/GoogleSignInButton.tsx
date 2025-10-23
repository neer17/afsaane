// 'use client'
import { useEffect, useRef } from 'react';

const GoogleSignInButton = () => {
  const buttonRef = useRef<HTMLDivElement>(null);

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Generate nonce for secure authentication
  const generateNonce = async (): Promise<[string, string]> => {
    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
    );
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return [nonce, hashedNonce];
  };

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

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;

    script.onload = async () => {
      if (!window.google || !buttonRef.current) return;

      const [nonce, hashedNonce] = await generateNonce(); // Use your nonce function
      const supabase = createSupabaseClient(); // Use your supabase client

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: response.credential,
            nonce,
          });

          if (!error) {
            window.location.href = '/';
          }
        },
        nonce: hashedNonce,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
      });
    };

    document.body.appendChild(script);
  }, []);

  return <div ref={buttonRef} />;
};
