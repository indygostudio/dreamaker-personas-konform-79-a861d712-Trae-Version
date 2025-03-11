
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import type { ArtistProfile } from "@/hooks/use-artist-profiles";
import type { Persona } from "@/types/persona";

interface UserCardContentProps {
  user: ArtistProfile | Persona;
}

export const UserCardContent = ({ user }: UserCardContentProps) => {
  // Helper function to determine if the user is a Persona
  const isPersona = (user: ArtistProfile | Persona): user is Persona => {
    return 'type' in user;
  };

  // Get the display name based on the type
  const displayName = isPersona(user) ? user.name : user.username;
  
  // Get the bio based on the type
  const bio = isPersona(user) ? user.description : user.user_bio;

  // Calculate count based on type
  const count = isPersona(user) ? user.user_count || 0 : user.persona_count || 0;

  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-14 w-14 ring-2 ring-dreamaker-purple ring-offset-2 ring-offset-dreamaker-gray transition-all duration-300 group-hover:ring-offset-4">
        <AvatarImage 
          src={user.avatar_url || "/placeholder.svg"} 
          alt={displayName}
          className="w-full h-full object-cover"
        />
        <AvatarFallback className="bg-dreamaker-purple text-white text-xl">
          {displayName?.[0]?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 text-left space-y-1">
        <h3 className="text-lg font-semibold text-white group-hover:text-dreamaker-purple transition-colors">
          {displayName}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Users className="h-3 w-3" />
          <span>{isPersona(user) ? `${count} users` : `${count} personas`}</span>
        </div>
        {bio && (
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors line-clamp-2">
            {bio}
          </p>
        )}
      </div>
    </div>
  );
};
