import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VoiceList } from './components/VoiceList';
import { TextToSpeech } from './components/TextToSpeech';
import { SpeechToSpeech } from './SpeechToSpeech';
import { VoiceHistory } from './VoiceHistory';
import { AudioEnhancements } from './AudioEnhancements';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, Loader2 } from 'lucide-react';

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  speaking_rate: number;
}

interface Voice {
  voice_id: string;
  name: string;
  description?: string;
  preview_url?: string;
  settings?: VoiceSettings;
  labels?: Record<string, string>;
}

interface ProfessionalVoice extends Voice {
  category: string;
  settings: VoiceSettings;
}

export const VoiceDesigner = () => {
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [previewText, setPreviewText] = useState("Hello, this is a voice preview.");
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedModel, setSelectedModel] = useState("eleven_multilingual_v2");
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isDeletingVoice, setIsDeletingVoice] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    stability: 75,
    similarity_boost: 85,
    style: 0,
    speaking_rate: 1,
  });

  const { data: models } = useQuery({
    queryKey: ['elevenlabs-models'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('elevenlabs-api', {
        body: { action: 'getModels' }
      });
      
      if (error) throw error;
      return data.models;
    }
  });

  const { data: professionalVoices, isLoading, refetch: refetchVoices } = useQuery({
    queryKey: ['professional-voices'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('elevenlabs-api', {
        body: { action: 'getProfessionalVoices' }
      });
      
      if (error) throw error;
      return data.voices as ProfessionalVoice[];
    }
  });

  const handlePreviewPlay = async () => {
    if (!selectedVoice) {
      toast.error('Please select a voice first');
      return;
    }

    setIsPlaying(true);
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-api', {
        body: {
          action: 'generatePreview',
          data: {
            text: previewText,
            voice_id: selectedVoice.voice_id,
            settings: voiceSettings,
            model_id: selectedModel
          }
        }
      });

      if (error) throw error;

      const audio = new Audio(data.audio_url);
      audio.play();
      audio.onended = () => setIsPlaying(false);
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Failed to generate preview');
      setIsPlaying(false);
    }
  };

  const handleVoiceEdit = async () => {
    if (!selectedVoice) return;

    try {
      const { error } = await supabase.functions.invoke('elevenlabs-api', {
        body: {
          action: 'editVoice',
          data: {
            voice_id: selectedVoice.voice_id,
            name: editedName || selectedVoice.name,
            description: editedDescription || selectedVoice.description,
            labels: selectedVoice.labels
          }
        }
      });

      if (error) throw error;

      toast.success('Voice updated successfully');
      setIsEditing(false);
      refetchVoices();
    } catch (error) {
      console.error('Error updating voice:', error);
      toast.error('Failed to update voice');
    }
  };

  const handleVoiceDelete = async (voiceId: string) => {
    setIsDeletingVoice(true);
    try {
      const { error } = await supabase.functions.invoke('elevenlabs-api', {
        body: {
          action: 'deleteVoice',
          data: { voice_id: voiceId }
        }
      });

      if (error) throw error;

      toast.success('Voice deleted successfully');
      if (selectedVoice?.voice_id === voiceId) {
        setSelectedVoice(null);
      }
      refetchVoices();
    } catch (error) {
      console.error('Error deleting voice:', error);
      toast.error('Failed to delete voice');
    } finally {
      setIsDeletingVoice(false);
    }
  };

  const handleVoiceSelect = (voice: ProfessionalVoice) => {
    setSelectedVoice(voice);
    setEditedName(voice.name);
    setEditedDescription(voice.description || '');
    setVoiceSettings(voice.settings);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse Voices</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="samples">Voice Samples</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <Accordion type="single" defaultValue="voice-conversion" className="w-full">
            <AccordionItem value="model-selection">
              <AccordionTrigger className="text-lg font-semibold">
                Model Selection
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models?.map((model: any) => (
                        <SelectItem key={model.model_id} value={model.model_id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-400">
                    Choose a model that best fits your needs. Different models offer varying levels of quality and capabilities.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="available-voices">
              <AccordionTrigger className="text-lg font-semibold">
                Available Voices
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <VoiceList
                    voices={professionalVoices || []}
                    isLoading={isLoading}
                    selectedVoiceId={selectedVoice?.voice_id}
                    onVoiceSelect={handleVoiceSelect}
                    onVoiceDelete={handleVoiceDelete}
                    isDeletingVoice={isDeletingVoice}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {selectedVoice && (
              <>
                <AccordionItem value="voice-editor">
                  <AccordionTrigger className="text-lg font-semibold">
                    Voice Editor
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Voice Settings</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (isEditing) {
                              handleVoiceEdit();
                            } else {
                              setIsEditing(true);
                            }
                          }}
                        >
                          {isEditing ? (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </>
                          ) : (
                            <>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </>
                          )}
                        </Button>
                      </div>

                      {isEditing ? (
                        <div className="space-y-4">
                          <Input
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            placeholder="Voice name"
                          />
                          <Textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            placeholder="Voice description"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-400">Name: {selectedVoice.name}</p>
                          <p className="text-sm text-gray-400">Description: {selectedVoice.description}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="voice-preview">
                  <AccordionTrigger className="text-lg font-semibold">
                    Voice Preview
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-4">
                      <TextToSpeech
                        text={previewText}
                        onTextChange={setPreviewText}
                        onGenerate={handlePreviewPlay}
                        isGenerating={false}
                        isPlaying={isPlaying}
                        isDisabled={!selectedVoice}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </>
            )}

            <AccordionItem value="voice-conversion">
              <AccordionTrigger className="text-lg font-semibold">
                Voice Conversion
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <AccordionItem value="audio-enhancements">
                    <AccordionTrigger className="text-lg font-semibold">
                      Audio Enhancement Settings
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-4">
                        <AudioEnhancements 
                          settings={voiceSettings}
                          onSettingsChange={setVoiceSettings}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="speech-conversion">
                    <AccordionTrigger className="text-lg font-semibold">
                      Speech to Speech Conversion
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-4">
                        <SpeechToSpeech selectedVoiceId={selectedVoice?.voice_id} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4">
          {/* Professional content here */}
        </TabsContent>

        <TabsContent value="samples" className="space-y-4">
          {/* Samples content here */}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <VoiceHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};
