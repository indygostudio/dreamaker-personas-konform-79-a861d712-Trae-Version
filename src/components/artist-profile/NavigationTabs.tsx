import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Users, Users2, MoreHorizontal, Star } from "lucide-react";
import { useEffect, useRef } from "react";
interface NavigationTabsProps {
  profile: any;
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  onMouseEnter?: (tab: string) => void;
}
export const NavigationTabs = ({
  profile,
  defaultTab = "profiles",
  activeTab,
  onTabChange,
  onMouseEnter
}: NavigationTabsProps) => {
  const navRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && window.scrollY > entry.boundingClientRect.top) {
        window.scrollTo({
          top: entry.boundingClientRect.top,
          behavior: 'smooth'
        });
      }
    }, {
      threshold: 0.1
    });
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={navRef} className="sticky top-0 z-50 py-2">
      <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="flex w-full items-center justify-center gap-2">
          <TabsTrigger value="profiles" onMouseEnter={() => onMouseEnter?.("profiles")} className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5">
            <Users2 className="h-4 w-4 mr-2" />
            <span>User Profiles</span>
          </TabsTrigger>
          
          <TabsTrigger value="personas" className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5" onMouseEnter={() => onMouseEnter?.("personas")}>
            <Users className="h-4 w-4 mr-2" />
            <span>Personas</span>
          </TabsTrigger>
          
          <TabsTrigger value="collaborations" className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5" onMouseEnter={() => onMouseEnter?.("collaborations")}>
            <Users2 className="h-4 w-4 mr-2" />
            <span>Collaborations</span>
          </TabsTrigger>
          
          <TabsTrigger value="collections" className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5" onMouseEnter={() => onMouseEnter?.("collections")}>
            <Star className="h-4 w-4 mr-2" />
            <span>Collections</span>
          </TabsTrigger>
          
          <TabsTrigger value="media" className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border text-white/80 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5" onMouseEnter={() => onMouseEnter?.("media")}>
            <Music className="h-4 w-4 mr-2" />
            <span>Media</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};