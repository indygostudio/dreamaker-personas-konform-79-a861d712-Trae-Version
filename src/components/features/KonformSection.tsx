
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { VideoBackground } from "@/components/dreamaker/VideoBackground";
import { Music, Users, Settings, Plug } from "lucide-react";

export const KonformSection = () => {
  const navigate = useNavigate();
  const [isHoveringEffect, setIsHoveringEffect] = useState(false);
  
  return (
    <div className="py-12 bg-black relative">
      {/* Video Banner Container */}
      <div className="h-[40vh] relative overflow-hidden cursor-pointer" onClick={() => navigate("/konform")}>
        {/* Background Video */}
        <div className="absolute inset-0">
          <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
            <source src="/Videos/KONFORM_01.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>


      </div>

      <div className="w-full px-0 relative z-10">
        <div className="space-y-6 text-gray-400 w-full text-lg leading-relaxed px-4 md:px-8">
          <Tabs defaultValue="style" className="w-full mt-8">
            <TabsList className="inline-flex items-center gap-4 bg-black/80 backdrop-blur-xl rounded-full p-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 flex-wrap justify-center">
              <TabsTrigger 
                value="style" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-black/20 text-white/80 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 font-syne"
              >
                Style Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="processing" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-black/20 text-white/80 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 font-syne"
              >
                Smart Processing
              </TabsTrigger>
              <TabsTrigger 
                value="effects" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-black/20 text-white/80 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 font-syne"
              >
                AI Effects
              </TabsTrigger>
              <TabsTrigger 
                value="ai-instruments" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-black/20 text-white/80 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 font-syne"
              >
                AI Instruments
              </TabsTrigger>
              <TabsTrigger 
                value="ai-sessions" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-black/20 text-white/80 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 font-syne"
              >
                AI Sessions
              </TabsTrigger>
              <TabsTrigger 
                value="ai-mixer" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-black/20 text-white/80 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 data-[state=active]:bg-[#0EA5E9]/10 data-[state=active]:text-white data-[state=active]:border-[#0EA5E9]/20 data-[state=active]:shadow-[0_4px_20px_rgba(14,165,233,0.3)] data-[state=active]:-translate-y-0.5 font-syne"
              >
                AI Mixer
              </TabsTrigger>
            </TabsList>
            
            {/* Tab content sections */}
            <TabsContent value="style" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">Style Analysis</h3>
                  <p className="mb-4">Advanced AI-powered analysis of mixing techniques and sound signatures from reference tracks. Our neural networks break down the components that make your favorite records sound the way they do.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Deep learning algorithms analyze reference tracks to extract their sonic DNA</li>
                    <li>Extract key sonic characteristics and mixing techniques with precision accuracy</li>
                    <li>Generate detailed reports on frequency balance, dynamics, and effects that can be applied to your own productions</li>
                    <li>Intelligently adapt the analysis to match your project's unique characteristics</li>
                  </ul>
                  <div 
                    className="mt-6 rounded-lg w-full h-64 relative overflow-hidden"
                    onMouseEnter={() => setIsHoveringEffect(true)}
                    onMouseLeave={() => setIsHoveringEffect(false)}
                  >
                    <VideoBackground
                      videoUrl="/Videos/MIXER_02.mp4"
                      isHovering={isHoveringEffect}
                      continuePlayback={false}
                      fallbackImage="/lovable-uploads/d64274af-4503-48fd-a28a-bcc55a780039.png"
                      priority={true}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="processing" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">Smart Processing</h3>
                  <p className="mb-4">Intelligent processing chains that adapt to the source material and desired style, delivering professional-grade results without requiring years of engineering expertise. Our AI analyzes your audio in real-time to apply optimal processing.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Adaptive EQ and compression that automatically identifies and fixes frequency and dynamic issues</li>
                    <li>Style-matched processing suggestions based on your genre and reference tracks</li>
                    <li>Real-time parameter optimization that reacts to changes in your audio material</li>
                    <li>Intelligent signal chain recommendations that recreate the sound of your favorite productions</li>
                  </ul>
                  <img src="/lovable-uploads/9e024129-db26-4fdb-8f97-0ab37fcd5a85.png" alt="Smart Processing Interface" className="mt-6 rounded-lg w-full" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="effects" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">AI Effects</h3>
                  <p className="mb-4">Advanced AI-powered audio effects that intelligently enhance and transform your sound. Our cutting-edge neural networks analyze and process your audio in real-time, delivering professional-grade results with unprecedented control and creativity.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Intelligent Audio Restoration - Remove unwanted noise, artifacts, and distortion while preserving audio quality</li>
                    <li>Spatial Audio Enhancement - Create immersive 3D soundscapes and precise stereo field manipulation</li>
                    <li>Adaptive Effects Processing - Dynamic effects that automatically adjust to your audio content</li>
                    <li>Voice Enhancement & Clarity - Advanced processing for crystal-clear vocals and dialogue</li>
                    <li>Custom Effect Generation - Create unique effects using natural language descriptions</li>
                    <li>Real-time Audio Analysis - Instant feedback and visualization of effect parameters</li>
                  </ul>
                  <img src="/lovable-uploads/6e8a4b75-aa40-4ace-aa45-dbbd669d80ea.png" alt="AI Effects Interface" className="mt-6 rounded-lg w-full" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="ai-instruments" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">AI Instruments</h3>
                  <p className="mb-4">Revolutionary virtual instruments powered by artificial intelligence that respond to your playing style and creative intentions.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    {/* AI Instruments Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[#0EA5E9]/10">
                          <Music className="w-5 h-5 text-[#0EA5E9]" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">AI Instruments</h4>
                      </div>
                      <p className="text-gray-400">Create and customize virtual instruments that adapt to your playing style and musical preferences in real-time.</p>
                    </div>
                    
                    {/* AI Players Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[#0EA5E9]/10">
                          <Users className="w-5 h-5 text-[#0EA5E9]" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">AI Players</h4>
                      </div>
                      <p className="text-gray-400">Intelligent virtual musicians that respond to your performance and provide dynamic accompaniment and improvisation.</p>
                    </div>
                    
                    {/* AI Patches Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[#0EA5E9]/10">
                          <Settings className="w-5 h-5 text-[#0EA5E9]" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">AI Patches</h4>
                      </div>
                      <p className="text-gray-400">Generate and customize intelligent presets that evolve based on your musical context and creative direction.</p>
                    </div>
                    
                    {/* AI Controlled VST Integration Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[#0EA5E9]/10">
                          <Plug className="w-5 h-5 text-[#0EA5E9]" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">VST Integration</h4>
                      </div>
                      <p className="text-gray-400">Seamlessly control and automate your favorite VST plugins with intelligent parameter optimization and modulation.</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="ai-sessions" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">AI Sessions</h3>
                  <p className="mb-4">Collaborative music creation with AI-powered session musicians that respond to your direction and musical ideas. Work with virtual collaborators that understand musical context and can generate complementary parts for any project.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {/* Collaboration Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[#0EA5E9]/10">
                          <Users className="w-5 h-5 text-[#0EA5E9]" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Collaboration</h4>
                      </div>
                      <p className="text-gray-400">Work seamlessly with AI-powered virtual musicians that adapt to your style and creative direction in real-time. Experience natural musical interaction and dynamic collaboration.</p>
                    </div>
                    
                    {/* Session Templates Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[#0EA5E9]/10">
                          <Music className="w-5 h-5 text-[#0EA5E9]" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Session Templates</h4>
                      </div>
                      <p className="text-gray-400">Jump-start your projects with intelligent session templates tailored to your genre and production style. Quickly set up professional workflows and arrangements.</p>
                    </div>
                    
                    {/* AI Training Data Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[#0EA5E9]/10">
                          <Settings className="w-5 h-5 text-[#0EA5E9]" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">AI Training Data</h4>
                      </div>
                      <p className="text-gray-400">Customize and train AI models with your own musical data to create unique virtual collaborators that understand and complement your artistic vision.</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="ai-mixer" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">AI Mixer</h3>
                  <p className="mb-4">Intelligent mixing assistant that analyzes your tracks and suggests optimal mixing decisions based on your musical goals. Our AI mixer learns from thousands of professional mixes to help you achieve studio-quality results.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Automated track balancing that creates professional-sounding mixes with a single click</li>
                    <li>Intelligent EQ and dynamics processing tailored to each individual track</li>
                    <li>Style-matched mixing suggestions based on reference tracks or genres</li>
                    <li>Real-time mix analysis with actionable feedback to improve your sound</li>
                  </ul>
                  <div 
                    className="mt-6 rounded-lg w-full h-64 relative overflow-hidden"
                  >
                    <VideoBackground
                      videoUrl="/Videos/MIXER_01.mp4"
                      isHovering={true}
                      continuePlayback={true}
                      fallbackImage="/lovable-uploads/d64274af-4503-48fd-a28a-bcc55a780039.png"
                      priority={true}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
