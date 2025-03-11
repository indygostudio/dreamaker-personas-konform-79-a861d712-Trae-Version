
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { BannerPosition, BannerPositionJson } from '@/types/types';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface BannerPositionControlsProps {
  position: BannerPosition;
  onPositionChange: (position: BannerPosition) => void;
  id: string;
}

export const BannerPositionControls = ({
  position,
  onPositionChange,
  id
}: BannerPositionControlsProps) => {
  const { toast } = useToast();

  const adjustBannerPosition = async (direction: 'up' | 'down' | 'left' | 'right' | 'reset') => {
    try {
      let newPosition = {
        ...position
      };
      
      const moveAmount = 10; // Amount to move in each direction
      
      switch (direction) {
        case 'up':
          newPosition.y = Math.max(0, newPosition.y - moveAmount);
          break;
        case 'down':
          newPosition.y = Math.min(100, newPosition.y + moveAmount);
          break;
        case 'left':
          newPosition.x = Math.max(0, newPosition.x - moveAmount);
          break;
        case 'right':
          newPosition.x = Math.min(100, newPosition.x + moveAmount);
          break;
        case 'reset':
          newPosition = {
            x: 50,
            y: 50
          };
          break;
      }
      
      onPositionChange(newPosition);

      const positionJson: BannerPositionJson = {
        x: newPosition.x,
        y: newPosition.y
      };
      
      const { error } = await supabase
        .from('profiles')
        .update({
          banner_position: positionJson
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        description: "Banner position updated"
      });
    } catch (error) {
      console.error('Position update error:', error);
      toast({
        variant: "destructive",
        description: "Failed to update banner position"
      });
    }
  };

  return (
    <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
      <div className="col-start-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => adjustBannerPosition('up')} 
          className="bg-black/60 border-white/20 text-white h-8 w-8 p-0"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="col-start-1 row-start-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => adjustBannerPosition('left')} 
          className="bg-black/60 border-white/20 text-white h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="col-start-2 row-start-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => adjustBannerPosition('reset')} 
          className="bg-black/60 border-white/20 text-white h-8 w-8 p-0"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="col-start-3 row-start-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => adjustBannerPosition('right')} 
          className="bg-black/60 border-white/20 text-white h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="col-start-2 row-start-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => adjustBannerPosition('down')} 
          className="bg-black/60 border-white/20 text-white h-8 w-8 p-0"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
