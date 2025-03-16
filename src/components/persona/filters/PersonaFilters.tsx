
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
          { label: "Ambient", value: "Ambient" },
          { label: "Bass", value: "Bass" },
          { label: "Drums", value: "Drums" },
          { label: "SFX", value: "SFX" },
          { label: "Pads", value: "Pads" },
          { label: "Strings", value: "Strings" },
          { label: "Voice", value: "Voice" },
          { label: "Percussion", value: "Percussion" },
          { label: "Pianos", value: "Pianos" },
          { label: "ELPiano", value: "ELPiano" },
          { label: "Synth", value: "Synth" },
          { label: "Brass", value: "Brass" },
          { label: "Winds", value: "Winds" },
          { label: "Harp", value: "Harp" },
          { label: "Ethnic", value: "Ethnic" },
          { label: "Pluck", value: "Pluck" },
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
