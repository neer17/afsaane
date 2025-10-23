'use client';
import { createClient } from '@/lib/SupabaseClient';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();

    // Disable auto-select for Google One Tap
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }

    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Sign Out
    </button>
  );
}
