
import React, { useState, useEffect } from "react";
import { useStoryWizard } from "../../contexts/StoryWizardContext";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Wand2 } from "lucide-react";

interface StorylineCardProps {
  title: string;
  description: string;
  tags: string[];
  isSelected: boolean;
  onClick: () => void;
}

const StorylineCard: React.FC<StorylineCardProps> = ({ 
  title, 
  description, 
  tags, 
  isSelected, 
  onClick 
}) => {
  return (
    <Card 
      className={`bg-[#1a1a1a] border-[#333] hover:border-[#555] cursor-pointer transition-all mb-4 ${
        isSelected ? "border-[#0047FF]" : ""
      }`} 
      onClick={onClick}
    >
      <CardContent className="p-4">
        <h3 className="text-white font-medium mb-1">{title}</h3>
        <p className="text-gray-400 text-sm mb-3">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-[#222] text-gray-300">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const StorylineStep: React.FC = () => {
  const { wizardData, updateWizardData } = useStoryWizard();
  const [isGenerating, setIsGenerating] = useState(false);

  // Import concept into storyline when component mounts
  useEffect(() => {
    // If storyline is empty but concept is not, use concept as storyline
    if (!wizardData.storyline && wizardData.concept) {
      updateWizardData({ storyline: wizardData.concept });
      
      // Automatically trigger the full storyline generation after a short delay
      setTimeout(() => {
        generateFullStoryline();
      }, 500);
    }
  }, []);

  // Mock alternative storylines
  const mockAlternatives = [
    {
      id: "1",
      title: "Heavenly Heist",
      description: "Angels plot a comedic heist to recover stolen halos from a mischievous demon.",
      tags: ["Comedy", "Heist", "Angelic Antics", "Fantasy"]
    },
    {
      id: "2",
      title: "Angelic Showdown",
      description: "In a fantasy realm, angels and demons engage in a musical battle for celestial supremacy.",
      tags: ["Fantasy", "Musical Battle", "Angels Vs Demons", "Comedy"]
    }
  ];
  
  const setSelectedStoryline = (id: string) => {
    updateWizardData({ selectedStorylineId: id });
    
    // Find the storyline and update the main storyline
    const selected = wizardData.alternativeStorylines.find(s => s.id === id);
    if (selected) {
      updateWizardData({ storyline: selected.description });
    }
  };
  
  // Generate alternative storylines
  const generateAlternatives = () => {
    setIsGenerating(true);
    
    // Mock generation process
    setTimeout(() => {
      updateWizardData({ 
        alternativeStorylines: mockAlternatives,
        selectedStorylineId: mockAlternatives[0].id,
        storyline: mockAlternatives[0].description
      });
      setIsGenerating(false);
    }, 1500);
  };
  
  // Generate full storyline
  const generateFullStoryline = () => {
    if (!wizardData.storyline) return;
    
    setIsGenerating(true);
    
    // Mock full storyline generation
    setTimeout(() => {
      updateWizardData({ 
        storyline: `In a whimsical heaven filled with clouds and golden gates, a group of quirky angels discover that their precious halos have been stolen by a mischievous demon named Zark. Led by the charismatic and slightly clumsy angel, Gabriel, the team devises a hilariously elaborate plan to infiltrate the demon's lair, which is humorously depicted as a rundown nightclub in the underworld.

As the angels don disguises and practice their dance moves, the video alternates between comedic training montages and suspenseful moments where they almost get caught by Zark's bumbling henchmen. The juxtaposition of their lofty ideals and the lowly environment of the demon's domain creates a playful tension. Throughout the video, the angels showcase their unique talents, such as Gabriel's awkward charm and Seraphina's unexpected breakdancing skills, all while maintaining a dramatic undertone of urgency.

The climax unfolds during a chaotic dance-off between the angels and demons, where they must outshine Zark and his crew to retrieve the halos. With unexpected twists, mishaps, and a heartwarming message about teamwork and redemption, the angels ultimately succeed, reclaiming their halos in a burst of confetti and celestial light. The music video ends with the angels flying back to heaven, their halos shining brightly, as they celebrate their victory with a humorous dance party in the clouds.`
      });
      setIsGenerating(false);
    }, 3000);
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">{wizardData.title || "Your Story"}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="bg-[#1a1a1a] border-[#333] mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Badge className="bg-[#0047FF] text-white font-semibold mr-2">Storyline</Badge>
                  <div className="flex items-center text-sm text-gray-400">
                    {wizardData.genre.map((genre, i) => (
                      <span key={genre}>
                        {genre}{i < wizardData.genre.length - 1 ? " • " : ""}
                      </span>
                    ))}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-gray-300 hover:text-white border-[#333] hover:bg-[#333]"
                  onClick={generateFullStoryline}
                  disabled={isGenerating || !wizardData.storyline}
                >
                  <Wand2 className="h-4 w-4 mr-1" /> 
                  {isGenerating ? "Generating..." : "Expand Storyline"}
                </Button>
              </div>
              
              <Textarea
                placeholder="Your full storyline will appear here"
                value={wizardData.storyline}
                onChange={(e) => updateWizardData({ storyline: e.target.value })}
                className="bg-transparent border-[#333] focus:border-[#0047FF] min-h-[400px] text-white resize-none"
                rows={16}
              />
              <div className="flex justify-end text-sm text-gray-400 mt-2">
                <span>{wizardData.storyline.length} / 2000</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">ALTERNATIVE STORYLINES</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white"
              onClick={generateAlternatives}
              disabled={isGenerating}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? "animate-spin" : ""}`} /> 
              {isGenerating ? "Generating..." : "Generate more"}
            </Button>
          </div>
          
          {wizardData.alternativeStorylines.length === 0 ? (
            <Card className="bg-[#1a1a1a] border-[#333] p-6 text-center">
              <p className="text-gray-400 mb-4">No alternative storylines yet</p>
              <Button 
                variant="outline" 
                className="text-white border-[#333] hover:bg-[#333]"
                onClick={generateAlternatives}
                disabled={isGenerating}
              >
                <Wand2 className="h-4 w-4 mr-2" /> Generate Storylines
              </Button>
            </Card>
          ) : (
            <>
              {wizardData.alternativeStorylines.map((storyline) => (
                <StorylineCard
                  key={storyline.id}
                  title={storyline.title}
                  description={storyline.description}
                  tags={storyline.tags}
                  isSelected={storyline.id === wizardData.selectedStorylineId}
                  onClick={() => setSelectedStoryline(storyline.id)}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorylineStep;
