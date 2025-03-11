
import { ArtistCard } from "../ArtistCard";
import { PersonaCard } from "../PersonaCard";
import { MediaCard } from "../MediaCard";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { useUIStore } from "@/stores/uiStore";
import { toast } from "@/hooks/use-toast";
import type { Persona } from "@/types/persona";
import type { ArtistProfile } from "@/hooks/use-artist-profiles";
import type { SubscriptionTier } from "@/types/subscription";

interface ContentRendererProps {
  item: any;
  activeTab: string;
  zoomLevel: number;
  subscriptionTier?: SubscriptionTier;
  onAudioPlay: (fileUrl: string) => void;
}

export const ContentRenderer = ({
  item,
  activeTab,
  zoomLevel,
  subscriptionTier,
  onAudioPlay
}: ContentRendererProps) => {
  const { addPersona, setShowDropContainer } = useSelectedPersonasStore();
  const { setHeaderExpanded } = useUIStore();

  // Calculate card height scaling based on zoom level with consistent proportions
  const getCardHeight = () => {
    switch (zoomLevel) {
      case 20:
        return 'h-[220px]';
      case 40:
        return 'h-[250px]';
      case 60:
        return 'h-[280px]';
      case 80:
        return 'h-[320px]';
      case 100:
        return 'h-[360px]';
      default:
        return 'h-[280px]';
    }
  };

  const handleAddToProject = (persona: Persona) => {
    setShowDropContainer(true);
    setHeaderExpanded(false);
    addPersona({
      id: persona.id,
      name: persona.name,
      avatarUrl: persona.avatar_url,
      type: persona.type
    });
    toast({
      title: "Added to project",
      description: `${persona.name} has been added to your project`,
    });
  };

  switch (activeTab) {
    case "profiles":
      return <ArtistCard artist={item as ArtistProfile} heightClass={getCardHeight()} />;
    case "personas":
    case "collaborations": 
      return (
        <PersonaCard 
          artist={item as Persona} 
          onAddToProject={() => handleAddToProject(item)}
        />
      );
    case "media":
      return (
        <MediaCard
          title={item.title}
          type={item.type}
          imageUrl={item.preview_image_url || "/placeholder.svg"}
          bpm={item.bpm}
          musicalKey={item.musical_key}
          requiredTier={item.required_tier}
          currentTier={subscriptionTier || 'free'}
          onPlay={() => onAudioPlay(item.file_url)}
          onDownload={() => {
            if (!item.file_url) {
              toast({
                title: "Error",
                description: "No file available for download",
                variant: "destructive"
              });
              return;
            }
            const link = document.createElement('a');
            link.href = item.file_url;
            link.download = item.title;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          id={item.id}
          zoomLevel={zoomLevel}
        />
      );
    default:
      return null;
  }
};
