
import { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { GeminiSliderEffect } from "@/components/ui/gemini-slider-effect";
import { 
  RefreshCcw, 
  RotateCcw,
  MoreVertical,
  Play,
  Pause,
  Maximize2,
  Volume2,
  Crop,
  Replace,
  Scissors,
  FolderPlus,
  SlidersHorizontal
} from "lucide-react";

type Section = {
  id: string;
  type: "VERSE" | "CHORUS" | "BRIDGE" | "VERSE 2";
  color: string;
  start: number;
  end: number;
}

type Replacement = {
  id: string;
  title: string;
  timespan: string;
  style: string;
  likes?: boolean;
  dislikes?: boolean;
  image: string;
}

export const TrackEditor = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState("01:03.91");
  const [totalTime, setTotalTime] = useState("01:45.48");
  const [selectedLyricSection, setSelectedLyricSection] = useState<"verse" | "chorus">("verse");
  
  const sections: Section[] = [
    { id: "1", type: "VERSE", color: "#9b87f5", start: 0, end: 20 },
    { id: "2", type: "CHORUS", color: "#FEC6A1", start: 20, end: 35 },
    { id: "3", type: "VERSE 2", color: "#9b87f5", start: 35, end: 55 },
    { id: "4", type: "CHORUS", color: "#FEC6A1", start: 55, end: 70 },
    { id: "5", type: "BRIDGE", color: "#D3E4FD", start: 70, end: 85 },
    { id: "6", type: "CHORUS", color: "#FEC6A1", start: 85, end: 100 },
  ];

  const replacements: Replacement[] = [
    {
      id: "8",
      title: "Replacement #8",
      timespan: "0s to 01:02",
      style: "R&B Male Dark, soulful downtempo, Bluesy ethereal, building verse, hardrock",
      likes: true,
      image: "/lovable-uploads/4ae2356f-5155-4bf0-81b7-259f38368f76.png"
    },
    {
      id: "7",
      title: "Replacement #7",
      timespan: "0s to 01:02",
      style: "R&B Male Dark, soulful downtempo, Bluesy ethereal, building verse, hardrock",
      image: "/lovable-uploads/4ae2356f-5155-4bf0-81b7-259f38368f76.png"
    },
    {
      id: "6",
      title: "Extension #6",
      timespan: "from",
      style: "R&B Male Dark, soulful downtempo, Bluesy ethereal, building verse, hardrock",
      dislikes: true,
      image: "/lovable-uploads/4ae2356f-5155-4bf0-81b7-259f38368f76.png"
    },
    {
      id: "5",
      title: "Extension #5",
      timespan: "",
      style: "",
      image: "/lovable-uploads/4ae2356f-5155-4bf0-81b7-259f38368f76.png"
    }
  ];

  return (
    <div className="bg-black h-[calc(100vh-185px)] flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <div className="flex justify-between items-center bg-[#111] border-b border-[#222] p-2 h-12">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <MoreVertical className="h-5 w-5" />
          </Button>
          <span className="text-gray-300 font-medium">Edit</span>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-gray-300 border-b-2 border-[#00D1FF] px-3"
          >
            <Replace className="h-4 w-4" />
            REPLACE SECTION
          </Button>
          <Button variant="ghost" className="flex items-center gap-2 text-gray-500 px-3">
            <FolderPlus className="h-4 w-4" />
            EXTEND
          </Button>
          <Button variant="ghost" className="flex items-center gap-2 text-gray-500 px-3">
            <Crop className="h-4 w-4" />
            CROP
          </Button>
          <Button variant="ghost" className="flex items-center gap-2 text-gray-500 px-3">
            <Scissors className="h-4 w-4" />
            FADE OUT
          </Button>
        </div>
        
        <Button variant="ghost" size="icon" className="text-white">
          <span className="text-xl">×</span>
        </Button>
      </div>
      
      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Lyrics */}
        <ResizablePanel defaultSize={30} minSize={25} maxSize={40} className="bg-[#111]">
          <div className="flex items-center justify-between p-3 border-b border-[#222]">
            <span className="font-medium text-gray-300">LYRICS</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-4 h-[calc(100%-45px)] overflow-y-auto">
            <div className="mb-4">
              <div className="bg-[#9b87f5] text-white px-3 py-1 mb-2 rounded-sm w-24 text-center">
                VERSE
              </div>
              <div>
                <p className="py-1">
                  <span className="bg-[#FF5252] text-white px-1 py-0.5 rounded">You</span> walk on a wire it's thin as a thread
                </p>
                <p className="py-1">With the night falling and the sky turning red</p>
                <p className="py-1">Feet slipping scared of what comes next</p>
                <p className="py-1">Heart racing faster <span className="bg-[#FF5252] text-white px-1 py-0.5 rounded">and you gave it your best</span></p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="bg-[#FEC6A1] text-white px-3 py-1 mb-2 rounded-sm w-24 text-center">
                CHORUS
              </div>
              <div>
                <p className="py-1">
                  <span className="bg-[#FF5252] text-white px-1 py-0.5 rounded">Won't let you</span> <span className="bg-[#FF5252] text-white px-1 py-0.5 rounded">fall hold</span> <span className="bg-[#FF5252] text-white px-1 py-0.5 rounded">you</span> <span className="bg-[#FF5252] text-white px-1 py-0.5 rounded">tight in</span> <span className="bg-[#FF5252] text-white px-1 py-0.5 rounded">my arms</span>
                </p>
                <p className="py-1">
                  <span className="bg-[#FF5252] text-white px-1 py-0.5 rounded">Won't let you</span> <span className="bg-[#FF5252] text-white px-1 py-0.5 rounded">crash keep</span> <span className="bg-[#FF5252] text-white px-1 py-0.5 rounded">you</span> safe from the harms
                </p>
                <p className="py-1">
                  <span className="bg-[#FF5252] text-white px-1 py-0.5 rounded">You're</span> counting on <span className="bg-[#FF5252] text-white px-1 py-0.5 rounded">me to keep</span> <span className="bg-[#FF5252] text-white px-1 py-0.5 rounded">you</span> standing tall
                </p>
                <p className="py-1">
                  Hold me close darling <span className="bg-[#FF5252] text-white px-1 py-0.5 rounded">won't let you fall</span>
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-gray-400 text-sm">
              Drag the edges of the selection to pick a span of time to replace.
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Middle Panel - Styles */}
        <ResizablePanel defaultSize={35} minSize={25} maxSize={40}>
          <div className="flex items-center justify-between p-3 border-b border-[#222]">
            <span className="font-medium text-gray-300">STYLES</span>
          </div>
          
          <div className="p-4 h-[calc(100%-45px)] overflow-y-auto">
            <div className="text-white mb-6">
              <p>R&B Male Dark, soulful downtempo,</p>
              <p>Bluesy ethereal, building verse, hardrock</p>
            </div>
            
            <div className="mt-12">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 uppercase text-sm font-medium">EXCLUDE STYLES</span>
              </div>
              
              <div className="border border-dashed border-gray-700 rounded-md p-3 min-h-24">
                <p className="text-gray-400">
                  Describe styles to avoid for generated clips.
                </p>
              </div>
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Right Panel - Edits */}
        <ResizablePanel defaultSize={35} minSize={25} maxSize={40}>
          <div className="flex items-center justify-between p-3 border-b border-[#222]">
            <span className="font-medium text-gray-300">EDITS</span>
          </div>
          
          <div className="h-[calc(100%-45px)] overflow-y-auto">
            {replacements.map((replacement) => (
              <div key={replacement.id} className="p-4 border-b border-[#222] flex gap-3">
                <div className="w-16 h-16 bg-black rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={replacement.image} 
                    alt={replacement.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium">{replacement.title}</h3>
                      <p className="text-gray-400 text-sm">{replacement.timespan}</p>
                    </div>
                    <div className="flex gap-1">
                      {replacement.likes !== undefined && (
                        <Button variant="ghost" size="icon" className={`h-8 w-8 ${replacement.likes ? 'text-[#00D1FF]' : 'text-gray-400'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 10v12" />
                            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                          </svg>
                        </Button>
                      )}
                      {replacement.dislikes !== undefined && (
                        <Button variant="ghost" size="icon" className={`h-8 w-8 ${replacement.dislikes ? 'text-[#00D1FF]' : 'text-gray-400'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 14V2" />
                            <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                          </svg>
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{replacement.style}</p>
                </div>
              </div>
            ))}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      {/* Bottom Section - Playback Controls */}
      <div className="bg-[#111] border-t border-[#222] p-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-white font-mono">{currentTime}</span>
            <div className="w-20 h-1 bg-gray-700 rounded-full">
              <div className="h-full w-2/3 bg-white rounded-full relative">
                <div className="absolute -right-1.5 -top-1.5 w-4 h-4 bg-white rounded-full shadow-md" />
              </div>
            </div>
            <span className="text-white font-mono">{totalTime}</span>
          </div>
          
          <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-full px-6">
            Generate Replacements
          </Button>
        </div>
        
        {/* Waveform Section */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-8 flex items-center justify-start z-10 text-[10px] font-mono text-white">
            <div className="absolute left-[245px] bg-white/20 px-1 py-0.5 rounded">
              01:03
            </div>
          </div>

          <div className="relative h-28 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white z-10 ml-[245px]"></div>
            
            <div className="flex h-full">
              {sections.map((section) => (
                <div 
                  key={section.id} 
                  className="h-full relative flex-grow cursor-move"
                  style={{ 
                    width: `${section.end - section.start}%`,
                    backgroundColor: section.color,
                  }}
                >
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center">
                    <div className="text-center text-white text-lg font-bold">
                      {section.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Selected Area */}
            <div className="absolute left-[245px] top-0 bottom-0 w-[200px] border-2 border-white rounded-sm pointer-events-none"></div>
          </div>
        </div>
        
        {/* Track Info and Controls */}
        <div className="flex items-center justify-between mt-2 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded overflow-hidden">
              <img 
                src="/lovable-uploads/4ae2356f-5155-4bf0-81b7-259f38368f76.png" 
                alt="Album art"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium">Don't Let Me Fall</div>
              <div className="text-gray-400 text-xs flex items-center gap-1">
                <span>DR34M4K3R RECORDS</span>
                <span className="mx-1">|</span>
                <span>01:03</span>
                <span className="mx-1">/</span>
                <span>03:30</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-gray-400" />
              <div className="w-20 h-1 bg-gray-700 rounded-full relative">
                <div 
                  className="h-full bg-white rounded-full" 
                  style={{ width: `${volume}%` }}
                />
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="text-gray-400">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
