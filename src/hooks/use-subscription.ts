
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SubscriptionTier } from '@/types/subscription';

export const useSubscription = () => {
  const [tier, setTier] = useState<SubscriptionTier>('unsigned');
  const [credits, setCredits] = useState<SubscriptionCredits>({ total: 0, used: 0, remaining: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setTier('unsigned');
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
          return ['unsigned', 'indie', 'pro', 'label'].includes(tier);
        };

        const subscriptionTier = profile?.subscription_tier || 'unsigned';
        setTier(isValidTier(subscriptionTier) ? subscriptionTier : 'unsigned');
        
        // Set credits based on tier
        const tierCredits = {
          'unsigned': 500,
          'indie': 2000,
          'pro': 10000,
          'label': 999999 // Effectively unlimited
        };
        
        // In a real implementation, you would fetch the used credits from the database
        // For now, we'll just set a placeholder value
        const usedCredits = profile?.credits?.used || 0;
        const totalCredits = tierCredits[isValidTier(subscriptionTier) ? subscriptionTier : 'unsigned'];
        
        setCredits({
          total: totalCredits,
          used: usedCredits,
          remaining: totalCredits - usedCredits
        });
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
