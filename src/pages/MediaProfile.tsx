
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Play } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { MediaSection } from "@/components/artist-profile/MediaSection";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import type { MediaPosition, ArtistProfile, SupabaseArtistProfile } from "@/types/media";

const MediaProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const handleCopyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const handleDownloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
      
      toast.success("Download started");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    try {
      const fileKey = `${id}/${type}/${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileKey, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileKey);

      await supabase
        .from('artist_profiles')
        .update({
          [`${type}_url`]: publicUrl
        })
        .eq('id', id);

      toast.success(`${type} updated successfully`);
      refetch();
    } catch (error) {
      toast.error(`Failed to upload ${type}`);
    }
  };

  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ['media-profile', id],
    queryFn: async () => {
      if (!id) return null;

      const { data: rawData, error } = await supabase
        .from('artist_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // First cast to unknown to avoid direct type assertion errors
      const data = rawData as unknown as SupabaseArtistProfile;

      // Parse banner position
      let bannerPosition: MediaPosition = { x: 50, y: 50 };
      if (data.banner_position) {
        try {
          const pos = typeof data.banner_position === 'string' 
            ? JSON.parse(data.banner_position)
            : data.banner_position;
          
          if (pos && typeof pos === 'object' && 'x' in pos && 'y' in pos) {
            bannerPosition = {
              x: Number(pos.x),
              y: Number(pos.y)
            };
          }
        } catch (e) {
          console.error('Error parsing banner position:', e);
        }
      }

      const profile: ArtistProfile = {
        id: data.id,
        username: data.username || '',
        user_bio: data.user_bio || '',
        title: data.title || '',
        description: data.description || '',
        persona_ids: data.persona_ids || [],
        persona_count: data.persona_count || 0,
        banner_position: bannerPosition,
        tags: Array.isArray(data.tags) ? data.tags : [],
        style_tags: Array.isArray(data.style_tags) ? data.style_tags : [],
        genre: Array.isArray(data.genre) ? data.genre : [],
        is_public: Boolean(data.is_public),
        likes_count: Number(data.likes_count) || 0,
        downloads_count: Number(data.downloads_count) || 0,
        banner_url: data.banner_url,
        card_image_url: data.card_image_url,
        technical_level: data.technical_level,
        user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        analytics: data.analytics,
        animation_preset: data.animation_preset,
        avatar_url: data.avatar_url,
        has_3d_model: data.has_3d_model,
        video_url: data.video_url
      };

      return profile;
    }
  });

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-dreamaker-bg text-white">
      <ContextMenu>
        <ContextMenuTrigger>
          <div 
            className="relative h-[300px] bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${profile.banner_url || profile.card_image_url || '/placeholder.svg'})`,
              backgroundPosition: `${profile.banner_position?.x || 50}% ${profile.banner_position?.y || 50}%`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
            
            <div className="absolute top-4 left-4 flex gap-4">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Media
              </Button>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem onClick={() => handleCopyImageUrl(profile.card_image_url || '/placeholder.svg')}>
            Copy URL
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleDownloadImage(profile.card_image_url || '/placeholder.svg', 'banner.jpg')}>
            Download
          </ContextMenuItem>
          {isEditing && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem>
                <label className="cursor-pointer w-full">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'banner')}
                  />
                  Upload New Banner
                </label>
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="flex items-end gap-6 mb-8">
          <ContextMenu>
            <ContextMenuTrigger>
              <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-black bg-black">
                <img 
                  src={profile.card_image_url || '/placeholder.svg'} 
                  alt={profile.title || 'Media'}
                  className="w-full h-full object-cover"
                />
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
              <ContextMenuItem onClick={() => handleCopyImageUrl(profile.card_image_url || '/placeholder.svg')}>
                Copy URL
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleDownloadImage(profile.card_image_url || '/placeholder.svg', 'cover.jpg')}>
                Download
              </ContextMenuItem>
              {isEditing && (
                <>
                  <ContextMenuSeparator />
                  <ContextMenuItem>
                    <label className="cursor-pointer w-full">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'cover')}
                      />
                      Upload New Cover
                    </label>
                  </ContextMenuItem>
                </>
              )}
            </ContextMenuContent>
          </ContextMenu>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{profile.title || 'Untitled Media'}</h1>
            <p className="text-gray-400 mt-2">{profile.description || 'No description available'}</p>
          </div>
          <Button variant="secondary">
            <Play className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>

        <div className="mt-8">
          <MediaSection profile={profile} />
        </div>
      </div>
    </div>
  );
};

export default MediaProfile;
