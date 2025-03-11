
export interface KonformProject {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  mixer_state: any;
  editor_state: any;
  lyrics_state: any;
  created_at: string;
  updated_at: string;
  last_opened_at: string;
  version: number;
  is_template: boolean;
}

export interface ProjectVersion {
  id: string;
  project_id: string;
  version: number;
  mixer_state: any;
  editor_state: any;
  lyrics_state: any;
  created_at: string;
  created_by?: string;
  description?: string;
}
