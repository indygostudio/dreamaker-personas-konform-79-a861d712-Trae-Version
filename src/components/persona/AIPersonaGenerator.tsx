import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AIPersonaGeneratorProps {
  onSuccess: () => void;
}

export const AIPersonaGenerator = ({ onSuccess }: AIPersonaGeneratorProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gender: "",
    emotionalProfile: "",
    lyricalPreferences: "",
    influences: "",
    language: "",
    voiceType: "",
    musicGenres: "",
    artistImageUrl: "",
    voiceSampleUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file: File, type: 'image' | 'audio') => {
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      const bucket = type === 'image' ? 'persona_avatars' : 'voice_samples';

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      handleInputChange(
        type === 'image' ? 'artistImageUrl' : 'voiceSampleUrl',
        publicUrl
      );

      toast({
        title: "Success",
        description: `${type === 'image' ? 'Image' : 'Voice sample'} uploaded successfully.`,
      });
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to upload ${type}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleGenerate = async () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Missing input",
        description: "Please provide at least a name and description for the AI to work with.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const response = await fetch("/api/persona-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to generate persona");

      const persona = await response.json();

      const { error } = await supabase
        .from("personas")
        .insert({
          user_id: user.id,
          name: persona.name,
          description: persona.description,
          voice_type: persona.voiceType,
          avatar_url: formData.artistImageUrl,
          voice_sample_url: formData.voiceSampleUrl,
          // Add any additional fields that your personas table supports
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your AI-generated persona has been created.",
      });

      onSuccess();
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        gender: "",
        emotionalProfile: "",
        lyricalPreferences: "",
        influences: "",
        language: "",
        voiceType: "",
        musicGenres: "",
        artistImageUrl: "",
        voiceSampleUrl: "",
      });
    } catch (error) {
      console.error("Error generating persona:", error);
      toast({
        title: "Error",
        description: "Failed to generate persona. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Persona Generator</CardTitle>
        <CardDescription>
          Let AI help you create unique and inspiring personas for your music. Provide detailed characteristics
          and our AI will generate a comprehensive persona profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Artist Name</Label>
          <Input
            id="name"
            placeholder="Enter artist name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the artist's background, style, and unique characteristics"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="emotionalProfile">Emotional Profile</Label>
          <Textarea
            id="emotionalProfile"
            placeholder="Describe the artist's emotional characteristics and performance style"
            value={formData.emotionalProfile}
            onChange={(e) => handleInputChange("emotionalProfile", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lyricalPreferences">Lyrical Preferences</Label>
          <Textarea
            id="lyricalPreferences"
            placeholder="Describe the artist's lyrical themes and writing style"
            value={formData.lyricalPreferences}
            onChange={(e) => handleInputChange("lyricalPreferences", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="influences">Influences</Label>
          <Input
            id="influences"
            placeholder="List major musical influences"
            value={formData.influences}
            onChange={(e) => handleInputChange("influences", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            placeholder="Primary language(s) for performances"
            value={formData.language}
            onChange={(e) => handleInputChange("language", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="voiceType">Voice Type</Label>
          <Select value={formData.voiceType} onValueChange={(value) => handleInputChange("voiceType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select voice type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soprano">Soprano</SelectItem>
              <SelectItem value="alto">Alto</SelectItem>
              <SelectItem value="tenor">Tenor</SelectItem>
              <SelectItem value="baritone">Baritone</SelectItem>
              <SelectItem value="bass">Bass</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="musicGenres">Music Genres</Label>
          <Input
            id="musicGenres"
            placeholder="e.g., Pop, R&B, Rock, Hip-Hop"
            value={formData.musicGenres}
            onChange={(e) => handleInputChange("musicGenres", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Artist Image</Label>
          <div className="relative">
            <Button variant="outline" className="w-full" type="button">
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <Input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'image');
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Voice Sample</Label>
          <div className="relative">
            <Button variant="outline" className="w-full" type="button">
              <Upload className="mr-2 h-4 w-4" />
              Upload Voice Sample
            </Button>
            <Input
              type="file"
              accept="audio/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'audio');
              }}
            />
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate Persona
        </Button>
      </CardContent>
    </Card>
  );
};