
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface MediaUploaderProps {
  collectionId: string;
  fileType: 'vst' | 'audio' | 'midi' | 'image' | 'prompt' | 'script';
  onUploadComplete?: () => void;
}

export const MediaUploader = ({ collectionId, fileType, onUploadComplete }: MediaUploaderProps) => {
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${collectionId}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('media_files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('media_files')
          .getPublicUrl(filePath);

        const { error: dbError } = await supabase
          .from('media_files')
          .insert([{
            collection_id: collectionId,
            file_type: fileType,
            file_url: publicUrl,
            title: file.name,
            file_size: file.size,
            metadata: {
              contentType: file.type,
              originalName: file.name
            }
          }]);

        if (dbError) throw dbError;
      }

      toast({
        title: "Success",
        description: `${acceptedFiles.length} file(s) uploaded successfully`,
      });

      onUploadComplete?.();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload file(s)",
        variant: "destructive",
      });
    }
  }, [collectionId, fileType, onUploadComplete, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive 
          ? "border-emerald-500 bg-emerald-500/10" 
          : "border-gray-600 hover:border-emerald-500/50"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <UploadCloud className="w-12 h-12 text-emerald-500" />
        <div className="text-white">
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <>
              <p className="font-medium mb-1">Drop files here or click to upload</p>
              <p className="text-sm text-gray-400">
                Upload your {fileType} files to add them to this collection
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
