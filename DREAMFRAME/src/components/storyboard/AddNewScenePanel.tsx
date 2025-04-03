
import React, { useState } from "react";
import { useStoryboard } from "../../contexts/StoryboardContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Wand2, Layers } from "lucide-react";
import { toast } from "sonner";
import PromptGenerator from "../PromptGenerator";
import { PromptVariation } from "../../types/promptTypes";
import { generatePromptForScene } from "../../utils/promptUtils";
import { generateScenesFromStory } from "../../utils/storyUtils";
import { PromptGallery } from "../PromptGallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface AddNewScenePanelProps {
  onPromptsGenerated: (prompts: PromptVariation[], basePrompt: string) => void;
  basePrompt?: string;
  promptVariations?: PromptVariation[];
}

const AddNewScenePanel = ({ 
  onPromptsGenerated, 
  basePrompt = "", 
  promptVariations = [] 
}: AddNewScenePanelProps) => {
  const { activeProject, activeScene, dispatch } = useStoryboard();
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingScenes, setIsCreatingScenes] = useState(false);
  const [activeTab, setActiveTab] = useState("scene");

  const handleAddScene = () => {
    if (!activeProject || !activeScene) return;
    if (!description.trim()) {
      toast.error("Please enter a shot description");
      return;
    }

    dispatch({
      type: "ADD_SCENE",
      payload: {
        projectId: activeProject.id,
        storyId: activeScene.id,
        description: description.trim()
      }
    });

    setDescription("");
    toast.success("Shot added successfully!");
  };

  const handleGenerateSceneDescription = async () => {
    if (!activeProject || !activeScene) return;
    
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const shotDescriptions = [
        "The protagonist stands at the edge of a cliff, overlooking a vast alien landscape with floating islands and bioluminescent vegetation.",
        "Inside an ancient temple, light beams through cracks in the ceiling, illuminating a mysterious artifact on a pedestal.",
        "A bustling futuristic marketplace with holographic signs and diverse alien species trading exotic goods.",
        "A quiet forest clearing where magical creatures gather around a glowing pool of water under moonlight."
      ];
      
      setDescription(shotDescriptions[Math.floor(Math.random() * shotDescriptions.length)]);
      
      toast.success("Shot description generated! Edit before saving.");
    } catch (error) {
      toast.error("Failed to generate shot. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAutoCreateScenes = async () => {
    if (!activeProject || !activeScene) return;
    
    if (!activeScene.description.trim()) {
      toast.error("Scene needs a description before generating shots");
      return;
    }
    
    if (activeScene.scenes.length > 0) {
      if (!window.confirm("This will replace all existing shots. Are you sure you want to continue?")) {
        return;
      }
      
      activeScene.scenes.forEach(scene => {
        dispatch({
          type: "DELETE_SCENE",
          payload: {
            projectId: activeProject.id,
            storyId: activeScene.id,
            sceneId: scene.id
          }
        });
      });
    }
    
    setIsCreatingScenes(true);
    
    try {
      const totalDurationInMinutes = 1;
      
      const generatedScenes = generateScenesFromStory(
        activeScene.description,
        totalDurationInMinutes
      );
      
      for (const sceneInfo of generatedScenes) {
        const generatedPrompt = generatePromptForScene(sceneInfo.description);
        
        dispatch({
          type: "ADD_SCENE",
          payload: {
            projectId: activeProject.id,
            storyId: activeScene.id,
            description: sceneInfo.description,
            durationInSeconds: sceneInfo.durationInSeconds,
            prompt: generatedPrompt
          }
        });
        
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      toast.success(`Generated ${generatedScenes.length} shots successfully!`);
    } catch (error) {
      console.error("Error generating shots:", error);
      toast.error("Failed to generate shots. Please try again.");
    } finally {
      setIsCreatingScenes(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 glass-card">
          <TabsTrigger value="scene" className="data-[state=active]:bg-runway-blue data-[state=active]:text-white">
            Shot Details
          </TabsTrigger>
          <TabsTrigger value="prompt" className="data-[state=active]:bg-runway-blue data-[state=active]:text-white">
            Prompt Generator
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scene">
          <h3 className="text-lg font-medium mb-4">Add New Shot</h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="prompt-generator" className="border-b border-gray-700">
              <AccordionTrigger className="py-3 text-gray-300 hover:text-white">
                Quick Prompt Generator
              </AccordionTrigger>
              <AccordionContent>
                {promptVariations.length > 0 ? (
                  <PromptGallery 
                    basePrompt={basePrompt}
                    promptVariations={promptVariations}
                  />
                ) : (
                  <PromptGenerator onPromptsGenerated={onPromptsGenerated} />
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-gray-300 block mb-1">Shot Description</label>
              <Textarea
                placeholder="Describe what happens in this shot"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-[#222] border-[#444] resize-none"
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleAddScene}
                className="flex-1 bg-[#FFB703] hover:bg-[#FF9500] text-black"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Shot
              </Button>
              
              <Button
                onClick={handleGenerateSceneDescription}
                variant="outline"
                className="flex-1 border-gray-700 hover:bg-gray-800"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" /> Generate Shot
                  </>
                )}
              </Button>
            </div>
            
            <Button
              onClick={handleAutoCreateScenes}
              variant="outline"
              className="w-full border-gray-700 hover:bg-gray-800"
              disabled={isCreatingScenes || !activeScene?.description}
            >
              {isCreatingScenes ? (
                <>Creating Shots...</>
              ) : (
                <>
                  <Layers className="mr-2 h-4 w-4" /> Auto Create Shots
                </>
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="prompt">
          <div className="space-y-6">
            {promptVariations.length > 0 ? (
              <PromptGallery 
                basePrompt={basePrompt}
                promptVariations={promptVariations}
              />
            ) : (
              <PromptGenerator onPromptsGenerated={onPromptsGenerated} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddNewScenePanel;
