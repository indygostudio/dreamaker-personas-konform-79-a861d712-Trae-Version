import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle2 } from "lucide-react";

interface AvatarDisplayProps {
  avatarUrl: string;
  name?: string;
  isUploading?: boolean;
  size?: string;
  DefaultIcon?: React.ComponentType;
  className?: string;
}

export const AvatarDisplay = ({ 
  avatarUrl, 
  name,
  isUploading,
  size = "h-24 w-24",
  DefaultIcon = UserCircle2,
  className = ""
}: AvatarDisplayProps) => {
  return (
    <Avatar className={`${size} ${className}`}>
      {isUploading ? (
        <div className="h-full w-full flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      ) : (
        <>
          <AvatarImage 
            src={avatarUrl} 
            alt={name || "User avatar"} 
            className="object-cover w-full h-full"
          />
          <AvatarFallback 
            className="bg-[#131415] flex items-center justify-center"
          >
            <div className="h-8 w-8">
              <DefaultIcon />
            </div>
          </AvatarFallback>
        </>
      )}
    </Avatar>
  );
};