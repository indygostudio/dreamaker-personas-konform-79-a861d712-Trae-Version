import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { VideoBackground } from "@/components/dreamaker/VideoBackground";
import { Music, Users, ShoppingBag, Sparkles, Disc3 } from "lucide-react";

export const DreamakerSection = () => {
  const navigate = useNavigate();
  const [isHoveringEffect, setIsHoveringEffect] = useState(false);
  const [activeTab, setActiveTab] = useState("ai-record-label");
  
  return (
    <div className="py-12 bg-black relative">
      {/* Video Banner Container */}
      <div className="h-[40vh] relative overflow-hidden cursor-pointer" onClick={() => navigate("/dreamaker")}>
        {/* Background Video */}
        <div className="absolute inset-0">
          <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
            <source src="/Videos/Gen-3 Alpha 1222913568, Dreamlike clouds in , imagepng, M 5.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center flex-col bg-gradient-to-b from-black/40 to-black/80 p-8">
          <h1 className="text-6xl font-bold text-white mb-4">DREAMAKER</h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-center text-lg">
            Your AI Record Label and Marketplace. Create, collaborate, and distribute your music with AI-powered tools.
          </p>
        </div>
      </div>

      <div className="w-full px-0 relative z-10">
        <div className="space-y-6 text-gray-400 w-full text-lg leading-relaxed px-4 md:px-8">
          <Tabs defaultValue="ai-record-label" className="w-full mt-8" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="inline-flex items-center gap-4 bg-black/80 backdrop-blur-xl rounded-full p-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 flex-wrap justify-center">
              <TabsTrigger 
                value="ai-record-label" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-black/20 text-white/80 border-white/10 hover:bg-[#6366F1]/10 hover:text-white hover:border-[#6366F1]/20 hover:shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 data-[state=active]:bg-[#6366F1]/10 data-[state=active]:text-white data-[state=active]:border-[#6366F1]/20 data-[state=active]:shadow-[0_4px_20px_rgba(99,102,241,0.3)] data-[state=active]:-translate-y-0.5 font-syne"
              >
                <Music className="w-4 h-4 mr-2" />
                AI Record Label
              </TabsTrigger>
              <TabsTrigger 
                value="marketplace" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-black/20 text-white/80 border-white/10 hover:bg-[#6366F1]/10 hover:text-white hover:border-[#6366F1]/20 hover:shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 data-[state=active]:bg-[#6366F1]/10 data-[state=active]:text-white data-[state=active]:border-[#6366F1]/20 data-[state=active]:shadow-[0_4px_20px_rgba(99,102,241,0.3)] data-[state=active]:-translate-y-0.5 font-syne"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Marketplace
              </TabsTrigger>
              <TabsTrigger 
                value="collaboration" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-black/20 text-white/80 border-white/10 hover:bg-[#6366F1]/10 hover:text-white hover:border-[#6366F1]/20 hover:shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 data-[state=active]:bg-[#6366F1]/10 data-[state=active]:text-white data-[state=active]:border-[#6366F1]/20 data-[state=active]:shadow-[0_4px_20px_rgba(99,102,241,0.3)] data-[state=active]:-translate-y-0.5 font-syne"
              >
                <Users className="w-4 h-4 mr-2" />
                Collaboration
              </TabsTrigger>
              <TabsTrigger 
                value="ai-mastering" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-black/20 text-white/80 border-white/10 hover:bg-[#6366F1]/10 hover:text-white hover:border-[#6366F1]/20 hover:shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 data-[state=active]:bg-[#6366F1]/10 data-[state=active]:text-white data-[state=active]:border-[#6366F1]/20 data-[state=active]:shadow-[0_4px_20px_rgba(99,102,241,0.3)] data-[state=active]:-translate-y-0.5 font-syne"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Mastering
              </TabsTrigger>
              <TabsTrigger 
                value="distribution" 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-black/20 text-white/80 border-white/10 hover:bg-[#6366F1]/10 hover:text-white hover:border-[#6366F1]/20 hover:shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 data-[state=active]:bg-[#6366F1]/10 data-[state=active]:text-white data-[state=active]:border-[#6366F1]/20 data-[state=active]:shadow-[0_4px_20px_rgba(99,102,241,0.3)] data-[state=active]:-translate-y-0.5 font-syne"
              >
                <Disc3 className="w-4 h-4 mr-2" />
                Distribution
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ai-record-label" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">AI Record Label</h3>
                  <p className="mb-4">Dreamaker's AI Record Label revolutionizes how artists create, produce, and distribute music. Our platform combines cutting-edge AI technology with traditional record label services to help artists at every stage of their career.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>AI-powered talent discovery and development tailored to your unique sound</li>
                    <li>Personalized marketing strategies using predictive analytics</li>
                    <li>Automated royalty tracking and distribution with blockchain technology</li>
                    <li>Virtual A&R services that provide real-time feedback on your music</li>
                  </ul>
                  <div 
                    className="mt-6 rounded-lg w-full h-64 relative overflow-hidden"
                    onMouseEnter={() => setIsHoveringEffect(true)}
                    onMouseLeave={() => setIsHoveringEffect(false)}
                  >
                    <VideoBackground
                      videoUrl="/Videos/DREAMAKER_01.mp4"
                      isHovering={isHoveringEffect}
                      continuePlayback={false}
                      fallbackImage="/lovable-uploads/4ae2356f-5155-4bf0-81b7-259f38368f76.png"
                      priority={true}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="marketplace" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">Marketplace</h3>
                  <p className="mb-4">Our vibrant marketplace connects artists, producers, and fans in a dynamic ecosystem where creativity thrives. Buy, sell, and trade AI personas, voice models, beats, and more in a secure and artist-friendly environment.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Browse thousands of AI personas and voice models across all genres</li>
                    <li>Discover unique beats, samples, and production templates</li>
                    <li>Commission custom AI personas from top creators</li>
                    <li>Monetize your own AI creations with flexible licensing options</li>
                  </ul>
                  <div 
                    className="mt-6 rounded-lg w-full h-64 relative overflow-hidden"
                    onMouseEnter={() => setIsHoveringEffect(true)}
                    onMouseLeave={() => setIsHoveringEffect(false)}
                  >
                    <VideoBackground
                      videoUrl="/Videos/DREAMAKER_02.mp4"
                      isHovering={isHoveringEffect}
                      continuePlayback={false}
                      fallbackImage="/lovable-uploads/6e8a4b75-aa40-4ace-aa45-dbbd669d80ea.png"
                      priority={true}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="collaboration" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">Collaboration</h3>
                  <p className="mb-4">Dreamaker breaks down barriers to collaboration with powerful tools that connect artists across the globe. Work with AI personas or human collaborators seamlessly in our integrated platform.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Real-time collaboration with multiple artists and AI personas</li>
                    <li>Smart matching algorithm to find the perfect collaborators</li>
                    <li>Integrated project management tools for tracking progress</li>
                    <li>Fair revenue sharing and transparent royalty splits</li>
                  </ul>
                  <div 
                    className="mt-6 rounded-lg w-full h-64 relative overflow-hidden"
                    onMouseEnter={() => setIsHoveringEffect(true)}
                    onMouseLeave={() => setIsHoveringEffect(false)}
                  >
                    <VideoBackground
                      videoUrl="/Videos/PORTAL_01.mp4"
                      isHovering={isHoveringEffect}
                      continuePlayback={false}
                      fallbackImage="/lovable-uploads/c83df97a-619d-42c9-b61f-d26f2549e849.png"
                      priority={true}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="ai-mastering" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">AI Mastering</h3>
                  <p className="mb-4">Our advanced AI mastering engine delivers professional-quality masters in minutes. Trained on thousands of hit records, our system understands the nuances of different genres and adapts to your unique sound.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Genre-specific mastering algorithms that understand musical context</li>
                    <li>Adaptive EQ, compression, and limiting tailored to your track</li>
                    <li>Reference track matching to achieve your desired sound</li>
                    <li>Stem-based mastering for ultimate control over your mix</li>
                  </ul>
                  <div 
                    className="mt-6 rounded-lg w-full h-64 relative overflow-hidden"
                    onMouseEnter={() => setIsHoveringEffect(true)}
                    onMouseLeave={() => setIsHoveringEffect(false)}
                  >
                    <VideoBackground
                      videoUrl="/Videos/MIXER_03.mp4"
                      isHovering={isHoveringEffect}
                      continuePlayback={false}
                      fallbackImage="/lovable-uploads/ba8fafdc-d448-4082-90c9-d606091b75a0.png"
                      priority={true}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="distribution" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">Distribution</h3>
                  <p className="mb-4">Get your music to all major streaming platforms with our comprehensive distribution service. We handle everything from metadata optimization to royalty collection, so you can focus on creating great music.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>One-click distribution to Spotify, Apple Music, Amazon Music, YouTube Music, and more</li>
                    <li>Smart metadata optimization to improve discoverability</li>
                    <li>Transparent royalty tracking and payment processing</li>
                    <li>Release planning and promotional tools to maximize your launch</li>
                  </ul>
                  <div 
                    className="mt-6 rounded-lg w-full h-64 relative overflow-hidden"
                    onMouseEnter={() => setIsHoveringEffect(true)}
                    onMouseLeave={() => setIsHoveringEffect(false)}
                  >
                    <VideoBackground
                      videoUrl="/Videos/Gen-3 Alpha 2708728073, Lyric book on a tabl, dreammakerstudio_a_d, M 5.mp4"
                      isHovering={isHoveringEffect}
                      continuePlayback={false}
                      fallbackImage="/lovable-uploads/7598eec0-9726-4b14-b95a-add230e1f6af.png"
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