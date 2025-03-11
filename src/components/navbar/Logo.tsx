
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Settings, User, LogOut } from "lucide-react";
import { useState } from "react";

export const Logo = () => {
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);
  
  // In a real app, you would fetch the user's avatar from your auth system
  // This is just a placeholder implementation
  
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-8 h-8 rounded-full bg-black border border-white/10 flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,186,255,0.5)] hover:border-blue-400">
            {userAvatarUrl ? (
              <Avatar className="h-full w-full">
                <AvatarImage 
                  src={userAvatarUrl} 
                  alt="User avatar"
                  className="object-cover" 
                />
                <AvatarFallback className="bg-black text-white">
                  D
                </AvatarFallback>
              </Avatar>
            ) : (
              <span className="text-white font-bold text-lg">D</span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border border-white/10 text-white min-w-[200px] mr-2">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem className="hover:bg-blue-500/20 cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-blue-500/20 cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem className="hover:bg-red-500/20 text-red-400 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
