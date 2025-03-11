
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const SonarEffect = ({
  className,
}: {
  className?: string;
}) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div 
      className={cn("relative", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Semi-circle base */}
      <div className="absolute right-0 w-[400px] h-[800px] rounded-l-full bg-gradient-to-l from-[#0EA5E9]/20 to-transparent opacity-70"></div>
      
      {/* Sonar waves */}
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute right-0 rounded-l-full bg-gradient-to-l from-[#0EA5E9]/30 to-transparent"
          initial={{ width: 400, height: 800, opacity: 0, x: 0 }}
          animate={isHovering ? {
            width: 400,
            height: 800,
            opacity: [0, 0.2, 0],
            x: [-20 * i, -100 * i]
          } : {}}
          transition={{
            duration: 2,
            ease: "easeOut",
            repeat: isHovering ? Infinity : 0,
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
};
