
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SubscriptionTier } from '@/types/subscription';

export const useSubscription = () => {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setTier('free');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // Use type guard to ensure valid subscription tier
        const isValidTier = (tier: string): tier is SubscriptionTier => {
          return ['free', 'pro', 'enterprise'].includes(tier);
        };

        const subscriptionTier = profile?.subscription_tier || 'free';
        setTier(isValidTier(subscriptionTier) ? subscriptionTier : 'free');
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  return { tier, loading, error };
};
