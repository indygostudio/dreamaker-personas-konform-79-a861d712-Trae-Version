import { useState, useRef } from 'react';
import { Upload, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VideoUploadProps {
  personaId: string;
  onUploadComplete: () => void;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({ personaId, onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }

    // Check file size (limit to 100MB)
    const maxSize = 104857600; // 100MB in bytes
    if (file.size > maxSize) {
      toast.error('Video file is too large. Maximum size is 100MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', file); // The function uses 'image' key despite handling both images and videos
      formData.append('bucket', 'profile_assets');
      formData.append('personaId', personaId);
      formData.append('title', file.name);
      
      // Get SUPABASE_URL from client to use in fetch
      const { data: { publicUrl } } = supabase.storage.from('').getPublicUrl('');
      const supabaseUrl = publicUrl.split('/storage/')[0];
      
      // Upload via edge function
      const response = await fetch(`${supabaseUrl}/functions/v1/upload-image`, {
        method: 'POST',
        body: formData,
        headers: {
          // No need for Content-Type, it's set automatically with FormData
        },
        signal: AbortSignal.timeout(60000), // 60 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload video');
      }

      const result = await response.json();
      
      // Save video metadata to the videos table
      const { error } = await supabase
        .from('videos')
        .insert({
          persona_id: personaId,
          title: file.name,
          video_url: result.image.url,
          thumbnail_url: result.image.thumbnail || '',
          metadata: { 
            type: file.type, 
            size: file.size 
          }
        });

      if (error) throw error;
      
      toast.success('Video uploaded successfully');
      onUploadComplete();
      
    } catch (error: any) {
      console.error('Error uploading video:', error);
      toast.error(error.message || 'Failed to upload video');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset the input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        disabled={isUploading}
        className="w-full flex items-center justify-center gap-2 border-dashed border-gray-400 py-6"
        onClick={triggerFileInput}
        type="button"
      >
        {isUploading ? (
          <>
            <span>Uploading... {uploadProgress}%</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            <FileVideo className="w-4 h-4" />
            <span>Upload Video</span>
          </>
        )}
      </Button>
      
      {/* Hidden file input */}
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleUpload}
        disabled={isUploading}
      />
      
      {isUploading && (
        <div className="mt-2">
          <div className="h-2 bg-gray-800 rounded-full">
            <div
              className="h-full bg-dreamaker-purple rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
