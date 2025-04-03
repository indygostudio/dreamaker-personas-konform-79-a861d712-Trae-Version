
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

interface SceneDetailsPanelProps {
  description: string;
  duration: number;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDurationChange: (value: number[]) => void;
}

const SceneDetailsPanel: React.FC<SceneDetailsPanelProps> = ({
  description,
  duration,
  onDescriptionChange,
  onDurationChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Description
        </label>
        <Textarea
          value={description}
          onChange={onDescriptionChange}
          placeholder="Describe what happens in this shot"
          className="bg-runway-input border-runway-glass-border resize-none"
          rows={2}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Duration (seconds)
        </label>
        <div className="flex items-center gap-4">
          <Slider
            value={[duration]}
            min={1}
            max={60}
            step={1}
            onValueChange={onDurationChange}
            className="flex-1"
          />
          <div className="w-12 text-center font-mono bg-runway-input rounded py-1 text-sm">
            {duration}s
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneDetailsPanel;
