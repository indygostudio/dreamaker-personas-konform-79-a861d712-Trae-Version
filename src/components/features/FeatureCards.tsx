
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { VideoBackground } from "@/components/dreamaker/VideoBackground";
import { Disc3, Users, Sliders } from "lucide-react";

export const FeatureCards = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const featureCards = [
    {
      title: "AI Record Label",
      description: "Create your virtual artist persona with advanced AI technology and produce professional music with our integrated AI DAW",
      videoUrl: "/Videos/DREAMAKER_01.mp4",
      icon: <Disc3 className="h-6 w-6" />,
      color: "border-purple-500/20 group-hover:border-purple-500/60",
      bgColor: "from-purple-900/40 to-black/40",
      hoverColor: "text-purple-400"
    },
    {
      title: "AI Persona",
      description: "Design fully realized virtual artists with rich backstories, visual identities, and personality traits. Build memorable characters with distinct musical preferences and creative visions.",
      videoUrl: "/Videos/PERSONAS_01.mp4",
      icon: <Users className="h-6 w-6" />,
      color: "border-blue-500/20 group-hover:border-blue-500/60",
      bgColor: "from-blue-900/40 to-black/40",
      hoverColor: "text-blue-400"
    },
    {
      title: "AI Studio",
      description: "Transform your compositions by applying different musical styles and genres seamlessly. Our sophisticated AI analyzes your music and intelligently applies the characteristics of any genre.",
      videoUrl: "/Videos/KONFORM_01.mp4",
      icon: <Sliders className="h-6 w-6" />,
      color: "border-indigo-500/20 group-hover:border-indigo-500/60",
      bgColor: "from-indigo-900/40 to-black/40",
      hoverColor: "text-indigo-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
      {featureCards.map((card, index) => (
        <Card 
          key={index}
          className={`group overflow-hidden relative bg-black/80 backdrop-blur-md border ${card.color} transition-all duration-300 cursor-pointer w-full h-[280px] flex flex-col shadow-lg hover:shadow-lg transform hover:-translate-y-1`}
          onMouseEnter={() => setHoveredCard(index)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <VideoBackground 
              videoUrl={card.videoUrl} 
              isHovering={hoveredCard === index} 
              continuePlayback={false}
            />
            <div 
              className={`absolute inset-0 bg-gradient-to-b ${card.bgColor} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} 
            />
          </div>
          
          <CardContent className="p-6 flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className={`text-white group-hover:${card.hoverColor} transition-colors`}>
                {card.icon}
              </div>
              <h3 className={`text-xl font-semibold text-white group-hover:${card.hoverColor} transition-colors`}>
                {card.title}
              </h3>
            </div>
            
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
