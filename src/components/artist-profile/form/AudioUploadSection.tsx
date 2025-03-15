import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, AudioWaveform, Volume2, Clock, Music2, Scissors, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WaveformPlayer } from "@/components/artist-profile/WaveformPlayer";
import { useUser } from "@/hooks/useUser";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface AudioUploadSectionProps {
  audioUrl: string;
  profileId: string;
  userId: string;
  onSuccess: (url: string, trimData?: { start: number; end: number }) => void;
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

interface TrimPoints {
  start: number;
  end: number;
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
  const [isTrimming, setIsTrimming] = useState(false);
  const [trimPoints, setTrimPoints] = useState<TrimPoints>({ start: 0, end: 100 });
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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

  // Initialize audio element for getting duration
  useEffect(() => {
    if (audioUrl && !audioRef.current) {
      const audio = new Audio(audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        setAudioDuration(audio.duration);
        // Set default end point to full duration
        setTrimPoints(prev => ({ ...prev, end: 100 }));
      });
      audioRef.current = audio;
    }
  }, [audioUrl]);

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
      
      // Create a new audio element to get duration
      const audio = new Audio(publicUrl);
      audio.addEventListener('loadedmetadata', () => {
        setAudioDuration(audio.duration);
        // Set default end point to full duration
        setTrimPoints({ start: 0, end: 100 });
      });
      audioRef.current = audio;
      
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
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };
  
  const handleTrimToggle = () => {
    setIsTrimming(!isTrimming);
  };
  
  const handleTrimChange = (values: number[]) => {
    setTrimPoints({
      start: values[0],
      end: values[1]
    });
  };
  
  // Calculate the current trim positions in seconds for the waveform markers
  const calculateTrimPositionsInSeconds = () => {
    if (!audioDuration) return { startSec: 0, endSec: 0 };
    const startSec = (trimPoints.start / 100) * audioDuration;
    const endSec = (trimPoints.end / 100) * audioDuration;
    return { startSec, endSec };
  };
  
  const handleSaveTrim = () => {
    if (audioUrl && (trimPoints.start !== 0 || trimPoints.end !== 100)) {
      // Convert percentage to seconds
      const startTime = (trimPoints.start / 100) * audioDuration;
      const endTime = (trimPoints.end / 100) * audioDuration;
      
      // Pass the trim data to parent component
      onSuccess(audioUrl, {
        start: startTime,
        end: endTime
      });
      
      // Calculate duration of trimmed section
      const trimmedDuration = endTime - startTime;
      const formattedDuration = formatDuration(trimmedDuration);
      
      toast.success(`Preview set to ${formattedDuration} section`);
      setIsTrimming(false);
    }
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
        <div className="mt-2 bg-black/20 rounded-lg p-4 space-y-4">
          {isTrimming ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Trim Audio Preview</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleTrimToggle}
                    className="border-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleSaveTrim}
                    className="bg-dreamaker-purple hover:bg-dreamaker-purple/80"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Trim
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs text-gray-400">Select start and end points</Label>
                <div className="relative mt-8 mb-6">
                  <WaveformPlayer 
                    audioUrl={audioUrl}
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                    onTimeUpdate={handleTimeUpdate}
                    onLoad={handleLoad}
                    enableRegionSelection={true}
                    trimStartPercentage={trimPoints.start}
                    trimEndPercentage={trimPoints.end}
                    onRegionUpdate={(region) => {
                      // Convert seconds to percentages
                      if (audioDuration > 0) {
                        const startPercent = (region.start / audioDuration) * 100;
                        const endPercent = (region.end / audioDuration) * 100;
                        handleTrimChange([startPercent, endPercent]);
                      }
                    }}
                  />
                  
                  {/* Trim markers overlay */}
                  <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
                    <div 
                      className="absolute top-0 bottom-0 bg-black/30"
                      style={{
                        left: 0,
                        width: `${trimPoints.start}%`,
                      }}
                    />
                    <div 
                      className="absolute top-0 bottom-0 bg-black/30"
                      style={{
                        right: 0,
                        width: `${100 - trimPoints.end}%`,
                      }}
                    />
                    <div 
                      className="absolute top-0 bottom-0 border-l-2 border-dreamaker-purple"
                      style={{ left: `${trimPoints.start}%` }}
                    />
                    <div 
                      className="absolute top-0 bottom-0 border-r-2 border-dreamaker-purple"
                      style={{ left: `${trimPoints.end}%` }}
                    />
                  </div>
                </div>
                
                <Slider
                  defaultValue={[trimPoints.start, trimPoints.end]}
                  value={[trimPoints.start, trimPoints.end]}
                  onValueChange={handleTrimChange}
                  max={100}
                  step={0.1}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{formatDuration((trimPoints.start / 100) * audioDuration)}</span>
                  <span>{formatDuration((trimPoints.end / 100) * audioDuration)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Audio Preview</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleTrimToggle}
                  className="border-dreamaker-purple/30 text-dreamaker-purple"
                >
                  <Scissors className="w-4 h-4 mr-2" />
                  Trim Audio
                </Button>
              </div>
              <div className="relative">
                <WaveformPlayer 
                  audioUrl={audioUrl}
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                  onTimeUpdate={handleTimeUpdate}
                  onLoad={handleLoad}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
