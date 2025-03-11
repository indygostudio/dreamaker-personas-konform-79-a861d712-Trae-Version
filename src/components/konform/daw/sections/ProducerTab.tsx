import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonaCard } from "@/components/PersonaCard";
import type { Persona } from "@/components/dreamaker/types";

interface ProducerTabProps {
  personas: Persona[];
  onPersonaSelect: (persona: Persona) => void;
}

export const ProducerTab = ({ personas, onPersonaSelect }: ProducerTabProps) => {
  const [selectedTab, setSelectedTab] = useState("all");

  const renderPersonas = (filterFn: (persona: Persona) => boolean) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {personas.filter(filterFn).map((persona) => (
        <PersonaCard
          key={persona.id}
          persona={persona}
          onEdit={() => {}}
          onDelete={() => {}}
          selectionMode={false}
          onSelect={() => onPersonaSelect(persona)}
        />
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Producer</h2>
        <Button variant="outline">Add Track</Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="vocalists">Vocalists</TabsTrigger>
          <TabsTrigger value="instruments">Instruments</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 h-[calc(100%-2.5rem)]">
          <div className="p-4">
            <TabsContent value="all">
              {renderPersonas(() => true)}
            </TabsContent>
            <TabsContent value="vocalists">
              {renderPersonas((p) => p.type === "AI_VOCALIST")}
            </TabsContent>
            <TabsContent value="instruments">
              {renderPersonas(
                (p) => p.type === "AI_INSTRUMENTALIST" || p.type === "AI_EFFECT"
              )}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
