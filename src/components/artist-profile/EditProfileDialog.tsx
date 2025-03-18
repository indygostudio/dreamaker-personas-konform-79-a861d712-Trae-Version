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
import { Textarea } from "@/components/ui/textarea";
import { BannerUpload } from "./dialog/BannerUpload";
import type { BannerPosition } from "@/types/types";

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
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [profileType, setProfileType] = useState<PersonaType[]>([]);
  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Initialize additional state variables needed for ProfileForm
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [bannerPosition, setBannerPosition] = useState<BannerPosition>({ x: 50, y: 50 });
  const [darknessFactor, setDarknessFactor] = useState(0);
  const [genre, setGenre] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  
  // Update state when profile changes or dialog opens
  useEffect(() => {
    if (profile && open) {
      setUsername(profile.username || "");
      setAvatarUrl(profile.avatar_url || "");
      setBannerUrl(profile.banner_url || "");
      setIsPublic(profile.is_public || false);
      setProfileType(profile.persona_types || []);
    }
  }, [profile, open]);
  
  // Load profile data when component mounts or dialog opens
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profile?.id || !open) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", profile.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setDisplayName(data.display_name || "");
          setBio(data.bio || "");
          setVideoUrl(data.video_url || "");
          setBannerPosition(data.banner_position || { x: 50, y: 50 });
          setDarknessFactor(data.darkness_factor || 0);
          setGenre(data.genres || []);
          setLocation(data.location || "");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      }
    };
    
    fetchProfileData();
  }, [profile?.id, open, toast]);

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
          display_name: displayName,
          avatar_url: avatarUrl,
          banner_url: bannerUrl,
          banner_position: bannerPosition,
          darkness_factor: darknessFactor,
          bio: bio,
          video_url: videoUrl,
          is_public: isPublic,
          profile_type: profileType[0] || "musician",
          subtype: selectedSubtype,
          genres: genre,
          location: location
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
      // Don't allow removing the last type
      if (profileType.length > 1) {
        setProfileType(profileType.filter(t => t !== type));
      }
    } else {
      // Replace the current type instead of adding to array since we only use the first one
      setProfileType([type]);
      // Reset subtype when type changes
      setSelectedSubtype(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-black border border-dreamaker-purple/20 text-white overflow-y-auto max-h-[85vh]">
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
          <ProfileForm
            username={username}
            setUsername={setUsername}
            displayName={displayName}
            setDisplayName={setDisplayName}
            bio={bio}
            setBio={setBio}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            bannerUrl={bannerUrl}
            setBannerUrl={setBannerUrl}
            videoUrl={videoUrl}
            setVideoUrl={setVideoUrl}
            isPublic={isPublic}
            setIsPublic={setIsPublic}
            profileType={profileType}
            setProfileType={setProfileType}
            bannerPosition={bannerPosition}
            setBannerPosition={setBannerPosition}
            darknessFactor={darknessFactor}
            onDarknessChange={setDarknessFactor}
            genre={genre}
            setGenre={setGenre}
            location={location}
            setLocation={setLocation}
          />
          
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