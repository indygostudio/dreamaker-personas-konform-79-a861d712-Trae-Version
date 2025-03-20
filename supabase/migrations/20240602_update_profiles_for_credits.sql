-- Add credit tracking fields to profiles table
ALTER TABLE IF EXISTS profiles
  ADD COLUMN IF NOT EXISTS monthly_credits INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS credits_used INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS credits_earned_from_contributions INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_credit_reset TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS is_contributor BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS contributor_tier VARCHAR(20) DEFAULT 'basic',
  ADD COLUMN IF NOT EXISTS contribution_score DECIMAL(10, 2) DEFAULT 0;

-- Create function to reset monthly credits based on subscription tier
CREATE OR REPLACE FUNCTION reset_monthly_credits()
RETURNS TRIGGER AS $$
BEGIN
  -- Set monthly credits based on subscription tier
  IF NEW.subscription_tier = 'unsigned' THEN
    NEW.monthly_credits := 500;
  ELSIF NEW.subscription_tier = 'indie' THEN
    NEW.monthly_credits := 2000;
  ELSIF NEW.subscription_tier = 'pro' THEN
    NEW.monthly_credits := 10000;
  ELSIF NEW.subscription_tier = 'label' THEN
    NEW.monthly_credits := 999999; -- Effectively unlimited
  END IF;
  
  -- Reset credits used
  NEW.credits_used := 0;
  
  -- Update last reset timestamp
  NEW.last_credit_reset := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to reset credits when subscription changes
CREATE TRIGGER reset_credits_on_subscription_change
  BEFORE UPDATE OF subscription_tier ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION reset_monthly_credits();

-- Create function to calculate contribution score
CREATE OR REPLACE FUNCTION calculate_contribution_score(user_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  volume_weight DECIMAL := 0.3;
  quality_weight DECIMAL := 0.4;
  impact_weight DECIMAL := 0.3;
  total_score DECIMAL := 0;
BEGIN
  SELECT SUM((cs.volume_score * volume_weight) + 
             (cs.quality_score * quality_weight) + 
             (cs.impact_score * impact_weight))
  INTO total_score
  FROM user_contributions uc
  JOIN contribution_scores cs ON uc.id = cs.contribution_id
  WHERE uc.user_id = user_uuid;
  
  RETURN COALESCE(total_score, 0);
END;
$$ LANGUAGE plpgsql;

-- Create function to update user equity based on contribution score
CREATE OR REPLACE FUNCTION update_user_equity()
RETURNS TRIGGER AS $$
DECLARE
  total_contribution_score DECIMAL;
  user_score DECIMAL;
  equity_percentage DECIMAL;
BEGIN
  -- Get total contribution score across all users
  SELECT COALESCE(SUM(contribution_score), 1) INTO total_contribution_score FROM profiles WHERE contribution_score > 0;
  
  -- Calculate equity percentage based on contribution score
  user_score := NEW.contribution_score;
  equity_percentage := (user_score / total_contribution_score) * 100;
  
  -- Update or insert user equity record
  INSERT INTO user_equity (user_id, equity_percentage, contribution_based_equity, last_updated)
  VALUES (NEW.id, equity_percentage, equity_percentage, NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    equity_percentage = equity_percentage,
    contribution_based_equity = equity_percentage,
    last_updated = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update equity when contribution score changes
CREATE TRIGGER update_equity_on_score_change
  AFTER UPDATE OF contribution_score ON profiles
  FOR EACH ROW
  WHEN (NEW.contribution_score <> OLD.contribution_score)
  EXECUTE FUNCTION update_user_equity();