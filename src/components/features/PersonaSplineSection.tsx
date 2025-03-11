'use client';

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { useNavigate } from "react-router-dom";

export function PersonaSplineSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const navigate = useNavigate();
  
  // Previous frame for cloud morphing effect
  const prevFrameRef = useRef<number | null>(null);
  const cloudEffectCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cloudCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  
  useEffect(() => {
    // Initialize video state once it's loaded
    const handleVideoLoaded = () => {
      setIsVideoLoaded(true);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };

    // Add event listener to video
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('loadeddata', handleVideoLoaded);
    }

    // Initialize canvas for cloud morphing effect
    if (cloudEffectCanvasRef.current) {
      cloudCtxRef.current = cloudEffectCanvasRef.current.getContext('2d');
    }

    // Scroll event handler that controls video playback with smooth transitions
    const handleScroll = () => {
      if (!videoElement || !sectionRef.current || !isVideoLoaded) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate how far the section is through the viewport
      // -1 = completely above viewport, 0 = top of section at top of viewport
      // 0.5 = middle of section in middle of viewport, 1 = bottom of section at bottom of viewport, 2 = completely below viewport
      let visiblePercentage = 1 - rect.bottom / viewportHeight;

      // Normalize to 0-1 range for the section's visibility in the viewport
      visiblePercentage = Math.max(0, Math.min(1, visiblePercentage));

      // Set video currentTime based on scroll position with smooth transition
      if (videoElement.duration) {
        const targetTime = visiblePercentage * videoElement.duration;
        
        // Apply cloud morphing effect between frames
        if (prevFrameRef.current !== null && cloudCtxRef.current && cloudEffectCanvasRef.current) {
          // Capture current frame for morphing effect
          cloudCtxRef.current.drawImage(videoElement, 0, 0, cloudEffectCanvasRef.current.width, cloudEffectCanvasRef.current.height);
        }
        
        // Update video time
        videoElement.currentTime = targetTime;
        prevFrameRef.current = targetTime;
      }
    };
    
    // Use requestAnimationFrame for smoother scrolling effect
    let rafId: number;
    const smoothScroll = () => {
      handleScroll();
      rafId = requestAnimationFrame(smoothScroll);
    };
    
    smoothScroll();

    // Cleanup
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('loadeddata', handleVideoLoaded);
      }
      cancelAnimationFrame(rafId);
    };
  }, [isVideoLoaded]);
  
  return <div ref={sectionRef} className="w-full my-16">
      <Card className="w-full h-[400px] bg-black/[0.96] relative overflow-hidden rounded-3xl border-purple-900/20 mb-16">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="purple" size={300} />
        
        {/* Background video with cloud morphing effect */}
        <div className="absolute inset-0 z-0">
          <video ref={videoRef} src="/Videos/Gen-3 Alpha 3165178086, scrolling frames of , imagepng (11), M 5 (1).mp4" muted playsInline preload="auto" className="w-full h-full object-cover opacity-70" />
          <canvas 
            ref={cloudEffectCanvasRef} 
            className="absolute inset-0 w-full h-full opacity-30 mix-blend-overlay pointer-events-none"
            width="1280"
            height="720"
          />
          {/* Gradient overlay with darker edges */}
          <div className="absolute inset-0 bg-gradient-radial from-black/30 via-black/50 to-black/80"></div>
        </div>

        {/* Content overlay */}
        <div 
          className="relative z-10 h-full flex flex-col justify-center items-center p-8 cursor-pointer" 
          onClick={() => {
            navigate('/dreamaker', { 
              state: { 
                activeTab: 'personas',
                selectedType: 'all'
              }
            });
          }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-purple-200 to-purple-500">ORGANIC AUDIO </h1>
          <p className="mt-4 text-purple-100 max-w-lg mx-auto text-center">
            Create your own AI Artists with customizable Personas. Clone voices, craft detailed characters, 
            and build virtual artists with rich expressive identities that can evolve over time. Our advanced 
            voice modeling technology allows you to design unique vocal characteristics while our character 
            development system helps you build comprehensive artistic backstories and personalities that feel 
            authentic and engaging.
          </p>
        </div>
      </Card>
    </div>;
}