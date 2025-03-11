import { Piano, Play, Square, Save } from "lucide-react";
import { TransportControls } from "./TransportControls";
import { KonformBanner } from "./KonformBanner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useHeaderStore } from "./store/headerStore";

interface Note {
  id: string;
  pitch: number;
  startTime: number;
  duration: number;
  velocity: number;
}

export const KeypadView = () => {
  const { keypadHeaderCollapsed, setKeypadHeaderCollapsed } = useHeaderStore();
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Generate 88 piano keys (standard piano range)
  const pianoKeys = Array(88).fill(null);
  const timelineWidth = 2000 * zoom; // Adjustable timeline width
  const noteHeight = 20;

  const isBlackKey = (index: number) => {
    const noteInOctave = index % 12;
    return [1, 3, 6, 8, 10].includes(noteInOctave);
  };

  const handleAddNote = (pitch: number, time: number) => {
    const newNote: Note = {
      id: Math.random().toString(),
      pitch,
      startTime: Math.floor(time / 25) * 25, // Snap to grid
      duration: 100,
      velocity: 100,
    };
    setNotes([...notes, newNote]);
  };

  const handleNoteResize = (noteId: string, newDuration: number) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, duration: Math.max(25, newDuration) } : note
    ));
  };

  return (
    <div className="flex-1 overflow-hidden bg-[#131415]">
      <KonformBanner 
        title="MIDI EDITOR" 
        description="Create and edit MIDI sequences"
        isCollapsed={keypadHeaderCollapsed}
        onCollapsedChange={setKeypadHeaderCollapsed}
      />
      
      <div className="p-6 space-y-6">
        {/* Controls */}
        <div className="flex items-center gap-4 bg-[#1A1A1A] p-4 rounded-lg border border-[#353F51]">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10"
          >
            {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" className="w-10 h-10">
            <Save className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <Slider
              value={[zoom]}
              onValueChange={([value]) => setZoom(value)}
              min={0.5}
              max={2}
              step={0.1}
              className="w-32"
            />
          </div>
        </div>

        {/* MIDI Editor Grid */}
        <div className="relative h-[600px] overflow-auto bg-[#1A1A1A] rounded-lg border border-[#353F51]">
          {/* Piano Roll */}
          <div className="absolute left-0 top-0 bottom-0 w-[100px] bg-[#242424] border-r border-[#353F51] z-10">
            {pianoKeys.map((_, index) => (
              <div
                key={index}
                className={`h-[20px] border-b border-[#353F51] ${
                  isBlackKey(index)
                    ? "bg-[#1A1A1A] h-[16px]"
                    : "bg-[#2A2A2A]"
                } flex items-center justify-center`}
              >
                <Piano className="w-3 h-3 text-[#00D1FF] opacity-50" />
              </div>
            ))}
          </div>

          {/* Grid and Notes */}
          <div 
            className="absolute left-[100px] top-0 right-0 bottom-0 overflow-auto"
            style={{ width: `${timelineWidth}px` }}
          >
            {/* Vertical Grid Lines */}
            <div className="absolute inset-0" style={{ backgroundSize: '25px 20px', backgroundImage: 'linear-gradient(to right, #353F51 1px, transparent 1px), linear-gradient(to bottom, #353F51 1px, transparent 1px)' }}>
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="absolute bg-[#00D1FF]/30 hover:bg-[#00D1FF]/50 cursor-pointer border border-[#00D1FF] rounded"
                  style={{
                    left: `${note.startTime}px`,
                    top: `${note.pitch * noteHeight}px`,
                    width: `${note.duration}px`,
                    height: `${noteHeight - 1}px`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div 
                    className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize"
                    onMouseDown={(e) => {
                      const startX = e.clientX;
                      const startWidth = note.duration;
                      
                      const handleMouseMove = (moveEvent: MouseEvent) => {
                        const dx = moveEvent.clientX - startX;
                        handleNoteResize(note.id, startWidth + dx);
                      };
                      
                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <TransportControls />
      </div>
    </div>
  );
};
