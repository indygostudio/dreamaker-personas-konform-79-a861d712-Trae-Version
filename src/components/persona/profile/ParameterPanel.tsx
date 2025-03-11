
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Node } from "@xyflow/react";
import { PersonaNodeData } from "@/types/mindmap";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Brain, User, Zap, Sliders } from "lucide-react";

interface ParameterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNode: Node<PersonaNodeData> | null;
  onParameterChange: (nodeId: string, paramName: string, value: number | string) => void;
}

export const ParameterPanel = ({ 
  open, 
  onOpenChange, 
  selectedNode, 
  onParameterChange 
}: ParameterPanelProps) => {
  const [localParameters, setLocalParameters] = useState<Record<string, number | string>>({});

  useEffect(() => {
    if (selectedNode) {
      setLocalParameters(selectedNode.data.parameters || {});
    }
  }, [selectedNode]);

  if (!selectedNode) return null;

  const handleSliderChange = (name: string, value: number[]) => {
    setLocalParameters(prev => ({
      ...prev,
      [name]: value[0]
    }));
    onParameterChange(selectedNode.id, name, value[0]);
  };

  const handleStringChange = (name: string, value: string) => {
    setLocalParameters(prev => ({
      ...prev,
      [name]: value
    }));
    onParameterChange(selectedNode.id, name, value);
  };

  const getNodeIcon = () => {
    switch(selectedNode.data.connectionType) {
      case 'persona':
        return <User className="w-5 h-5 text-green-400" />;
      case 'hivemind':
        return <Brain className="w-5 h-5 text-purple-400" />;
      case 'model':
        return <Zap className="w-5 h-5 text-amber-400" />;
      default:
        return <Sliders className="w-5 h-5 text-dreamaker-purple" />;
    }
  };

  const nodeLabel = typeof selectedNode.data.label === 'string' 
    ? selectedNode.data.label 
    : 'Node Parameters';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-dreamaker-purple/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-dreamaker-purple flex items-center gap-2">
            {getNodeIcon()}
            {nodeLabel} Parameters
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {selectedNode.data.personaAvatar && (
            <div className="flex justify-center mb-4">
              <img 
                src={selectedNode.data.personaAvatar} 
                alt={nodeLabel}
                className="w-16 h-16 rounded-full object-cover border-2 border-dreamaker-purple/30"
              />
            </div>
          )}
          
          {Object.entries(localParameters).map(([name, value]) => (
            <div key={name} className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor={name} className="text-gray-300">{name}</Label>
                <span className="text-sm text-dreamaker-purple">{value}</span>
              </div>
              {typeof value === 'number' ? (
                <Slider
                  id={name}
                  defaultValue={[value]}
                  value={[value as number]}
                  max={100}
                  step={1}
                  onValueChange={(vals) => handleSliderChange(name, vals)}
                  className="bg-dreamaker-purple/10"
                />
              ) : (
                <Input 
                  id={name}
                  value={value as string}
                  onChange={(e) => handleStringChange(name, e.target.value)}
                  className="bg-gray-800 border-dreamaker-purple/30"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="border-dreamaker-purple hover:bg-dreamaker-purple/20"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
