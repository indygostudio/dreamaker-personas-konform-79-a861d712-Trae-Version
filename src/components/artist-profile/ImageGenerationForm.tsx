import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, Image, Sparkles, AlertCircle, RefreshCcw, Hourglass } from "lucide-react";
import { toast } from 'sonner';
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { piapiService } from '@/services/piapiService';

interface ImageGenerationFormProps {
  personaId: string;
  onTaskCreated?: (taskId: string) => void;
  onImageGenerated?: (imageUrl: string) => void;
}

export function ImageGenerationForm({ personaId, onTaskCreated, onImageGenerated }: ImageGenerationFormProps) {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const { user } = useUser();

  const startPolling = (taskId: string) => {
    setIsPolling(true);
    const interval = setInterval(async () => {
      const task = await piapiService.checkMidjourneyTaskStatus(taskId);
      if (task.status === 'Completed') {
        clearInterval(interval);
        setPollingInterval(null);
        setIsPolling(false);
        setStatusMessage('Image generation complete!');
        setImageUrl(task.image_url);
        if (onImageGenerated && task.image_url) {
          onImageGenerated(task.image_url);
        }
      } else if (task.status === 'Failed') {
        clearInterval(interval);
        setPollingInterval(null);
        setIsPolling(false);
        setStatusMessage('Image generation failed.');
        toast.error("Image generation failed.");
      } else {
        setStatusMessage(`Task status: ${task.status}`);
      }
    }, 5000);
    setPollingInterval(interval);
  };

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
      setIsPolling(false);
    }
  };

  const generateImage = async () => {
    if (!prompt) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setStatusMessage("Starting image generation...");

    try {
      const result = await piapiService.generateMidjourneyImage({
        prompt: prompt,
        aspect_ratio: aspectRatio as any,
        process_mode: "fast",
      });

      if (result.task_id) {
        setTaskId(result.task_id);
        setStatusMessage(`Task started: ${result.task_id}`);
        
        const { error } = await supabase
          .from('ai_image_tasks')
          .insert({
            user_id: user?.id,
            persona_id: personaId,
            task_id: result.task_id,
            title: prompt.substring(0, 100),
            prompt: prompt,
            status: 'pending',
            service: 'midjourney'
          });
          
        if (error) {
          console.error("Error saving task info:", error);
        }
        
        onTaskCreated && onTaskCreated(result.task_id);
        startPolling(result.task_id);
      } else {
        setStatusMessage("Failed to start task");
        toast.error("Failed to start image generation");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setStatusMessage("Error: Failed to generate image");
      toast.error("Failed to generate image. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">Prompt</label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="bg-black/20 border-dreamaker-purple/30 min-h-[100px]"
          placeholder="Describe the image you want to generate..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">Aspect Ratio</label>
        <Select value={aspectRatio} onValueChange={setAspectRatio}>
          <SelectTrigger className="bg-black/20 border-dreamaker-purple/30">
            <SelectValue placeholder="Select aspect ratio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1:1">1:1</SelectItem>
            <SelectItem value="16:9">16:9</SelectItem>
            <SelectItem value="9:16">9:16</SelectItem>
            <SelectItem value="4:3">4:3</SelectItem>
            <SelectItem value="3:2">3:2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full"
        onClick={generateImage}
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
            Generate Image
          </>
        )}
      </Button>

      {statusMessage && (
        <div className="text-sm text-gray-400">
          {statusMessage}
        </div>
      )}

      {imageUrl && (
        <div className="mt-4">
          <img
            src={imageUrl}
            alt="Generated Image"
            className="w-full rounded-md"
          />
        </div>
      )}
    </div>
  );
}
