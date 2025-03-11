import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SubscriptionDialog } from "@/components/SubscriptionDialog";
import { Footer } from "@/components/Footer";
import { useSession } from "@supabase/auth-helpers-react";
import { Music2, Waves, Mic2, Settings2, Layers, Share2, BarChart2, Workflow, Bot, Wand2, FileAudio, Disc, Users, Brain, Sliders, Database } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { VideoBackground } from "@/components/dreamaker/VideoBackground";
const features = [{
  title: "AI Voice Generation",
  description: "Create unique voices with advanced AI models and real-time voice synthesis",
  icon: <Mic2 className="w-6 h-6" />,
  tags: ["Voice Synthesis", "Character Creation", "Real-time Processing"],
  video: "/Videos/ANDROID_II_01.mp4"
}, {
  title: "Professional DAW",
  description: "Full-featured Digital Audio Workstation with AI assistance and VST support",
  icon: <Music2 className="w-6 h-6" />,
  tags: ["Production", "Mixing", "Mastering", "VST Integration"],
  video: "/Videos/Gen-3 Alpha 3612719966, digital face emerges, dreammakerstudio_htt, M 5.mp4"
}, {
  title: "Audio Processing",
  description: "Advanced audio processing with AI-powered effects and real-time analysis",
  icon: <Waves className="w-6 h-6" />,
  tags: ["Effects", "Processing", "Real-time Analysis"],
  video: "/Videos/Gen-3 Alpha 869480173, Vector simple illust, Cropped - imagewebp, M 5.mp4"
}];
const dawFeatures = [{
  title: "Intuitive Interface",
  description: "User-friendly design with customizable layouts and workflow optimization",
  icon: <Settings2 className="w-6 h-6" />
}, {
  title: "Multi-track Support",
  description: "Handle complex arrangements with unlimited tracks and grouping",
  icon: <Layers className="w-6 h-6" />
}, {
  title: "Collaboration Tools",
  description: "Real-time collaboration with version control and track locking",
  icon: <Share2 className="w-6 h-6" />
}];
const aiTools = [{
  title: "AI Mixing Assistant",
  description: "Intelligent mixing suggestions and automated track processing",
  icon: <Bot className="w-6 h-6" />,
  tags: ["AI", "Mixing"],
  video: "/Videos/MIXER_01.mp4"
}, {
  title: "Style Transfer",
  description: "Apply and blend different musical styles using AI",
  icon: <Wand2 className="w-6 h-6" />,
  tags: ["AI", "Style"],
  video: "/Videos/Dna xray 2.mp4"
}, {
  title: "Dataset Training",
  description: "Train custom AI models with your own audio samples",
  icon: <Database className="w-6 h-6" />,
  tags: ["AI", "Training"],
  video: "/Videos/Gen-3 Alpha 2345214770, digital brain on rot, imagepng (8), M 5.mp4"
}];
const advancedFeatures = [{
  title: "Virtual Studio",
  description: "Complete virtual studio environment with AI-powered instruments",
  icon: <FileAudio className="w-6 h-6" />
}, {
  title: "Beat Making",
  description: "Intelligent rhythm generation and pattern creation",
  icon: <Disc className="w-6 h-6" />
}, {
  title: "Collaborative Features",
  description: "Work together with other producers and AI artists",
  icon: <Users className="w-6 h-6" />
}, {
  title: "Neural Processing",
  description: "Advanced neural networks for audio enhancement",
  icon: <Brain className="w-6 h-6" />
}, {
  title: "Adaptive Mixing",
  description: "Context-aware mixing profiles and automation",
  icon: <Sliders className="w-6 h-6" />
}];
export const KonformProduct = () => {
  const session = useSession();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  useEffect(() => {
    console.log("KonformProduct component mounted");
    const video = videoRef.current;
    if (video) {
      video.onerror = e => {
        console.error("Video error:", video.error);
      };
      video.onloadeddata = () => {
        console.log("Video loaded successfully");
      };
    }
  }, []);
  return <div className="min-h-screen bg-konform-bg text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
          <source src="/Videos/KONFORM_BG_03.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <div className="mb-4">
            
          </div>
          <h1 className="text-6xl font-bold mb-6">KONFORM</h1>
          <p className="text-xl mb-8 max-w-2xl">
            The next generation Digital Audio Workstation powered by artificial intelligence
          </p>
          <SubscriptionDialog />
        </div>
      </div>

      {/* Core Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => <Card key={index} className="bg-konform-surface border-konform-border p-6 hover:border-konform-neon-blue transition-colors relative overflow-hidden h-[320px]" onMouseEnter={() => setHoveredCard(index)} onMouseLeave={() => setHoveredCard(null)}>
              <div className="absolute inset-0 z-0">
                <VideoBackground videoUrl={feature.video} isHovering={hoveredCard === index} continuePlayback={false} darkness={80} />
              </div>
              <div className="relative z-10">
                <div className="mb-4 text-konform-neon-blue">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <div className="flex flex-wrap gap-2">
                  {feature.tags.map((tag, tagIndex) => <span key={tagIndex} className="px-3 py-1 bg-konform-neon-blue/10 text-konform-neon-blue rounded-full text-sm">
                      {tag}
                    </span>)}
                </div>
              </div>
            </Card>)}
        </div>
      </div>

      {/* AI Tools Section */}
      <div className="bg-black/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">AI-Powered Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aiTools.map((tool, index) => <Card key={index} className="bg-konform-surface border-konform-border p-6 hover:border-konform-neon-orange transition-colors relative overflow-hidden h-[320px]" onMouseEnter={() => setHoveredCard(index + 100)} // Using offset to avoid collision with features
          onMouseLeave={() => setHoveredCard(null)}>
                <div className="absolute inset-0 z-0">
                  <VideoBackground videoUrl={tool.video} isHovering={hoveredCard === index + 100} continuePlayback={false} darkness={80} />
                </div>
                <div className="relative z-10">
                  <div className="mb-4 text-konform-neon-orange">{tool.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                  <p className="text-gray-400 mb-4">{tool.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag, tagIndex) => <span key={tagIndex} className="px-3 py-1 bg-konform-neon-orange/10 text-konform-neon-orange rounded-full text-sm">
                        {tag}
                      </span>)}
                  </div>
                </div>
              </Card>)}
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center">Advanced Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {advancedFeatures.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden bg-black/60 border-konform-border hover:border-konform-neon-blue transition-all duration-300 cursor-pointer h-[320px]"
            >
              <div className="absolute inset-0 z-0">
                <VideoBackground
                  videoUrl={feature.video || '/Videos/KONFORM_01.mp4'}
                  isHovering={hoveredCard === index + 200}
                  continuePlayback={false}
                  darkness={80}
                />
              </div>
              <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="mb-4 text-konform-neon-blue flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400 flex-grow">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-black/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Transform Your Music Production?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the next generation of music producers and experience the power of AI-assisted music creation.
          </p>
          <SubscriptionDialog />
        </div>
      </div>

      <Footer />
    </div>;
};
export default KonformProduct;