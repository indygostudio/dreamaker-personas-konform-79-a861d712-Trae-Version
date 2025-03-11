
import { TabsContent } from "@/components/ui/tabs";
import { ContentGrid } from "@/components/dreamaker/ContentGrid";
import { useSelectedPersonasStore } from "@/stores/selectedPersonasStore";
import { useUIStore } from "@/stores/uiStore";
import { useToast } from "@/hooks/use-toast";
import { PersonaDropContainer } from "@/components/artist-profile/components/PersonaDropContainer";
import type { SubscriptionTier } from "@/types/subscription";

interface DreamakerTabContentProps {
  activeTab: string;
  items: any[];
  zoomLevel: number;
  subscriptionTier?: SubscriptionTier;
  onAudioPlay: (fileUrl: string) => void;
}

export const DreamakerTabContent = ({
  activeTab,
  items,
  zoomLevel,
  subscriptionTier,
  onAudioPlay
}: DreamakerTabContentProps) => {
  const { toast } = useToast();
  const { showDropContainer } = useSelectedPersonasStore();
  const { setHeaderExpanded } = useUIStore();

  return (
    <>
      {showDropContainer && activeTab === "personas" && (
        <PersonaDropContainer 
          userId={undefined} 
          onRefetchCollaborations={() => {
            toast({
              title: "Collaboration created",
              description: "Your new collaboration has been created",
            });
          }} 
        />
      )}

      <TabsContent value="profiles" className="flex-1 overflow-hidden mt-6">
        <ContentGrid 
          activeTab={activeTab}
          items={items}
          zoomLevel={zoomLevel}
          subscriptionTier={subscriptionTier}
          onAudioPlay={onAudioPlay}
        />
      </TabsContent>

      <TabsContent value="personas" className="flex-1 overflow-hidden mt-6">
        <ContentGrid 
          activeTab={activeTab}
          items={items}
          zoomLevel={zoomLevel}
          subscriptionTier={subscriptionTier}
          onAudioPlay={onAudioPlay}
        />
      </TabsContent>

      <TabsContent value="media" className="flex-1 overflow-hidden mt-6">
        <ContentGrid 
          activeTab={activeTab}
          items={items}
          zoomLevel={zoomLevel}
          subscriptionTier={subscriptionTier}
          onAudioPlay={onAudioPlay}
        />
      </TabsContent>

      <TabsContent value="collaborations" className="flex-1 overflow-hidden mt-6">
        <ContentGrid 
          activeTab={activeTab}
          items={items}
          zoomLevel={zoomLevel}
          subscriptionTier={subscriptionTier}
          onAudioPlay={onAudioPlay}
        />
      </TabsContent>
    </>
  );
};
