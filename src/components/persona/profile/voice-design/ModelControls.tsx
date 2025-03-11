
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Persona } from '@/types/persona';
import { VoiceCloning } from './VoiceCloning';
import { VoiceDesigner } from './VoiceDesigner';
import { VoiceAnalytics } from './VoiceAnalytics';

interface ModelControlsProps {
  persona?: Persona;
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

const defaultVoiceSettings: VoiceSettings = {
  stability: 0.75,
  similarity_boost: 0.75,
  style: 0.5,
  use_speaker_boost: true
};

export const ModelControls = ({ persona }: ModelControlsProps) => {
  const [settings, setSettings] = useState<VoiceSettings>(defaultVoiceSettings);
  const [selectedModel, setSelectedModel] = useState("eleven_multilingual_v2");

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

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    toast.success(`Model changed to ${value}`);
  };

  return (
    <Tabs defaultValue="voice-control" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="voice-control">Voice Control</TabsTrigger>
        <TabsTrigger value="voice-creation">Voice Creation</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="voice-control" className="space-y-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="model-selection">
            <AccordionTrigger className="text-lg font-semibold">
              Model Selection
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 bg-black/40 rounded-lg">
                <Select value={selectedModel} onValueChange={handleModelChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eleven_multilingual_v2">Eleven Multilingual v2</SelectItem>
                    <SelectItem value="eleven_turbo_v2">Eleven Turbo v2</SelectItem>
                    <SelectItem value="eleven_english_v2">Eleven English v2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="voice-designer">
            <AccordionTrigger className="text-lg font-semibold">
              Voice Designer
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <VoiceDesigner />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="api-status">
            <AccordionTrigger className="text-lg font-semibold">
              API Status
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 bg-black/40 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${secrets ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-gray-400">
                    {secrets ? 'API Connected' : 'API Key Required'}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>

      <TabsContent value="voice-creation" className="space-y-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="voice-cloning">
            <AccordionTrigger className="text-lg font-semibold">
              Voice Cloning
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <VoiceCloning personaId={persona?.id} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <div className="bg-black/40 rounded-lg p-6">
          <VoiceAnalytics />
        </div>
      </TabsContent>
    </Tabs>
  );
};
