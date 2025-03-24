
import { ChevronDown, ChevronUp, Users, Download, Save, Template, Edit2, Brain, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import { Collaborators } from "./daw/sections/Collaborators";
import { PercentageSplits } from "./daw/sections/PercentageSplits";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useBannerSectionsStore } from "./store/bannerSectionsStore";
import { useKonformProject } from "@/hooks/useKonformProject";
import { useAutoSave } from "@/hooks/useAutoSave";
import { ProjectMenu } from "./ProjectMenu";
import { downloadProject, createProjectTemplate } from "@/utils/projectUtils";
import { useToast } from "@/hooks/use-toast";
import { useTrainingModeStore } from "./store/trainingModeStore";

interface KonformBannerProps {
  title: string;
  description: string;
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  rightContent?: ReactNode;
  latestSessionId?: string;
}

interface ProjectNameInputProps {
  currentProject: any;
  onSave: (name: string) => void;
}

const ProjectNameInput = ({ currentProject, onSave }: ProjectNameInputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [projectName, setProjectName] = useState(currentProject?.name || 'Untitled Project');

  const handleSave = () => {
    onSave(projectName);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-black/20 border border-konform-neon-blue/20 rounded px-2 py-1 text-white"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="text-white/80 hover:text-white"
          >
            <Save className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          <span className="text-white/80 hover:text-white">{projectName}</span>
          <Edit2 className="h-4 w-4 text-white/60" />
        </div>
      )}
    </div>
  );
};

