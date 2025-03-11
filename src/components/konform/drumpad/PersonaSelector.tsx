
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PersonaAvatar } from "@/components/persona/card/PersonaAvatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { toast } from "sonner";

interface PersonaSelectorProps {
  onSelect: (personaId: string) => void;
  onClose?: () => void;
}

export const PersonaSelector = ({ onSelect, onClose }: PersonaSelectorProps) => {
  const { data: personas, isLoading } = useQuery({
    queryKey: ['personas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .in('type', ['AI_INSTRUMENTALIST', 'AI_EFFECT'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleSelect = (personaId: string) => {
    onSelect(personaId);
    toast("Persona selected successfully");
    onClose?.();
  };

  if (isLoading) {
    return <div>Loading personas...</div>;
  }

  return (
    <Card className="bg-black/40 border-konform-neon-blue/20">
      <div className="flex items-center justify-between p-4 border-b border-konform-neon-blue/20">
        <h3 className="text-lg font-semibold">Select Persona</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[300px] p-4">
        <div className="grid grid-cols-4 gap-4">
          {personas?.map((persona) => (
            <div 
              key={persona.id} 
              className="text-center cursor-pointer"
              onClick={() => handleSelect(persona.id)}
            >
              <PersonaAvatar 
                avatarUrl={persona.avatar_url}
                name={persona.name}
                personaId={persona.id}
                type={persona.type}
              />
              <span className="text-sm mt-2 block">{persona.name}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
