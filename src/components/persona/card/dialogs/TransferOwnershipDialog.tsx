
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface TransferOwnershipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personaId: string;
}

export const TransferOwnershipDialog = ({
  open,
  onOpenChange,
  personaId,
}: TransferOwnershipDialogProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  useEffect(() => {
    // Check session status when component mounts
    const checkSession = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session check error:", error);
      } else {
        console.log("Current session:", currentSession);
      }
    };
    checkSession();
  }, []);

  const handleTransferOwnership = async () => {
    console.log("Transfer button clicked");
    
    // Get current session to ensure it's fresh
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (!currentSession?.user?.id) {
      console.log("No session user ID found");
      toast.error("You must be logged in to transfer ownership");
      return;
    }

    if (!newOwnerEmail.trim()) {
      console.log("No username entered");
      toast.error("Please enter a username");
      return;
    }

    setIsTransferring(true);
    console.log("Starting transfer process");

    try {
      console.log("Looking up user profile for:", newOwnerEmail.trim());
      
      // First get the target user's profile
      const { data: newOwnerProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('username', newOwnerEmail.trim())
        .maybeSingle();

      if (profileError) {
        console.error("Profile lookup error:", profileError);
        throw new Error("Failed to find user");
      }

      if (!newOwnerProfile) {
        throw new Error("User not found");
      }

      console.log("Found profile:", newOwnerProfile);
      console.log("Attempting transfer for persona:", personaId);
      console.log("From user:", currentSession.user.id);
      console.log("To user:", newOwnerProfile.id);

      // Then transfer ownership
      const { data: transferData, error: transferError } = await supabase.rpc(
        'transfer_persona_ownership',
        {
          persona_id: personaId,
          current_owner_id: currentSession.user.id,
          new_owner_id: newOwnerProfile.id
        }
      );

      console.log("Transfer response:", { data: transferData, error: transferError });

      if (transferError) {
        console.error("Transfer error:", transferError);
        throw transferError;
      }

      toast.success("Persona ownership transferred successfully");
      onOpenChange(false);
      setNewOwnerEmail("");

      // Invalidate queries to refresh data
      console.log("Invalidating queries...");
      await queryClient.invalidateQueries({ queryKey: ["artist-personas"] });
      await queryClient.invalidateQueries({ queryKey: ["personas"] });
      console.log("Queries invalidated");
      
      // Add small delay before navigation to ensure queries are refetched
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Force refresh by navigating away and back
      if (window.location.pathname === `/artists/${newOwnerProfile.id}`) {
        // If we're already on the target page, navigate to home and back
        console.log("Same route - forcing refresh");
        navigate('/');
        setTimeout(() => {
          console.log("Navigating back to:", `/artists/${newOwnerProfile.id}`);
          navigate(`/artists/${newOwnerProfile.id}`);
        }, 100);
      } else {
        console.log("Navigating to:", `/artists/${newOwnerProfile.id}`);
        navigate(`/artists/${newOwnerProfile.id}`);
      }

    } catch (error: any) {
      console.error("Error transferring ownership:", error);
      toast.error(error.message || "Failed to transfer ownership");
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        if (!isTransferring) {
          onOpenChange(open);
          if (!open) {
            setNewOwnerEmail("");
          }
        }
      }}
    >
      <DialogContent className="bg-black/90 border-dreamaker-purple/20">
        <DialogHeader>
          <DialogTitle>Transfer Persona Ownership</DialogTitle>
          <DialogDescription>
            Enter the username of the user you want to transfer this persona to.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter username"
              value={newOwnerEmail}
              onChange={(e) => setNewOwnerEmail(e.target.value)}
              disabled={isTransferring}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isTransferring}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log("Button clicked");
              handleTransferOwnership();
            }}
            disabled={!newOwnerEmail.trim() || isTransferring}
          >
            {isTransferring ? "Transferring..." : "Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
