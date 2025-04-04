import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { PersonaHeader } from "@/components/persona/profile/PersonaHeader";
import { transformPersonaData } from "@/lib/utils/personaTransform";
import { PersonaDialog } from "@/components/PersonaDialog";
import { EditProfileDialog } from "@/components/artist-profile/EditProfileDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaCollectionsSection } from "@/components/persona/profile/MediaCollectionsSection";
import { PersonaSection } from "@/components/persona/profile/PersonaSection";
import { FeaturedWorks } from "@/components/persona/profile/FeaturedWorks";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Music, Star, Clock, Check, Edit2, Save, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/useUser";
import type { Persona, PersonaType } from "@/types/persona";
import { MindMap } from "@/components/persona/profile/MindMap";
import { AudioSection } from "@/components/persona/profile/AudioSection";
import { VideoSection } from "@/components/persona/profile/VideoSection";
import { ModelControls } from "@/components/persona/profile/ModelControls";
import AIStudioTabs from "@/components/ai-studio/AIStudioTabs";
import { ImageGallerySection } from "@/components/persona/profile/ImageGallerySection";
import { PromptLibrarySection } from "@/components/persona/profile/PromptLibrarySection";
import { ColorSchemeProvider } from "@/contexts/ColorSchemeContext";
import { AboutTabContent } from "@/components/persona/profile/AboutTabContent";

interface PersonaFormProps {
  persona?: Persona;
}

const modelParameters = {
  voiceCharacteristics: [{
    name: "Clarity",
    value: 75
  }, {
    name: "Stability",
    value: 85
  }, {
    name: "Similarity",
    value: 90
  }],
  acousticParameters: [{
    name: "Sample Rate",
    value: "44.1kHz"
  }, {
    name: "Bit Depth",
    value: "24-bit"
  }, {
    name: "Format",
    value: "WAV/MP3"
  }],
  trainingParameters: [{
    name: "Dataset Size",
    value: "2.5 hours"
  }, {
    name: "Training Steps",
    value: "300K"
  }, {
    name: "Batch Size",
    value: "32"
  }],
  performanceMetrics: [{
    name: "Latency",
    value: "200ms"
  }, {
    name: "Real-time Factor",
    value: "0.95"
  }, {
    name: "GPU Memory",
    value: "8GB"
  }]
};

