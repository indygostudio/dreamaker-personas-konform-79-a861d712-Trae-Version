import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ZoomIn, ZoomOut } from "lucide-react";
import type { Persona } from "@/types/persona";

interface PersonaFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: Persona['type'] | null;
  setSelectedType: (type: Persona['type'] | null) => void;
  selectedSubtype: string | null;
  setSelectedSubtype: (subtype: string | null) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  zoomLevel: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}

export function PersonaFilters({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedSubtype,
  setSelectedSubtype,
  sortBy,
  setSortBy,
  zoomLevel,
  handleZoomIn,
  handleZoomOut
}: PersonaFiltersProps) {
  const personaTypes = [
    { label: "All Types", value: null },
    { label: "Character", value: "AI_CHARACTER" },
    { label: "Artist", value: "AI_ARTIST" },
    { label: "Vocalist", value: "AI_VOCALIST" },
    { label: "Instrumentalist", value: "AI_INSTRUMENTALIST" },
    { label: "Effect", value: "AI_EFFECT" },
    { label: "Sound", value: "AI_SOUND" },
    { label: "Mixer", value: "AI_MIXER" },
    { label: "Writer", value: "AI_WRITER" },
    { label: "Producer", value: "AI_PRODUCER" },
    { label: "Composer", value: "AI_COMPOSER" },
    { label: "Arranger", value: "AI_ARRANGER" },
    { label: "DJ", value: "AI_DJ" },
    { label: "Visual Artist", value: "AI_VISUAL_ARTIST" },
    { label: "Audio Engineer", value: "AI_AUDIO_ENGINEER" }
  ] as const;

  const getSubtypeOptions = (type: Persona['type'] | null) => {
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
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        <Input
          placeholder="Search personas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-dreamaker-purple text-white pointer-events-auto">
                {selectedType ? personaTypes.find(t => t.value === selectedType)?.label : "All Types"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-dreamaker-gray border border-dreamaker-purple pointer-events-auto" style={{ zIndex: 40 }}>
              {personaTypes.map((type) => (
                <DropdownMenuItem
                  key={type.label}
                  onClick={() => {
                    setSelectedType(type.value);
                    setSelectedSubtype(null);
                  }}
                  className="text-white hover:bg-dreamaker-purple/50"
                >
                  {type.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedType && getSubtypeOptions(selectedType).length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-dreamaker-purple/50 text-white pointer-events-auto">
                  {selectedSubtype || "All Subtypes"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-dreamaker-gray border border-dreamaker-purple pointer-events-auto" style={{ zIndex: 40 }}>
                {getSubtypeOptions(selectedType).map((subtype) => (
                  <DropdownMenuItem
                    key={subtype.label}
                    onClick={() => setSelectedSubtype(subtype.value)}
                    className="text-white hover:bg-dreamaker-purple/50"
                  >
                    {subtype.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy("newest")}
              className={sortBy === "newest" ? "bg-dreamaker-purple text-white" : ""}
            >
              Newest
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy("oldest")}
              className={sortBy === "oldest" ? "bg-dreamaker-purple text-white" : ""}
            >
              Oldest
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy("name")}
              className={sortBy === "name" ? "bg-dreamaker-purple text-white" : ""}
            >
              A-Z
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy("name-desc")}
              className={sortBy === "name-desc" ? "bg-dreamaker-purple text-white" : ""}
            >
              Z-A
            </Button>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 20}
              className="bg-green-500/10 hover:bg-green-500/20"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 100}
              className="bg-green-500/10 hover:bg-green-500/20"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
