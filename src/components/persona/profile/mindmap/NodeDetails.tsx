
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

interface NodeDetailsProps {
  title: string;
  attributes: { name: string; value: number; description: string }[];
}

export const NodeDetails = ({ title, attributes }: NodeDetailsProps) => {
  return (
    <Card className="p-6 bg-black/90 border-gray-800">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="space-y-6">
        {attributes.map((param) => (
          <div key={param.name} className="space-y-2">
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
              <p className="text-xs text-gray-400">{param.description}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
