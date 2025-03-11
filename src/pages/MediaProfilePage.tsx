
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import type { MediaCollection } from "@/types/media";
import { MediaProfileHeader } from "@/components/media/MediaProfileHeader";
import { MediaProfileContent } from "@/components/media/MediaProfileContent";
import { MediaFilesList } from "@/components/media/MediaFilesList";

const MediaProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: mediaCollection, isLoading, error } = useQuery({
    queryKey: ['media-collection', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('media_collections')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        banner_position: data.banner_position 
          ? (typeof data.banner_position === 'string' 
              ? JSON.parse(data.banner_position) 
              : data.banner_position)
          : { x: 50, y: 50 }
      } as MediaCollection;
    }
  });

  const { data: mediaFiles, isLoading: filesLoading } = useQuery({
    queryKey: ['media-files', id],
    queryFn: async () => {
      if (!id) return [];

      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .eq('collection_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-[300px] bg-black/40 animate-pulse rounded-lg mb-8"></div>
          <div className="h-8 w-64 bg-black/40 animate-pulse rounded mb-4"></div>
          <div className="h-4 w-full max-w-lg bg-black/40 animate-pulse rounded mb-8"></div>
        </div>
      </div>
    );
  }

  if (error || !mediaCollection) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Media not found</h1>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div 
          className="rounded-lg overflow-hidden bg-black/60 backdrop-blur-md"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <MediaProfileHeader 
            mediaCollection={mediaCollection} 
            isHovering={isHovering} 
            isPlaying={isPlaying}
            onPlay={handlePlay}
          />

          <MediaProfileContent mediaCollection={mediaCollection} />

          <MediaFilesList 
            mediaFiles={mediaFiles || []} 
            isLoading={filesLoading} 
          />
        </div>
      </div>
    </div>
  );
};

export default MediaProfilePage;
