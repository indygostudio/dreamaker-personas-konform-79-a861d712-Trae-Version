import { Button } from "@/components/ui/button";
import { Edit, ChevronUp, ChevronDown, ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { AdminContextMenu } from "@/components/admin/AdminContextMenu";
import { useAdminMode } from "@/contexts/AdminModeContext";
import { FileUploader } from "./header/FileUploader";

interface ArtistHeaderProps {
  isOwner: boolean;
  avatarUrl: string;
  onEdit: () => void;
  username: string;
  subscription: string;
  videoUrl?: string;
  onContentUpdate?: () => void;
}

export const ArtistHeader = ({
  isOwner,
  avatarUrl,
  onEdit,
  username,
  subscription,
  videoUrl,
  onContentUpdate,
}: ArtistHeaderProps) => {
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
  const navigate = useNavigate();
  const session = useSession();
  const { isAdminMode, toggleAdminMode } = useAdminMode();

  const fileUploaderHook = FileUploader({
    onSuccess: (imageUrl, uploadType, thumbnailUrl) => {
      if (!session?.user?.id) return;

      const updateData = uploadType === 'avatar' 
        ? { avatar_url: imageUrl }
        : { video_url: imageUrl };

      // Update both artist_profiles and profiles tables
      Promise.all([
        supabase
          .from("artist_profiles")
          .update(updateData)
          .eq("id", session.user.id),
        supabase
          .from("profiles")
          .update(updateData)
          .eq("id", session.user.id)
      ])
      .then(() => {
        toast.success(`${uploadType === 'avatar' ? 'Avatar' : 'Banner'} updated successfully`);
        if (onContentUpdate) {
          onContentUpdate();
        } else {
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error(`Error updating ${uploadType}:`, error);
        toast.error(`Failed to update ${uploadType}`);
      });
    },
    id: session?.user?.id || ''
  });

  return (
    <div className="relative mt-16">
      <AdminContextMenu
        contentType="video"
        contentData={{
          id: session?.user?.id,
          url: videoUrl,
          tableName: "artist_profiles",
          columnName: "video_url",
          storageBucket: "persona_avatars"
        }}
        onContentUpdate={() => window.location.reload()}
      >
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
        </div>
      </AdminContextMenu>

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
                disabled={fileUploaderHook.isUploading}
                onClick={() => {
                  fileUploaderHook.setUploadType('banner');
                  document.getElementById('file-upload')?.click();
                }}
              >
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
              <Button
                variant="outline"
                size="icon"
                onClick={toggleAdminMode}
                className={`bg-black/20 hover:bg-black/40 text-white ${isAdminMode ? 'ring-2 ring-dreamaker-purple' : ''}`}
              >
                <span className="text-xs font-bold">A</span>
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
            <AdminContextMenu
              contentType="text"
              contentData={{
                id: session?.user?.id,
                text: username,
                tableName: "artist_profiles",
                columnName: "username"
              }}
              onContentUpdate={() => window.location.reload()}
            >
              <h1 className="text-4xl font-bold text-white mb-4">{username}</h1>
            </AdminContextMenu>
          </div>
        </div>
      </div>

      <input
        id="file-upload"
        type="file"
        accept="video/*,image/*"
        onChange={fileUploaderHook.handleFileUpload}
        className="hidden"
        disabled={fileUploaderHook.isUploading}
      />
    </div>
  );
};
