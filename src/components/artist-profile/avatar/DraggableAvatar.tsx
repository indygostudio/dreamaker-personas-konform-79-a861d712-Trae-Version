
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DraggableAvatarProps {
  avatarUrl?: string;
  name: string;
}

export const DraggableAvatar = ({ avatarUrl, name }: DraggableAvatarProps) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({
      avatarUrl,
      name
    }));
  };

  return (
    <Avatar 
      className="h-10 w-10 border-2 border-white/20 cursor-move hover:border-dreamaker-purple transition-colors"
      draggable
      onDragStart={handleDragStart}
    >
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback className="bg-black/40">
        {name[0]?.toUpperCase() || 'A'}
      </AvatarFallback>
    </Avatar>
  );
};
