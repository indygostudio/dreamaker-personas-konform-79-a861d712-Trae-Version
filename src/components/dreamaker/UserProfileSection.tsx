
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  is_public: boolean;
  role?: string;
  genre?: string[];
  user_bio?: string;
  is_verified?: boolean;
}

interface UserProfileSectionProps {
  profiles?: Profile[];
}

export const UserProfileSection = ({ profiles }: UserProfileSectionProps) => {
  if (!profiles?.length) {
    return <div className="text-white">No public profiles found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile) => (
        <Card key={profile.id} className="bg-black/40 backdrop-blur-sm border-dreamaker-purple/20 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profile.avatar_url} alt={profile.username || 'User'} />
                <AvatarFallback>
                  <Users className="h-6 w-6 text-dreamaker-purple" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">{profile.username || 'Anonymous'}</h3>
                  {profile.is_verified && (
                    <CheckCircle className="h-4 w-4 text-dreamaker-purple" />
                  )}
                </div>
                {profile.role && (
                  <p className="text-sm text-gray-400">{profile.role}</p>
                )}
              </div>
            </div>
            {profile.user_bio && (
              <p className="text-sm text-gray-300 line-clamp-2">{profile.user_bio}</p>
            )}
            {profile.genre && profile.genre.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.genre.map((g) => (
                  <Badge key={g} variant="outline" className="text-xs bg-dreamaker-purple/10 border-dreamaker-purple/20">
                    {g}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
