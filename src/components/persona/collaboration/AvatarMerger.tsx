import { useEffect, useRef } from "react";
import type { Persona } from "@/pages/Personas";

interface AvatarMergerProps {
  personas: Persona[];
  blendRatios: Record<string, number>;
  onMergedAvatar: (url: string) => void;
}

export const AvatarMerger = ({
  personas,
  blendRatios,
  onMergedAvatar,
}: AvatarMergerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const mergeAvatars = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 400;
      canvas.height = 400;

      try {
        const images = await Promise.all(
          personas
            .filter(p => p.avatar_url)
            .map(persona => {
              return new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = persona.avatar_url!;
              });
            })
        );

        images.forEach((img, index) => {
          ctx.globalAlpha = blendRatios[personas[index].id] / 100;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        });

        const mergedUrl = canvas.toDataURL('image/png');
        onMergedAvatar(mergedUrl);
      } catch (error) {
        console.error('Error merging avatars:', error);
      }
    };

    mergeAvatars();
  }, [personas, blendRatios, onMergedAvatar]);

  return (
    <canvas
      ref={canvasRef}
      className="hidden"
      width={400}
      height={400}
    />
  );
};