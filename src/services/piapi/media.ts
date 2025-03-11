
import { supabase } from "@/integrations/supabase/client";
import { GenerationResult } from './types';

// Standard media generation services (image, video, text, voice, avatar)
export const mediaService = {
  async generateImage(params: {
    model: string;
    prompt: string;
    negative_prompt?: string;
    width?: number;
    height?: number;
    samples?: number;
  }): Promise<GenerationResult> {
    const { data, error } = await supabase.functions.invoke('piapi-service', {
      body: { action: 'generateImage', params }
    });

    if (error) throw error;
    return data;
  },

  async generateVideo(params: {
    model: string;
    prompt: string;
    negative_prompt?: string;
    width?: number;
    height?: number;
    duration?: number;
  }): Promise<GenerationResult> {
    const { data, error } = await supabase.functions.invoke('piapi-service', {
      body: { action: 'generateVideo', params }
    });

    if (error) throw error;
    return data;
  },

  async generateText(params: {
    model: string;
    prompt: string;
    max_tokens?: number;
    temperature?: number;
  }): Promise<GenerationResult> {
    const { data, error } = await supabase.functions.invoke('piapi-service', {
      body: { action: 'generateText', params }
    });

    if (error) throw error;
    return data;
  },

  async generateVoice(params: {
    model: string;
    text: string;
    voice_id?: string;
  }): Promise<GenerationResult> {
    const { data, error } = await supabase.functions.invoke('piapi-service', {
      body: { action: 'generateVoice', params }
    });

    if (error) throw error;
    return data;
  },

  async generateAvatar(params: {
    model: string;
    prompt: string;
    gender?: 'male' | 'female' | 'neutral';
    style?: string;
  }): Promise<GenerationResult> {
    const { data, error } = await supabase.functions.invoke('piapi-service', {
      body: { action: 'generateAvatar', params }
    });

    if (error) throw error;
    return data;
  }
};
