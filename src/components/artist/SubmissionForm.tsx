import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@supabase/auth-helpers-react";

interface SubmissionFormProps {
  onSuccess?: () => void;
}

export const SubmissionForm = ({ onSuccess }: SubmissionFormProps) => {
  const { toast } = useToast();
  const session = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [formData, setFormData] = useState({
    artistName: "",
    genre: "",
    description: "",
    portfolio: "",
  });

  const { data: labels } = useQuery({
    queryKey: ["record-labels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("record_labels")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to submit",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("artist_submissions")
        .insert({
          user_id: session.user.id,
          label_id: selectedLabel,
          submission_data: {
            ...formData,
            submitted_at: new Date().toISOString(),
          },
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your submission has been received",
      });

      onSuccess?.();
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-white">Artist Name</label>
          <Input
            value={formData.artistName}
            onChange={(e) =>
              setFormData({ ...formData, artistName: e.target.value })
            }
            className="bg-black/40"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white">Genre</label>
          <Input
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            className="bg-black/40"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="bg-black/40"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white">
            Portfolio Links
          </label>
          <Input
            value={formData.portfolio}
            onChange={(e) =>
              setFormData({ ...formData, portfolio: e.target.value })
            }
            placeholder="Links to your work (SoundCloud, Spotify, etc.)"
            className="bg-black/40"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white">Select Label</label>
          <Select
            value={selectedLabel}
            onValueChange={setSelectedLabel}
          >
            <SelectTrigger className="bg-black/40">
              <SelectValue placeholder="Choose a record label" />
            </SelectTrigger>
            <SelectContent>
              {labels?.map((label) => (
                <SelectItem key={label.id} value={label.id}>
                  {label.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-konform-neon-blue hover:bg-konform-neon-orange text-black"
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
};