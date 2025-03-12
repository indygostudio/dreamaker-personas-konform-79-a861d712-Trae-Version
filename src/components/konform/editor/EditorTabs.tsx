
import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Laptop2, Settings, Music2, Wand2, Layers, Grid3x3 } from "lucide-react";
import { KeybaseView } from "../views/KeybaseView";
import { TrackEditor } from "./TrackEditor";
import { DrumPadView } from "../DrumPadView";

export const EditorTabs = () => {
  const [activeTab, setActiveTab] = useState("trackEditor");

  return (
    <div className="w-full h-[calc(100vh-120px)] bg-black/40 rounded-lg flex flex-col">
      {/* Editor Tabs */}
      <Tabs defaultValue="trackEditor" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="flex justify-start items-center px-4 pt-2 bg-transparent gap-2 border-b border-konform-neon-blue/20">
          <TabsTrigger 
            value="trackEditor" 
            className="data-[state=active]:bg-black data-[state=active]:text-white px-4 py-2 rounded-t-md border-b-2 data-[state=active]:border-[#00D1FF] border-transparent"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Track Editor
          </TabsTrigger>
          <TabsTrigger 
            value="sampler" 
            className="data-[state=active]:bg-black data-[state=active]:text-white px-4 py-2 rounded-t-md border-b-2 data-[state=active]:border-[#00D1FF] border-transparent"
          >
            <Layers className="h-4 w-4 mr-2" />
            Keybase
          </TabsTrigger>
          <TabsTrigger 
            value="drumpad" 
            className="data-[state=active]:bg-black data-[state=active]:text-white px-4 py-2 rounded-t-md border-b-2 data-[state=active]:border-[#00D1FF] border-transparent"
          >
            <Grid3x3 className="h-4 w-4 mr-2" />
            Drumbase
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trackEditor" className="flex-1 p-0 m-0">
          <TrackEditor />
        </TabsContent>

        <TabsContent value="sampler" className="flex-1 p-0 m-0">
          <div className="h-full flex flex-col">
            <ResizablePanelGroup direction="horizontal">
              {/* Left Panel */}
              <ResizablePanel defaultSize={15} minSize={10} maxSize={30} className="bg-black/20">
                <div className="h-full border-r border-konform-neon-blue/20 p-2" />
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Center Panel */}
              <ResizablePanel defaultSize={65}>
                <ResizablePanelGroup direction="vertical">
                  {/* Main Editor Area */}
                  <ResizablePanel defaultSize={70}>
                    <div className="h-full bg-black/20 p-2">
                      <KeybaseView />
                    </div>
                  </ResizablePanel>

                  <ResizableHandle withHandle />

                  {/* Pattern Editor */}
                  <ResizablePanel defaultSize={30}>
                    <div className="h-full bg-black/20 p-2" />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Right Panel */}
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <div className="h-full bg-black/20 border-l border-konform-neon-blue/20 p-2" />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </TabsContent>

        <TabsContent value="drumpad" className="flex-1 p-0 m-0">
          <DrumPadView />
        </TabsContent>
      </Tabs>
    </div>
  );
};
