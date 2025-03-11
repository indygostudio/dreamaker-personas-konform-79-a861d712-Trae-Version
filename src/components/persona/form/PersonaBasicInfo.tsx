
import { useForm } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PersonaBasicInfoProps {
  form: ReturnType<typeof useForm>;
}

export const PersonaBasicInfo = ({ form }: PersonaBasicInfoProps) => {
  const [isGeneratingName, setIsGeneratingName] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const generateContent = async (type: 'name' | 'description') => {
    const setLoading = type === 'name' ? setIsGeneratingName : setIsGeneratingDescription;
    setLoading(true);
    
    try {
      const currentValue = form.watch(type) || '';
      const { data, error } = await supabase.functions.invoke('generate-persona-content', {
        body: { 
          type,
          prompt: currentValue // Pass the current field value as additional context
        }
      });

      if (error) throw error;
      
      form.setValue(type, data.content);
      toast.success(`Generated ${type} successfully!`);
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error(`Failed to generate ${type}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="Enter persona name" {...field} />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => generateContent('name')}
                  disabled={isGeneratingName}
                >
                  <Sparkles className={`h-4 w-4 ${isGeneratingName ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Textarea 
                    placeholder="Describe your persona"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => generateContent('description')}
                  disabled={isGeneratingDescription}
                >
                  <Sparkles className={`h-4 w-4 ${isGeneratingDescription ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
