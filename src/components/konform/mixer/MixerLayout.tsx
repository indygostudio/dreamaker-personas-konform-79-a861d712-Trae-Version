import { ReactNode } from "react";
import { KonformBanner } from "../KonformBanner";
import { TransportControls } from "../TransportControls";
import { useHeaderStore } from "../store/headerStore";

interface MixerLayoutProps {
  header: ReactNode;
  sidebar: ReactNode;
  content: ReactNode;
}

export const MixerLayout = ({ header, sidebar, content }: MixerLayoutProps) => {
  const { mixerHeaderCollapsed, setMixerHeaderCollapsed } = useHeaderStore();

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-konform-bg to-black">
      <KonformBanner 
        title="MIXER" 
        description="Mix and arrange your tracks with precision"
        isCollapsed={mixerHeaderCollapsed}
        onCollapsedChange={setMixerHeaderCollapsed}
      />
      <div className="p-6 space-y-6">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-konform-neon-blue to-konform-neon-orange opacity-30 blur-lg rounded-lg" />
          <div className="relative bg-black/40 backdrop-blur-xl p-6 rounded-lg border border-konform-neon-blue/30">
            {header}
          </div>
        </div>

        <div className="flex gap-6 h-[calc(100vh-20rem)]">
          {sidebar}
          {content}
        </div>

        <TransportControls />
      </div>
    </div>
  );
};