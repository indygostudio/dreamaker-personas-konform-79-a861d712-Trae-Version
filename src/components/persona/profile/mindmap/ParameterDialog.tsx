
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

interface Parameter {
  name: string;
  value: number;
  description?: string;
}

interface ParameterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  parameters: Parameter[];
}

export const ParameterDialog = ({ open, onOpenChange, title, parameters }: ParameterDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-black/90 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {parameters.map((param, index) => (
            <div key={param.name}>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-gray-200">
                    {param.name}
                  </label>
                  <span className="text-sm text-gray-400">{param.value}%</span>
                </div>
                <Slider
                  defaultValue={[param.value]}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled
                />
                {param.description && (
                  <p className="text-xs text-gray-400 mt-1">{param.description}</p>
                )}
              </div>
              {index < parameters.length - 1 && (
                <Separator className="my-4 bg-gray-800" />
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
