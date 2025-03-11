
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonaCard } from "@/components/PersonaCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PersonaDialog } from "@/components/PersonaDialog";
import { useToast } from "@/hooks/use-toast";
import type { Persona } from "@/components/dreamaker/types";
import { transformPersonaData } from "@/lib/utils/personaTransform";

interface BrowserTabProps {
  selectedPersona: Persona | null;
  onPersonaSelect: (persona: Persona) => void;
}

export const BrowserTab = ({ selectedPersona, onPersonaSelect }: BrowserTabProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: personas, isLoading, refetch } = useQuery({
    queryKey: ["personas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(transformPersonaData);
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("personas")
        .delete()
        .eq("id", id)
        .eq("user_id", session?.user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Persona deleted successfully",
      });

      await refetch();
    } catch (error) {
      console.error("Error deleting persona:", error);
      toast({
        title: "Error",
        description: "Failed to delete persona",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (persona: Persona) => {
    onPersonaSelect(persona);
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-[200px] rounded-lg" />
      ))}
    </div>
  );

  const renderPersonas = (filterFn: (persona: Persona) => boolean) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {personas
        ?.filter(filterFn)
        .map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            onEdit={() => handleEdit(persona)}
            onDelete={() => handleDelete(persona.id)}
            selectionMode={false}
          />
        ))}
    </div>
  );

  const handleSuccess = async () => {
    await refetch();
    toast({
      title: "Success",
      description: "Persona created successfully",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Browser</h2>
        {session && (
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-dreamaker-purple hover:bg-dreamaker-purple/90"
          >
            Create Persona
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="flex-1">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="my">My Personas</TabsTrigger>
          <TabsTrigger value="vocalists">Vocalists</TabsTrigger>
          <TabsTrigger value="instruments">Instruments</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 h-[calc(100%-2.5rem)]">
          <div className="p-4">
            {isLoading ? (
              renderSkeletons()
            ) : (
              <>
                <TabsContent value="all">
                  {renderPersonas(() => true)}
                </TabsContent>
                <TabsContent value="my">
                  {renderPersonas(
                    (persona) => persona.user_id === session?.user?.id
                  )}
                </TabsContent>
                <TabsContent value="vocalists">
                  {renderPersonas((persona) => persona.type === "AI_VOCALIST")}
                </TabsContent>
                <TabsContent value="instruments">
                  {renderPersonas(
                    (persona) =>
                      persona.type === "AI_INSTRUMENTALIST" ||
                      persona.type === "AI_EFFECT"
                  )}
                </TabsContent>
              </>
            )}
          </div>
        </ScrollArea>
      </Tabs>

      <PersonaDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        persona={null}
        onSuccess={handleSuccess}
      />
    </div>
  );
};
