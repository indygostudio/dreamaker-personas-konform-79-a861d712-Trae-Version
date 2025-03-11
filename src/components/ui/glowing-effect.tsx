
"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface GlowingEffectProps {
  spread?: number;
  glow?: boolean;
  disabled?: boolean;
  proximity?: number;
  inactiveZone?: number;
}

export function GlowingEffect({
  spread = 40,
  glow = true,
  disabled = false,
  proximity = 64,
  inactiveZone = 0.01,
}: GlowingEffectProps) {
  const glowRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const translateX = useSpring(mouseX, springConfig);
  const translateY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (disabled) return;

    function handleMouseMove(event: MouseEvent) {
      const element = glowRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = event.clientX - centerX;
      const distanceY = event.clientY - centerY;

      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      const maxDistance = proximity;

      if (distance < maxDistance) {
        const falloff = 1 - distance / maxDistance;
        const activeFalloff = Math.max(falloff - inactiveZone, 0) / (1 - inactiveZone);
        mouseX.set(distanceX * activeFalloff * spread);
        mouseY.set(distanceY * activeFalloff * spread);
      } else {
        mouseX.set(0);
        mouseY.set(0);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      mouseX.set(0);
      mouseY.set(0);
    };
  }, [disabled, inactiveZone, mouseX, mouseY, proximity, spread]);

  return (
    <motion.div
      ref={glowRef}
      className="pointer-events-none absolute -inset-px rounded-[inherit]"
      style={{
        translateX,
        translateY,
      }}
    >
      {glow && (
        <div className="absolute inset-0 rounded-[inherit] bg-konform-neon-blue/30 [--glow:50%] blur-md dark:bg-konform-neon-blue/20" />
      )}
      <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-konform-neon-blue/20 to-transparent" />
    </motion.div>
  );
}
