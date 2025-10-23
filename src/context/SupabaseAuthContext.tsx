'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

type AuthContextType = {
  user: User | null;
  supabase: SupabaseClient;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabase,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current session
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 👇 Google One Tap integration
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    if (!clientId) return;

    // Load Google One Tap
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          const { credential } = response;
          // Send token to backend or directly to Supabase for verification
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: credential,
          });

          if (error) console.error('Google sign-in error:', error);
          else setUser(data.user);
        },
      });
      // Show the prompt
      // @ts-ignore
      window.google.accounts.id.prompt();
    };
    document.body.appendChild(script);
  }, []);

  return (
    <AuthContext.Provider value={{ user, supabase }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
