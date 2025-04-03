
import React, { useState, useEffect } from "react";
import { useStoryboard } from "../../contexts/StoryboardContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, FolderPlus, Upload, Download } from "lucide-react";
import { toast } from "sonner";
import ProjectsList from "./ProjectsList";
import SceneEditor from "./StoryEditor";
import ShotEditor from "./SceneEditor";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { PromptVariation } from "../../types/promptTypes";
import VideoBackground from "../VideoBackground";

interface StoryboardProps {
  onPromptsGenerated?: (prompts: PromptVariation[], basePrompt: string) => void;
  basePrompt?: string;
  promptVariations?: PromptVariation[];
}

const Storyboard = ({ onPromptsGenerated, basePrompt = "", promptVariations = [] }: StoryboardProps) => {
  const {
    projects,
    activeProject,
    activeScene,
    dispatch,
    exportProjects,
    importProjects,
    setActiveProject
  } = useStoryboard();
  
  const [newProjectName, setNewProjectName] = useState("");
  const [editingProject, setEditingProject] = useState<null | any>(null);
  
  useEffect(() => {
    if (projects.length > 0 && !activeProject) {
      setActiveProject(projects[0]);
    }
  }, [projects, activeProject, setActiveProject]);
  
  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }
    
    dispatch({ type: "ADD_PROJECT", payload: { name: newProjectName.trim() } });
    setNewProjectName("");
    toast.success("Project created successfully!");
  };
  
  const handleImportClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            importProjects(event.target.result as string);
          }
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  };
  
  const handlePromptsGenerated = (prompts: PromptVariation[], base: string) => {
    if (onPromptsGenerated) {
      onPromptsGenerated(prompts, base);
    }
  };
  
  const handleEditProject = (project: any) => {
    setEditingProject(project);
  };
  
  const handleDeleteProject = (projectId: string) => {
    // Confirmation handled in ProjectsList
  };
  
  return (
    <div className="container max-w-full mx-auto px-0">
      {activeScene ? (
        <ShotEditor 
          onPromptsGenerated={handlePromptsGenerated}
          basePrompt={basePrompt}
          promptVariations={promptVariations}
        />
      ) : (
        <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-120px)]">
          {/* Projects Panel */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <Card className="h-full rounded-none md:rounded-r-lg bg-runway-glass backdrop-blur-md border border-runway-glass-border">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Projects</span>
                  <Button
                    variant="runway" 
                    size="icon"
                    onClick={handleImportClick}
                    title="Import Projects"
                    className="h-8 w-8"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="New Project Name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="bg-runway-glass-input backdrop-blur-sm border-runway-glass-border"
                  />
                  <Button 
                    variant="runway" 
                    size="icon"
                    onClick={handleCreateProject}
                    title="Create Project"
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <ScrollArea className="h-[calc(100vh-320px)]">
                  <ProjectsList 
                    onNewProject={() => setNewProjectName("")}
                    onEditProject={handleEditProject}
                    onDeleteProject={handleDeleteProject}
                  />
                </ScrollArea>
                
                {projects.length > 0 && (
                  <Button
                    variant="runway"
                    size="sm"
                    onClick={exportProjects}
                    className="w-full mt-4 flex gap-2 glass-button"
                  >
                    <Download className="h-4 w-4" /> Export All Projects
                  </Button>
                )}
              </CardContent>
            </Card>
          </ResizablePanel>
          
          {/* Resize Handle */}
          <ResizableHandle withHandle />
          
          {/* Content Panel */}
          <ResizablePanel defaultSize={80}>
            <Card className="h-full rounded-none md:rounded-lg relative overflow-hidden">
              <VideoBackground videoSrc="/Videos/KONFORM_BG_03.mp4" />
              <CardContent className="p-6 relative z-10">
                {!activeProject ? (
                  <div className="text-center py-20">
                    <FolderPlus className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                    <h3 className="text-xl font-medium mb-2 text-white">No Project Selected</h3>
                    <p className="text-gray-400 mb-4">
                      Create a new project or select an existing one to get started
                    </p>
                  </div>
                ) : (
                  <SceneEditor />
                )}
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
};

export default Storyboard;
