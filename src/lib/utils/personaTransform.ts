import type { Persona } from "@/types/persona";

export const transformPersonaData = (rawPersona: any): Persona => {
  console.log('Raw persona is_collab value:', rawPersona.name, rawPersona.is_collab); // Debug log
  
  // Keep the original boolean value without transformation
  const transformedPersona = {
    ...rawPersona,
    // Only set default values for other fields, preserve is_collab as is
    likes_count: rawPersona.likes_count || 0,
    user_count: rawPersona.user_count || 0,
    followers_count: rawPersona.followers_count || 0,
    banner_darkness: rawPersona.banner_darkness || 50,
    dataset_contributions: rawPersona.dataset_contributions || {
      midi: 0,
      audio: 0,
      lyrics: 0
    },
    privacy_settings: rawPersona.privacy_settings || {
      tracks_visible: true,
      datasets_visible: true
    },
    analytics: rawPersona.analytics || {
      streams: 0,
      avg_duration: 0
    },
    monetization_stats: rawPersona.monetization_stats || {
      sales: 0,
      royalties: 0
    },
    ai_influence_metrics: rawPersona.ai_influence_metrics || {
      influence_percentage: 0,
      featured_tracks: []
    },
    featured_works: rawPersona.featured_works || [],
    achievements: rawPersona.achievements || []
  };

  console.log('Transformed persona is_collab value:', transformedPersona.name, transformedPersona.is_collab); // Debug log
  return transformedPersona;
};
