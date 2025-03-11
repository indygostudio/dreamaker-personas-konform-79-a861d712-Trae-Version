import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

type StorageBucket = 'audio_files' | 'profile_assets' | 'ai_images' | 'persona_media' | 'voice_samples';

interface UploadOptions {
  /**
   * Custom file path to use instead of auto-generated one
   */
  customPath?: string;
  
  /**
   * Folder within the bucket to store the file
   */
  folder?: string;
  
  /**
   * Whether to make the file public
   */
  isPublic?: boolean;
  
  /**
   * Custom file name to use instead of auto-generated UUID
   */
  fileName?: string;
}

/**
 * Service for handling file storage operations with Supabase
 */
export const storageService = {
  /**
   * Upload a file to Supabase storage
   * @param file The file to upload
   * @param bucket The storage bucket to upload to
   * @param options Upload options
   * @returns The public URL of the uploaded file
   */
  async uploadFile(file: File, bucket: StorageBucket, options: UploadOptions = {}) {
    try {
      const fileExt = file.name.split('.').pop() || '';
      const fileName = options.fileName || uuidv4();
      const folder = options.folder ? `${options.folder}/` : '';
      const filePath = options.customPath || `${folder}${fileName}.${fileExt}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { publicUrl, filePath };
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  },

  /**
   * Upload a file with a user ID as the folder
   * @param file The file to upload
   * @param bucket The storage bucket to upload to
   * @param userId The user ID to use as the folder
   * @returns The public URL of the uploaded file
   */
  async uploadUserFile(file: File, bucket: StorageBucket, userId: string) {
    return this.uploadFile(file, bucket, { folder: userId });
  },

  /**
   * Delete a file from Supabase storage
   * @param filePath The path of the file to delete
   * @param bucket The storage bucket the file is in
   */
  async deleteFile(filePath: string, bucket: StorageBucket) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('Error deleting file:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteFile:', error);
      throw error;
    }
  },

  /**
   * Get a public URL for a file
   * @param filePath The path of the file
   * @param bucket The storage bucket the file is in
   * @returns The public URL of the file
   */
  getPublicUrl(filePath: string, bucket: StorageBucket) {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  },

  /**
   * Check if a bucket exists, create it if it doesn't
   * @param bucketName The name of the bucket to check/create
   */
  async ensureBucketExists(bucketName: StorageBucket) {
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error listing buckets:', error);
        throw error;
      }
      
      const bucketExists = buckets.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        // Call the create-storage-bucket function to create the bucket with proper policies
        const { error: createError } = await supabase.functions.invoke('create-storage-bucket', {
          body: { bucketName }
        });
        
        if (createError) {
          console.error('Error creating bucket:', createError);
          throw createError;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in ensureBucketExists:', error);
      throw error;
    }
  }
};