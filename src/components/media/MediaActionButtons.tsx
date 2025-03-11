
import { Button } from "@/components/ui/button";
import { Download, Play, Share } from "lucide-react";
import { toast } from "sonner";
import type { MediaCollection } from "@/types/media";

interface MediaActionButtonsProps {
  mediaCollection: MediaCollection;
  isPlaying: boolean;
  onPlay: () => void;
}

export const MediaActionButtons = ({ mediaCollection, isPlaying, onPlay }: MediaActionButtonsProps) => {
  const handleDownload = () => {
    if (!mediaCollection?.preview_url) {
      toast.error("No preview file available for download");
      return;
    }
    
    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = mediaCollection.preview_url;
    link.download = `${mediaCollection.title || 'download'}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Download started");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <>
      <Button onClick={onPlay} variant="glass" className="glass-button">
        {isPlaying ? (
          <>
            <span className="mr-2">■</span>
            Stop
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Play
          </>
        )}
      </Button>
      <Button onClick={handleDownload} variant="glass" className="glass-button">
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
      <Button onClick={handleShare} variant="glass" className="glass-button">
        <Share className="w-4 h-4 mr-2" />
        Share
      </Button>
    </>
  );
};
