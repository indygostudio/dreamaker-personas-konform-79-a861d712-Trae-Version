"use client";

import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface ComponentInspectorProps {
  children: React.ReactNode;
  componentName: string;
  className?: string;
}

export const ComponentInspector = ({
  children,
  componentName,
  className,
}: ComponentInspectorProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className={cn(
        'relative group',
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
      {isHovering && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-sm rounded-md z-50 pointer-events-none">
          {componentName}
        </div>
      )}
    </div>
  );
};