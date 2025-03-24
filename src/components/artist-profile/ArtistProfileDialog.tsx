
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/types";
import { useUser } from "@/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { AudioUploadSection } from "./form/AudioUploadSection";
import { BasicInfoSection } from "./form/BasicInfoSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, X, Music, User, Image, Camera, Trash2 } from "lucide-react";
import { BannerPositionControls } from "./header/BannerPositionControls";
import { FileUploader } from "./header/FileUploader";

interface ArtistProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  onSuccess?: () => void;
}

export function ArtistProfileDialog({
  open,
  onOpenChange,
  profile,
  onSuccess,
}: ArtistProfileDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { user } = useUser();
  const queryClient = useQueryClient();

  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    is_public: true,
    banner_position: { x: 50, y: 50 },
    darkness_factor: 50,
    video_url: "",
    banner_url: "",
    avatar_url: "",
    genre: [] as string[],
    location: "",
    profile_type: "musician" as "musician" | "writer" | "mixer",
    audio_preview_url: "",
    audio_trim_start: undefined as number | undefined,
    audio_trim_end: undefined as number | undefined
  });

  useEffect(() => {
    if (open && profile) {
      setFormData({
        display_name: profile.display_name || "",
        bio: profile.bio || profile.user_bio || "",
        is_public: profile.is_public ?? true,
        banner_position: profile.banner_position || { x: 50, y: 50 },
        darkness_factor: profile.darkness_factor || profile.banner_darkness || 50,
        video_url: profile.video_url || "",
        banner_url: profile.banner_url || "",
        avatar_url: profile.avatar_url || "",
        genre: profile.genre || [],
        location: profile.location || "",
        profile_type: (profile.profile_type as "musician" | "writer" | "mixer") || "musician",
        audio_preview_url: profile.audio_preview_url || "",
        audio_trim_start: profile.audio_trim_start,
        audio_trim_end: profile.audio_trim_end
      });
    }
  }, [open, profile]);

  const fileUploaderId = profile?.id || '';
  const fileUploaderHook = FileUploader({ 
    onSuccess: (imageUrl, type) => {
      if (type === 'avatar') {
        setFormData(prev => ({ ...prev, avatar_url: imageUrl }));
        toast.success("Avatar uploaded successfully");
      } else if (type === 'banner') {
        // For banner uploads, update both banner_url and video_url if it's a video
        const isVideo = imageUrl.toLowerCase().includes('.mp4') || 
                       imageUrl.toLowerCase().includes('.mov') || 
                       imageUrl.toLowerCase().includes('.webm');
        
        setFormData(prev => ({
          ...prev,
          banner_url: imageUrl,
          // If it's a video, set the video_url as well
          video_url: isVideo ? imageUrl : prev.video_url
        }));
        toast.success(isVideo ? "Video banner uploaded successfully" : "Banner uploaded successfully");
      }
    },
    id: fileUploaderId,
    bannerPosition: formData.banner_position
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to update a profile");
      return;
    }
    
    if (!formData.display_name.trim()) {
      toast.error("Display name is required");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: formData.display_name,
          bio: formData.bio,
          is_public: formData.is_public,
          banner_position: formData.banner_position,
          darkness_factor: formData.darkness_factor,
          video_url: formData.video_url,
          banner_url: formData.banner_url,
          avatar_url: formData.avatar_url,
          genre: formData.genre,
          location: formData.location,
          profile_type: formData.profile_type,
          audio_preview_url: formData.audio_preview_url,
          audio_trim_start: formData.audio_trim_start,
          audio_trim_end: formData.audio_trim_end
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      queryClient.invalidateQueries({ queryKey: ["artist-profile"] });
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioSuccess = (url: string, trimData?: { start: number; end: number }) => {
    setFormData(prev => ({
      ...prev,
      audio_preview_url: url,
      audio_trim_start: trimData?.start,
      audio_trim_end: trimData?.end
    }));
    
    if (trimData) {
      toast.success("Audio preview trimmed and ready to save");
    } else {
      toast.success("Audio preview uploaded successfully");
    }
  };

  const handlePositionChange = (position: { x: number; y: number }) => {
    setFormData(prev => ({ ...prev, banner_position: position }));
  };
  
  const handleAvatarUploadClick = () => {
    fileUploaderHook.setUploadType('avatar');
    setFileInputKey(Date.now());
    setTimeout(() => {
      document.getElementById('file-upload')?.click();
    }, 100);
  };
  
  const handleBannerUploadClick = () => {
    fileUploaderHook.setUploadType('banner');
    setFileInputKey(Date.now());
    setTimeout(() => {
      document.getElementById('file-upload')?.click();
    }, 100);
  };

  const handleClearAvatar = () => {
    // Only update local state, don't save to database yet
    setFormData(prev => ({ ...prev, avatar_url: "" }));
    toast.success("Avatar removed - click Save Changes to apply");
  };

  const handleClearBanner = () => {
    // Only update local state, don't save to database yet
    setFormData(prev => ({ ...prev, banner_url: "" }));
    toast.success("Banner removed - click Save Changes to apply");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-dreamaker-purple/20 text-white max-w-5xl w-[90vw] max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information and media</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="bg-black/60 w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span>Audio</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Media</span>
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6">

            <TabsContent value="basic" className="mt-0">
              <BasicInfoSection
                displayName={formData.display_name}
                bio={formData.bio}
                isPublic={formData.is_public}
                location={formData.location}
                onDisplayNameChange={(value) => setFormData(prev => ({ ...prev, display_name: value }))}
                onBioChange={(value) => setFormData(prev => ({ ...prev, bio: value }))}
                onIsPublicChange={(value) => setFormData(prev => ({ ...prev, is_public: value }))}
                onLocationChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
              />
            </TabsContent>
            
            <TabsContent value="audio" className="mt-0">
              <AudioUploadSection
                audioUrl={formData.audio_preview_url}
                profileId={profile.id}
                userId={user?.id || ''}
                onSuccess={handleAudioSuccess}
                isDisabled={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="media" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">Profile Avatar</h3>
                  <div className="flex items-center gap-4 p-4 border border-white/10 rounded-lg bg-black/20">
                    {formData.avatar_url ? (
                      <div className="relative w-24 h-24 rounded-full overflow-hidden">
                        <img 
                          src={formData.avatar_url} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center">
                        <User className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-2">
                        Upload a profile picture to represent your artist profile
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleAvatarUploadClick}
                          className="bg-black/60 border-white/20 text-white"
                          disabled={fileUploaderHook.isUploading}
                        >
                          {fileUploaderHook.isUploading && fileUploaderHook.uploadType === 'avatar' ? (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          ) : (
                            <Camera className="h-4 w-4 mr-2" />
                          )}
                          Upload Avatar
                        </Button>
                        {formData.avatar_url && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleClearAvatar}
                            className="bg-red-800/20 border-red-500/30 text-red-400 hover:bg-red-900/30 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear Avatar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-2">Profile Banner</h3>
                  <div className="p-4 border border-white/10 rounded-lg bg-black/20">
                    {formData.banner_url ? (
                      <div className="w-full aspect-video rounded-lg overflow-hidden relative mb-4">
                        <img 
                          src={formData.banner_url} 
                          alt="Banner" 
                          className="w-full h-full object-cover"
                          style={{
                            objectPosition: `${formData.banner_position.x}% ${formData.banner_position.y}%`
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-video bg-gray-800 flex items-center justify-center rounded-lg mb-4">
                        <Image className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-400">
                        Upload a banner image for your profile
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleBannerUploadClick}
                          className="bg-black/60 border-white/20 text-white"
                          disabled={fileUploaderHook.isUploading}
                        >
                          {fileUploaderHook.isUploading && fileUploaderHook.uploadType === 'banner' ? (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          ) : (
                            <Image className="h-4 w-4 mr-2" />
                          )}
                          Upload Banner
                        </Button>
                        {formData.banner_url && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleClearBanner}
                            className="bg-red-800/20 border-red-500/30 text-red-400 hover:bg-red-900/30 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear Banner
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {formData.banner_url && (
                    <div className="bg-black/20 rounded-lg p-4 h-full">
                      <h3 className="text-lg font-medium mb-2">Banner Position</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Adjust the position of your banner image.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="aspect-video rounded-lg overflow-hidden relative bg-gray-900">
                          <img 
                            src={formData.banner_url} 
                            alt="Banner preview" 
                            className="w-full h-full object-cover"
                            style={{
                              objectPosition: `${formData.banner_position.x}% ${formData.banner_position.y}%`
                            }}
                          />
                        </div>
                        
                        <div className="flex justify-center">
                          <BannerPositionControls
                            position={formData.banner_position}
                            onPositionChange={handlePositionChange}
                            id={profile.id}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!formData.banner_url && (
                    <div className="bg-black/20 rounded-lg p-4 h-full flex items-center justify-center">
                      <p className="text-gray-400">Upload a banner image to adjust its position</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <div className="flex justify-end space-x-2 sticky bottom-0 pt-4 pb-2 bg-black/90 border-t border-dreamaker-purple/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-dreamaker-purple/20 text-white hover:bg-dreamaker-purple/20"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-dreamaker-purple hover:bg-dreamaker-purple/80 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-dreamaker-purple border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
      
      <input 
        type="file" 
        id="file-upload" 
        key={fileInputKey}
        accept={fileUploaderHook.uploadType === 'avatar' ? "image/*" : "image/*,video/*"} 
        onChange={fileUploaderHook.handleFileUpload} 
        className="hidden" 
      />
    </Dialog>
  );
}
