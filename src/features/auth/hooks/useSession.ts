import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/store/authStore';

// Mounted once at app root. Syncs Supabase auth state into Zustand
// so any component can read `user` synchronously without a query.
export function useSession() {
  const setUser = useAuthStore((state) => state.setUser);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ? { id: data.session.user.id, email: data.session.user.email ?? null } : null);
      setInitialized(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? null } : null);
    });

    return () => subscription.subscription.unsubscribe();
  }, [setUser, setInitialized]);
}