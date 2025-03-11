
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Node } from "@xyflow/react";
import { NodeData, NodeParameter } from "@/types/mindmap";

interface ParameterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNode: Node<NodeData> | null;
  onParameterChange: (nodeId: string, paramName: string, value: number | string) => void;
}

export const ParameterPanel = ({ 
  open, 
  onOpenChange, 
  selectedNode, 
  onParameterChange 
}: ParameterPanelProps) => {
  if (!selectedNode) return null;

  // Default parameters if none exist
  const parameters = selectedNode.data.parameters || {
    "Intelligence": 70,
    "Creativity": 65,
    "Emotion": 80,
    "Logic": 75,
    "Memory": 60
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {typeof selectedNode.data.label === 'string' 
              ? selectedNode.data.label 
              : 'Node Parameters'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {Object.entries(parameters).map(([name, value]) => (
            <div key={name} className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor={name}>{name}</Label>
                <span className="text-sm">{value}</span>
              </div>
              <Slider
                id={name}
                defaultValue={[typeof value === 'number' ? value : 50]}
                max={100}
                step={1}
                onValueChange={(vals) => {
                  onParameterChange(selectedNode.id, name, vals[0]);
                }}
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
