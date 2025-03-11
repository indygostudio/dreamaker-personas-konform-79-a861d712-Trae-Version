
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { VideoBackground } from "@/components/dreamaker/VideoBackground";
import { GenreGrid } from "./GenreGrid";
import { Mic2, User, Image, FileText, Wand2 } from "lucide-react";

export const PersonaSection = () => {
  const navigate = useNavigate();
  const [isHoveringEffect, setIsHoveringEffect] = useState(false);
  const [activeTab, setActiveTab] = useState("voice-cloning");
  
  return (
    <div className="py-12 bg-black relative">
      {/* Video Banner Container */}
      <div className="h-[40vh] relative overflow-hidden cursor-pointer" onClick={() => navigate("/personas")}>
        {/* Background Video */}
        <div className="absolute inset-0">
          <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
            <source src="/Videos/PERSONAS_01.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center flex-col bg-gradient-to-b from-black/40 to-black/80 p-8">
          <h1 className="text-6xl font-bold text-white mb-4">PERSONAS</h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-center text-lg">
            Clone Voices, Craft Personas. Our voice cloning studio lets you build rich, expressive voice profiles tailored to your artistic needs.
          </p>
        </div>
      </div>

      <div className="w-full px-0 relative z-10">
        <div className="space-y-6 text-gray-400 w-full text-lg leading-relaxed px-4 md:px-8">
          <Tabs defaultValue="voice-cloning" className="w-full mt-8" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="inline-flex items-center gap-4 bg-black/80 backdrop-blur-xl rounded-full p-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 flex-wrap justify-center">
              <TabsTrigger 
                value="voice-cloning" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-black/20 text-white/80 border-white/10 hover:bg-[#9333EA]/10 hover:text-white hover:border-[#9333EA]/20 hover:shadow-[0_4px_20px_rgba(147,51,234,0.3)] hover:-translate-y-0.5 data-[state=active]:bg-[#9333EA]/10 data-[state=active]:text-white data-[state=active]:border-[#9333EA]/20 data-[state=active]:shadow-[0_4px_20px_rgba(147,51,234,0.3)] data-[state=active]:-translate-y-0.5 font-syne"
              >
                <Mic2 className="w-4 h-4 mr-2" />
                Voice Cloning
              </TabsTrigger>
              <TabsTrigger 
                value="character-development" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-black/20 text-white/80 border-white/10 hover:bg-[#9333EA]/10 hover:text-white hover:border-[#9333EA]/20 hover:shadow-[0_4px_20px_rgba(147,51,234,0.3)] hover:-translate-y-0.5 data-[state=active]:bg-[#9333EA]/10 data-[state=active]:text-white data-[state=active]:border-[#9333EA]/20 data-[state=active]:shadow-[0_4px_20px_rgba(147,51,234,0.3)] data-[state=active]:-translate-y-0.5 font-syne"
              >
                <User className="w-4 h-4 mr-2" />
                Character Development
              </TabsTrigger>
              <TabsTrigger 
                value="visual-identity" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-black/20 text-white/80 border-white/10 hover:bg-[#9333EA]/10 hover:text-white hover:border-[#9333EA]/20 hover:shadow-[0_4px_20px_rgba(147,51,234,0.3)] hover:-translate-y-0.5 data-[state=active]:bg-[#9333EA]/10 data-[state=active]:text-white data-[state=active]:border-[#9333EA]/20 data-[state=active]:shadow-[0_4px_20px_rgba(147,51,234,0.3)] data-[state=active]:-translate-y-0.5 font-syne"
              >
                <Image className="w-4 h-4 mr-2" />
                Visual Identity
              </TabsTrigger>
              <TabsTrigger 
                value="content-generation" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-black/20 text-white/80 border-white/10 hover:bg-[#9333EA]/10 hover:text-white hover:border-[#9333EA]/20 hover:shadow-[0_4px_20px_rgba(147,51,234,0.3)] hover:-translate-y-0.5 data-[state=active]:bg-[#9333EA]/10 data-[state=active]:text-white data-[state=active]:border-[#9333EA]/20 data-[state=active]:shadow-[0_4px_20px_rgba(147,51,234,0.3)] data-[state=active]:-translate-y-0.5 font-syne"
              >
                <FileText className="w-4 h-4 mr-2" />
                Content Generation
              </TabsTrigger>
            </TabsList>
            <TabsContent value="voice-cloning" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">Voice Cloning Technology</h3>
                  <p className="mb-4">Our advanced voice cloning technology allows you to create incredibly realistic AI voices that capture the nuance and character of any vocal style. Upload samples, train models, and fine-tune every aspect of your persona's voice.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Upload voice samples and train our AI to clone any voice with remarkable accuracy</li>
                    <li>Fine-tune accent, pitch, emotional range, breathiness, vibrato, and tone</li>
                    <li>Optimize voices for specific musical genres, from rap and pop to classical</li>
                    <li>Create personas that can sing and speak in multiple languages with authentic pronunciation</li>
                  </ul>
                  <div 
                    className="mt-6 rounded-lg w-full h-64 relative overflow-hidden"
                    onMouseEnter={() => setIsHoveringEffect(true)}
                    onMouseLeave={() => setIsHoveringEffect(false)}
                  >
                    <VideoBackground
                      videoUrl="/Videos/Gen-3 Alpha 3499529498, A close-up of a goth, dreammakerstudio_htt, M 5.mp4"
                      isHovering={isHoveringEffect}
                      continuePlayback={false}
                      fallbackImage="/lovable-uploads/4fcaace6-9ca6-4012-8e19-966bfcd94cc4.png"
                      priority={true}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="character-development" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">Character Development</h3>
                  <p className="mb-4">Build rich, compelling personas with detailed backstories, unique personality traits, and artistic influences. Our character development system helps you create virtual artists that feel authentic and engaging.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Craft detailed character histories, motivations, and artistic journeys</li>
                    <li>Define unique personality characteristics that influence creative style</li>
                    <li>Specify musical and artistic influences that shape your persona's output</li>
                    <li>Create personas that grow and evolve over time based on interactions</li>
                  </ul>
                  <img src="/lovable-uploads/c83df97a-619d-42c9-b61f-d26f2549e849.png" alt="Character Development Interface" className="mt-6 rounded-lg w-full" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="visual-identity" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">Visual Identity Creation</h3>
                  <p className="mb-4">Design stunning visual representations for your personas with our AI-powered image generation tools. Create consistent visual branding across all persona content.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Create stunning, realistic avatars using our advanced image generation technology</li>
                    <li>Maintain visual consistency across all persona content with style-matching algorithms</li>
                    <li>Design logos, color schemes, and visual motifs for unique brand identity</li>
                    <li>Bring your personas to life with customizable animations and dynamic visual elements</li>
                  </ul>
                  <div className="mt-6 rounded-lg w-full h-64 relative overflow-hidden">
                    <VideoBackground
                      videoUrl="/Videos/Gen-3 Alpha 3612719966, digital face emerges, dreammakerstudio_htt, M 5.mp4"
                      isHovering={true}
                      continuePlayback={true}
                      fallbackImage="/lovable-uploads/a4975e49-91b3-4923-85ca-6916aa5bd37e.png"
                      priority={true}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="content-generation" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">Content Generation</h3>
                  <p className="mb-4">Empower your personas to create original content including lyrics, music, and social media posts. Our AI-powered content generation tools help your personas express themselves authentically.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Create original lyrics in your persona's unique style and voice</li>
                    <li>Generate musical compositions tailored to your persona's genre preferences</li>
                    <li>Automatically create engaging social posts that maintain your persona's authentic voice</li>
                    <li>Enable collaborations between personas or with human artists to create unique content</li>
                  </ul>
                  <img src="/lovable-uploads/b4d42ec2-c6c6-4d46-b7c9-348320864db2.png" alt="Content Generation Interface" className="mt-6 rounded-lg w-full" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-16">
        <GenreGrid />
      </div>
    </div>
  );
};
