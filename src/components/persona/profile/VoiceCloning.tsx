
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { VoiceUploader } from './voice-design/components/VoiceUploader';
import { toast } from "sonner";
import { AudioWaveform, Loader2 } from 'lucide-react';

export const VoiceCloning = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isTraining, setIsTraining] = useState(false);

  // Handle voice sample upload
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const uploads = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('voice-samples')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('voice-samples')
          .getPublicUrl(filePath);

        const { error: dbError } = await supabase
          .from('voice_samples')
          .insert({
            file_url: publicUrl,
            filename: file.name,
          });

        if (dbError) throw dbError;
      });

      await Promise.all(uploads);
    },
    onSuccess: () => {
      toast.success('Voice samples uploaded successfully');
      setFiles([]);
    },
    onError: (error) => {
      toast.error('Failed to upload voice samples');
      console.error('Upload error:', error);
    }
  });

  // Start voice training
  const trainingMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.functions.invoke('elevenlabs-voice-clone', {
        body: { files }
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Voice training started');
      setIsTraining(true);
    },
    onError: (error) => {
      toast.error('Failed to start voice training');
      console.error('Training error:', error);
    }
  });

  return (
    <div className="space-y-8">
      <div className="bg-black/40 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-6">Voice Cloning</h3>
        <VoiceUploader
          files={files}
          setFiles={setFiles}
          onUpload={() => uploadMutation.mutate(files)}
          isUploading={uploadMutation.isPending}
        />
      </div>

      <Button
        className="w-full"
        onClick={() => trainingMutation.mutate()}
        disabled={files.length === 0 || isTraining || uploadMutation.isPending}
      >
        {isTraining ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Training in Progress...
          </>
        ) : (
          'Start Voice Training'
        )}
      </Button>
    </div>
  );
};
