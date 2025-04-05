import React, { useState } from "react";
import { useStoryboard } from "@/contexts/StoryboardContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Save, ArrowLeft } from "lucide-react";

const StoryEditor = () => {
  const { activeProject, activeScene, setActiveScene, setActiveProject, dispatch } = useStoryboard();
  
  const [isEditing, setIsEditing] = useState(false);
  const [storyTitle, setStoryTitle] = useState(activeScene?.title || "");
  const [storyDescription, setStoryDescription] = useState(activeScene?.description || "");
  
  // Return to project view
  const handleBackToProject = () => {
    setActiveScene(null);
  };
  
  // Start editing story
  const handleStartEdit = () => {
    setStoryTitle(activeScene?.title || "");
    setStoryDescription(activeScene?.description || "");
    setIsEditing(true);
  };
  
  // Save edited story
  const handleSaveStory = () => {
    if (!activeProject || !activeScene) return;
    if (!storyTitle.trim()) {
      toast.error("Story title cannot be empty");
      return;
    }
    
    const updatedStory = {
      ...activeScene,
      title: storyTitle.trim(),
      description: storyDescription.trim(),
      updatedAt: new Date()
    };
    
    dispatch({
      type: "UPDATE_STORY",
      payload: {
        projectId: activeProject.id,
        story: updatedStory
      }
    });
    
    setIsEditing(false);
    toast.success("Story updated successfully!");
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  if (!activeProject || !activeScene) return null;
  
  const totalScenes = activeScene.scenes.length;
  const totalDuration = activeScene.scenes.reduce(
    (sum, scene) => sum + scene.durationInSeconds, 
    0
  );
  const formattedDuration = formatDuration(totalDuration);
  
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToProject}
          className="text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Project
        </Button>
        <h2 className="text-2xl font-semibold text-white">Story Editor</h2>
      </div>
      
      {/* Story details card */}
      <Card className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border-b border-white/10">
          <CardTitle className="text-xl font-medium text-white">Story Details</CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label htmlFor="storyTitle" className="block text-sm font-medium text-gray-300">
                  Title
                </label>
                <Input
                  id="storyTitle"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  className="bg-black/30 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="storyDescription" className="block text-sm font-medium text-gray-300">
                  Description
                </label>
                <Textarea
                  id="storyDescription"
                  value={storyDescription}
                  onChange={(e) => setStoryDescription(e.target.value)}
                  rows={4}
                  className="bg-black/30 border-white/10 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="border-white/10 text-white/70 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveStory}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium text-white">{activeScene.title}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleStartEdit}
                    className="text-white/70 hover:text-white"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
                <p className="text-gray-400 mt-2">{activeScene.description}</p>
              </div>
              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Total Scenes</p>
                    <p className="text-lg font-medium text-white">{totalScenes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Duration</p>
                    <p className="text-lg font-medium text-white">{formattedDuration}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Scenes list - simplified version */}
      <Card className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border-b border-white/10">
          <CardTitle className="text-xl font-medium text-white">Scenes</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          {activeScene.scenes.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No scenes have been created yet.
            </p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {activeScene.scenes.map((scene, index) => (
                <div 
                  key={scene.id}
                  className="p-3 bg-black/40 border border-white/10 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-white">Scene {index + 1}</h4>
                      <p className="text-sm text-gray-400 mt-1">{scene.description}</p>
                    </div>
                    <div className="text-right text-xs text-gray-400">
                      {formatDuration(scene.durationInSeconds)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to format duration in seconds to MM:SS format
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default StoryEditor;