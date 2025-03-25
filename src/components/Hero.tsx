
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { SubscriptionDialog } from "./SubscriptionDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VideoBackground } from "./dreamaker/VideoBackground";
import { CircleDot, Circle } from "lucide-react";
import { scrollToSection } from "@/utils/scrollUtils";

export const Hero = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const heroSections = [
    {
      video: "/Videos/DREAMAKER_01.mp4",
      title: "DREAMAKER",
      description: "Experience the future of music creation with our AI-powered tools and virtual artists",
      sectionId: "dreamaker-section"
    },
    {
      video: "/Videos/KONFORM_BG_03.mp4",
      title: "KONFORM",
      description: "The next generation Digital Audio Workstation powered by artificial intelligence",
      sectionId: "konform-section"
    },
    {
      video: "/Videos/Gen-3 Alpha 3165178086, scrolling frames of , imagepng (11), M 5 (1).mp4",
      title: "PERSONAS",
      description: "Create your own AI Artists with Persona's",
      sectionId: "personas-section"
    }
  ];

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          // Clear any invalid tokens
          await supabase.auth.signOut();
          navigate('/auth');
          toast({
            title: "Session Expired",
            description: "Please sign in again to continue.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };

    checkSession();
  }, [navigate, toast]);

  useEffect(() => {
    // Changed from 15000ms (15 seconds) to 7000ms (7 seconds)
    const interval = setInterval(() => {
      setCurrentVideoIndex(prev => (prev + 1) % heroSections.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleDotClick = (index: number) => {
    setCurrentVideoIndex(index);
  };

  const handleSectionClick = (sectionId: string) => {
    // Special case for Personas section - navigate to Dreamaker page with personas tab
    if (sectionId === "personas-section") {
      navigate("/dreamaker", { state: { activeTab: "personas" } });
    } else {
      // For other sections, scroll on the current page
      setTimeout(() => {
        scrollToSection(sectionId, 20); // Add a small offset for better visual experience
      }, 100);
    }
  };

  return (
    <div className="relative h-[60vh] overflow-hidden">
      {/* Hero background videos */}
      <div className="absolute inset-0 z-0">
        {heroSections.map((section, index) => (
          <div 
            key={section.video}
            className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
              currentVideoIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDuration: '2000ms' }}
          >
            <VideoBackground 
              videoUrl={section.video}
              continuePlayback={true}
              reverseOnEnd={true}
              isHovering={false}
              autoPlay={true}
              priority={index === 0} // Prioritize loading of the first video
            />
          </div>
        ))}
        
        {/* Content - No gradient overlay */}
        <div 
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center cursor-pointer" 
          onClick={() => handleSectionClick(heroSections[currentVideoIndex].sectionId)}
        >
          <div className="container mx-auto px-4">
            <h1 className="text-6xl font-bold mb-6 text-white">
              {heroSections[currentVideoIndex].title}
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
              {heroSections[currentVideoIndex].description}
            </p>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        {heroSections.map((_, index) => (
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

      {/* Action Button */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center mt-32">
        <SubscriptionDialog />
      </div>
    </div>
  );
};
