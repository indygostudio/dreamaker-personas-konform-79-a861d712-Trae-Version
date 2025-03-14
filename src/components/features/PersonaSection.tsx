
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { VideoBackground } from "@/components/dreamaker/VideoBackground";
import { GenreGrid } from "./GenreGrid";
import { Mic2, User, Image, FileText, Wand2, TrendingUp } from "lucide-react";

export const PersonaSection = () => {
  const navigate = useNavigate();
  const [isHoveringEffect, setIsHoveringEffect] = useState(false);
  const [activeTab, setActiveTab] = useState("voice-cloning");
  
  return (
    <div id="personas-section" className="py-12 bg-black relative personas-section-wrapper">
      {/* Video Banner Container */}
      <div className="h-[40vh] relative overflow-hidden cursor-pointer" onClick={() => navigate("/personas")}>
        {/* Background Video */}
        <div className="absolute inset-0">
          <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
            <source src="/Videos/Gen-3 Alpha 3165178086, scrolling frames of , imagepng (11), M 5 (1).mp4" type="video/mp4" />
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
                  <p className="mb-4">Our advanced voice cloning technology allows you to create incredibly realistic AI voices with precise control over multiple voice characteristics.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    {/* Voice Expression Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <Wand2 className="w-5 h-5 text-purple-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Voice Expression</h4>
                      </div>
                      <p className="text-gray-400">Control emotional range, style, and delivery. Fine-tune expressions from subtle to dramatic for authentic performances.</p>
                    </div>

                    {/* Voice Timbre Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <Mic2 className="w-5 h-5 text-purple-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Voice Timbre</h4>
                      </div>
                      <p className="text-gray-400">Shape the unique color and texture of the voice. Adjust resonance, breathiness, and tonal qualities for distinct character.</p>
                    </div>

                    {/* Voice Blending Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <FileText className="w-5 h-5 text-purple-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Voice Blending</h4>
                      </div>
                      <p className="text-gray-400">Mix and merge voice characteristics. Create hybrid voices by combining multiple voice profiles seamlessly.</p>
                    </div>

                    {/* Voice Age Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <User className="w-5 h-5 text-purple-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Voice Age</h4>
                      </div>
                      <p className="text-gray-400">Modify voice age characteristics. Adjust maturity, youthfulness, and age-specific vocal qualities naturally.</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="character-development" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">Character Development</h3>
                  <p className="mb-8">Build rich, compelling personas with detailed backstories, unique personality traits, and artistic influences. Our character development system helps you create virtual artists that feel authentic and engaging.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Character Image Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <Image className="w-5 h-5 text-purple-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Character Image</h4>
                      </div>
                      <p className="text-gray-400">Generate stunning, photorealistic avatars and visuals that capture your character's unique essence and style.</p>
                    </div>

                    {/* Character Voice Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <Mic2 className="w-5 h-5 text-purple-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Character Voice</h4>
                      </div>
                      <p className="text-gray-400">Define your character's unique vocal characteristics, from tone and timbre to emotional expression and delivery style.</p>
                    </div>

                    {/* Character Personality Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <User className="w-5 h-5 text-purple-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Character Personality</h4>
                      </div>
                      <p className="text-gray-400">Shape your character's traits, behaviors, and artistic influences to create a compelling and authentic persona.</p>
                    </div>

                    {/* Character Growth Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <TrendingUp className="w-5 h-5 text-purple-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Character Growth</h4>
                      </div>
                      <p className="text-gray-400">Watch your character evolve through interactions and experiences, developing a dynamic and engaging personality over time.</p>
                    </div>
                  </div>
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
                  <div className="mt-6 rounded-lg w-full h-64 relative overflow-hidden">
                    <VideoBackground
                      videoUrl="/Videos/Gen-3 Alpha 2708728073, Lyric book on a tabl, dreammakerstudio_a_d, M 5.mp4"
                      isHovering={true}
                      continuePlayback={true}
                      fallbackImage="/lovable-uploads/b4d42ec2-c6c6-4d46-b7c9-348320864db2.png"
                      priority={true}
                    />
                  </div>
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
