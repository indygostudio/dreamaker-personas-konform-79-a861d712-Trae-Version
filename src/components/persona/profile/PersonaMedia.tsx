
import { useEffect, useRef, useState } from "react";
import { AvatarContextMenu } from "@/components/artist-profile/avatar/AvatarContextMenu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

interface PersonaMediaProps {
  video_url?: string;
  isHeaderExpanded: boolean;
  onVideoDownload: () => Promise<void>;
  onVideoCopy: () => Promise<void>;
  onVideoShare: () => Promise<void>;
  onVideoSelect: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onAvatarSelect: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading: boolean;
}

export const PersonaMedia = ({
  video_url,
  isHeaderExpanded,
  onVideoDownload,
  onVideoCopy,
  onVideoShare,
  onVideoSelect,
  onAvatarSelect,
  isUploading,
}: PersonaMediaProps) => {
  const { id: personaId } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReversing, setIsReversing] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('rgba(0, 0, 0, 0.4)');
  const [isLoaded, setIsLoaded] = useState(false);
  const animationFrameRef = useRef<number>();

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!personaId) {
      toast.error("No persona ID found");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${personaId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("persona_videos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("persona_videos")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("personas")
        .update({ video_url: publicUrl })
        .eq("id", personaId);

      if (updateError) throw updateError;

      await onVideoSelect(e);
      toast.success("Video background uploaded successfully");
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Failed to upload video background");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!personaId) {
      toast.error("No persona ID found");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${personaId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("persona_avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("persona_avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("personas")
        .update({ avatar_url: publicUrl })
        .eq("id", personaId);

      if (updateError) throw updateError;

      await onAvatarSelect(e);
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    }
  };

  const getAverageColor = async (src: string, isVideo: boolean = false): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const mediaElement = isVideo ? document.createElement('video') : new Image();
  
      mediaElement.crossOrigin = "anonymous";
  
      mediaElement.onload = function() {
        if (!context) return;
        
        canvas.width = mediaElement.width || 1;
        canvas.height = mediaElement.height || 1;
        
        context.drawImage(mediaElement, 0, 0);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let r = 0, g = 0, b = 0;
        
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }
        
        const pixelCount = data.length / 4;
        r = Math.floor(r / pixelCount);
        g = Math.floor(g / pixelCount);
        b = Math.floor(b / pixelCount);
        
        resolve(`rgb(${r}, ${g}, ${b})`);
      };
  
      if (isVideo) {
        (mediaElement as HTMLVideoElement).onloadeddata = mediaElement.onload;
      }
  
      mediaElement.src = src;
    });
  };

  useEffect(() => {
    const analyzePersonaMedia = async () => {
      try {
        if (video_url) {
          const color = await getAverageColor(video_url, true);
          const opacity = isHeaderExpanded ? 0.4 : 0.95;
          const rgbaColor = color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
          setBackgroundColor(rgbaColor);
        }
      } catch (error) {
        console.error('Error analyzing media colors:', error);
      }
    };

    analyzePersonaMedia();
  }, [video_url, isHeaderExpanded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoLoad = () => {
      setIsLoaded(true);
    };

    const reverseVideo = () => {
      if (!video) return;
      if (video.currentTime <= 0) {
        setIsReversing(false);
        video.play();
        return;
      }
      video.currentTime -= 0.03;
      animationFrameRef.current = requestAnimationFrame(reverseVideo);
    };

    const handleTimeUpdate = () => {
      if (!video) return;
      
      if (video.currentTime >= video.duration - 0.1 && !isReversing) {
        video.pause();
        setIsReversing(true);
        animationFrameRef.current = requestAnimationFrame(reverseVideo);
      }
    };

    video.addEventListener("loadeddata", handleVideoLoad);
    video.addEventListener("timeupdate", handleTimeUpdate);
    
    return () => {
      video.removeEventListener("loadeddata", handleVideoLoad);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isReversing]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AvatarContextMenu
        onDownload={onVideoDownload}
        onCopy={onVideoCopy}
        onShare={onVideoShare}
        onVideoSelect={handleVideoUpload}
        onAvatarSelect={handleAvatarUpload}
        isUploading={isUploading}
        personaId={personaId}
      >
        <div className="h-full w-full relative">
          {video_url ? (
            <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover transform scale-105"
                src={video_url}
                autoPlay
                muted
                loop
                playsInline
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  filter: 'brightness(0.85) saturate(1.2)'
                }}
              />
            </div>
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-purple-900/40 to-black/40" />
          )}
          <div 
            className="absolute inset-0 transition-all duration-500 ease-in-out" 
            style={{ 
              background: `linear-gradient(to top, ${backgroundColor}, rgba(27, 24, 38, 0.2))`,
              opacity: isHeaderExpanded ? 1 : 0.95
            }}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 transition-opacity duration-300"
            style={{ opacity: isHeaderExpanded ? 0.7 : 0.4 }}
          />
        </div>
      </AvatarContextMenu>
    </div>
  );
};

