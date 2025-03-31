
import { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Laptop2, Settings, Music2, Wand2, Layers, Grid3x3, FileText, Sliders, Mic, Database, Save } from "lucide-react";
import { KeybaseView } from "../views/KeybaseView";
import { TrackEditor } from "./TrackEditor";
import { DrumPadView } from "../DrumPadView";
import { LyricbaseView } from "../views/LyricbaseView";
import { MixbaseView } from "../views/MixbaseView";
import { VoxbaseView } from "../views/VoxbaseView";
import { SubaseView } from "../views/SubaseView";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useToast } from "@/hooks/use-toast";
import { GuitarbaseView } from "../views/GuitarbaseView";

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
      className="data-[state=active]:bg-[#ea384c]/10 data-[state=active]:text-white data-[state=active]:border-[#ea384c]/20 data-[state=active]:shadow-[0_4px_20px_rgba(234,56,76,0.3)] px-4 py-2 rounded-md border-l-2 border-transparent cursor-move w-full flex items-center"
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
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("trackEditor");
  const [tabs, setTabs] = useState([    
    { id: 'trackEditor', value: 'trackEditor', label: 'Songbase', icon: <Wand2 className="h-4 w-4 mr-2" /> },
    { id: 'sampler', value: 'sampler', label: 'Keybase', icon: <Layers className="h-4 w-4 mr-2" /> },
    { id: 'drumpad', value: 'drumpad', label: 'Drumbase', icon: <Grid3x3 className="h-4 w-4 mr-2" /> },
    { id: 'guitarbase', value: 'guitarbase', label: 'Guitarbase', icon: <Music2 className="h-4 w-4 mr-2" /> },
    { id: 'lyricbase', value: 'lyricbase', label: 'Lyricbase', icon: <FileText className="h-4 w-4 mr-2" /> },
    { id: 'mixbase', value: 'mixbase', label: 'Mixbase', icon: <Sliders className="h-4 w-4 mr-2" /> },
    { id: 'subase', value: 'subase', label: 'Subase', icon: <Music2 className="h-4 w-4 mr-2" /> },
    { id: 'voxbase', value: 'voxbase', label: 'Voxbase', icon: <Mic className="h-4 w-4 mr-2" /> },
  ]);

  // Auto-save tabs order to localStorage
  const saveTabsOrder = () => {
    localStorage.setItem('konform-tabs-order', JSON.stringify(tabs.map(tab => tab.id)));
  };

  // Load tabs order from localStorage on component mount
  useEffect(() => {
    const savedOrder = localStorage.getItem('konform-tabs-order');
    if (savedOrder) {
      try {
        const orderIds = JSON.parse(savedOrder);
        // Reorder tabs based on saved order
        const newTabs = [...tabs];
        const orderedTabs = [];
        
        // First add tabs in the saved order
        orderIds.forEach(id => {
          const tab = newTabs.find(t => t.id === id);
          if (tab) orderedTabs.push(tab);
        });
        
        // Then add any new tabs that weren't in the saved order
        newTabs.forEach(tab => {
          if (!orderIds.includes(tab.id)) orderedTabs.push(tab);
        });
        
        setTabs(orderedTabs);
      } catch (error) {
        console.error('Error loading saved tab order:', error);
      }
    }
  }, []);

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
        const newItems = arrayMove(items, oldIndex, newIndex);
        // Auto-save whenever order changes
        localStorage.setItem('konform-tabs-order', JSON.stringify(newItems.map(tab => tab.id)));
        return newItems;
      });
    }
  };

  return (
    <div className="w-full h-[calc(100vh-120px)] bg-black/40 rounded-lg flex">
      <Tabs defaultValue="trackEditor" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex">
        <div className="w-48 flex flex-col justify-start items-stretch px-2 pt-2 bg-transparent border-r border-konform-neon-blue/20">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <TabsList className="flex flex-col justify-start items-stretch gap-2 bg-transparent">
              <SortableContext 
                items={tabs.map(tab => tab.id)}
                strategy={verticalListSortingStrategy}
              >
                {tabs.map((tab) => (
                  <SortableTab key={tab.id} tab={tab} />
                ))}
              </SortableContext>
            </TabsList>
          </DndContext>
          

        </div>

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

        <TabsContent value="guitarbase" className="flex-1 p-0 m-0">
          <GuitarbaseView />
        </TabsContent>

        <TabsContent value="lyricbase" className="flex-1 p-0 m-0">
          <LyricbaseView />
        </TabsContent>

        <TabsContent value="mixbase" className="flex-1 p-0 m-0">
          <MixbaseView />
        </TabsContent>

        <TabsContent value="supabase" className="flex-1 p-0 m-0">
          <SubaseView />
        </TabsContent>

        <TabsContent value="voxbase" className="flex-1 p-0 m-0">
          <VoxbaseView />
        </TabsContent>
      </Tabs>
    </div>
  );
};
