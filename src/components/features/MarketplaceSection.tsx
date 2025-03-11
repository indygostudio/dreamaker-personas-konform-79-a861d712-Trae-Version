
import { ArtistGrid } from "./ArtistGrid";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SonarEffect } from "@/components/ui/sonar-effect";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const MarketplaceSection = () => {
  return (
    <div className="py-16 bg-zinc-950 w-full relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-none">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-left mb-16 flex flex-col md:flex-row justify-between items-start gap-8"
        >
          <div className="max-w-2xl">
            <h2 className="text-5xl font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-green-400">
              AI Record Label and Marketplace
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Welcome to our expansive Marketplace of inspiring Prompts and AI Personas. Struggling to bring your musical ideas to life? Browse our vibrant Persona Prompt Marketplace, where talented creators share a diverse array of prompts and scripts to spark your imagination. Discover prompts for every genre and style, then customize them to make the personas your own. 
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mt-4">
              Our marketplace isn't just a collection of tools—it's a thriving ecosystem where creators can share, sell, and collaborate on AI personas, voice models, and production techniques. Join a community of forward-thinking artists who are redefining what's possible in music production, and find the perfect collaborators for your next breakthrough project.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link to="/marketplace">
              <Button 
                className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-[#0EA5E9]/10 text-white border-[#0EA5E9]/20 shadow-[0_4px_20px_rgba(14,165,233,0.3)] transform hover:-translate-y-1 hover:bg-[#0EA5E9]/20 hover:shadow-[0_4px_25px_rgba(14,165,233,0.4)] group"
              >
                Explore Marketplace
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <ArtistGrid />
        </motion.div>
      </div>
      
      {/* Multiple sonar effects for a more dynamic background */}
      <SonarEffect className="absolute top-0 right-0 h-full pointer-events-none z-0 opacity-70" />
      <SonarEffect className="absolute bottom-0 left-1/4 h-full pointer-events-none z-0 opacity-50 scale-75" />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-green-900/10 animate-gradient-shift pointer-events-none z-0" />
    </div>
  );
};
