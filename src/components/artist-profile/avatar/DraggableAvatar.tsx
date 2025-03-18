
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DraggableAvatarProps {
  avatarUrl?: string;
  name: string;
  onAddToProject?: () => void;
}

export const DraggableAvatar = ({ avatarUrl, name, onAddToProject }: DraggableAvatarProps) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({
      avatarUrl,
      name
    }));
  };

  return (
    <Avatar 
      className="h-10 w-10 border-2 border-white/20 cursor-move hover:border-dreamaker-purple transition-all duration-300 hover:scale-110 active:scale-95"
      onDoubleClick={() => onAddToProject?.()}
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
