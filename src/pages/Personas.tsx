import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic2, Guitar, Settings2, Keyboard, Wand2, Search, PlusCircle } from "lucide-react";
import type { Persona, PersonaType } from "@/types/persona";
import { PersonaCard } from "@/components/persona/card/PersonaCard";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const PersonaTypes: { value: PersonaType | 'all'; label: string; icon: any }[] = [
  { value: "all", label: "All Types", icon: Mic2 },
  { value: "AI_VOCALIST", label: "AI Vocalists", icon: Mic2 },
  { value: "AI_INSTRUMENTALIST", label: "AI Instrumentalists", icon: Guitar },
  { value: "AI_MIXER", label: "AI Mixers", icon: Settings2 },
  { value: "AI_EFFECT", label: "AI Effects", icon: Wand2 },
  { value: "AI_SOUND", label: "AI Sounds", icon: Keyboard },
];

export default function Personas() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<PersonaType | 'all'>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: personas = [], isLoading } = useQuery({
    queryKey: ["public-personas", selectedType, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("persona_cards")
        .select("*")
        .eq("is_public", true);

      if (selectedType !== "all") {
        query = query.eq("type", selectedType);
      }

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Error loading personas",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data as Persona[];
    },
  });

  const filteredPersonas = personas.filter((persona) =>
    persona.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">Personas</h1>
          <Button
            onClick={() => navigate("/personas/create")}
            className="bg-dreamaker-purple hover:bg-dreamaker-purple/90"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Persona
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search personas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Tabs defaultValue="all" value={selectedType} onValueChange={(value) => setSelectedType(value as PersonaType | 'all')}>
          <TabsList className="grid grid-cols-6 w-full">
            {PersonaTypes.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div>Loading...</div>
              ) : filteredPersonas.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400">No personas found</p>
                </div>
              ) : (
                filteredPersonas.map((persona) => (
                  <PersonaCard
                    key={persona.id}
                    persona={persona}
                    onClick={() => navigate(`/personas/${persona.id}`)}
                  />
                ))
              )}
            </div>
          </TabsContent>
          {PersonaTypes.slice(1).map(({ value }) => (
            <TabsContent key={value} value={value} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  filteredPersonas
                    .filter((p) => p.type === value)
                    .map((persona) => (
                      <PersonaCard
                        key={persona.id}
                        persona={persona}
                        onClick={() => navigate(`/personas/${persona.id}`)}
                      />
                    ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
