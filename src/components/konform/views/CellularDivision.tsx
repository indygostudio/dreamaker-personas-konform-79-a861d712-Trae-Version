import React, { useEffect, useRef } from 'react';

interface CellularDivisionProps {
  isAnimating: boolean;
}

export const CellularDivision: React.FC<CellularDivisionProps> = ({ isAnimating }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!isAnimating || !svgRef.current) return;

    const svg = svgRef.current;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50%');
    circle.setAttribute('cy', '50%');
    circle.setAttribute('r', '8');
    circle.setAttribute('fill', 'rgba(0, 255, 255, 0.6)');
    circle.setAttribute('filter', 'url(#glow)');

    svg.appendChild(circle);

    const animation = circle.animate([
      { transform: 'scale(1)', opacity: 0.8 },
      { transform: 'scale(2)', opacity: 0 }
    ], {
      duration: 1000,
      easing: 'ease-out'
    });

    animation.onfinish = () => {
      svg.removeChild(circle);
    };

    return () => {
      if (svg.contains(circle)) {
        svg.removeChild(circle);
      }
    };
  }, [isAnimating]);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};