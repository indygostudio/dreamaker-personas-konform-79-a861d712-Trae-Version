import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Plus, Sparkles, Clock } from "lucide-react";
import { toast } from "sonner";
import { useStoryboard } from "@/contexts/StoryboardContext";
import { generateScenesFromStory } from "@/utils/storyUtils";
import { generatePromptForScene } from "@/utils/promptUtils";

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
      toast.error("Failed to create story");
    } finally {
      setIsCreatingStory(false);
    }
  };

  const handleGenerateStory = async () => {
    if (!title.trim()) {
      toast.error("Please enter a story title first");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // This is a simplified version that just generates a basic description
      // In a real application, this might call an AI service
      const generatedDescription = `A story about ${title} that unfolds over ${duration} minutes. ` +
        `It begins with an introduction to the main elements, then develops through a series of ` +
        `connected scenes, and concludes with a resolution.`;
      
      setDescription(generatedDescription);
      toast.success("Story description generated!");
    } catch (error) {
      console.error("Error generating story:", error);
      toast.error("Failed to generate story description");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Create New Story</h3>
      
      <div className="space-y-3">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Story Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your story"
            className="bg-black/50 border-white/10 text-white"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Story Description
            </label>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-950/30"
              onClick={handleGenerateStory}
              disabled={isGenerating || !title.trim()}
            >
              {isGenerating ? (
                <>
                  <div className="w-3 h-3 border-2 border-t-transparent border-blue-400 rounded-full animate-spin mr-1"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-3 h-3 mr-1" />
                  Generate
                </>
              )}
            </Button>
          </div>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your story in detail"
            className="min-h-[100px] bg-black/50 border-white/10 text-white"
          />
        </div>
        
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
            Duration (minutes)
          </label>
          <div className="flex items-center space-x-2">
            <Input
              id="duration"
              type="number"
              min="0.5"
              max="10"
              step="0.5"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-24 bg-black/50 border-white/10 text-white"
            />
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Recommended: 1-5 minutes for optimal scene generation
          </p>
        </div>
      </div>
      
      <Button
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        onClick={handleCreateStory}
        disabled={isCreatingStory || !title.trim() || !description.trim()}
      >
        {isCreatingStory ? (
          <>
            <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
            Creating...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Create Story
          </>
        )}
      </Button>
    </div>
  );
};

export default CreateStoryForm;