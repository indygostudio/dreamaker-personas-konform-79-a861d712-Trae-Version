import { cn } from "@/lib/utils";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import {
  Music,
  FileText,
  Mic,
  Layers,
  Music2,
  Video,
  Settings,
  SlidersHorizontal,
  Camera
} from "lucide-react";
import { Separator } from "../ui/separator";
import { useState, useEffect } from "react";
import { MixerSnapshots } from "./mixer/MixerSnapshots";
import { useKonformProject } from "@/hooks/useKonformProject";

export interface KonformNavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export function KonformLayout({
  children,
  className,
  isCollapsed = false,
}: {
  children: React.ReactNode;
  className?: string;
  isCollapsed?: boolean;
}) {
  return (
    <div className={cn("grid h-screen", className)}>
      <div className="grid grid-cols-[auto_1fr] h-full">
        <KonformNav isCollapsed={isCollapsed} />
        <main className="h-screen overflow-auto bg-[#0F0F13]">{children}</main>
      </div>
    </div>
  );
}

export function KonformNav({ className, isCollapsed = false }: KonformNavProps) {
  const pathname = usePathname();
  const [currentChannels, setCurrentChannels] = useState<any[]>([]);
  const { mixerState } = useKonformProject();
  const [showSnapshots, setShowSnapshots] = useState(false);
  
  // Handle snapshots recall
  const handleRecallSnapshot = (channelStates: any[]) => {
    // Dispatch an event that MixbaseView can listen for
    window.dispatchEvent(
      new CustomEvent('recall-snapshot', { detail: { channelStates } })
    );
  };
  
  // Get mixer state when available
  useEffect(() => {
    if (mixerState?.channels?.length) {
      console.log('Setting current channels in KonformLayout:', mixerState.channels);
      setCurrentChannels(mixerState.channels);
    } else {
      // Try to get channels directly from localStorage as fallback
      try {
        const savedMixerState = localStorage.getItem('konform-mixer-state');
        if (savedMixerState) {
          const parsed = JSON.parse(savedMixerState);
          if (parsed.channels && Array.isArray(parsed.channels)) {
            console.log('Using channels from localStorage:', parsed.channels);
            setCurrentChannels(parsed.channels);
          }
        }
      } catch (error) {
        console.error('Error reading mixer state from localStorage:', error);
      }
    }
  }, [mixerState]);
  
  // Check if Mixbase is the active tab
  useEffect(() => {
    setShowSnapshots(pathname === '/konform/mixbase');
    
    // When Mixbase is active, try to load mixer state directly
    if (pathname === '/konform/mixbase') {
      try {
        const savedMixerState = localStorage.getItem('konform-mixer-state');
        if (savedMixerState) {
          const parsed = JSON.parse(savedMixerState);
          if (parsed.channels && Array.isArray(parsed.channels)) {
            setCurrentChannels(parsed.channels);
          }
        }
      } catch (error) {
        console.error('Error loading mixer state for snapshots:', error);
      }
    }
  }, [pathname]);

  const navItems: NavItem[] = [
    { name: "Songbase", path: "/konform/songbase", icon: <Music size={24} /> },
    { name: "Lyricbase", path: "/konform/lyricbase", icon: <FileText size={24} /> },
    { name: "Voxbase", path: "/konform/voxbase", icon: <Mic size={24} /> },
    { name: "Keybase", path: "/konform/keybase", icon: <Layers size={24} /> },
    { name: "Guitarbase", path: "/konform/guitarbase", icon: <Music2 size={24} /> },
    { name: "Subase", path: "/konform/subase", icon: <Music2 size={24} /> },
    { name: "Drumbase", path: "/konform/drumbase", icon: <Music2 size={24} /> },
    { name: "Mixbase", path: "/konform/mixbase", icon: <SlidersHorizontal size={24} /> },
  ];

  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        "group border-r bg-black border-r-konform-neon-blue/20 pt-4 flex flex-col",
        isCollapsed && "items-center",
        className
      )}
    >
      <div className="flex flex-col gap-2 px-2 py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex h-12 items-center justify-center rounded-md px-4 py-2 text-gray-200 hover:bg-konform-neon-blue/20 transition-colors",
              pathname === item.path && "bg-konform-neon-orange/80 text-black hover:bg-konform-neon-orange/90",
              isCollapsed ? "h-12 w-12" : "w-full"
            )}
          >
            {item.icon}
            {!isCollapsed && <span className="ml-3">{item.name}</span>}
          </Link>
        ))}
        
        {/* Show Snapshots panel when Mixbase is active */}
        {pathname === '/konform/mixbase' && (
          <div className="mt-4 pt-3 border border-konform-neon-orange/30 bg-black rounded-md relative">
            <div className="flex items-center px-4 py-2 text-white text-sm font-medium bg-gradient-to-r from-konform-neon-orange/80 to-konform-neon-orange/20 rounded-t-sm -mt-3 -mx-[1px]">
              {!isCollapsed && (
                <div className="flex items-center">
                  <Camera className="h-4 w-4 mr-2 text-white" />
                  <span className="text-white font-bold">MIXER SNAPSHOTS</span>
                </div>
              )}
              {isCollapsed && <Camera className="h-5 w-5 text-white" />}
            </div>
            <div className="px-2 overflow-y-auto pb-3 max-h-[250px] mt-1">
              <MixerSnapshots 
                currentChannels={currentChannels}
                onRecallSnapshot={handleRecallSnapshot}
                isCompact={isCollapsed}
              />
            </div>
          </div>
        )}
      </div>
      
      <Separator className="my-4 bg-konform-neon-blue/10" />
      
      <div className="flex flex-col gap-2 px-2 py-2 mt-auto mb-4">
        <Link
          href="/konform/settings"
          className={cn(
            "flex h-12 items-center justify-center rounded-md px-4 py-2 text-gray-200 hover:bg-konform-neon-blue/20 transition-colors",
            pathname === "/konform/settings" && "bg-konform-neon-blue/20 text-white",
            isCollapsed ? "h-12 w-12" : "w-full"
          )}
        >
          <Settings size={24} />
          {!isCollapsed && <span className="ml-3">Settings</span>}
        </Link>
      </div>
    </div>
  );
} 