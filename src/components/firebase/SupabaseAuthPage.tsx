import React, { useState } from 'react';
import { useAuth } from '@/context/SupabaseAuthContext';

export default function AuthPage() {
  const { user } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [phase, setPhase] = useState<'input' | 'otp'>('input');
  const [loading, setLoading] = useState(false);

  if (user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h2>Welcome, {user.email}</h2>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      await sendOtp(phone);
      setPhase('otp');
      alert('OTP sent successfully');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      await verifyOtp(phone, otp);
      alert('Signed in successfully');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', textAlign: 'center' }}>
      <h2>Sign In</h2>
      <button onClick={signInWithGoogle}>Sign in with Google</button>

      <div style={{ marginTop: 24 }}>
        {phase === 'input' && (
          <>
            <input
              placeholder="+919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', padding: 8, marginBottom: 8 }}
            />
            <button onClick={handleSendOtp} disabled={loading || !phone}>
              Send OTP
            </button>
          </>
        )}

        {phase === 'otp' && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ width: '100%', padding: 8, marginBottom: 8 }}
            />
            <button onClick={handleVerifyOtp} disabled={loading || !otp}>
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
