
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
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error checking buckets:', error);
        return false;
      }
      
      const bucketExists = buckets.some(bucket => bucket.name === 'profile_assets');
      
      if (!bucketExists) {
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
      }
      
      return true;
    } catch (error) {
      console.error('Error in ensureBucketExists:', error);
      return false;
    }
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadType) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (!isVideo && !isImage) {
        throw new Error('Please upload a video or image file');
      }
      
      toast.info(`Starting ${uploadType} upload: ${file.name}`);
      
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      let thumbnailUrl = '';
      if (isVideo) {
        thumbnailUrl = await generateVideoThumbnail(file);
      }
      
      const bucketExists = await ensureBucketExists();
      if (!bucketExists) {
        clearInterval(progressInterval);
        throw new Error('Storage bucket does not exist and could not be created');
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('You must be logged in to upload files');
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile_assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('profile_assets')
        .getPublicUrl(filePath);
        
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success(`${uploadType === 'avatar' ? 'Avatar' : 'Banner'} uploaded successfully!`);
      
      if (onSuccess) {
        if (isVideo && thumbnailUrl) {
          const thumbnailFileName = `${crypto.randomUUID()}_thumb.jpg`;
          const thumbnailPath = `${id}/${thumbnailFileName}`;
          
          const response = await fetch(thumbnailUrl);
          const blob = await response.blob();
          
          await supabase.storage
            .from('profile_assets')
            .upload(thumbnailPath, blob, {
              contentType: 'image/jpeg',
              cacheControl: '3600',
              upsert: true
            });
            
          const { data: { publicUrl: thumbnailPublicUrl } } = supabase.storage
            .from('profile_assets')
            .getPublicUrl(thumbnailPath);
            
          onSuccess(publicUrl, uploadType, thumbnailPublicUrl);
        } else {
          onSuccess(publicUrl, uploadType);
        }
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadProgress(0);
      
      useToastNotify({
        variant: "destructive",
        description: `Failed to upload ${uploadType}: ${error.message || 'Unknown error'}`
      });
    } finally {
      setIsUploading(false);
    }
  }, [id, uploadType, onSuccess]);

  const generateVideoThumbnail = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);
      
      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          video.currentTime = 0;
          video.onseeked = () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg'));
          };
        } else {
          reject(new Error('Failed to create canvas context'));
        }
      };
      
      video.onerror = () => reject(new Error('Failed to load video'));
    });
  };

  return (
    isUploading,
    uploadType,
    setUploadType,
    handleFileUpload,
    uploadProgress
  );
};
