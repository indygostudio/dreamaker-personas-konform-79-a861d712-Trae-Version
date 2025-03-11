
export interface GeneratedLyrics {
  id: string; // Changed from optional to required
  content: string;
  created_at?: string;
  title?: string;
  prompt?: string;
  text?: string;
  createdAt?: Date;
}

export type ClaudeModel = 
  | "claude-3-opus-20240229" 
  | "claude-3-sonnet-20240229" 
  | "claude-3-haiku-20240307" 
  | "claude-2.1" 
  | "claude-2.0"
  | "music-s"
  | "music-u"
  | "gpt4-lyricist";
