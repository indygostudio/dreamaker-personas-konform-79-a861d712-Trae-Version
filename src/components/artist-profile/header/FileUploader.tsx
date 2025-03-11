
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { BannerPositionJson } from '@/types/types';
import { toast } from 'sonner';

interface FileUploaderProps {
  onSuccess: (imageUrl: string, uploadType: 'avatar' | 'banner') => void;
  id: string;
  bannerPosition?: { x: number; y: number };
}

export const FileUploader = ({ onSuccess, id, bannerPosition = { x: 50, y: 50 } }: FileUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'avatar' | 'banner' | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast: useToastNotify } = useToast();

  const ensureBucketExists = async () => {
    try {
      // Check if the bucket exists
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error checking buckets:', error);
        return false;
      }
      
      const bucketExists = buckets.some(bucket => bucket.name === 'profile_assets');
      
      if (!bucketExists) {
        // Try to create the bucket through edge function
        try {
          const { data: authData } = await supabase.auth.getSession();
          
          if (!authData.session) {
            throw new Error('Not authenticated');
          }
          
          const { error: functionError } = await supabase.functions.invoke('create-storage-bucket', {
            body: { 
              bucketName: 'profile_assets',
              isPublic: true,
              fileSizeLimit: 104857600 // 100MB to allow videos
            }
          });
          
          if (functionError) {
            console.error('Error creating bucket:', functionError);
            return false;
          }
          
          return true;
        } catch (err) {
          console.error('Error creating bucket:', err);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in ensureBucketExists:', error);
      return false;
    }
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      console.log(`Uploading ${uploadType}: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
      
      // Display a toast for upload start
      toast.info(`Starting ${uploadType} upload: ${file.name}`);
      
      // Simple progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress; // Cap at 90% until actual completion
        });
      }, 500);
      
      // Ensure the bucket exists before uploading
      const bucketExists = await ensureBucketExists();
      
      if (!bucketExists) {
        clearInterval(progressInterval);
        throw new Error('profile_assets bucket does not exist and could not be created');
      }
      
      // Try using the upload-image edge function first, which can create buckets if needed
      const formData = new FormData();
      formData.append('image', file);
      formData.append('bucket', 'profile_assets');
      formData.append('title', uploadType === 'avatar' ? 'Avatar Image' : 'Banner Image');
      
      // Get auth token for the request
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('You must be logged in to upload files');
      }
      
      console.log('Attempting upload with edge function...');
      
      // Get the Supabase URL from environment or fallback to hardcoded URL
      const supabaseUrl = 'https://eybrmzbvvckdlvlckfms.supabase.co';
      
      const response = await fetch(`${supabaseUrl}/functions/v1/upload-image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Edge function upload error:', errorData);
        
        // Fall back to direct storage upload
        console.log('Falling back to direct storage upload...');
        
        // Check if bucket exists before uploading
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
          console.error('Error listing buckets:', bucketsError);
          throw new Error(`Failed to list buckets: ${bucketsError.message}`);
        }
        
        const bucketExists = buckets.some(bucket => bucket.name === 'profile_assets');
        console.log('Available buckets:', buckets.map(b => b.name));
        console.log('profile_assets bucket exists:', bucketExists);
        
        if (!bucketExists) {
          throw new Error('profile_assets bucket does not exist. Please ensure it\'s created in Supabase.');
        }
        
        // Upload to Supabase storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${id}/${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('profile_assets')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (error) {
          console.error('Storage upload error:', error);
          throw error;
        }
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profile_assets')
          .getPublicUrl(filePath);
          
        // Update profile with the direct storage URL
        let updateData: any = {};
        if (uploadType === 'avatar') {
          updateData = {
            avatar_url: publicUrl
          };
        } else {
          updateData = {
            banner_url: publicUrl,
            banner_position: {
              x: bannerPosition.x,
              y: bannerPosition.y
            } as BannerPositionJson
          };
        }
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', id);
          
        if (updateError) {
          console.error('Profile update error:', updateError);
          throw updateError;
        }
        
        useToastNotify({
          description: `${uploadType === 'avatar' ? 'Avatar' : 'Banner'} updated successfully`
        });
        
        toast.success(`${uploadType === 'avatar' ? 'Avatar' : 'Banner'} updated successfully!`);
        
        if (onSuccess && uploadType) {
          onSuccess(publicUrl, uploadType);
        }
        
        return;
      }
      
      // Edge function successful
      const result = await response.json();
      console.log('Upload successful with edge function:', result);
      setUploadProgress(100);
      
      const publicUrl = result.image.url;
      
      // Update the profile with the new URL
      let updateData: any = {};
      if (uploadType === 'avatar') {
        updateData = {
          avatar_url: publicUrl
        };
      } else {
        updateData = {
          banner_url: publicUrl,
          banner_position: {
            x: bannerPosition.x,
            y: bannerPosition.y
          } as BannerPositionJson
        };
      }
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', id);
        
      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }
      
      useToastNotify({
        description: `${uploadType === 'avatar' ? 'Avatar' : 'Banner'} updated successfully`
      });

      toast.success(`${uploadType === 'avatar' ? 'Avatar' : 'Banner'} updated successfully!`);

      if (onSuccess && uploadType) {
        onSuccess(publicUrl, uploadType);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadProgress(0);
      
      useToastNotify({
        variant: "destructive",
        description: `Failed to upload ${uploadType}: ${error.message || 'Unknown error'}`
      });
      
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setUploadType(null);
      setUploadProgress(0);
    }
  }, [uploadType, bannerPosition, id, onSuccess, useToastNotify]);

  return {
    isUploading,
    uploadType,
    setUploadType,
    handleFileUpload,
    uploadProgress
  };
};
