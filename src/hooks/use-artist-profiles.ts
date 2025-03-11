
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ArtistProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  user_bio: string | null;
  genre: string[] | null;
  is_public: boolean;
  persona_ids: string[];
  persona_count: number;
  video_url: string | null;
  created_at: string;
  location?: string | null;
  type?: 'AI_VOCALIST' | 'AI_INSTRUMENTALIST' | 'AI_MIXER' | 'AI_ARTIST' | 'AI_EFFECT' | 'AI_INSTRUMENT';
  model_url?: string | null;
  animation_preset?: string;
  has_3d_model?: boolean;
}

// Define the database response type
interface DatabaseArtistProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  user_bio: string | null;
  genre: string[] | null;
  is_public: boolean;
  persona_ids: string[];
  persona_count: number;
  video_url: string | null;
  created_at: string;
  location: string | null;
  type?: 'AI_VOCALIST' | 'AI_INSTRUMENTALIST' | 'AI_MIXER' | 'AI_ARTIST' | 'AI_EFFECT' | 'AI_INSTRUMENT' | null;
  model_url: string | null;
  animation_preset: string | null;
  has_3d_model: boolean | null;
}

export const useArtistProfiles = () => {
  return useQuery({
    queryKey: ["artist-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artist_profiles")
        .select("*")
        .eq("is_public", true);

      if (error) throw error;
      
      const transformedData = (data as DatabaseArtistProfile[] || []).map(profile => ({
        ...profile,
        animation_preset: profile.animation_preset || 'rotate',
        has_3d_model: profile.has_3d_model || false,
        persona_ids: profile.persona_ids || [],
        persona_count: profile.persona_count || 0,
        type: profile.type || 'AI_ARTIST' // Default to AI_ARTIST if no type is specified
      }));

      return transformedData as ArtistProfile[];
    },
  });
};
