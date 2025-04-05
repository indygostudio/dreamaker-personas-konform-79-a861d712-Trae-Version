import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "@/components/persona/AvatarUpload";
import { BannerUpload } from "./BannerUpload";
import { Globe2, Lock, Upload } from "lucide-react";
import type { BannerPosition } from "@/types/types";
import type { PersonaType } from "@/types/persona";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Music, 
  BookOpen, 
  Mic2, 
  User2, 
  SlidersHorizontal, 
  Wand2,
  Speaker
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileFormProps {
  username: string;
  setUsername: (value: string) => void;
  displayName: string;
  setDisplayName: (value: string) => void;
  bio: string;
  setBio: (value: string) => void;
  avatarUrl: string;
  setAvatarUrl: (value: string) => void;
  bannerUrl: string;
  setBannerUrl: (value: string) => void;
  videoUrl: string;
  setVideoUrl: (value: string) => void;
  isPublic: boolean;
  setIsPublic: (value: boolean) => void;
  profileType: PersonaType[];
  setProfileType: (value: PersonaType[]) => void;
  bannerPosition: BannerPosition;
  setBannerPosition: (value: BannerPosition) => void;
  darknessFactor: number;
  onDarknessChange: (value: number) => void;
  genre: string[];
  setGenre: (value: string[]) => void;
  location: string;
  setLocation: (value: string) => void;
  selectedSubtype: string | null;
  setSelectedSubtype: (value: string | null) => void;
}

const PERSONA_TYPES: { type: PersonaType; icon: React.ReactNode; label: string }[] = [
  { type: "AI_INSTRUMENTALIST", icon: <Music className="w-5 h-5" />, label: "Instrumentalist" },
  { type: "AI_WRITER", icon: <BookOpen className="w-5 h-5" />, label: "Writer" },
  { type: "AI_VOCALIST", icon: <Mic2 className="w-5 h-5" />, label: "Vocalist" },
  { type: "AI_CHARACTER", icon: <User2 className="w-5 h-5" />, label: "Character" },
  { type: "AI_MIXER", icon: <SlidersHorizontal className="w-5 h-5" />, label: "Mixer" },
  { type: "AI_EFFECT", icon: <Wand2 className="w-5 h-5" />, label: "Effect" },
  { type: "AI_SOUND", icon: <Speaker className="w-5 h-5" />, label: "Sound" }
];

const AVAILABLE_GENRES = [
  'Electronic',
  'Hip Hop',
  'Pop',
  'Rock',
  'R&B',
  'Jazz',
  'Classical'
];

