-- Update subscription_tier enum to include all tiers
ALTER TYPE subscription_tier RENAME TO subscription_tier_old;

-- Create new enum with all tiers
CREATE TYPE subscription_tier AS ENUM ('unsigned', 'indie', 'pro', 'label');

-- Update profiles table to use new enum
ALTER TABLE profiles 
  ALTER COLUMN subscription_tier TYPE subscription_tier 
  USING subscription_tier::text::subscription_tier;

-- Drop old enum
DROP TYPE subscription_tier_old;