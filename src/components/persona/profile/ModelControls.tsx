import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Persona } from '@/types/persona';
import { VoiceCloning } from './VoiceCloning';
import { piapiService } from '@/services/piapiService';
import { Upload, RefreshCw, Volume2, Mic, Play } from 'lucide-react';

interface ModelControlsProps {
  persona?: Persona;
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  speaking_rate: number;
  use_speaker_boost: boolean;
}

const defaultVoiceSettings: VoiceSettings = {
  stability: 0.75,
  similarity_boost: 0.75,
  style: 0.5,
  speaking_rate: 1,
  use_speaker_boost: true
};

export const ModelControls = ({ persona }: ModelControlsProps) => {
  const [settings, setSettings] = useState<VoiceSettings>(defaultVoiceSettings);
  const [selectedModel, setSelectedModel] = useState("eleven_multilingual_v2");
  const [voiceInput, setVoiceInput] = useState('');
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [text, setText] = useState('');
  const [voiceModel, setVoiceModel] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: secrets } = useQuery({
    queryKey: ['elevenlabs-api-key'],
    queryFn: async () => {
      const { data, error } = await supabase
        .functions.invoke('get-elevenlabs-key', {
          method: 'POST'
        });
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoadingModels(true);
        console.log("Fetching PiAPI models...");
        const models = await piapiService.getModels();
        console.log("PiAPI models received:", models);
        
        const voiceModels = models.filter(model => model.type === 'voice');
        setAvailableModels(voiceModels);
      } catch (error) {
        console.error("Error fetching PiAPI models:", error);
        toast.error("Failed to load voice models");
      } finally {
        setIsLoadingModels(false);
      }
    };

    fetchModels();
  }, []);

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    toast.success('Model updated successfully');
  };

  const handleGenerateSpeech = async () => {
    if (!voiceInput) {
      toast.error('Please enter some text to generate speech');
      return;
    }
    
    try {
      toast.loading('Generating speech...', {
        id: 'speech-generation'
      });
      
      const result = await piapiService.generateVoice({
        model: selectedModel,
        text: voiceInput,
        voice_id: persona?.id || undefined
      });

      if (result.status === 'complete' && result.url) {
        const audio = new Audio(result.url);
        audio.play();
        
        toast.success('Speech generated successfully', {
          id: 'speech-generation'
        });
      } else {
        toast.error('Failed to generate speech', {
          id: 'speech-generation'
        });
      }
    } catch (error) {
      console.error('Speech generation error:', error);
      toast.error('Failed to generate speech', {
        id: 'speech-generation'
      });
    }
  };

  const handleGenerateAudio = async () => {
    if (!text.trim()) {
      toast.error('Please enter text for the voice to say');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Get voice ID from voiceModel or use default
      const voiceId = voiceModel?.id || 'default';
      
      const result = await piapiService.generateVoice({
        text: text,
        voice_id: voiceId,
        model: "eleven_multilingual_v2"
      });
      
      if (result.status === 'complete' && result.url) {
        setAudioUrl(result.url);
        toast.success('Voice audio generated successfully');
      } else {
        toast.error('Failed to generate voice audio');
      }
    } catch (error) {
      console.error('Error generating voice:', error);
      toast.error('Error generating voice audio');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Tabs defaultValue="text-to-speech" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="text-to-speech">Text to Speech</TabsTrigger>
        <TabsTrigger value="voice-design">Voice Design</TabsTrigger>
        <TabsTrigger value="voice-library">Voice Library</TabsTrigger>
        <TabsTrigger value="collections">Collections</TabsTrigger>
      </TabsList>

      <TabsContent value="text-to-speech" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-black/20 border-0">
              <CardContent className="p-6">
                <textarea
                  className="w-full h-48 bg-black/20 text-white placeholder-gray-400 rounded-lg p-4 border-0 resize-none focus:ring-2 focus:ring-konform-neon-blue"
                  placeholder="Type something to hear your text in a lifelike voice..."
                  value={voiceInput}
                  onChange={(e) => setVoiceInput(e.target.value)}
                />

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={handleGenerateSpeech}>
                    <Play className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-black/20 border-0">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Select value={selectedModel} onValueChange={handleModelChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingModels ? "Loading models..." : "Select a model"} />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingModels ? (
                          <SelectItem value="loading" disabled>Loading models...</SelectItem>
                        ) : availableModels.length > 0 ? (
                          availableModels.map(model => (
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

                  <div className="space-y-2">
                    <Label>Stability ({Math.round(settings.stability * 100)})</Label>
                    <Slider 
                      value={[settings.stability * 100]} 
                      onValueChange={([value]) => setSettings(prev => ({ ...prev, stability: value / 100 }))}
                      max={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Clarity + Similarity ({Math.round(settings.similarity_boost * 100)})</Label>
                    <Slider 
                      value={[settings.similarity_boost * 100]} 
                      onValueChange={([value]) => setSettings(prev => ({ ...prev, similarity_boost: value / 100 }))}
                      max={100}  
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Style ({Math.round(settings.style * 100)})</Label>
                    <Slider 
                      value={[settings.style * 100]} 
                      onValueChange={([value]) => setSettings(prev => ({ ...prev, style: value / 100 }))}
                      max={100}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Speaker Boost</Label>
                    <Switch
                      checked={settings.use_speaker_boost}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, use_speaker_boost: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="voice-design" className="space-y-6">
        <VoiceCloning />
      </TabsContent>

      <TabsContent value="voice-library" className="space-y-6">
        <div className="bg-black/20 rounded-lg p-6">
          <Input 
            type="search"
            placeholder="Search voices..."
            className="max-w-md mb-6"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-black/40 border-0">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-konform-neon-blue/20" />
                    <div>
                      <h3 className="font-medium">Voice {i + 1}</h3>
                      <p className="text-sm text-gray-400">English • Narrative</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="collections" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Collections coming soon */}
        </div>
      </TabsContent>
    </Tabs>
  );
};
