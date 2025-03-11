
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mic2, Guitar, Settings2, Keyboard, Wand2, Music, Pen, Video, Image } from "lucide-react";
import { VideoBackground } from "@/components/dreamaker/VideoBackground";
import { useNavigate } from "react-router-dom";

interface PersonaType {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  video?: string;
  color: string;
  bgColor?: string;
}

export const GenreGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const personaTypes: PersonaType[] = [
    {
      type: 'AI_VOCALIST',
      title: 'AI VOCALIST',
      description: 'Create virtual singers and musicians',
      icon: <Mic2 className="h-6 w-6" />,
      image: '/lovable-uploads/4fcaace6-9ca6-4012-8e19-966bfcd94cc4.png',
      video: '/Videos/Gen-3 Alpha 1425044134, Handsome country sin, image-prompt, M 5.mp4',
      color: 'border-purple-500/20 group-hover:border-purple-500/60',
      bgColor: 'from-purple-900/40 to-black/40'
    },
    {
      type: 'AI_CHARACTER',
      title: 'AI CHARACTER',
      description: 'Design virtual characters',
      icon: <Guitar className="h-6 w-6" />,
      image: '/lovable-uploads/4fcaace6-9ca6-4012-8e19-966bfcd94cc4.png',
      video: '/Videos/Gen-3 Alpha 4085938870, a close up of realis, Cropped - dreammaker, M 5.mp4',
      color: 'border-blue-500/20 group-hover:border-blue-500/60',
      bgColor: 'from-blue-900/40 to-black/40'
    },
    {
      type: 'AI_INSTRUMENTALIST',
      title: 'AI INSTRUMENTALIST',
      description: 'Design virtual instrument players',
      icon: <Guitar className="h-6 w-6" />,
      image: '/lovable-uploads/4fcaace6-9ca6-4012-8e19-966bfcd94cc4.png',
      video: '/Videos/Gen-3 Alpha 3499529498, A close-up of a goth, dreammakerstudio_htt, M 5.mp4',
      color: 'border-emerald-500/20 group-hover:border-emerald-500/60',
      bgColor: 'from-emerald-900/40 to-black/40'
    },
    {
      type: 'AI_MIXER',
      title: 'AI MIXER',
      description: 'Create intelligent mixing profiles',
      icon: <Settings2 className="h-6 w-6" />,
      image: '/lovable-uploads/4fcaace6-9ca6-4012-8e19-966bfcd94cc4.png',
      video: '/Videos/MIXER_03.mp4',
      color: 'border-pink-500/20 group-hover:border-pink-500/60',
      bgColor: 'from-pink-900/40 to-black/40'
    },
    {
      type: 'AI_WRITER',
      title: 'AI WRITER',
      description: 'Design virtual lyricists and writers',
      icon: <Pen className="h-6 w-6" />,
      image: '/lovable-uploads/4fcaace6-9ca6-4012-8e19-966bfcd94cc4.png',
      video: '/Videos/Gen-3 Alpha 2708728073, Lyric book on a tabl, dreammakerstudio_a_d, M 5.mp4',
      color: 'border-orange-500/20 group-hover:border-orange-500/60',
      bgColor: 'from-orange-900/40 to-black/40'
    },
    {
      type: 'AI_EFFECT',
      title: 'AI EFFECT',
      description: 'Create unique audio effects',
      icon: <Wand2 className="h-6 w-6" />,
      image: '/lovable-uploads/4fcaace6-9ca6-4012-8e19-966bfcd94cc4.png',
      video: '/Videos/Gen-3 Alpha 869480173, Vector simple illust, Cropped - imagewebp, M 5.mp4',
      color: 'border-yellow-500/20 group-hover:border-yellow-500/60',
      bgColor: 'from-yellow-900/40 to-black/40'
    },
    {
      type: 'AI_SOUND',
      title: 'AI SOUND',
      description: 'Design virtual sound generators',
      icon: <Music className="h-6 w-6" />,
      image: '/lovable-uploads/4fcaace6-9ca6-4012-8e19-966bfcd94cc4.png',
      video: '/Videos/INSTRUMENT_01.mp4',
      color: 'border-indigo-500/20 group-hover:border-indigo-500/60',
      bgColor: 'from-indigo-900/40 to-black/40'
    },
    {
      type: 'AI_MUSIC_VIDEO',
      title: 'AI MUSIC VIDEO',
      description: 'Create stunning music videos with AI',
      icon: <Video className="h-6 w-6" />,
      image: '/lovable-uploads/4fcaace6-9ca6-4012-8e19-966bfcd94cc4.png',
      video: '/Videos/Gen-3 Alpha 1192015756, Soft skin texture, p, M 5.mp4',
      color: 'border-red-500/20 group-hover:border-red-500/60',
      bgColor: 'from-red-900/40 to-black/40'
    },
    {
      type: 'AI_IMAGES',
      title: 'AI IMAGES',
      description: 'Generate AI images for your projects',
      icon: <Image className="h-6 w-6" />,
      image: '/lovable-uploads/4fcaace6-9ca6-4012-8e19-966bfcd94cc4.png',
      video: '/Videos/Gen-3 Alpha 4197653845, a whole mythological, Cropped - imagewebp, M 5.mp4',
      color: 'border-cyan-500/20 group-hover:border-cyan-500/60',
      bgColor: 'from-cyan-900/40 to-black/40'
    }
  ];

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(index);
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setUploading(null);
      toast({
        title: "Upload complete",
        description: `${file.name} uploaded successfully`,
      });
    }
  };

  const navigateToDreammaker = (type: string) => {
    // Convert the persona type to the query parameter format
    const typeParam = type.replace('AI_', '').toLowerCase();
    
    // Determine which tab to navigate to based on the type
    let targetTab = 'personas';
    
    // Special cases for media types
    if (type === 'AI_MUSIC_VIDEO' || type === 'AI_IMAGES') {
      targetTab = 'media';
    }
    
    // Navigate with state to set the appropriate tab and filter
    navigate(`/dreamaker`, { 
      state: { 
        activeTab: targetTab,
        selectedType: type,
        searchQuery: ''
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {personaTypes.map((persona, index) => (
        <div 
          key={index} 
          className="group transform transition-all duration-500 hover:-translate-y-1"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div 
            className={`relative overflow-hidden rounded-2xl bg-black/80 backdrop-blur-md border ${persona.color} transition-all duration-500 hover:shadow-lg hover:shadow-${persona.color.split('-')[1]}/20 h-[300px] cursor-pointer`}
            onClick={() => navigateToDreammaker(persona.type)}
          >
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {persona.video ? (
                <VideoBackground
                  videoUrl={persona.video}
                  isHovering={hoveredIndex === index}
                  fallbackImage={persona.image}
                  continuePlayback={false}
                  reverseOnEnd={true}
                />
              ) : (
                <img 
                  src={persona.image} 
                  alt={persona.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
              <div 
                className={`absolute inset-0 bg-gradient-to-b ${persona.bgColor} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} 
              />
            </div>
            
            <div className="absolute inset-0 flex flex-col p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-full bg-black/60 backdrop-blur-sm ${persona.color}`}>
                  {persona.icon}
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 ${persona.color}`}
                  >
                    <Mic2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 ${persona.color}`}
                  >
                    <Music className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-auto">
                <h3 className="text-xl font-bold text-white mb-2 font-syne tracking-wide group-hover:text-dreamaker-purple transition-colors">
                  {persona.title}
                </h3>
                <p className="text-gray-300 mb-4 line-clamp-2 group-hover:text-white transition-colors">
                  {persona.description}
                </p>
                
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`bg-black/50 text-white hover:bg-black/70 border-0 hover:border hover:${persona.color}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToDreammaker(persona.type);
                    }}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
