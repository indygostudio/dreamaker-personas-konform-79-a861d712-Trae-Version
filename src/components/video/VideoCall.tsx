
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoCallProps {
  userId: string;
  onClose: () => void;
}

export const VideoCall = ({ userId, onClose }: VideoCallProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const userMedia = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: true 
        });
        setStream(userMedia);
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    startVideo();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-black z-30">
      <div className="relative w-full h-full">
        {stream && (
          <video
            autoPlay
            playsInline
            ref={(videoEl) => {
              if (videoEl && stream) {
                videoEl.srcObject = stream;
              }
            }}
            className="w-full h-full object-cover"
          />
        )}
        
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="bg-black/20 hover:bg-black/40 text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
