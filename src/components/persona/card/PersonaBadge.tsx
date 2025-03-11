
import { Badge } from "@/components/ui/badge";

interface PersonaBadgeProps {
  type: string;
}

export function PersonaBadge({ type }: PersonaBadgeProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "AI_CHARACTER":
        return "bg-purple-500/10 text-purple-500";
      case "AI_VOCALIST":
        return "bg-blue-500/10 text-blue-500";
      case "AI_INSTRUMENTALIST":
        return "bg-green-500/10 text-green-500";
      case "AI_MIXER":
        return "bg-yellow-500/10 text-yellow-500";
      case "AI_EFFECT":
        return "bg-pink-500/10 text-pink-500";
      case "AI_SOUND":
        return "bg-orange-500/10 text-orange-500";
      case "AI_WRITER":
        return "bg-indigo-500/10 text-indigo-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <Badge
      className={`${getTypeColor(type)}`}
      variant="secondary"
    >
      {type.replace("AI_", "")}
    </Badge>
  );
}
