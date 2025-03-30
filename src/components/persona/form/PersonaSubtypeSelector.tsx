import { useForm } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PersonaType, PersonaSubtype } from "@/types/persona";
import { useEffect } from "react";

interface PersonaSubtypeSelectorProps {
  form: ReturnType<typeof useForm>;
  personaType: PersonaType;
}

// Define subtypes for each persona type
const PERSONA_SUBTYPES: Record<PersonaType, { value: string; label: string }[]> = {
  AI_VOCALIST: [
    { value: "Gender", label: "Gender" },
    { value: "Genre", label: "Genre" },
    { value: "Range", label: "Range" },
    { value: "Technique", label: "Technique" }
  ],
  AI_INSTRUMENTALIST: [
    { value: "InstrumentCategory", label: "Instrument Category" },
    { value: "Style", label: "Style" },
    { value: "Technique", label: "Technique" }
  ],
  AI_CHARACTER: [
    { value: "Personality", label: "Personality" },
    { value: "Archetype", label: "Archetype" },
    { value: "Background", label: "Background" }
  ],
  AI_EFFECT: [
    { value: "EffectType", label: "Effect Type" },
    { value: "Application", label: "Application" },
    { value: "ProcessingStyle", label: "Processing Style" }
  ],
  AI_SOUND: [
    { value: "SoundCategory", label: "Sound Category" },
    { value: "Source", label: "Source" },
    { value: "Ambience", label: "Ambience" }
  ],
  AI_MIXER: [
    { value: "Specialty", label: "Specialty" },
    { value: "MixingStyle", label: "Mixing Style" },
    { value: "Workflow", label: "Workflow" }
  ],
  AI_WRITER: [
    { value: "WritingStyle", label: "Writing Style" },
    { value: "Genre", label: "Genre" },
    { value: "ContentType", label: "Content Type" }
  ]
};

// Define common subtype values for each subtype
const SUBTYPE_VALUES: Record<string, string[]> = {
  // Vocalist subtypes
  "Gender": ["Male", "Female", "Androgynous", "Child", "Group"],
  "Range": ["Soprano", "Mezzo-soprano", "Alto", "Tenor", "Baritone", "Bass"],
  "Vocalist_Genre": ["Pop", "Rock", "R&B", "Hip-Hop", "Country", "Jazz", "Classical", "Electronic", "Folk"],
  "Vocalist_Technique": ["Belting", "Falsetto", "Vibrato", "Growl", "Whisper", "Rap"],
  
  // Instrumentalist subtypes
  "InstrumentCategory": ["String", "Wind", "Brass", "Percussion", "Keyboard", "Electronic"],
  "Style": ["Classical", "Jazz", "Rock", "Folk", "Electronic", "Experimental"],
  "Instrumentalist_Technique": ["Finger-picking", "Strumming", "Slide", "Plucking", "Bowing"],
  
  // Character subtypes
  "Personality": ["Extrovert", "Introvert", "Analytical", "Creative", "Leader", "Supporter"],
  "Archetype": ["Hero", "Mentor", "Ally", "Trickster", "Shadow", "Herald"],
  "Background": ["Fantasy", "Sci-Fi", "Historical", "Contemporary", "Post-Apocalyptic"],
  
  // Effect subtypes
  "EffectType": ["Delay", "Reverb", "Distortion", "Modulation", "Dynamics", "Filter"],
  "Application": ["Vocals", "Instruments", "Mix", "Master", "Sound Design"],
  "ProcessingStyle": ["Subtle", "Extreme", "Vintage", "Modern", "Experimental"],
  
  // Sound subtypes
  "SoundCategory": ["Ambient", "FX", "Impact", "Transition", "Loop", "One-shot"],
  "Source": ["Synthesized", "Recorded", "Found Sound", "Hybrid"],
  "Ambience": ["Nature", "Urban", "Space", "Abstract", "Industrial"],
  
  // Mixer subtypes
  "Specialty": ["Vocals", "Full Mix", "Mastering", "Sound Design", "Electronic", "Orchestral"],
  "MixingStyle": ["Clean", "Punchy", "Warm", "Bright", "Lo-fi", "Hi-fi"],
  "Workflow": ["Analog", "Digital", "Hybrid", "In-the-box", "Modular"],
  
  // Writer subtypes
  "WritingStyle": ["Narrative", "Conversational", "Technical", "Poetic", "Humorous"],
  "Writer_Genre": ["Pop", "Rock", "Rap", "Country", "R&B", "Electronic", "Folk"],
  "ContentType": ["Lyrics", "Stories", "Technical", "Marketing", "Academic"]
};

export const PersonaSubtypeSelector = ({ form, personaType }: PersonaSubtypeSelectorProps) => {
  const subtypeOptions = PERSONA_SUBTYPES[personaType] || [];
  const currentSubtype = form.watch("subtype") as PersonaSubtype | undefined;
  const subtypeValueOptions = currentSubtype ? SUBTYPE_VALUES[currentSubtype] || [] : [];

  // Reset subtype when persona type changes
  useEffect(() => {
    form.setValue("subtype", "");
    form.setValue("subtype_value", "");
  }, [personaType, form]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="subtype"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subtype</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="bg-black/50 border-dreamaker-purple/30">
                  <SelectValue placeholder="Select a subtype" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-black/90 border-dreamaker-purple">
                {subtypeOptions.map((type) => (
                  <SelectItem 
                    key={type.value} 
                    value={type.value}
                    className="text-white hover:bg-dreamaker-purple/20"
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className="text-gray-400 text-xs">
              Categorizes this persona for more specific filtering and organization
            </FormDescription>
          </FormItem>
        )}
      />

      {currentSubtype && (
        <FormField
          control={form.control}
          name="subtype_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtype Value</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-black/50 border-dreamaker-purple/30">
                    <SelectValue placeholder={`Select a ${currentSubtype.toLowerCase()} value`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-black/90 border-dreamaker-purple">
                  {subtypeValueOptions.map((value) => (
                    <SelectItem 
                      key={value} 
                      value={value}
                      className="text-white hover:bg-dreamaker-purple/20"
                    >
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-gray-400 text-xs">
                Specific value within the selected subtype
              </FormDescription>
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
