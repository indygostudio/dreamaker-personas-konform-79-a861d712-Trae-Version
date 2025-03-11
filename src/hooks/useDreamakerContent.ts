
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { transformPersonaData } from "@/lib/utils/personaTransform";
import type { MediaCollection } from "@/types/media";
import type { ArtistProfile } from "@/hooks/use-artist-profiles";

const mapMediaType = (type: string) => {
  switch (type) {
    case 'audio':
      return 'loop';
    case 'midi':
      return 'midi';
    case 'plugin':
      return 'plugin';
    case 'patch':
      return 'patch';
    case 'album':
      return 'album';
    default:
      return 'loop';
  }
};

export const useDreamakerContent = (
  activeTab: string,
  searchQuery: string,
  sortBy: string,
  selectedType: string,
  selectedGenre: string
) => {
  const { toast } = useToast();
  
  const queryConfig = {
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  };

  // Artists Query
  const { 
    data: artists = [],
    isLoading: isLoadingArtists,
    error: artistsError
  } = useQuery({
    queryKey: ['artist-profiles'],
    queryFn: async () => {
      console.log('Fetching artist profiles...');
      const { data, error } = await supabase
        .from('artist_profiles')
        .select('*')
        .eq('is_public', true);

      if (error) {
        console.error('Error fetching artist profiles:', error);
        toast({
          title: "Error loading artist profiles",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      return data || [];
    },
    ...queryConfig
  });

  // Personas Query
  const { 
    data: personas = [], 
    isLoading: isLoadingPersonas,
    error: personasError
  } = useQuery({
    queryKey: ['public-personas'],
    queryFn: async () => {
      console.log('Fetching public personas...');
      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching personas:', error);
        toast({
          title: "Error loading personas",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      return (data || []).map(transformPersonaData);
    },
    ...queryConfig
  });

  // Media Packs Query
  const { 
    data: mediaPacks = [], 
    isLoading: isLoadingMedia,
    error: mediaError
  } = useQuery({
    queryKey: ['media-packs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_collections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error loading media packs",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      return (data as any[]).map(item => ({
        ...item,
        banner_position: item.banner_position && typeof item.banner_position === 'object' ? {
          x: Number((item.banner_position as any).x) || 50,
          y: Number((item.banner_position as any).y) || 50
        } : undefined,
        type: mapMediaType(item.media_type),
        preview_image_url: item.cover_image_url,
        file_url: item.preview_url,
        bpm: item.technical_specs?.bpm,
        musical_key: item.technical_specs?.key
      })) as MediaCollection[];
    },
    ...queryConfig
  });

  // Filtered Content Logic
  const filteredContent = useMemo(() => {
    console.log('Filtering content for tab:', activeTab);
    
    let items = [];
    
    switch (activeTab) {
      case "profiles":
        items = artists || [];
        if (searchQuery) {
          items = items.filter(artist => {
            const searchLower = searchQuery.toLowerCase();
            return artist.username?.toLowerCase().includes(searchLower) || 
                   artist.user_bio?.toLowerCase().includes(searchLower) || 
                   artist.genre?.some(g => g.toLowerCase().includes(searchLower));
          });
        }
        if (selectedGenre !== 'all') {
          items = items.filter(artist => artist.genre?.includes(selectedGenre));
        }
        break;

      case "personas":
        items = (personas || []).filter(persona => !persona.is_collab);
        if (selectedType !== 'all' && activeTab === 'personas') {
          items = items.filter(persona => persona.type === selectedType);
        }
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          items = items.filter(persona => 
            persona.name?.toLowerCase().includes(searchLower) || 
            persona.description?.toLowerCase().includes(searchLower)
          );
        }
        break;

      case "media":
        items = mediaPacks || [];
        items = items.filter(item => {
          const searchMatch = !searchQuery || 
            item.title?.toLowerCase().includes(searchQuery.toLowerCase());
          const typeMatch = selectedType === 'all' || item.type === selectedType;
          return searchMatch && typeMatch;
        });
        break;

      case "collaborations":
        items = (personas || []).filter(persona => {
          console.log('Checking persona for collab:', persona.name, persona.is_collab);
          return persona.is_collab === true;
        });
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          items = items.filter(persona => 
            persona.name?.toLowerCase().includes(searchLower) || 
            persona.description?.toLowerCase().includes(searchLower)
          );
        }
        console.log('Filtered collaboration items:', items);
        break;
    }

    return items.sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return (a.title || a.name || "").localeCompare(b.title || b.name || "");
        case "popular":
          return (b.likes_count || 0) - (a.likes_count || 0);
        case "type":
          return ((a.type as string) || "").localeCompare((b.type as string) || "");
        case "genre":
          return (a.genre?.[0] || "").localeCompare(b.genre?.[0] || "");
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [activeTab, artists, personas, mediaPacks, searchQuery, sortBy, selectedType, selectedGenre]);

  const isLoading = isLoadingArtists || isLoadingPersonas || isLoadingMedia;
  const error = artistsError || personasError || mediaError;

  return {
    filteredContent,
    isLoading,
    error
  };
};
