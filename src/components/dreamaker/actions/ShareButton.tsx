
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, Instagram, Music } from "lucide-react";
import { useArtistShare } from "@/hooks/use-artist-share";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ShareButtonProps {
  artistName: string;
  artistBio?: string | null;
  isIconOnly: boolean;
}

export const ShareButton = ({
  artistName,
  artistBio,
  isIconOnly
}: ShareButtonProps) => {
  const { handleShare } = useArtistShare(artistName, artistBio);

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy link:", error);
        toast.error("Failed to copy link to clipboard");
      });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={isIconOnly ? "icon" : "sm"}
          className="bg-transparent border-dreamaker-purple/50 hover:bg-dreamaker-purple/10 hover:border-dreamaker-purple text-gray-300 hover:text-white transition-colors min-w-0 flex-shrink-0"
        >
          <Share2 className="h-4 w-4" />
          {!isIconOnly && <span className="ml-2 whitespace-nowrap">Share</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black/90 border border-dreamaker-purple/50">
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer hover:bg-dreamaker-purple/20">
          <Share2 className="h-4 w-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('twitter')} className="cursor-pointer hover:bg-dreamaker-purple/20">
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('facebook')} className="cursor-pointer hover:bg-dreamaker-purple/20">
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('instagram')} className="cursor-pointer hover:bg-dreamaker-purple/20">
          <Instagram className="h-4 w-4 mr-2" />
          Instagram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('soundcloud')} className="cursor-pointer hover:bg-dreamaker-purple/20">
          <Music className="h-4 w-4 mr-2" />
          SoundCloud
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
