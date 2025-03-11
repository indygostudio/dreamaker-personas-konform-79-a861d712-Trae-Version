
import { Link, useLocation } from "react-router-dom";
interface DesktopNavProps {
  session: any;
}
export const DesktopNav = ({
  session
}: DesktopNavProps) => {
  const location = useLocation();
  return <div className="hidden md:flex flex-1 items-center justify-center">
      <div className="mx-auto inline-flex items-center gap-4 bg-black/80 backdrop-blur-xl rounded-full p-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 px-[15px]">
        <Link to="/" className={`px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
            ${location.pathname === "/" ? "bg-[#0EA5E9]/10 text-white border-[#0EA5E9]/20 shadow-[0_4px_20px_rgba(14,165,233,0.3)] transform -translate-y-0.5" : "bg-black/20 text-white/80 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"}`}>
          Home
        </Link>
        <Link to="/dreamaker" className={`px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border
            ${location.pathname === "/dreamaker" ? "bg-[#0EA5E9]/10 text-white border-[#0EA5E9]/20 shadow-[0_4px_20px_rgba(14,165,233,0.3)] transform -translate-y-0.5" : "bg-black/20 text-white/80 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"}`}>
          Dreamaker
        </Link>
        <Link to={session ? "/konform" : "/konform-product"} className={`px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border
            ${location.pathname.includes("konform") ? "bg-[#0EA5E9]/10 text-white border-[#0EA5E9]/20 shadow-[0_4px_20px_rgba(14,165,233,0.3)] transform -translate-y-0.5" : "bg-black/20 text-white/80 border-white/10 hover:bg-[#0EA5E9]/10 hover:text-white hover:border-[#0EA5E9]/20 hover:shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:-translate-y-0.5"}`}>
          Konform
        </Link>
      </div>
    </div>;
};
