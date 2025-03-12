
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const linkClass = "hover:text-white transition-colors hover:bg-[#0EA5E9]/10 hover:shadow-[0_4px_20px_rgba(14,165,233,0.1)] px-3 py-1 rounded-full hover:border-[#0EA5E9]/20";
  
  return (
    <footer className="bg-dreamaker-bg text-gray-400 py-16 px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Products Column */}
        <div>
          <h3 className="text-white font-semibold mb-4">Products</h3>
          <ul className="space-y-2">
            <li><Link to="/dreamaker" className={linkClass}>Dreamaker</Link></li>
            <li><Link to="/konform" className={linkClass}>AI Professional DAW</Link></li>
            <li><Link to="/personas" className={linkClass}>Personas</Link></li>
          </ul>
        </div>

        {/* Features Column */}
        <div>
          <h3 className="text-white font-semibold mb-4">Features</h3>
          <ul className="space-y-2">
            <li><Link to="/personas" className={linkClass}>Browse Artists</Link></li>
            <li><Link to="/personas/create" className={linkClass}>Create Persona</Link></li>
            <li><Link to="/dreamaker" className={linkClass}>Generate Music</Link></li>
            <li><Link to="/earn" className={linkClass}>Earn</Link></li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h3 className="text-white font-semibold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li><Link to="/docs" className={linkClass}>Documentation</Link></li>
            <li><Link to="/tutorials" className={linkClass}>Tutorials</Link></li>
            <li><Link to="/pricing" className={linkClass}>Pricing</Link></li>
            <li><Link to="/blog" className={linkClass}>Blog</Link></li>
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className={linkClass}>About Us</Link></li>
            <li><Link to="/contact" className={linkClass}>Contact</Link></li>
            <li><Link to="/careers" className={linkClass}>Careers</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-16 flex flex-col md:flex-row justify-between items-center border-t border-gray-800 pt-8">
        <p className="text-sm">©2024 AI Professional DAW, All Rights Reserved</p>
        
        <div className="flex items-center space-x-8 mt-4 md:mt-0">
          <div className="flex items-center space-x-4">
            <Link to="https://facebook.com" className="hover:text-white transition-colors hover:bg-[#0EA5E9]/10 p-2 rounded-full hover:shadow-[0_4px_20px_rgba(14,165,233,0.15)]">
              <Facebook size={20} />
            </Link>
            <Link to="https://twitter.com" className="hover:text-white transition-colors hover:bg-[#0EA5E9]/10 p-2 rounded-full hover:shadow-[0_4px_20px_rgba(14,165,233,0.15)]">
              <Twitter size={20} />
            </Link>
            <Link to="https://linkedin.com" className="hover:text-white transition-colors hover:bg-[#0EA5E9]/10 p-2 rounded-full hover:shadow-[0_4px_20px_rgba(14,165,233,0.15)]">
              <Linkedin size={20} />
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <Link to="/terms" className={linkClass}>Terms</Link>
            <Link to="/privacy" className={linkClass}>Privacy</Link>
            <Link to="/cookies" className={linkClass}>Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
