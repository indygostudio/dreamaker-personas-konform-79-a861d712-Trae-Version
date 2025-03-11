
"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const GeminiSliderEffect = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  // Convert slider value (0-100) to path length (0-1.2)
  const convertValueToPathLength = (delay: number) => {
    const baseValue = value / 100; // Convert to 0-1 range
    return Math.max(0, Math.min(1.2, baseValue + delay));
  };

  return (
    <div className={cn("absolute h-full w-full overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, rgba(0, 209, 255, 0.1) 0%, transparent 100%)`,
        }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, transparent 0%, rgba(0, 209, 255, ${0.1 - i * 0.02}) 50%, transparent 100%)`,
              scaleY: convertValueToPathLength(i * 0.05),
              translateY: "-50%",
            }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  );
};
