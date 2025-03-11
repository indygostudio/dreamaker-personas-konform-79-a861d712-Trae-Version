import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ChevronLeft, 
  ChevronRight,
  User,
  Music,
  Check
} from "lucide-react";

const STEPS = [
  {
    title: "Basic Info",
    description: "Tell us a bit about yourself",
  },
  {
    title: "Musical Interests",
    description: "What kind of music do you like?",
  },
  {
    title: "Preferred Genres",
    description: "Select your favorite genres",
  },
];

const GENRES = [
  "Pop", "Rock", "Hip Hop", "Jazz", "Classical", 
  "Electronic", "R&B", "Country", "Folk", "Metal"
];

export const OnboardingWizard = ({ 
  open, 
  onOpenChange 
}: { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    interests: [] as string[],
    preferred_genres: [] as string[],
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          username: formData.username,
          bio: formData.bio,
          interests: formData.interests,
          preferred_genres: formData.preferred_genres,
          onboarding_completed: true,
        })
        .eq("id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully set up!",
      });
      
      onOpenChange(false);
      navigate("/personas/create");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-dreamaker-purple/20 rounded-lg">
                <User className="w-6 h-6 text-dreamaker-purple-light" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Basic Information</h3>
                <p className="text-gray-400">Let's start with the basics</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-black/50 border-dreamaker-purple/30"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-black/50 border-dreamaker-purple/30"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-dreamaker-purple/20 rounded-lg">
                <Music className="w-6 h-6 text-dreamaker-purple-light" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Musical Interests</h3>
                <p className="text-gray-400">What kind of music interests you?</p>
              </div>
            </div>
            <Textarea
              value={formData.interests.join(", ")}
              onChange={(e) => setFormData({ 
                ...formData, 
                interests: e.target.value.split(",").map(i => i.trim()).filter(Boolean)
              })}
              className="bg-black/50 border-dreamaker-purple/30"
              placeholder="e.g. Playing guitar, Music production, Songwriting..."
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-dreamaker-purple/20 rounded-lg">
                <Check className="w-6 h-6 text-dreamaker-purple-light" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Preferred Genres</h3>
                <p className="text-gray-400">Select your favorite music genres</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {GENRES.map((genre) => (
                <Button
                  key={genre}
                  type="button"
                  variant={formData.preferred_genres.includes(genre) ? "default" : "outline"}
                  className={`w-full ${
                    formData.preferred_genres.includes(genre)
                      ? "bg-dreamaker-purple hover:bg-dreamaker-purple/90"
                      : "border-dreamaker-purple/30"
                  }`}
                  onClick={() => {
                    const genres = formData.preferred_genres.includes(genre)
                      ? formData.preferred_genres.filter((g) => g !== genre)
                      : [...formData.preferred_genres, genre];
                    setFormData({ ...formData, preferred_genres: genres });
                  }}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-black/90 border border-dreamaker-purple/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {STEPS[step].title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {renderStep()}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 0 || isSubmitting}
            className="border-dreamaker-purple/30"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-dreamaker-purple hover:bg-dreamaker-purple/90"
          >
            {step === STEPS.length - 1 ? (
              isSubmitting ? "Saving..." : "Complete"
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};