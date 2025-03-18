import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AvatarUpload } from "@/components/persona/AvatarUpload";
import { Switch } from "@/components/ui/switch";
import { Upload, X } from "lucide-react";
import { PersonaType } from "@/types/persona";
import { ProfileForm } from "./dialog/ProfileForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: {
    id: string;
    username: string;
    avatar_url: string;
    is_public?: boolean;
    banner_url?: string;
    persona_types?: PersonaType[];
  };
  onSuccess: () => void;
}

export const EditProfileDialog = ({
  open,
  onOpenChange,
  profile,
  onSuccess,
}: EditProfileDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState(profile.username || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [bannerUrl, setBannerUrl] = useState(profile.banner_url || "");
  const [isPublic, setIsPublic] = useState(profile.is_public || false);
  const [profileType, setProfileType] = useState<PersonaType[]>(profile.persona_types || []);
  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(null);
  const { toast } = useToast();

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("persona_avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("persona_avatars")
        .getPublicUrl(filePath);

      setBannerUrl(publicUrl);
      toast({
        title: "Success",
        description: "Banner uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast({
        title: "Error",
        description: "Failed to upload banner",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          avatar_url: avatarUrl,
          banner_url: bannerUrl,
          is_public: isPublic,
          profile_type: profileType[0] || "musician",
          subtype: selectedSubtype
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get subtypes based on selected persona type
  const getSubtypeOptions = (type: PersonaType | null) => {
    switch (type) {
      case "AI_CHARACTER":
        return [
          { label: "All Characters", value: null },
          { label: "Ordinary Human", value: "Ordinary Human" },
          { label: "Superhuman", value: "Superhuman" },
          { label: "Mutants", value: "Mutants" },
          { label: "Cyborgs", value: "Cyborgs" },
          { label: "Clones", value: "Clones" },
          { label: "Psychics", value: "Psychics" },
          { label: "Gods & Deities", value: "Gods & Deities" },
          { label: "Angels & Demons", value: "Angels & Demons" },
          { label: "Ghosts & Spirits", value: "Ghosts & Spirits" },
          { label: "Vampires", value: "Vampires" },
          { label: "Werewolves", value: "Werewolves" },
          { label: "Witches & Warlocks", value: "Witches & Warlocks" },
          { label: "Fairies & Elves", value: "Fairies & Elves" },
          { label: "Zombies", value: "Zombies" },
          { label: "Classic Monsters", value: "Classic Monsters" },
          { label: "Dragons", value: "Dragons" },
          { label: "Kaiju", value: "Kaiju" },
          { label: "Cryptids", value: "Cryptids" },
          { label: "Shape-shifters", value: "Shape-shifters" },
          { label: "Aliens", value: "Aliens" },
          { label: "Artificial Intelligence (AI)", value: "Artificial Intelligence (AI)" },
          { label: "Androids & Robots", value: "Androids & Robots" },
          { label: "Extraterrestrial Parasites", value: "Extraterrestrial Parasites" },
          { label: "Demi-Humans", value: "Demi-Humans" },
          { label: "Elementals", value: "Elementals" },
          { label: "Golems", value: "Golems" },
          { label: "Chimeras", value: "Chimeras" },
          { label: "Cosmic & Abstract Entities", value: "Cosmic & Abstract Entities" },
          { label: "Celestial Beings", value: "Celestial Beings" }
        ];
      case "AI_VOCALIST":
        return [
          { label: "All Voice Types", value: null },
          { label: "Bass", value: "Bass" },
          { label: "Baritone", value: "Baritone" },
          { label: "Tenor", value: "Tenor" },
          { label: "Countertenor", value: "Countertenor" },
          { label: "Contralto", value: "Contralto" },
          { label: "Mezzo-Soprano", value: "Mezzo-Soprano" },
          { label: "Soprano", value: "Soprano" },
          { label: "Raspy", value: "Raspy" },
          { label: "Breathy", value: "Breathy" },
          { label: "Nasal", value: "Nasal" },
          { label: "Operatic", value: "Operatic" },
          { label: "Falsetto", value: "Falsetto" },
          { label: "Growling/Screaming", value: "Growling/Screaming" },
          { label: "Narrator/Storyteller", value: "Narrator/Storyteller" },
          { label: "Whispery/ASMR", value: "Whispery/ASMR" },
          { label: "Theatrical/Animated", value: "Theatrical/Animated" },
          { label: "Dramatic/Soulful", value: "Dramatic/Soulful" },
          { label: "Chanting/Gospel", value: "Chanting/Gospel" },
          { label: "Throat Singing", value: "Throat Singing" },
          { label: "Yodeling", value: "Yodeling" },
          { label: "Beatboxing", value: "Beatboxing" },
          { label: "Robotic/Auto-Tuned", value: "Robotic/Auto-Tuned" },
          { label: "Demonic/Distorted", value: "Demonic/Distorted" }
        ];
      case "AI_INSTRUMENTALIST":
        return [
          { label: "All Instruments", value: null },
          { label: "Drums", value: "Drums" },
          { label: "Guitar", value: "Guitar" },
          { label: "Bass", value: "Bass" },
          { label: "Keyboard", value: "Keyboard" },
          { label: "Wind", value: "Wind" },
          { label: "Brass", value: "Brass" },
          { label: "Plucked", value: "Plucked" },
          { label: "Strings", value: "Strings" }
        ];
      case "AI_EFFECT":
        return [
          { label: "All Effects", value: null },
          { label: "Reverb", value: "Reverb" },
          { label: "Delay", value: "Delay" },
          { label: "Echo", value: "Echo" },
          { label: "Saturation", value: "Saturation" },
          { label: "Modulation", value: "Modulation" },
          { label: "Chorus", value: "Chorus" },
          { label: "Flanger", value: "Flanger" },
          { label: "Phaser", value: "Phaser" },
          { label: "Harmonizer", value: "Harmonizer" },
          { label: "Distortion", value: "Distortion" }
        ];
      default:
        return [];
    }
  };

  // Handle type change
  const handleTypeChange = (type: PersonaType) => {
    if (profileType.includes(type)) {
      setProfileType(profileType.filter(t => t !== type));
    } else {
      setProfileType([type]);
      // Reset subtype when type changes
      setSelectedSubtype(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-black/90 border border-dreamaker-purple/20 text-white overflow-y-auto max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Edit Profile</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your profile information and preferences
          </DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 text-white">
          <div className="space-y-4 w-full">
            <div className="flex justify-center">
              <AvatarUpload
                value={avatarUrl}
                onChange={setAvatarUrl}
                name={username}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="banner" className="text-white">Banner Image</Label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                  id="banner-upload"
                />
                <Label
                  htmlFor="banner-upload"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-dreamaker-purple/50 bg-black/30"
                >
                  {bannerUrl ? (
                    <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <span className="text-sm text-gray-400">Upload Banner</span>
                    </div>
                  )}
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-black/50 border-dreamaker-purple/30 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="userType" className="text-white">Profile Type</Label>
              <div className="grid grid-cols-4 gap-2 w-full">
                {[
                  { type: "AI_VOCALIST", label: "Vocalist" },
                  { type: "AI_INSTRUMENTALIST", label: "Instrumentalist" },
                  { type: "AI_WRITER", label: "Writer" },
                  { type: "AI_CHARACTER", label: "Character" },
                  { type: "AI_MIXER", label: "Mixer" },
                  { type: "AI_EFFECT", label: "Effect" },
                  { type: "AI_SOUND", label: "Sound" }
                ].map(({ type, label }) => (
                  <Button
                    key={type}
                    type="button"
                    variant={profileType.includes(type as PersonaType) ? "default" : "outline"}
                    onClick={() => handleTypeChange(type as PersonaType)}
                    className="w-full"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {profileType.length > 0 && getSubtypeOptions(profileType[0]).length > 0 && (
              <div>
                <Label htmlFor="subtype" className="text-white">Subtype</Label>
                <Select
                  value={selectedSubtype || ""}
                  onValueChange={(value) => setSelectedSubtype(value || null)}
                >
                  <SelectTrigger className="bg-black/50 border-dreamaker-purple/30 text-white">
                    <SelectValue placeholder="Select a subtype" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-dreamaker-purple/20 text-white">
                    {getSubtypeOptions(profileType[0]).map((option) => (
                      <SelectItem 
                        key={option.label} 
                        value={option.value || ""}
                        className="text-white hover:bg-dreamaker-purple/20"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="visibility" className="text-white">Public Profile</Label>
              <Switch
                id="visibility"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
          <div className="space-y-4">
            <div className="flex justify-center">
              <AvatarUpload
                value={avatarUrl}
                onChange={setAvatarUrl}
                name={username}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="banner" className="text-white">Banner Image</Label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                  id="banner-upload"
                />
                <Label
                  htmlFor="banner-upload"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-dreamaker-purple/50 bg-black/30"
                >
                  {bannerUrl ? (
                    <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <span className="text-sm text-gray-400">Upload Banner</span>
                    </div>
                  )}
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-black/50 border-dreamaker-purple/30 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="visibility" className="text-white">Public Profile</Label>
              <Switch
                id="visibility"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="border-dreamaker-purple/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-dreamaker-purple hover:bg-dreamaker-purple/90"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};