
import { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface AudioEnhancementsProps {
  onSettingsChange: (settings: {
    stability: number;
    similarity_boost: number;
    style: number;
    speaking_rate: number;
  }) => void;
  settings: {
    stability: number;
    similarity_boost: number;
    style: number;
    speaking_rate: number;
  };
}

export const AudioEnhancements = ({ onSettingsChange, settings }: AudioEnhancementsProps) => {
  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-xl font-semibold mb-4">Voice Settings</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Stability</Label>
            <span className="text-sm text-gray-400">{settings.stability}%</span>
          </div>
          <Slider
            value={[settings.stability]}
            onValueChange={([value]) => onSettingsChange({ ...settings, stability: value })}
            min={0}
            max={100}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Similarity Boost</Label>
            <span className="text-sm text-gray-400">{settings.similarity_boost}%</span>
          </div>
          <Slider
            value={[settings.similarity_boost]}
            onValueChange={([value]) => onSettingsChange({ ...settings, similarity_boost: value })}
            min={0}
            max={100}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Style</Label>
            <span className="text-sm text-gray-400">{settings.style}%</span>
          </div>
          <Slider
            value={[settings.style]}
            onValueChange={([value]) => onSettingsChange({ ...settings, style: value })}
            min={0}
            max={100}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Speaking Rate</Label>
            <span className="text-sm text-gray-400">{settings.speaking_rate}x</span>
          </div>
          <Slider
            value={[settings.speaking_rate]}
            onValueChange={([value]) => onSettingsChange({ ...settings, speaking_rate: value })}
            min={0.5}
            max={2.0}
            step={0.1}
          />
        </div>
      </div>
    </Card>
  );
};
