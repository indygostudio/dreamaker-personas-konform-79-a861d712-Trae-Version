
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import type { ArtistProfile } from "@/hooks/use-artist-profiles";

interface ArtistCardContentProps {
  artist: ArtistProfile;
}

export const ArtistCardContent = ({ artist }: ArtistCardContentProps) => {
  // Provide default values and safe fallbacks
  const [avatarUrl, setAvatarUrl] = useState(artist?.avatar_url || "/placeholder.svg");
  const username = artist?.username || 'Anonymous';
  const avatarFallback = username?.[0]?.toUpperCase() || 'A';
  const personaCount = artist?.persona_count || 0;
  const userBio = artist?.user_bio || '';

  useEffect(() => {
    setAvatarUrl(artist?.avatar_url || "/placeholder.svg");
  }, [artist?.avatar_url]);

  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-16 w-16 ring-2 ring-dreamaker-purple ring-offset-2 ring-offset-dreamaker-gray transition-all duration-300 group-hover:ring-offset-4">
        <AvatarImage 
          src={avatarUrl} 
          alt={username}
          className="w-full h-full object-cover"
        />
        <AvatarFallback className="bg-dreamaker-purple text-white text-xl">
          {avatarFallback}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 text-left space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-white group-hover:text-dreamaker-purple transition-colors">
            {username}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="h-4 w-4" />
          <span>{personaCount} personas</span>
        </div>
        {userBio && (
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors line-clamp-2">
            {userBio}
          </p>
        )}
      </div>
    </div>
  );
};
