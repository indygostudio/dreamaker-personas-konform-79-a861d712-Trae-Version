export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          activity_type: string
          created_at: string
          data: Json | null
          entity_id: string
          entity_type: string
          id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          data?: Json | null
          entity_id: string
          entity_type: string
          id?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          data?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_avatars: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          model_type: string | null
          persona_id: string | null
          style: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          model_type?: string | null
          persona_id?: string | null
          style?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          model_type?: string | null
          persona_id?: string | null
          style?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_generations: {
        Row: {
          created_at: string | null
          generated_content: string | null
          generation_type: string
          id: string
          params: Json | null
          persona_id: string | null
          prompt: string | null
          result: Json | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          generated_content?: string | null
          generation_type: string
          id?: string
          params?: Json | null
          persona_id?: string | null
          prompt?: string | null
          result?: Json | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          generated_content?: string | null
          generation_type?: string
          id?: string
          params?: Json | null
          persona_id?: string | null
          prompt?: string | null
          result?: Json | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_image_tasks: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          persona_id: string | null
          prompt: string
          result_url: string | null
          service: string
          status: string
          task_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          persona_id?: string | null
          prompt: string
          result_url?: string | null
          service?: string
          status?: string
          task_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          persona_id?: string | null
          prompt?: string
          result_url?: string | null
          service?: string
          status?: string
          task_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_image_tasks_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_image_tasks_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "public_personas"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_images: {
        Row: {
          created_at: string | null
          height: number | null
          id: string
          image_url: string
          is_hidden: boolean | null
          is_liked: boolean | null
          metadata: Json | null
          persona_id: string | null
          prompt: string | null
          rating: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string
          width: number | null
        }
        Insert: {
          created_at?: string | null
          height?: number | null
          id?: string
          image_url: string
          is_hidden?: boolean | null
          is_liked?: boolean | null
          metadata?: Json | null
          persona_id?: string | null
          prompt?: string | null
          rating?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id: string
          width?: number | null
        }
        Update: {
          created_at?: string | null
          height?: number | null
          id?: string
          image_url?: string
          is_hidden?: boolean | null
          is_liked?: boolean | null
          metadata?: Json | null
          persona_id?: string | null
          prompt?: string | null
          rating?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_images_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_images_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "public_personas"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_model_configs: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          label_id: string | null
          model_type: string
          parameters: Json | null
          performance_metrics: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          label_id?: string | null
          model_type: string
          parameters?: Json | null
          performance_metrics?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          label_id?: string | null
          model_type?: string
          parameters?: Json | null
          performance_metrics?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_model_configs_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "record_labels"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_music_generations: {
        Row: {
          created_at: string
          duration: number | null
          generation_type: string
          genre: string | null
          id: string
          key: string | null
          output_url: string | null
          parameters: Json | null
          prompt: string
          source_track_url: string | null
          status: string | null
          style: string | null
          tempo: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration?: number | null
          generation_type: string
          genre?: string | null
          id?: string
          key?: string | null
          output_url?: string | null
          parameters?: Json | null
          prompt: string
          source_track_url?: string | null
          status?: string | null
          style?: string | null
          tempo?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration?: number | null
          generation_type?: string
          genre?: string | null
          id?: string
          key?: string | null
          output_url?: string | null
          parameters?: Json | null
          prompt?: string
          source_track_url?: string | null
          status?: string | null
          style?: string | null
          tempo?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_video_generations: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          output_url: string | null
          persona_id: string | null
          prompt: string | null
          source: string | null
          status: string | null
          task_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          output_url?: string | null
          persona_id?: string | null
          prompt?: string | null
          source?: string | null
          status?: string | null
          task_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          output_url?: string | null
          persona_id?: string | null
          prompt?: string | null
          source?: string | null
          status?: string | null
          task_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_vocals: {
        Row: {
          created_at: string
          duration: number | null
          id: string
          output_url: string | null
          prompt: string
          status: string | null
          updated_at: string
          user_id: string
          voice_id: string | null
        }
        Insert: {
          created_at?: string
          duration?: number | null
          id?: string
          output_url?: string | null
          prompt: string
          status?: string | null
          updated_at?: string
          user_id: string
          voice_id?: string | null
        }
        Update: {
          created_at?: string
          duration?: number | null
          id?: string
          output_url?: string | null
          prompt?: string
          status?: string | null
          updated_at?: string
          user_id?: string
          voice_id?: string | null
        }
        Relationships: []
      }
      artist_favorites: {
        Row: {
          artist_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          artist_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          artist_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      artist_profiles: {
        Row: {
          analytics: Json | null
          animation_preset: string | null
          avatar_url: string | null
          banner_position: Json | null
          banner_url: string | null
          created_at: string
          genre: string[] | null
          has_3d_model: boolean | null
          id: string
          is_public: boolean | null
          location: string | null
          model_url: string | null
          notification_settings: Json | null
          persona_count: number | null
          persona_ids: string[] | null
          privacy_settings: Json | null
          updated_at: string
          user_bio: string | null
          username: string | null
          video_url: string | null
        }
        Insert: {
          analytics?: Json | null
          animation_preset?: string | null
          avatar_url?: string | null
          banner_position?: Json | null
          banner_url?: string | null
          created_at?: string
          genre?: string[] | null
          has_3d_model?: boolean | null
          id: string
          is_public?: boolean | null
          location?: string | null
          model_url?: string | null
          notification_settings?: Json | null
          persona_count?: number | null
          persona_ids?: string[] | null
          privacy_settings?: Json | null
          updated_at?: string
          user_bio?: string | null
          username?: string | null
          video_url?: string | null
        }
        Update: {
          analytics?: Json | null
          animation_preset?: string | null
          avatar_url?: string | null
          banner_position?: Json | null
          banner_url?: string | null
          created_at?: string
          genre?: string[] | null
          has_3d_model?: boolean | null
          id?: string
          is_public?: boolean | null
          location?: string | null
          model_url?: string | null
          notification_settings?: Json | null
          persona_count?: number | null
          persona_ids?: string[] | null
          privacy_settings?: Json | null
          updated_at?: string
          user_bio?: string | null
          username?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      artist_submissions: {
        Row: {
          created_at: string
          id: string
          label_id: string | null
          status: string | null
          submission_data: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label_id?: string | null
          status?: string | null
          submission_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          label_id?: string | null
          status?: string | null
          submission_data?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_submissions_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "record_labels"
            referencedColumns: ["id"]
          },
        ]
      }
      audio_device_info: {
        Row: {
          buffer_sizes: number[] | null
          channel_count: number | null
          created_at: string
          device_id: string
          id: string
          is_default: boolean | null
          is_input: boolean | null
          is_output: boolean | null
          last_used: string | null
          name: string
          sample_rates: number[] | null
        }
        Insert: {
          buffer_sizes?: number[] | null
          channel_count?: number | null
          created_at?: string
          device_id: string
          id?: string
          is_default?: boolean | null
          is_input?: boolean | null
          is_output?: boolean | null
          last_used?: string | null
          name: string
          sample_rates?: number[] | null
        }
        Update: {
          buffer_sizes?: number[] | null
          channel_count?: number | null
          created_at?: string
          device_id?: string
          id?: string
          is_default?: boolean | null
          is_input?: boolean | null
          is_output?: boolean | null
          last_used?: string | null
          name?: string
          sample_rates?: number[] | null
        }
        Relationships: []
      }
      audio_loops: {
        Row: {
          audio_url: string
          created_at: string
          id: string
          meter: string | null
          musical_key: string | null
          sample_name: string | null
          tempo: number | null
          title: string
          token_cost: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_url: string
          created_at?: string
          id?: string
          meter?: string | null
          musical_key?: string | null
          sample_name?: string | null
          tempo?: number | null
          title: string
          token_cost?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_url?: string
          created_at?: string
          id?: string
          meter?: string | null
          musical_key?: string | null
          sample_name?: string | null
          tempo?: number | null
          title?: string
          token_cost?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audio_midi_devices: {
        Row: {
          created_at: string
          device_type: Database["public"]["Enums"]["device_type"]
          driver_name: string | null
          id: string
          is_default: boolean | null
          is_input: boolean | null
          is_output: boolean | null
          name: string
          settings: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_type: Database["public"]["Enums"]["device_type"]
          driver_name?: string | null
          id?: string
          is_default?: boolean | null
          is_input?: boolean | null
          is_output?: boolean | null
          name: string
          settings?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_type?: Database["public"]["Enums"]["device_type"]
          driver_name?: string | null
          id?: string
          is_default?: boolean | null
          is_input?: boolean | null
          is_output?: boolean | null
          name?: string
          settings?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      audio_tracks: {
        Row: {
          beat_positions: Json | null
          bpm: number | null
          created_at: string
          duration: number
          file_url: string
          id: string
          story_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          beat_positions?: Json | null
          bpm?: number | null
          created_at?: string
          duration: number
          file_url: string
          id?: string
          story_id: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          beat_positions?: Json | null
          bpm?: number | null
          created_at?: string
          duration?: number
          file_url?: string
          id?: string
          story_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audio_tracks_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      banners: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          start_date: string
          title: string
          type: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          start_date: string
          title: string
          type: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          start_date?: string
          title?: string
          type?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          reading_time: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      collaboration_metrics: {
        Row: {
          ai_contribution_percentage: number | null
          collaboration_type: string | null
          created_at: string
          credits: Json | null
          human_contribution_percentage: number | null
          id: string
          track_id: string | null
          updated_at: string
        }
        Insert: {
          ai_contribution_percentage?: number | null
          collaboration_type?: string | null
          created_at?: string
          credits?: Json | null
          human_contribution_percentage?: number | null
          id?: string
          track_id?: string | null
          updated_at?: string
        }
        Update: {
          ai_contribution_percentage?: number | null
          collaboration_type?: string | null
          created_at?: string
          credits?: Json | null
          human_contribution_percentage?: number | null
          id?: string
          track_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_metrics_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration_requests: {
        Row: {
          created_at: string
          from_user_id: string
          id: string
          status: string
          to_artist_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_user_id: string
          id?: string
          status?: string
          to_artist_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_user_id?: string
          id?: string
          status?: string
          to_artist_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      collaboration_sessions: {
        Row: {
          created_at: string
          id: string
          name: string
          output_settings: Json | null
          performance_metrics: Json | null
          personas: string[]
          status: string | null
          style_blend_settings: Json | null
          updated_at: string
          user_id: string
          version: number | null
          voice_blend_settings: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          output_settings?: Json | null
          performance_metrics?: Json | null
          personas?: string[]
          status?: string | null
          style_blend_settings?: Json | null
          updated_at?: string
          user_id: string
          version?: number | null
          voice_blend_settings?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          output_settings?: Json | null
          performance_metrics?: Json | null
          personas?: string[]
          status?: string | null
          style_blend_settings?: Json | null
          updated_at?: string
          user_id?: string
          version?: number | null
          voice_blend_settings?: Json | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          artist_id: string | null
          content: string
          created_at: string | null
          id: string
          user_id: string | null
          username: string | null
        }
        Insert: {
          artist_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          user_id?: string | null
          username?: string | null
        }
        Update: {
          artist_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      context_menu_components: {
        Row: {
          component_name: string
          component_path: string
          created_at: string | null
          id: string
          is_active: boolean | null
        }
        Insert: {
          component_name: string
          component_path: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
        }
        Update: {
          component_name?: string
          component_path?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      dataset_votes: {
        Row: {
          created_at: string
          dataset_id: string | null
          feedback: string | null
          id: string
          score: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          dataset_id?: string | null
          feedback?: string | null
          id?: string
          score: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          dataset_id?: string | null
          feedback?: string | null
          id?: string
          score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dataset_votes_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "training_datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      design_changes: {
        Row: {
          changes: Json
          created_at: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          changes?: Json
          created_at?: string
          id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          changes?: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      drum_machine_presets: {
        Row: {
          created_at: string
          id: string
          is_favorite: boolean | null
          name: string
          pattern: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          name?: string
          pattern?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          name?: string
          pattern?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      drum_pads: {
        Row: {
          created_at: string | null
          id: string
          is_loop: boolean | null
          pad_index: number
          sample_path: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_loop?: boolean | null
          pad_index: number
          sample_path?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_loop?: boolean | null
          pad_index?: number
          sample_path?: string | null
          user_id?: string
        }
        Relationships: []
      }
      konform_project_versions: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          editor_state: Json | null
          id: string
          lyrics_state: Json | null
          mixer_state: Json | null
          project_id: string
          version: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          editor_state?: Json | null
          id?: string
          lyrics_state?: Json | null
          mixer_state?: Json | null
          project_id: string
          version: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          editor_state?: Json | null
          id?: string
          lyrics_state?: Json | null
          mixer_state?: Json | null
          project_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "konform_project_versions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "konform_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "konform_project_versions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "recent_konform_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      konform_projects: {
        Row: {
          created_at: string | null
          description: string | null
          editor_state: Json | null
          id: string
          is_template: boolean | null
          last_opened_at: string | null
          lyrics_state: Json | null
          mixer_state: Json | null
          name: string
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          editor_state?: Json | null
          id?: string
          is_template?: boolean | null
          last_opened_at?: string | null
          lyrics_state?: Json | null
          mixer_state?: Json | null
          name?: string
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          editor_state?: Json | null
          id?: string
          is_template?: boolean | null
          last_opened_at?: string | null
          lyrics_state?: Json | null
          mixer_state?: Json | null
          name?: string
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: []
      }
      lyrics: {
        Row: {
          content: string
          created_at: string
          id: string
          persona_id: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          persona_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          persona_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lyrics_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lyrics_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "public_personas"
            referencedColumns: ["id"]
          },
        ]
      }
      lyrics_generations: {
        Row: {
          content: string | null
          created_at: string
          emotions: string[] | null
          genre: string | null
          id: string
          keywords: string[] | null
          metadata: Json | null
          model_version: string | null
          project_id: string | null
          prompt: string
          status: string | null
          title: string | null
          topics: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          emotions?: string[] | null
          genre?: string | null
          id?: string
          keywords?: string[] | null
          metadata?: Json | null
          model_version?: string | null
          project_id?: string | null
          prompt: string
          status?: string | null
          title?: string | null
          topics?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          emotions?: string[] | null
          genre?: string | null
          id?: string
          keywords?: string[] | null
          metadata?: Json | null
          model_version?: string | null
          project_id?: string | null
          prompt?: string
          status?: string | null
          title?: string | null
          topics?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lyrics_generations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "konform_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lyrics_generations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "recent_konform_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      media_collections: {
        Row: {
          banner_position: Json | null
          banner_url: string | null
          bpm: number | null
          card_image_url: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          downloads_count: number | null
          featured_order: number | null
          genre: string[] | null
          id: string
          is_public: boolean | null
          likes_count: number | null
          media_type: string
          media_types: string[] | null
          musical_key: string | null
          persona_id: string | null
          preview_image_url: string | null
          preview_url: string | null
          price: number | null
          required_tier: Database["public"]["Enums"]["subscription_tier"] | null
          style_tags: string[] | null
          tags: string[] | null
          technical_specs: Json | null
          title: string
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          banner_position?: Json | null
          banner_url?: string | null
          bpm?: number | null
          card_image_url?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          downloads_count?: number | null
          featured_order?: number | null
          genre?: string[] | null
          id?: string
          is_public?: boolean | null
          likes_count?: number | null
          media_type?: string
          media_types?: string[] | null
          musical_key?: string | null
          persona_id?: string | null
          preview_image_url?: string | null
          preview_url?: string | null
          price?: number | null
          required_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          style_tags?: string[] | null
          tags?: string[] | null
          technical_specs?: Json | null
          title?: string
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          banner_position?: Json | null
          banner_url?: string | null
          bpm?: number | null
          card_image_url?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          downloads_count?: number | null
          featured_order?: number | null
          genre?: string[] | null
          id?: string
          is_public?: boolean | null
          likes_count?: number | null
          media_type?: string
          media_types?: string[] | null
          musical_key?: string | null
          persona_id?: string | null
          preview_image_url?: string | null
          preview_url?: string | null
          price?: number | null
          required_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          style_tags?: string[] | null
          tags?: string[] | null
          technical_specs?: Json | null
          title?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_collections_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_collections_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "public_personas"
            referencedColumns: ["id"]
          },
        ]
      }
      media_favorites: {
        Row: {
          created_at: string
          id: string
          media_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          media_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          media_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_favorites_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_favorites_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "public_media_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      media_files: {
        Row: {
          collection_id: string
          created_at: string
          duration: number | null
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          metadata: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          duration?: number | null
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          metadata?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          duration?: number | null
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          metadata?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_collection"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "media_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_collection"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "public_media_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_files_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "media_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_files_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "public_media_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      media_packs: {
        Row: {
          bpm: number | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          is_public: boolean | null
          musical_key: string | null
          preview_image_url: string | null
          required_tier: Database["public"]["Enums"]["subscription_tier"]
          title: string
          type: Database["public"]["Enums"]["media_pack_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          bpm?: number | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          musical_key?: string | null
          preview_image_url?: string | null
          required_tier?: Database["public"]["Enums"]["subscription_tier"]
          title: string
          type: Database["public"]["Enums"]["media_pack_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          bpm?: number | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          musical_key?: string | null
          preview_image_url?: string | null
          required_tier?: Database["public"]["Enums"]["subscription_tier"]
          title?: string
          type?: Database["public"]["Enums"]["media_pack_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      midi_tracks: {
        Row: {
          bpm: number | null
          created_at: string
          duration: number | null
          id: string
          key_signature: string | null
          midi_data: string | null
          name: string
          time_signature: string | null
          updated_at: string
          user_id: string | null
          vst_plugin_id: string | null
          vst_settings: Json | null
        }
        Insert: {
          bpm?: number | null
          created_at?: string
          duration?: number | null
          id?: string
          key_signature?: string | null
          midi_data?: string | null
          name?: string
          time_signature?: string | null
          updated_at?: string
          user_id?: string | null
          vst_plugin_id?: string | null
          vst_settings?: Json | null
        }
        Update: {
          bpm?: number | null
          created_at?: string
          duration?: number | null
          id?: string
          key_signature?: string | null
          midi_data?: string | null
          name?: string
          time_signature?: string | null
          updated_at?: string
          user_id?: string | null
          vst_plugin_id?: string | null
          vst_settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "midi_tracks_vst_plugin_id_fkey"
            columns: ["vst_plugin_id"]
            isOneToOne: false
            referencedRelation: "vst_plugins"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      persona_follows: {
        Row: {
          created_at: string
          follower_id: string
          id: string
          is_favorite: boolean | null
          persona_id: string
          status: Database["public"]["Enums"]["follow_status"] | null
        }
        Insert: {
          created_at?: string
          follower_id: string
          id?: string
          is_favorite?: boolean | null
          persona_id: string
          status?: Database["public"]["Enums"]["follow_status"] | null
        }
        Update: {
          created_at?: string
          follower_id?: string
          id?: string
          is_favorite?: boolean | null
          persona_id?: string
          status?: Database["public"]["Enums"]["follow_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "persona_follows_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "persona_follows_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "public_personas"
            referencedColumns: ["id"]
          },
        ]
      }
      persona_states: {
        Row: {
          collab_id: string | null
          created_at: string | null
          id: string
          is_muted: boolean | null
          persona_id: string
          track_mode: string | null
          updated_at: string | null
          user_id: string
          volume: number | null
        }
        Insert: {
          collab_id?: string | null
          created_at?: string | null
          id?: string
          is_muted?: boolean | null
          persona_id: string
          track_mode?: string | null
          updated_at?: string | null
          user_id: string
          volume?: number | null
        }
        Update: {
          collab_id?: string | null
          created_at?: string | null
          id?: string
          is_muted?: boolean | null
          persona_id?: string
          track_mode?: string | null
          updated_at?: string | null
          user_id?: string
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_persona"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_persona"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "public_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "persona_states_collab_id_fkey"
            columns: ["collab_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "persona_states_collab_id_fkey"
            columns: ["collab_id"]
            isOneToOne: false
            referencedRelation: "public_personas"
            referencedColumns: ["id"]
          },
        ]
      }
      persona_voice_models: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          persona_id: string | null
          sample_count: number | null
          status: string | null
          task_id: string | null
          updated_at: string | null
          user_id: string | null
          voice_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          persona_id?: string | null
          sample_count?: number | null
          status?: string | null
          task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          voice_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          persona_id?: string | null
          sample_count?: number | null
          status?: string | null
          task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          voice_name?: string
        }
        Relationships: []
      }
      personas: {
        Row: {
          achievements: Json | null
          age: string | null
          ai_influence_metrics: Json | null
          analytics: Json | null
          artist_category: string | null
          artist_profile_id: string | null
          audio_preview_url: string | null
          avatar_url: string | null
          background_music_url: string | null
          banner_darkness: number | null
          banner_position: Json | null
          banner_url: string | null
          compressed_url: string | null
          created_at: string
          dataset_contributions: Json | null
          description: string | null
          featured_works: Json | null
          gender: string | null
          genre_specialties: string[] | null
          id: string
          included_personas: string[] | null
          instrument: Database["public"]["Enums"]["instrument_type"] | null
          is_collab: boolean | null
          is_favorite: boolean | null
          is_label_artist: boolean | null
          is_public: boolean | null
          language: string | null
          likes_count: number | null
          location: string | null
          monetization_stats: Json | null
          mood_images: string[] | null
          name: string
          preferred_order: number | null
          privacy_settings: Json | null
          rhyme_scheme_preferences: Json | null
          style: string | null
          tagline: string | null
          technical_level: string | null
          technical_specs: Json | null
          type: Database["public"]["Enums"]["persona_type"] | null
          updated_at: string
          user_count: number | null
          user_id: string
          video_url: string | null
          vocal_style: string | null
          voice_sample_url: string | null
          voice_type: string | null
          workflow_style: string | null
          writing_style: Json | null
        }
        Insert: {
          achievements?: Json | null
          age?: string | null
          ai_influence_metrics?: Json | null
          analytics?: Json | null
          artist_category?: string | null
          artist_profile_id?: string | null
          audio_preview_url?: string | null
          avatar_url?: string | null
          background_music_url?: string | null
          banner_darkness?: number | null
          banner_position?: Json | null
          banner_url?: string | null
          compressed_url?: string | null
          created_at?: string
          dataset_contributions?: Json | null
          description?: string | null
          featured_works?: Json | null
          gender?: string | null
          genre_specialties?: string[] | null
          id?: string
          included_personas?: string[] | null
          instrument?: Database["public"]["Enums"]["instrument_type"] | null
          is_collab?: boolean | null
          is_favorite?: boolean | null
          is_label_artist?: boolean | null
          is_public?: boolean | null
          language?: string | null
          likes_count?: number | null
          location?: string | null
          monetization_stats?: Json | null
          mood_images?: string[] | null
          name?: string
          preferred_order?: number | null
          privacy_settings?: Json | null
          rhyme_scheme_preferences?: Json | null
          style?: string | null
          tagline?: string | null
          technical_level?: string | null
          technical_specs?: Json | null
          type?: Database["public"]["Enums"]["persona_type"] | null
          updated_at?: string
          user_count?: number | null
          user_id?: string
          video_url?: string | null
          vocal_style?: string | null
          voice_sample_url?: string | null
          voice_type?: string | null
          workflow_style?: string | null
          writing_style?: Json | null
        }
        Update: {
          achievements?: Json | null
          age?: string | null
          ai_influence_metrics?: Json | null
          analytics?: Json | null
          artist_category?: string | null
          artist_profile_id?: string | null
          audio_preview_url?: string | null
          avatar_url?: string | null
          background_music_url?: string | null
          banner_darkness?: number | null
          banner_position?: Json | null
          banner_url?: string | null
          compressed_url?: string | null
          created_at?: string
          dataset_contributions?: Json | null
          description?: string | null
          featured_works?: Json | null
          gender?: string | null
          genre_specialties?: string[] | null
          id?: string
          included_personas?: string[] | null
          instrument?: Database["public"]["Enums"]["instrument_type"] | null
          is_collab?: boolean | null
          is_favorite?: boolean | null
          is_label_artist?: boolean | null
          is_public?: boolean | null
          language?: string | null
          likes_count?: number | null
          location?: string | null
          monetization_stats?: Json | null
          mood_images?: string[] | null
          name?: string
          preferred_order?: number | null
          privacy_settings?: Json | null
          rhyme_scheme_preferences?: Json | null
          style?: string | null
          tagline?: string | null
          technical_level?: string | null
          technical_specs?: Json | null
          type?: Database["public"]["Enums"]["persona_type"] | null
          updated_at?: string
          user_count?: number | null
          user_id?: string
          video_url?: string | null
          vocal_style?: string | null
          voice_sample_url?: string | null
          voice_type?: string | null
          workflow_style?: string | null
          writing_style?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "personas_artist_profile_id_fkey"
            columns: ["artist_profile_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_shares: {
        Row: {
          created_at: string | null
          id: string
          playlist_id: string
          shared_by: string
          shared_with: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          playlist_id: string
          shared_by: string
          shared_with: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          playlist_id?: string
          shared_by?: string
          shared_with?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_shares_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          album_artwork_url: string | null
          album_order: number | null
          album_title: string | null
          created_at: string
          id: string
          is_default: boolean | null
          is_hidden: boolean | null
          name: string
          persona_id: string | null
          updated_at: string
        }
        Insert: {
          album_artwork_url?: string | null
          album_order?: number | null
          album_title?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          is_hidden?: boolean | null
          name?: string
          persona_id?: string | null
          updated_at?: string
        }
        Update: {
          album_artwork_url?: string | null
          album_order?: number | null
          album_title?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          is_hidden?: boolean | null
          name?: string
          persona_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlists_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlists_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "public_personas"
            referencedColumns: ["id"]
          },
        ]
      }
      plugin_info: {
        Row: {
          created_at: string
          format: Database["public"]["Enums"]["plugin_format"]
          id: string
          is_effect: boolean | null
          is_instrument: boolean | null
          last_used: string | null
          manufacturer: string | null
          name: string
          path: string
          settings: Json | null
          user_id: string | null
          version: string | null
        }
        Insert: {
          created_at?: string
          format: Database["public"]["Enums"]["plugin_format"]
          id?: string
          is_effect?: boolean | null
          is_instrument?: boolean | null
          last_used?: string | null
          manufacturer?: string | null
          name: string
          path: string
          settings?: Json | null
          user_id?: string | null
          version?: string | null
        }
        Update: {
          created_at?: string
          format?: Database["public"]["Enums"]["plugin_format"]
          id?: string
          is_effect?: boolean | null
          is_instrument?: boolean | null
          last_used?: string | null
          manufacturer?: string | null
          name?: string
          path?: string
          settings?: Json | null
          user_id?: string | null
          version?: string | null
        }
        Relationships: []
      }
      plugin_presets: {
        Row: {
          created_at: string
          id: string
          name: string
          plugin_id: string | null
          settings: Json
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          plugin_id?: string | null
          settings: Json
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          plugin_id?: string | null
          settings?: Json
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plugin_presets_plugin_id_fkey"
            columns: ["plugin_id"]
            isOneToOne: false
            referencedRelation: "plugin_info"
            referencedColumns: ["id"]
          },
        ]
      }
      plugin_scan_folders: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          format: string
          id: string
          path: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          format: string
          id?: string
          path: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          format?: string
          id?: string
          path?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      plugin_scan_info: {
        Row: {
          category: string | null
          created_at: string
          format: string
          id: string
          is_effect: boolean | null
          is_instrument: boolean | null
          last_scan: string | null
          name: string
          path: string
          supports_midi: boolean | null
          vendor: string | null
          version: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          format: string
          id?: string
          is_effect?: boolean | null
          is_instrument?: boolean | null
          last_scan?: string | null
          name: string
          path: string
          supports_midi?: boolean | null
          vendor?: string | null
          version?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          format?: string
          id?: string
          is_effect?: boolean | null
          is_instrument?: boolean | null
          last_scan?: string | null
          name?: string
          path?: string
          supports_midi?: boolean | null
          vendor?: string | null
          version?: string | null
        }
        Relationships: []
      }
      presets: {
        Row: {
          created_at: string
          id: string
          is_favorite: boolean | null
          name: string
          settings: Json
          type: Database["public"]["Enums"]["preset_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          name?: string
          settings?: Json
          type: Database["public"]["Enums"]["preset_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          name?: string
          settings?: Json
          type?: Database["public"]["Enums"]["preset_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          audio_preview_url: string | null
          avatar_url: string | null
          banner_position: Json | null
          banner_url: string | null
          bio: string | null
          compressed_url: string | null
          created_at: string
          darkness_factor: number | null
          display_name: string | null
          featured_persona_id: string | null
          genre: string[] | null
          id: string
          interests: string[] | null
          is_public: boolean | null
          location: string | null
          onboarding_completed: boolean | null
          preferred_genres: string[] | null
          primary_creator_type:
            | Database["public"]["Enums"]["creator_type"]
            | null
          profile_type: Database["public"]["Enums"]["profile_type_enum"] | null
          secondary_creator_types:
            | Database["public"]["Enums"]["artist_type"][]
            | null
          subscription_expires_at: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          user_bio: string | null
          username: string | null
          video_url: string | null
        }
        Insert: {
          audio_preview_url?: string | null
          avatar_url?: string | null
          banner_position?: Json | null
          banner_url?: string | null
          bio?: string | null
          compressed_url?: string | null
          created_at?: string
          darkness_factor?: number | null
          display_name?: string | null
          featured_persona_id?: string | null
          genre?: string[] | null
          id: string
          interests?: string[] | null
          is_public?: boolean | null
          location?: string | null
          onboarding_completed?: boolean | null
          preferred_genres?: string[] | null
          primary_creator_type?:
            | Database["public"]["Enums"]["creator_type"]
            | null
          profile_type?: Database["public"]["Enums"]["profile_type_enum"] | null
          secondary_creator_types?:
            | Database["public"]["Enums"]["artist_type"][]
            | null
          subscription_expires_at?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          user_bio?: string | null
          username?: string | null
          video_url?: string | null
        }
        Update: {
          audio_preview_url?: string | null
          avatar_url?: string | null
          banner_position?: Json | null
          banner_url?: string | null
          bio?: string | null
          compressed_url?: string | null
          created_at?: string
          darkness_factor?: number | null
          display_name?: string | null
          featured_persona_id?: string | null
          genre?: string[] | null
          id?: string
          interests?: string[] | null
          is_public?: boolean | null
          location?: string | null
          onboarding_completed?: boolean | null
          preferred_genres?: string[] | null
          primary_creator_type?:
            | Database["public"]["Enums"]["creator_type"]
            | null
          profile_type?: Database["public"]["Enums"]["profile_type_enum"] | null
          secondary_creator_types?:
            | Database["public"]["Enums"]["artist_type"][]
            | null
          subscription_expires_at?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          user_bio?: string | null
          username?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_featured_persona_id_fkey"
            columns: ["featured_persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_featured_persona_id_fkey"
            columns: ["featured_persona_id"]
            isOneToOne: false
            referencedRelation: "public_personas"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_control_metrics: {
        Row: {
          created_at: string
          creativity_score: number | null
          feedback: string | null
          id: string
          market_fit_score: number | null
          reviewer_id: string | null
          status: string | null
          technical_score: number | null
          track_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          creativity_score?: number | null
          feedback?: string | null
          id?: string
          market_fit_score?: number | null
          reviewer_id?: string | null
          status?: string | null
          technical_score?: number | null
          track_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          creativity_score?: number | null
          feedback?: string | null
          id?: string
          market_fit_score?: number | null
          reviewer_id?: string | null
          status?: string | null
          technical_score?: number | null
          track_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quality_control_metrics_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      record_labels: {
        Row: {
          created_at: string
          dataset_config: Json | null
          description: string | null
          genre_preferences: string[] | null
          id: string
          name: string
          style_signature: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dataset_config?: Json | null
          description?: string | null
          genre_preferences?: string[] | null
          id?: string
          name: string
          style_signature?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dataset_config?: Json | null
          description?: string | null
          genre_preferences?: string[] | null
          id?: string
          name?: string
          style_signature?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      release_campaigns: {
        Row: {
          budget: number | null
          campaign_type: string
          created_at: string
          end_date: string | null
          id: string
          label_id: string | null
          performance_metrics: Json | null
          start_date: string | null
          status: string | null
          target_platforms: string[] | null
          track_id: string | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          campaign_type: string
          created_at?: string
          end_date?: string | null
          id?: string
          label_id?: string | null
          performance_metrics?: Json | null
          start_date?: string | null
          status?: string | null
          target_platforms?: string[] | null
          track_id?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          campaign_type?: string
          created_at?: string
          end_date?: string | null
          id?: string
          label_id?: string | null
          performance_metrics?: Json | null
          start_date?: string | null
          status?: string | null
          target_platforms?: string[] | null
          track_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "release_campaigns_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "record_labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "release_campaigns_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      royalty_configs: {
        Row: {
          artist_share: number | null
          created_at: string
          id: string
          label_id: string | null
          label_share: number | null
          minimum_payout: number | null
          payment_frequency: string | null
          smart_contract_address: string | null
          updated_at: string
        }
        Insert: {
          artist_share?: number | null
          created_at?: string
          id?: string
          label_id?: string | null
          label_share?: number | null
          minimum_payout?: number | null
          payment_frequency?: string | null
          smart_contract_address?: string | null
          updated_at?: string
        }
        Update: {
          artist_share?: number | null
          created_at?: string
          id?: string
          label_id?: string | null
          label_share?: number | null
          minimum_payout?: number | null
          payment_frequency?: string | null
          smart_contract_address?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "royalty_configs_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "record_labels"
            referencedColumns: ["id"]
          },
        ]
      }
      scenes: {
        Row: {
          chatgpt_prompt: string | null
          color: string | null
          created_at: string
          duration: number | null
          id: string
          media_url: string | null
          order_index: number
          story_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          chatgpt_prompt?: string | null
          color?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          media_url?: string | null
          order_index: number
          story_id?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          chatgpt_prompt?: string | null
          color?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          media_url?: string | null
          order_index?: number
          story_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenes_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      shares: {
        Row: {
          created_at: string
          id: string
          persona_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          persona_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          persona_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shares_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shares_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "public_personas"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_cart_items: {
        Row: {
          created_at: string
          id: string
          track_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          track_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_cart_items_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      shots: {
        Row: {
          created_at: string
          id: string
          media_url: string | null
          name: string
          order_index: number
          prompt: string | null
          scene_id: string
          shot_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          media_url?: string | null
          name?: string
          order_index: number
          prompt?: string | null
          scene_id: string
          shot_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          media_url?: string | null
          name?: string
          order_index?: number
          prompt?: string | null
          scene_id?: string
          shot_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shots_scene_id_fkey"
            columns: ["scene_id"]
            isOneToOne: false
            referencedRelation: "scenes"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          category: string | null
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          is_ai_generated: boolean
          is_shared: boolean
          is_template: boolean
          shared_with: string[] | null
          status: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          is_ai_generated?: boolean
          is_shared?: boolean
          is_template?: boolean
          shared_with?: string[] | null
          status?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          is_ai_generated?: boolean
          is_shared?: boolean
          is_template?: boolean
          shared_with?: string[] | null
          status?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      style_transfers: {
        Row: {
          created_at: string
          id: string
          output_url: string | null
          settings: Json | null
          source_track_id: string | null
          status: string | null
          target_style: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          output_url?: string | null
          settings?: Json | null
          source_track_id?: string | null
          status?: string | null
          target_style: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          output_url?: string | null
          settings?: Json | null
          source_track_id?: string | null
          status?: string | null
          target_style?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "style_transfers_source_track_id_fkey"
            columns: ["source_track_id"]
            isOneToOne: false
            referencedRelation: "audio_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      toast_preferences: {
        Row: {
          created_at: string | null
          duration: number
          id: string
          position: string
          theme: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration?: number
          id?: string
          position?: string
          theme?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: number
          id?: string
          position?: string
          theme?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      track_feedback: {
        Row: {
          created_at: string
          feedback_data: Json | null
          feedback_type: string
          id: string
          rating: number | null
          track_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_data?: Json | null
          feedback_type: string
          id?: string
          rating?: number | null
          track_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_data?: Json | null
          feedback_type?: string
          id?: string
          rating?: number | null
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_feedback_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      track_lyrics: {
        Row: {
          content: string | null
          created_at: string
          id: string
          track_id: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          track_id: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          track_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_lyrics_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      track_ratings: {
        Row: {
          component_ratings: Json | null
          created_at: string | null
          feedback: string | null
          id: string
          rating: number | null
          track_id: string | null
          user_id: string | null
        }
        Insert: {
          component_ratings?: Json | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          rating?: number | null
          track_id?: string | null
          user_id?: string | null
        }
        Update: {
          component_ratings?: Json | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          rating?: number | null
          track_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "track_ratings_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      trackbase_banners: {
        Row: {
          created_at: string
          id: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          video_url?: string | null
        }
        Relationships: []
      }
      tracks: {
        Row: {
          album_artwork_url: string | null
          audio_url: string
          collaborators: string[] | null
          created_at: string
          duration: number | null
          id: string
          is_loop: boolean | null
          is_public: boolean | null
          mixer: string | null
          order_index: number
          persona_id: string | null
          playlist_id: string | null
          title: string
          updated_at: string
          user_id: string | null
          writers: string[] | null
        }
        Insert: {
          album_artwork_url?: string | null
          audio_url: string
          collaborators?: string[] | null
          created_at?: string
          duration?: number | null
          id?: string
          is_loop?: boolean | null
          is_public?: boolean | null
          mixer?: string | null
          order_index: number
          persona_id?: string | null
          playlist_id?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
          writers?: string[] | null
        }
        Update: {
          album_artwork_url?: string | null
          audio_url?: string
          collaborators?: string[] | null
          created_at?: string
          duration?: number | null
          id?: string
          is_loop?: boolean | null
          is_public?: boolean | null
          mixer?: string | null
          order_index?: number
          persona_id?: string | null
          playlist_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
          writers?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "tracks_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracks_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "public_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracks_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      training_datasets: {
        Row: {
          created_at: string
          dataset_type: string
          dataset_url: string | null
          file_size: number | null
          file_type: string | null
          id: string
          label_id: string | null
          metadata: Json | null
          quality_score: number | null
          status: string | null
          updated_at: string
          user_id: string | null
          votes_count: number | null
        }
        Insert: {
          created_at?: string
          dataset_type: string
          dataset_url?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          label_id?: string | null
          metadata?: Json | null
          quality_score?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
          votes_count?: number | null
        }
        Update: {
          created_at?: string
          dataset_type?: string
          dataset_url?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          label_id?: string | null
          metadata?: Json | null
          quality_score?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
          votes_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_datasets_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "record_labels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
          zoom_level: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          zoom_level?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          zoom_level?: number | null
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          achievements: Json | null
          created_at: string | null
          id: string
          level: number | null
          points: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          achievements?: Json | null
          created_at?: string | null
          id?: string
          level?: number | null
          points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievements?: Json | null
          created_at?: string | null
          id?: string
          level?: number | null
          points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          persona_id: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string | null
          video_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          persona_id?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
          video_url: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          persona_id?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "public_personas"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_analytics: {
        Row: {
          avg_conversion_time: number | null
          created_at: string
          id: string
          total_conversions: number | null
          total_duration: number | null
          updated_at: string
          user_id: string
          voice_id: string
        }
        Insert: {
          avg_conversion_time?: number | null
          created_at?: string
          id?: string
          total_conversions?: number | null
          total_duration?: number | null
          updated_at?: string
          user_id: string
          voice_id: string
        }
        Update: {
          avg_conversion_time?: number | null
          created_at?: string
          id?: string
          total_conversions?: number | null
          total_duration?: number | null
          updated_at?: string
          user_id?: string
          voice_id?: string
        }
        Relationships: []
      }
      voice_generations: {
        Row: {
          created_at: string
          duration: number | null
          id: string
          input_text: string
          output_url: string | null
          persona_id: string | null
          quality_metrics: Json | null
          settings: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          duration?: number | null
          id?: string
          input_text: string
          output_url?: string | null
          persona_id?: string | null
          quality_metrics?: Json | null
          settings?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          duration?: number | null
          id?: string
          input_text?: string
          output_url?: string | null
          persona_id?: string | null
          quality_metrics?: Json | null
          settings?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voice_generations_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voice_generations_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "public_personas"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_history: {
        Row: {
          created_at: string
          duration: number | null
          id: string
          input_audio_url: string | null
          output_audio_url: string
          project_id: string | null
          settings: Json | null
          user_id: string
          voice_id: string
        }
        Insert: {
          created_at?: string
          duration?: number | null
          id?: string
          input_audio_url?: string | null
          output_audio_url: string
          project_id?: string | null
          settings?: Json | null
          user_id: string
          voice_id: string
        }
        Update: {
          created_at?: string
          duration?: number | null
          id?: string
          input_audio_url?: string | null
          output_audio_url?: string
          project_id?: string | null
          settings?: Json | null
          user_id?: string
          voice_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "voice_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          settings: Json | null
          updated_at: string
          user_id: string
          voice_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          settings?: Json | null
          updated_at?: string
          user_id: string
          voice_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          settings?: Json | null
          updated_at?: string
          user_id?: string
          voice_id?: string
        }
        Relationships: []
      }
      voice_samples: {
        Row: {
          created_at: string
          duration: number | null
          file_url: string
          filename: string
          id: string
          persona_id: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          duration?: number | null
          file_url: string
          filename: string
          id?: string
          persona_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          duration?: number | null
          file_url?: string
          filename?: string
          id?: string
          persona_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voice_samples_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voice_samples_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "public_personas"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_training: {
        Row: {
          created_at: string
          id: string
          metrics: Json | null
          model_version: string | null
          persona_id: string | null
          progress: number | null
          status: string | null
          training_parameters: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metrics?: Json | null
          model_version?: string | null
          persona_id?: string | null
          progress?: number | null
          status?: string | null
          training_parameters?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metrics?: Json | null
          model_version?: string | null
          persona_id?: string | null
          progress?: number | null
          status?: string | null
          training_parameters?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_training_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voice_training_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "public_personas"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_training_datasets: {
        Row: {
          clean_up_vocals: boolean | null
          created_at: string
          duration: number | null
          file_name: string
          file_path: string
          file_size: number
          id: string
          persona_id: string
          remove_instrumentals: boolean | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          clean_up_vocals?: boolean | null
          created_at?: string
          duration?: number | null
          file_name: string
          file_path: string
          file_size: number
          id?: string
          persona_id: string
          remove_instrumentals?: boolean | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          clean_up_vocals?: boolean | null
          created_at?: string
          duration?: number | null
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          persona_id?: string
          remove_instrumentals?: boolean | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_training_datasets_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voice_training_datasets_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "public_personas"
            referencedColumns: ["id"]
          },
        ]
      }
      vst_plugins: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean | null
          name: string
          path: string
          settings: Json | null
          type: Database["public"]["Enums"]["vst_type"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          name: string
          path: string
          settings?: Json | null
          type: Database["public"]["Enums"]["vst_type"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          name?: string
          path?: string
          settings?: Json | null
          type?: Database["public"]["Enums"]["vst_type"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      media_file_tracking: {
        Row: {
          avatar_url: string | null
          background_music_url: string | null
          banner_url: string | null
          id: string | null
          source_table: string | null
          video_url: string | null
          voice_sample_url: string | null
        }
        Relationships: []
      }
      public_collaborations: {
        Row: {
          created_at: string | null
          id: string | null
          name: string | null
          output_settings: Json | null
          performance_metrics: Json | null
          personas: string[] | null
          status: string | null
          style_blend_settings: Json | null
          updated_at: string | null
          user_id: string | null
          version: number | null
          voice_blend_settings: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          name?: string | null
          output_settings?: Json | null
          performance_metrics?: Json | null
          personas?: string[] | null
          status?: string | null
          style_blend_settings?: Json | null
          updated_at?: string | null
          user_id?: string | null
          version?: number | null
          voice_blend_settings?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          name?: string | null
          output_settings?: Json | null
          performance_metrics?: Json | null
          personas?: string[] | null
          status?: string | null
          style_blend_settings?: Json | null
          updated_at?: string | null
          user_id?: string | null
          version?: number | null
          voice_blend_settings?: Json | null
        }
        Relationships: []
      }
      public_media_collections: {
        Row: {
          banner_position: Json | null
          banner_url: string | null
          card_image_url: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          downloads_count: number | null
          featured_order: number | null
          genre: string[] | null
          id: string | null
          is_public: boolean | null
          likes_count: number | null
          media_type: string | null
          media_types: string[] | null
          preview_url: string | null
          price: number | null
          required_tier: Database["public"]["Enums"]["subscription_tier"] | null
          style_tags: string[] | null
          tags: string[] | null
          technical_specs: Json | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          banner_position?: Json | null
          banner_url?: string | null
          card_image_url?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          downloads_count?: number | null
          featured_order?: number | null
          genre?: string[] | null
          id?: string | null
          is_public?: boolean | null
          likes_count?: number | null
          media_type?: string | null
          media_types?: string[] | null
          preview_url?: string | null
          price?: number | null
          required_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          style_tags?: string[] | null
          tags?: string[] | null
          technical_specs?: Json | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          banner_position?: Json | null
          banner_url?: string | null
          card_image_url?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          downloads_count?: number | null
          featured_order?: number | null
          genre?: string[] | null
          id?: string | null
          is_public?: boolean | null
          likes_count?: number | null
          media_type?: string | null
          media_types?: string[] | null
          preview_url?: string | null
          price?: number | null
          required_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          style_tags?: string[] | null
          tags?: string[] | null
          technical_specs?: Json | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      public_personas: {
        Row: {
          achievements: Json | null
          age: string | null
          ai_influence_metrics: Json | null
          analytics: Json | null
          artist_category: string | null
          artist_profile_id: string | null
          avatar_url: string | null
          background_music_url: string | null
          banner_darkness: number | null
          banner_position: Json | null
          banner_url: string | null
          compressed_url: string | null
          created_at: string | null
          creator_bio: string | null
          creator_name: string | null
          dataset_contributions: Json | null
          description: string | null
          featured_works: Json | null
          gender: string | null
          genre_specialties: string[] | null
          id: string | null
          instrument: Database["public"]["Enums"]["instrument_type"] | null
          is_collab: boolean | null
          is_favorite: boolean | null
          is_label_artist: boolean | null
          is_public: boolean | null
          language: string | null
          likes_count: number | null
          location: string | null
          monetization_stats: Json | null
          mood_images: string[] | null
          name: string | null
          preferred_order: number | null
          privacy_settings: Json | null
          rhyme_scheme_preferences: Json | null
          style: string | null
          tagline: string | null
          technical_level: string | null
          technical_specs: Json | null
          type: Database["public"]["Enums"]["persona_type"] | null
          updated_at: string | null
          user_count: number | null
          user_id: string | null
          video_url: string | null
          vocal_style: string | null
          voice_sample_url: string | null
          voice_type: string | null
          workflow_style: string | null
          writing_style: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "personas_artist_profile_id_fkey"
            columns: ["artist_profile_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      recent_konform_projects: {
        Row: {
          created_at: string | null
          description: string | null
          editor_state: Json | null
          id: string | null
          is_template: boolean | null
          last_opened_at: string | null
          lyrics_state: Json | null
          mixer_state: Json | null
          name: string | null
          recent_rank: number | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string | null
          user_id: string | null
          version: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_access_playlist: {
        Args: {
          playlist_row: unknown
        }
        Returns: boolean
      }
      check_track_lyrics_permission: {
        Args: {
          track_id_param: string
          operation: string
        }
        Returns: boolean
      }
      delete_video_generation: {
        Args: {
          task_id_param: string
        }
        Returns: undefined
      }
      get_user_video_generations: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string | null
          error_message: string | null
          id: string
          output_url: string | null
          persona_id: string | null
          prompt: string | null
          source: string | null
          status: string | null
          task_id: string
          updated_at: string | null
          user_id: string | null
        }[]
      }
      insert_video_generation: {
        Args: {
          user_id_param: string
          persona_id_param: string
          task_id_param: string
          prompt_param: string
          status_param: string
          source_param?: string
        }
        Returns: undefined
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      transfer_persona_ownership: {
        Args: {
          persona_id: string
          current_owner_id: string
          new_owner_id: string
        }
        Returns: boolean
      }
      update_video_generation: {
        Args: {
          task_id_param: string
          status_param: string
          output_url_param?: string
          error_message_param?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      age_group:
        | "Baby"
        | "Child"
        | "Teen"
        | "Young Adult"
        | "Adult"
        | "Middle Aged"
        | "Elderly"
      app_role: "admin" | "user"
      artist_type: "ACTOR" | "MUSICIAN" | "WRITER" | "MIXER"
      creator_type:
        | "instrumentalist"
        | "singer"
        | "actor"
        | "writer"
        | "mixer"
        | "plugin"
      device_type: "audio" | "midi"
      follow_status: "pending" | "accepted" | "rejected"
      instrument_type:
        | "Guitar"
        | "Bass"
        | "Brass"
        | "Wind"
        | "Drums"
        | "Piano"
        | "Mallet"
        | "Bell"
        | "Strings"
        | "Synth"
        | "Other"
      media_pack_type: "loop" | "midi" | "plugin" | "patch"
      persona_type:
        | "AI_CHARACTER"
        | "AI_VOCALIST"
        | "AI_INSTRUMENTALIST"
        | "AI_EFFECT"
        | "AI_SOUND"
        | "AI_MIXER"
        | "AI_WRITER"
      plugin_format: "vst" | "au"
      preset_type: "mixer" | "drumpad" | "lyric" | "effect" | "workspace"
      profile_type_enum: "writer" | "musician" | "mixer"
      project_status: "draft" | "published" | "archived"
      subscription_tier: "free" | "pro" | "label"
      track_status: "pending" | "processing" | "ready" | "error"
      vst_type: "instrument" | "effect"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
