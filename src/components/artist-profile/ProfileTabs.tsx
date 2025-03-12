
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MusicSection } from "./MusicSection";
import { MediaSection } from "./MediaSection";
import { VideoSection } from "./VideoSection";
import { ImageSection } from "./ImageSection";
import { ArtistPersonas } from "./ArtistPersonas";
import { ArtistStats } from "./ArtistStats";
import { ArtistAchievements } from "./ArtistAchievements";
import { ArtistMindMap } from "./ArtistMindMap";
import PersonaDemo from "@/pages/PersonaDemo";
import type { Persona } from "@/types/persona";
import { transformPersonaData } from "@/lib/utils/personaTransform";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Edit } from "lucide-react";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { useUIStore } from "@/stores/uiStore";

interface ProfileTabsProps {
  selectedPersona: Persona | null;
  personas: Persona[] | undefined;
  onPersonaSelect: (persona: Persona) => void;
  profile: any;
}

export const ProfileTabs = ({ 
  selectedPersona, 
  personas, 
  onPersonaSelect, 
  profile 
}: ProfileTabsProps) => {
  const transformedPersonas = personas?.map(transformPersonaData);
  const [bio, setBio] = useState(profile?.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personas");
  const { showDropContainer, setShowDropContainer } = useSelectedPersonasStore();
  const { setHeaderExpanded } = useUIStore();
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const saveTabSelection = (tab: string) => {
    localStorage.setItem('artistProfileActiveTab', tab);
  };

  useEffect(() => {
    const savedTab = localStorage.getItem('artistProfileActiveTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropContainer(true);
    setHeaderExpanded(false);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSaveBio = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ bio: bio })
        .eq('id', profile.id);

      if (error) throw error;

      toast.success("Bio updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating bio:", error);
      toast.error("Failed to update bio");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className="relative"
    >
      <div 
        ref={tabsRef} 
        className="sticky top-[88px] z-30 glass-morphism py-3"
      >
        <Tabs 
          defaultValue={activeTab} 
          className=""
          onValueChange={(value) => {
            setActiveTab(value);
            saveTabSelection(value);
          }}
        >
          <TabsList className="grid w-full grid-cols-4 rounded-xl glass-panel p-1.5">
            <TabsTrigger 
              value="about" 
              className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
              text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
            >
              About
            </TabsTrigger>
            <TabsTrigger 
              value="personas" 
              className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
              text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
            >
              Personas
            </TabsTrigger>
            <TabsTrigger 
              value="media" 
              className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
              text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
            >
              Media
            </TabsTrigger>
            <TabsTrigger 
              value="mindmap" 
              className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
              text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
            >
              Mindmap
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-6">
            <div className="space-y-8">
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">About</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isEditing ? handleSaveBio : handleEditClick}
                    disabled={isSaving}
                    className="glass-tab hover:glass-tab-active border-blue-500/30"
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save"}
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
                {isEditing ? (
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write something about yourself..."
                    className="glass-morphism border-blue-900/30 text-blue-100/90 min-h-[120px] mb-6 resize-none"
                  />
                ) : (
                  <p className="text-blue-100/90 mb-6 select-none">
                    {bio || "No description available"}
                  </p>
                )}
              </div>
              
              <div className="space-y-8">
                <ArtistStats profile={profile} />
                <ArtistAchievements profile={profile} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="personas" className="mt-6">
            <ArtistPersonas 
              personas={transformedPersonas || []} 
              onPersonaSelect={onPersonaSelect}
            />
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <Tabs defaultValue="album" className="w-full">
              <TabsList className="flex w-full overflow-x-auto space-x-2 glass-panel p-1.5">
                <TabsTrigger 
                  value="album" 
                  className="rounded-full glass-tab px-8 data-[state=active]:glass-tab-active data-[state=active]:text-blue-50 transition-all"
                >
                  Album
                </TabsTrigger>
                <TabsTrigger 
                  value="music" 
                  className="rounded-full glass-tab px-8 data-[state=active]:glass-tab-active data-[state=active]:text-blue-50 transition-all"
                >
                  Audio
                </TabsTrigger>
                <TabsTrigger 
                  value="video" 
                  className="rounded-full glass-tab px-8 data-[state=active]:glass-tab-active data-[state=active]:text-blue-50 transition-all"
                >
                  Video
                </TabsTrigger>
                <TabsTrigger 
                  value="image" 
                  className="rounded-full glass-tab px-8 data-[state=active]:glass-tab-active data-[state=active]:text-blue-50 transition-all"
                >
                  Image
                </TabsTrigger>
                <TabsTrigger 
                  value="prompt" 
                  className="rounded-full glass-tab px-8 data-[state=active]:glass-tab-active data-[state=active]:text-blue-50 transition-all"
                >
                  Prompt
                </TabsTrigger>
                <TabsTrigger 
                  value="models" 
                  className="rounded-full glass-tab px-8 data-[state=active]:glass-tab-active data-[state=active]:text-blue-50 transition-all"
                >
                  Models
                </TabsTrigger>
                <TabsTrigger 
                  value="projects" 
                  className="rounded-full glass-tab px-8 data-[state=active]:glass-tab-active data-[state=active]:text-blue-50 transition-all"
                >
                  Projects
                </TabsTrigger>
                <TabsTrigger 
                  value="plugins" 
                  className="rounded-full glass-tab px-8 data-[state=active]:glass-tab-active data-[state=active]:text-blue-50 transition-all"
                >
                  Plug-ins
                </TabsTrigger>
              </TabsList>

              <TabsContent value="album" className="mt-6">
                <MediaSection profile={profile} />
              </TabsContent>

              <TabsContent value="music" className="mt-6">
                <div className="space-y-8">
                  {selectedPersona && (
                    <MusicSection 
                      artistId={profile?.id}
                      persona={selectedPersona}
                      selectedModel="default"
                    />
                  )}
                  {selectedPersona && (
                    <PersonaDemo 
                      id={selectedPersona.id}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="video" className="mt-6">
                {selectedPersona ? (
                  <VideoSection 
                    artistId={profile?.id || ''}
                    persona={selectedPersona} 
                  />
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    Select a persona to view videos
                  </div>
                )}
              </TabsContent>

              <TabsContent value="image" className="mt-6">
                <div className="text-center py-8 text-gray-400">
                  Image content coming soon
                </div>
              </TabsContent>

              <TabsContent value="prompt" className="mt-6">
                <div className="text-center py-8 text-gray-400">
                  Prompt content coming soon
                </div>
              </TabsContent>

              <TabsContent value="models" className="mt-6">
                <div className="text-center py-8 text-gray-400">
                  Models content coming soon
                </div>
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <div className="text-center py-8 text-gray-400">
                  Projects content coming soon
                </div>
              </TabsContent>

              <TabsContent value="plugins" className="mt-6">
                <div className="text-center py-8 text-gray-400">
                  Plug-ins content coming soon
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="mindmap" className="mt-6">
            {transformedPersonas && transformedPersonas.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Neural Network</h2>
                    <p className="text-blue-100/70">Visualize how your personas connect with the AI network</p>
                  </div>
                </div>
                <ArtistMindMap personas={transformedPersonas} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
