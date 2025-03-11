
import { useForm } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PersonaType } from "@/types/persona";

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

export const PersonaTypeSelector = ({ form }: PersonaTypeSelectorProps) => {
  return (
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
  );
};
