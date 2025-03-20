
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import type { SubscriptionTier } from "@/types/subscription";

interface MediaCardProps {
  title: string;
  type: "loop" | "midi" | "plugin" | "patch";
  imageUrl: string;
  bpm?: number;
  musicalKey?: string;
  requiredTier: SubscriptionTier;
  currentTier: SubscriptionTier;
  onPlay?: () => void;
  onDownload?: () => void;
}

export const MediaCard = ({
  title,
  type,
  imageUrl,
  bpm,
  musicalKey,
  requiredTier,
  currentTier,
  onPlay,
  onDownload
}: MediaCardProps) => {
  const isLocked = (current: SubscriptionTier, required: SubscriptionTier) => {
    const tiers: Record<SubscriptionTier, number> = {
      'unsigned': 0,
      'indie': 1,
      'pro': 2,
      'label': 3
    };
    return tiers[current] < tiers[required];
  };

  const locked = isLocked(currentTier, requiredTier);

  return (
    <Card className="bg-black/40 border-gray-800 overflow-hidden group relative">
      <div className="aspect-w-16 aspect-h-9 relative">
        <img 
          src={imageUrl || "/placeholder.svg"} 
          alt={title}
          className="w-full h-full object-cover"
        />
        {locked && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm text-gray-200 line-clamp-2">{title}</h3>
          <span className="text-xs px-2 py-1 rounded bg-dreamaker-purple/20 text-dreamaker-purple">
            {type.toUpperCase()}
          </span>
        </div>
        {(bpm || musicalKey) && (
          <div className="flex gap-2 text-xs text-gray-400 mb-3">
            {bpm && <span>{bpm} BPM</span>}
            {musicalKey && <span>Key: {musicalKey}</span>}
          </div>
        )}
        <div className="flex gap-2">
          {!locked ? (
            <>
              <Button 
                variant="secondary" 
                size="sm" 
                className="flex-1"
                onClick={onPlay}
              >
                Play
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={onDownload}
              >
                Download
              </Button>
            </>
          ) : (
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full"
            >
              Upgrade to {requiredTier}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
