
import React, { useState, useEffect } from 'react';
import { SubscriptionTier } from '@/types/subscription';
import { Profile } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MediaType } from '@/types/media';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Play, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface MediaSectionProps {
  profile?: Profile | any; // Using any as a fallback for backward compatibility
  personaId?: string; // Optional persona ID for persona profiles
}

interface MediaItem {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_type: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  persona_id?: string;
  media_type: MediaType;
  required_tier?: SubscriptionTier;
}

export const MediaSection = ({ profile, personaId }: MediaSectionProps) => {
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType>('image');
  const userId = profile?.id || personaId;
  
  // Function to check if a subscription tier is valid
  const isValidSubscriptionTier = (tier: string): tier is SubscriptionTier => {
    return ['free', 'label', 'enterprise'].includes(tier as SubscriptionTier);
  };

  // When comparing subscription tiers
  const checkAccess = (userTier: string, requiredTier: string = 'free') => {
    // Convert to valid SubscriptionTier or default to 'free'
    const validUserTier: SubscriptionTier = isValidSubscriptionTier(userTier) 
      ? userTier as SubscriptionTier 
      : 'free';
    
    const validRequiredTier: SubscriptionTier = isValidSubscriptionTier(requiredTier)
      ? requiredTier as SubscriptionTier
      : 'free';
      
    const tiers: Record<SubscriptionTier, number> = {
      'free': 0,
      'label': 1,
      'enterprise': 2
    };
    
    return tiers[validUserTier] >= tiers[validRequiredTier];
  };

  // When assigning a subscription tier
  const setUserSubscription = (tier: string): SubscriptionTier => {
    return isValidSubscriptionTier(tier) ? tier as SubscriptionTier : 'free';
  };
  
  // Fetch media files from the specified path or based on user/persona ID
  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ['media-files', userId, personaId, selectedMediaType],
    queryFn: async () => {
      if (!userId) return [];
      
      // Check if we're looking at a specific media collection path
      const isMediaPath = personaId && personaId.startsWith('/media/');
      
      let query = supabase
        .from('media_files')
        .select('*')
        .eq('media_type', selectedMediaType);
      
      if (isMediaPath) {
        // Extract collection ID from the path
        // For example: /media/0e581a46-daa0-4931-a94b-20f45c6cdbfa
        const collectionId = personaId.split('/media/')[1];
        query = query.eq('collection_id', collectionId);
      } else {
        // Regular user/persona query
        query = query.eq(personaId ? 'persona_id' : 'user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching media files:', error);
        return [];
      }
      
      return data as MediaItem[];
    },
    enabled: !!userId
  });
  
  const handlePlay = (mediaItem: MediaItem) => {
    // Implement play functionality based on media type
    toast.success(`Playing ${mediaItem.title}`);
  };
  
  const handleDownload = async (mediaItem: MediaItem) => {
    try {
      const response = await fetch(mediaItem.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = mediaItem.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Downloading ${mediaItem.title}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };
  
  const handleShare = (mediaItem: MediaItem) => {
    navigator.clipboard.writeText(mediaItem.file_url);
    toast.success('Media URL copied to clipboard');
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Media</h2>
        <div className="flex space-x-2">
          <Button 
            variant={selectedMediaType === 'image' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMediaType('image')}
          >
            Images
          </Button>
          <Button 
            variant={selectedMediaType === 'video' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMediaType('video')}
          >
            Videos
          </Button>
          <Button 
            variant={selectedMediaType === 'audio' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMediaType('audio')}
          >
            Audio
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
              <div className="aspect-video bg-gray-700/50 rounded mb-2"></div>
              <div className="h-5 bg-gray-700/50 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : mediaItems && mediaItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaItems.map((mediaItem) => {
            const hasAccess = checkAccess(profile?.subscription_tier || 'free', mediaItem.required_tier || 'free');
            
            return (
              <div key={mediaItem.id} className="bg-gray-800 rounded-lg p-4 relative group">
                {!hasAccess && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 rounded-lg">
                    <p className="text-white text-center px-4">
                      Upgrade to {mediaItem.required_tier} tier to access this content
                    </p>
                  </div>
                )}
                <div className="aspect-video bg-gray-700 rounded mb-2 overflow-hidden">
                  {mediaItem.media_type === 'image' && (
                    <img 
                      src={mediaItem.thumbnail_url || mediaItem.file_url} 
                      alt={mediaItem.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {mediaItem.media_type === 'video' && (
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                      <img 
                        src={mediaItem.thumbnail_url || '/placeholder.svg'} 
                        alt={mediaItem.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  {mediaItem.media_type === 'audio' && (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold truncate">{mediaItem.title}</h3>
                {mediaItem.description && (
                  <p className="text-sm text-gray-400 line-clamp-2">{mediaItem.description}</p>
                )}
                
                {hasAccess && (
                  <div className="mt-3 flex space-x-2">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="flex-1"
                      onClick={() => handlePlay(mediaItem)}
                    >
                      <Play className="w-4 h-4 mr-1" /> Play
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(mediaItem)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleShare(mediaItem)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-800/30 rounded-lg p-8 text-center">
          <p className="text-gray-400">No {selectedMediaType} files found</p>
        </div>
      )}
    </div>
  );
};
