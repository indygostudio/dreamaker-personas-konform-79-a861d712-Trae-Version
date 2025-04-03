
import React, { useEffect } from "react";
import { useStoryWizard } from "../../contexts/StoryWizardContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, Info, Play, Edit, File, FileEdit } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface SceneCardProps {
  scene: {
    id: string;
    description: string;
    duration: number;
    prompt?: string;
  };
  index: number;
  onEdit: (id: string) => void;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, index, onEdit }) => {
  return (
    <Card className="bg-[#1a1a1a] border-[#333] mb-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4 border-b border-[#333]">
          <div className="flex items-center">
            <div className="bg-[#222] text-white p-2 rounded mr-3">
              <File className="h-5 w-5" />
            </div>
            <h3 className="text-white font-medium">Scene {index + 1} - {scene.description.split('.')[0]}</h3>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={() => onEdit(scene.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 border-b border-[#333]">
          <div className="flex items-center text-gray-400 text-sm mb-2">
            <Info className="h-4 w-4 mr-1" /> SCENE DESCRIPTION
          </div>
          <p className="text-gray-200 text-sm">{scene.description}</p>
        </div>
        
        {scene.prompt && (
          <div className="p-4">
            <div className="flex items-center text-gray-400 text-sm mb-2">
              <FileEdit className="h-4 w-4 mr-1" /> PROMPT
            </div>
            <p className="text-gray-200 text-sm">{scene.prompt}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const BreakdownStep: React.FC = () => {
  const { wizardData, updateWizardData, generateScenesFromStoryline, isLoading } = useStoryWizard();
  
  useEffect(() => {
    // If we don't have scenes yet and we have a storyline, generate scenes
    if (wizardData.scenes.length === 0 && wizardData.storyline.length > 0) {
      generateScenesFromStoryline();
    }
  }, []);
  
  const editScene = (id: string) => {
    // For this example, we'll just log the edit action
    console.log("Edit scene:", id);
  };
  
  const regenerateScenes = () => {
    generateScenesFromStoryline();
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Breakdown</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <Card className="bg-[#1a1a1a] border-[#333] mb-6">
            <CardContent className="p-6">
              <h3 className="uppercase text-gray-400 text-sm font-medium mb-3">SYNOPSIS</h3>
              <Textarea
                value={wizardData.synopsis || wizardData.storyline.split('.').slice(0, 3).join('.') + '.'}
                onChange={(e) => updateWizardData({ synopsis: e.target.value })}
                className="bg-transparent border-[#333] focus:border-[#0047FF] min-h-[100px] text-white resize-none"
                placeholder="A brief synopsis of your story"
                rows={5}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="uppercase text-gray-400 text-sm font-medium">SCENE BREAKDOWN</h3>
            <Button
              variant="outline"
              className="text-white border-[#333] hover:bg-[#333]"
              onClick={regenerateScenes}
              disabled={isLoading}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {isLoading ? "Generating..." : "Regenerate Scenes"}
            </Button>
          </div>
          
          <Separator className="bg-[#333] mb-6" />
          
          {wizardData.scenes.length === 0 ? (
            <Card className="bg-[#1a1a1a] border-[#333] p-6 text-center">
              <p className="text-gray-400 mb-4">No scenes have been generated yet</p>
              <Button 
                variant="outline" 
                className="text-white border-[#333] hover:bg-[#333]"
                onClick={generateScenesFromStoryline}
                disabled={isLoading}
              >
                <Wand2 className="h-4 w-4 mr-2" /> Generate Scenes
              </Button>
            </Card>
          ) : (
            <div>
              {wizardData.scenes.map((scene, index) => (
                <SceneCard
                  key={scene.id}
                  scene={scene}
                  index={index}
                  onEdit={editScene}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreakdownStep;
