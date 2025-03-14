import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef, useEffect } from "react";
import { VideoBackground } from "@/components/dreamaker/VideoBackground";
import { Music, Users, ShoppingBag, Sparkles, Disc3, Brain, Settings, RefreshCw } from "lucide-react";

export const DreamakerSection = () => {
  const navigate = useNavigate();
  const [isHoveringEffect, setIsHoveringEffect] = useState(false);
  const [activeTab, setActiveTab] = useState("ai-record-label");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  return (
    <div id="dreamaker-section" className="py-12 bg-black relative dreamaker-section-wrapper">
      {/* Video Banner Container */}
      <div 
        className="h-[40vh] relative overflow-hidden cursor-pointer" 
        onClick={() => navigate("/dreamaker")}
      >
        {/* Background Video */}
        <div className="absolute inset-0">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover" 
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src="/Videos/Gen-3 Alpha 1222913568, Dreamlike clouds in , imagepng, M 5.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Enhanced gradient overlay with darker edges */}
          <div className="absolute inset-0 bg-gradient-radial from-black/50 via-black/60 to-black/90"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/80"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center flex-col p-8">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">DREAMAKER</h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-center text-lg drop-shadow-md">
            Your Human-Driven AI Record Label and Creative Hub. Shape, evolve, and collaborate with AI tools that learn and grow with your artistic vision.
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
            {/* Tab content sections */}
            <TabsContent value="ai-record-label" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">AI Record Label</h3>
                  <p className="mb-8 text-gray-400">Dreamaker's human-centric AI Record Label revolutionizes music creation by putting you in control. Our adaptive platform learns from your creative choices, evolving with your artistic journey while providing cutting-edge AI technology that enhances your unique vision.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Personalized AI Models Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-[#6366F1]/20 hover:border-[#6366F1]/40 transition-all group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[#6366F1]/10 group-hover:bg-[#6366F1]/20 transition-all">
                          <Brain className="w-5 h-5 text-[#6366F1]" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Personalized AI</h4>
                      </div>
                      <p className="text-gray-400">AI models that learn and evolve with your creative style, adapting to your unique artistic vision and preferences.</p>
                    </div>
                  
                    {/* User-driven Transformers Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-[#6366F1]/20 hover:border-[#6366F1]/40 transition-all group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[#6366F1]/10 group-hover:bg-[#6366F1]/20 transition-all">
                          <Settings className="w-5 h-5 text-[#6366F1]" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Smart Control</h4>
                      </div>
                      <p className="text-gray-400">User-driven transformers that adapt to your artistic preferences, giving you complete control over the creative process.</p>
                    </div>
                  
                    {/* Collaborative Royalty Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-[#6366F1]/20 hover:border-[#6366F1]/40 transition-all group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[#6366F1]/10 group-hover:bg-[#6366F1]/20 transition-all">
                          <Users className="w-5 h-5 text-[#6366F1]" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Fair Royalties</h4>
                      </div>
                      <p className="text-gray-400">Collaborative royalty sharing system ensures fair compensation for all contributors in AI-assisted creations.</p>
                    </div>
                  
                    {/* Continuous Updates Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-[#6366F1]/20 hover:border-[#6366F1]/40 transition-all group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[#6366F1]/10 group-hover:bg-[#6366F1]/20 transition-all">
                          <RefreshCw className="w-5 h-5 text-[#6366F1]" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Always Learning</h4>
                      </div>
                      <p className="text-gray-400">Continuous model updates based on your creative decisions, ensuring your AI tools evolve with your artistry.</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="marketplace" className="mt-0">
              <div className="p-6 bg-zinc-950 rounded-none w-full">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-white">Marketplace</h3>
                  <p className="mb-4">Our creator-centric marketplace empowers artists to share and monetize their unique AI personas and models. Build a community around your creative vision and earn from your AI-enhanced innovations.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Share and monetize your custom-trained AI personas</li>
                    <li>Collaborative revenue sharing for merged AI models</li>
                    <li>Community-driven model evolution and improvements</li>
                    <li>Fair compensation for AI training contributions</li>
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
                  <p className="mb-4">Dreamaker fosters a unique ecosystem where human creativity meets AI innovation. Collaborate with other artists, share royalties, and create hybrid personas that combine the best of human artistry and AI technology.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Create hybrid personas by merging multiple AI models</li>
                    <li>Transparent royalty sharing for collaborative creations</li>
                    <li>Community-driven model training and improvement</li>
                    <li>Cross-pollination of creative styles and techniques</li>
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
                  <p className="mb-4">Get your music heard worldwide with our comprehensive distribution network. We ensure your music reaches all major streaming platforms while maintaining complete control over your releases.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Global distribution to all major streaming platforms</li>
                    <li>Real-time analytics and performance tracking</li>
                    <li>Automated royalty collection and distribution</li>
                    <li>Strategic release planning and promotion tools</li>
                  </ul>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    {/* Global Distribution Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-[#6366F1]/20 hover:border-[#6366F1]/40 transition-all group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[#6366F1]/10 group-hover:bg-[#6366F1]/20 transition-all">
                          <Disc3 className="w-5 h-5 text-[#6366F1]" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Global Reach</h4>
                      </div>
                      <p className="text-gray-400">Distribute your music to all major streaming platforms worldwide with just a few clicks.</p>
                    </div>
                  
                    {/* Analytics Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-[#6366F1]/20 hover:border-[#6366F1]/40 transition-all group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[#6366F1]/10 group-hover:bg-[#6366F1]/20 transition-all">
                          <RefreshCw className="w-5 h-5 text-[#6366F1]" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Real-time Analytics</h4>
                      </div>
                      <p className="text-gray-400">Track your music's performance with comprehensive analytics and insights in real-time.</p>
                    </div>
                  
                    {/* Royalty Collection Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-[#6366F1]/20 hover:border-[#6366F1]/40 transition-all group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[#6366F1]/10 group-hover:bg-[#6366F1]/20 transition-all">
                          <ShoppingBag className="w-5 h-5 text-[#6366F1]" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Royalty Collection</h4>
                      </div>
                      <p className="text-gray-400">Automated royalty collection ensures you get paid for every stream across all platforms.</p>
                    </div>
                  
                    {/* Release Planning Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-[#6366F1]/20 hover:border-[#6366F1]/40 transition-all group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[#6366F1]/10 group-hover:bg-[#6366F1]/20 transition-all">
                          <Settings className="w-5 h-5 text-[#6366F1]" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Strategic Planning</h4>
                      </div>
                      <p className="text-gray-400">Plan and promote your releases with powerful tools designed to maximize your music's impact.</p>
                    </div>
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