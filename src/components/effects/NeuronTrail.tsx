
import { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface NeuronTrailProps {
  containerRef: React.RefObject<HTMLElement>;
}

export const NeuronTrail = ({ containerRef }: NeuronTrailProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });

      // Add new points near the mouse
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 0.5;
        pointsRef.current.push({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: Math.random() * 50 + 50
        });
      }
    };

    const handleMouseLeave = () => {
      setMousePosition(null);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw points
      for (let i = 0; i < pointsRef.current.length; i++) {
        const point = pointsRef.current[i];
        point.x += point.vx;
        point.y += point.vy;
        point.life -= 1;

        if (point.life <= 0) {
          pointsRef.current.splice(i, 1);
          i--;
          continue;
        }

        // Draw the point
        const alpha = point.life / 100;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 170, 255, ${alpha})`;
        ctx.fill();

        // Connect nearby points
        for (let j = i + 1; j < pointsRef.current.length; j++) {
          const otherPoint = pointsRef.current[j];
          const dx = point.x - otherPoint.x;
          const dy = point.y - otherPoint.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 50) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(otherPoint.x, otherPoint.y);
            ctx.strokeStyle = `rgba(100, 170, 255, ${alpha * 0.5})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
