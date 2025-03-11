import { Verified, Music2, Mic2, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Persona } from "../types";

interface PersonaBadgesProps {
  artist: Persona;
}

export const PersonaBadges = ({ artist }: PersonaBadgesProps) => {
  return (
    <>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {(artist.is_label_artist) && (
          <div className="bg-black/40 backdrop-blur-sm p-2 rounded-full">
            <Verified className="w-5 h-5 text-emerald-500" />
          </div>
        )}
        <div className="bg-black/40 backdrop-blur-sm p-2 rounded-full">
          {getTypeIcon(artist.type)}
        </div>
      </div>

      {artist.likes_count >= 100 && (
        <Badge className="absolute top-4 left-4 bg-emerald-500/20 text-white border-emerald-500/40">
          Popular
        </Badge>
      )}
    </>
  );
};

const getTypeIcon = (type?: string) => {
  switch (type) {
    case 'AI_ARTIST':
      return <Mic2 className="w-4 h-4 text-emerald-500" />;
    case 'AI_INSTRUMENT':
      return <Music2 className="w-4 h-4 text-emerald-500" />;
    case 'AI_EFFECT':
      return <Wand2 className="w-4 h-4 text-emerald-500" />;
    default:
      return <Mic2 className="w-4 h-4 text-emerald-500" />;
  }
};