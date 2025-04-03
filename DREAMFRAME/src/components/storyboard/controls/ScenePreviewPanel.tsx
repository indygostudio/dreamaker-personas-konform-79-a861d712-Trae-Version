
import React from "react";
import { ImageIcon, CircleDot } from "lucide-react";
import { Scene } from "@/types/storyboardTypes";
import ImageToVideoConverter from "../ImageToVideoConverter";

interface ScenePreviewPanelProps {
  scene: Scene;
  onVideoGenerated: (videoUrl: string) => void;
}

const ScenePreviewPanel: React.FC<ScenePreviewPanelProps> = ({
  scene,
  onVideoGenerated
}) => {
  return (
    <div>
      {scene.imageUrl ? (
        <div className="aspect-video rounded overflow-hidden bg-black relative">
          <img 
            src={scene.imageUrl} 
            alt={scene.description} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <CircleDot className="h-4 w-4 text-runway-blue" />
          </div>
        </div>
      ) : (
        <div className="aspect-video rounded bg-runway-input flex items-center justify-center relative">
          <div className="text-center">
            <ImageIcon className="h-10 w-10 mx-auto mb-2 text-gray-600" />
            <p className="text-gray-400 text-sm">No image yet</p>
          </div>
          <div className="absolute top-2 left-2">
            <CircleDot className="h-4 w-4 text-runway-blue" />
          </div>
        </div>
      )}
      
      {scene?.imageUrl && (
        <div className="mt-4">
          <ImageToVideoConverter 
            scene={scene} 
            onVideoGenerated={onVideoGenerated} 
          />
        </div>
      )}
    </div>
  );
};

export default ScenePreviewPanel;
