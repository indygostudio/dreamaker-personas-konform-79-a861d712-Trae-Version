
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Logo } from "./navbar/Logo";
import { DesktopNav } from "./navbar/DesktopNav";
import { MobileNav } from "./navbar/MobileNav";
import { AuthButtons } from "./navbar/AuthButtons";

export const Navbar = () => {
  const { session, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/70 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto max-w-[2400px] px-6 my-[5px]">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Logo />
          </div>

          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <DesktopNav session={session} />

          <div className="hidden md:flex items-center gap-4">
            <AuthButtons session={session} onSignOut={signOut} />
          </div>
        </div>

        <MobileNav 
          isOpen={isMenuOpen} 
          session={session} 
          onClose={() => setIsMenuOpen(false)} 
          onSignOut={signOut} 
        />
      </div>
    </nav>
  );
};
