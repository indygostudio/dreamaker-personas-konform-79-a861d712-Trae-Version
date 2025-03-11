
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mic, Sparkles, PlayCircle, PauseCircle, Volume2 } from "lucide-react";
import { piapiService } from '@/services/piapiService';
import { Persona } from '@/types/persona';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Slider } from "@/components/ui/slider";

interface VoiceGenerationTabProps {
  persona?: Persona;
}

export function VoiceGenerationTab({ persona }: VoiceGenerationTabProps) {
  const [text, setText] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVoiceUrl, setGeneratedVoiceUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch voice models from the API
  const { data: models, isLoading: isLoadingModels } = useQuery({
    queryKey: ['voice-models'],
    queryFn: async () => {
      const allModels = await piapiService.getModels();
      return allModels.filter(model => model.type === 'voice');
    }
  });

  // Set up audio element and listeners
  useEffect(() => {
    if (generatedVoiceUrl) {
      audioRef.current = new Audio(generatedVoiceUrl);
      
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onended = () => setIsPlaying(false);
      
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setAudioProgress(progress);
        }
      };

      // Set initial volume
      if (audioRef.current) {
        audioRef.current.volume = volume / 100;
      }

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [generatedVoiceUrl]);

  // Update volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }

    if (!selectedModel) {
      toast.error('Please select a voice model');
      return;
    }

    setIsGenerating(true);
    
    try {
      const result = await piapiService.generateVoice({
        model: selectedModel,
        text,
        voice_id: selectedVoice || undefined
      });
      
      if (result.status === 'complete' && result.url) {
        setGeneratedVoiceUrl(result.url);
        setAudioProgress(0);
        toast.success('Voice generated successfully');
        
        // Create new audio element with the generated voice
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        audioRef.current = new Audio(result.url);
        audioRef.current.volume = volume / 100;
        
        audioRef.current.onplay = () => setIsPlaying(true);
        audioRef.current.onpause = () => setIsPlaying(false);
        audioRef.current.onended = () => setIsPlaying(false);
        
        audioRef.current.ontimeupdate = () => {
          if (audioRef.current) {
            const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setAudioProgress(progress);
          }
        };
      } else if (result.status === 'processing') {
        toast.info('Voice is being generated. Check history for results.');
      } else {
        toast.error('Failed to generate voice');
      }
    } catch (error) {
      console.error('Error generating voice:', error);
      toast.error('Failed to generate voice');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
        toast.error("Failed to play audio");
      });
    }
  };

  // Use persona's voice ID if available and no specific voice is selected
  useEffect(() => {
    if (persona?.id && !selectedVoice) {
      setSelectedVoice(persona.id);
    }
  }, [persona, selectedVoice]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Voice Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="bg-black/20 border-dreamaker-purple/30">
                <SelectValue placeholder="Select a voice model" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingModels ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading models...
                  </div>
                ) : models && models.length > 0 ? (
                  models.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="eleven_multilingual_v2">Eleven Multilingual v2</SelectItem>
                    <SelectItem value="eleven_turbo_v2">Eleven Turbo v2</SelectItem>
                    <SelectItem value="eleven_english_v2">Eleven English v2</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Voice</label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger className="bg-black/20 border-dreamaker-purple/30">
                <SelectValue placeholder={persona?.id ? `Using ${persona.name || 'Persona'} Voice` : "Default voice"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Default voice</SelectItem>
                {persona?.id && (
                  <SelectItem value={persona.id}>
                    {persona.name || 'Current Persona'} Voice
                  </SelectItem>
                )}
                <SelectItem value="male_1">Male Voice 1</SelectItem>
                <SelectItem value="female_1">Female Voice 1</SelectItem>
                <SelectItem value="male_2">Male Voice 2</SelectItem>
                <SelectItem value="female_2">Female Voice 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Text to Speak</label>
            <Textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="bg-black/20 border-dreamaker-purple/30 min-h-[200px]"
              placeholder="Enter the text you want to convert to speech..."
            />
          </div>

          <Button 
            className="w-full bg-dreamaker-purple hover:bg-dreamaker-purple/80" 
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim() || !selectedModel}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Voice
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {generatedVoiceUrl ? (
            <div className="bg-black/30 rounded-lg overflow-hidden border border-dreamaker-purple/20 p-8 flex flex-col items-center justify-center">
              <button 
                className="w-24 h-24 mb-6 focus:outline-none"
                onClick={handlePlayPause}
                disabled={isGenerating}
              >
                {isPlaying ? (
                  <PauseCircle className="w-24 h-24 text-dreamaker-purple" />
                ) : (
                  <PlayCircle className="w-24 h-24 text-dreamaker-purple" />
                )}
              </button>
              
              <div className="w-full max-w-md space-y-4">
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-dreamaker-purple h-2 rounded-full transition-all duration-100" 
                    style={{ width: `${audioProgress}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-5 w-5 text-gray-400" />
                  <Slider
                    value={[volume]}
                    onValueChange={(values) => setVolume(values[0])}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-400 w-8">{volume}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-black/20 rounded-lg border border-dashed border-dreamaker-purple/30 p-8">
              <Mic className="h-16 w-16 text-dreamaker-purple/40 mb-4" />
              <p className="text-gray-400 text-center">
                Generated voice will appear here
              </p>
              <p className="text-gray-500 text-sm text-center mt-2">
                Select a voice model, enter text, and click Generate
              </p>
            </div>
          )}
          
          {/* Generated Audio Details */}
          {generatedVoiceUrl && (
            <div className="bg-black/20 rounded-lg p-4 border border-dreamaker-purple/10">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Audio Details</h3>
              <div className="space-y-1 text-xs text-gray-400">
                <p>Model: {selectedModel}</p>
                <p>Voice: {selectedVoice ? selectedVoice : 'Default'}</p>
                <p>Length: {audioRef.current?.duration ? `${audioRef.current.duration.toFixed(1)}s` : 'Calculating...'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
