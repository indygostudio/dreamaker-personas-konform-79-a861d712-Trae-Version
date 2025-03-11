
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Edit2Icon, Share2, Heart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GroupPersonaCardProps {
  group: {
    id: string;
    name: string;
    description?: string;
    avatar_urls: string[];
    member_personas: string[];
    is_public: boolean;
  };
  onEdit?: () => void;
}

export const GroupPersonaCard = ({ group, onEdit }: GroupPersonaCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.share({
        title: group.name,
        text: group.description || "Check out this persona group!",
        url: window.location.href,
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this group",
      });
    }
  };

  return (
    <Card 
      className="group overflow-hidden relative bg-dreamaker-gray border-dreamaker-purple/20 hover:border-dreamaker-purple transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            {group.avatar_urls.slice(0, 3).map((url, index) => (
              <Avatar
                key={index}
                className={`h-12 w-12 border-2 border-dreamaker-gray absolute`}
                style={{
                  transform: `translateX(${index * 20}px)`,
                  zIndex: 3 - index
                }}
              >
                <AvatarImage src={url} alt={`Member ${index + 1}`} />
                <AvatarFallback className="bg-dreamaker-purple">
                  {index + 1}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>

          <div className="flex-1 ml-16">
            <h3 className="text-xl font-semibold text-white group-hover:text-dreamaker-purple transition-colors">
              {group.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="h-4 w-4" />
              <span>{group.member_personas.length} members</span>
            </div>
            {group.description && (
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors mt-2">
                {group.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-dreamaker-gray border-t border-dreamaker-purple/20 p-4">
        <div className="flex justify-end gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onEdit}
            className="bg-transparent border-dreamaker-purple/50 hover:bg-dreamaker-purple/10 hover:border-dreamaker-purple text-gray-300 hover:text-white transition-colors"
          >
            <Edit2Icon className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-transparent border-dreamaker-purple/50 hover:bg-dreamaker-purple/10 hover:border-dreamaker-purple text-gray-300 hover:text-white transition-colors"
          >
            <Heart className="h-4 w-4 mr-1" />
            Favorite
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleShare}
            className="bg-transparent border-dreamaker-purple/50 hover:bg-dreamaker-purple/10 hover:border-dreamaker-purple text-gray-300 hover:text-white transition-colors"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
