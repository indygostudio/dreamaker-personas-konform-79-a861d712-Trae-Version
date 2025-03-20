
export type SubscriptionTier = 'unsigned' | 'indie' | 'pro' | 'label';

export interface SubscriptionCredits {
  total: number;
  used: number;
  remaining: number;
}

export interface UserSubscription {
  tier: SubscriptionTier;
  expiresAt: string | null;
}
