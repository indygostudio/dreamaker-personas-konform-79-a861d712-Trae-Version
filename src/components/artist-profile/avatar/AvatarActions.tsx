import { Upload, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AvatarActionsProps {
  isBannerUploading: boolean;
  onBannerUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const AvatarActions = ({
  isBannerUploading,
  onBannerUpload
}: AvatarActionsProps) => {
  const navigate = useNavigate();
  
  const handleCollaborate = () => {
    navigate("/personas");
  };

  return (
    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="bg-black/80 hover:bg-black text-white border-dreamaker-purple/20 hover:border-dreamaker-purple relative"
        disabled={isBannerUploading}
      >
        <input
          type="file"
          accept="video/*,image/*"
          onChange={onBannerUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isBannerUploading}
        />
        <Upload className="w-4 h-4 mr-2" />
        {isBannerUploading ? 'Uploading...' : 'Upload Banner'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="bg-black/80 hover:bg-black text-white border-dreamaker-purple/20 hover:border-dreamaker-purple"
        onClick={handleCollaborate}
      >
        <Users className="w-4 h-4 mr-2" />
        Collaborate
      </Button>
    </div>
  );
};