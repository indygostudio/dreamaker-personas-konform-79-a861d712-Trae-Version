
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { AudioWaveform, Clock } from 'lucide-react';
import type { VoiceHistory as VoiceHistoryType } from '@/types/voice';

export const VoiceHistory = () => {
  const { data: history, isLoading } = useQuery<VoiceHistoryType[]>({
    queryKey: ['voice-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('voice_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="text-center text-gray-400">Loading history...</div>;
  }

  return (
    <div className="space-y-4">
      {history?.map((item) => (
        <Card key={item.id} className="p-4 bg-black/20">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AudioWaveform className="w-4 h-4 text-dreamaker-purple" />
                <h4 className="font-medium text-white">Voice Generation {item.voice_id}</h4>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{new Date(item.created_at).toLocaleString()}</span>
              </div>
              {item.duration && (
                <div className="text-sm text-gray-400">
                  Duration: {Math.round(item.duration / 1000)}s
                </div>
              )}
            </div>
            {item.output_audio_url && (
              <audio
                src={item.output_audio_url}
                controls
                className="h-8 w-48"
              />
            )}
          </div>
        </Card>
      ))}

      {history?.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No voice generation history yet
        </div>
      )}
    </div>
  );
};
