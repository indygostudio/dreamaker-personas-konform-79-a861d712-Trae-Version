import React, { ReactNode, useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { useAdminMode } from '@/contexts/AdminModeContext';
import { Edit, Upload, Pencil, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminContextMenuProps {
  children: ReactNode;
  // Content type determines what kind of editing options are available
  contentType: 'image' | 'video' | 'text' | 'banner';
  // Current content data
  contentData: {
    id?: string;
    url?: string;
    text?: string;
    tableName?: string;
    columnName?: string;
    storageBucket?: string;
  };
  // Optional callback when content is updated
  onContentUpdate?: (newData: any) => void;
}

export const AdminContextMenu: React.FC<AdminContextMenuProps> = ({
  children,
  contentType,
  contentData,
  onContentUpdate,
}) => {
  const { isAdminMode } = useAdminMode();
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(contentData.text || '');

  // If not in admin mode, just render children without context menu
  if (!isAdminMode) {
    return <>{children}</>;
  }

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!contentData.id || !contentData.tableName || !contentData.columnName) {
      toast.error("Missing required data for upload");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      toast.info(`Uploading ${contentType}...`);
      
      // Determine storage bucket based on content type
      const storageBucket = contentData.storageBucket || 
        (contentType === 'video' ? 'persona_videos' : 
         contentType === 'banner' ? 'profile_assets' : 'persona_avatars');
      
      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${contentData.id}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from(storageBucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(storageBucket)
        .getPublicUrl(filePath);
      
      // Update database record
      const { error: updateError } = await supabase
        .from(contentData.tableName)
        .update({
          [contentData.columnName]: publicUrl
        })
        .eq("id", contentData.id);
      
      if (updateError) throw updateError;
      
      // Call the onContentUpdate callback
      if (onContentUpdate) {
        onContentUpdate({ url: publicUrl });
      }
      
      toast.success(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} updated successfully!`);
    } catch (error: any) {
      console.error(`Error updating ${contentType}:`, error);
      toast.error(`Failed to update ${contentType}: ${error.message || "Unknown error"}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextSave = async () => {
    if (!contentData.id || !contentData.tableName || !contentData.columnName) {
      toast.error("Missing required data for text update");
      return;
    }

    try {
      // Update database record
      const { error: updateError } = await supabase
        .from(contentData.tableName)
        .update({
          [contentData.columnName]: editText
        })
        .eq("id", contentData.id);
      
      if (updateError) throw updateError;
      
      // Call the onContentUpdate callback
      if (onContentUpdate) {
        onContentUpdate({ text: editText });
      }
      
      setIsEditing(false);
      toast.success("Text updated successfully!");
    } catch (error: any) {
      console.error("Error updating text:", error);
      toast.error(`Failed to update text: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger disabled={isUploading} className="w-full h-full">
        {isEditing && contentType === 'text' ? (
          <div className="relative p-2 border border-dreamaker-purple rounded">
            <textarea 
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full min-h-[100px] bg-black/50 text-white p-2 rounded"
            />
            <button 
              onClick={handleTextSave}
              className="absolute bottom-4 right-4 bg-dreamaker-purple text-white p-2 rounded-full"
            >
              <Save className="h-4 w-4" />
            </button>
          </div>
        ) : (
          children
        )}
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-[#1A1F2C] border-dreamaker-purple/30">
        <div className="px-2 py-1 text-xs text-dreamaker-purple font-semibold">
          Admin Mode
        </div>
        <ContextMenuSeparator />
        
        {(contentType === 'image' || contentType === 'video' || contentType === 'banner') && (
          <ContextMenuItem className="relative">
            <input
              type="file"
              accept={contentType === 'image' ? "image/*" : contentType === 'video' ? "video/*" : "image/*,video/*"}
              onChange={handleMediaUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <Upload className="mr-2 h-4 w-4" />
            Upload {contentType === 'banner' ? 'Banner' : contentType === 'image' ? 'Image' : 'Video'}
          </ContextMenuItem>
        )}
        
        {contentType === 'text' && (
          <ContextMenuItem onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Text
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};