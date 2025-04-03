
import React from "react";
import { ChevronUp, ChevronDown, Info, Filter } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import MediaGallery from "./ImageGallery";
import { Card, CardContent } from "@/components/ui/card";
import { useAIService } from "@/contexts/AIServiceContext";
import { Badge } from "@/components/ui/badge";

interface MediaGallerySectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MediaGallerySection: React.FC<MediaGallerySectionProps> = ({
  open,
  onOpenChange
}) => {
  const { selectedService } = useAIService();
  const isRunwaySelected = selectedService.id === "runway-gen4";

  return (
    <Collapsible 
      open={open} 
      onOpenChange={onOpenChange}
      className="md:col-span-2 bg-runway-glass border border-runway-glass-border rounded-md overflow-hidden"
    >
      <CollapsibleTrigger className="flex w-full justify-between items-center p-3 bg-runway-input hover:bg-runway-card">
        <div className="flex items-center gap-2">
          <h3 className="text-md font-medium">Media Gallery</h3>
          <Badge variant="outline" className="text-xs bg-runway-blue/20">Enhanced</Badge>
        </div>
        <div className="flex items-center gap-2">
          {isRunwaySelected && (
            <span className="text-xs px-2 py-0.5 bg-green-900/50 text-green-400 rounded-full">
              Runway Connected
            </span>
          )}
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <MediaGallery />
        
        {isRunwaySelected && (
          <Card className="m-3 bg-green-900/20 border-green-500/30">
            <CardContent className="p-3 flex items-start gap-2">
              <Info className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-green-300">
                Your Runway Gen-4 API is connected and ready to generate images and videos. 
                Use the prompt generator for best results with Runway's specialized format.
              </p>
            </CardContent>
          </Card>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MediaGallerySection;
