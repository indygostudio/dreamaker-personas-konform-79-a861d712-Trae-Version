import { supabase } from '@/integrations/supabase/client';
import type { SubscriptionTier } from '@/types/subscription';

export interface ContributionData {
  contributionType: 'audio' | 'lyrics' | 'other';
  contentReference: string;
  durationSeconds?: number;
  wordCount?: number;
  metadata?: Record<string, any>;
}

export interface ContributionScore {
  volumeScore: number;
  qualityScore: number;
  impactScore: number;
  compositeScore: number;
}

export interface RoyaltyDistribution {
  userId: string;
  distributionPeriod: string; // YYYY-MM format
  contributionCredits: number;
  royaltyAmount: number;
}

export interface UserEquity {
  userId: string;
  equityPercentage: number;
  contributionBasedEquity: number;
  bonusEquity: number;
}

/**
 * Service for managing user contributions, scoring, and royalty distributions
 * in the Hivemind cooperative model.
 */
export const contributionService = {
  /**
   * Record a new contribution from a user
   */
  async recordContribution(userId: string, data: ContributionData) {
    try {
      const { data: contribution, error } = await supabase
        .from('user_contributions')
        .insert({
          user_id: userId,
          contribution_type: data.contributionType,
          content_reference: data.contentReference,
          duration_seconds: data.durationSeconds,
          word_count: data.wordCount,
          metadata: data.metadata || {}
        })
        .select()
        .single();

      if (error) throw error;
      
      // Initialize scoring for this contribution
      await this.initializeContributionScore(contribution.id);
      
      // Update user's contribution count and potentially award credits
      await this.updateUserContributionStats(userId);
      
      return contribution;
    } catch (error) {
      console.error('Error recording contribution:', error);
      throw error;
    }
  },

  /**
   * Initialize scoring for a new contribution
   */
  async initializeContributionScore(contributionId: string) {
    try {
      const { error } = await supabase
        .from('contribution_scores')
        .insert({
          contribution_id: contributionId,
          volume_score: 1.0, // Initial base score
          quality_score: 0.0, // Will be updated based on peer reviews
          impact_score: 0.0, // Will be updated based on usage
          composite_score: 0.3 // Initial weighted score (30% of volume score)
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error initializing contribution score:', error);
      throw error;
    }
  },

  /**
   * Update a user's contribution statistics
   */
  async updateUserContributionStats(userId: string) {
    try {
      // Get count of user's contributions
      const { data: contributions, error: countError } = await supabase
        .from('user_contributions')
        .select('id')
        .eq('user_id', userId);

      if (countError) throw countError;

      const contributionCount = contributions?.length || 0;
      
      // Award credits based on contribution count
      // 10 credits per contribution as a simple model
      const creditsToAward = 10;
      
      // Update user profile
      const { error: updateError } = await supabase.rpc('update_user_contribution_stats', {
        user_id: userId,
        credits_to_add: creditsToAward
      });

      if (updateError) throw updateError;
      
      // If this is their first contribution, mark them as a contributor
      if (contributionCount === 1) {
        const { error: contributorError } = await supabase
          .from('profiles')
          .update({ is_contributor: true })
          .eq('id', userId);

        if (contributorError) throw contributorError;
      }
      
      return { contributionCount, creditsAwarded: creditsToAward };
    } catch (error) {
      console.error('Error updating user contribution stats:', error);
      throw error;
    }
  },

  /**
   * Calculate a user's contribution score based on all their contributions
   */
  async calculateUserContributionScore(userId: string) {
    try {
      // This would normally call the database function, but for simplicity
      // we'll implement the calculation here
      
      // Get all user contributions with their scores
      const { data: contributionsWithScores, error } = await supabase
        .from('user_contributions')
        .select(`
          id,
          contribution_scores (volume_score, quality_score, impact_score, composite_score)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      // Calculate total score
      let totalScore = 0;
      contributionsWithScores?.forEach(contribution => {
        const score = contribution.contribution_scores[0];
        if (score) {
          totalScore += score.composite_score;
        }
      });

      // Update user's contribution score in profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ contribution_score: totalScore })
        .eq('id', userId);

      if (updateError) throw updateError;

      return totalScore;
    } catch (error) {
      console.error('Error calculating user contribution score:', error);
      throw error;
    }
  },

  /**
   * Get a user's equity information
   */
  async getUserEquity(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_equity')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"

      return data || {
        user_id: userId,
        equity_percentage: 0,
        contribution_based_equity: 0,
        bonus_equity: 0
      };
    } catch (error) {
      console.error('Error getting user equity:', error);
      throw error;
    }
  },

  /**
   * Get a user's royalty distribution history
   */
  async getUserRoyaltyHistory(userId: string) {
    try {
      const { data, error } = await supabase
        .from('royalty_distributions')
        .select('*')
        .eq('user_id', userId)
        .order('distribution_period', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting user royalty history:', error);
      throw error;
    }
  },

  /**
   * Calculate royalty distribution for a specific period
   * This would typically be run by an admin or scheduled job
   */
  async calculateRoyaltyDistribution(period: string, totalRevenue: number) {
    try {
      // Get all users with their contribution scores
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, contribution_score')
        .gt('contribution_score', 0);

      if (error) throw error;

      // Calculate total contribution score across all users
      const totalScore = users?.reduce((sum, user) => sum + (user.contribution_score || 0), 0) || 1;

      // Calculate and record royalty distribution for each user
      const distributions = [];
      for (const user of users || []) {
        const userScore = user.contribution_score || 0;
        const sharePercentage = userScore / totalScore;
        const royaltyAmount = totalRevenue * sharePercentage;

        // Record distribution
        const { data: distribution, error: distError } = await supabase
          .from('royalty_distributions')
          .insert({
            user_id: user.id,
            distribution_period: period,
            contribution_credits: userScore,
            royalty_amount: royaltyAmount,
            status: 'processed'
          })
          .select()
          .single();

        if (distError) throw distError;
        distributions.push(distribution);
      }

      return distributions;
    } catch (error) {
      console.error('Error calculating royalty distribution:', error);
      throw error;
    }
  },

  /**
   * Get contribution statistics for a user
   */
  async getUserContributionStats(userId: string) {
    try {
      // Get user profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('contribution_score, credits_earned_from_contributions')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Get user equity data
      const { data: equity, error: equityError } = await supabase
        .from('user_equity')
        .select('equity_percentage')
        .eq('user_id', userId)
        .single();

      if (equityError && equityError.code !== 'PGRST116') throw equityError;

      // Get contribution counts
      const { data: contributions, error: contribError } = await supabase
        .from('user_contributions')
        .select('contribution_type')
        .eq('user_id', userId);

      if (contribError) throw contribError;

      // Get royalty distribution data
      const { data: royalties, error: royaltyError } = await supabase
        .from('royalty_distributions')
        .select('distribution_period, royalty_amount')
        .eq('user_id', userId)
        .order('distribution_period', { ascending: false });

      if (royaltyError) throw royaltyError;

      // Calculate contribution stats
      const audioCount = contributions?.filter(c => c.contribution_type === 'audio').length || 0;
      const lyricsCount = contributions?.filter(c => c.contribution_type === 'lyrics').length || 0;
      const otherCount = contributions?.filter(c => c.contribution_type === 'other').length || 0;
      const totalCount = audioCount + lyricsCount + otherCount;

      // Calculate total and monthly royalties
      const totalRoyalties = royalties?.reduce((sum, r) => sum + r.royalty_amount, 0) || 0;
      const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM format
      const monthlyRoyalties = royalties?.find(r => r.distribution_period === currentMonth)?.royalty_amount || 0;

      return {
        totalContributions: totalCount,
        audioContributions: audioCount,
        lyricsContributions: lyricsCount,
        otherContributions: otherCount,
        contributionScore: profile?.contribution_score || 0,
        equityPercentage: equity?.equity_percentage || 0,
        monthlyRoyalties,
        totalRoyalties,
        creditsEarned: profile?.credits_earned_from_contributions || 0,
        royaltyHistory: royalties || []
      };
    } catch (error) {
      console.error('Error getting user contribution stats:', error);
      throw error;
    }
  }
};