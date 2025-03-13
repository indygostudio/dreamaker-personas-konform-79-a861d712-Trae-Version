
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ArtistProfile } from "@/hooks/use-artist-profiles";
import { Trash2Icon, Share2, Verified } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { VideoBackground } from "./VideoBackground";
import { UserCardContent } from "./UserCardContent";
import { ArtistCardActions } from "./ArtistCardActions";

interface ArtistCardProps {
  artist: ArtistProfile;
  heightClass?: string;
}

export const ArtistCard = ({
  artist,
  heightClass = "h-[280px]"
}: ArtistCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);

  // Check if user is logged in and get session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
  });

  // Subscribe to auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  const isAdmin = session?.user?.email === 'indygorecording@gmail.com';
  const isOwner = session?.user?.id === artist.id;
  const canDelete = isAdmin || isOwner;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: artist.username,
        text: artist.user_bio || 'Check out this user profile!',
        url: window.location.href
      });
    } catch (error) {
      // Fallback for desktop
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this user profile"
      });
    }
  };

  const handleDelete = async () => {
    if (!canDelete) return;
    try {
      if (isOwner) {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(artist.id);
        if (deleteError) throw deleteError;
      } else if (isAdmin) {
        const { error: deleteError } = await supabase.from('artist_profiles').delete().eq('id', artist.id);
        if (deleteError) throw deleteError;
      }
      toast({
        title: "Profile deleted",
        description: "The user profile has been successfully deleted"
      });
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error deleting profile",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Get profile-based gradient colors
  const getProfileColors = () => {
    return {
      color: 'border-blue-500/20 group-hover:border-blue-500/60',
      bgColor: 'from-blue-900/40 to-black/40'
    };
  };

  const { color, bgColor } = getProfileColors();

  return (
    <ScrollArea className="h-full w-full">
      <ContextMenu>
        <ContextMenuTrigger>
          <Link to={`/artists/${artist.id}`}>
            <Card 
              className={`group overflow-hidden relative bg-black/80 backdrop-blur-md border ${color} transition-all duration-300 cursor-pointer w-full ${heightClass} flex flex-col shadow-lg hover:shadow-lg transform hover:-translate-y-1`}
              onMouseEnter={() => setIsHovering(true)} 
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <VideoBackground videoUrl={artist.video_url || '/Videos/PERSONAS_01.mp4'} isHovering={isHovering} />
                <div 
                  className={`absolute inset-0 bg-gradient-to-b ${bgColor} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} 
                />
              </div>

              <CardContent className="p-6 flex-1 relative z-10">
                <UserCardContent user={artist} />
              </CardContent>

              <CardFooter className="border-t border-dreamaker-purple/20 p-4 relative z-10 bg-black">
                <ArtistCardActions artistId={artist.id} artistName={artist.username || ''} artistBio={artist.user_bio} />
              </CardFooter>
            </Card>
          </Link>
        </ContextMenuTrigger>
        
        <ContextMenuContent className="bg-black/80 backdrop-blur-md border border-dreamaker-purple/20">
          <ContextMenuItem onClick={handleShare} className="hover:bg-dreamaker-purple/20 text-white cursor-pointer">
            <Share2 className="h-4 w-4 mr-2" />
            Share Profile
          </ContextMenuItem>
          {canDelete && (
            <ContextMenuItem onClick={() => setDeleteDialogOpen(true)} className="hover:bg-red-500/20 text-red-400 cursor-pointer">
              <Trash2Icon className="h-4 w-4 mr-2" />
              Delete Profile
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-dreamaker-gray border-dreamaker-purple/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure you want to delete this profile?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {isOwner ? "This action cannot be undone. This will permanently delete your account and all associated data." : "This action cannot be undone. This will permanently delete this user profile."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-dreamaker-purple/50 hover:bg-dreamaker-purple/10 hover:border-dreamaker-purple text-gray-300 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={e => {
                e.preventDefault();
                handleDelete();
                setDeleteDialogOpen(false);
              }} 
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ScrollArea>
  );
};
