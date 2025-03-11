
import { supabase } from "@/integrations/supabase/client";
import { GenerationResult, FaceSwapParams, FaceSwapVideoParams } from './types';

// Face swap services
export const faceSwapService = {
  async swapFace(params: FaceSwapParams): Promise<GenerationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('piapi-service', {
        body: { action: 'swapFace', params }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error swapping face:', error);
      throw error;
    }
  },

  async swapFaceInVideo(params: FaceSwapVideoParams): Promise<GenerationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('piapi-service', {
        body: { action: 'swapFaceInVideo', params }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error swapping face in video:', error);
      throw error;
    }
  },
  
  async checkTaskStatus(taskId: string): Promise<GenerationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('piapi-service', {
        body: { action: 'checkFaceSwapTaskStatus', params: { taskId } }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking face swap task status:', error);
      throw error;
    }
  }
};
