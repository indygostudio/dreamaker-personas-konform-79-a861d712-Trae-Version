
import React from 'react';
import { Scene } from "../../../types/storyboardTypes";
import ImageToVideoConverter from "../ImageToVideoConverter";
import { ImageIcon } from 'lucide-react';

interface ScenePreviewPanelProps {
  scene: Scene;
  onVideoGenerated: (videoUrl: string) => void;
}

const ScenePreviewPanel: React.FC<ScenePreviewPanelProps> = ({
  scene,
  onVideoGenerated
}) => {
  return (
    <div className="space-y-3">
      {/* Display Logic: Video > Image > Placeholder */}
      {scene.videoUrl ? (
        // Display the generated video
        <video
          src={scene.videoUrl}
          controls
          className="w-full h-auto rounded-md mb-2 object-cover aspect-video bg-runway-card"
        />
      ) : scene.imageUrl ? (
        // Display the source image if no video yet
        <img 
          src={scene.imageUrl} 
          alt={scene.description || "Scene Preview"} 
          className="w-full h-auto rounded-md mb-2 object-cover aspect-video bg-runway-card" 
        />
      ) : (
        // Display placeholder if no image or video
        <div className="w-full aspect-video bg-runway-card rounded-md flex items-center justify-center mb-2">
          <ImageIcon className="w-12 h-12 text-gray-500" />
        </div>
      )}
      
      {/* Render the converter button (it handles its own conditional rendering) */}
      <ImageToVideoConverter 
        scene={scene} 
        onVideoGenerated={onVideoGenerated}

export default ScenePreviewPanel;
