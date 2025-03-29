import { Card, CardContent } from "@/components/ui/card";
import { EnhancedAudioPreview } from "@/components/persona/card/EnhancedAudioPreview";

/**
 * Example component showing how to integrate the enhanced audio player
 * into a PersonaCard component
 * 
 * This demonstrates:
 * 1. How to use the EnhancedAudioPreview component
 * 2. How it connects to the global audio system
 * 3. The visualization capabilities of the new system
 */
interface ExamplePersonaCardProps {
  name: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
}

export const PersonaCardEnhancedExample = ({
  name,
  description,
  imageUrl,
  audioUrl
}: ExamplePersonaCardProps) => {
  return (
    <Card className="w-full max-w-md overflow-hidden bg-black/60 border-dreamaker-purple/30">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
        <p className="text-gray-300 text-sm mb-4">{description}</p>
        
        {/* Enhanced Audio Preview with visualization */}
        <EnhancedAudioPreview
          audioUrl={audioUrl}
          trackTitle={`${name} Preview`}
          artistName="Dreamaker AI"
          albumArtUrl={imageUrl}
        />
        
        {/* Note: No need to manage audio state locally - the global 
            audio system handles playback, visualization, and state */}
      </CardContent>
    </Card>
  );
};

/**
 * USAGE EXAMPLE:
 * 
 * import { PersonaCardEnhancedExample } from "@/examples/PersonaCardEnhancedExample";
 * 
 * // In your component:
 * <PersonaCardEnhancedExample
 *   name="Aria"
 *   description="A thoughtful AI assistant with a passion for classical music"
 *   imageUrl="/path/to/persona-image.jpg"
 *   audioUrl="/path/to/audio-preview.mp3"
 * />
 * 
 * The audio will be managed by the global audio system, allowing for:
 * - Consistent playback across the application
 * - Only one audio source playing at a time
 * - Enhanced visualizations
 * - Persistent player controls
 */