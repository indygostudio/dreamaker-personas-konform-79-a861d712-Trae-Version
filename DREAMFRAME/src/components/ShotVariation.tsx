
import { Card, CardContent } from "@/components/ui/card";
import { 
  Camera, 
  VideoIcon, 
  Move3d, 
  PanelTopClose, 
  Rocket, 
  Eye 
} from "lucide-react";

export const ShotVariation = () => {
  const variations = [
    {
      icon: <Camera className="h-8 w-8 text-purple-400" />,
      title: "Close-up Shots",
      description: "Intimate perspectives that focus on facial expressions and small details."
    },
    {
      icon: <PanelTopClose className="h-8 w-8 text-pink-400" />,
      title: "Wide Shots",
      description: "Establish location and context with expansive views of the entire scene."
    },
    {
      icon: <Move3d className="h-8 w-8 text-cyan-400" />,
      title: "Dynamic Movement",
      description: "Flowing camera work that follows action with energetic tracking shots."
    },
    {
      icon: <Eye className="h-8 w-8 text-amber-400" />,
      title: "POV Perspectives",
      description: "First-person viewpoints that immerse viewers in the character's experience."
    },
    {
      icon: <Rocket className="h-8 w-8 text-green-400" />,
      title: "Aerial Views",
      description: "Bird's-eye perspectives that reveal scale and geography of scenes."
    },
    {
      icon: <VideoIcon className="h-8 w-8 text-blue-400" />,
      title: "Specialty Techniques",
      description: "Time-lapse, slow-motion, and unique artistic interpretations."
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Shot Variations</h2>
      <p className="text-gray-300 mb-6">
        Fill in the form on the left to generate prompts with these different shot types and perspectives.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {variations.map((variation, index) => (
          <Card key={index} className="bg-slate-800/70 border-slate-700">
            <CardContent className="p-4 flex items-start space-x-4">
              <div className="mt-1">{variation.icon}</div>
              <div>
                <h3 className="font-medium text-lg">{variation.title}</h3>
                <p className="text-gray-400 text-sm">{variation.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
