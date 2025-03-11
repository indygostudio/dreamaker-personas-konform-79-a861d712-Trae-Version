import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Persona } from "@/types/persona";

const ITEMS_PER_PAGE = 9;

// Helper to validate UUID format
const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const usePersonaFetch = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const transformPersonaData = (data: any): Persona => {
    return {
      ...data,
      type: (data.type || 'AI_ARTIST') as 'AI_ARTIST' | 'AI_EFFECT' | 'AI_INSTRUMENT',
      dataset_contributions: data.dataset_contributions ? {
        midi: Number(data.dataset_contributions.midi || 0),
        audio: Number(data.dataset_contributions.audio || 0),
        lyrics: Number(data.dataset_contributions.lyrics || 0)
      } : undefined,
      ai_influence_metrics: data.ai_influence_metrics ? {
        influence_percentage: Number(data.ai_influence_metrics.influence_percentage || 0),
        featured_tracks: Array.isArray(data.ai_influence_metrics.featured_tracks) 
          ? data.ai_influence_metrics.featured_tracks 
          : []
      } : undefined,
      analytics: data.analytics ? {
        streams: Number(data.analytics.streams || 0),
        avg_duration: Number(data.analytics.avg_duration || 0)
      } : undefined,
      monetization_stats: data.monetization_stats ? {
        sales: Number(data.monetization_stats.sales || 0),
        royalties: Number(data.monetization_stats.royalties || 0)
      } : undefined,
      achievements: Array.isArray(data.achievements) ? data.achievements : [],
      featured_works: Array.isArray(data.featured_works) ? data.featured_works : []
    };
  };

  const fetchPersonas = async (
    searchQuery: string,
    sortBy: string,
    page: number,
    append = false
  ) => {
    try {
      setIsLoading(true);
      let query = supabase.from("personas").select("*", { count: "exact" });

      if (searchQuery) {
        // If searchQuery is a UUID, search by ID, otherwise search by name
        if (isValidUUID(searchQuery)) {
          query = query.eq("id", searchQuery);
        } else {
          query = query.ilike("name", `%${searchQuery}%`);
        }
      }

      // Handle different sorting options
      switch (sortBy) {
        case "name_asc":
          query = query
            .order("is_favorite", { ascending: false })
            .order("name", { ascending: true });
          break;
        case "name_desc":
          query = query
            .order("is_favorite", { ascending: false })
            .order("name", { ascending: false });
          break;
        case "created_at_asc":
          query = query
            .order("is_favorite", { ascending: false })
            .order("created_at", { ascending: true });
          break;
        case "created_at_desc":
          query = query
            .order("is_favorite", { ascending: false })
            .order("created_at", { ascending: false });
          break;
        case "favorites_first":
          query = query
            .order("is_favorite", { ascending: false })
            .order("created_at", { ascending: false });
          break;
        case "public_first":
          query = query
            .order("is_public", { ascending: false })
            .order("created_at", { ascending: false });
          break;
        case "private_first":
          query = query
            .order("is_public", { ascending: true })
            .order("created_at", { ascending: false });
          break;
        default:
          query = query
            .order("is_favorite", { ascending: false })
            .order("created_at", { ascending: false });
      }

      // First get the count of all matching records
      const { count } = await query;
      
      // If we're trying to fetch a page beyond available data, return early
      const start = (page - 1) * ITEMS_PER_PAGE;
      if (count !== null && start >= count) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      // Proceed with the actual data fetch
      const { data, error } = await query
        .range(start, start + ITEMS_PER_PAGE - 1);

      if (error) throw error;

      // Transform the data to ensure all fields are correctly typed
      const transformedData = (data || []).map(transformPersonaData);

      if (append) {
        setPersonas(prev => [...prev, ...transformedData]);
      } else {
        setPersonas(transformedData);
      }

      setHasMore(count ? start + ITEMS_PER_PAGE < count : false);
    } catch (error) {
      console.error("Error fetching personas:", error);
      toast({
        title: "Error",
        description: "Failed to load personas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    personas,
    isLoading,
    hasMore,
    fetchPersonas,
  };
};
