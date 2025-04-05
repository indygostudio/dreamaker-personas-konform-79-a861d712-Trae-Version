import React from "react";
import { StoryboardProvider, useStoryboard } from "@/contexts/StoryboardContext";
import StoryEditor from "./StoryEditor";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { AIServiceProvider } from "@/contexts/AIServiceContext";
import { StoryWizardProvider } from "@/contexts/StoryWizardContext";

// Inner component that uses StoryboardContext, AIServiceContext, and StoryWizardContext
const VideoTabContent = () => {
  const { projects, activeProject, dispatch } = useStoryboard();

  // Create a new project
  const handleCreateProject = () => {
    const projectName = `Project ${projects.length + 1}`;
    const newProjectId = dispatch({
      type: "ADD_PROJECT",
      payload: { name: projectName }
    }) as string;
    
    toast.success(`Created new project: ${projectName}`);
  };

  return (
    <div className="min-h-[calc(100vh-180px)] bg-black/40 rounded-lg p-4">
      {activeProject ? (
        <StoryEditor />
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)]">
          <div className="text-center space-y-4 max-w-md">
            <FolderPlus className="w-16 h-16 mx-auto text-blue-400 opacity-70" />
            <h2 className="text-2xl font-semibold text-white">Create a Video Project</h2>
            <p className="text-gray-400">
              Start by creating a new video project. You can add stories, scenes, and media to your project.
            </p>
            <Button 
              onClick={handleCreateProject}
              className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Simplified wrapper component without direct dependencies on React Router
const VideoTab = () => {
  return (
    <div>
      <AIServiceProvider>
        <StoryboardProvider>
          <StoryWizardProvider onNavigate={() => {}}>
            <VideoTabContent />
          </StoryWizardProvider>
        </StoryboardProvider>
      </AIServiceProvider>
    </div>
  );
};

export default VideoTab;