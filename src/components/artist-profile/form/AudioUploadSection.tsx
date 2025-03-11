import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, AudioWaveform, Volume2, Clock, Music2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WaveformPlayer } from "@/components/artist-profile/WaveformPlayer";
import { useUser } from "@/hooks/useUser";

interface AudioUploadSectionProps {
  audioUrl: string;
  profileId: string;
  userId: string;
  onSuccess: (url: string) => void;
  isDisabled?: boolean;
  buttonVariant?: string;
  buttonSize?: string;
  buttonClassName?: string;
}

interface AudioMetadata {
  duration: number;
  sampleRate?: number;
  channels?: number;
  bitRate?: number;
  format?: string;
  fileSize?: number;
  peakAmplitude?: number;
}

const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/m4a'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export function AudioUploadSection({
  audioUrl,
  profileId,
  userId,
  onSuccess,
  isDisabled,
  buttonVariant = "secondary",
  buttonSize,
  buttonClassName
}: AudioUploadSectionProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioMetadata, setAudioMetadata] = useState<AudioMetadata | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { user } = useUser();

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateAudioFile = (file: File): boolean => {
    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      toast.error("File must be an MP3, WAV, OGG, AAC, or M4A file");
      return false;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size exceeds 10MB limit (${formatFileSize(file.size)})`);
      return false;
    }
    
    return true;
  };

  const getAudioMetadata = async (file: File): Promise<AudioMetadata> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const reader = new FileReader();
        reader.onload = async (e) => {
          if (e.target?.result instanceof ArrayBuffer) {
            try {
              const audioBuffer = await audioContext.decodeAudioData(e.target.result);
              
              const channelData = audioBuffer.getChannelData(0);
              const peakAmplitude = Math.max(...Array.from(channelData).map(Math.abs));
              
              resolve({
                duration: audio.duration,
                sampleRate: audioBuffer.sampleRate,
                channels: audioBuffer.numberOfChannels,
                format: file.type.split('/')[1].toUpperCase(),
                fileSize: file.size,
                peakAmplitude,
                bitRate: Math.round((file.size * 8) / (audio.duration * 1000)) // kbps
              });
            } catch (error) {
              console.error("Error decoding audio data:", error);
              resolve({
                duration: audio.duration || 0,
                format: file.type.split('/')[1].toUpperCase(),
                fileSize: file.size
              });
            }
          }
        };
        reader.readAsArrayBuffer(file);
        URL.revokeObjectURL(url);
      });
      
      audio.addEventListener('error', () => {
        console.error("Error loading audio for metadata extraction");
        resolve({
          duration: 0,
          format: file.type.split('/')[1].toUpperCase(),
          fileSize: file.size
        });
      });
      
      audio.src = url;
    });
  };

  const checkBucketExists = async (): Promise<boolean> => {
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error("Error checking buckets:", error);
        return false;
      }
      
      return buckets.some(bucket => bucket.name === 'audio-previews');
    } catch (error) {
      console.error("Error listing buckets:", error);
      return false;
    }
  };

  const ensureBucketExists = async (): Promise<boolean> => {
    const bucketExists = await checkBucketExists();
    if (bucketExists) return true;
    
    try {
      if (!user) {
        toast.error("Authentication required to upload files");
        return false;
      }

      const { error } = await supabase.functions.invoke('create-storage-bucket', {
        body: { 
          bucketName: 'audio-previews',
          isPublic: true
        }
      });
      
      if (error) {
        console.error("Error creating bucket via function:", error);
        toast.error("Unable to configure storage. Please try again later.");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error ensuring bucket exists:", error);
      return false;
    }
  };

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (!validateAudioFile(file)) {
      return;
    }

    try {
      setUploadProgress(0);
      setIsProcessing(true);

      if (!profileId) {
        toast.error("No profile selected. Please select a profile first.");
        setIsProcessing(false);
        return;
      }
      
      if (!user) {
        toast.error("You must be logged in to upload files");
        setIsProcessing(false);
        return;
      }

      const bucketExists = await ensureBucketExists();
      if (!bucketExists) {
        setIsProcessing(false);
        return;
      }

      const metadata = await getAudioMetadata(file);
      setAudioMetadata(metadata);

      const fileExt = file.name.split('.').pop();
      const fileName = `${profileId}/${crypto.randomUUID()}.${fileExt}`;

      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        if (progress >= 95) {
          clearInterval(interval);
        }
        setUploadProgress(progress);
      }, 100);

      const { data, error: uploadError } = await supabase.storage
        .from('audio-previews')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });
      
      clearInterval(interval);
      
      if (uploadError) {
        setUploadProgress(0);
        throw new Error('Upload failed: ' + uploadError.message);
      }

      setUploadProgress(100);

      const { data: { publicUrl } } = supabase.storage
        .from('audio-previews')
        .getPublicUrl(fileName);

      onSuccess(publicUrl);
      toast.success("Audio uploaded successfully");
      
      event.target.value = '';
      
    } catch (error) {
      console.error('Error uploading audio:', error);
      toast.error("Failed to upload audio file: " + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    // Placeholder for future time update handling
  };

  const handleLoad = () => {
    // Placeholder for future load handling
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Button
          variant={buttonVariant as any}
          size={buttonSize as any}
          className={`relative overflow-hidden ${buttonClassName || ''}`}
          disabled={isDisabled || isProcessing}
        >
          <input
            type="file"
            accept={ALLOWED_AUDIO_TYPES.join(',')}
            onChange={handleAudioUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isDisabled || isProcessing}
          />
          <Upload className="w-4 h-4 mr-2" />
          {isProcessing ? "Processing..." : "Upload Audio"}
        </Button>
        <p className="text-xs text-gray-400">
          Supports MP3, WAV, OGG, AAC, M4A (max 10MB)
        </p>
      </div>

      {audioMetadata && (
        <div className="bg-black/20 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-4">
            <Music2 className="w-8 h-8 text-dreamaker-purple" />
            <div className="flex-1">
              <h4 className="text-sm font-medium">Audio Information</h4>
              <p className="text-xs text-gray-400">{audioMetadata.format} Format</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Duration</p>
                <p className="text-sm">{formatDuration(audioMetadata.duration)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <AudioWaveform className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Sample Rate</p>
                <p className="text-sm">{audioMetadata.sampleRate ? `${audioMetadata.sampleRate / 1000}kHz` : 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Channels</p>
                <p className="text-sm">{audioMetadata.channels || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Music2 className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Bit Rate</p>
                <p className="text-sm">{audioMetadata.bitRate ? `${audioMetadata.bitRate}kbps` : 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            File size: {audioMetadata.fileSize ? formatFileSize(audioMetadata.fileSize) : 'N/A'}
          </div>
        </div>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-gray-400">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {audioUrl && (
        <div className="mt-2 bg-black/20 rounded-lg p-4">
          <WaveformPlayer 
            audioUrl={audioUrl}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onTimeUpdate={handleTimeUpdate}
            onLoad={handleLoad}
          />
        </div>
      )}
    </div>
  );
}
