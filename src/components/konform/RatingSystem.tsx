import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RatingSystemProps {
  trackId: string;
  initialRating?: number;
}

export const RatingSystem = ({ trackId, initialRating }: RatingSystemProps) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [userPoints, setUserPoints] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserPoints();
  }, []);

  const fetchUserPoints = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // First try to get existing rewards
    const { data: rewards } = await supabase
      .from('user_rewards')
      .select('points')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (rewards) {
      setUserPoints(rewards.points);
    } else {
      // If no rewards exist, create a new record with default values
      const { data: newRewards, error } = await supabase
        .from('user_rewards')
        .insert([
          { user_id: session.user.id, points: 0 }
        ])
        .select('points')
        .single();

      if (!error && newRewards) {
        setUserPoints(newRewards.points);
      }
    }
  };

  const handleRating = async (value: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to rate tracks",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('track_ratings')
        .upsert({
          track_id: trackId,
          user_id: session.user.id,
          rating: value,
        });

      if (error) throw error;

      setRating(value);
      toast({
        title: "Rating Submitted",
        description: "Thank you for your feedback!",
      });

      // Refresh points after rating
      fetchUserPoints();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-black/20 rounded-lg">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <Button
            key={value}
            variant="ghost"
            size="sm"
            className={`hover:bg-dreamaker-purple/20 ${
              (isHovering ? value <= hoverRating : value <= rating)
                ? 'text-yellow-400'
                : 'text-gray-400'
            }`}
            onMouseEnter={() => {
              setIsHovering(true);
              setHoverRating(value);
            }}
            onMouseLeave={() => {
              setIsHovering(false);
              setHoverRating(0);
            }}
            onClick={() => handleRating(value)}
          >
            <Star className="h-6 w-6" />
          </Button>
        ))}
      </div>
      
      <div className="flex items-center gap-2 text-dreamaker-purple">
        <Award className="h-5 w-5" />
        <span>{userPoints} points</span>
      </div>
    </div>
  );
};