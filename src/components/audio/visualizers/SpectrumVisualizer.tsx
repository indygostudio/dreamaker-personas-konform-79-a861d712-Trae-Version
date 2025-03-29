import { useRef, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';

interface SpectrumVisualizerProps {
  width?: number;
  height?: number;
  barCount?: number;
  barColor?: string;
  barGradient?: boolean;
  showPeaks?: boolean;
  peakColor?: string;
  peakFalloff?: number;
  smoothing?: number;
  className?: string;
}

export const SpectrumVisualizer = ({
  width = 0, // 0 means full width of container
  height = 120,
  barCount = 128,
  barColor = '#818cf8',
  barGradient = true,
  showPeaks = true,
  peakColor = '#c4b5fd',
  peakFalloff = 3,
  smoothing = 0.5,
  className = ''
}: SpectrumVisualizerProps) => {
  const { globalAudioState, processors, getFrequencyData } = useAudio();
  const { currentTrack, playbackState } = globalAudioState;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const peakValuesRef = useRef<number[]>([]);
  
  // Set up the analyser and animation
  useEffect(() => {
    if (!currentTrack || !processors.analyserNode || !canvasRef.current) return;
    
    // Initialize canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateCanvasSize = () => {
      const containerWidth = canvas.parentElement?.clientWidth || width;
      canvas.width = width > 0 ? width : containerWidth;
      canvas.height = height;
      
      // Initialize peak values array if needed
      if (peakValuesRef.current.length !== barCount) {
        peakValuesRef.current = Array(barCount).fill(0);
      }
    };
    
    // Handle resize
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Create gradient if needed
    let gradient: CanvasGradient | null = null;
    if (barGradient) {
      gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, '#6366f1');   // Indigo
      gradient.addColorStop(0.5, '#8b5cf6'); // Purple
      gradient.addColorStop(1, '#ec4899');   // Pink
    }
    
    // Animation function
    const draw = () => {
      if (!canvas || !ctx || !processors.analyserNode) return;
      
      // Get frequency data
      const frequencyData = getFrequencyData();
      if (!frequencyData) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set bar dimensions
      const barWidth = (canvas.width / barCount) * 0.8;
      const barSpacing = (canvas.width / barCount) * 0.2;
      const totalBarWidth = barWidth + barSpacing;
      
      // Draw each bar
      for (let i = 0; i < barCount; i++) {
        // Map frequency data to bar height (frequencyData has 1024 values, we're using just barCount of them)
        const dataIndex = Math.floor(i * (frequencyData.length / barCount));
        const value = frequencyData[dataIndex];
        const barHeight = (value / 255) * canvas.height;
        
        // Position
        const x = i * totalBarWidth;
        const y = canvas.height - barHeight;
        
        // Draw bar with color or gradient
        if (gradient && barGradient) {
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = barColor;
        }
        
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw peaks if enabled
        if (showPeaks) {
          // Update peak value
          if (barHeight > peakValuesRef.current[i]) {
            peakValuesRef.current[i] = barHeight;
          } else {
            peakValuesRef.current[i] -= peakFalloff;
            peakValuesRef.current[i] = Math.max(0, peakValuesRef.current[i]);
          }
          
          // Draw peak line
          ctx.fillStyle = peakColor;
          ctx.fillRect(x, canvas.height - peakValuesRef.current[i], barWidth, 2);
        }
      }
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(draw);
    };
    
    // Start animation if track is playing
    if (playbackState.status === 'playing') {
      // Set analyzer properties
      if (processors.analyserNode && smoothing >= 0 && smoothing <= 1) {
        processors.analyserNode.smoothingTimeConstant = smoothing;
      }
      
      animationRef.current = requestAnimationFrame(draw);
    }
    
    // Clean up
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [
    currentTrack, 
    processors.analyserNode, 
    width, 
    height, 
    barCount, 
    barColor, 
    barGradient, 
    showPeaks, 
    peakColor, 
    peakFalloff,
    smoothing,
    playbackState.status,
    getFrequencyData
  ]);
  
  return (
    <div className={`relative ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full rounded-lg"
        style={{ height: `${height}px` }}
      />
      {!currentTrack && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-gray-400 text-sm rounded-lg">
          No track playing
        </div>
      )}
    </div>
  );
};