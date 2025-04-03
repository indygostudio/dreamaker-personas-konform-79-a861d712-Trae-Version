
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { generatePromptVariations } from "../utils/promptUtils";
import { 
  PromptVariation,
  subjectMotionOptions,
  sceneMotionOptions,
  cameraMotionOptions,
  styleDescriptorOptions
} from "../types/promptTypes";
import { Loader2 } from "lucide-react";
import MotionDropdown from "./MotionDropdown";
import { useAIService } from "../contexts/AIServiceContext";

interface PromptGeneratorProps {
  onPromptsGenerated: (prompts: PromptVariation[], basePrompt: string) => void;
}

const PromptGenerator = ({ onPromptsGenerated }: PromptGeneratorProps) => {
  const [basePrompt, setBasePrompt] = useState("");
  const [subjectMotion, setSubjectMotion] = useState("");
  const [sceneMotion, setSceneMotion] = useState("");
  const [cameraMotion, setCameraMotion] = useState("");
  const [styleDescriptors, setStyleDescriptors] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { selectedService } = useAIService();

  const handleGenerate = () => {
    if (!basePrompt.trim()) {
      toast.error("Please enter a base prompt first!");
      return;
    }

    setIsGenerating(true);
    
    // Simulate a bit of processing time
    setTimeout(() => {
      try {
        const variations = generatePromptVariations({
          basePrompt,
          subjectMotion,
          sceneMotion,
          cameraMotion,
          styleDescriptors,
          serviceId: selectedService.id
        });
        
        onPromptsGenerated(variations, basePrompt);
        toast.success(`Prompts generated for ${selectedService.name}!`);
      } catch (error) {
        toast.error("Failed to generate prompts. Please try again.");
        console.error(error);
      } finally {
        setIsGenerating(false);
      }
    }, 800);
  };

  const handleClear = () => {
    setBasePrompt("");
    setSubjectMotion("");
    setSceneMotion("");
    setCameraMotion("");
    setStyleDescriptors("");
    onPromptsGenerated([], "");
    toast.info("Form cleared!");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Create Your Prompt</h2>
      <p className="text-gray-400 text-sm">Using {selectedService.name} format</p>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="basePrompt" className="text-md mb-2 block">
            Base Prompt <span className="text-rose-400">*</span>
          </Label>
          <Textarea 
            id="basePrompt"
            placeholder="Describe the essential motion (e.g., 'A person walking through a forest')"
            value={basePrompt}
            onChange={(e) => setBasePrompt(e.target.value)}
            className="bg-slate-700/60 border-slate-600 h-24"
          />
        </div>

        <MotionDropdown
          label="Subject Motion"
          id="subjectMotion"
          placeholder="How the subject moves"
          options={subjectMotionOptions}
          value={subjectMotion}
          onChange={setSubjectMotion}
        />

        <MotionDropdown
          label="Scene Motion"
          id="sceneMotion"
          placeholder="How the scene or environment moves"
          options={sceneMotionOptions}
          value={sceneMotion}
          onChange={setSceneMotion}
        />

        <MotionDropdown
          label="Camera Motion"
          id="cameraMotion"
          placeholder="How the camera moves"
          options={cameraMotionOptions}
          value={cameraMotion}
          onChange={setCameraMotion}
        />

        <MotionDropdown
          label="Style Descriptors"
          id="styleDescriptors"
          placeholder="Visual style"
          options={styleDescriptorOptions}
          value={styleDescriptors}
          onChange={setStyleDescriptors}
        />
      </div>

      <div className="flex gap-4 pt-2">
        <Button 
          onClick={handleGenerate} 
          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Prompts"
          )}
        </Button>
        <Button 
          onClick={handleClear} 
          variant="outline" 
          className="flex-1 border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          Clear
        </Button>
      </div>

      <Card className="bg-purple-900/40 border-purple-500/30 mt-6">
        <CardContent className="p-4 text-sm">
          <p className="text-gray-300">
            <span className="font-semibold text-purple-300">Pro Tip:</span> Start with a simple base prompt and select preset options or enter your own custom descriptions. Combine different motion types for more creative results.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptGenerator;
