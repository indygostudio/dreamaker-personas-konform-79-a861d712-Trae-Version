import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { KonformProject, ProjectVersion } from '@/types/project';

export const useKonformProject = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentProject, setCurrentProject] = useState<KonformProject | null>(null);
  const [recentProjects, setRecentProjects] = useState<KonformProject[]>([]);
  const [mixerState, setMixerState] = useState<any>(null);

  // Load mixer state and recent projects from localStorage on mount
  useEffect(() => {
    try {
      // Load recent projects
      const savedProjects = localStorage.getItem('konform-recent-projects');
      if (savedProjects) {
        setRecentProjects(JSON.parse(savedProjects));
      }
      
      // Load current project
      const savedCurrentProject = localStorage.getItem('konform-current-project');
      if (savedCurrentProject) {
        setCurrentProject(JSON.parse(savedCurrentProject));
      }
      
      // Load mixer state
      const savedMixerState = localStorage.getItem('konform-mixer-state');
      if (savedMixerState) {
        setMixerState(JSON.parse(savedMixerState));
      }
    } catch (error) {
      console.error('Error loading project data:', error);
    }
  }, []);
  
  // Save mixer state whenever it changes
  useEffect(() => {
    if (mixerState) {
      localStorage.setItem('konform-mixer-state', JSON.stringify(mixerState));
    }
  }, [mixerState]);

  // Fetch project versions
  const { data: projectVersions, isLoading: isLoadingVersions } = useQuery({
    queryKey: ['project-versions', currentProject?.id],
    queryFn: async () => {
      if (!currentProject?.id) return [];
      
      const { data, error } = await supabase
        .from('konform_project_versions')
        .select('*')
        .eq('project_id', currentProject.id)
        .order('version', { ascending: false });

      if (error) throw error;
      return data as ProjectVersion[];
    },
    enabled: !!currentProject?.id
  });

  // Create new project
  const createProject = useMutation({
    mutationFn: async (project: Partial<Omit<KonformProject, 'user_id'>>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('konform_projects')
        .insert({
          ...project,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data as KonformProject;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['recent-projects'] });
      setCurrentProject(data);
      toast({
        title: "Project Created",
        description: `Project "${data.name}" has been created successfully.`
      });
    }
  });

  // Save project
  const saveProject = useMutation({
    mutationFn: async (project: Partial<KonformProject>) => {
      if (!currentProject?.id) throw new Error('No project selected');

      // Create new version first
      await supabase
        .from('konform_project_versions')
        .insert({
          project_id: currentProject.id,
          version: currentProject.version + 1,
          mixer_state: project.mixer_state,
          editor_state: project.editor_state,
          lyrics_state: project.lyrics_state,
          description: 'Auto-saved version'
        });

      // Update project
      const { data, error } = await supabase
        .from('konform_projects')
        .update({
          ...project,
          version: currentProject.version + 1,
          last_opened_at: new Date().toISOString()
        })
        .eq('id', currentProject.id)
        .select()
        .single();

      if (error) throw error;
      return data as KonformProject;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project-versions'] });
      setCurrentProject(data);
      toast({
        title: "Project Saved",
        description: `Project "${data.name}" has been saved successfully.`
      });
    }
  });

  // Load project version
  const loadVersion = useMutation({
    mutationFn: async (version: ProjectVersion) => {
      const { data, error } = await supabase
        .from('konform_projects')
        .update({
          mixer_state: version.mixer_state,
          editor_state: version.editor_state,
          lyrics_state: version.lyrics_state,
          version: version.version,
          last_opened_at: new Date().toISOString()
        })
        .eq('id', version.project_id)
        .select()
        .single();

      if (error) throw error;
      return data as KonformProject;
    },
    onSuccess: (data) => {
      setCurrentProject(data);
      toast({
        title: "Version Loaded",
        description: `Project version ${data.version} has been loaded successfully.`
      });
    }
  });

  // Export project
  const exportProject = async () => {
    if (!currentProject) {
      toast({
        title: "Export Failed",
        description: "No project is currently open.",
        variant: "destructive"
      });
      return;
    }

    const projectData = {
      ...currentProject,
      exported_at: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.name.replace(/\s+/g, '_')}.konform`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Project Exported",
      description: `Project "${currentProject.name}" has been exported successfully.`
    });
  };

  // Import project
  const importProject = async (file: File) => {
    try {
      const content = await file.text();
      const projectData = JSON.parse(content);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Remove id and dates to create as new project
      const { id, created_at, updated_at, user_id, ...newProject } = projectData;
      
      const { data, error } = await supabase
        .from('konform_projects')
        .insert({
          ...newProject,
          user_id: user.id,
          name: `${newProject.name} (Imported)`,
          status: 'draft',
          version: 1
        })
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['recent-projects'] });
      setCurrentProject(data);
      
      toast({
        title: "Project Imported",
        description: `Project "${data.name}" has been imported successfully.`
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "The selected file is not a valid Konform project file.",
        variant: "destructive"
      });
    }
  };

  // Update mixer state function
  const updateMixerState = (channels: any[]) => {
    const newMixerState = {
      ...mixerState || {},
      channels,
      lastUpdated: new Date().toISOString()
    };
    
    setMixerState(newMixerState);
    localStorage.setItem('konform-mixer-state', JSON.stringify(newMixerState));
    
    // If there's a current project, update its mixer state reference
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        mixerStateLastUpdated: new Date().toISOString()
      };
      setCurrentProject(updatedProject);
      localStorage.setItem('konform-current-project', JSON.stringify(updatedProject));
    }
  };

  return {
    currentProject,
    recentProjects,
    projectVersions,
    isLoadingVersions,
    setCurrentProject,
    createProject,
    saveProject,
    loadVersion,
    exportProject,
    importProject,
    mixerState,
    updateMixerState
  };
};
