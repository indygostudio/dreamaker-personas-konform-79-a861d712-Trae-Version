
import { useState, useEffect } from 'react';

interface ExtractedColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

export const useColorExtractor = (imageUrl: string | null): ExtractedColors => {
  const [colors, setColors] = useState<ExtractedColors>({
    primary: 'rgba(155, 135, 245, 0.8)',    // Default dreamaker purple
    secondary: 'rgba(126, 105, 171, 0.6)',  // Lighter purple
    accent: 'rgba(110, 89, 165, 0.4)',      // Even lighter purple
    text: 'rgba(255, 255, 255, 0.9)',       // Near white for text
    background: 'rgba(26, 31, 44, 0.8)',    // Dark background
  });

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;
        
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0);
        
        // Sample colors from different regions of the image
        const topLeft = getPixelColor(ctx, 0, 0);
        const topRight = getPixelColor(ctx, canvas.width - 1, 0);
        const bottomLeft = getPixelColor(ctx, 0, canvas.height - 1);
        const bottomRight = getPixelColor(ctx, canvas.width - 1, canvas.height - 1);
        const center = getPixelColor(ctx, Math.floor(canvas.width / 2), Math.floor(canvas.height / 2));
        
        // Calculate average color
        const avgR = Math.floor((topLeft.r + topRight.r + bottomLeft.r + bottomRight.r + center.r) / 5);
        const avgG = Math.floor((topLeft.g + topRight.g + bottomLeft.g + bottomRight.g + center.g) / 5);
        const avgB = Math.floor((topLeft.b + topRight.b + bottomLeft.b + bottomRight.b + center.b) / 5);
        
        // Generate a color palette
        setColors({
          primary: `rgba(${avgR}, ${avgG}, ${avgB}, 0.8)`,
          secondary: `rgba(${avgR * 0.8}, ${avgG * 0.8}, ${avgB * 0.8}, 0.6)`,
          accent: `rgba(${avgR * 0.6}, ${avgG * 0.6}, ${avgB * 0.6}, 0.4)`,
          text: isLightColor(avgR, avgG, avgB) ? 'rgba(35, 35, 35, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          background: `rgba(${Math.floor(avgR * 0.3)}, ${Math.floor(avgG * 0.3)}, ${Math.floor(avgB * 0.3)}, 0.8)`,
        });
      } catch (error) {
        console.error('Error extracting colors from image:', error);
      }
    };
    
    img.onerror = () => {
      console.error('Error loading image for color extraction');
    };
  }, [imageUrl]);
  
  return colors;
};

// Helper function to get pixel color from canvas context
const getPixelColor = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  return {
    r: pixel[0],
    g: pixel[1],
    b: pixel[2],
    a: pixel[3] / 255
  };
};

// Helper function to determine if a color is light or dark
const isLightColor = (r: number, g: number, b: number) => {
  // Calculate the perceived brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};
