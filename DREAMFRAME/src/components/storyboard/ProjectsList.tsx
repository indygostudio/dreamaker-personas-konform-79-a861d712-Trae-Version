
import React from "react";
import { useStoryboard } from "../../contexts/StoryboardContext";
import { StoryProject } from "../../types/storyboardTypes";
import { Plus, MoreVertical, Trash2, Edit, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface ProjectsListProps {
  onNewProject: () => void;
  onEditProject: (project: StoryProject) => void;
  onDeleteProject: (projectId: string) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ 
  onNewProject, 
  onEditProject, 
  onDeleteProject 
}) => {
  const { projects, activeProject, dispatch, setActiveProject } = useStoryboard();
  
  const handleDeleteProject = (projectId: string) => {
    // Fixed: Pass the projectId directly instead of an object
    dispatch({
      type: "DELETE_PROJECT",
      payload: projectId
    });
    
    onDeleteProject(projectId);
  };
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Projects</h2>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
          onClick={onNewProject}
        >
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>
      
      <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
        {projects.map(project => (
          <div 
            key={project.id}
            className={`
              flex justify-between items-center p-2 rounded-md cursor-pointer
              ${activeProject?.id === project.id ? 'bg-runway-blue-dark/30 border-l-2 border-runway-blue' : 'bg-runway-card hover:bg-runway-input'}
            `}
            onClick={() => setActiveProject(project)}
          >
            <span>{project.name}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-runway-glass backdrop-blur-md border-runway-glass-border">
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProject(project);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer text-red-500" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
        
        {projects.length === 0 && (
          <div className="text-center p-4 text-gray-500">
            No projects yet. Create your first project to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;
