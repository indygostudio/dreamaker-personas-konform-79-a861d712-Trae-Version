
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Disc3, Users, Sliders } from "lucide-react";
import { VideoBackground } from "@/components/dreamaker/VideoBackground";
import { useState } from "react";

export const FeatureCards = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const featureCards = [
    {
      title: "AI Record Label",
      description: "Create your virtual artist persona with advanced AI technology and produce professional music with our integrated AI DAW",
      bgGradient: "from-purple-900/40 to-black/40",
      icon: <Disc3 className="h-6 w-6" />,
      color: "border-purple-500/20 group-hover:border-purple-500/60",
      video: "/Videos/PERSONAS_01.mp4",
      hoverColor: "text-purple-400"
    },
    {
      title: "AI Persona",
      description: "Design fully realized virtual artists with rich backstories, visual identities, and personality traits. Build memorable characters with distinct musical preferences and creative visions.",
      bgGradient: "from-blue-900/40 to-black/40",
      icon: <Users className="h-6 w-6" />,
      color: "border-blue-500/20 group-hover:border-blue-500/60",
      video: "/Videos/DREAMAKER_01.mp4",
      hoverColor: "text-blue-400"
    },
    {
      title: "AI Studio",
      description: "Transform your compositions by applying different musical styles and genres seamlessly. Our sophisticated AI analyzes your music and intelligently applies the characteristics of any genre.",
      bgGradient: "from-indigo-900/40 to-black/40",
      icon: <Sliders className="h-6 w-6" />,
      color: "border-indigo-500/20 group-hover:border-indigo-500/60",
      video: "/Videos/KONFORM_01.mp4",
      hoverColor: "text-indigo-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
      {featureCards.map((card, index) => (
        <div 
          key={index} 
          className="group transform transition-all duration-500 hover:-translate-y-1"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Card 
            className={`relative overflow-hidden rounded-2xl bg-black/80 backdrop-blur-md border ${card.color} transition-all duration-500 hover:shadow-lg h-[300px]`}
          >
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <VideoBackground 
                videoUrl={card.video} 
                isHovering={hoveredIndex === index} 
                continuePlayback={false} 
                reverseOnEnd={true} 
                darkness={0.7}
              />
              <div className={`absolute inset-0 bg-gradient-to-b ${card.bgGradient} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} />
            </div>
            
            <div className="absolute inset-0 flex flex-col p-6 bg-zinc-950/60 backdrop-blur-sm transition-transform duration-500 group-hover:translate-y-0 transform">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-full bg-black/60 backdrop-blur-sm ${card.color}`}>
                  {card.icon}
                </div>
              </div>
              
              <div className="mt-auto transform transition-all duration-500 group-hover:translate-y-0">
                <h3 className="text-xl font-bold text-white mb-2 font-syne tracking-wide group-hover:text-dreamaker-purple transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-300 mb-4 group-hover:text-white transition-colors">
                  {card.description}
                </p>
                
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <div className="flex flex-wrap gap-2">
                    {["AI", "Music", "Creation"].map((tag, tagIndex) => (
                      <span key={tagIndex} className={`px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-sm ${card.hoverColor} border border-${card.hoverColor}/20`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};
