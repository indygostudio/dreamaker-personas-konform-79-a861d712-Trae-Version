
import { supabase } from "@/integrations/supabase/client";
import { 
  GenerationResult,
  SunoMusicParams, 
  UdioMusicParams, 
  SongExtendParams,
  UploadAudioParams,
  ConcatMusicParams,
  SunoLyricsParams,
  UdioLyricsParams,
  MusicModel
} from './types';

// Music generation services
export const musicService = {
  async generateMusic(params: SunoMusicParams | UdioMusicParams): Promise<GenerationResult> {
    const model = params.model;
    const isUdio = model.includes('music-u');
    const taskType = 'generate_music';
    
    // Prepare the request body based on the model
    let requestParams: any = { ...params };
    
    console.log(`Generating music with ${model} model`, requestParams);
    
    const { data, error } = await supabase.functions.invoke('piapi-service', {
      body: { action: 'generateMusic', params: requestParams }
    });

    if (error) throw error;
    return data;
  },

  async generateMusicCustom(params: {
    model: string;
    title?: string;
    prompt: string;
    tags?: string;
    negative_tags?: string;
  }): Promise<GenerationResult> {
    console.log('Generating custom music with params:', params);
    
    const { data, error } = await supabase.functions.invoke('piapi-service', {
      body: { action: 'generateMusicCustom', params }
    });

    if (error) throw error;
    return data;
  },

  async extendSong(params: SongExtendParams): Promise<GenerationResult> {
    console.log('Extending song with params:', params);
    
    const { data, error } = await supabase.functions.invoke('piapi-service', {
      body: { action: 'extendSong', params }
    });

    if (error) throw error;
    return data;
  },

  async uploadAudio(params: UploadAudioParams): Promise<GenerationResult> {
    console.log('Uploading audio with params:', params);
    
    const { data, error } = await supabase.functions.invoke('piapi-service', {
      body: { action: 'uploadAudio', params }
    });

    if (error) throw error;
    return data;
  },

  async generateFullSong(params: ConcatMusicParams): Promise<GenerationResult> {
    console.log('Generating full song with params:', params);
    
    const { data, error } = await supabase.functions.invoke('piapi-service', {
      body: { action: 'concatMusic', params }
    });

    if (error) throw error;
    return data;
  },

  async generateLyrics(params: { 
    model: MusicModel; 
    prompt: string;
    genre?: string;
    style?: string;
  }): Promise<GenerationResult> {
    console.log('Generating lyrics with params:', params);
    
    const { data, error } = await supabase.functions.invoke('piapi-service', {
      body: { action: 'generateLyrics', params }
    });

    if (error) throw error;
    
    // Process the response to match the expected format
    return {
      ...data,
      status: data.status || 'complete',
      text: data.text || (data.lyrics_pairs && data.lyrics_pairs[0]?.text) || "No lyrics generated.",
    };
  },

  async getMusicTaskStatus(taskId: string): Promise<GenerationResult> {
    console.log('Checking music task status:', taskId);
    
    const { data, error } = await supabase.functions.invoke('piapi-service', {
      body: { action: 'getTaskStatus', params: { taskId } }
    });

    if (error) throw error;
    return data;
  }
};
