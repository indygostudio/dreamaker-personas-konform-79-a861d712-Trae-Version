
import React from 'react';
import { HeroSection } from './sections/HeroSection';
import { ProfileTypesSection } from './sections/ProfileTypesSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

export const ProductDescription = () => {
  const navigate = useNavigate();

  const handleBrowseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/dreamaker");
    setTimeout(() => {
      const searchElement = document.querySelector(".filter-bar");
      if (searchElement) {
        searchElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-dreamaker-bg">
      <HeroSection />
      <ProfileTypesSection />
      
      {/* Mix Engineering Features */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <h2 
          className="text-4xl md:text-5xl font-bold text-center mb-20 animate-fade-in"
        >
          Mix Engineering Features
        </h2>
        <Tabs defaultValue="style-analysis" className="w-full">
          <TabsList className="flex flex-col md:flex-row gap-4 bg-transparent h-auto mb-12">
            <TabsTrigger 
              value="style-analysis"
              className="w-full konform-panel p-8 rounded-xl border border-purple-500/20 group hover:border-purple-500/40 transition-all data-[state=active]:border-purple-500 data-[state=active]:bg-black/60 hover:scale-[1.02] hover:-translate-y-1 duration-300"
            >
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-dreamaker-purple transition-colors">Style Analysis</h3>
                <p className="text-gray-400">AI-powered analysis of mixing techniques and sound signatures.</p>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="smart-processing"
              className="w-full konform-panel p-8 rounded-xl border border-purple-500/20 group hover:border-purple-500/40 transition-all data-[state=active]:border-purple-500 data-[state=active]:bg-black/60 hover:scale-[1.02] hover:-translate-y-1 duration-300"
            >
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-dreamaker-purple transition-colors">Smart Processing</h3>
                <p className="text-gray-400">Intelligent processing chains that adapt to your source material.</p>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="effect-blending"
              className="w-full konform-panel p-8 rounded-xl border border-purple-500/20 group hover:border-purple-500/40 transition-all data-[state=active]:border-purple-500 data-[state=active]:bg-black/60 hover:scale-[1.02] hover:-translate-y-1 duration-300"
            >
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-dreamaker-purple transition-colors">Effect Blending</h3>
                <p className="text-gray-400">Unique way of combining and morphing between different effects.</p>
              </div>
            </TabsTrigger>
          </TabsList>

          <div className="konform-panel p-12 rounded-xl border border-purple-500/20">
            <TabsContent value="style-analysis" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div>
                  <h3 className="text-3xl font-bold mb-6 text-dreamaker-purple">Advanced Style Analysis</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                      <span className="bg-dreamaker-purple/20 p-1 rounded-full mt-1">✓</span>
                      <span>Deep learning algorithms analyze reference tracks to extract mixing patterns</span>
                    </li>
                    <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                      <span className="bg-dreamaker-purple/20 p-1 rounded-full mt-1">✓</span>
                      <span>Identifies key sonic characteristics and processing techniques</span>
                    </li>
                    <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                      <span className="bg-dreamaker-purple/20 p-1 rounded-full mt-1">✓</span>
                      <span>Creates detailed profiles of professional mixing styles</span>
                    </li>
                  </ul>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                  alt="Style Analysis" 
                  className="rounded-lg w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </TabsContent>

            <TabsContent value="smart-processing" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div>
                  <h3 className="text-3xl font-bold mb-6 text-dreamaker-purple">Intelligent Processing</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                      <span className="bg-dreamaker-purple/20 p-1 rounded-full mt-1">✓</span>
                      <span>AI-driven processing chains that adapt in real-time</span>
                    </li>
                    <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                      <span className="bg-dreamaker-purple/20 p-1 rounded-full mt-1">✓</span>
                      <span>Context-aware parameter adjustment based on input material</span>
                    </li>
                    <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                      <span className="bg-dreamaker-purple/20 p-1 rounded-full mt-1">✓</span>
                      <span>Smart presets that evolve with your mixing style</span>
                    </li>
                  </ul>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7" 
                  alt="Smart Processing" 
                  className="rounded-lg w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </TabsContent>

            <TabsContent value="effect-blending" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div>
                  <h3 className="text-3xl font-bold mb-6 text-dreamaker-purple">Effect Morphing</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                      <span className="bg-dreamaker-purple/20 p-1 rounded-full mt-1">✓</span>
                      <span>Seamlessly blend between different effect characteristics</span>
                    </li>
                    <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                      <span className="bg-dreamaker-purple/20 p-1 rounded-full mt-1">✓</span>
                      <span>Create unique hybrid effects through AI-powered morphing</span>
                    </li>
                    <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                      <span className="bg-dreamaker-purple/20 p-1 rounded-full mt-1">✓</span>
                      <span>Dynamic effect evolution based on musical context</span>
                    </li>
                  </ul>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                  alt="Effect Blending" 
                  className="rounded-lg w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* CTA Section with enhanced animations */}
      <div className="max-w-4xl mx-auto px-6 py-32 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 animate-fade-in">Ready to Create?</h2>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto animate-fade-in">
          Join our community of creators and start building your virtual artist today.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in">
          <a 
            href="/auth" 
            className="inline-block bg-dreamaker-purple hover:bg-dreamaker-purple/80 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(151,71,255,0.3)]"
          >
            Start Creating Now
          </a>
          <a 
            href="/dreamaker"
            onClick={handleBrowseClick}
            className="inline-block border border-dreamaker-purple/50 hover:border-dreamaker-purple text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:bg-dreamaker-purple/10 hover:shadow-[0_0_20px_rgba(151,71,255,0.15)]"
          >
            Browse Artists
          </a>
        </div>
      </div>
    </div>
  );
};
