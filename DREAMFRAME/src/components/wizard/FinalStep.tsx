
import React from "react";
import { useStoryWizard } from "../../contexts/StoryWizardContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, File, FileEdit, Clock, Wand2, ImageIcon, AlignLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const FinalStep: React.FC = () => {
  const { wizardData, isLoading, loadIntoEditor } = useStoryWizard();
  
  const handleFinish = async () => {
    await loadIntoEditor();
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Ready to Create</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-[#1a1a1a] border-[#333] mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">{wizardData.title || "Untitled Project"}</h2>
                <Badge className="bg-[#0047FF]">Ready</Badge>
              </div>
              
              <p className="text-gray-300 mb-6">{wizardData.synopsis || wizardData.storyline.substring(0, 200) + "..."}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#222] p-4 rounded-lg">
                  <div className="flex items-center text-gray-400 mb-2">
                    <File className="h-4 w-4 mr-2" /> Format
                  </div>
                  <p className="text-white">
                    {wizardData.format === "Custom" 
                      ? wizardData.customFormat || "Custom Format" 
                      : wizardData.format}
                  </p>
                </div>
                
                <div className="bg-[#222] p-4 rounded-lg">
                  <div className="flex items-center text-gray-400 mb-2">
                    <FileEdit className="h-4 w-4 mr-2" /> Genre
                  </div>
                  <p className="text-white">
                    {wizardData.genre.length > 0 
                      ? wizardData.genre.join(", ") 
                      : "No genres selected"}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#222] p-4 rounded-lg">
                  <div className="flex items-center text-gray-400 mb-2">
                    <AlignLeft className="h-4 w-4 mr-2" /> Scenes
                  </div>
                  <p className="text-white">{wizardData.scenes.length}</p>
                </div>
                
                <div className="bg-[#222] p-4 rounded-lg">
                  <div className="flex items-center text-gray-400 mb-2">
                    <Clock className="h-4 w-4 mr-2" /> Duration
                  </div>
                  <p className="text-white">
                    {Math.ceil(wizardData.scenes.reduce((acc, scene) => acc + scene.duration, 0) / 60)} min
                  </p>
                </div>
                
                <div className="bg-[#222] p-4 rounded-lg">
                  <div className="flex items-center text-gray-400 mb-2">
                    <ImageIcon className="h-4 w-4 mr-2" /> Aspect Ratio
                  </div>
                  <p className="text-white">{wizardData.aspectRatio}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a1a1a] border-[#333]">
            <CardContent className="p-6">
              <h3 className="text-white font-medium mb-4">What happens next?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#0047FF] bg-opacity-20 p-2 rounded-full mr-3">
                    <CheckCircle2 className="h-5 w-5 text-[#0047FF]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Create Project</h4>
                    <p className="text-gray-400 text-sm">
                      A new project will be created with your story structure, scenes, and settings.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#0047FF] bg-opacity-20 p-2 rounded-full mr-3">
                    <CheckCircle2 className="h-5 w-5 text-[#0047FF]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Generate Prompts</h4>
                    <p className="text-gray-400 text-sm">
                      Each scene will have a carefully crafted AI prompt based on your storyline.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#0047FF] bg-opacity-20 p-2 rounded-full mr-3">
                    <CheckCircle2 className="h-5 w-5 text-[#0047FF]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Ready for Visualization</h4>
                    <p className="text-gray-400 text-sm">
                      You'll be able to generate images or videos for each scene in the editor.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-[#1a1a1a] border-[#333] mb-6">
            <CardContent className="p-6">
              <h3 className="text-white font-medium mb-4">Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-gray-400 text-sm mb-1">PROJECT NAME</h4>
                  <p className="text-white">{wizardData.projectName || wizardData.title || "Untitled Project"}</p>
                </div>
                
                <Separator className="bg-[#333]" />
                
                <div>
                  <h4 className="text-gray-400 text-sm mb-1">SCENES</h4>
                  <div className="space-y-2 mt-2 max-h-60 overflow-y-auto pr-2">
                    {wizardData.scenes.map((scene, index) => (
                      <div key={scene.id} className="bg-[#222] p-2 rounded">
                        <p className="text-white text-sm font-medium">Scene {index + 1}</p>
                        <p className="text-gray-400 text-xs line-clamp-1">{scene.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator className="bg-[#333]" />
                
                <div>
                  <h4 className="text-gray-400 text-sm mb-1">CHARACTERS</h4>
                  {wizardData.characters.length > 0 ? (
                    <div className="space-y-2 mt-2">
                      {wizardData.characters.map((character) => (
                        <div key={character.id} className="bg-[#222] p-2 rounded flex items-center">
                          {character.imageUrl ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                              <img 
                                src={character.imageUrl} 
                                alt={character.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#333] mr-2"></div>
                          )}
                          <p className="text-white text-sm">{character.name || "Unnamed Character"}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No characters defined</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button
            className="w-full bg-[#0047FF] hover:bg-[#0033CC] text-white h-12 text-lg"
            disabled={isLoading}
            onClick={handleFinish}
          >
            <Wand2 className="h-5 w-5 mr-2" />
            {isLoading ? "Loading..." : "Create in Editor"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinalStep;
