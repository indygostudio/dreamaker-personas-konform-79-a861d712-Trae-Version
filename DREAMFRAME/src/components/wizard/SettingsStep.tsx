
import React, { useState, useRef } from "react";
import { useStoryWizard } from "../../contexts/StoryWizardContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Plus, Upload, X, Camera, Image } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { generateImageFromPrompt } from "../../services/imageGenerationService";
import { toast } from "sonner";

const aspectRatios = [
  { value: "16:9", label: "16:9" },
  { value: "1:1", label: "1:1" },
  { value: "9:16", label: "9:16" }
];

const videoStyles = [
  { value: "None", label: "None" },
  { value: "Cinematic", label: "Cinematic" },
  { value: "Scribble", label: "Scribble" },
  { value: "Film Noir", label: "Film Noir" }
];

interface CharacterCardProps {
  character: any;
  onRemove: () => void;
  onUpdate: (updates: any) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onRemove, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...character, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleGenerateImage = async () => {
    if (!character.name) {
      toast.error("Please provide a character name first");
      return;
    }
    
    try {
      setIsGenerating(true);
      const prompt = `Portrait of ${character.name}${character.description ? ` who is ${character.description}` : ""}, cinematic lighting, professional photo`;
      const imageUrl = await generateImageFromPrompt(prompt, "runway-gen4");
      onUpdate({ ...character, imageUrl });
      toast.success("Character image generated!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card className="bg-[#1a1a1a] border-[#333] relative">
      <CardContent className="p-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 text-gray-400 hover:text-white bg-[#222] hover:bg-[#333] rounded-full h-6 w-6 p-1 z-10"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="flex flex-col items-center">
          <div className="mb-3 w-full aspect-square bg-[#222] rounded-md flex items-center justify-center text-gray-400 relative overflow-hidden">
            {character.imageUrl ? (
              <>
                <img 
                  src={character.imageUrl} 
                  alt={character.name} 
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/80"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Avatar className="h-16 w-16 bg-[#333] mb-2">
                    <AvatarFallback className="bg-[#333] text-gray-400">
                      {character.name ? character.name.charAt(0).toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs border-[#444] bg-[#333] hover:bg-[#444]"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-3 w-3 mr-1" /> Upload
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs border-[#444] bg-[#333] hover:bg-[#444]"
                      onClick={handleGenerateImage}
                      disabled={isGenerating}
                    >
                      <Camera className="h-3 w-3 mr-1" /> {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload}
            />
          </div>
          
          <Input
            value={character.name}
            onChange={(e) => onUpdate({ ...character, name: e.target.value })}
            placeholder="Character Name"
            className="bg-[#222] border-[#333] text-white mb-2"
          />
          
          <Textarea
            value={character.description}
            onChange={(e) => onUpdate({ ...character, description: e.target.value })}
            placeholder="Brief character description"
            className="bg-[#222] border-[#333] text-white text-sm resize-none"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const SettingsStep: React.FC = () => {
  const { wizardData, updateWizardData } = useStoryWizard();
  
  const addCharacter = () => {
    const newCharacter = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      imageUrl: null
    };
    
    updateWizardData({
      characters: [...wizardData.characters, newCharacter]
    });
  };
  
  const updateCharacter = (id: string, updates: any) => {
    updateWizardData({
      characters: wizardData.characters.map(char => 
        char.id === id ? { ...char, ...updates } : char
      )
    });
  };
  
  const removeCharacter = (id: string) => {
    updateWizardData({
      characters: wizardData.characters.filter(char => char.id !== id)
    });
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Settings Panel */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
          
          <Card className="bg-[#1a1a1a] border-[#333]">
            <CardContent className="p-6 space-y-6">
              {/* Project Name field */}
              <div>
                <Label htmlFor="project-name" className="text-gray-400 font-normal mb-2 block">
                  PROJECT NAME<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="project-name"
                  value={wizardData.projectName || wizardData.title}
                  onChange={(e) => updateWizardData({ projectName: e.target.value })}
                  placeholder="Heavenly Heist"
                  className="bg-[#222] border-[#333] focus:border-[#0047FF] text-white"
                />
              </div>
              
              {/* Aspect Ratio selection */}
              <div>
                <Label className="text-gray-400 font-normal mb-2 block">ASPECT RATIO</Label>
                <div className="flex gap-4">
                  {aspectRatios.map(ratio => (
                    <div key={ratio.value} className="text-center">
                      <Toggle
                        pressed={wizardData.aspectRatio === ratio.value}
                        onPressedChange={() => updateWizardData({ aspectRatio: ratio.value as any })}
                        className={`w-16 h-12 border-2 ${
                          wizardData.aspectRatio === ratio.value 
                            ? "border-[#0047FF]" 
                            : "border-[#333]"
                        } bg-[#222] flex items-center justify-center mb-1`}
                      >
                        {ratio.value === "16:9" && (
                          <div className="w-10 h-6 bg-gray-600 rounded-sm"></div>
                        )}
                        {ratio.value === "1:1" && (
                          <div className="w-6 h-6 bg-gray-600 rounded-sm"></div>
                        )}
                        {ratio.value === "9:16" && (
                          <div className="w-6 h-10 bg-gray-600 rounded-sm"></div>
                        )}
                      </Toggle>
                      <span className="text-gray-400 text-sm">{ratio.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Video Style selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-400 font-normal">VIDEO STYLE</Label>
                  <Button variant="link" className="text-gray-400 text-xs p-0 h-auto">
                    View All ›
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {videoStyles.map(style => (
                    <div key={style.value} className="text-center">
                      <Toggle
                        pressed={wizardData.videoStyle === style.value}
                        onPressedChange={() => updateWizardData({ videoStyle: style.value })}
                        className={`w-full aspect-square ${
                          wizardData.videoStyle === style.value 
                            ? "border-[#0047FF]" 
                            : "border-[#333]"
                        } border-2 bg-[#222] flex items-center justify-center rounded-md mb-1`}
                      >
                        {style.value === "None" && (
                          <div className="w-8 h-0.5 bg-gray-400"></div>
                        )}
                        {style.value === "Cinematic" && (
                          <div className="w-full h-full bg-[url('/public/lovable-uploads/433cc313-dc28-4193-a99c-ce08084e855c.png')] bg-cover bg-center rounded-sm"></div>
                        )}
                        {style.value === "Scribble" && (
                          <div className="w-full h-full bg-[url('/public/lovable-uploads/61050ea8-9eed-4182-abb1-cb392985460e.png')] bg-cover bg-center rounded-sm"></div>
                        )}
                        {style.value === "Film Noir" && (
                          <div className="w-full h-full bg-[url('/public/lovable-uploads/991a0a83-ec36-4668-8feb-4094af8d62d5.png')] bg-cover bg-center rounded-sm"></div>
                        )}
                      </Toggle>
                      <span className="text-gray-400 text-xs">{style.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Style Reference upload */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-gray-400 font-normal">STYLE REFERENCE</Label>
                  <div className="text-gray-600 text-xs bg-[#222] rounded-full w-4 h-4 flex items-center justify-center">?</div>
                </div>
                
                <Card className="bg-[#222] border-[#333] border-dashed">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center text-gray-400">
                    <Upload className="h-6 w-6 mb-2" />
                    <p className="text-sm mb-1">Drag image here</p>
                    <p className="text-xs">Or upload a file</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Cinematic Inspiration field */}
              <div>
                <Label htmlFor="cinematic-inspiration" className="text-gray-400 font-normal mb-2 block">
                  CINEMATIC INSPIRATION
                </Label>
                <Input
                  id="cinematic-inspiration"
                  value={wizardData.cinematicInspiration || ""}
                  onChange={(e) => updateWizardData({ cinematicInspiration: e.target.value })}
                  placeholder='E.g., "Retro, gritty, eclectic, stylish, noir..."'
                  className="bg-[#222] border-[#333] focus:border-[#0047FF] text-white"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Cast Panel */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4">
            {/* Add Character Card */}
            <Card className="bg-[#1a1a1a] border-[#333] border-dashed h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[250px] cursor-pointer" onClick={addCharacter}>
                <div className="flex flex-col items-center justify-center p-4">
                  <Plus className="h-10 w-10 text-gray-400 mb-4" />
                  <span className="text-gray-400 text-base">Add character</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Character Cards */}
            {wizardData.characters.map(character => (
              <CharacterCard
                key={character.id}
                character={character}
                onRemove={() => removeCharacter(character.id)}
                onUpdate={(updates) => updateCharacter(character.id, updates)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsStep;
