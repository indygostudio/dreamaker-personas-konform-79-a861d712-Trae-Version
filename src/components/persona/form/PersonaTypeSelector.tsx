
import { useForm } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PersonaType } from "@/types/persona";
import { useEffect } from "react";

interface PersonaTypeSelectorProps {
  form: ReturnType<typeof useForm>;
}

const PERSONA_TYPES = [
  { value: "ALL", label: "All Types" },
  { value: "AI_CHARACTER", label: "Character" },
  { value: "AI_VOCALIST", label: "Vocalist" },
  { value: "AI_INSTRUMENTALIST", label: "Instrumentalist" },
  { value: "AI_EFFECT", label: "Effect" },
  { value: "AI_SOUND", label: "Sound" },
  { value: "AI_MIXER", label: "Mixer" },
  { value: "AI_WRITER", label: "Writer" }
] as const;

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
      return [{ label: "All", value: null }];
  };
};

export const PersonaTypeSelector = ({ form }: PersonaTypeSelectorProps) => {
  const type = form.watch('type') as PersonaType;

  useEffect(() => {
    // Reset subtype when type changes
    form.setValue('subtype', null);
  }, [type, form]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-black/50 border-dreamaker-purple/30">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-black/90 border-dreamaker-purple">
                {PERSONA_TYPES.map((type) => (
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
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="subtype"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subtype</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value || ''}
              disabled={!type || type === 'ALL'}
            >
              <FormControl>
                <SelectTrigger className="bg-black/50 border-dreamaker-purple/30">
                  <SelectValue placeholder="Select a subtype" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-black/90 border-dreamaker-purple">
                {getSubtypeOptions(type).map((subtype) => (
                  <SelectItem
                    key={subtype.value || 'all'}
                    value={subtype.value || ''}
                    className="text-white hover:bg-dreamaker-purple/20"
                  >
                    {subtype.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
};
