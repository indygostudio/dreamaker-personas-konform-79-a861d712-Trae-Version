
import React, { useState } from "react";
import { useStoryWizard } from "../../contexts/StoryWizardContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Upload, RefreshCw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const genreOptions = [
  "Comedy", "Drama", "Action", "Horror", "Romance", "Fantasy", 
  "Science Fiction", "Thriller", "Mystery", "Adventure", "Crime",
  "Animation", "Documentary", "Musical", "Western", "Superhero"
];

const formatOptions = ["Custom", "Short Film", "Commercial", "Music Video", "Vlog"];

const speechOptions = [
  "Humorous", "Dramatic", "Light-hearted", "Serious", 
  "Suspenseful", "Satirical", "Emotional", "Dark"
];

interface ExampleCardProps {
  title: string;
  description: string;
  onClick: () => void;
  type: "logline" | "storyline";
  selected?: boolean;
}

const ExampleCard: React.FC<ExampleCardProps> = ({ title, description, onClick, type, selected }) => {
  return (
    <Card 
      className={`dark-glass-card hover:bg-black/60 cursor-pointer transition-all ${
        selected ? "border-[#9b87f5] border-2 shadow-[0_0_10px_rgba(155,135,245,0.5)]" : "border-white/10"
      } mb-4`} 
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white font-medium">{title}</h3>
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{description}</p>
          </div>
          <Badge variant="glass" className={type === "logline" ? "bg-black/60" : "bg-[#0047FF]"}>
            {type === "logline" ? "LOGLINE" : "STORYLINE"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

const ConceptStep: React.FC = () => {
  const { wizardData, updateWizardData } = useStoryWizard();
  const [conceptMode, setConceptMode] = useState<"ai" | "manual">("ai");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedExample, setSelectedExample] = useState<number | null>(null);
  
  const examples = [
    {
      title: "Hidden Romance",
      description: "A forbidden romance amidst a political thriller threatens to change the course of history.",
      type: "logline" as const
    },
    {
      title: "Jungle Echoes",
      description: "An explorer, lost in a remote jungle, discovers an ancient tribe hidden from the outside world. As he navigates their customs and beliefs, he uncovers a mystical connection to his own past.",
      type: "storyline" as const
    },
    {
      title: "Mindscapes",
      description: "An artist's psychedelic paintings unlock portals to alternate dimensions, merging surreal adventure with mind-bending exploration.",
      type: "logline" as const
    }
  ];
  
  const selectExample = (example: typeof examples[0], index: number) => {
    updateWizardData({
      title: example.title,
      concept: example.description,
      genre: ["Fantasy", "Adventure"]
    });
    setSelectedExample(index);
  };
  
  const handleGenreToggle = (genre: string) => {
    const currentGenres = [...wizardData.genre];
    if (currentGenres.includes(genre)) {
      updateWizardData({ genre: currentGenres.filter(g => g !== genre) });
    } else {
      updateWizardData({ genre: [...currentGenres, genre] });
    }
  };
  
  const handleSpeechToggle = (style: string) => {
    const currentStyles = [...wizardData.speechStyle];
    if (currentStyles.includes(style)) {
      updateWizardData({ speechStyle: currentStyles.filter(s => s !== style) });
    } else {
      updateWizardData({ speechStyle: [...currentStyles, style] });
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto bg-black/70 backdrop-blur-xl p-6 rounded-lg border border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card 
              className={`dark-glass-card border-white/10 hover:bg-black/60 cursor-pointer transition-all ${
                conceptMode === "ai" 
                  ? "border-[#9b87f5] border-2 shadow-[0_0_10px_rgba(155,135,245,0.5)]" 
                  : ""
              }`} 
              onClick={() => setConceptMode("ai")}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`rounded-full p-3 ${
                  conceptMode === "ai" 
                    ? "bg-[#9b87f5] bg-opacity-20" 
                    : "bg-[#0047FF] bg-opacity-20"
                }`}>
                  <Wand2 className={`h-6 w-6 ${
                    conceptMode === "ai" ? "text-[#9b87f5]" : "text-[#0047FF]"
                  }`} />
                </div>
                <div>
                  <h3 className="text-white font-medium">WRITE WITH AI</h3>
                  <p className="text-gray-400 text-sm">AI involvement in script editing and writing</p>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className={`dark-glass-card border-white/10 hover:bg-black/60 cursor-pointer transition-all ${
                conceptMode === "manual" 
                  ? "border-[#9b87f5] border-2 shadow-[0_0_10px_rgba(155,135,245,0.5)]" 
                  : ""
              }`} 
              onClick={() => setConceptMode("manual")}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`rounded-full p-3 ${
                  conceptMode === "manual" 
                    ? "bg-[#9b87f5] bg-opacity-20" 
                    : "bg-black/70"
                }`}>
                  <Upload className={`h-6 w-6 ${
                    conceptMode === "manual" ? "text-[#9b87f5]" : "text-white"
                  }`} />
                </div>
                <div>
                  <h3 className="text-white font-medium">UPLOAD YOUR OWN</h3>
                  <p className="text-gray-400 text-sm">Visualize your idea or script as written</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="dark-glass-card border-white/10 mb-6">
            <CardContent className="p-6">
              <Textarea
                placeholder="Describe your Concept"
                value={wizardData.concept}
                onChange={(e) => updateWizardData({ concept: e.target.value })}
                className="dark-glass-input border-white/10 focus:border-[#9b87f5] min-h-[200px] text-white resize-both"
                rows={8}
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span className="italic">Describe your movie concept or paste a script</span>
                <span>{wizardData.concept.length} / 12000</span>
              </div>
            </CardContent>
          </Card>
          
          <Collapsible 
            open={isSettingsOpen} 
            onOpenChange={setIsSettingsOpen}
            className="mb-6"
          >
            <Card className="dark-glass-card border-white/10">
              <CollapsibleTrigger asChild>
                <div className="p-6 flex justify-between items-center cursor-pointer hover:bg-black/60">
                  <h3 className="text-white font-medium">Optional settings</h3>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isSettingsOpen ? 'transform rotate-180' : ''}`} />
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="title" className="text-gray-400 font-normal">Title</Label>
                      </div>
                      <Input
                        id="title"
                        value={wizardData.title}
                        onChange={(e) => updateWizardData({ title: e.target.value })}
                        placeholder="Give your project a title"
                        className="dark-glass-input border-white/10 focus:border-[#9b87f5] text-white mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-gray-400 font-normal mb-2 block">Genre</Label>
                      <div className="flex flex-wrap gap-2">
                        {genreOptions.map(genre => (
                          <Toggle
                            key={genre}
                            pressed={wizardData.genre.includes(genre)}
                            onPressedChange={() => handleGenreToggle(genre)}
                            variant="outline"
                            className={`dark-glass-input border-white/10 text-gray-300 ${
                              wizardData.genre.includes(genre) 
                                ? "bg-black/70 text-white border-[#9b87f5] shadow-[0_0_8px_rgba(155,135,245,0.4)]" 
                                : ""
                            }`}
                          >
                            {genre}
                          </Toggle>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-400 font-normal mb-2 block">Format</Label>
                      <div className="flex flex-wrap gap-2">
                        {formatOptions.map(format => (
                          <Toggle
                            key={format}
                            pressed={wizardData.format === format}
                            onPressedChange={() => updateWizardData({ format })}
                            variant="outline"
                            className={`dark-glass-input border-white/10 text-gray-300 ${
                              wizardData.format === format 
                                ? "bg-black/70 text-white border-[#9b87f5] shadow-[0_0_8px_rgba(155,135,245,0.4)]" 
                                : ""
                            }`}
                          >
                            {format}
                          </Toggle>
                        ))}
                      </div>
                      {wizardData.format === "Custom" && (
                        <Input
                          value={wizardData.customFormat || ""}
                          onChange={(e) => updateWizardData({ customFormat: e.target.value })}
                          placeholder="Music Video"
                          className="dark-glass-input border-white/10 focus:border-[#9b87f5] text-white mt-3 max-w-md"
                        />
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="tone" className="text-gray-400 font-normal mb-2 block">Tone</Label>
                      <Input
                        id="tone"
                        value={wizardData.tone}
                        onChange={(e) => updateWizardData({ tone: e.target.value })}
                        placeholder="This shapes the mood and emotional impact of your story"
                        className="dark-glass-input border-white/10 focus:border-[#9b87f5] text-white"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-gray-400 font-normal mb-2 block">Speech</Label>
                      <div className="flex flex-wrap gap-2">
                        {speechOptions.map(style => (
                          <Toggle
                            key={style}
                            pressed={wizardData.speechStyle.includes(style)}
                            onPressedChange={() => handleSpeechToggle(style)}
                            variant="outline"
                            className={`dark-glass-input border-white/10 text-gray-300 ${
                              wizardData.speechStyle.includes(style) 
                                ? "bg-black/70 text-white border-[#9b87f5] shadow-[0_0_8px_rgba(155,135,245,0.4)]" 
                                : ""
                            }`}
                          >
                            {style}
                          </Toggle>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="special-requests" className="text-gray-400 font-normal">Special Requests</Label>
                      </div>
                      <Input
                        id="special-requests"
                        value={wizardData.specialRequests || ""}
                        onChange={(e) => updateWizardData({ specialRequests: e.target.value })}
                        placeholder='Anything from "80s atmosphere" to "plot twists" or "a car chase"'
                        className="dark-glass-input border-white/10 focus:border-[#9b87f5] text-white mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">EXAMPLES</h3>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
          </div>
          
          {examples.map((example, index) => (
            <ExampleCard
              key={index}
              title={example.title}
              description={example.description}
              onClick={() => selectExample(example, index)}
              type={example.type}
              selected={selectedExample === index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConceptStep;
