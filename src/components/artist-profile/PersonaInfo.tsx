
import type { Persona } from "@/types/persona";

interface PersonaInfoProps {
  artist: Persona;
}

export const PersonaInfo = ({ artist }: PersonaInfoProps) => {
  return (
    <div className="text-center md:text-left">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-up">
        {artist.name}
      </h1>
      <div className="space-y-4 text-gray-300 animate-fade-up" style={{ animationDelay: '100ms' }}>
        {artist.style && (
          <p className="text-lg">
            <span className="text-dreamaker-purple-light">Style:</span> {artist.style}
          </p>
        )}
        {artist.voice_type && (
          <p className="text-lg">
            <span className="text-dreamaker-purple-light">Voice Type:</span> {artist.voice_type}
          </p>
        )}
        {artist.age && (
          <p className="text-lg">
            <span className="text-dreamaker-purple-light">Age:</span> {artist.age}
          </p>
        )}
        {artist.description && (
          <p className="text-lg">
            <span className="text-dreamaker-purple-light">Description:</span> {artist.description}
          </p>
        )}
      </div>
    </div>
  );
};
