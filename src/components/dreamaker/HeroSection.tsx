import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { Music2, Wand2, Headphones } from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();
  const session = useSession();

  return (
    <div 
      className={`transition-all duration-500 ease-in-out ${
        session ? 'min-h-[16vh]' : 'min-h-[80vh]'
      } flex flex-col items-center justify-end text-center px-4 animate-fade-up relative ${
        session ? 'pt-32' : 'pt-24'
      }`}
    >
      {/* Hero background video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/Videos/ROTATING EYE.mp4"
          muted
          loop
          playsInline
          autoPlay
          onError={(e) => console.error("Video error:", e)}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-dreamaker-bg" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">
          Create Your <span className="gradient-text">Dream Music</span>
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Discover, create, and collaborate with AI-powered music tools and a global community of artists.
        </p>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-dreamaker-purple/20 group hover:border-dreamaker-purple/40 transition-all">
            <Music2 className="w-8 h-8 text-dreamaker-purple mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Music Creation</h3>
            <p className="text-gray-400">Generate unique tracks with our advanced AI tools</p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-dreamaker-purple/20 group hover:border-dreamaker-purple/40 transition-all">
            <Wand2 className="w-8 h-8 text-dreamaker-purple mb-4" />
            <h3 className="text-xl font-semibold mb-2">Style Transfer</h3>
            <p className="text-gray-400">Transform your music with AI-powered style transfer</p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-dreamaker-purple/20 group hover:border-dreamaker-purple/40 transition-all">
            <Headphones className="w-8 h-8 text-dreamaker-purple mb-4" />
            <h3 className="text-xl font-semibold mb-2">Virtual Studio</h3>
            <p className="text-gray-400">Professional-grade tools in your browser</p>
          </div>
        </div>

        {!session && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-dreamaker-purple hover:bg-dreamaker-purple/80 text-white"
              onClick={() => navigate('/auth')}
            >
              Start Creating
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-dreamaker-purple/50 hover:border-dreamaker-purple text-white hover:bg-dreamaker-purple/10"
              onClick={() => navigate('/personas')}
            >
              Browse Artists
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};