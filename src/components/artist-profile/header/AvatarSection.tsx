
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { EditIcon } from "lucide-react";

interface AvatarSectionProps {
  avatarUrl?: string;
  name: string;
  isOwner?: boolean;
  className?: string;
}

export const AvatarSection = ({
  avatarUrl,
  name,
  isOwner = false,
  className = ""
}: AvatarSectionProps) => {
  return (
    <div className={`relative ${className}`}>
      <Avatar className="h-16 w-16 border-2 border-white/10 shadow-xl">
        <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
        <AvatarFallback className="bg-dreamaker-purple/20 text-white">
          {name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};
