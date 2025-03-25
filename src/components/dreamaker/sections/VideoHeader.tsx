
import { ParticleEffect } from "@/components/effects/ParticleEffect";

export const VideoHeader = () => {
  return (
    <div className="relative h-[60vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          className="absolute inset-0 w-full h-full object-cover filter invert"
          muted
          loop
          playsInline
          autoPlay
        >
          <source src="/Videos/ROTATING EYE.mp4" type="video/mp4" />
        </video>
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
      
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <h1 className="text-6xl font-bold text-white font-syne">DREAMAKER</h1>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dreamaker-bg z-0" />
    </div>
  );
};
