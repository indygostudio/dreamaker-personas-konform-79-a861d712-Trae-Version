
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MotionDropdown from "../MotionDropdown";
import { 
  subjectMotionOptions, 
  sceneMotionOptions, 
  cameraMotionOptions, 
  styleDescriptorOptions,
  PromptInputs
} from "@/types/promptTypes";
import { generateGen4Prompt } from "@/utils/promptUtils";

interface RunwayPromptBuilderProps {
  basePrompt: string;
  onBasePromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPromptGenerated: (prompt: string) => void;
}

const RunwayPromptBuilder: React.FC<RunwayPromptBuilderProps> = ({
  basePrompt,
  onBasePromptChange,
  onPromptGenerated,
}) => {
  const [promptInputs, setPromptInputs] = useState<PromptInputs>({
    basePrompt: basePrompt,
    subjectMotion: "",
    sceneMotion: "",
    cameraMotion: "",
    styleDescriptors: ""
  });

  useEffect(() => {
    // Update base prompt when it changes from parent
    setPromptInputs(prev => ({ ...prev, basePrompt }));
  }, [basePrompt]);

  const handleMotionChange = (field: keyof PromptInputs, value: string) => {
    setPromptInputs(prev => ({ ...prev, [field]: value }));
  };

  const generateFullPrompt = () => {
    const generatedPrompt = generateGen4Prompt(promptInputs);
    onPromptGenerated(generatedPrompt);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Base Description
        </label>
        <Textarea
          value={promptInputs.basePrompt}
          onChange={onBasePromptChange}
          placeholder="Describe the core visual elements you want in your scene"
          className="bg-runway-input border-runway-glass-border resize-none"
          rows={3}
        />
      </div>

      <Tabs defaultValue="motion" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-runway-input">
          <TabsTrigger value="motion" className="data-[state=active]:bg-runway-blue data-[state=active]:text-white">
            Motion & Style
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-runway-blue data-[state=active]:text-white">
            Advanced
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="motion" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <MotionDropdown
              label="Subject Motion"
              id="subject-motion"
              placeholder="How does the subject move?"
              options={subjectMotionOptions}
              value={promptInputs.subjectMotion}
              onChange={(value) => handleMotionChange('subjectMotion', value)}
            />
            
            <MotionDropdown
              label="Environment/Scene Motion"
              id="scene-motion"
              placeholder="How does the environment react?"
              options={sceneMotionOptions}
              value={promptInputs.sceneMotion}
              onChange={(value) => handleMotionChange('sceneMotion', value)}
            />
            
            <MotionDropdown
              label="Camera Motion"
              id="camera-motion"
              placeholder="How does the camera move?"
              options={cameraMotionOptions}
              value={promptInputs.cameraMotion}
              onChange={(value) => handleMotionChange('cameraMotion', value)}
            />
            
            <MotionDropdown
              label="Visual Style"
              id="style-descriptors"
              placeholder="What's the visual style?"
              options={styleDescriptorOptions}
              value={promptInputs.styleDescriptors}
              onChange={(value) => handleMotionChange('styleDescriptors', value)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <div className="text-sm text-gray-400 mb-4">
            <p>Advanced options coming soon:</p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Lighting controls</li>
              <li>Weather effects</li>
              <li>Time of day</li>
              <li>Lens options</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      <Button
        variant="outline"
        className="w-full bg-runway-blue/20 border-runway-blue/30 hover:bg-runway-blue/30 text-white"
        onClick={generateFullPrompt}
      >
        <Wand2 className="mr-2 h-4 w-4" /> 
        Generate Structured Prompt
      </Button>
    </div>
  );
};

export default RunwayPromptBuilder;
