
import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Laptop2, Settings, Music2, Wand2, Layers, Grid3x3, FileText, Sliders, Mic, Database } from "lucide-react";
import { KeybaseView } from "../views/KeybaseView";
import { TrackEditor } from "./TrackEditor";
import { DrumPadView } from "../DrumPadView";
import { LyricbaseView } from "../views/LyricbaseView";
import { MixabaseView } from "../views/MixabaseView";
import { VoxbaseView } from "../views/VoxbaseView";
import { SupabaseView } from "../views/SupabaseView";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableTab = ({ tab }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: tab.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <TabsTrigger 
      ref={setNodeRef}
      value={tab.value}
      className="data-[state=active]:bg-black data-[state=active]:text-white px-4 py-2 rounded-t-md border-b-2 data-[state=active]:border-[#00D1FF] border-transparent cursor-move"
      style={style}
      {...attributes}
      {...listeners}
    >
      {tab.icon}
      {tab.label}
    </TabsTrigger>
  );
};

export const EditorTabs = () => {
  const [activeTab, setActiveTab] = useState("trackEditor");
  const [tabs, setTabs] = useState([
    { id: 'trackEditor', value: 'trackEditor', label: 'Songbase', icon: <Wand2 className="h-4 w-4 mr-2" /> },
    { id: 'sampler', value: 'sampler', label: 'Keybase', icon: <Layers className="h-4 w-4 mr-2" /> },
    { id: 'drumpad', value: 'drumpad', label: 'Drumbase', icon: <Grid3x3 className="h-4 w-4 mr-2" /> },
    { id: 'lyricbase', value: 'lyricbase', label: 'Lyricbase', icon: <FileText className="h-4 w-4 mr-2" /> },
    { id: 'mixabase', value: 'mixabase', label: 'Mixbase', icon: <Sliders className="h-4 w-4 mr-2" /> },
    { id: 'supabase', value: 'supabase', label: 'Subase', icon: <Database className="h-4 w-4 mr-2" /> },
    { id: 'voxbase', value: 'voxbase', label: 'Voxbase', icon: <Mic className="h-4 w-4 mr-2" /> },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setTabs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="w-full h-[calc(100vh-120px)] bg-black/40 rounded-lg flex flex-col">
      <Tabs defaultValue="trackEditor" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <TabsList className="flex justify-start items-center px-4 pt-2 bg-transparent gap-2 border-b border-konform-neon-blue/20">
            <SortableContext 
              items={tabs.map(tab => tab.id)}
              strategy={horizontalListSortingStrategy}
            >
              {tabs.map((tab) => (
                <SortableTab key={tab.id} tab={tab} />
              ))}
            </SortableContext>
          </TabsList>
        </DndContext>

        <TabsContent value="trackEditor" className="flex-1 p-0 m-0">
          <TrackEditor />
        </TabsContent>

        <TabsContent value="sampler" className="flex-1 p-0 m-0">
          <div className="h-full bg-black/20 p-2">
            <KeybaseView />
          </div>
        </TabsContent>

        <TabsContent value="drumpad" className="flex-1 p-0 m-0">
          <DrumPadView />
        </TabsContent>

        <TabsContent value="lyricbase" className="flex-1 p-0 m-0">
          <LyricbaseView />
        </TabsContent>

        <TabsContent value="mixabase" className="flex-1 p-0 m-0">
          <MixabaseView />
        </TabsContent>

        <TabsContent value="supabase" className="flex-1 p-0 m-0">
          <SupabaseView />
        </TabsContent>

        <TabsContent value="voxbase" className="flex-1 p-0 m-0">
          <VoxbaseView />
        </TabsContent>
      </Tabs>
    </div>
  );
};
