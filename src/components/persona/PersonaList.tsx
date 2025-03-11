
import { PersonaCard } from "@/components/PersonaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import type { Persona } from "@/types/persona";
import { Mic2, Guitar, Settings2, Keyboard, Wand2, PenTool } from "lucide-react";

interface PersonaListProps {
  personas: Persona[];
  isLoading: boolean;
  selectionMode: boolean;
  selectedPersonas: Persona[];
  onEdit: (persona: Persona) => void;
  onDelete: (id: string) => void;
  onSelect: (persona: Persona, selected: boolean) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const PersonaListSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-dreamaker-gray border border-dreamaker-purple/20 rounded-lg p-6 h-[280px]">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const PersonaTypeCard = ({ type, title, description, videoSrc, icon: Icon }: { 
  type: string; 
  title: string; 
  description: string;
  videoSrc: string;
  icon: any;
}) => (
  <Link 
    to={`/personas/${type.toLowerCase()}`}
    className="relative w-full h-[200px] overflow-hidden rounded-lg group cursor-pointer"
  >
    <video
      src={videoSrc}
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 group-hover:to-black/70 transition-all duration-300">
      <div className="absolute bottom-6 left-6">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-5 w-5 text-dreamaker-purple" />
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-gray-200">{description}</p>
      </div>
    </div>
  </Link>
);

export const PersonaList = ({
  personas,
  isLoading,
  selectionMode,
  selectedPersonas,
  onEdit,
  onDelete,
  onSelect,
  onLoadMore,
  hasMore,
}: PersonaListProps) => {
  if (isLoading && personas.length === 0) {
    return <PersonaListSkeleton />;
  }

  const personalPersonas = personas.filter(p => !p.is_collab);
  const collaborativePersonas = personas.filter(p => p.is_collab);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Personal Personas</TabsTrigger>
          <TabsTrigger value="collaborative">Collaborative Personas</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PersonaTypeCard
              type="ARTIST"
              title="Artists"
              description="Create virtual singers and musicians"
              videoSrc="/Videos/PERSONAS_01.mp4"
              icon={Mic2}
            />
            <PersonaTypeCard
              type="LYRICIST"
              title="Lyricists"
              description="Create virtual songwriters and poets"
              videoSrc="/Videos/KONFORM_01.mp4"
              icon={PenTool}
            />
            <PersonaTypeCard
              type="INSTRUMENTALIST"
              title="Instrumentalists"
              description="Create virtual instrumentalists"
              videoSrc="/Videos/KONFORM_01.mp4"
              icon={Guitar}
            />
            <PersonaTypeCard
              type="MIXER"
              title="Mixers"
              description="Craft intelligent mixing profiles"
              videoSrc="/Videos/DREAMAKER_01.mp4"
              icon={Settings2}
            />
            <PersonaTypeCard
              type="INSTRUMENT"
              title="Instruments"
              description="Create virtual instruments and sounds"
              videoSrc="/Videos/ANDROID_II_01.mp4"
              icon={Keyboard}
            />
            <PersonaTypeCard
              type="EFFECT"
              title="Effects"
              description="Design unique audio effects"
              videoSrc="/Videos/KONFORM_01.mp4"
              icon={Wand2}
            />
          </div>

          <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">All Personas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalPersonas.map((persona) => (
                <PersonaCard
                  key={persona.id}
                  persona={persona}
                  onEdit={() => onEdit(persona)}
                  onDelete={() => onDelete(persona.id)}
                  selectionMode={selectionMode}
                  selected={selectedPersonas.some((p) => p.id === persona.id)}
                  onSelect={(selected) => onSelect(persona, selected)}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="collaborative" className="mt-6 space-y-6">
          <div className="relative w-full h-[200px] overflow-hidden rounded-lg mb-8">
            <video
              src="/Videos/KONFORM_01.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60">
              <div className="absolute bottom-6 left-6">
                <h2 className="text-2xl font-bold text-white">Collaborative Personas</h2>
                <p className="text-gray-200 mt-2">Work together with other creators</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collaborativePersonas.map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                onEdit={() => onEdit(persona)}
                onDelete={() => onDelete(persona.id)}
                selectionMode={selectionMode}
                selected={selectedPersonas.some((p) => p.id === persona.id)}
                onSelect={(selected) => onSelect(persona, selected)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-dreamaker-purple/20 hover:bg-dreamaker-purple/30 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};
