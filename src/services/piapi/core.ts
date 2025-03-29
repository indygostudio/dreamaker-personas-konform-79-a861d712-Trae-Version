
import { supabase } from "@/integrations/supabase/client";
import { PiapiModel } from './types';

// Core API service functions
export const coreService = {
  async getModels(retryCount = 3): Promise<PiapiModel[]> {
    try {
      for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
          const { data, error } = await supabase.functions.invoke('piapi-service', {
            body: { action: 'getModels', params: {} }
          });

          if (error) {
            if (error.message?.includes('rate limit') && attempt < retryCount) {
              await new Promise(resolve => setTimeout(resolve, attempt * 1000));
              continue;
            }
            console.error(`Error fetching models (attempt ${attempt}/${retryCount}):`, error);
            throw new Error(`API Error: ${error.message || 'Unknown error'}`);
          }
          
          return data.models || [];
        } catch (innerError) {
          if (attempt === retryCount) throw innerError;
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
      }
      return [];
    } catch (error) {
      console.error('Error in getModels:', error);
      throw new Error(`Failed to fetch models: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Get user's generation history
  async getGenerationHistory(type?: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_generations')
        .select('*')
        .eq('generation_type', type || '')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching generation history:', error);
      return [];
    }
  }
};

export type { PiapiModel };
