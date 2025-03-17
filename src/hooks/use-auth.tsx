
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Initialize session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, currentSession: Session | null) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          setSession(currentSession);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, signOut };
};
