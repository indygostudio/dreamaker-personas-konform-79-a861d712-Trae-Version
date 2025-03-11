import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, Film, Sparkles } from "lucide-react";
import { piapiService } from '@/services/piapiService';
import { Persona } from '@/types/persona';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface VideoGenerationTabProps {
  persona?: Persona;
}

export function VideoGenerationTab({ persona }: VideoGenerationTabProps) {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [duration, setDuration] = useState(3);
  const [selectedModel, setSelectedModel] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState('');

  const { data: models, isLoading: isLoadingModels } = useQuery({
    queryKey: ['video-models'],
    queryFn: async () => {
      const allModels = await piapiService.getModels();
      return allModels.filter(model => model.type === 'video');
    }
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (!selectedModel) {
      toast.error('Please select a model');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await piapiService.generateVideo({
        model: selectedModel,
        prompt,
        negative_prompt: negativePrompt || undefined,
        width,
        height,
        duration
      });
      
      if (result.status === 'complete' && result.url) {
        setGeneratedVideoUrl(result.url);
        toast.success('Video generated successfully');
      } else if (result.status === 'processing') {
        toast.info('Video is being generated. Check history for results.');
      } else {
        toast.error('Failed to generate video');
      }
    } catch (error) {
      console.error('Error generating video:', error);
      toast.error('Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="bg-black/20 border-dreamaker-purple/30">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingModels ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading models...
                  </div>
                ) : models?.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Prompt</label>
            <Textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-black/20 border-dreamaker-purple/30 min-h-[120px]"
              placeholder="Describe the video you want to generate..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Negative Prompt (Optional)</label>
            <Textarea 
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="bg-black/20 border-dreamaker-purple/30"
              placeholder="Elements you don't want in the video..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Width: {width}px</label>
              <Slider 
                value={[width]} 
                onValueChange={(values) => setWidth(values[0])}
                min={256}
                max={1024}
                step={64}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Height: {height}px</label>
              <Slider 
                value={[height]} 
                onValueChange={(values) => setHeight(values[0])}
                min={256}
                max={1024}
                step={64}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Duration: {duration} seconds</label>
            <Slider 
              value={[duration]} 
              onValueChange={(values) => setDuration(values[0])}
              min={1}
              max={10}
              step={1}
            />
          </div>

          <Button 
            className="w-full" 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim() || !selectedModel}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {generatedVideoUrl ? (
            <div className="bg-black/30 rounded-lg overflow-hidden border border-dreamaker-purple/20 aspect-video">
              <video 
                src={generatedVideoUrl} 
                controls
                loop
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-black/20 rounded-lg border border-dashed border-dreamaker-purple/30 p-8">
              <Film className="h-16 w-16 text-dreamaker-purple/40 mb-4" />
              <p className="text-gray-400 text-center">
                Generated video will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
