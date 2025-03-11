
import { supabase } from "@/integrations/supabase/client";
import { 
  MidjourneyGenerationResult, 
} from './types';
import { 
  MidjourneyAspectRatio, 
  MidjourneyProcessMode,
  MidjourneyUpscaleIndex,
  MidjourneyVariationIndex,
  MidjourneyDimension
} from '@/types/persona';

// Midjourney specific methods
export const midjourneyService = {
  async generateImage(params: {
    prompt: string;
    aspect_ratio?: MidjourneyAspectRatio;
    process_mode?: MidjourneyProcessMode;
    skip_prompt_check?: boolean;
    config?: any;
  }): Promise<MidjourneyGenerationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('piapi-service', {
        body: { action: 'generateMidjourneyImage', params }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating Midjourney image:', error);
      throw error;
    }
  },

  async checkTaskStatus(taskId: string): Promise<MidjourneyGenerationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('piapi-service', {
        body: { action: 'checkMidjourneyTaskStatus', params: { taskId } }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking Midjourney task status:', error);
      throw error;
    }
  },
  
  async upscaleImage(params: {
    origin_task_id: string;
    index: MidjourneyUpscaleIndex;
    config?: any;
  }): Promise<MidjourneyGenerationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('piapi-service', {
        body: { action: 'upscaleMidjourneyImage', params }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error upscaling Midjourney image:', error);
      throw error;
    }
  },
  
  async createVariation(params: {
    origin_task_id: string;
    index: MidjourneyVariationIndex;
    prompt: string;
    aspect_ratio?: MidjourneyAspectRatio;
    skip_prompt_check?: boolean;
    config?: any;
  }): Promise<MidjourneyGenerationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('piapi-service', {
        body: { action: 'createMidjourneyVariation', params }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating Midjourney variation:', error);
      throw error;
    }
  },
  
  async rerollImage(params: {
    origin_task_id: string;
    prompt?: string;
    aspect_ratio?: MidjourneyAspectRatio;
    skip_prompt_check?: boolean;
    config?: any;
  }): Promise<MidjourneyGenerationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('piapi-service', {
        body: { action: 'rerollMidjourneyImage', params }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error rerolling Midjourney image:', error);
      throw error;
    }
  },
  
  async describeImage(params: {
    image_url: string;
    process_mode?: MidjourneyProcessMode;
    config?: any;
  }): Promise<MidjourneyGenerationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('piapi-service', {
        body: { action: 'describeMidjourneyImage', params }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error describing image with Midjourney:', error);
      throw error;
    }
  },
  
  async blendImages(params: {
    image_urls: string[];
    process_mode?: MidjourneyProcessMode;
    dimension?: MidjourneyDimension;
    config?: any;
  }): Promise<MidjourneyGenerationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('piapi-service', {
        body: { action: 'blendMidjourneyImages', params }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error blending images with Midjourney:', error);
      throw error;
    }
  },
  
  async getTaskSeed(params: {
    origin_task_id: string;
    config?: any;
  }): Promise<MidjourneyGenerationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('piapi-service', {
        body: { action: 'getMidjourneyTaskSeed', params }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting Midjourney task seed:', error);
      throw error;
    }
  },
  
  async cancelTask(taskId: string): Promise<{ code: number; message: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('piapi-service', {
        body: { action: 'cancelMidjourneyTask', params: { taskId } }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error cancelling Midjourney task:', error);
      throw error;
    }
  }
};
