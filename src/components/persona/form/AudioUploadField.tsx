
import { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UploadCloud, Volume2 } from "lucide-react";
import { WaveformPlayer } from "@/components/artist-profile/WaveformPlayer";

interface AudioUploadFieldProps {
  form: UseFormReturn<any>;
  userId: string;
  personaId?: string;
}

export const AudioUploadField = ({ form, userId, personaId }: AudioUploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioPreviewUrl = form.watch("audio_preview_url");
  
  const ensureAudioBucketExists = async (): Promise<boolean> => {
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error("Error checking buckets:", error);
        return false;
      }
      
      const bucketExists = buckets.some(bucket => bucket.name === 'audio-previews');
      
      if (!bucketExists) {
        // Try to create the bucket
        try {
          const { error: createError } = await supabase.functions.invoke('create-storage-bucket', {
            body: { 
              bucketName: 'audio-previews',
              isPublic: true
            }
          });
          
          if (createError) {
            console.error("Error creating bucket:", createError);
            toast.error("Unable to create storage bucket. Please try again later.");
            return false;
          }
          
          console.log("Successfully created audio-previews bucket");
          return true;
        } catch (err) {
          console.error("Error ensuring bucket exists:", err);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error in ensureAudioBucketExists:", error);
      return false;
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Ensure the bucket exists
      const bucketExists = await ensureAudioBucketExists();
      if (!bucketExists) {
        toast.error("Storage bucket is not available");
        setIsUploading(false);
        return;
      }
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${personaId || userId}/${crypto.randomUUID()}.${fileExt}`;
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from('audio-previews')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      clearInterval(interval);
      
      if (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload audio file");
        setUploadProgress(0);
        setIsUploading(false);
        return;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-previews')
        .getPublicUrl(fileName);
      
      // Update the form
      form.setValue("audio_preview_url", publicUrl);
      
      setUploadProgress(100);
      toast.success("Audio preview uploaded successfully");
      
      // Reset progress after 2 seconds
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
      
    } catch (error) {
      console.error("Error uploading audio:", error);
      toast.error("Failed to upload audio");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <FormField
      control={form.control}
      name="audio_preview_url"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>Audio Preview</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <div className="flex gap-2 items-center">
                <Input
                  type="file"
                  accept="audio/mp3,audio/wav,audio/m4a,audio/ogg"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await handleUpload(file);
                    }
                  }}
                  disabled={isUploading}
                  className="flex-1"
                />
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  disabled={!audioPreviewUrl}
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Volume2 /> : <UploadCloud />}
                </Button>
              </div>
              
              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-gray-400">
                    {uploadProgress === 100 ? 'Upload complete!' : `Uploading... ${uploadProgress}%`}
                  </p>
                </div>
              )}
              
              {audioPreviewUrl && (
                <div className="bg-black/20 rounded-lg p-3">
                  <WaveformPlayer
                    audioUrl={audioPreviewUrl}
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                  />
                </div>
              )}
              
              <Input
                {...field}
                type="url"
                placeholder="Audio preview URL"
                className="hidden"
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
