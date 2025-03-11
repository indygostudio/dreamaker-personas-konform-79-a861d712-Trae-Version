
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useArtistFavorite } from "@/hooks/use-artist-favorite";

interface FavoriteButtonProps {
  artistId: string;
  artistName: string;
  isIconOnly: boolean;
}

export const FavoriteButton = ({
  artistId,
  artistName,
  isIconOnly
}: FavoriteButtonProps) => {
  const { isFavorited, isLoading, toggleFavorite } = useArtistFavorite(artistId, artistName);

  return (
    <Button 
      variant="outline" 
      size={isIconOnly ? "icon" : "sm"}
      onClick={() => toggleFavorite()}
      disabled={isLoading}
      className="bg-transparent border-dreamaker-purple/50 hover:bg-dreamaker-purple/10 hover:border-dreamaker-purple text-gray-300 hover:text-white transition-colors min-w-0 flex-shrink-0"
    >
      <Heart 
        className={`h-4 w-4 ${isFavorited ? 'fill-konform-neon-blue text-konform-neon-blue' : ''}`} 
      />
      {!isIconOnly && <span className="ml-2 whitespace-nowrap">Favorite</span>}
    </Button>
  );
};
