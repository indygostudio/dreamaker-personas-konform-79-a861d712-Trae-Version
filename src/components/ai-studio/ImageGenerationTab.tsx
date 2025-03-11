import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Loader2, 
  Image, 
  Sparkles, 
  AlertCircle, 
  RefreshCcw, 
  Hourglass, 
  Upload, 
  Blend, 
  Download, 
  Edit, 
  Lock, 
  ExternalLink, 
  User,
  Heart 
} from "lucide-react";
import { piapiService } from '@/services/piapiService';
import { 
  Persona, 
  MidjourneyAspectRatio, 
  MidjourneyProcessMode, 
  MidjourneyDimension 
} from '@/types/persona';
import { MidjourneyGenerationResult, GenerationResult } from '@/services/piapi/types';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MidjourneyImageActions } from '@/components/artist-profile/MidjourneyImageActions';
import { MjVideoPlayer } from "@/components/artist-profile/MjVideoPlayer";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface ImageGenerationTabProps {
  persona?: Persona;
}

export function ImageGenerationTab({ persona }: ImageGenerationTabProps) {
  // Standard image generation state
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [samples, setSamples] = useState(1);
  const [selectedModel, setSelectedModel] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  
  // Midjourney specific state
  const [mjPrompt, setMjPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<MidjourneyAspectRatio>('1:1');
  const [processMode, setProcessMode] = useState<MidjourneyProcessMode>('relax');
  const [mjTaskId, setMjTaskId] = useState<string | null>(null);
  const [mjOriginalPrompt, setMjOriginalPrompt] = useState<string>('');
  const [mjStatus, setMjStatus] = useState<string | null>(null);
  const [mjImages, setMjImages] = useState<string[]>([]);
  const [mjPollingInterval, setMjPollingInterval] = useState<number | null>(null);
  const [isMjGenerating, setIsMjGenerating] = useState(false);
  
  // Midjourney blend state
  const [blendImageUrls, setBlendImageUrls] = useState<string[]>(['', '']);
  const [blendProcessMode, setBlendProcessMode] = useState<MidjourneyProcessMode>('relax');
  const [blendDimension, setBlendDimension] = useState<string>('square');
  const [isBlending, setIsBlending] = useState(false);

  // Midjourney account state
  const [isMjConnected, setIsMjConnected] = useState(false);
  const [mjUsername, setMjUsername] = useState('');
  const [mjPassword, setMjPassword] = useState('');
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('midjourney');

  // Midjourney aesthetics state
  const [stylizationValue, setStylizationValue] = useState([0.5]);
  const [weirdnessValue, setWeirdnessValue] = useState([0.3]);
  const [varietyValue, setVarietyValue] = useState([0.5]);
  const [personalize, setPersonalize] = useState("off");
  const [modelVersion, setModelVersion] = useState("6.1");

  const [rawMode, setRawMode] = useState<boolean>(false);

  const { user } = useUser();

  const { 
    data: models, 
    isLoading: isLoadingModels, 
    error: modelsError, 
    refetch: refetchModels 
  } = useQuery({
    queryKey: ['image-models'],
    queryFn: async () => {
      try {
        const allModels = await piapiService.getModels();
        console.log('All models:', allModels);
        const imageModels = allModels.filter(model => model.type === 'image');
        console.log('Filtered image models:', imageModels);
        return imageModels;
      } catch (error) {
        console.error('Error fetching image models:', error);
        throw error;
      }
    }
  });

  useEffect(() => {
    if (models && models.length > 0 && !selectedModel) {
      setSelectedModel(models[0].id);
    }
  }, [models, selectedModel]);

  useEffect(() => {
    return () => {
      if (mjPollingInterval) {
        clearInterval(mjPollingInterval);
      }
    };
  }, [mjPollingInterval]);

  const handleModelFetch = () => {
    refetchModels();
    toast.info('Refreshing available models...');
  };

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
      const result = await piapiService.generateImage({
        model: selectedModel,
        prompt,
        negative_prompt: negativePrompt || undefined,
        width,
        height,
        samples
      });
      
      if (result.status === 'complete' && result.urls) {
        setGeneratedImages(result.urls);
        toast.success('Images generated successfully');
      } else if (result.status === 'processing') {
        toast.info('Images are being generated. Check history for results.');
      } else {
        toast.error('Failed to generate images');
      }
    } catch (error) {
      console.error('Error generating images:', error);
      toast.error('Failed to generate images');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMidjourney = async () => {
    if (!mjPrompt.trim()) {
      toast.error('Please enter a prompt for Midjourney');
      return;
    }

    setIsMjGenerating(true);
    setMjTaskId(null);
    setMjStatus(null);
    setMjImages([]);
    setMjOriginalPrompt(mjPrompt);

    if (mjPollingInterval) {
      clearInterval(mjPollingInterval);
      setMjPollingInterval(null);
    }

    try {
      // Include aesthetics parameters in the config
      const config = {
        stylization: stylizationValue[0],
        weirdness: weirdnessValue[0],
        variety: varietyValue[0],
        personalize: personalize === "on",
        version: modelVersion,
        raw: rawMode
      };

      const result = await piapiService.generateMidjourneyImage({
        prompt: mjPrompt,
        aspect_ratio: aspectRatio,
        process_mode: processMode,
        skip_prompt_check: false,
        config
      });
      
      setMjTaskId(result.task_id);
      setMjStatus(result.status);
      toast.success('Midjourney task started successfully');

      // Save task to database if persona is defined
      if (user && persona?.id) {
        try {
          const { error } = await supabase
            .from('ai_image_tasks')
            .insert({
              user_id: user.id,
              persona_id: persona.id,
              task_id: result.task_id,
              title: mjPrompt.substring(0, 100),
              prompt: mjPrompt,
              status: 'pending',
              service: 'midjourney'
            });
            
          if (error) {
            console.error("Error saving task info:", error);
          }
        } catch (dbError) {
          console.error("Error saving to database:", dbError);
        }
      }

      const interval = setInterval(async () => {
        try {
          const statusResult = await piapiService.checkMidjourneyTaskStatus(result.task_id);
          setMjStatus(statusResult.status);
          
          if (statusResult.image_urls && statusResult.image_urls.length > 0) {
            setMjImages(statusResult.image_urls);
          } else if (statusResult.image_url) {
            setMjImages([statusResult.image_url]);
          } else if (statusResult.output?.image_urls && statusResult.output.image_urls.length > 0) {
            setMjImages(statusResult.output.image_urls);
          } else if (statusResult.output?.image_url) {
            setMjImages([statusResult.output.image_url]);
          }
          
          if (statusResult.status === 'Completed' || statusResult.status === 'Failed') {
            clearInterval(interval);
            setMjPollingInterval(null);
            setIsMjGenerating(false);
            
            // Save completed image to the persona's gallery
            if (statusResult.status === 'Completed' && user && persona?.id) {
              // If we have an image URL, save it to the persona's gallery
              const imageUrl = statusResult.image_url || 
                  (statusResult.image_urls && statusResult.image_urls.length > 0 ? statusResult.image_urls[0] : null) ||
                  (statusResult.output?.image_url) || 
                  (statusResult.output?.image_urls && statusResult.output.image_urls.length > 0 ? statusResult.output.image_urls[0] : null);
              
              if (imageUrl) {
                try {
                  const { error } = await supabase
                    .from('ai_images')
                    .insert({
                      user_id: user.id,
                      persona_id: persona.id,
                      title: mjPrompt.substring(0, 100),
                      prompt: mjPrompt,
                      image_url: imageUrl,
                      width: 1024,
                      height: 1024,
                      tags: mjPrompt.split(' ')
                        .filter(word => word.length > 3)
                        .slice(0, 5),
                    });
                    
                  if (error) {
                    console.error("Error saving image to gallery:", error);
                  }
                } catch (saveError) {
                  console.error("Error saving image to gallery:", saveError);
                }
              }
            }
            
            if (statusResult.status === 'Completed') {
              toast.success('Midjourney image generation completed');
            } else {
              toast.error('Midjourney image generation failed: ' + (statusResult.error?.message || 'Unknown error'));
            }
          }
        } catch (error) {
          console.error('Error checking Midjourney task status:', error);
        }
      }, 5000);

      setMjPollingInterval(interval as unknown as number);
    } catch (error) {
      console.error('Error generating Midjourney image:', error);
      toast.error('Failed to start Midjourney task');
      setIsMjGenerating(false);
    }
  };

  const handleBlendImages = async () => {
    const validUrls = blendImageUrls.filter(url => url.trim() !== '');
    if (validUrls.length < 2) {
      toast.error('Please provide at least 2 image URLs to blend');
      return;
    }

    setIsBlending(true);
    setMjTaskId(null);
    setMjStatus(null);
    setMjImages([]);
    setMjOriginalPrompt('Blend operation');

    if (mjPollingInterval) {
      clearInterval(mjPollingInterval);
      setMjPollingInterval(null);
    }

    try {
      const result = await piapiService.blendMidjourneyImages({
        image_urls: validUrls,
        process_mode: blendProcessMode,
        dimension: blendDimension as MidjourneyDimension
      });
      
      setMjTaskId(result.task_id);
      setMjStatus(result.status);
      toast.success('Blend operation started successfully');

      const interval = setInterval(async () => {
        try {
          const statusResult = await piapiService.checkMidjourneyTaskStatus(result.task_id);
          setMjStatus(statusResult.status);
          
          if (statusResult.image_urls && statusResult.image_urls.length > 0) {
            setMjImages(statusResult.image_urls);
          } else if (statusResult.image_url) {
            setMjImages([statusResult.image_url]);
          } else if (statusResult.output?.image_urls && statusResult.output.image_urls.length > 0) {
            setMjImages(statusResult.output.image_urls);
          } else if (statusResult.output?.image_url) {
            setMjImages([statusResult.output.image_url]);
          }
          
          if (statusResult.status === 'Completed' || statusResult.status === 'Failed') {
            clearInterval(interval);
            setMjPollingInterval(null);
            setIsBlending(false);
            
            if (statusResult.status === 'Completed') {
              toast.success('Image blend completed');
            } else {
              toast.error('Image blend failed: ' + (statusResult.error?.message || 'Unknown error'));
            }
          }
        } catch (error) {
          console.error('Error checking blend task status:', error);
        }
      }, 5000);

      setMjPollingInterval(interval as unknown as number);
    } catch (error) {
      console.error('Error blending images:', error);
      toast.error('Failed to start blend operation');
      setIsBlending(false);
    }
  };

  const handleMidjourneyAction = (newTaskId: string, action: string) => {
    setMjImages([]);
    setMjTaskId(newTaskId);
    setMjStatus('Processing');
    setIsMjGenerating(true);
    
    if (mjPollingInterval) {
      clearInterval(mjPollingInterval);
      setMjPollingInterval(null);
    }
    
    const interval = setInterval(async () => {
      try {
        const statusResult = await piapiService.checkMidjourneyTaskStatus(newTaskId);
        setMjStatus(statusResult.status);
        
        if (statusResult.image_urls && statusResult.image_urls.length > 0) {
          setMjImages(statusResult.image_urls);
        } else if (statusResult.image_url) {
          setMjImages([statusResult.image_url]);
        } else if (statusResult.output?.image_urls && statusResult.output.image_urls.length > 0) {
          setMjImages(statusResult.output.image_urls);
        } else if (statusResult.output?.image_url) {
          setMjImages([statusResult.output.image_url]);
        }
        
        if (statusResult.status === 'Completed' || statusResult.status === 'Failed') {
          clearInterval(interval);
          setMjPollingInterval(null);
          setIsMjGenerating(false);
          
          // Save completed image to persona's gallery if available
          if (statusResult.status === 'Completed' && user && persona?.id) {
            const imageUrl = statusResult.image_url || 
                (statusResult.image_urls && statusResult.image_urls.length > 0 ? statusResult.image_urls[0] : null) ||
                (statusResult.output?.image_url) || 
                (statusResult.output?.image_urls && statusResult.output.image_urls.length > 0 ? statusResult.output.image_urls[0] : null);
          
            if (imageUrl) {
              try {
                const { error } = await supabase
                  .from('ai_images')
                  .insert({
                    user_id: user.id,
                    persona_id: persona.id,
                    title: mjOriginalPrompt.substring(0, 100),
                    prompt: mjOriginalPrompt,
                    image_url: imageUrl,
                    width: 1024,
                    height: 1024,
                    tags: mjOriginalPrompt.split(' ')
                      .filter(word => word.length > 3)
                      .slice(0, 5),
                  });
                
                if (error) {
                  console.error("Error saving image to gallery:", error);
                }
              } catch (saveError) {
                console.error("Error saving image to gallery:", saveError);
              }
            }
          }
        
          if (statusResult.status === 'Completed') {
            toast.success(`Midjourney ${action} completed`);
          } else {
            toast.error(`Midjourney ${action} failed: ` + (statusResult.error?.message || 'Unknown error'));
          }
        }
      } catch (error) {
        console.error(`Error checking ${action} task status:`, error);
      }
    }, 5000);

    setMjPollingInterval(interval as unknown as number);
  };

  const updateBlendImageUrl = (index: number, url: string) => {
    const newUrls = [...blendImageUrls];
    newUrls[index] = url;
    setBlendImageUrls(newUrls);
  };

  const addBlendImageField = () => {
    if (blendImageUrls.length < 5) {
      setBlendImageUrls([...blendImageUrls, '']);
    } else {
      toast.info('Maximum of 5 images allowed for blending');
    }
  };

  const removeBlendImageField = (index: number) => {
    if (blendImageUrls.length > 2) {
      const newUrls = blendImageUrls.filter((_, i) => i !== index);
      setBlendImageUrls(newUrls);
    } else {
      toast.info('Minimum of 2 images required for blending');
    }
  };

  const handleMjConnect = () => {
    // This would typically connect to Midjourney's API with the provided credentials
    if (mjUsername && mjPassword) {
      toast.success('Connected to Midjourney account');
      setIsMjConnected(true);
      setShowConnectDialog(false);
    } else {
      toast.error('Please enter both username and password');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Image Generation</h2>
        
        <Button 
          variant={isMjConnected ? "default" : "outline"} 
          className={isMjConnected ? "bg-dreamaker-purple" : "border-dreamaker-purple/30"}
          size="sm"
          onClick={() => setShowConnectDialog(true)}
        >
          <User className="h-4 w-4 mr-2" />
          {isMjConnected ? "Midjourney Connected" : "Connect Midjourney Account"}
        </Button>
      </div>

      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="bg-black/90 border-dreamaker-purple/30 text-white">
          <DialogHeader>
            <DialogTitle>Connect to Midjourney</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter your Midjourney credentials to connect your account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Username/Email</label>
              <Input 
                placeholder="Enter your Midjourney email" 
                value={mjUsername} 
                onChange={(e) => setMjUsername(e.target.value)}
                className="bg-black/30 border-dreamaker-purple/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Password</label>
              <Input 
                type="password" 
                placeholder="Enter your Midjourney password" 
                value={mjPassword} 
                onChange={(e) => setMjPassword(e.target.value)}
                className="bg-black/30 border-dreamaker-purple/30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowConnectDialog(false)}
              className="border-dreamaker-purple/30"
            >
              Cancel
            </Button>
            <Button onClick={handleMjConnect} className="bg-dreamaker-purple">
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs 
        defaultValue="midjourney" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full mb-4 relative bg-transparent border-b border-dreamaker-purple/20 p-0 h-auto">
          <TabsTrigger 
            value="standard" 
            className="flex-1 px-4 py-3 rounded-none bg-transparent data-[state=active]:bg-transparent relative overflow-hidden"
          >
            Standard Image Generation
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent data-[state=active]:bg-konform-neon-blue transition-all data-[state=active]:opacity-100 opacity-0" />
          </TabsTrigger>
          <TabsTrigger 
            value="midjourney" 
            className="flex-1 px-4 py-3 rounded-none bg-transparent data-[state=active]:bg-transparent relative overflow-hidden"
          >
            Midjourney
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent data-[state=active]:bg-konform-neon-blue transition-all data-[state=active]:opacity-100 opacity-0" />
          </TabsTrigger>
          <TabsTrigger 
            value="blend" 
            className="flex-1 px-4 py-3 rounded-none bg-transparent data-[state=active]:bg-transparent relative overflow-hidden"
          >
            Image Blend
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent data-[state=active]:bg-konform-neon-blue transition-all data-[state=active]:opacity-100 opacity-0" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standard">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Model</label>
                <div className="flex space-x-2">
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="bg-black/20 border-dreamaker-purple/30 flex-1">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingModels ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading models...
                        </div>
                      ) : modelsError ? (
                        <div className="flex items-center text-red-400 p-2">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Error loading models
                        </div>
                      ) : models && models.length > 0 ? (
                        models.map(model => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-gray-400">No image models available</div>
                      )}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleModelFetch} 
                    className="text-dreamaker-purple"
                    title="Refresh models"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
                
                {modelsError && (
                  <div className="mt-2 text-sm text-red-400 bg-red-950/20 p-2 rounded-md">
                    <p>Error loading models. Please check your API key and try refreshing.</p>
                  </div>
                )}
                
                {models?.length === 0 && !isLoadingModels && !modelsError && (
                  <div className="mt-2 text-sm text-amber-400 bg-amber-950/20 p-2 rounded-md">
                    <p>No image models found. Please check if your PiAPI key is configured correctly.</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Prompt</label>
                <Textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-black/20 border-dreamaker-purple/30 min-h-[120px]"
                  placeholder="Describe the image you want to generate..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Negative Prompt (Optional)</label>
                <Textarea 
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  className="bg-black/20 border-dreamaker-purple/30"
                  placeholder="Elements you don't want in the image..."
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
                <label className="block text-sm font-medium text-gray-200 mb-1">Number of Images: {samples}</label>
                <Slider 
                  value={[samples]} 
                  onValueChange={(values) => setSamples(values[0])}
                  min={1}
                  max={4}
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
              {generatedImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {generatedImages.map((url, index) => (
                    <div key={index} className="aspect-square bg-black/30 rounded-lg overflow-hidden border border-dreamaker-purple/20">
                      <img 
                        src={url} 
                        alt={`Generated image ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-black/20 rounded-lg border border-dashed border-dreamaker-purple/30 p-8">
                  <Image className="h-16 w-16 text-dreamaker-purple/40 mb-4" />
                  <p className="text-gray-400 text-center">
                    Generated images will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="midjourney">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <div className="p-4 rounded-lg bg-[#1A1F2C]/70 border border-gray-700">
                <div>
                  <Textarea 
                    value={mjPrompt}
                    onChange={(e) => setMjPrompt(e.target.value)}
                    className="bg-black/20 border-dreamaker-purple/30 min-h-[80px] mb-4"
                    placeholder="A Halloween costume idea for college girl that's themed as a Rhinestone Cowboy, inspired by Glen Campbell and the Rhinestone Cowboy album cover"
                  />
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1 bg-[#FF5E5B] hover:bg-[#FF5E5B]/80 text-white" 
                      onClick={handleGenerateMidjourney}
                      disabled={isMjGenerating || !mjPrompt.trim()}
                    >
                      {isMjGenerating ? (
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
                    <Button 
                      variant="outline" 
                      className="border-gray-600 text-white hover:bg-gray-800"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-gray-600 text-white hover:bg-gray-800"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-[#1A1F2C]/70 border border-gray-700">
                  <h3 className="text-lg font-medium mb-4">Image Size</h3>
                  
                  <div className="flex flex-col items-center">
                    <div className="aspect-square w-[108px] border border-gray-600 rounded-lg mb-4 flex items-center justify-center text-white/60">
                      1:1
                    </div>
                    
                    <div className="flex w-full gap-1 mb-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 py-1 h-auto border-gray-600 hover:bg-gray-800 text-sm"
                        onClick={() => setAspectRatio('9:16')}
                      >
                        Portrait
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`flex-1 py-1 h-auto text-sm ${aspectRatio === '1:1' ? 'bg-[#FF5E5B] border-[#FF5E5B] text-white' : 'border-gray-600 hover:bg-gray-800'}`}
                        onClick={() => setAspectRatio('1:1')}
                      >
                        Square
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 py-1 h-auto border-gray-600 hover:bg-gray-800 text-xs"
                        onClick={() => setAspectRatio('16:9')}
                      >
                        Landscape
                      </Button>
                    </div>
                    
                    <Slider 
                      value={[0.5]} 
                      min={0}
                      max={1}
                      step={0.01}
                      className="w-full" 
                    />
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-[#1A1F2C]/70 border border-gray-700">
                  <h3 className="text-lg font-medium mb-4">Aesthetics</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stylization</span>
                        <span>{Math.round(stylizationValue[0] * 100)}%</span>
                      </div>
                      <Slider 
                        value={stylizationValue} 
                        onValueChange={setStylizationValue}
                        min={0}
                        max={1}
                        step={0.01}
                        className="w-full" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Weirdness</span>
                        <span>{Math.round(weirdnessValue[0] * 100)}%</span>
                      </div>
                      <Slider 
                        value={weirdnessValue} 
                        onValueChange={setWeirdnessValue}
                        min={0}
                        max={1}
                        step={0.01}
                        className="w-full" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Variety</span>
                        <span>{Math.round(varietyValue[0] * 100)}%</span>
                      </div>
                      <Slider 
                        value={varietyValue} 
                        onValueChange={setVarietyValue}
                        min={0}
                        max={1}
                        step={0.01}
                        className="w-full" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-[#1A1F2C]/70 border border-gray-700">
                  <h3 className="text-lg font-medium mb-4">Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-1 block">Process Mode</label>
                      <Select value={processMode} onValueChange={value => setProcessMode(value as MidjourneyProcessMode)}>
                        <SelectTrigger className="bg-black/20 border-gray-600">
                          <SelectValue placeholder="Process Mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relax">Relax</SelectItem>
                          <SelectItem value="fast">Fast</SelectItem>
                          <SelectItem value="turbo">Turbo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-1 block">Model Version</label>
                      <Select value={modelVersion} onValueChange={setModelVersion}>
                        <SelectTrigger className="bg-black/20 border-gray-600">
                          <SelectValue placeholder="Model Version" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6.1">v6.1</SelectItem>
                          <SelectItem value="6.0">v6.0</SelectItem>
                          <SelectItem value="5.2">v5.2</SelectItem>
                          <SelectItem value="5.1">v5.1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-300">Raw Mode</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${rawMode ? 'bg-konform-neon-blue border-konform-neon-blue' : 'bg-transparent border-gray-600'}`}
                        onClick={() => setRawMode(!rawMode)}
                      >
                        {rawMode ? 'On' : 'Off'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-[#1A1F2C]/70 border border-gray-700 rounded-lg p-4 h-full flex flex-col">
                <h3 className="text-lg font-medium mb-4">Output</h3>
                
                {mjTaskId && (
                  <div className="mb-2 flex justify-between items-center text-sm">
                    <div>Task ID: <span className="text-gray-400">{mjTaskId.substring(0, 8)}...</span></div>
                    <div 
                      className={`px-2 py-0.5 rounded text-xs ${
                        mjStatus === 'Completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : mjStatus === 'Failed' 
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {mjStatus || 'Waiting'}
                    </div>
                  </div>
                )}
                
                <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
                  {mjImages.length > 0 ? (
                    <div className="w-full">
                      {mjImages.map((url, index) => (
                        <div key={index} className="mb-4 rounded-lg overflow-hidden border border-gray-700">
                          <img 
                            src={url} 
                            alt={`Midjourney result ${index + 1}`}
                            className="w-full h-auto rounded-lg"
                          />
                          <div className="flex justify-between items-center p-2 bg-black/40">
                            <div className="text-xs text-gray-400">
                              {mjOriginalPrompt.length > 30 
                                ? mjOriginalPrompt.substring(0, 30) + '...' 
                                : mjOriginalPrompt}
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : isMjGenerating ? (
                    <div className="text-center">
                      <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-dreamaker-purple/70" />
                      <p className="text-gray-400">This may take a minute or two...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Image className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                      <p className="text-gray-400">Midjourney images will appear here</p>
                    </div>
                  )}
                </div>
                
                {mjTaskId && mjStatus === 'Completed' && !isMjGenerating && mjImages.length > 0 && (
                  <div className="mt-4">
                    <MidjourneyImageActions 
                      taskId={mjTaskId}
                      prompt={mjPrompt}
                      originalPrompt={mjOriginalPrompt}
                      aspectRatio={aspectRatio}
                      onAction={handleMidjourneyAction}
                      imageUrl={mjImages[0]}
                      isComplete={true}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="blend">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <div className="p-4 rounded-lg bg-[#1A1F2C]/70 border border-gray-700">
                <h3 className="text-lg font-medium mb-4">Blend Images</h3>
                
                <div className="space-y-3">
                  {blendImageUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        placeholder={`Image URL ${index + 1}`}
                        value={url}
                        onChange={(e) => updateBlendImageUrl(index, e.target.value)}
                        className="bg-black/20 border-gray-600 flex-1"
                      />
                      
                      {blendImageUrls.length > 2 && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => removeBlendImageField(index)}
                          className="border-gray-600 text-white hover:bg-gray-800 flex-shrink-0"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {blendImageUrls.length < 5 && (
                    <Button 
                      variant="outline" 
                      className="border-gray-600 text-white hover:bg-gray-800 w-full mt-2"
                      onClick={addBlendImageField}
                    >
                      Add Another Image
                    </Button>
                  )}
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">Process Mode</label>
                    <Select 
                      value={blendProcessMode} 
                      onValueChange={value => setBlendProcessMode(value as MidjourneyProcessMode)}
                    >
                      <SelectTrigger className="bg-black/20 border-gray-600">
                        <SelectValue placeholder="Process Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relax">Relax</SelectItem>
                        <SelectItem value="fast">Fast</SelectItem>
                        <SelectItem value="turbo">Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">Dimension</label>
                    <Select 
                      value={blendDimension} 
                      onValueChange={setBlendDimension}
                    >
                      <SelectTrigger className="bg-black/20 border-gray-600">
                        <SelectValue placeholder="Dimension" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4 bg-[#FF5E5B] hover:bg-[#FF5E5B]/80 text-white" 
                  onClick={handleBlendImages}
                  disabled={isBlending || blendImageUrls.filter(url => url.trim()).length < 2}
                >
                  {isBlending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Blending Images...
                    </>
                  ) : (
                    <>
                      <Blend className="h-4 w-4 mr-2" />
                      Blend Images
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-[#1A1F2C]/70 border border-gray-700 rounded-lg p-4 h-full flex flex-col">
                <h3 className="text-lg font-medium mb-4">Blend Result</h3>
                
                {mjTaskId && isBlending && (
                  <div className="mb-2 flex justify-between items-center text-sm">
                    <div>Task ID: <span className="text-gray-400">{mjTaskId.substring(0, 8)}...</span></div>
                    <div 
                      className={`px-2 py-0.5 rounded text-xs ${
                        mjStatus === 'Completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : mjStatus === 'Failed' 
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {mjStatus || 'Waiting'}
                    </div>
                  </div>
                )}
                
                <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
                  {mjImages.length > 0 && isBlending ? (
                    <div className="w-full">
                      {mjImages.map((url, index) => (
                        <div key={index} className="mb-4 rounded-lg overflow-hidden border border-gray-700">
                          <img 
                            src={url} 
                            alt={`Blend result ${index + 1}`}
                            className="w-full h-auto rounded-lg"
                          />
                          <div className="flex justify-between items-center p-2 bg-black/40">
                            <div className="text-xs text-gray-400">Blend Result</div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : isBlending ? (
                    <div className="text-center">
                      <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-dreamaker-purple/70" />
                      <p className="text-gray-400">Blending your images...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Blend className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                      <p className="text-gray-400">Blend results will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
