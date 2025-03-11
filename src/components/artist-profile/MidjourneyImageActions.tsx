
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { piapiService } from '@/services/piapi';
import { ArrowUpCircle, Sparkles, RefreshCw } from "lucide-react";
import { MidjourneyAspectRatio, MidjourneyUpscaleIndex, MidjourneyVariationIndex } from '@/types/persona';

interface MidjourneyImageActionsProps {
  imageUrl?: string; 
  taskId: string;
  prompt?: string;
  originalPrompt?: string;
  aspectRatio?: MidjourneyAspectRatio;
  onAction: (taskId: string, action: string) => void;
  isComplete?: boolean;
}

export const MidjourneyImageActions = ({
  imageUrl,
  taskId,
  prompt,
  originalPrompt,
  aspectRatio = '1:1',
  onAction
}: MidjourneyImageActionsProps) => {
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [isVariating, setIsVariating] = useState(false);
  const [isRerolling, setIsRerolling] = useState(false);

  const handleUpscale = async (index: MidjourneyUpscaleIndex) => {
    if (!taskId) {
      toast.error('No task ID available for upscale');
      return;
    }

    setIsUpscaling(true);
    try {
      const result = await piapiService.midjourney.upscaleImage({
        origin_task_id: taskId,
        index
      });

      toast.success(`Upscale ${index} started`);
      onAction(result.task_id, 'upscale');
    } catch (error) {
      console.error('Error upscaling image:', error);
      toast.error('Failed to upscale image');
    } finally {
      setIsUpscaling(false);
    }
  };

  const handleVariation = async (index: MidjourneyVariationIndex) => {
    if (!taskId) {
      toast.error('Missing task ID for variation');
      return;
    }

    const promptToUse = prompt || originalPrompt;
    if (!promptToUse) {
      toast.error('Missing prompt for variation');
      return;
    }

    setIsVariating(true);
    try {
      const result = await piapiService.midjourney.createVariation({
        origin_task_id: taskId,
        index,
        prompt: promptToUse,
        aspect_ratio: aspectRatio
      });

      toast.success(`Variation ${index} started`);
      onAction(result.task_id, 'variation');
    } catch (error) {
      console.error('Error creating variation:', error);
      toast.error('Failed to create variation');
    } finally {
      setIsVariating(false);
    }
  };

  const handleReroll = async () => {
    if (!taskId) {
      toast.error('No task ID available for reroll');
      return;
    }

    const promptToUse = prompt || originalPrompt;
    if (!promptToUse) {
      toast.error('Missing prompt for reroll');
      return;
    }

    setIsRerolling(true);
    try {
      const result = await piapiService.midjourney.rerollImage({
        origin_task_id: taskId,
        prompt: promptToUse,
        aspect_ratio: aspectRatio
      });

      toast.success('Reroll started');
      onAction(result.task_id, 'reroll');
    } catch (error) {
      console.error('Error rerolling image:', error);
      toast.error('Failed to reroll image');
    } finally {
      setIsRerolling(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <div>
        <p className="text-sm mb-1 text-gray-300">Upscale</p>
        <div className="flex gap-1">
          {(['1', '2', '3', '4'] as MidjourneyUpscaleIndex[]).map((index) => (
            <Button 
              key={`upscale-${index}`}
              size="sm"
              variant="outline" 
              className="h-8 px-2 bg-black/30 hover:bg-purple-800/50 text-white hover:text-white border-purple-600/30 hover:border-purple-500"
              onClick={() => handleUpscale(index)}
              disabled={isUpscaling}
            >
              <ArrowUpCircle className="h-3 w-3 mr-1" />
              U{index}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm mb-1 text-gray-300">Variations</p>
        <div className="flex gap-1">
          {(['1', '2', '3', '4'] as MidjourneyVariationIndex[]).map((index) => (
            <Button 
              key={`variation-${index}`}
              size="sm"
              variant="outline" 
              className="h-8 px-2 bg-black/30 hover:bg-purple-800/50 text-white hover:text-white border-purple-600/30 hover:border-purple-500"
              onClick={() => handleVariation(index)}
              disabled={isVariating}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              V{index}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm mb-1 text-gray-300">Other</p>
        <Button 
          size="sm"
          variant="outline" 
          className="h-8 px-3 bg-black/30 hover:bg-purple-800/50 text-white hover:text-white border-purple-600/30 hover:border-purple-500"
          onClick={handleReroll}
          disabled={isRerolling}
        >
          <RefreshCw className="h-3 w-3 mr-2" />
          Reroll
        </Button>
      </div>
    </div>
  );
};
