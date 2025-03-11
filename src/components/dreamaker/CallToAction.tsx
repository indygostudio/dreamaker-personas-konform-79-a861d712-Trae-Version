import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";

interface CallToActionProps {
  onAuthRequired?: () => void;
}

export const CallToAction = ({ onAuthRequired }: CallToActionProps) => {
  const navigate = useNavigate();
  const session = useSession();

  const handleClick = () => {
    if (session) {
      navigate("/personas/create");
    } else if (onAuthRequired) {
      // Redirect to auth page with a redirect parameter
      navigate("/auth?redirect=personas/create");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 mb-16">
      <Button 
        onClick={handleClick}
        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-full text-lg font-syne"
      >
        {session ? "Start Creating" : "Sign Up as Artist"}
      </Button>
      <p className="text-xl md:text-2xl text-gray-300 max-w-3xl text-center font-syne">
        Create, collaborate, and share your music with AI-powered virtual artists.
        Join a community of creators and bring your musical visions to life.
      </p>
    </div>
  );
};