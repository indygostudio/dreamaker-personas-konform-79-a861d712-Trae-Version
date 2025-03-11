
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AudioPreviewButton } from "./AudioPreviewButton";
import type { Persona } from "@/types/persona";

interface PersonaBannerProps {
  persona: Persona;
}

export const PersonaBanner = ({ persona }: PersonaBannerProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "AI_VOCALIST":
        return "bg-blue-500/10 text-blue-500";
      case "AI_INSTRUMENTALIST":
        return "bg-green-500/10 text-green-500";
      case "AI_MIXER":
        return "bg-purple-500/10 text-purple-500";
      case "AI_EFFECT":
        return "bg-pink-500/10 text-pink-500";
      case "AI_SOUND":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="relative aspect-video overflow-hidden">
      {persona.banner_url ? (
        <img
          src={persona.banner_url}
          alt={persona.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-dreamaker-purple/30 to-black" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black" />
      
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <Avatar className="h-8 w-8 border-2 border-dreamaker-purple/20">
          <AvatarImage src={persona.avatar_url} />
          <AvatarFallback>{persona.name[0]}</AvatarFallback>
        </Avatar>
        <span className="text-sm text-white/90">{persona.name}</span>
      </div>

      {/* The audio preview button - visible when persona has audio_preview_url */}
      <AudioPreviewButton audioUrl={persona.audio_preview_url} />

      {persona.type && (
        <Badge
          className={`absolute top-4 right-4 ${getTypeColor(persona.type)}`}
          variant="secondary"
        >
          {persona.type.replace("AI_", "")}
        </Badge>
      )}

      {!persona.is_public && (
        <Badge
          className="absolute top-4 right-16 bg-red-500/10 text-red-500"
          variant="secondary"
        >
          PRIVATE
        </Badge>
      )}
    </div>
  );
};
