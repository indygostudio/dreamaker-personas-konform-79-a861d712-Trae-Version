
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface UserSubscription {
  tier: SubscriptionTier;
  expiresAt: string | null;
}
