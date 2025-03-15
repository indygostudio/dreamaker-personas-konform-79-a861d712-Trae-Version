
import { ChevronDown, ChevronUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { Collaborators } from "./daw/sections/Collaborators";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface KonformBannerProps {
  title: string;
  description: string;
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  rightContent?: ReactNode;
  latestSessionId?: string;
}

export const KonformBanner = ({
  title,
  description,
  isCollapsed,
  onCollapsedChange,
  rightContent,
  latestSessionId,
}: KonformBannerProps) => {
  // Fetch latest session if not provided
  const { data: latestSession } = useQuery({
    queryKey: ['latest_collaboration_banner'],
    queryFn: async () => {
      if (latestSessionId) return { id: latestSessionId };
      
      const {
        data: { user }
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
      
      return data;
    },
    enabled: !isCollapsed
  });
  return (
    <div className={`relative bg-black/40 backdrop-blur-xl border-b border-konform-neon-blue/20 transition-all duration-300 ${isCollapsed ? 'py-4' : 'py-8'}`} style={{ height: isCollapsed ? 'auto' : 'calc(100vh - 120px)' }}>
      <video 
        className="absolute inset-0 w-full h-full object-cover -z-10"
        src="/Videos/KONFORM_BG_03.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10" />
      
      <div className="container mx-auto px-6 h-full flex flex-col">
        <div className="flex justify-between items-center">
          <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'text-center' : ''}`}>
            <h1 className={`text-4xl font-bold text-white transition-all duration-300 ${isCollapsed ? 'text-3xl' : ''}`}>
              {title}
            </h1>
            <p className={`text-gray-400 mt-2 transition-all duration-300 ${isCollapsed ? 'hidden' : ''}`}>
              {description}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
              {rightContent}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCollapsedChange(!isCollapsed)}
              className="text-white/80 hover:text-white"
            >
              {isCollapsed ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Project content that appears when expanded */}
        <div className={`flex-1 overflow-y-auto mt-6 transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
          {!isCollapsed && latestSession && (
            <div className="space-y-4">
              <Collaborators sessionId={latestSession.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
