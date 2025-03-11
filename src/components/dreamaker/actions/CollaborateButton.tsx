
import { Button } from "@/components/ui/button";
import { Edit2Icon } from "lucide-react";
import { useArtistCollaboration } from "@/hooks/use-artist-collaboration";
import { useState } from "react";
import { MessagingDialog } from "@/components/messaging/MessagingDialog";

interface CollaborateButtonProps {
  artistId: string;
  artistName: string;
  isIconOnly: boolean;
}

export const CollaborateButton = ({
  artistId,
  artistName,
  isIconOnly
}: CollaborateButtonProps) => {
  const { isCollabPending, isLoading, sendCollabRequest } = useArtistCollaboration(artistId, artistName);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  const handleCollaborateClick = () => {
    setIsMessageDialogOpen(true);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size={isIconOnly ? "icon" : "sm"}
        onClick={handleCollaborateClick}
        disabled={isCollabPending || isLoading}
        className="bg-transparent border-dreamaker-purple/50 hover:bg-dreamaker-purple/10 hover:border-dreamaker-purple text-gray-300 hover:text-white transition-colors min-w-0 flex-shrink-0"
      >
        <Edit2Icon className="h-4 w-4" />
        {!isIconOnly && <span className="ml-2 whitespace-nowrap">Collaborate</span>}
      </Button>

      <MessagingDialog
        open={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
        recipientId={artistId}
        recipientName={artistName}
        initialMessage="Can we collaborate?"
      />
    </>
  );
};
