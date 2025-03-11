
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { VoiceUploader } from './components/VoiceUploader';
import { toast } from "sonner";
import { AudioWaveform, Loader2 } from 'lucide-react';

interface VoiceCloningProps {
  personaId: string;
}

export const VoiceCloning = ({ personaId }: VoiceCloningProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isTraining, setIsTraining] = useState(false);

  // Fetch existing voice samples
  const { data: voiceSamples, isLoading: loadingSamples } = useQuery({
    queryKey: ['voice-samples', personaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('voice_samples')
        .select('*')
        .eq('persona_id', personaId);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch training status
  const { data: trainingStatus, isLoading: loadingStatus } = useQuery({
    queryKey: ['voice-training', personaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('voice_training')
        .select('*')
        .eq('persona_id', personaId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  // Handle voice sample upload
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const uploads = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${personaId}/${crypto.randomUUID()}.${fileExt}`;
        
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
            persona_id: personaId,
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
        body: { personaId }
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

  const handleStartTraining = () => {
    if (!voiceSamples?.length) {
      toast.error('Please upload voice samples first');
      return;
    }
    trainingMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-black/40">
        <h3 className="text-xl font-semibold text-white mb-4">Voice Cloning</h3>
        
        <VoiceUploader
          files={files}
          setFiles={setFiles}
          onUpload={() => uploadMutation.mutate(files)}
          isUploading={uploadMutation.isPending}
        />

        {voiceSamples && voiceSamples.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-200 mb-2">Uploaded Samples</h4>
            <div className="space-y-2">
              {voiceSamples.map((sample) => (
                <div 
                  key={sample.id}
                  className="flex items-center justify-between bg-black/20 p-2 rounded"
                >
                  <span className="text-sm text-gray-400">{sample.filename}</span>
                  <AudioWaveform className="w-4 h-4 text-dreamaker-purple" />
                </div>
              ))}
            </div>
          </div>
        )}

        {trainingStatus && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-200">Training Progress</span>
              <span className="text-gray-400">{trainingStatus.progress}%</span>
            </div>
            <Progress value={trainingStatus.progress} className="h-2" />
            <p className="text-xs text-gray-400">
              Status: {trainingStatus.status}
            </p>
          </div>
        )}

        <Button
          className="w-full mt-6"
          onClick={handleStartTraining}
          disabled={!voiceSamples?.length || isTraining}
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
      </Card>
    </div>
  );
};
