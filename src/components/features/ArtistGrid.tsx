import { Link } from "react-router-dom";
import { useState } from "react";
import { VideoBackground } from "@/components/dreamaker/VideoBackground";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users } from "lucide-react";

export const ArtistGrid = () => {
  const features = [
    {
      id: "1",
      name: "Voice Cloning Studio",
      description: "Create unique AI voices by training on voice samples. Fine-tune every aspect from accent to emotion.",
      image: "/lovable-uploads/83a0fa62-e024-4c9b-aae3-c1abf245a9ff.png",
      video: "/Videos/PERSONAS_01.mp4",
      rating: 4.8,
      users: 1250,
      details: "Our advanced voice cloning technology allows you to create hyper-realistic AI voices that capture the nuances of human speech. Perfect for creating virtual artists, narrators, or custom voice assistants."
    },
    {
      id: "2",
      name: "Persona Creation",
      description: "Design detailed virtual artist personas with rich backstories and visual identities.",
      image: "/lovable-uploads/ce56345b-8fa1-471f-b441-050220e8c98c.png",
      video: "/Videos/Gen-3 Alpha 3612719966, digital face emerges, dreammakerstudio_htt, M 5.mp4",
      rating: 4.9,
      users: 980,
      details: "Build complete virtual artists with our persona creation tools. Define their musical style, visual appearance, backstory, and personality traits to create compelling AI collaborators for your projects."
    },
    {
      id: "3",
      name: "AI Music Generation",
      description: "Generate original music with your virtual artists using advanced AI models.",
      image: "/lovable-uploads/c83df97a-619d-42c9-b61f-d26f2549e849.png",
      video: "/Videos/MIXER_01.mp4",
      rating: 4.7,
      users: 2100,
      details: "Our state-of-the-art AI music generation models can create original compositions in any genre. Control parameters like tempo, mood, instrumentation, and structure to get exactly the sound you're looking for."
    },
    {
      id: "4",
      name: "Style Transfer",
      description: "Apply different musical styles and genres to your compositions seamlessly.",
      image: "/lovable-uploads/5800b014-7e6f-4fde-99d3-3f98876d4732.png",
      video: "/Videos/KONFORM_BG_02.mp4",
      rating: 4.6,
      users: 1750,
      details: "Transform your music with our style transfer technology. Apply the characteristics of any genre or artist to your compositions while maintaining the core musical elements that make your sound unique."
    },
    {
      id: "5",
      name: "Collaboration Tools",
      description: "Work together with other creators to build unique virtual artists and music.",
      image: "/lovable-uploads/753c2bb8-5051-42e6-9edb-f17ad4094c54.png",
      video: "/Videos/DREAMAKER_02.mp4",
      rating: 4.9,
      users: 1500,
      details: "Our collaboration platform connects you with creators worldwide. Share projects, combine skills, and build virtual artists together in real-time with our intuitive collaboration tools."
    }
  ];

  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {features.map((feature) => (
        <HoverCard key={feature.id} openDelay={200} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Link 
              to="/dreamaker" 
              key={feature.id}
              className="group relative overflow-hidden rounded-2xl bg-black border border-dreamaker-purple/20 hover:border-green-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(74,222,128,0.3)] transform hover:-translate-y-1"
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="aspect-square relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <VideoBackground 
                    videoUrl={feature.video} 
                    isHovering={hoveredFeature === feature.id} 
                    fallbackImage={feature.image}
                    darkness={0.7} /* Increased darkness for better text readability */
                  />
                  <div className="absolute inset-0 backdrop-blur-xl" /> {/* Extreme blur effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90 opacity-90 group-hover:opacity-85 transition-opacity duration-300" /> {/* Darkened gradient */}
                </div>
                
                <div className="absolute bottom-4 left-0 right-0 px-4 z-10 text-center">
                  <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                    {feature.name}
                  </h3>
                </div>
              </div>
            </Link>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-black/90 border border-green-500/30 text-white p-4">
            <div className="space-y-2">
              <h4 className="text-xl font-semibold text-green-400">{feature.name}</h4>
              <p className="text-sm text-gray-300">{feature.details}</p>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{feature.rating}</span>
                  <Users className="h-4 w-4 text-gray-400 ml-2" />
                  <span className="text-sm">{feature.users}+</span>
                </div>
                <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 p-0 hover:bg-transparent">
                  Explore <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
};