
import { useForm } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import type { PersonaType } from "@/types/persona";

interface PersonaSpecificFieldsProps {
  form: ReturnType<typeof useForm>;
}

export const PersonaSpecificFields = ({ form }: PersonaSpecificFieldsProps) => {
  const type = form.watch("type") as PersonaType;

  const instruments = [
    "Guitar",
    "Bass",
    "Brass",
    "Wind",
    "Drums",
    "Piano",
    "Mallet",
    "Bell",
    "Strings",
    "Synth",
    "Other"
  ];
  
  const getSubtypeOptions = (type: PersonaType | null) => {
    switch (type) {
      case "AI_INSTRUMENTALIST":
        return [
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
          { label: "Pop", value: "Pop" },
          { label: "Rock", value: "Rock" },
          { label: "Jazz", value: "Jazz" },
          { label: "Classical", value: "Classical" },
          { label: "Hip Hop", value: "Hip Hop" },
          { label: "R&B", value: "R&B" },
        ];
      case "AI_CHARACTER":
        return [
          { label: "Confident", value: "Confident" },
          { label: "Shy", value: "Shy" },
          { label: "Energetic", value: "Energetic" },
          { label: "Calm", value: "Calm" },
          { label: "Mysterious", value: "Mysterious" },
          { label: "Friendly", value: "Friendly" },
          { label: "Serious", value: "Serious" },
          { label: "Playful", value: "Playful" },
        ];
      case "AI_EFFECT":
        return [
          { label: "Reverb", value: "Reverb" },
          { label: "Delay", value: "Delay" },
          { label: "Echo", value: "Echo" },
          { label: "Saturation", value: "Saturation" },
          { label: "Chorus", value: "Chorus" },
          { label: "Flanger", value: "Flanger" },
          { label: "Phaser", value: "Phaser" },
          { label: "Slicer", value: "Slicer" },
          { label: "Multi", value: "Multi" },
          { label: "EQ", value: "EQ" },
          { label: "Compressor", value: "Compressor" },
          { label: "Limiter", value: "Limiter" },
        ];
      case "AI_SOUND":
        return [
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
  };

  const ageGroups = [
    "Baby",
    "Child",
    "Teen",
    "Young Adult",
    "Adult",
    "Middle Aged",
    "Elderly"
  ];

  const styles = [
    "Pop",
    "Rock",
    "Hip Hop",
    "R&B",
    "Jazz",
    "Classical",
    "Electronic",
    "Folk",
    "Country",
    "Blues",
    "Indie",
    "Metal",
    "Reggae",
    "Soul",
    "Funk"
  ];

  const characterTraits = [
    "Confident",
    "Shy",
    "Energetic",
    "Calm",
    "Mysterious",
    "Friendly",
    "Serious",
    "Playful",
    "Romantic",
    "Rebellious",
    "Traditional",
    "Creative",
    "Analytical",
    "Empathetic",
    "Reserved"
  ];

  const voiceTypes = [
    "Soprano",
    "Mezzo-soprano",
    "Alto",
    "Countertenor",
    "Tenor",
    "Baritone",
    "Bass",
    "Lyric",
    "Dramatic",
    "Coloratura",
    "Spinto",
    "Heldentenor",
    "Basso profondo",
    "Contralto"
  ];

  const vocalStyles = [
    "Syllabic",
    "Melismatic",
    "Neumatic"
  ];

  const LabelWithTooltip = ({ label, tooltip }: { label: string; tooltip: string }) => (
    <div className="flex items-center gap-2">
      {label}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 text-gray-400" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="w-[200px] text-sm">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* All dropdown menus grouped on the left side */}
      <div className="space-y-4">
        {/* Subtype field - shows different options based on persona type */}
        {type && getSubtypeOptions(type).length > 0 && (
          <FormField
            control={form.control}
            name="subtype"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <LabelWithTooltip 
                    label={type === "AI_INSTRUMENTALIST" ? "Instrument" : 
                           type === "AI_VOCALIST" ? "Vocal Style" : 
                           type === "AI_CHARACTER" ? "Character Trait" :
                           type === "AI_EFFECT" ? "Effect Type" : "Subtype"}
                    tooltip={`Select the specific ${type === "AI_INSTRUMENTALIST" ? "instrument" : 
                                                type === "AI_VOCALIST" ? "vocal style" : 
                                                type === "AI_CHARACTER" ? "character trait" :
                                                type === "AI_EFFECT" ? "effect type" : "subtype"} for this persona`}
                  />
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="bg-black/50 border-dreamaker-purple/30">
                      <SelectValue placeholder={`Select ${type === "AI_INSTRUMENTALIST" ? "instrument" : 
                                                      type === "AI_VOCALIST" ? "vocal style" : 
                                                      type === "AI_CHARACTER" ? "character trait" :
                                                      type === "AI_EFFECT" ? "effect type" :
                                                      type === "AI_SOUND" ? "sound type" : "subtype"}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-black/90 border-dreamaker-purple/20">
                    {getSubtypeOptions(type).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        )}

        {/* Genre/Traits field */}
        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <LabelWithTooltip 
                  label={type === "AI_CHARACTER" ? "Traits" : "Genre"}
                  tooltip={type === "AI_CHARACTER" 
                    ? "Select the primary personality trait that defines your AI character"
                    : "Choose the primary musical genre that defines your AI persona's artistic direction"
                  }
                />
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-black/50 border-dreamaker-purple/30">
                    <SelectValue placeholder={type === "AI_CHARACTER" ? "Select trait" : "Select genre"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-black/90 border-dreamaker-purple/20">
                  {type === "AI_CHARACTER" 
                    ? characterTraits.map((trait) => (
                        <SelectItem key={trait} value={trait}>
                          {trait}
                        </SelectItem>
                      ))
                    : styles.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Age field */}
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <LabelWithTooltip 
                  label="Age Group" 
                  tooltip="Select the age range that best represents your AI persona's maturity and characteristics"
                />
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-black/50 border-dreamaker-purple/30">
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-black/90 border-dreamaker-purple/20">
                  {ageGroups.map((age) => (
                    <SelectItem key={age} value={age}>
                      {age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>

      {/* Voice type field (only for vocalists) */}
      {type === "AI_VOCALIST" && (
        <>
          <FormField
            control={form.control}
            name="voice_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <LabelWithTooltip 
                    label="Voice Type" 
                    tooltip="The vocal range and classification that determines the character and range of the AI voice"
                  />
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-black/50 border-dreamaker-purple/30">
                      <SelectValue placeholder="Select voice type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-black/90 border-dreamaker-purple/20">
                    {voiceTypes.map((voiceType) => (
                      <TooltipProvider key={voiceType}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem value={voiceType}>
                              {voiceType}
                            </SelectItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-sm">
                              {getVoiceTypeDescription(voiceType)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Vocal Styling field (only for vocalists) */}
          <FormField
            control={form.control}
            name="vocal_style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <LabelWithTooltip 
                    label="Vocal Styling" 
                    tooltip="Advanced singing technique that defines how notes are distributed across syllables"
                  />
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-black/50 border-dreamaker-purple/30">
                      <SelectValue placeholder="Select vocal styling" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-black/90 border-dreamaker-purple/20">
                    {vocalStyles.map((style) => (
                      <TooltipProvider key={style}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem value={style}>
                              {style}
                            </SelectItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-sm">
                              {getVocalStyleDescription(style)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};

// Helper function to get voice type descriptions
const getVoiceTypeDescription = (voiceType: string): string => {
  const descriptions: Record<string, string> = {
    "Soprano": "Highest female voice range, typically from middle C to high A",
    "Mezzo-soprano": "Middle female voice range, between soprano and alto",
    "Alto": "Lowest female voice range, typically from G below middle C",
    "Countertenor": "Male voice singing in traditionally female ranges",
    "Tenor": "Highest natural male voice range",
    "Baritone": "Middle male voice range, between tenor and bass",
    "Bass": "Lowest male voice range",
    "Lyric": "Light, agile voice with a bright timbre",
    "Dramatic": "Powerful, rich voice with great carrying power",
    "Coloratura": "Agile voice specialized in ornate melodic passages",
    "Spinto": "Lighter dramatic voice with notable carrying power",
    "Heldentenor": "Powerful tenor voice with dramatic qualities",
    "Basso profondo": "Exceptionally deep bass voice",
    "Contralto": "Lowest female voice type, rare and rich in tone"
  };
  return descriptions[voiceType] || "Voice classification type";
};

// Helper function to get vocal style descriptions
const getVocalStyleDescription = (style: string): string => {
  const descriptions: Record<string, string> = {
    "Syllabic": "One note per syllable, creating clear and direct vocal lines",
    "Melismatic": "Multiple notes sung to a single syllable, creating ornate melodic passages",
    "Neumatic": "Small groups of notes (2-4) per syllable, balanced between syllabic and melismatic"
  };
  return descriptions[style] || "Vocal styling technique";
};
}
