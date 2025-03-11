import { Mic2, Guitar, Settings2, Keyboard, Wand2 } from "lucide-react";

interface PersonaInfoProps {
  name: string;
  style?: string;
  voiceType?: string;
  age?: number;
  description?: string;
  gender?: string;
  language?: string;
  type?: string;
}

export const PersonaInfo = ({
  name,
  style,
  voiceType,
  age,
  description,
  gender,
  language,
  type,
}: PersonaInfoProps) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'ARTIST':
        return <Mic2 className="h-4 w-4 text-dreamaker-purple" />;
      case 'INSTRUMENTALIST':
        return <Guitar className="h-4 w-4 text-dreamaker-purple" />;
      case 'MIXER':
        return <Settings2 className="h-4 w-4 text-dreamaker-purple" />;
      case 'INSTRUMENT':
        return <Keyboard className="h-4 w-4 text-dreamaker-purple" />;
      case 'EFFECT':
        return <Wand2 className="h-4 w-4 text-dreamaker-purple" />;
      default:
        return <Mic2 className="h-4 w-4 text-dreamaker-purple" />;
    }
  };

  return (
    <div className="flex-1 text-left space-y-2">
      <div className="flex items-center gap-2">
        {getTypeIcon()}
        <h3 className="text-xl font-semibold text-white group-hover:text-dreamaker-purple transition-colors">
          {name}
        </h3>
      </div>
      <div className="space-y-1">
        {style && (
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            Style: {style}
          </p>
        )}
        {voiceType && (
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            Voice: {voiceType}
          </p>
        )}
        {age && (
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            Age: {age}
          </p>
        )}
        {gender && (
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            Gender: {gender}
          </p>
        )}
        {language && (
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            Language: {language}
          </p>
        )}
      </div>
      {description && (
        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors line-clamp-2">
          {description}
        </p>
      )}
    </div>
  );
};