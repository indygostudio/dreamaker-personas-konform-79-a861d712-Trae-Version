import { Button } from "@/components/ui/button";
import { Edit, ChevronUp, ChevronDown, ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";

interface ArtistHeaderProps {
  isOwner: boolean;
  avatarUrl: string;
  onEdit: () => void;
  username: string;
  subscription: string;
  videoUrl?: string;
}

export const ArtistHeader = ({
  isOwner,
  avatarUrl,
  onEdit,
  username,
  subscription,
  videoUrl,
}: ArtistHeaderProps) => {
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.id) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("persona_avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("persona_avatars")
        .getPublicUrl(filePath);

      // Update both artist_profiles and profiles tables
      const { error: artistProfileError } = await supabase
        .from("artist_profiles")
        .update({ video_url: publicUrl })
        .eq("id", session.user.id);

      if (artistProfileError) throw artistProfileError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ video_url: publicUrl })
        .eq("id", session.user.id);

      if (profileError) throw profileError;

      toast.success("Banner updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast.error("Failed to update banner");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative mt-16">
      <div className={`relative transition-all duration-300 ${isHeaderExpanded ? 'h-[300px]' : 'h-[80px]'}`}>
        {videoUrl ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-black/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Navigation and Controls - Always visible */}
        <div className="absolute top-4 left-0 right-0 px-8 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
                className="bg-black/20 hover:bg-black/40 text-white border-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
                className="text-white hover:text-dreamaker-purple hover:bg-white/10 border-white"
              >
                {isHeaderExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Expand
                  </>
                )}
              </Button>
            </div>

            {isOwner && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="relative bg-black/20 hover:bg-black/40 text-white"
                  disabled={isUploading}
                >
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleBannerUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <Upload className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onEdit}
                  className="bg-black/20 hover:bg-black/40 text-white"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className={`absolute left-0 right-0 transition-all duration-300 ${
          isHeaderExpanded 
            ? 'bottom-0 p-8 flex justify-between items-end' 
            : 'top-1/2 -translate-y-1/2 p-8 flex justify-center items-center'
        }`}>
          <div className={`${isHeaderExpanded ? '' : 'text-center'}`}>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">{username}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
