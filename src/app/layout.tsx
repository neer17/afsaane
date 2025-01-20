import type { Metadata } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/navbar/Navbar';
import SlidingBanner from '@/components/banner/SlidingBanner';
import CartProvider from '@/context/CartContext';
import AuthProvider from '@/context/AuthContext';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
  other: {
    'google-signin-client_id': process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          
          // onLoad={() => {
          //   console.log('Google Script loaded successfully');
          // }}
        />
        <meta name="google-signin-client_id" content={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <CartProvider>
            <div>
              <SlidingBanner />
              <Navbar />
            </div>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
