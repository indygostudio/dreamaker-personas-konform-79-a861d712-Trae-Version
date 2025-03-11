import { Music2, Disc, Mic } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

interface ChannelHeaderProps {
  name: string;
  type: 'ai-audio' | 'ai-midi' | 'real-audio';
  persona?: {
    name: string;
    avatarUrl?: string;
  };
}

export const ChannelHeader = ({ name, type, persona }: ChannelHeaderProps) => {
  const getTrackIcon = () => {
    switch (type) {
      case 'ai-audio':
        return <Music2 className="w-4 h-4 text-konform-neon-blue" />;
      case 'ai-midi':
        return <Disc className="w-4 h-4 text-konform-neon-orange" />;
      case 'real-audio':
        return <Mic className="w-4 h-4 text-white" />;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getTrackIcon()}
          <span className="text-sm font-medium text-white">{name}</span>
        </div>
      </div>

      {persona && (
        <div className="mb-4 flex justify-center">
          <Avatar className="h-16 w-16 ring-2 ring-konform-neon-blue/30">
            {persona.avatarUrl ? (
              <AvatarImage src={persona.avatarUrl} alt={persona.name} />
            ) : (
              <AvatarFallback className="bg-black/60">
                <UserRound className="h-8 w-8 text-konform-neon-blue" />
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      )}
    </>
  );
};