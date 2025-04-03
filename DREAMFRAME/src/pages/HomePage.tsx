import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import VideoBackground from "../components/VideoBackground";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const navigate = useNavigate();

  // Navigate to wizard or editor
  const navigateToWizard = () => {
    navigate("/wizard");
  };
  const navigateToEditor = () => {
    navigate("/storyboard");
  };
  return <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Background video */}
      <VideoBackground videoSrc="/Videos/KONFORM_BG_03.mp4" opacity={0.2} />

      {/* Header */}
      <header className="container mx-auto p-6 z-10 relative">
        <div className="flex justify-between items-center">
          
          <div className="flex items-center gap-4">
            
            
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto flex-grow flex flex-col p-6 z-10 relative">
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full mt-8">
          <h2 className="text-4xl font-bold text-center text-white mb-8">Create your next video</h2>
          
          {/* Main options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start with a concept */}
            <Card className="dark-glass-card border-white/10 overflow-hidden group relative" onClick={navigateToWizard}>
              <div className="p-8 flex flex-col h-full">
                <h3 className="text-3xl font-bold mb-3">Start with a concept</h3>
                <p className="text-white/70 mb-6">Instantly turn any idea or script into a vivid Project</p>
                <Button className="bg-[#0047FF] hover:bg-[#0033CC] w-fit">
                  New Project
                </Button>
                <div className="mt-auto">
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="bg-gradient-to-tr from-[#1a2030] to-[#2a3040] rounded-lg overflow-hidden aspect-video relative">
                      <div className="absolute inset-0 p-2 text-xs text-white/50">Women in a field</div>
                    </div>
                    <div className="bg-gradient-to-tr from-[#1a2030] to-[#2a3040] rounded-lg overflow-hidden aspect-video relative">
                      <div className="absolute inset-0 p-2 text-xs text-white/50">Close-up shot</div>
                    </div>
                    <div className="bg-gradient-to-tr from-[#1a2030] to-[#2a3040] rounded-lg overflow-hidden aspect-video relative">
                      <div className="absolute inset-0 p-2 text-xs text-white/50">Foregrounded shot</div>
                    </div>
                    <div className="bg-gradient-to-tr from-[#1a2030] to-[#2a3040] rounded-lg overflow-hidden aspect-video relative">
                      <div className="absolute inset-0 p-2 text-xs text-white/50">Hot air balloon</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 border-2 border-transparent transition-all duration-300 group-hover:border-[#0047FF]/50 group-hover:shadow-[0_0_20px_rgba(0,71,255,0.3)] rounded-lg"></div>
            </Card>

            {/* Start from scratch */}
            <Card className="dark-glass-card border-white/10 overflow-hidden group relative" onClick={navigateToEditor}>
              <div className="p-8 flex flex-col h-full">
                <h3 className="text-3xl font-bold mb-3">Start from scratch</h3>
                <p className="text-white/70 mb-6">Full freedom to craft your story, shot by shot</p>
                <Button className="bg-[#0047FF] hover:bg-[#0033CC] w-fit">
                  New blank Project
                </Button>
                <div className="mt-auto flex justify-center items-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#1a2030] to-[#2a3040] flex items-center justify-center mt-8">
                    <span className="text-5xl text-white/40">+</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 border-2 border-transparent transition-all duration-300 group-hover:border-[#0047FF]/50 group-hover:shadow-[0_0_20px_rgba(0,71,255,0.3)] rounded-lg"></div>
            </Card>
          </div>

          {/* Additional options */}
          <div className="mt-16">
            <h3 className="text-2xl font-semibold mb-6">More ways to create</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Generate images */}
              <Card className="dark-glass-card border-white/10 overflow-hidden group relative">
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2">Generate images</h4>
                  <p className="text-white/70 text-sm">Explore your personal image-storming workspace.</p>
                </div>
                <div className="h-40 bg-gradient-to-tr from-[#1a2030] to-[#2a3040]"></div>
                <div className="absolute inset-0 border-2 border-transparent transition-all duration-300 group-hover:border-[#0047FF]/50 group-hover:shadow-[0_0_10px_rgba(0,71,255,0.3)] rounded-lg"></div>
              </Card>

              {/* Generate motion */}
              <Card className="dark-glass-card border-white/10 overflow-hidden group relative">
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2">Generate motion</h4>
                  <p className="text-white/70 text-sm">Set a still image in motion. Powered by Gen-4.</p>
                </div>
                <div className="h-40 bg-gradient-to-tr from-[#1a2030] to-[#2a3040]"></div>
                <div className="absolute inset-0 border-2 border-transparent transition-all duration-300 group-hover:border-[#0047FF]/50 group-hover:shadow-[0_0_10px_rgba(0,71,255,0.3)] rounded-lg"></div>
              </Card>

              {/* Train an Actor */}
              <Card className="dark-glass-card border-white/10 overflow-hidden group relative">
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2">Train an Actor</h4>
                  <p className="text-white/70 text-sm">Create a realistic, consistent, and reusable character model.</p>
                </div>
                <div className="h-40 bg-gradient-to-tr from-[#1a2030] to-[#2a3040]"></div>
                <div className="absolute inset-0 border-2 border-transparent transition-all duration-300 group-hover:border-[#0047FF]/50 group-hover:shadow-[0_0_10px_rgba(0,71,255,0.3)] rounded-lg"></div>
              </Card>
            </div>
          </div>

          {/* Recent projects */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Recent projects</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  All Projects
                </Button>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  Shared Projects
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Example project cards - could be dynamically generated */}
              {[1, 2, 3, 4, 5, 6].map(i => <Card key={i} className="dark-glass-card border-white/10 overflow-hidden group relative h-60">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 p-4">
                    <h5 className="text-lg font-bold text-white">Project {i}</h5>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent transition-all duration-300 group-hover:border-[#0047FF]/50 group-hover:shadow-[0_0_10px_rgba(0,71,255,0.3)] rounded-lg"></div>
                </Card>)}
            </div>
          </div>
        </div>
      </main>
    </div>;
};
export default HomePage;