export const KonformBanner = ({
  title,
  description,
  isCollapsed,
  onCollapsedChange,
  rightContent,
  latestSessionId,
}: KonformBannerProps) => {
  const { toast } = useToast();
  const { currentProject, saveProject, setCurrentProject } = useKonformProject();
  const { isAutoSaveEnabled } = useAutoSave();
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const { 
    collaboratorsCollapsed, 
    percentageSplitsCollapsed,
    setCollaboratorsCollapsed,
    setPercentageSplitsCollapsed 
  } = useBannerSectionsStore();
  
  // Fetch latest session if not provided
  const { data: latestSession } = useQuery({
    queryKey: ['latest_collaboration_banner'],
    queryFn: async () => {
      if (latestSessionId) return { id: latestSessionId };
      
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) return null;
      
      const {
        data,
        error
      } = await supabase.from('collaboration_sessions').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      }).limit(1).single();
      
      if (error) {
        console.error('Error fetching latest session:', error);
        return null;
      }
      
      return data;
    },
    enabled: !isCollapsed
  });
  return (
    <div className={`relative bg-black/40 backdrop-blur-xl border-b border-konform-neon-blue/20 transition-all duration-300 ${isCollapsed ? 'py-4' : 'py-8'}`} style={{ height: isCollapsed ? 'auto' : 'calc(100vh - 120px)' }}>
      <video 
        className="absolute inset-0 w-full h-full object-cover -z-10"
        src="/Videos/KONFORM_BG_03.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10" />
      
      <div className="container mx-auto px-6 h-full flex flex-col">
        <div className="grid grid-cols-3 items-center">
          <div className="flex-1">
            <div className="relative">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white flex items-center gap-2"
                  onClick={() => setShowProjectMenu(!showProjectMenu)}
                >
                  <span className="text-lg font-semibold">{currentProject?.name || 'Untitled Project'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                {isAutoSaveEnabled && (
                  <div className="flex items-center gap-1 text-xs text-konform-neon-blue/60">
                    <Clock className="h-3 w-3" />
                    <span>Auto-Save On</span>
                  </div>
                )}
              </div>
              {showProjectMenu && (
                <div className="absolute top-full left-0 mt-2 z-[200]">
                  <ProjectMenu onClose={() => setShowProjectMenu(false)} />
                </div>
              )}
            </div>
          </div>
          <div className="text-center">
            <h1 className={`text-4xl font-bold text-white transition-all duration-300 ${isCollapsed ? 'text-3xl' : ''}`}>
              {title}
            </h1>
            {currentProject && !isCollapsed && (
              <ProjectNameInput
                currentProject={currentProject}
                onSave={async (name) => {
                  try {
                    await saveProject.mutateAsync({ name });
                  } catch (error) {
                    console.error('Error saving project name:', error);
                    toast({
                      title: "Failed to Save",
                      description: "Could not update project name.",
                      variant: "destructive"
                    });
                  }
                }}
              />
            )}
            <p className={`text-gray-400 mt-2 transition-all duration-300 ${isCollapsed ? 'hidden' : ''}`}>
              {description}
            </p>
          </div>
          <div className="flex justify-end items-center gap-4">
            <div className={`flex items-center gap-2 ${isCollapsed ? '' : 'transition-opacity duration-300 opacity-100'}`}>
              <Button
                variant="outline"
                size="sm"
                className={`bg-black/20 border-white/20 hover:bg-black/40 text-white rounded-full transition-all duration-300 ${useTrainingModeStore.getState().isTrainingEnabled ? 'border-konform-neon-blue training-mode-enabled' : ''}`}
                onClick={() => {
                  const { isTrainingEnabled, setTrainingEnabled } = useTrainingModeStore.getState();
                  setTrainingEnabled(!isTrainingEnabled);
                  toast({
                    title: isTrainingEnabled ? "Training Mode Disabled" : "Training Mode Enabled",
                    description: isTrainingEnabled ? "AI training features are now disabled" : "AI training features are now enabled",
                  });
                }}
              >
                <Brain className="w-4 h-4 mr-2" />
                Training Mode
              </Button>
              {rightContent}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCollapsedChange(!isCollapsed)}
              className="text-white/80 hover:text-white"
            >
              {isCollapsed ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Project content that appears when expanded */}
        <div className={`flex-1 overflow-y-auto mt-6 transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
          {!isCollapsed && latestSession && (
            <div className="space-y-4">
              {/* Project Actions */}
              {currentProject && (
                <div className="flex items-center justify-end gap-3 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`bg-black/20 border-white/20 hover:bg-black/40 text-white rounded-full transition-all duration-300 ${useTrainingModeStore.getState().isTrainingEnabled ? 'border-konform-neon-blue training-mode-enabled' : ''}`}
                    onClick={() => {
                      const { isTrainingEnabled, setTrainingEnabled } = useTrainingModeStore.getState();
                      setTrainingEnabled(!isTrainingEnabled);
                      toast({
                        title: isTrainingEnabled ? "Training Mode Disabled" : "Training Mode Enabled",
                        description: isTrainingEnabled ? "AI training features are now disabled" : "AI training features are now enabled",
                      });
                    }}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Training Mode
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black/20 border-white/20 hover:bg-black/40 text-white rounded-full"
                    onClick={async () => {
                      try {
                        await downloadProject(currentProject);
                        toast({
                          title: "Project Downloaded",
                          description: `Project ${currentProject.name} has been downloaded as a zip file.`
                        });
                      } catch (error) {
                        console.error('Error downloading project:', error);
                        toast({
                          title: "Download Failed",
                          description: "There was an error downloading the project.",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Project
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black/20 border-white/20 hover:bg-black/40 text-white rounded-full"
                    onClick={async () => {
                      try {
                        const template = await createProjectTemplate(currentProject);
                        toast({
                          title: "Template Created",
                          description: `Template ${template.name} has been created successfully.`
                        });
                      } catch (error) {
                        console.error('Error creating template:', error);
                        toast({
                          title: "Template Creation Failed",
                          description: "There was an error creating the project template.",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              )}
              
              {/* Collaborators Section */}
              <Collapsible 
                open={!collaboratorsCollapsed} 
                onOpenChange={(open) => setCollaboratorsCollapsed(!open)}
              >
                <div className="bg-black/40 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-konform-neon-blue/20">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Collaborators
                    </h3>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        {collaboratorsCollapsed ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <Collaborators sessionId={latestSession.id} />
                  </CollapsibleContent>
                </div>
              </Collapsible>
              
              {/* Percentage Splits Section */}
              <Collapsible 
                open={!percentageSplitsCollapsed} 
                onOpenChange={(open) => setPercentageSplitsCollapsed(!open)}
              >
                <div className="bg-black/40 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-konform-neon-blue/20">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Percentage Splits
                    </h3>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        {percentageSplitsCollapsed ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <PercentageSplits sessionId={latestSession.id} />
                  </CollapsibleContent>
                </div>
              </Collapsible>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