export const ProfileForm = ({
  username,
  setUsername,
  displayName,
  setDisplayName,
  bio,
  setBio,
  avatarUrl,
  setAvatarUrl,
  bannerUrl,
  setBannerUrl,
  videoUrl,
  setVideoUrl,
  isPublic,
  setIsPublic,
  profileType,
  setProfileType,
  bannerPosition,
  setBannerPosition,
  darknessFactor,
  onDarknessChange,
  genre,
  setGenre,
  location,
  setLocation,
  selectedSubtype,
  setSelectedSubtype,
}: ProfileFormProps) => {
  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const videoUrl = URL.createObjectURL(file);
        setVideoUrl(videoUrl);
      }
    };
    input.click();
  };

  const handleTypeChange = (type: PersonaType) => {
    if (profileType.includes(type)) {
      setProfileType(profileType.filter(t => t !== type));
    } else {
      setProfileType([...profileType, type]);
    }
  };

  const handleGenreChange = (value: string) => {
    if (genre.includes(value)) {
      setGenre(genre.filter(g => g !== value));
    } else {
      setGenre([...genre, value]);
    }
  };

  const getSubtypeOptions = (type: PersonaType | null) => {
    switch (type) {
      case "AI_CHARACTER":
        return [
          { label: "All Characters", value: null },
          { label: "Ordinary Human", value: "Ordinary Human" },
          { label: "Superhuman", value: "Superhuman" },
          // ... other character subtypes ...
        ];
      case "AI_VOCALIST":
        return [
          { label: "All Voice Types", value: null },
          { label: "Bass", value: "Bass" },
          { label: "Baritone", value: "Baritone" },
          // ... other vocalist subtypes ...
        ];
      case "AI_INSTRUMENTALIST":
        return [
          { label: "All Instruments", value: null },
          { label: "Drums", value: "Drums" },
          { label: "Guitar", value: "Guitar" },
          // ... other instrumentalist subtypes ...
        ];
      case "AI_EFFECT":
        return [
          { label: "All Effects", value: null },
          { label: "Reverb", value: "Reverb" },
          { label: "Delay", value: "Delay" },
          // ... other effect subtypes ...
        ];
      default:
        return [];
    }
  };

  return (
    <ScrollArea className="h-full w-full pr-4">
      <div className="space-y-4 w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-center">
            <AvatarUpload
              value={avatarUrl}
              onChange={setAvatarUrl}
              name={username}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label>Profile Visibility</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="public"
                  name="visibility"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                  className="w-4 h-4 text-dreamaker-purple bg-black/50 border-dreamaker-purple/30"
                />
                <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer">
                  <Globe2 className="h-4 w-4" />
                  Public
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="private"
                  name="visibility"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                  className="w-4 h-4 text-dreamaker-purple bg-black/50 border-dreamaker-purple/30"
                />
                <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
                  <Lock className="h-4 w-4" />
                  Private
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        <BannerUpload
          bannerUrl={bannerUrl}
          bannerPosition={bannerPosition}
          onBannerUrlChange={setBannerUrl}
          onBannerPositionChange={setBannerPosition}
          darknessFactor={darknessFactor}
          onDarknessChange={onDarknessChange}
        />

        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-black/50 border-dreamaker-purple/30"
          />
        </div>

        <div>
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-black/50 border-dreamaker-purple/30"
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-black/50 border-dreamaker-purple/30"
            placeholder="e.g., Los Angeles, CA"
          />
        </div>

        <div>
          <Label htmlFor="videoUrl">Video URL</Label>
          <div className="flex gap-2">
            <Input
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="bg-black/50 border-dreamaker-purple/30 flex-1"
              placeholder="https://..."
            />
            <Button 
              type="button"
              variant="outline" 
              onClick={handleFileSelect}
              className="border-dreamaker-purple/30"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="userType">User Type</Label>
          <div className="grid grid-cols-4 xl:grid-cols-7 gap-2 w-full">
            <TooltipProvider>
              {PERSONA_TYPES.map(({ type, icon, label }) => (
                <Tooltip key={type}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={profileType.includes(type) ? "default" : "outline"}
                      onClick={() => handleTypeChange(type)}
                      className="w-full aspect-square"
                    >
                      {icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>

        <div>
          <Label htmlFor="genre">Genre</Label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_GENRES.map((g) => (
              <Button
                key={g}
                type="button"
                variant={genre.includes(g) ? "default" : "outline"}
                onClick={() => handleGenreChange(g)}
                className="w-full"
              >
                {g}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="bg-black/50 border-dreamaker-purple/30 min-h-[100px]"
          />
        </div>
        
        <div>
          <Label htmlFor="profileType">Profile Type</Label>
          <div className="flex flex-wrap gap-2">
            {PERSONA_TYPES.map(({ type, icon, label }) => (
              <TooltipProvider key={type}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={profileType.includes(type) ? "default" : "outline"}
                      size="sm"
                      className={`flex items-center gap-2 ${profileType.includes(type) ? "bg-dreamaker-purple" : "bg-black/50 border-dreamaker-purple/30"}`}
                      onClick={() => handleTypeChange(type)}
                    >
                      {icon}
                      {label}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                {getSubtypeOptions(profileType[0])
                  .filter(option => option.value !== null)
                  .map((option) => (
                  <SelectItem 
                    key={option.label} 
                    value={option.value as string}
                    className="text-white hover:bg-dreamaker-purple/20"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
