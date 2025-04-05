import { useState } from 'react';
import { useFollows } from '@/hooks/useFollows';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserIcon, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { FollowButton } from '@/components/social/FollowButton';

interface FollowerStatsProps {
  userId: string;
}

export const FollowerStats = ({ userId }: FollowerStatsProps) => {
  const { followers, following, followersCount, followingCount } = useFollows(userId);
  const [dialogType, setDialogType] = useState<'followers' | 'following'>('followers');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Get follower profiles
  const { data: followerProfiles } = useQuery({
    queryKey: ['follower-profiles', userId, followers],
    queryFn: async () => {
      if (!followers?.length) return [];
      
      const followerIds = followers.map(f => f.follower_id);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', followerIds);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!followers?.length
  });
  
  // Get following profiles
  const { data: followingProfiles } = useQuery({
    queryKey: ['following-profiles', userId, following],
    queryFn: async () => {
      if (!following?.length) return [];
      
      const followingIds = following.map(f => f.following_id);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', followingIds);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!following?.length
  });
  
  const handleOpenFollowers = () => {
    setDialogType('followers');
    setDialogOpen(true);
  };
  
  const handleOpenFollowing = () => {
    setDialogType('following');
    setDialogOpen(true);
  };
  
  return (
    <div className="flex items-center gap-6 text-sm text-white/80">
      <Button 
        variant="link" 
        onClick={handleOpenFollowers}
        className="p-0 h-auto font-normal text-white/80 hover:text-white"
      >
        <span className="font-bold mr-1">{followersCount}</span> Followers
      </Button>
      
      <Button 
        variant="link" 
        onClick={handleOpenFollowing}
        className="p-0 h-auto font-normal text-white/80 hover:text-white"
      >
        <span className="font-bold mr-1">{followingCount}</span> Following
      </Button>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogType === 'followers' ? 'Followers' : 'Following'}</DialogTitle>
            <DialogDescription>
              {dialogType === 'followers' 
                ? 'People who follow this artist' 
                : 'People this artist follows'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {dialogType === 'followers' ? (
              followersCount > 0 ? (
                <div className="space-y-4 py-4">
                  {followerProfiles?.map(profile => (
                    <div key={profile.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={profile.avatar_url || ''} />
                        <AvatarFallback>
                          <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Link to={`/artist/${profile.id}`} className="font-medium hover:underline">
                          {profile.display_name || profile.username || 'User'}
                        </Link>
                      </div>
                      <FollowButton targetUserId={profile.id} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-400">No followers yet</p>
                </div>
              )
            ) : (
              followingCount > 0 ? (
                <div className="space-y-4 py-4">
                  {followingProfiles?.map(profile => (
                    <div key={profile.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={profile.avatar_url || ''} />
                        <AvatarFallback>
                          <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Link to={`/artist/${profile.id}`} className="font-medium hover:underline">
                          {profile.display_name || profile.username || 'User'}
                        </Link>
                      </div>
                      <FollowButton targetUserId={profile.id} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-400">Not following anyone yet</p>
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 