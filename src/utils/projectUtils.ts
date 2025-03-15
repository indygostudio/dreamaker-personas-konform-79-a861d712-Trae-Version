import JSZip from 'jszip';
import { KonformProject } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a zip file containing all project files and session data
 * @param project The project to download
 * @returns A Promise that resolves to a Blob containing the zip file
 */
export const createProjectZip = async (project: KonformProject): Promise<Blob> => {
  const zip = new JSZip();
  
  // Add project metadata
  zip.file('project.json', JSON.stringify(project, null, 2));
  
  // Add project versions
  const { data: versions, error: versionsError } = await supabase
    .from('konform_project_versions')
    .select('*')
    .eq('project_id', project.id);
    
  if (!versionsError && versions) {
    zip.file('versions.json', JSON.stringify(versions, null, 2));
  }
  
  // Add session data if available
  const { data: sessions, error: sessionsError } = await supabase
    .from('collaboration_sessions')
    .select('*')
    .eq('project_id', project.id);
    
  if (!sessionsError && sessions) {
    zip.file('sessions.json', JSON.stringify(sessions, null, 2));
    
    // Get collaborators data
    if (sessions.length > 0) {
      const sessionWithPersonas = sessions.find(s => s.personas && s.personas.length > 0);
      
      if (sessionWithPersonas && sessionWithPersonas.personas) {
        const { data: personas, error: personasError } = await supabase
          .from('personas')
          .select('*')
          .in('id', sessionWithPersonas.personas);
          
        if (!personasError && personas) {
          zip.file('collaborators.json', JSON.stringify(personas, null, 2));
        }
      }
    }
  }
  
  // Add mixer state
  if (project.mixer_state) {
    zip.file('mixer_state.json', JSON.stringify(project.mixer_state, null, 2));
  }
  
  // Add editor state
  if (project.editor_state) {
    zip.file('editor_state.json', JSON.stringify(project.editor_state, null, 2));
  }
  
  // Add lyrics state
  if (project.lyrics_state) {
    zip.file('lyrics_state.json', JSON.stringify(project.lyrics_state, null, 2));
  }
  
  // Generate the zip file
  return await zip.generateAsync({ type: 'blob' });
};

/**
 * Downloads a project as a zip file
 * @param project The project to download
 */
export const downloadProject = async (project: KonformProject): Promise<void> => {
  try {
    const blob = await createProjectZip(project);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading project:', error);
    throw error;
  }
};

/**
 * Creates a project template from an existing project
 * @param project The project to create a template from
 * @param templateName Optional name for the template (defaults to project name + Template)
 * @returns A Promise that resolves to the created template project
 */
export const createProjectTemplate = async (
  project: KonformProject,
  templateName?: string
): Promise<KonformProject> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Create a new project as a template
    const { data, error } = await supabase
      .from('konform_projects')
      .insert({
        user_id: user.id,
        name: templateName || `${project.name} Template`,
        description: `Template created from ${project.name}`,
        status: 'published',
        mixer_state: project.mixer_state,
        editor_state: project.editor_state,
        lyrics_state: project.lyrics_state,
        version: 1,
        is_template: true
      })
      .select()
      .single();
      
    if (error) throw error;
    return data as KonformProject;
  } catch (error) {
    console.error('Error creating project template:', error);
    throw error;
  }
};