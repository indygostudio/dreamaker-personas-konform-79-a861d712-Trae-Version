
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Loader2, 
  Upload, 
  Image as ImageIcon,
  Sparkles
} from "lucide-react";
import { toast } from 'sonner';
import type { Persona } from '@/types/persona';

interface AvatarGenerationTabProps {
  persona?: Persona;
}

export const AvatarGenerationTab = ({ persona }: AvatarGenerationTabProps) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [avatarStyle, setAvatarStyle] = useState('realistic');
  const [gender, setGender] = useState('any');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your avatar");
      return;
    }

    setIsGenerating(true);
    setGeneratedAvatar(null);
    
    // Mock API call - would be replaced with actual API call
    setTimeout(() => {
      // For demo purposes, use reference image or a placeholder as the result
      setGeneratedAvatar(referenceImage || 'https://placehold.co/512x512/3a1c71/ffffff?text=AI+Avatar');
      setIsGenerating(false);
      toast.success("Avatar generated successfully!");
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Description</label>
            <Textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-black/20 border-dreamaker-purple/30 min-h-[120px]"
              placeholder="Describe the avatar you want to generate (e.g., 'A young woman with short blonde hair, blue eyes, wearing casual clothes')"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Negative Prompt (Optional)</label>
            <Textarea 
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="bg-black/20 border-dreamaker-purple/30"
              placeholder="Elements you don't want in the avatar (e.g., 'glasses, beard, hat')"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Reference Image (Optional)</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-dreamaker-purple/30 flex items-center justify-center overflow-hidden">
                {referenceImage ? (
                  <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-dreamaker-purple/40" />
                )}
              </div>
              
              <div className="flex-1">
                <label className="block w-full">
                  <Button variant="outline" className="w-full border-dreamaker-purple/30">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleReferenceUpload}
                  />
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  For best results, use a clear front-facing portrait
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Avatar Style</label>
              <Select value={avatarStyle} onValueChange={setAvatarStyle}>
                <SelectTrigger className="bg-black/20 border-dreamaker-purple/30">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="cartoon">Cartoon</SelectItem>
                  <SelectItem value="3d">3D Render</SelectItem>
                  <SelectItem value="pixel">Pixel Art</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Gender</label>
              <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="any" id="any" />
                  <Label htmlFor="any">Any</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button 
            className="w-full bg-dreamaker-purple hover:bg-dreamaker-purple/80" 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Avatar
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Generated Avatar</h3>
          
          <div className="aspect-square bg-black/30 rounded-lg overflow-hidden border border-dreamaker-purple/20 flex items-center justify-center">
            {generatedAvatar ? (
              <img 
                src={generatedAvatar} 
                alt="Generated avatar" 
                className="w-full h-full object-cover"
              />
            ) : isGenerating ? (
              <div className="text-center">
                <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-dreamaker-purple/70" />
                <p className="text-gray-400">Generating your avatar...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a minute or two</p>
              </div>
            ) : (
              <div className="text-center p-8">
                <ImageIcon className="h-16 w-16 text-dreamaker-purple/40 mx-auto mb-4" />
                <p className="text-gray-400">
                  Your generated avatar will appear here
                </p>
              </div>
            )}
          </div>
          
          {generatedAvatar && (
            <div className="flex gap-2">
              <Button className="flex-1">
                Save to Gallery
              </Button>
              <Button variant="outline" className="flex-1 border-dreamaker-purple/30">
                Download
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
