import { CollabClub } from "@/components/persona/collaboration/CollabClub";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CollabClubPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  if (!session) {
    return (
      <div className="container mx-auto py-12 px-4 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6">Collab Club</h1>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl">
          Connect with other artists, collaborate on projects, and share royalties.
          Please sign in to access the Collab Club.
        </p>
        <Button 
          onClick={() => navigate("/auth")} 
          className="bg-dreamaker-purple hover:bg-dreamaker-purple/80"
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <CollabClub />
    </div>
  );
};

export default CollabClubPage;