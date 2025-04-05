
import { ParticleEffect } from "@/components/effects/ParticleEffect";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export const VideoHeader = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="relative h-[60vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          className="absolute inset-0 w-full h-full object-cover filter invert"
          src="/Videos/Gen-3 Alpha 1222913568, Dreamlike clouds in , imagepng, M 5.mp4"
          muted
          loop
          playsInline
          autoPlay
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Particle effect overlay */}
      <div className="absolute inset-0 z-10">
        <ParticleEffect 
          color="#00F0FF" 
          particleCount={75}
          particleSize={[1, 3]}
          speed={[0.3, 1.2]}
        />
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 space-y-6">
        <h1 className="text-6xl font-bold text-white font-syne">DREAMAKER</h1>
        {!isAuthenticated && (
          <>
            <p className="text-xl text-white/90 max-w-2xl text-center px-4">
              Experience the future of music creation with our AI-powered tools and virtual artists
            </p>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
            >
              Join Waitlist
            </Button>
          </>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dreamaker-bg z-0" />
    </div>
  );
};
