
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

interface PersonaSpecificFieldsProps {
  form: ReturnType<typeof useForm>;
}

export const PersonaSpecificFields = ({ form }: PersonaSpecificFieldsProps) => {
  const type = form.watch("type");

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
    <div className="space-y-4">
      {/* Instrument field (only for instrumentalists) */}
      {type === "AI_INSTRUMENTALIST" && (
        <FormField
          control={form.control}
          name="instrument"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <LabelWithTooltip 
                  label="Instrument" 
                  tooltip="Select the primary instrument this AI persona specializes in"
                />
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-black/50 border-dreamaker-purple/30">
                    <SelectValue placeholder="Select instrument" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-black/90 border-dreamaker-purple/20">
                  {instruments.map((instrument) => (
                    <SelectItem key={instrument} value={instrument}>
                      {instrument}
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
