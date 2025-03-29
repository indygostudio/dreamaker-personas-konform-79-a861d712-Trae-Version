
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAdminMode } from "@/contexts/AdminModeContext";
import { ShieldCheck } from "lucide-react";

interface AuthButtonsProps {
  session: any;
  onSignOut: () => void;
}

export const AuthButtons = ({ session, onSignOut }: AuthButtonsProps) => {
  const { isAdmin, isAdminMode, toggleAdminMode } = useAdminMode();
  if (session) {
    return (
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Button
            variant="ghost"
            className={`px-4 py-3 rounded-full transition-all duration-300 font-medium border border-[#0EA5E9]/20 text-white hover:bg-[#0EA5E9]/10 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 ${isAdminMode ? 'bg-[#0EA5E9]/20' : ''}`}
            onClick={toggleAdminMode}
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            Admin
          </Button>
        )}
        <Button
          variant="ghost"
          className="px-6 py-3 rounded-full transition-all duration-300 font-medium border-[#0EA5E9]/20 text-white hover:bg-[#0EA5E9]/10 hover:text-white/80 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
          onClick={onSignOut}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <>
      <Link to="/auth">
        <Button 
          variant="ghost"
          className="px-6 py-3 rounded-full transition-all duration-300 font-medium border border-[#0EA5E9]/20 text-white hover:bg-[#0EA5E9]/10 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"
        >
          Sign In
        </Button>
      </Link>
      <Link to="/auth?mode=signup">
        <Button 
          className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border bg-[#0EA5E9]/10 text-white border-[#0EA5E9]/20 shadow-[0_4px_20px_rgba(14,165,233,0.3)] transform -translate-y-0.5 hover:bg-[#0EA5E9]/20"
        >
          Sign Up
        </Button>
      </Link>
    </>
  );
};
