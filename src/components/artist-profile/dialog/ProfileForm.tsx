import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "@/components/persona/AvatarUpload";
import { BannerUpload } from "./BannerUpload";
import { Globe2, Lock, Upload, Settings2 } from "lucide-react";
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
  Speaker,
  Headphones,
  Music2,
  Folder,
  Disc,
  Palette,
  Wrench
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
  { type: "AI_SOUND", icon: <Speaker className="w-5 h-5" />, label: "Sound" },
  { type: "AI_PRODUCER", icon: <Headphones className="w-5 h-5" />, label: "Producer" },
  { type: "AI_COMPOSER", icon: <Music2 className="w-5 h-5" />, label: "Composer" },
  { type: "AI_ARRANGER", icon: <Folder className="w-5 h-5" />, label: "Arranger" },
  { type: "AI_DJ", icon: <Disc className="w-5 h-5" />, label: "DJ" },
  { type: "AI_VISUAL_ARTIST", icon: <Palette className="w-5 h-5" />, label: "Visual Artist" },
  { type: "AI_AUDIO_ENGINEER", icon: <Wrench className="w-5 h-5" />, label: "Audio Engineer" },
  { type: "AI_MASTERING", icon: <Settings2 className="w-5 h-5" />, label: "Mastering" },
  { type: "AI_MIX", icon: <SlidersHorizontal className="w-5 h-5" />, label: "Mix" }
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
      return;
    } else {
      setProfileType([type]);
      setSelectedSubtype(null);
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
          { label: "Electric Guitar", value: "Electric Guitar" },
          { label: "Acoustic Guitar", value: "Acoustic Guitar" },
          { label: "Bass", value: "Bass" },
          { label: "Keyboard", value: "Keyboard" },
          { label: "Piano", value: "Piano" },
          { label: "Organ", value: "Organ" },
          { label: "Synth", value: "Synth" },
          { label: "Wind", value: "Wind" },
          { label: "Saxophone", value: "Saxophone" },
          { label: "Flute", value: "Flute" },
          { label: "Clarinet", value: "Clarinet" },
          { label: "Oboe", value: "Oboe" },
          { label: "Bassoon", value: "Bassoon" },
          { label: "Recorder", value: "Recorder" },
          { label: "Brass", value: "Brass" },
          { label: "Trumpet", value: "Trumpet" },
          { label: "Trombone", value: "Trombone" },
          { label: "French Horn", value: "French Horn" },
          { label: "Tuba", value: "Tuba" },
          { label: "Cornet", value: "Cornet" },
          { label: "Plucked", value: "Plucked" },
          { label: "Harp", value: "Harp" },
          { label: "Ukulele", value: "Ukulele" },
          { label: "Banjo", value: "Banjo" },
          { label: "Mandolin", value: "Mandolin" },
          { label: "Strings", value: "Strings" },
          { label: "Violin", value: "Violin" },
          { label: "Viola", value: "Viola" },
          { label: "Cello", value: "Cello" },
          { label: "Double Bass", value: "Double Bass" },
          { label: "Percussion", value: "Percussion" },
          { label: "Timpani", value: "Timpani" },
          { label: "Marimba", value: "Marimba" },
          { label: "Xylophone", value: "Xylophone" },
          { label: "Vibraphone", value: "Vibraphone" },
          { label: "Djembe", value: "Djembe" },
          { label: "Cajon", value: "Cajon" },
          { label: "Tabla", value: "Tabla" },
          { label: "Bongos", value: "Bongos" },
          { label: "Congas", value: "Congas" },
          { label: "Theremin", value: "Theremin" },
          { label: "Accordion", value: "Accordion" },
          { label: "Harmonica", value: "Harmonica" },
          { label: "Bagpipes", value: "Bagpipes" },
          { label: "Sitar", value: "Sitar" },
          { label: "Erhu", value: "Erhu" },
          { label: "Koto", value: "Koto" },
          { label: "Shamisen", value: "Shamisen" }
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
          { label: "Distortion", value: "Distortion" },
          { label: "Compressor", value: "Compressor" },
          { label: "EQ", value: "EQ" },
          { label: "Limiter", value: "Limiter" },
          { label: "Noise Gate", value: "Noise Gate" },
          { label: "Pitch Shifter", value: "Pitch Shifter" },
          { label: "Auto-Tune", value: "Auto-Tune" },
          { label: "Vocoder", value: "Vocoder" }
        ];
      case "AI_SOUND":
        return [
          { label: "All Sounds", value: null },
          { label: "Ambience", value: "Ambience" },
          { label: "Sound Effects", value: "Sound Effects" },
          { label: "Foley", value: "Foley" },
          { label: "Nature", value: "Nature" },
          { label: "Urban", value: "Urban" },
          { label: "Mechanical", value: "Mechanical" },
          { label: "Electronic", value: "Electronic" },
          { label: "Animal", value: "Animal" },
          { label: "Human", value: "Human" },
          { label: "Weather", value: "Weather" },
          { label: "Industrial", value: "Industrial" },
          { label: "Sci-Fi", value: "Sci-Fi" },
          { label: "Fantasy", value: "Fantasy" },
          { label: "Horror", value: "Horror" }
        ];
      case "AI_MIXER":
        return [
          { label: "All Mixers", value: null },
          { label: "Mastering Engineer", value: "Mastering Engineer" },
          { label: "Recording Engineer", value: "Recording Engineer" },
          { label: "Mix Engineer", value: "Mix Engineer" },
          { label: "Vocal Producer", value: "Vocal Producer" },
          { label: "Tracking Engineer", value: "Tracking Engineer" },
          { label: "Sound Designer", value: "Sound Designer" },
          { label: "Audio Restoration", value: "Audio Restoration" },
          { label: "Film Audio", value: "Film Audio" },
          { label: "Game Audio", value: "Game Audio" },
          { label: "Broadcast Engineer", value: "Broadcast Engineer" }
        ];
      case "AI_WRITER":
        return [
          { label: "All Writers", value: null },
          { label: "Songwriter", value: "Songwriter" },
          { label: "Lyricist", value: "Lyricist" },
          { label: "Composer", value: "Composer" },
          { label: "Poet", value: "Poet" },
          { label: "Novelist", value: "Novelist" },
          { label: "Screenwriter", value: "Screenwriter" },
          { label: "Playwright", value: "Playwright" },
          { label: "Journalist", value: "Journalist" },
          { label: "Blogger", value: "Blogger" },
          { label: "Technical Writer", value: "Technical Writer" },
          { label: "Copywriter", value: "Copywriter" },
          { label: "Ghostwriter", value: "Ghostwriter" }
        ];
      case "AI_PRODUCER":
        return [
          { label: "All Producers", value: null },
          { label: "Pop Producer", value: "Pop Producer" },
          { label: "Hip Hop Producer", value: "Hip Hop Producer" },
          { label: "EDM Producer", value: "EDM Producer" },
          { label: "Rock Producer", value: "Rock Producer" },
          { label: "R&B Producer", value: "R&B Producer" },
          { label: "Jazz Producer", value: "Jazz Producer" },
          { label: "Classical Producer", value: "Classical Producer" },
          { label: "Trap Producer", value: "Trap Producer" },
          { label: "K-Pop Producer", value: "K-Pop Producer" },
          { label: "Latin Producer", value: "Latin Producer" },
          { label: "Reggaeton Producer", value: "Reggaeton Producer" },
          { label: "Country Producer", value: "Country Producer" },
          { label: "Indie Producer", value: "Indie Producer" },
          { label: "Folk Producer", value: "Folk Producer" },
          { label: "Reggae Producer", value: "Reggae Producer" }
        ];
      case "AI_COMPOSER":
        return [
          { label: "All Composers", value: null },
          { label: "Classical Composer", value: "Classical Composer" },
          { label: "Film Score Composer", value: "Film Score Composer" },
          { label: "Video Game Composer", value: "Video Game Composer" },
          { label: "TV Music Composer", value: "TV Music Composer" },
          { label: "Orchestral Composer", value: "Orchestral Composer" },
          { label: "Chamber Music Composer", value: "Chamber Music Composer" },
          { label: "Opera Composer", value: "Opera Composer" },
          { label: "Ballet Composer", value: "Ballet Composer" },
          { label: "Choral Composer", value: "Choral Composer" },
          { label: "Ambient Composer", value: "Ambient Composer" },
          { label: "Minimalist Composer", value: "Minimalist Composer" },
          { label: "Jazz Composer", value: "Jazz Composer" },
          { label: "Neo-Classical Composer", value: "Neo-Classical Composer" },
          { label: "Electronic Composer", value: "Electronic Composer" },
          { label: "Experimental Composer", value: "Experimental Composer" }
        ];
      case "AI_ARRANGER":
        return [
          { label: "All Arrangers", value: null },
          { label: "Orchestral Arranger", value: "Orchestral Arranger" },
          { label: "Jazz Arranger", value: "Jazz Arranger" },
          { label: "Pop Arranger", value: "Pop Arranger" },
          { label: "Classical Arranger", value: "Classical Arranger" },
          { label: "Film Score Arranger", value: "Film Score Arranger" },
          { label: "A Cappella Arranger", value: "A Cappella Arranger" },
          { label: "Choir Arranger", value: "Choir Arranger" },
          { label: "Small Ensemble Arranger", value: "Small Ensemble Arranger" },
          { label: "Big Band Arranger", value: "Big Band Arranger" },
          { label: "Electronic Arranger", value: "Electronic Arranger" },
          { label: "Rock Arranger", value: "Rock Arranger" },
          { label: "Hip Hop Arranger", value: "Hip Hop Arranger" },
          { label: "World Music Arranger", value: "World Music Arranger" }
        ];
      case "AI_DJ":
        return [
          { label: "All DJs", value: null },
          { label: "House DJ", value: "House DJ" },
          { label: "Techno DJ", value: "Techno DJ" },
          { label: "EDM DJ", value: "EDM DJ" },
          { label: "Trance DJ", value: "Trance DJ" },
          { label: "Hip Hop DJ", value: "Hip Hop DJ" },
          { label: "Turntablist", value: "Turntablist" },
          { label: "Open Format DJ", value: "Open Format DJ" },
          { label: "Mobile DJ", value: "Mobile DJ" },
          { label: "Radio DJ", value: "Radio DJ" },
          { label: "Club DJ", value: "Club DJ" },
          { label: "Festival DJ", value: "Festival DJ" },
          { label: "Jungle/Drum & Bass DJ", value: "Jungle/Drum & Bass DJ" },
          { label: "Dubstep DJ", value: "Dubstep DJ" },
          { label: "Reggae/Dancehall DJ", value: "Reggae/Dancehall DJ" },
          { label: "Disco DJ", value: "Disco DJ" },
          { label: "Ambient/Chill DJ", value: "Ambient/Chill DJ" },
          { label: "Wedding DJ", value: "Wedding DJ" }
        ];
      case "AI_VISUAL_ARTIST":
        return [
          { label: "All Visual Artists", value: null },
          { label: "Digital Painter", value: "Digital Painter" },
          { label: "3D Modeler", value: "3D Modeler" },
          { label: "Concept Artist", value: "Concept Artist" },
          { label: "Character Designer", value: "Character Designer" },
          { label: "Environment Artist", value: "Environment Artist" },
          { label: "UI/UX Designer", value: "UI/UX Designer" },
          { label: "Animation Artist", value: "Animation Artist" },
          { label: "Pixel Artist", value: "Pixel Artist" },
          { label: "Traditional Painter", value: "Traditional Painter" },
          { label: "Illustrator", value: "Illustrator" },
          { label: "Comic Artist", value: "Comic Artist" },
          { label: "Graphic Designer", value: "Graphic Designer" },
          { label: "VFX Artist", value: "VFX Artist" },
          { label: "Motion Graphics Artist", value: "Motion Graphics Artist" },
          { label: "Photographer", value: "Photographer" },
          { label: "Photomanipulation Artist", value: "Photomanipulation Artist" },
          { label: "Street Artist", value: "Street Artist" },
          { label: "Sculptor", value: "Sculptor" },
          { label: "Abstract Artist", value: "Abstract Artist" }
        ];
      case "AI_AUDIO_ENGINEER":
        return [
          { label: "All Audio Engineers", value: null },
          { label: "Studio Engineer", value: "Studio Engineer" },
          { label: "Live Sound Engineer", value: "Live Sound Engineer" },
          { label: "Broadcast Engineer", value: "Broadcast Engineer" },
          { label: "Acoustic Engineer", value: "Acoustic Engineer" },
          { label: "System Engineer", value: "System Engineer" },
          { label: "FOH Engineer", value: "FOH Engineer" },
          { label: "Monitor Engineer", value: "Monitor Engineer" },
          { label: "Recording Engineer", value: "Recording Engineer" },
          { label: "Mixing Engineer", value: "Mixing Engineer" },
          { label: "Mastering Engineer", value: "Mastering Engineer" },
          { label: "Post-Production Engineer", value: "Post-Production Engineer" },
          { label: "Sound Designer", value: "Sound Designer" },
          { label: "Foley Engineer", value: "Foley Engineer" },
          { label: "A/V Engineer", value: "A/V Engineer" }
        ];
      default:
        return [];
    }
  };

  return (
    <ScrollArea className="h-[70vh] w-full pr-4">
      <div className="space-y-8 w-full pb-8">
        {/* Profile Identity Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-dreamaker-purple/30 pb-2">Profile Identity</h3>
          
          <div className="flex justify-between items-start w-full gap-4">
            <div className="flex-shrink-0">
              <Label className="block mb-2">Avatar</Label>
              <AvatarUpload
                value={avatarUrl}
                onChange={setAvatarUrl}
                name={username}
              />
            </div>
            
            <div className="flex-1 space-y-4">
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
            </div>
            
            <div className="flex-shrink-0">
              <Label>Profile Visibility</Label>
              <div className="flex flex-col gap-2 mt-2">
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
          
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-black/50 border-dreamaker-purple/30 min-h-[100px]"
            />
          </div>
        </div>
        
        {/* Visual Elements Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-dreamaker-purple/30 pb-2">Visual Elements</h3>
          
          <BannerUpload
            bannerUrl={bannerUrl}
            bannerPosition={bannerPosition}
            onBannerUrlChange={setBannerUrl}
            onBannerPositionChange={setBannerPosition}
            darknessFactor={darknessFactor}
            onDarknessChange={onDarknessChange}
          />
          
          <div>
            <Label htmlFor="videoUrl">Video Background</Label>
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
        </div>
        
        {/* Categorization Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-dreamaker-purple/30 pb-2">Categorization</h3>
          
          <div>
            <Label htmlFor="profileType">Profile Type</Label>
            <div className="flex flex-wrap gap-2 mt-2">
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
                onValueChange={(value) => {
                  // Convert "all_*" values back to null
                  if (value && value.startsWith('all_')) {
                    setSelectedSubtype(null);
                  } else {
                    setSelectedSubtype(value || null);
                  }
                }}
              >
                <SelectTrigger className="bg-black/50 border-dreamaker-purple/30 text-white">
                  <SelectValue placeholder="Select a subtype" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-dreamaker-purple/20 text-white">
                  {getSubtypeOptions(profileType[0])
                    .filter(option => option.value !== null && option.value !== "")
                    .map((option) => (
                    <SelectItem 
                      key={option.label} 
                      value={option.value}
                      className="text-white hover:bg-dreamaker-purple/20"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                  
                  {/* Add a placeholder option with a non-empty string value for the "All" options */}
                  {getSubtypeOptions(profileType[0])
                    .filter(option => option.value === null)
                    .map((option) => (
                    <SelectItem
                      key={option.label}
                      value={`all_${option.label.toLowerCase().replace(/\s+/g, '_')}`}
                      className="text-white hover:bg-dreamaker-purple/20"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <Label htmlFor="genre">Genre</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
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
          
          {/* Removed redundant user type section with icons only */}
        </div>
      </div>
    </ScrollArea>
  );
};
