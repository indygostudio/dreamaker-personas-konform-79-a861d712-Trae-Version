import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Plus, Sparkles, Clock } from "lucide-react";
import { toast } from "sonner";
import { useStoryboard } from "../../contexts/StoryboardContext";
import { generateScenesFromStory } from "../../utils/storyUtils";
import { generatePromptForScene } from "../../utils/promptUtils";

interface CreateStoryFormProps {
  onStoryCreated?: () => void;
}

const CreateStoryForm: React.FC<CreateStoryFormProps> = ({ onStoryCreated }) => {
  const { activeProject, setActiveScene, dispatch } = useStoryboard();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("2");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingStory, setIsCreatingStory] = useState(false);

  const handleCreateStory = async () => {
    if (!activeProject) return;
    if (!title.trim()) {
      toast.error("Please enter a story title");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a story description");
      return;
    }

    setIsCreatingStory(true);
    
    try {
      console.log("Creating story with description:", description.trim());
      
      // Generate a story ID first
      const storyId = crypto.randomUUID();
      
      // Dispatch with the ID included
      dispatch({
        type: "ADD_STORY",
        payload: {
          projectId: activeProject.id,
          title: title.trim(),
          description: description.trim(),
          id: storyId
        }
      });
      
      console.log("Story created with ID:", storyId);
      
      const durationInMinutes = parseFloat(duration) || 2;
      const scenes = generateScenesFromStory(description.trim(), durationInMinutes);
      
      console.log("Generated scenes:", scenes);
      
      if (scenes.length === 0) {
        console.warn("No scenes were generated from the description");
        toast.warning("No scenes could be generated from your description. Try adding more details.");
      }
      
      for (const scene of scenes) {
        const generatedPrompt = generatePromptForScene(scene.description);
        
        console.log("Adding scene:", scene.description);
        console.log("Generated prompt:", generatedPrompt);
        
        dispatch({
          type: "ADD_SCENE",
          payload: {
            projectId: activeProject.id,
            storyId: storyId,
            description: scene.description,
            durationInSeconds: scene.durationInSeconds,
            prompt: generatedPrompt
          }
        });
      }
      
      const newStory = activeProject.stories.find(story => story.id === storyId);
      
      if (newStory) {
        setActiveScene(newStory);
        toast.success(`Story created with ${scenes.length} scenes!`);
        
        if (onStoryCreated) {
          onStoryCreated();
        }
      } else {
        console.error("Could not find newly created story");
        toast.error("Error accessing the created story");
      }

      setTitle("");
      setDescription("");
      setDuration("2");
    } catch (error) {
      console.error("Error creating story:", error);
      toast.error("Failed to create story. Please try again.");
    } finally {
      setIsCreatingStory(false);
    }
  };

  const handleGenerateStory = async () => {
    if (!activeProject) return;
    
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const themes = [
        "adventure in an ancient civilization",
        "journey through a futuristic city",
        "discovery in a magical forest",
        "exploration of an underwater kingdom",
        "quest in a parallel dimension"
      ];
      
      const characters = [
        "a curious archaeologist",
        "a determined scientist",
        "a lost traveler",
        "a mystical being",
        "childhood friends"
      ];
      
      const plots = [
        "uncovers a mysterious artifact",
        "discovers a hidden truth",
        "faces an unexpected challenge",
        "embarks on a life-changing quest",
        "must solve an ancient riddle"
      ];
      
      const endings = [
        "leading to a profound realization",
        "changing their perspective forever",
        "revealing their true destiny",
        "bringing balance to their world",
        "opening the door to new possibilities"
      ];
      
      const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
      const selectedCharacter = characters[Math.floor(Math.random() * characters.length)];
      const selectedPlot = plots[Math.floor(Math.random() * plots.length)];
      const selectedEnding = endings[Math.floor(Math.random() * endings.length)];
      
      const generatedTitle = `The ${selectedTheme.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}`;
      
      const generatedDescription = 
        `${selectedCharacter.charAt(0).toUpperCase() + selectedCharacter.slice(1)} ${selectedPlot} during a ${selectedTheme}. ` +
        `The journey is filled with breathtaking sights and unexpected encounters. ` +
        `As they delve deeper into this world, they discover hidden secrets and face challenging obstacles. ` +
        `Each step brings them closer to the truth, ${selectedEnding}.`;
      
      setTitle(generatedTitle);
      setDescription(generatedDescription);
      
      toast.success("Story generated! You can edit it before saving.");
    } catch (error) {
      toast.error("Failed to generate story. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium mb-4 text-white">Create New Story</h3>
      
      <div className="space-y-2">
        <label className="text-sm text-gray-300">Story Title</label>
        <Input
          placeholder="Enter story title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-black/50 border-white/10 text-white placeholder:text-gray-400"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-gray-300">Story Description</label>
        <Textarea
          placeholder="Enter story description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="bg-black/50 border-white/10 text-white resize-none placeholder:text-gray-400"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-gray-300 flex items-center gap-1">
          <Clock className="h-4 w-4" /> Total Duration (minutes)
        </label>
        <Input
          type="number"
          min="0.5"
          max="60"
          step="0.5"
          placeholder="Duration in minutes"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="bg-black/50 border-white/10 text-white placeholder:text-gray-400"
        />
        <p className="text-xs text-gray-400">
          {parseFloat(duration) === 4 ? "Perfect for a music video!" : 
           parseFloat(duration) <= 1 ? "Short format (e.g., TikTok, teaser)" :
           parseFloat(duration) <= 3 ? "Standard short video" :
           parseFloat(duration) <= 10 ? "Extended format (e.g., music video, short film)" :
           "Long format (e.g., documentary, film)"}
        </p>
      </div>
      
      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleCreateStory}
          className="flex-1 bg-[#FFB703] hover:bg-[#FF9500] text-black font-medium"
          disabled={isCreatingStory}
        >
          {isCreatingStory ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-spin" /> Creating Story...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Create Story
            </>
          )}
        </Button>
        
        <Button
          onClick={handleGenerateStory}
          variant="outline"
          className="flex-1 bg-black/70 border-white/10 hover:bg-black/90 text-white"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Wand2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" /> Generate Ideas
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateStoryForm;
