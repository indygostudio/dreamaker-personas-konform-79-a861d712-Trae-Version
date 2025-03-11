import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { piapiService } from '@/services/piapiService';
import { RunwayImageToVideoParams } from '@/services/piapi/types';

interface MusicVideoCreatorProps {
  personaId: string;
}

export const MusicVideoCreator: React.FC<MusicVideoCreatorProps> = ({ personaId }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Mock upload - in a real app, this would be a server upload
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateVideo = async () => {
    if (!imageUrl || !prompt) {
      toast({
        title: "Missing information",
        description: "Please upload an image and provide a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Call the API service
      const params = {
        model: "runway/gen-2",
        prompt,
        image_url: imageUrl,
      };
      
      const result = await piapiService.generateVideoFromImage(params);
      
      if (result.status === 'complete' && result.video_url) {
        setGeneratedVideoUrl(result.video_url);
        toast({
          title: "Success",
          description: "Music video generated successfully",
        });
      } else {
        throw new Error("Failed to generate video");
      }
    } catch (error) {
      console.error("Error generating video:", error);
      toast({
        title: "Error",
        description: "Failed to generate video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-black/20 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Create Music Video</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Amazing Music Video"
            className="bg-black/30 border-gray-700"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Prompt</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your music video scene"
            className="bg-black/30 border-gray-700 min-h-[100px]"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Upload Cover Image</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-dreamaker-purple text-white rounded-md cursor-pointer hover:bg-dreamaker-purple/90 transition-colors">
              <Upload className="h-4 w-4" />
              <span>Select Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {imageUrl && <span className="text-green-500 text-sm">Image uploaded</span>}
          </div>
        </div>
        
        <Button
          onClick={handleGenerateVideo}
          disabled={isGenerating || !prompt || !imageUrl}
          className="w-full bg-gradient-to-r from-dreamaker-purple to-dreamaker-purple/70 hover:from-dreamaker-purple/90 hover:to-dreamaker-purple/60"
        >
          {isGenerating ? (
            <span>Generating...</span>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Generate Music Video
            </>
          )}
        </Button>
        
        {generatedVideoUrl && (
          <div className="mt-4">
            <h4 className="text-lg font-medium mb-2">Generated Video:</h4>
            <video 
              src={generatedVideoUrl}
              controls
              className="w-full rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};
