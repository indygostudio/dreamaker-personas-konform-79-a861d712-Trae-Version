import { useState } from 'react';

interface PianoKeyboardProps {
  onNoteOn?: (note: number) => void;
  onNoteOff?: (note: number) => void;
}

export const PianoKeyboard = ({ onNoteOn, onNoteOff }: PianoKeyboardProps) => {
  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());

  // Generate 88 keys (from A0 to C8)
  const totalKeys = 88;
  const startNote = 21; // A0 MIDI note number

  const isBlackKey = (noteNumber: number) => {
    const noteInOctave = (noteNumber - startNote) % 12;
    return [1, 3, 6, 8, 10].includes(noteInOctave);
  };

  const handleMouseDown = (noteNumber: number) => {
    setActiveKeys(prev => new Set(prev).add(noteNumber));
    onNoteOn?.(noteNumber);
  };

  const handleMouseUp = (noteNumber: number) => {
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(noteNumber);
      return newSet;
    });
    onNoteOff?.(noteNumber);
  };

  const handleMouseLeave = (noteNumber: number) => {
    if (activeKeys.has(noteNumber)) {
      handleMouseUp(noteNumber);
    }
  };

  return (
    <div className="relative w-full h-full flex">
      {/* White keys container */}
      <div className="relative flex-1 flex">
        {Array.from({ length: totalKeys }).map((_, index) => {
          const noteNumber = startNote + index;
          const isBlack = isBlackKey(noteNumber);
          if (!isBlack) {
            return (
              <div
                key={noteNumber}
                className={`flex-1 h-full border-r border-konform-neon-blue/30 bg-black/40 hover:bg-black/60 transition-colors relative ${activeKeys.has(noteNumber) ? 'bg-konform-neon-blue/30' : ''}`}
                onMouseDown={() => handleMouseDown(noteNumber)}
                onMouseUp={() => handleMouseUp(noteNumber)}
                onMouseLeave={() => handleMouseLeave(noteNumber)}
              />
            );
          }
          return null;
        })}
      </div>

      {/* Black keys container */}
      <div className="absolute top-0 left-0 right-0 h-[60%] flex">
        {Array.from({ length: totalKeys }).map((_, index) => {
          const noteNumber = startNote + index;
          const isBlack = isBlackKey(noteNumber);
          if (isBlack) {
            // Calculate position based on previous white keys
            const whiteKeyWidth = 100 / 52; // 52 white keys total
            const whiteKeysBeforeThis = Array.from({ length: index })
              .filter((_, i) => !isBlackKey(startNote + i))
              .length;
            const offsetPercentage = (whiteKeysBeforeThis * whiteKeyWidth) - (whiteKeyWidth * 0.3);

            return (
              <div
                key={noteNumber}
                className={`absolute w-[1.2%] h-full bg-[#1A1A1A] hover:bg-[#2A2A2A] transition-colors ${activeKeys.has(noteNumber) ? 'bg-konform-neon-blue/50' : ''}`}
                style={{ left: `${offsetPercentage}%` }}
                onMouseDown={() => handleMouseDown(noteNumber)}
                onMouseUp={() => handleMouseUp(noteNumber)}
                onMouseLeave={() => handleMouseLeave(noteNumber)}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};