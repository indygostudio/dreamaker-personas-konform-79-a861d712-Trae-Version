import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useKonformProject } from '@/hooks/useKonformProject';
import { useProjectSettingsStore } from './store/projectSettingsStore';
import { ChevronDown, Save, Download, Upload, Plus, Clock, Settings, Share2 } from 'lucide-react';
import { KonformProject } from '@/types/project';

interface ProjectMenuProps {
  onClose: () => void;
}

export const ProjectMenu = ({ onClose }: ProjectMenuProps) => {
  const { toast } = useToast();
  const { 
    currentProject, 
    recentProjects, 
    setCurrentProject, 
    createProject, 
    saveProject,
    exportProject,
    importProject
  } = useKonformProject();
  
  const { autoSaveEnabled, autoSaveInterval, setAutoSaveEnabled, setAutoSaveInterval } = useProjectSettingsStore();
  
  const [showSettings, setShowSettings] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateProject = async () => {
    try {
      await createProject.mutateAsync({
        name: newProjectName || 'New Project',
        status: 'draft'
      });
      setIsCreatingNew(false);
      setNewProjectName('');
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Project Creation Failed",
        description: "Could not create a new project.",
        variant: "destructive"
      });
    }
  };

  const handleSaveProject = async () => {
    if (!currentProject) return;
    
    try {
      await saveProject.mutateAsync({
        // Keep existing state
        mixer_state: currentProject.mixer_state,
        editor_state: currentProject.editor_state,
        lyrics_state: currentProject.lyrics_state
      });
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Save Failed",
        description: "Could not save the project.",
        variant: "destructive"
      });
    }
  };

  const handleSaveAsProject = async () => {
    if (!currentProject) return;
    setIsCreatingNew(true);
    setNewProjectName(currentProject.name + " (Copy)");
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: "Success",
          description: "Project link copied to clipboard",
        });
      })
      .catch((error) => {
        console.error("Failed to copy link:", error);
        toast({
          title: "Error",
          description: "Failed to copy link to clipboard",
          variant: "destructive"
        });
      });
  };

  const handleExportProject = () => {
    exportProject();
    onClose();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportProject = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      await importProject(file);
      onClose();
    } catch (error) {
      console.error('Error importing project:', error);
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectProject = (project: KonformProject) => {
    setCurrentProject(project);
    onClose();
  };

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-konform-neon-blue/20 rounded-lg shadow-lg p-4 w-72 z-[1000]">
      {!showSettings ? (
        <>
          {isCreatingNew ? (
            <div className="space-y-4">
              <h3 className="text-white text-lg font-medium">New Project</h3>
              <Input
                placeholder="Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="bg-black/40 border-konform-neon-blue/20 text-white"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsCreatingNew(false)}
                  className="text-white/80 hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleCreateProject}
                  className="bg-konform-neon-blue/80 hover:bg-konform-neon-blue text-white"
                >
                  Create
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white text-lg font-medium">Project</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(true)}
                  className="text-white/60 hover:text-white h-8 w-8"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {currentProject && (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full justify-start text-white bg-konform-neon-blue/80 hover:bg-konform-neon-blue"
                      onClick={handleSaveProject}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Project
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                      onClick={handleSaveAsProject}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save As...
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                      onClick={copyToClipboard}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Project
                    </Button>
                  </>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => setIsCreatingNew(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                  onClick={handleExportProject}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Project
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                  onClick={handleImportClick}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Project
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportProject}
                  accept=".konform"
                  className="hidden"
                />
              </div>
              
              {recentProjects?.length > 0 && (
                <>
                  <div className="h-px bg-konform-neon-blue/20 my-2" />
                  <div className="flex items-center gap-2 text-white/60 text-xs">
                    <Clock className="h-3 w-3" />
                    Recent Projects
                  </div>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {recentProjects.map((project) => (
                      <Button
                        key={project.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 truncate"
                        onClick={() => handleSelectProject(project)}
                      >
                        {project.name}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white text-lg font-medium">Project Settings</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(false)}
              className="text-white/60 hover:text-white h-8 w-8"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save" className="text-white/80">Auto-Save</Label>
              <Switch
                id="auto-save"
                checked={autoSaveEnabled}
                onCheckedChange={setAutoSaveEnabled}
              />
            </div>
            
            {autoSaveEnabled && (
              <div className="space-y-2">
                <Label htmlFor="auto-save-interval" className="text-white/80">Auto-Save Interval (minutes)</Label>
                <select
                  id="auto-save-interval"
                  value={autoSaveInterval}
                  onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
                  className="w-full bg-black/40 border border-konform-neon-blue/20 rounded-md p-2 text-white"
                >
                  <option value={1}>1 minute</option>
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};