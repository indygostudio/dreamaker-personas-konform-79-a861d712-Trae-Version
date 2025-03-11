import { Slider } from "@/components/ui/slider";
import type { Persona } from "@/pages/Personas";

interface BlendingControlsProps {
  personas: Persona[];
  blendRatios: Record<string, number>;
  onBlendChange: (personaId: string, value: number[]) => void;
}

export const BlendingControls = ({
  personas,
  blendRatios,
  onBlendChange,
}: BlendingControlsProps) => {
  return (
    <div className="space-y-6 py-6">
      {personas.map((persona) => (
        <div key={persona.id} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{persona.name}</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(blendRatios[persona.id] * 10) / 10}%
            </span>
          </div>
          <Slider
            value={[blendRatios[persona.id]]}
            onValueChange={(value) => onBlendChange(persona.id, value)}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-dreamaker-purple"
          />
        </div>
      ))}
    </div>
  );
};