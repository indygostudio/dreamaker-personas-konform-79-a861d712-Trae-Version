
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfileSection } from "@/components/dreamaker/UserProfileSection";
import { PersonaSection } from "@/components/dreamaker/PersonaSection";
import { CollaborationSection } from "@/components/dreamaker/CollaborationSection";
import { MediaSection } from "@/components/dreamaker/MediaSection";
import { HeroSection } from "@/components/persona/sections/HeroSection";

export default function Dreamaker() {
  const { data: publicProfiles } = useQuery({
    queryKey: ["public-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_public", true);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-dreamaker-bg">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profiles" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-xl bg-dreamaker-purple/10 p-1">
            <TabsTrigger value="profiles" className="w-full rounded-lg data-[state=active]:bg-dreamaker-purple">
              User Profiles
            </TabsTrigger>
            <TabsTrigger value="personas" className="w-full rounded-lg data-[state=active]:bg-dreamaker-purple">
              Personas
            </TabsTrigger>
            <TabsTrigger value="collaborations" className="w-full rounded-lg data-[state=active]:bg-dreamaker-purple">
              Collaborations
            </TabsTrigger>
            <TabsTrigger value="media" className="w-full rounded-lg data-[state=active]:bg-dreamaker-purple">
              Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="mt-6">
            <UserProfileSection profiles={publicProfiles} />
          </TabsContent>

          <TabsContent value="personas" className="mt-6">
            <PersonaSection />
          </TabsContent>

          <TabsContent value="collaborations" className="mt-6">
            <CollaborationSection />
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <MediaSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
