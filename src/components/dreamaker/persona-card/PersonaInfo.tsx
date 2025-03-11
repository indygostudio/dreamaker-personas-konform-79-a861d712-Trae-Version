import type { Persona } from "@/types/persona";

interface PersonaInfoProps {
  artist: Persona;
}

export const PersonaInfo = ({ artist }: PersonaInfoProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
      <h3 className="text-2xl font-bold text-white mb-2 font-syne">{artist.name}</h3>
      <div className="space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {artist.style && (
          <p className="text-sm text-white/60 font-syne">Style: {artist.style}</p>
        )}
        {artist.voice_type && (
          <p className="text-sm text-white/60 font-syne">Voice: {artist.voice_type}</p>
        )}
        {artist.age && (
          <p className="text-sm text-white/60 font-syne">Age: {artist.age}</p>
        )}
        {artist.description && (
          <p className="text-sm text-white/60 line-clamp-2 font-syne mt-2">
            {artist.description}
          </p>
        )}
      </div>
    </div>
  );
};