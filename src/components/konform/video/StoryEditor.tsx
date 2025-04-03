import React, { useState, useRef, useEffect } from "react";
import { useStoryboard } from "@/contexts/StoryboardContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import CreateStoryForm from "./CreateStoryForm";
import StoryList from "./StoryList";
import DeleteStoryDialog from "./DeleteStoryDialog";

const StoryEditor = () => {
  const {
    activeProject,
    setActiveProject,
    activeScene,
    setActiveScene,
    dispatch
  } = useStoryboard();

  // Scene deletion state
  const [sceneToDelete, setSceneToDelete] = useState<string | null>(null);

  // Project renaming state
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const projectNameInputRef = useRef<HTMLInputElement>(null);

  // Handle delete scene
  const handleDeleteScene = () => {
    if (!activeProject || !sceneToDelete) return;
    dispatch({
      type: "DELETE_STORY",
      payload: {
        projectId: activeProject.id,
        storyId: sceneToDelete
      }
    });

    // If the deleted scene was active, clear the active scene
    if (activeScene && activeScene.id === sceneToDelete) {
      setActiveScene(null);
    }
    toast.success("Scene deleted successfully!");
    setSceneToDelete(null);
  };

  // Start editing project name
  const handleStartEditProjectName = () => {
    if (!activeProject) return;
    setIsEditingProjectName(true);
    setNewProjectName(activeProject.name);
    setTimeout(() => {
      if (projectNameInputRef.current) {
        projectNameInputRef.current.focus();
        projectNameInputRef.current.select();
      }
    }, 50);
  };

  // Save project name
  const handleSaveProjectName = () => {
    if (!activeProject || !newProjectName.trim()) {
      setIsEditingProjectName(false);
      return;
    }
    const trimmedName = newProjectName.trim();
    if (trimmedName === activeProject.name) {
      setIsEditingProjectName(false);
      return;
    }
    const updatedProject = {
      ...activeProject,
      name: trimmedName
    };
    dispatch({
      type: "UPDATE_PROJECT",
      payload: updatedProject
    });
    setActiveProject(updatedProject);
    setIsEditingProjectName(false);
    toast.success("Project renamed successfully!");
  };

  // Handle key press in project name input
  const handleProjectNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveProjectName();
    } else if (e.key === 'Escape') {
      setIsEditingProjectName(false);
    }
  };

  // Handle clicks outside the project name input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isEditingProjectName && projectNameInputRef.current && !projectNameInputRef.current.contains(event.target as Node)) {
        handleSaveProjectName();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditingProjectName, newProjectName]);
  
  if (!activeProject) return null;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {isEditingProjectName ? (
          <Input 
            ref={projectNameInputRef} 
            value={newProjectName} 
            onChange={e => setNewProjectName(e.target.value)} 
            onKeyDown={handleProjectNameKeyDown} 
            onBlur={handleSaveProjectName} 
            className="max-w-[300px] bg-black/70 border-white/10 text-white h-9" 
          />
        ) : (
          <h2 
            className="text-2xl font-semibold cursor-pointer hover:text-yellow-300 transition-colors" 
            onDoubleClick={handleStartEditProjectName} 
            title="Double-click to rename project"
          >
            {activeProject.name}
          </h2>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
          <CardContent className="p-5 space-y-4 px-[21px] mx-0 rounded-none">
            <CreateStoryForm />
          </CardContent>
        </Card>
        
        <Card className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
          <CardContent className="p-5 space-y-4 px-[21px] mx-0 rounded-none">
            <StoryList onDeleteStory={setSceneToDelete} />
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog for Scene Deletion */}
      <DeleteStoryDialog 
        isOpen={!!sceneToDelete} 
        onClose={() => setSceneToDelete(null)} 
        onConfirm={handleDeleteScene} 
      />
    </div>
  );
};

export default StoryEditor;