
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Banner } from "@/types/banner";
import { SubscriptionDialog } from "@/components/SubscriptionDialog";
import { VideoHeader } from "./VideoHeader";
import { VideoBackground } from "@/components/dreamaker/VideoBackground";
import { Circle, CircleDot } from "lucide-react";

interface HeroBannerProps {
  isHeaderExpanded: boolean;
  isHeaderHovered: boolean;
  onHeaderDoubleClick: () => void;
  onHeaderHover: (isHovered: boolean) => void;
  currentBanner: Banner | null;
  activeTab: string;
}

export const HeroBanner = ({
  isHeaderExpanded,
  isHeaderHovered,
  onHeaderDoubleClick,
  onHeaderHover,
  currentBanner,
  activeTab
}: HeroBannerProps) => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const [previousTab, setPreviousTab] = useState(activeTab);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Define video options for each tab
  const tabVideos = {
    profiles: ["/Videos/KONFORM_BG_03.mp4"],
    personas: ["/Videos/Gen-3 Alpha 3165178086, scrolling frames of , imagepng (11), M 5 (1).mp4"],
    collaborations: ["/Videos/Gen-3 Alpha 3165178086, scrolling frames of , imagepng (11), M 5 (1).mp4"],
    media: ["/Videos/Gen-3 Alpha 869480173, Vector simple illust, Cropped - imagewebp, M 5.mp4"],
    default: ["/Videos/Gen-3 Alpha 3612719966, digital face emerges, dreammakerstudio_htt, M 5.mp4"]
  };

  useEffect(() => {
    if (previousTab !== activeTab) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setPreviousTab(activeTab);
      }, 600); // Match this with the CSS transition duration
      
      return () => clearTimeout(timer);
    }
  }, [activeTab, previousTab]);

  const getBannerTitle = () => {
    switch (activeTab) {
      case "personas":
        return "PERSONAS";
      case "collaborations":
        return "COLLABORATIONS";
      case "media":
        return "MEDIA COLLECTIONS";
      default:
        return "DREAMAKER";
    }
  };

  const getBannerDescription = () => {
    switch (activeTab) {
      case "personas":
        return "Create and collaborate with AI-powered virtual artists";
      case "collaborations":
        return "Work together with other artists and AI personas";
      case "media":
        return "Browse and manage your media collections";
      default:
        return "Experience the future of music creation with our AI-powered tools and virtual artists";
    }
  };

  const getGradientColors = () => {
    // Using the same gradient from the media card for consistency across all tabs
    return "from-green-900/70 via-black/40 to-dreamaker-bg";
  };

  const getVideoUrl = (tab: string, index = 0) => {
    const videos = tabVideos[tab as keyof typeof tabVideos] || tabVideos.default;
    return videos[index % videos.length];
  };

  const handleDotClick = (index: number) => {
    setCurrentVideoIndex(index);
  };

  const handleBannerClick = () => {
    if (activeTab !== "personas") {
      navigate("/dreamaker", { state: { activeTab: "personas" } });
    }
  };

  return (
    <div 
      ref={headerRef}
      className={`relative transition-all duration-300 ${isHeaderExpanded ? 'min-h-[42vh]' : 'h-[84px]'} flex items-center justify-center overflow-hidden w-full cursor-pointer`}
      onDoubleClick={onHeaderDoubleClick}
      onMouseEnter={() => onHeaderHover(true)}
      onMouseLeave={() => onHeaderHover(false)}
      onClick={handleBannerClick}
    >
      {/* Background Video Layer (z-index: 0) */}
      <div className="absolute inset-0 w-full h-full z-0">
        {currentBanner ? (
          <div className="absolute inset-0 w-full h-full">
            {currentBanner.type === 'video' ? (
              <VideoBackground
                videoUrl={currentBanner.url}
                isHovering={isHeaderHovered}
                continuePlayback={false}
                reverseOnEnd={true}
                autoPlay={false}
                priority={true} // Always prioritize the main banner
              />
            ) : (
              <img 
                src={currentBanner.url} 
                alt="Event banner"
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager" // Priority loading for banner images
              />
            )}
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full">
            <VideoBackground
              videoUrl={getVideoUrl(activeTab, currentVideoIndex)}
              isHovering={isHeaderHovered}
              continuePlayback={false}
              reverseOnEnd={true}
              autoPlay={false}
              priority={true} // Always prioritize the main banner
              key={`video-${activeTab}-${currentVideoIndex}`} // Add a key to force remount when tab changes
            />
          </div>
        )}
      </div>

      {/* Gradient Overlay Layer (z-index: 1) */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getGradientColors()} z-10 transition-all duration-500`} />

      {/* Content Layer (z-index: 30) */}
      <div className="relative z-30 w-full max-w-[2400px] mx-auto px-6">
        <div className="relative flex flex-col items-center justify-center text-center max-w-4xl mx-auto">            
          <h1 className={`text-5xl font-bold mb-4 select-none transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            {getBannerTitle()}
          </h1>
          
          {isHeaderExpanded && (
            <>
              <p className={`text-xl mb-6 mx-auto max-w-2xl transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
                {getBannerDescription()}
              </p>
              <div className={`flex justify-center w-full transition-all duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <SubscriptionDialog />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dot indicators */}
      {isHeaderExpanded && !currentBanner && (tabVideos[activeTab as keyof typeof tabVideos]?.length > 1) && (
        <div className="absolute bottom-4 left-0 right-0 z-40 flex justify-center gap-2">
          {tabVideos[activeTab as keyof typeof tabVideos]?.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
            >
              {currentVideoIndex === index ? (
                <CircleDot className="w-6 h-6 text-white" />
              ) : (
                <Circle className="w-6 h-6 text-white/60 hover:text-white/80" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
