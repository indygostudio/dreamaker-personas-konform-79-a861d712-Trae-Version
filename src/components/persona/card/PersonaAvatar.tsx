
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { toast } from "sonner";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Trash2, X } from "lucide-react";
import { PersonaType } from "@/types/persona";

interface PersonaAvatarProps {
  avatarUrl?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  personaId?: string;
  type?: PersonaType;
  onAvatarClick?: () => void;
  showRemove?: boolean;
  onRemove?: () => void;
  isInDropZone?: boolean;
}

export const PersonaAvatar = ({
  avatarUrl,
  name = "Unknown",
  size = "md",
  className = "",
  personaId,
  type,
  onAvatarClick,
  showRemove,
  onRemove,
  isInDropZone
}: PersonaAvatarProps) => {
  const { addPersona, setShowDropContainer, removePersona, removeWormholeAnimation } = useSelectedPersonasStore();
  const [isHovered, setIsHovered] = useState(false);

  // Size classes mapping
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-32 w-32"
  };

  const handleAddToProject = () => {
    if (personaId && name) {
      addPersona({
        id: personaId,
        name: name,
        avatarUrl: avatarUrl || '',
        type: type || 'AI_CHARACTER' // Default type
      });
      setShowDropContainer(true);
      toast.success(`Added ${name} to project`);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToProject();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    } else if (name) {
      removePersona(name);
      // Important: Also remove the wormhole animation for this persona
      removeWormholeAnimation(name);
      toast.success(`Removed ${name} from project`);
    }
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const avatarSizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="relative group">
          <div className={`${isHovered ? 'z-10 scale-400' : ''} origin-center transition-all duration-500 absolute inset-0`}>
            <Avatar 
              className={`border-2 border-white/30 ${avatarSizeClass} ${className} cursor-pointer transition-all duration-300 ${isHovered ? 'shadow-lg shadow-blue-500/20' : ''} ${isInDropZone ? 'border-blue-500/50' : ''}`}
              onClick={onAvatarClick}
              onDoubleClick={handleDoubleClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <AvatarImage 
                src={avatarUrl || ''} 
                alt={name}
                className="object-cover" 
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Placeholder to maintain layout space */}
          <div className={`${avatarSizeClass} opacity-0`}></div>
          
          {showRemove && (
            <button 
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20"
              aria-label="Remove persona"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-black/80 backdrop-blur-lg border border-white/10 text-white">
        <ContextMenuItem 
          onClick={handleAddToProject}
          className="cursor-pointer hover:bg-blue-500/20 focus:bg-blue-500/20"
        >
          Add to project
        </ContextMenuItem>
        {showRemove && (
          <ContextMenuItem 
            onClick={handleRemove}
            className="cursor-pointer hover:bg-red-500/20 focus:bg-red-500/20 text-red-400"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};
