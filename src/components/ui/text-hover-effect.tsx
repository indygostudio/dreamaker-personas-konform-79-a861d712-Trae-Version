
"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextHoverEffect = ({ 
  text,
  className,
}: { 
  text: string;
  className?: string;
}) => {
  const words = text.split(" ");

  return (
    <div className={cn("text-center", className)}>
      {words.map((word, wordIndex) => (
        <motion.span
          key={wordIndex}
          className="inline-block"
          style={{ marginRight: wordIndex === words.length - 1 ? "0" : "0.5rem" }}
        >
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block"
              whileHover={{
                scale: [1, 1.2, 0.9, 1],
                rotate: [0, 10, -10, 0],
                transition: {
                  duration: 0.4,
                  ease: "easeInOut",
                }
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </div>
  );
};
