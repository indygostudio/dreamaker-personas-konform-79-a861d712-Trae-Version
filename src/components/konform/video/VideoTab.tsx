import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, Film, Sparkles, Upload, Mic, Text, Plus, Save } from "lucide-react";
import { piapiService } from '@/services/piapiService';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export function VideoTab() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState('hedra-character-3');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState('720p');
  const [selectedModel, setSelectedModel] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState('');
  const [hasUploadedAudio, setHasUploadedAudio] = useState(false);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);

  const { data: models, isLoading: isLoadingModels } = useQuery({
    queryKey: ['video-models'],
    queryFn: async () => {
      try {
        const allModels = await piapiService.getModels();
        return allModels.filter(model => model.type === 'video');
      } catch (error) {
        console.error('Error fetching models:', error);
        return [];
      }
    }
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Script required",
        description: "Please enter a script for your video",
        variant: "destructive"
      });
      return;
    }

    if (!selectedModel) {
      toast({
        title: "Model required",
        description: "Please select a video generation model",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // This would be replaced with actual video generation API call
      // For now, we'll simulate a successful generation after a delay
      setTimeout(() => {
        setGeneratedVideoUrl('/Videos/KONFORM_01.mp4'); // Placeholder video
        setIsGenerating(false);
        toast({
          title: "Video generated",
          description: "Your video has been successfully created",
          variant: "default"
        });
      }, 3000);

      // Actual implementation would look like this:
      /*
      const result = await piapiService.generateVideo({
        model: selectedModel,
        prompt,
        character: selectedCharacter,
        aspectRatio,
        resolution
      });
      
      if (result.status === 'complete' && result.url) {
        setGeneratedVideoUrl(result.url);
        toast({
          title: "Video generated",
          description: "Your video has been successfully created",
          variant: "default"
        });
      } else if (result.status === 'processing') {
        toast({
          title: "Processing",
          description: "Video is being generated. Check history for results.",
          variant: "default"
        });
      } else {
        toast({
          title: "Generation failed",
          description: "Failed to generate video",
          variant: "destructive"
        });
      }
      */
    } catch (error) {
      console.error('Error generating video:', error);
      toast({
        title: "Generation failed",
        description: "An error occurred while generating your video",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAudioUpload = () => {
    // Simulate audio upload
    setHasUploadedAudio(true);
    toast({
      title: "Audio uploaded",
      description: "Your audio script has been uploaded",
      variant: "default"
    });
  };

  const handleImageUpload = () => {
    // Simulate image upload
    setHasUploadedImage(true);
    toast({
      title: "Image uploaded",
      description: "Your reference image has been uploaded",
      variant: "default"
    });
  };

  const handleSaveProject = () => {
    // Save project state
    localStorage.setItem('konform-video-state', JSON.stringify({
      savedAt: new Date().toISOString(),
      prompt,
      selectedCharacter,
      aspectRatio,
      resolution,
      selectedModel,
      hasUploadedAudio,
      hasUploadedImage
    }));
    
    toast({
      title: "Project saved",
      description: "Your video project has been saved",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Create Video</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-black/20 border-white/20 hover:bg-black/40 text-white rounded-full"
          onClick={handleSaveProject}
          title="Save project"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Project
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Character Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Character</label>
            <Select value={selectedCharacter} onValueChange={setSelectedCharacter}>
              <SelectTrigger className="bg-black/20 border-[#0EA5E9]/30">
                <SelectValue placeholder="Select a character" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hedra-character-1">Hedra Character 1</SelectItem>
                <SelectItem value="hedra-character-2">Hedra Character 2</SelectItem>
                <SelectItem value="hedra-character-3">Hedra Character 3</SelectItem>
                <SelectItem value="veo-2">Veo 2</SelectItem>
                <SelectItem value="kling-1.6">Kling 1.6</SelectItem>
                <SelectItem value="minimax">Minimax</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="bg-black/20 border-[#0EA5E9]/30">
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
                )) || [
                  <SelectItem key="model-1" value="model-1">Video Model 1</SelectItem>,
                  <SelectItem key="model-2" value="model-2">Video Model 2</SelectItem>,
                  <SelectItem key="model-3" value="model-3">Video Model 3</SelectItem>
                ]}
              </SelectContent>
            </Select>
          </div>

          {/* Aspect Ratio Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Aspect Ratio</label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger className="bg-black/20 border-[#0EA5E9]/30">
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1:1">1:1 (Square)</SelectItem>
                <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resolution Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Resolution</label>
            <Select value={resolution} onValueChange={setResolution}>
              <SelectTrigger className="bg-black/20 border-[#0EA5E9]/30">
                <SelectValue placeholder="Select resolution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="480p">480p</SelectItem>
                <SelectItem value="720p">720p</SelectItem>
                <SelectItem value="1080p">1080p</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Script Input */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Script</label>
            <Textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-black/20 border-[#0EA5E9]/30 min-h-[120px]"
              placeholder="Prompt your character with emotion & gestures (optional)..."
            />
          </div>

          {/* Audio Upload Buttons */}
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              className="bg-black/20 border-[#0EA5E9]/30 hover:bg-[#0EA5E9]/10 hover:border-[#0EA5E9]/40"
              onClick={handleAudioUpload}
            >
              <Text className="h-4 w-4 mr-2" />
              Generate speech
            </Button>
            <Button 
              variant="outline" 
              className="bg-black/20 border-[#0EA5E9]/30 hover:bg-[#0EA5E9]/10 hover:border-[#0EA5E9]/40"
              onClick={handleAudioUpload}
            >
              <Mic className="h-4 w-4 mr-2" />
              Record audio
            </Button>
            <Button 
              variant="outline" 
              className="bg-black/20 border-[#0EA5E9]/30 hover:bg-[#0EA5E9]/10 hover:border-[#0EA5E9]/40"
              onClick={handleAudioUpload}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload audio
            </Button>
          </div>

          {/* Generate Button */}
          <Button 
            className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] hover:from-[#0EA5E9]/90 hover:to-[#6366F1]/90" 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
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
          {/* Video Preview */}
          {generatedVideoUrl ? (
            <div className="bg-black/30 rounded-lg overflow-hidden border border-[#0EA5E9]/20 aspect-video">
              <video 
                src={generatedVideoUrl} 
                controls
                loop
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-black/20 rounded-lg border border-dashed border-[#0EA5E9]/30 p-8">
              <Film className="h-16 w-16 text-[#0EA5E9]/40 mb-4" />
              <p className="text-gray-400 text-center">
                Generated video will appear here
              </p>
            </div>
          )}

          {/* Image Upload Section */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-200 mb-2">Reference Image</label>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className="flex flex-col items-center justify-center h-40 bg-black/20 rounded-lg border border-dashed border-[#0EA5E9]/30 p-4 cursor-pointer hover:bg-black/30 transition-colors"
                onClick={handleImageUpload}
              >
                <Plus className="h-8 w-8 text-[#0EA5E9]/40 mb-2" />
                <p className="text-gray-400 text-center text-sm">
                  Audio script
                </p>
              </div>
              <div 
                className="flex flex-col items-center justify-center h-40 bg-black/20 rounded-lg border border-dashed border-[#0EA5E9]/30 p-4 cursor-pointer hover:bg-black/30 transition-colors"
                onClick={handleImageUpload}
              >
                <Plus className="h-8 w-8 text-[#0EA5E9]/40 mb-2" />
                <p className="text-gray-400 text-center text-sm">
                  Image frame
                </p>
              </div>
            </div>
          </div>

          {/* Image Upload Buttons */}
          <div className="flex flex-col space-y-2 mt-4">
            <Button 
              variant="outline" 
              className="bg-black/20 border-[#0EA5E9]/30 hover:bg-[#0EA5E9]/10 hover:border-[#0EA5E9]/40"
              onClick={handleImageUpload}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Create image
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="bg-black/20 border-[#0EA5E9]/30 hover:bg-[#0EA5E9]/10 hover:border-[#0EA5E9]/40"
                onClick={handleImageUpload}
              >
                <Upload className="h-4 w-4 mr-2" />
                Capture image
              </Button>
              <Button 
                variant="outline" 
                className="bg-black/20 border-[#0EA5E9]/30 hover:bg-[#0EA5E9]/10 hover:border-[#0EA5E9]/40"
                onClick={handleImageUpload}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload image
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}