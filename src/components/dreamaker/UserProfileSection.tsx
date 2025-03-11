
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  is_public: boolean;
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
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile.avatar_url} alt={profile.username || 'User'} />
              <AvatarFallback>
                <Users className="h-6 w-6 text-dreamaker-purple" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-white">{profile.username || 'Anonymous'}</h3>
              {profile.full_name && (
                <p className="text-sm text-gray-400">{profile.full_name}</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
