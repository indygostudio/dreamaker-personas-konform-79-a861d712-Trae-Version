
import type { Persona } from "@/types/persona";
import { TabsContent } from "@/components/ui/tabs";

interface PersonaTabContentProps {
  id: string;
  content: React.ReactNode;
  isEnabled?: boolean;
  positions?: Record<string, { x: number; y: number }>;
}

export const PersonaTabContent = ({
  id,
  content,
  isEnabled = false,
  positions = {},
}: PersonaTabContentProps) => {
  if (!isEnabled) return <TabsContent value={id}>{content}</TabsContent>;

  return (
    <TabsContent value={id}>
      <div
        style={{
          transform: `translate(${positions[id]?.x || 0}px, ${
            positions[id]?.y || 0
          }px)`,
        }}
      >
        {content}
      </div>
    </TabsContent>
  );
};
