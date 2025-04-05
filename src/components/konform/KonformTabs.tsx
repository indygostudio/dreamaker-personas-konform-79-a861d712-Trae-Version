import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KonformBanner } from "./KonformBanner";
import { useHeaderStore } from "./store/headerStore";
import { useState, useEffect } from "react";
import { FileText, Edit3, Video, Settings, Save } from "lucide-react";
import { MixerView } from "./mixer/MixerView";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Collaborators } from "./daw/sections/Collaborators";
import { useLocation, useSearchParams } from "react-router-dom";
import { EditorTabs } from "./editor/EditorTabs";
import { LyricsView } from "./lyrics/LyricsView";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import VideoTab from "./video/VideoTab";

export const KonformTabs = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const {
    konformHeaderCollapsed,
    setKonformHeaderCollapsed
  } = useHeaderStore();
  
  // Get the tab from URL query parameters or default to "editor"
  const urlTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(urlTab || "editor");

  useEffect(() => {
    // Update active tab when URL query parameter changes
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
    
    // Also check location state if available
    const state = location.state as {
      activeTab?: string;
      sessionId?: string;
    } | null;
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
    }
  }, [location, searchParams]);

  const {
    data: latestSession
  } = useQuery({
    queryKey: ['latest_collaboration'],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return null;
      const {
        data,
        error
      } = await supabase.from('collaboration_sessions').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      }).limit(1).single();
      if (error) {
        console.error('Error fetching latest session:', error);
        return null;
      }
      console.log('Latest session:', data);
      return data;
    }
  });

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-black to-konform-bg">
      <KonformBanner 
        title="KONFORM" 
        description="Advanced Audio Production Suite" 
        isCollapsed={konformHeaderCollapsed} 
        onCollapsedChange={setKonformHeaderCollapsed}
        latestSessionId={latestSession?.id}
      />
      
      <div className="container max-w-[3072px] mx-auto px-4 py-2">
        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="flex justify-center items-center gap-2 w-full rounded-full mb-4 p-1.5 bg-black/60 backdrop-blur-xl">
            <TabsTrigger 
              value="editor" 
              className="flex-1 min-width-[120px] px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
              text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 text-center"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              MUSIC
            </TabsTrigger>
            <TabsTrigger 
              value="video" 
              className="flex-1 min-width-[120px] px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
              text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 text-center"
            >
              <Video className="w-4 h-4 mr-2" />
              VIDEO
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex-1 min-width-[120px] px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
              text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 text-center"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              EDITOR
            </TabsTrigger>
          </TabsList>

          <div className="mt-2">
            <TabsContent value="editor">
              <EditorTabs />
            </TabsContent>
            <TabsContent value="video">
              {activeTab === "video" && (
                <div key="video-tab-content">
                  <VideoTab />
                </div>
              )}
            </TabsContent>
            <TabsContent value="settings">
              <div className="min-h-[calc(100vh-180px)] bg-black/40 rounded-lg" />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
