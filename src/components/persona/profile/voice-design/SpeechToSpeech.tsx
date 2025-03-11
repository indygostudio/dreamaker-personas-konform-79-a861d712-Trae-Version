
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Mic, Upload, Volume2, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceConversionProps {
  selectedVoiceId?: string;
}

export const SpeechToSpeech = ({ selectedVoiceId }: VoiceConversionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast.error('Failed to start recording');
      console.error(error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioBlob(file);
    }
  };

  const convertAudio = async () => {
    if (!audioBlob || !selectedVoiceId) {
      toast.error('Please select a voice and provide audio');
      return;
    }

    setIsConverting(true);
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        if (!base64Audio) {
          throw new Error('Failed to convert audio to base64');
        }

        const { data, error } = await supabase.functions.invoke('elevenlabs-api', {
          body: {
            action: 'convertAudioToVoice',
            data: {
              audioData: base64Audio,
              targetVoiceId: selectedVoiceId
            }
          }
        });

        if (error) throw error;

        // Play converted audio
        const audio = new Audio(data.audio_url);
        audio.play();
      };
    } catch (error) {
      toast.error('Failed to convert audio');
      console.error(error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/20 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-6">Speech to Speech Conversion</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
            >
              {isRecording ? (
                <>
                  <StopCircle className="w-4 h-4 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>

            <div className="relative">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('audio-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Audio
              </Button>
            </div>
          </div>

          {audioBlob && (
            <div className="flex items-center gap-4">
              <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
              <Button
                onClick={convertAudio}
                disabled={isConverting || !selectedVoiceId}
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Convert
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
