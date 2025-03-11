
import { supabase } from "@/integrations/supabase/client";
import { PiapiModel } from './types';

// Core API service functions
export const coreService = {
  async getModels(): Promise<PiapiModel[]> {
    try {
      const { data, error } = await supabase.functions.invoke('piapi-service', {
        body: { action: 'getModels', params: {} }
      });

      if (error) {
        console.error('Error fetching models:', error);
        throw error;
      }
      
      return data.models || [];
    } catch (error) {
      console.error('Error in getModels:', error);
      return [];
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
