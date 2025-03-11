
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface ParticleEffectProps {
  color?: string;
  particleCount?: number;
  particleSize?: [number, number];
  speed?: [number, number];
  className?: string;
}

export const ParticleEffect = ({
  color = '#00F0FF', // Default neon blue
  particleCount = 50,
  particleSize = [1, 3],
  speed = [0.2, 1],
  className = '',
}: ParticleEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        createParticle();
      }
    };

    // Create a single particle
    const createParticle = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const size = Math.random() * (particleSize[1] - particleSize[0]) + particleSize[0];
      const maxLife = Math.random() * 100 + 100;
      
      const particle: Particle = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        speedX: (Math.random() - 0.5) * (speed[1] - speed[0]) + speed[0],
        speedY: (Math.random() - 0.5) * (speed[1] - speed[0]) + speed[0],
        opacity: Math.random() * 0.5 + 0.2,
        life: 0,
        maxLife,
      };
      
      particlesRef.current.push(particle);
    };

    // Update particles position
    const updateParticles = () => {
      particlesRef.current.forEach((p, index) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life += 1;
        
        // Fade out as life approaches maxLife
        if (p.life > p.maxLife * 0.7) {
          p.opacity = p.opacity * 0.99;
        }
        
        // Reset particles that go off-screen or die
        if (
          p.x < 0 || 
          p.x > canvas.width || 
          p.y < 0 || 
          p.y > canvas.height ||
          p.life > p.maxLife
        ) {
          // Replace the particle
          particlesRef.current[index] = createNewParticle();
        }
      });
    };

    // Create a new particle at a random position
    const createNewParticle = (): Particle => {
      const size = Math.random() * (particleSize[1] - particleSize[0]) + particleSize[0];
      const maxLife = Math.random() * 100 + 100;
      
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        speedX: (Math.random() - 0.5) * (speed[1] - speed[0]) + speed[0],
        speedY: (Math.random() - 0.5) * (speed[1] - speed[0]) + speed[0],
        opacity: Math.random() * 0.5 + 0.2,
        life: 0,
        maxLife,
      };
    };

    // Draw particles on canvas
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = p.size * 5;
        ctx.shadowColor = color;
      });
    };

    // Animation loop
    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [color, particleCount, particleSize, speed]);

  return (
    <canvas 
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 10 }}
    />
  );
};
