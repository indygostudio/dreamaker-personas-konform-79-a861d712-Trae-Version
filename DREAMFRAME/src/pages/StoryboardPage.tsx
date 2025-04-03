
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import Storyboard from "../components/storyboard/Storyboard";
import { PromptVariation } from "../types/promptTypes";
import { useStoryboard } from "../contexts/StoryboardContext";

const StoryboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setActiveScene } = useStoryboard();
  const [generatedPrompts, setGeneratedPrompts] = useState<PromptVariation[]>([]);
  const [basePrompt, setBasePrompt] = useState("");
  
  const handlePromptsGenerated = (prompts: PromptVariation[], base: string) => {
    setGeneratedPrompts(prompts);
    setBasePrompt(base);
  };
  
  const goToHomePage = () => {
    // Navigate to the home page
    navigate("/");
  };
  
  return <div className="min-h-screen bg-runway-DEFAULT text-white app-container">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="runway" 
            size="sm" 
            className="gap-2 glass-button"
            onClick={goToHomePage}
          >
            <Home className="h-4 w-4" /> Home
          </Button>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-runway-blue to-runway-blue-dark">DREAMFRAME</h1>
          <div className="w-24" />
        </div>
        
        <Storyboard onPromptsGenerated={handlePromptsGenerated} basePrompt={basePrompt} promptVariations={generatedPrompts} />
      </div>
    </div>;
};

export default StoryboardPage;
