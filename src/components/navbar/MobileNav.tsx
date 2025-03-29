
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAdminMode } from "@/contexts/AdminModeContext";
import { ShieldCheck } from "lucide-react";

interface MobileNavProps {
  session: any;
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

export const MobileNav = ({ isOpen, session, onClose, onSignOut }: MobileNavProps) => {
  const { isAdmin, isAdminMode, toggleAdminMode } = useAdminMode();
  if (!isOpen) return null;

  return (
    <div className="md:hidden py-4">
      <div className="flex flex-col gap-4">
        <Link 
          to="/" 
          className="text-sm text-white/80 hover:text-white bg-black/20 px-6 py-3 rounded-full border border-white/10 hover:bg-[#0EA5E9]/10 hover:border-[#0EA5E9]/20 transition-all"
          onClick={onClose}
        >
          Home
        </Link>
        <Link 
          to="/dreamaker" 
          className="text-sm text-white/80 hover:text-white bg-black/20 px-6 py-3 rounded-full border border-white/10 hover:bg-[#0EA5E9]/10 hover:border-[#0EA5E9]/20 transition-all"
          onClick={onClose}
        >
          Dreamaker
        </Link>
        <Link 
          to="/personas" 
          className="text-sm text-white/80 hover:text-white bg-black/20 px-6 py-3 rounded-full border border-white/10 hover:bg-[#0EA5E9]/10 hover:border-[#0EA5E9]/20 transition-all"
          onClick={onClose}
        >
          Personas
        </Link>
        <Link 
          to={session ? "/konform" : "/konform-product"}
          className="text-sm text-white/80 hover:text-white bg-black/20 px-6 py-3 rounded-full border border-white/10 hover:bg-[#0EA5E9]/10 hover:border-[#0EA5E9]/20 transition-all"
          onClick={onClose}
        >
          Konform
        </Link>

        {session ? (
          <>
            {isAdmin && (
              <Button
                variant="ghost"
                className={`text-white hover:text-white/80 justify-start rounded-full border border-white/10 hover:bg-[#0EA5E9]/10 hover:border-[#0EA5E9]/20 ${isAdminMode ? 'bg-[#0EA5E9]/20' : ''}`}
                onClick={() => {
                  toggleAdminMode();
                }}
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
            <Button
              variant="ghost"
              className="text-white hover:text-white/80 justify-start rounded-full border border-white/10 hover:bg-[#0EA5E9]/10 hover:border-[#0EA5E9]/20"
              onClick={() => {
                onSignOut();
                onClose();
              }}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Link to="/auth" onClick={onClose}>
              <Button variant="ghost" className="text-white hover:text-white/80 w-full justify-start rounded-full border border-white/10 hover:bg-[#0EA5E9]/10 hover:border-[#0EA5E9]/20">
                Sign In
              </Button>
            </Link>
            <Link to="/auth?mode=signup" onClick={onClose}>
              <Button className="bg-gradient-to-r from-dreamaker-purple to-dreamaker-purple-light text-white hover:opacity-90 w-full rounded-full">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
