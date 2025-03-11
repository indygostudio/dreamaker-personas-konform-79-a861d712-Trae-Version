
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { MessagingDialog } from "@/components/messaging/MessagingDialog";
import { useZoomStore } from "@/stores/useZoomStore";

interface MessagingButtonProps {
  recipientId: string;
  recipientName: string;
  isHeaderExpanded: boolean;
}

export const MessagingButton = ({ 
  recipientId, 
  recipientName,
  isHeaderExpanded 
}: MessagingButtonProps) => {
  const [isMessaging, setIsMessaging] = useState(false);
  const zoomLevel = useZoomStore(state => state.zoomLevel);
  
  // Determine button size based on zoom level and header state
  const shouldShowText = isHeaderExpanded && zoomLevel > 60;

  return (
    <>
      <Button 
        variant="glass"
        size={shouldShowText ? "default" : "icon"}
        className="glass-button"
        onClick={() => setIsMessaging(true)}
      >
        <MessageSquare className="h-4 w-4" />
        {shouldShowText && <span className="ml-2">Message</span>}
      </Button>

      <MessagingDialog
        open={isMessaging}
        onOpenChange={setIsMessaging}
        recipientId={recipientId}
        recipientName={recipientName}
      />
    </>
  );
};
