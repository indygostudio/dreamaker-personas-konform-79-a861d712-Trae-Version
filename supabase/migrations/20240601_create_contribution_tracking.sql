-- Create enum for contribution types
CREATE TYPE contribution_type AS ENUM ('audio', 'lyrics', 'other');

-- Create table for tracking user contributions
CREATE TABLE IF NOT EXISTS user_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contribution_type contribution_type NOT NULL,
  content_reference TEXT NOT NULL, -- Reference to the contributed content (file path, track ID, etc.)
  duration_seconds INTEGER, -- For audio contributions
  word_count INTEGER, -- For lyric contributions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb, -- Additional metadata about the contribution
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create table for contribution scoring
CREATE TABLE IF NOT EXISTS contribution_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contribution_id UUID NOT NULL REFERENCES user_contributions(id) ON DELETE CASCADE,
  volume_score DECIMAL(10, 2) DEFAULT 0, -- Based on quantity metrics
  quality_score DECIMAL(10, 2) DEFAULT 0, -- Based on peer/expert ratings
  impact_score DECIMAL(10, 2) DEFAULT 0, -- Based on usage frequency
  composite_score DECIMAL(10, 2) DEFAULT 0, -- Weighted combination of scores
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_contribution FOREIGN KEY (contribution_id) REFERENCES user_contributions(id) ON DELETE CASCADE
);

-- Create table for tracking contribution usage in AI-generated content
CREATE TABLE IF NOT EXISTS contribution_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contribution_id UUID NOT NULL REFERENCES user_contributions(id) ON DELETE CASCADE,
  output_reference TEXT NOT NULL, -- Reference to the AI-generated output
  usage_weight DECIMAL(10, 2) DEFAULT 1.0, -- Weight of this contribution in the output
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_contribution FOREIGN KEY (contribution_id) REFERENCES user_contributions(id) ON DELETE CASCADE
);

-- Create table for royalty distribution records
CREATE TABLE IF NOT EXISTS royalty_distributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  distribution_period VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  contribution_credits DECIMAL(10, 2) DEFAULT 0, -- Credits earned from contributions
  royalty_amount DECIMAL(10, 2) DEFAULT 0, -- Monetary amount distributed
  distribution_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status VARCHAR(20) DEFAULT 'pending', -- pending, processed, failed
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create table for tracking user equity in the cooperative
CREATE TABLE IF NOT EXISTS user_equity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  equity_percentage DECIMAL(10, 6) DEFAULT 0, -- User's equity stake as a percentage
  contribution_based_equity DECIMAL(10, 6) DEFAULT 0, -- Equity from contributions
  bonus_equity DECIMAL(10, 6) DEFAULT 0, -- Bonus equity (e.g., for early adopters)
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_equity UNIQUE (user_id)
);

-- Add RLS policies for user_contributions table
ALTER TABLE IF EXISTS user_contributions ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Users can view their own contributions
CREATE POLICY "Users can view their own contributions" 
ON user_contributions FOR SELECT 
USING (user_id = auth.uid());

-- Policy for INSERT: Users can add their own contributions
CREATE POLICY "Users can add their own contributions" 
ON user_contributions FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Policy for UPDATE: Users can update their own contributions
CREATE POLICY "Users can update their own contributions" 
ON user_contributions FOR UPDATE 
USING (user_id = auth.uid());

-- Add RLS policies for contribution_scores table
ALTER TABLE IF EXISTS contribution_scores ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Users can view scores for their own contributions
CREATE POLICY "Users can view their own contribution scores" 
ON contribution_scores FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_contributions uc 
    WHERE uc.id = contribution_id AND uc.user_id = auth.uid()
  )
);

-- Add RLS policies for royalty_distributions table
ALTER TABLE IF EXISTS royalty_distributions ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Users can view their own royalty distributions
CREATE POLICY "Users can view their own royalty distributions" 
ON royalty_distributions FOR SELECT 
USING (user_id = auth.uid());

-- Add RLS policies for user_equity table
ALTER TABLE IF EXISTS user_equity ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Users can view their own equity information
CREATE POLICY "Users can view their own equity information" 
ON user_equity FOR SELECT 
USING (user_id = auth.uid());