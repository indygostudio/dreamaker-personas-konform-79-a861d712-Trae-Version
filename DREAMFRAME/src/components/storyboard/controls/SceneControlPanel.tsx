
import React, { useState } from "react";
import { ChevronUp, ChevronDown, Plus } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SceneContainer } from "../../../types/storyboardTypes";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface SceneControlPanelProps {
  scene: SceneContainer;
  title: string;
  description: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAddShot: () => void;
  onAutoCreateShots: () => void;
  isCreatingShots: boolean;
}

const SceneControlPanel: React.FC<SceneControlPanelProps> = ({
  scene,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onAddShot,
  onAutoCreateShots,
  isCreatingShots
}) => {
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [shotsOpen, setDhotsOpen] = useState(true);

  return (
    <div>
      <h2 className="text-xl font-medium mb-6">
        {title || "Untitled Scene"}
      </h2>
      
      <div className="space-y-4">
        {/* Details Section */}
        <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen} className="border border-runway-glass-border rounded-md overflow-hidden">
          <CollapsibleTrigger className="flex w-full justify-between items-center p-3 bg-runway-input hover:bg-runway-card">
            <h3 className="text-md font-medium">Scene Details</h3>
            {detailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 bg-runway-glass">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Title
                </label>
                <Input
                  value={title}
                  onChange={onTitleChange}
                  placeholder="Enter scene title"
                  className="bg-runway-input border-runway-glass-border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={onDescriptionChange}
                  placeholder="Describe what happens in this scene"
                  className="bg-runway-input border-runway-glass-border resize-none"
                  rows={4}
                />
              </div>
              
              <div className="text-xs text-gray-400">
                Total Duration: {formatDuration(scene.scenes.reduce((total, shot) => total + shot.durationInSeconds, 0))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Shots Management Section */}
        <Collapsible open={shotsOpen} onOpenChange={setDhotsOpen} className="border border-runway-glass-border rounded-md overflow-hidden">
          <CollapsibleTrigger className="flex w-full justify-between items-center p-3 bg-runway-input hover:bg-runway-card">
            <h3 className="text-md font-medium">Shots Management</h3>
            {shotsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 bg-runway-glass">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Shots in this scene: {scene.scenes.length}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onAddShot}
                    className="bg-runway-input border-dashed border-gray-600 flex items-center gap-2 hover:bg-runway-card"
                  >
                    <Plus className="h-4 w-4" /> Add Shot
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onAutoCreateShots}
                    disabled={isCreatingShots || !description}
                    className="bg-runway-input border-dashed border-gray-600 flex items-center gap-2 hover:bg-runway-card"
                  >
                    {isCreatingShots ? "Creating Shots..." : "Auto Create Shots"}
                  </Button>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default SceneControlPanel;
