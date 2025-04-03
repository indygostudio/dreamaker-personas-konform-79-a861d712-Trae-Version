
import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Scene } from "../../types/storyboardTypes";
import { useAIService } from "@/contexts/AIServiceContext";
import SceneDetailsPanel from "./controls/SceneDetailsPanel";
import PromptPanel from "./controls/PromptPanel";
import ScenePreviewPanel from "./controls/ScenePreviewPanel";

interface SceneControlsProps {
  scene: Scene;
  description: string;
  prompt: string;
  duration: number;
  isGeneratingImage: boolean;
  selectedServiceName: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDurationChange: (value: number[]) => void;
  onImageGeneration: () => void;
  onVideoGenerated: (videoUrl: string) => void;
}

const SceneControls = ({
  scene,
  description,
  prompt,
  duration,
  isGeneratingImage,
  selectedServiceName,
  onDescriptionChange,
  onPromptChange,
  onDurationChange,
  onImageGeneration,
  onVideoGenerated
}: SceneControlsProps) => {
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [promptOpen, setPromptOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(true);
  const { selectedService } = useAIService();
  const isRunwaySelected = selectedService.id === "runway-gen4";

  return (
    <div>
      <h2 className="text-xl font-medium mb-6">
        {scene.description || "Untitled Shot"}
      </h2>
      
      <div className="space-y-4">
        {/* Details Section */}
        <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen} className="border border-runway-glass-border rounded-md overflow-hidden">
          <CollapsibleTrigger className="flex w-full justify-between items-center p-3 bg-runway-input hover:bg-runway-card">
            <h3 className="text-md font-medium">Shot Details</h3>
            {detailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 bg-runway-glass">
            <SceneDetailsPanel
              description={description}
              duration={duration}
              onDescriptionChange={onDescriptionChange}
              onDurationChange={onDurationChange}
            />
          </CollapsibleContent>
        </Collapsible>
        
        {/* Prompt Section */}
        <Collapsible open={promptOpen} onOpenChange={setPromptOpen} className="border border-runway-glass-border rounded-md overflow-hidden">
          <CollapsibleTrigger className="flex w-full justify-between items-center p-3 bg-runway-input hover:bg-runway-card">
            <h3 className="text-md font-medium">Prompt</h3>
            {promptOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 bg-runway-glass">
            <PromptPanel
              prompt={prompt}
              onPromptChange={onPromptChange}
              onImageGeneration={onImageGeneration}
              isGeneratingImage={isGeneratingImage}
              selectedServiceName={selectedServiceName}
              isRunwaySelected={isRunwaySelected}
            />
          </CollapsibleContent>
        </Collapsible>
        
        {/* Preview Section */}
        <Collapsible open={previewOpen} onOpenChange={setPreviewOpen} className="border border-runway-glass-border rounded-md overflow-hidden">
          <CollapsibleTrigger className="flex w-full justify-between items-center p-3 bg-runway-input hover:bg-runway-card">
            <h3 className="text-md font-medium">Preview</h3>
            {previewOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 bg-runway-glass">
            <ScenePreviewPanel
              scene={scene}
              onVideoGenerated={onVideoGenerated}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default SceneControls;
