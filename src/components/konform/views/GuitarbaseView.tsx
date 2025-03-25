import { useState } from "react";
import { Music } from "lucide-react";
import { TrainingToggle } from "./TrainingToggle";
import { Button } from "@/components/ui/button";
import { PluginLoader } from "./PluginLoader";

export const GuitarbaseView = () => {
  const [selectedString, setSelectedString] = useState<number | null>(null);
  const [selectedFret, setSelectedFret] = useState<number | null>(null);
  const [knobValues, setKnobValues] = useState(Array(6).fill(50));
  const [currentChord, setCurrentChord] = useState("E Major");

  // Standard guitar tuning
  const strings = ["E", "B", "G", "D", "A", "E"];
  
  // Common guitar chords
  const chords = [
    "E Major", "A Major", "D Major", "G Major", "C Major", "F Major",
    "E Minor", "A Minor", "D Minor", "G Minor", "C Minor", "F Minor"
  ];

  const handleKnobChange = (index: number, value: number) => {
    const newValues = [...knobValues];
    newValues[index] = value;
    setKnobValues(newValues);
  };

  const handleStringFretClick = (stringIndex: number, fretIndex: number) => {
    setSelectedString(stringIndex);
    setSelectedFret(fretIndex);
    // Here you would trigger the actual note/sound
  };

  const handleChordChange = (chord: string) => {
    setCurrentChord(chord);
    // Here you would trigger the actual chord sound
  };

  return (
    <div className="min-h-[600px] bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50">
      <PluginLoader 
        title="Guitar Engine" 
        queryKey="guitar-plugins" 
        filterFn={(plugin) => plugin.isInstrument && plugin.supportsMidi}
      />
      
      <div className="flex items-start gap-4 my-6">
        <div className="flex-1 flex items-center justify-between gap-4 bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-gray-800/30">
          {Array(6).fill(null).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full bg-black/80 border border-cyan-500/30 cursor-pointer hover:border-cyan-500/50 transition-all duration-150"
                style={{
                  transform: `rotate(${(knobValues[i] / 100) * 270 - 135}deg)`,
                  transition: 'transform 0.1s'
                }}
                onClick={() => handleKnobChange(i, (knobValues[i] + 10) % 100)}
              />
              <div className="w-1 h-1 rounded-full bg-cyan-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Fretboard */}
      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-gray-800/30 mb-4">
        <div className="flex flex-col gap-2">
          {strings.map((string, stringIndex) => (
            <div key={stringIndex} className="flex items-center">
              <div className="w-8 text-center text-cyan-500 font-mono">{string}</div>
              <div className="flex-1 flex">
                {Array(12).fill(null).map((_, fretIndex) => (
                  <div 
                    key={fretIndex} 
                    className={`flex-1 h-8 border-r border-gray-700 ${selectedString === stringIndex && selectedFret === fretIndex ? 'bg-cyan-500/30' : ''} hover:bg-cyan-500/10 cursor-pointer transition-colors duration-150`}
                    onClick={() => handleStringFretClick(stringIndex, fretIndex)}
                  >
                    {fretIndex === 0 && (
                      <div className="w-full h-full border-l-2 border-gray-500"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chord Selection */}
      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-gray-800/30 mb-4">
        <div className="text-cyan-500 mb-2 font-mono">Chord Selection</div>
        <div className="grid grid-cols-6 gap-2">
          {chords.map((chord) => (
            <button
              key={chord}
              className={`p-2 rounded-md text-sm ${currentChord === chord ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-black/60 border border-gray-700'} hover:bg-cyan-500/10 transition-colors duration-150`}
              onClick={() => handleChordChange(chord)}
            >
              {chord}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-4 bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-gray-800/30">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="text-gray-400"
          >
            <Music className="h-4 w-4" />
          </Button>
        </div>
        <TrainingToggle />
      </div>
    </div>
  );
};