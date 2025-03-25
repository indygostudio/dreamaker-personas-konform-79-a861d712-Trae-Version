import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

export const CollabClubLink = () => {
  const { session } = useAuth();
  
  if (!session) return null;
  
  return (
    <Link 
      to="/collab-club" 
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-dreamaker-purple/10 transition-colors"
    >
      <Users className="h-4 w-4" />
      <span>Collab Club</span>
      <Badge variant="outline" className="ml-1 bg-dreamaker-purple/20 text-dreamaker-purple border-dreamaker-purple/50 text-xs">
        New
      </Badge>
    </Link>
  );
};