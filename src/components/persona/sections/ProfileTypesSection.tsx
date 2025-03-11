import React from 'react';
import { useNavigate } from "react-router-dom";

export const ProfileTypesSection = () => {
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
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold mb-8">
          Create Your AI Artist
        </h1>
        <div className="flex flex-col sm:flex-row gap-6 justify-center p-4 rounded-lg inline-flex">
          <a 
            href="/auth" 
            className="inline-block bg-dreamaker-purple hover:bg-dreamaker-purple/80 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors"
          >
            Get Started
          </a>
          <a 
            href="/dreamaker"
            onClick={handleBrowseClick}
            className="inline-block border border-dreamaker-purple/50 hover:border-dreamaker-purple text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors hover:bg-dreamaker-purple/10"
          >
            Browse Artists
          </a>
        </div>
      </div>

      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">AI Profile Types</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="konform-panel p-8 rounded-xl border border-purple-500/20 group hover:border-purple-500/40 transition-all duration-300">
          <h3 className="text-2xl font-bold mb-4 group-hover:text-dreamaker-purple transition-colors">Artist Profiles</h3>
          <p className="text-gray-400 leading-relaxed">Create virtual vocalists and performers with unique styles and characteristics.</p>
        </div>
        <div className="konform-panel p-8 rounded-xl border border-purple-500/20 group hover:border-purple-500/40 transition-all duration-300">
          <h3 className="text-2xl font-bold mb-4 group-hover:text-dreamaker-purple transition-colors">Instrumentalist Profiles</h3>
          <p className="text-gray-400 leading-relaxed">Design AI musicians specializing in specific instruments with customizable playing styles.</p>
        </div>
        <div className="konform-panel p-8 rounded-xl border border-purple-500/20 group hover:border-purple-500/40 transition-all duration-300">
          <h3 className="text-2xl font-bold mb-4 group-hover:text-dreamaker-purple transition-colors">Mix Engineer Profiles</h3>
          <p className="text-gray-400 leading-relaxed">Create virtual mix engineers with signature processing chains and mixing techniques.</p>
        </div>
        <div className="konform-panel p-8 rounded-xl border border-purple-500/20 group hover:border-purple-500/40 transition-all duration-300">
          <h3 className="text-2xl font-bold mb-4 group-hover:text-dreamaker-purple transition-colors">Effect Collections</h3>
          <p className="text-gray-400 leading-relaxed">Build libraries of AI-powered audio effects with unique sonic characteristics.</p>
        </div>
      </div>
    </div>
  );
};