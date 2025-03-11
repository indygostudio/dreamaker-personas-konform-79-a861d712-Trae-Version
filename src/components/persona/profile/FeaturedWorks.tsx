import { Card } from "@/components/ui/card";
import type { Persona } from "@/types/persona";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FeaturedWorksProps {
  persona: Persona;
}

export const FeaturedWorks = ({ persona }: FeaturedWorksProps) => {
  if (!persona.featured_works?.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Featured Works</h2>
      <ScrollArea className="h-[400px] rounded-md border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {persona.featured_works.map((work, index) => (
            <Card key={index} className="bg-black/40 border-white/10">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{work.title}</h3>
                <p className="text-sm text-gray-400">{work.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};