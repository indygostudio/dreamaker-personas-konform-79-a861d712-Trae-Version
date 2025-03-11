
import { useToast } from "@/hooks/use-toast";

type SocialPlatform = 'twitter' | 'facebook' | 'instagram' | 'soundcloud';

export const useArtistShare = (artistName: string, artistBio?: string | null) => {
  const { toast } = useToast();

  const handleShare = async (platform: SocialPlatform) => {
    const shareUrl = window.location.href;
    const text = artistBio || `Check out ${artistName}'s profile!`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      instagram: `https://www.instagram.com/share?url=${encodeURIComponent(shareUrl)}`,
      soundcloud: `https://soundcloud.com/share?url=${encodeURIComponent(shareUrl)}`
    };

    // Open share URL in a popup window
    const width = 600;
    const height = 400;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    
    window.open(
      shareUrls[platform],
      'share',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  return { handleShare };
};
