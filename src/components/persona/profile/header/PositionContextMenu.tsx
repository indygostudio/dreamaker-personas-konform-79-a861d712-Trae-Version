
import { ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MediaPosition } from "@/types/media";

interface PositionContextMenuProps {
  children: ReactNode;
  personaId: string;
  bannerPosition: MediaPosition;
  onPositionChange: (position: MediaPosition) => void;
}

export const PositionContextMenu = ({
  children,
  personaId,
  bannerPosition,
  onPositionChange,
}: PositionContextMenuProps) => {
  const { toast } = useToast();

  const handlePositionChange = async (position: "top" | "center" | "bottom") => {
    const newPosition = { ...bannerPosition };
    switch (position) {
      case "top":
        newPosition.y = 25;
        break;
      case "center":
        newPosition.y = 50;
        break;
      case "bottom":
        newPosition.y = 75;
        break;
    }
    
    onPositionChange(newPosition);

    try {
      const { error } = await supabase
        .from('personas')
        .update({ banner_position: newPosition })
        .eq('id', personaId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Banner position updated"
      });
    } catch (error) {
      console.error('Error updating banner position:', error);
      toast({
        title: "Error",
        description: "Failed to update banner position",
        variant: "destructive"
      });
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => handlePositionChange("top")}>
          Position Top
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handlePositionChange("center")}>
          Position Center
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handlePositionChange("bottom")}>
          Position Bottom
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
