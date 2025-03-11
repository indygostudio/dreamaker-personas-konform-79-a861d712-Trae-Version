
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface KonformBannerProps {
  title: string;
  description: string;
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  rightContent?: ReactNode;
}

export const KonformBanner = ({
  title,
  description,
  isCollapsed,
  onCollapsedChange,
  rightContent,
}: KonformBannerProps) => {
  return (
    <div className={`relative bg-black/40 backdrop-blur-xl border-b border-konform-neon-blue/20 transition-all duration-300 ${isCollapsed ? 'py-4' : 'py-8'}`}>
      <video 
        className="absolute inset-0 w-full h-full object-cover -z-10"
        src="/Videos/KONFORM_BG_03.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10" />
      
      <div className="container mx-auto px-6">
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
      </div>
    </div>
  );
};
