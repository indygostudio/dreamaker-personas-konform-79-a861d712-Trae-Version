
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
    { label: "Instrument", value: "AI_INSTRUMENT" },
    { label: "Mixer", value: "AI_MIXER" },
    { label: "Writer", value: "AI_WRITER" }
  ] as const;

  const getSubtypeOptions = (type: Persona['type'] | null) => {
    switch (type) {
      case "AI_INSTRUMENTALIST":
        return [
          { label: "All Instruments", value: null },
          { label: "Guitar", value: "Guitar" },
          { label: "Bass", value: "Bass" },
          { label: "Drums", value: "Drums" },
          { label: "Piano", value: "Piano" },
          { label: "Strings", value: "Strings" },
          { label: "Brass", value: "Brass" },
          { label: "Wind", value: "Wind" },
          { label: "Synth", value: "Synth" },
          { label: "Other", value: "Other" },
        ];
      case "AI_VOCALIST":
        return [
          { label: "All Styles", value: null },
          { label: "Pop", value: "Pop" },
          { label: "Rock", value: "Rock" },
          { label: "Jazz", value: "Jazz" },
          { label: "Classical", value: "Classical" },
          { label: "Hip Hop", value: "Hip Hop" },
          { label: "R&B", value: "R&B" },
        ];
      case "AI_SOUND":
        return [
          { label: "All Sounds", value: null },
          // Bass category
          { label: "Bass", value: "Bass" },
          { label: "Sub", value: "Sub" },
          { label: "Synth Bass", value: "Synth Bass" },
          { label: "Upright Bass", value: "Upright Bass" },
          // Effects category
          { label: "Effects", value: "Effects" },
          { label: "Ambience", value: "Ambience" },
          { label: "Atmosphere", value: "Atmosphere" },
          { label: "Boom", value: "Boom" },
          { label: "Downshifter", value: "Downshifter" },
          { label: "Drone", value: "Drone" },
          { label: "Foley", value: "Foley" },
          { label: "Found Sound", value: "Found Sound" },
          { label: "Gate", value: "Gate" },
          { label: "Granular", value: "Granular" },
          { label: "Impact", value: "Impact" },
          { label: "Material", value: "Material" },
          { label: "Mechanical", value: "Mechanical" },
          { label: "Nature", value: "Nature" },
          { label: "Noise", value: "Noise" },
          { label: "Reverse", value: "Reverse" },
          { label: "Riser", value: "Riser" },
          // Drums category
          { label: "Drums", value: "Drums" },
          { label: "808", value: "808" },
          { label: "909", value: "909" },
          { label: "Brushes", value: "Brushes" },
          { label: "Cymbal", value: "Cymbal" },
          { label: "Drum Fill", value: "Drum Fill" },
          { label: "Drum Kit", value: "Drum Kit" },
          { label: "Kick", value: "Kick" },
          { label: "Rim Shot", value: "Rim Shot" },
          { label: "Snare", value: "Snare" },
          { label: "Tom", value: "Tom" },
          { label: "Top", value: "Top" },
          // Guitar category
          { label: "Guitar", value: "Guitar" },
          { label: "Acoustic Guitar", value: "Acoustic Guitar" },
          { label: "Electric Guitar", value: "Electric Guitar" },
          { label: "Gura", value: "Gura" },
          { label: "Koto", value: "Koto" },
          // Keyboard category
          { label: "Keyboard", value: "Keyboard" },
          { label: "Accordion", value: "Accordion" },
          { label: "Clavichord", value: "Clavichord" },
          { label: "Electric Piano", value: "Electric Piano" },
          { label: "Harpsichord", value: "Harpsichord" },
          // Mixed category
          { label: "Mixed", value: "Mixed" },
          // Percussion category
          { label: "Percussion", value: "Percussion" },
          { label: "Agogo", value: "Agogo" },
          { label: "Bata", value: "Bata" },
          { label: "Djembe", value: "Djembe" },
          { label: "Dholak", value: "Dholak" },
          { label: "Finger Cymbal", value: "Finger Cymbal" },
          { label: "Tabla", value: "Tabla" },
          { label: "Taiko", value: "Taiko" },
          // Synth category
          { label: "Synth", value: "Synth" },
          { label: "303", value: "303" },
          { label: "Arp", value: "Arp" },
          { label: "Chord", value: "Chord" },
          { label: "Lead", value: "Lead" },
          { label: "Pad", value: "Pad" },
          { label: "Pluck", value: "Pluck" },
          { label: "Stab", value: "Stab" },
          // String category
          { label: "String", value: "String" },
          { label: "Cello", value: "Cello" },
          { label: "Double Bass", value: "Double Bass" },
          { label: "String Ensemble", value: "String Ensemble" },
          { label: "Viola", value: "Viola" },
          { label: "Violin", value: "Violin" },
          // Vocal category
          { label: "Vocal", value: "Vocal" },
          { label: "Acapella", value: "Acapella" },
          { label: "Adlib", value: "Adlib" },
          { label: "Backing", value: "Backing" },
          { label: "Choir", value: "Choir" },
          { label: "Chopped", value: "Chopped" },
          // Wind and Brass category
          { label: "Wind and Brass", value: "Wind and Brass" },
          { label: "Bassoon", value: "Bassoon" },
          { label: "Brass", value: "Brass" },
          { label: "Clarinet", value: "Clarinet" },
          { label: "Didgeridoo", value: "Didgeridoo" },
          { label: "Flute", value: "Flute" },
          { label: "Harmonica", value: "Harmonica" },
          // Other instruments from the image
          { label: "Sci-fi", value: "Sci-fi" },
          { label: "Mandolin", value: "Mandolin" },
          { label: "Melodica", value: "Melodica" },
          { label: "Bell", value: "Bell" },
          { label: "Berimbau", value: "Berimbau" },
          { label: "Organ", value: "Organ" },
          { label: "Bongo", value: "Bongo" },
          { label: "Gang", value: "Gang" },
          { label: "Guiro", value: "Guiro" },
          { label: "Hang Drum", value: "Hang Drum" },
          { label: "Kalimba", value: "Kalimba" },
          { label: "Metal", value: "Metal" },
          { label: "Udu", value: "Udu" },
          { label: "Unimi", value: "Unimi" },
          { label: "Clap", value: "Clap" },
          { label: "Clave", value: "Clave" },
          { label: "Click", value: "Click" },
          { label: "Conga", value: "Conga" },
          { label: "Rattle", value: "Rattle" },
          { label: "Woodblock", value: "Woodblock" },
          { label: "Cowbell", value: "Cowbell" },
          { label: "Cuica", value: "Cuica" },
          { label: "Surdo", value: "Surdo" },
          { label: "Shaker", value: "Shaker" },
          { label: "Snap", value: "Snap" },
          { label: "Talking Drum", value: "Talking Drum" },
          { label: "Tambourine", value: "Tambourine" },
          { label: "Tank Drum", value: "Tank Drum" },
          { label: "Timbale", value: "Timbale" },
          { label: "Timpani", value: "Timpani" },
          { label: "Triangle", value: "Triangle" },
          { label: "Whistle", value: "Whistle" },
          { label: "Wood", value: "Wood" },
          { label: "Harp", value: "Harp" },
          { label: "Horn", value: "Horn" },
          { label: "Oboe", value: "Oboe" },
          { label: "Panpipe", value: "Panpipe" },
          { label: "Saxophone", value: "Saxophone" },
          { label: "Trombone", value: "Trombone" },
          { label: "Trumpet", value: "Trumpet" },
          { label: "Tuba", value: "Tuba" },
          { label: "Wind", value: "Wind" },
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