export default function PersonaProfile({
  persona: propPersona
}: PersonaFormProps) {
  const { id } = useParams();
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isAboutEditing, setIsAboutEditing] = useState(false);
  const [selectedModel, setSelectedModel] = useState("default");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("media");
  const [activeMediaTab, setActiveMediaTab] = useState("audio");
  const [aboutForm, setAboutForm] = useState({
    description: "",
    voice_type: "",
    genre_specialties: [] as string[],
    artist_category: "",
    vocal_style: ""
  });

  const {
    data: persona,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["persona", id],
    queryFn: async () => {
      if (!id) throw new Error("Invalid persona ID");
      const {
        data,
        error
      } = await supabase.from("personas").select("*").eq("id", id).maybeSingle();
      if (error) {
        console.error("Error fetching persona:", error);
        toast.error("Failed to load persona");
        throw error;
      }
      if (!data) {
        toast.error("Persona not found");
        navigate("/personas");
        return null;
      }
      return transformPersonaData(data);
    },
    enabled: Boolean(id),
    initialData: propPersona
  });

  const updateMutation = useMutation({
    mutationFn: async (updateData: typeof aboutForm) => {
      if (!id) throw new Error("No persona ID");
      const {
        error
      } = await supabase.from("personas").update(updateData).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("About section updated successfully");
      refetch();
      setIsAboutEditing(false);
    },
    onError: error => {
      toast.error("Failed to update about section");
      console.error("Update error:", error);
    }
  });

  const handleEditClick = () => {
    console.log("Edit button clicked, setting isEditing to true");
    setIsEditing(true);
    console.log("isEditing after update:", true); // Will always log true
  };

  const handleAboutEditClick = () => {
    setAboutForm({
      description: persona?.description || "",
      voice_type: persona?.voice_type || "",
      genre_specialties: persona?.genre_specialties || [],
      artist_category: persona?.artist_category || "",
      vocal_style: persona?.vocal_style || ""
    });
    setIsAboutEditing(true);
  };

  const handleAboutSave = () => {
    updateMutation.mutate(aboutForm);
  };

  const isOwner = user?.id === persona?.user_id;

  const handleHeaderHover = (isHovered: boolean) => {
    setIsHeaderExpanded(isHovered);
  };

  // Handle tab changes to manage audio playback
  useEffect(() => {
    // Only manage audio when switching away from the audio section
    if (activeTab !== "media" || activeMediaTab !== "audio") {
      // Store the current playback state
      const audio = document.querySelector('audio');
      if (audio) {
        // Instead of stopping, just store the current time
        audio.dataset.lastPosition = audio.currentTime.toString();
      }
    } else {
      // Restore playback state when returning to audio section
      const audio = document.querySelector('audio');
      if (audio && audio.dataset.lastPosition) {
        audio.currentTime = parseFloat(audio.dataset.lastPosition);
      }
    }
  }, [activeTab, activeMediaTab]);

  // Handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Show/hide scroll button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (error) {
    return <div className="min-h-screen bg-dreamaker-bg flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Persona Not Found</h1>
          <p className="text-gray-400">The persona you're looking for doesn't exist or you don't have permission to view it.</p>
        </div>
      </div>;
  }

  if (isLoading || !persona) {
    return <div className="min-h-screen bg-dreamaker-bg flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>;
  }

  const primaryImageUrl = persona.banner_url || persona.avatar_url || null;

  return (
    <div className="min-h-screen bg-dreamaker-bg">
      <PersonaHeader 
        persona={persona} 
        isHeaderExpanded={isHeaderExpanded} 
        setIsHeaderExpanded={setIsHeaderExpanded} 
        onEditClick={handleEditClick}
        onHeaderHover={handleHeaderHover}
      />

      <ColorSchemeProvider imageUrl={primaryImageUrl}>
        <div className="container mx-auto px-4 pt-4">
          <Tabs 
            defaultValue="media" 
            className="w-full"
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
            }}
          >
            <TabsList className="grid w-full grid-cols-4 rounded-xl glass-panel p-1">
              <TabsTrigger 
                value="about" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
                text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
              >
                About
              </TabsTrigger>
              <TabsTrigger 
                value="media" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
                text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
              >
                Showcase
              </TabsTrigger>
              <TabsTrigger 
                value="ai-studio" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
                text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
              >
                AI Studio
              </TabsTrigger>
              <TabsTrigger 
                value="mindmap" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
                text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
              >
                Mindmap
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <AboutTabContent 
                persona={persona}
                isOwner={isOwner}
                isAboutEditing={isAboutEditing}
                aboutForm={aboutForm}
                setAboutForm={setAboutForm}
                handleAboutEditClick={handleAboutEditClick}
                handleAboutSave={handleAboutSave}
                updateMutation={updateMutation}
              />
            </TabsContent>

            <TabsContent value="media">
              <Tabs 
                defaultValue="audio" 
                className="w-full"
                value={activeMediaTab}
                onValueChange={setActiveMediaTab}
              >
                <TabsList className="grid grid-cols-7 rounded-xl bg-black/20 backdrop-blur-xl border border-white/10 p-1 my-0 py-0 px-[96px]">
                  <TabsTrigger 
                    value="audio" 
                    className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
                    text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
                  >
                    Audio
                  </TabsTrigger>
                  <TabsTrigger 
                    value="video" 
                    className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
                    text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
                  >
                    Video
                  </TabsTrigger>
                  <TabsTrigger 
                    value="image" 
                    className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
                    text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
                  >
                    Image
                  </TabsTrigger>
                  <TabsTrigger 
                    value="prompt" 
                    className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
                    text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
                  >
                    Prompt
                  </TabsTrigger>
                  <TabsTrigger 
                    value="models" 
                    className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
                    text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
                  >
                    Models
                  </TabsTrigger>
                  <TabsTrigger 
                    value="projects" 
                    className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
                    text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
                  >
                    Projects
                  </TabsTrigger>
                  <TabsTrigger 
                    value="plugins" 
                    className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
                    text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
                  >
                    Plugins
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="audio" className="mt-6">
                  <AudioSection 
                    persona={persona} 
                    selectedModel={selectedModel}
                    isActive={activeTab === "media" && activeMediaTab === "audio"} 
                  />
                </TabsContent>

                <TabsContent value="video" className="mt-6">
                  <VideoSection personaId={persona.id} isOwner={user?.id === persona.user_id} />
                </TabsContent>

                <TabsContent value="image" className="mt-6">
                  <ImageGallerySection personaId={persona.id} />
                </TabsContent>

                <TabsContent value="prompt" className="mt-6">
                  <PromptLibrarySection personaId={persona.id} />
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

            <TabsContent value="ai-studio" className="mt-4">
              <AIStudioTabs persona={persona} />
            </TabsContent>

            <TabsContent value="mindmap" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Neural Network</h2>
                    <p className="text-gray-400">Interactive visualization of voice model parameters and connections</p>
                  </div>
                </div>
                <MindMap persona={persona} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ColorSchemeProvider>

      <EditProfileDialog 
        open={isEditing} 
        onOpenChange={setIsEditing} 
        profile={{
          id: persona.id,
          username: persona.name,
          avatar_url: persona.avatar_url || "",
          banner_url: persona.banner_url || "",
          is_public: persona.is_public,
          persona_types: [persona.type as PersonaType]
        }}
        onSuccess={() => {
          refetch();
          setIsEditing(false);
        }}
      />

      {/* Scroll to top button */}
      {showScrollTop && (
        <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
          <Button 
            size="icon"
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-dreamaker-purple/80 hover:bg-dreamaker-purple shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-6 h-6 text-white" />
          </Button>
        </div>
      )}
    </div>
  );
}
