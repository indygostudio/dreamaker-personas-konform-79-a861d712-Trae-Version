import React from 'react';
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
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
    <div className="relative h-[60vh] overflow-hidden">
      {/* Hero background video */}
      <div className="absolute inset-0 z-0">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/Videos/PERSONAS_01.mp4"
          muted
          loop
          playsInline
          autoPlay
        />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dreamaker-bg z-0" />
    </div>
  );
};