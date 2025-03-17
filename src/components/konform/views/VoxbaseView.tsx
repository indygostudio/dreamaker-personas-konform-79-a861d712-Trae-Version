
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select } from '@/components/ui/select';
import { Music, Play, Save, Refresh } from 'lucide-react';

type ChordProgression = {
  chords: string[];
  key: string;
  scale: string;
};

export const VoxbaseView = () => {
  const [key, setKey] = useState('C');
  const [scale, setScale] = useState('major');
  const [complexity, setComplexity] = useState(50);
  const [progression, setProgression] = useState<ChordProgression>({
    chords: ['Cmaj7', 'Am7', 'Dm7', 'G7'],
    key: 'C',
    scale: 'major'
  });

  const musicalKeys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];
  const scales = ['major', 'minor', 'dorian', 'mixolydian', 'lydian', 'phrygian', 'locrian'];

  const generateProgression = () => {
    // TODO: Implement actual harmony generation logic
    const newProgression = {
      chords: ['Dmaj7', 'Bm7', 'Em7', 'A7'],
      key,
      scale
    };
    setProgression(newProgression);
  };

  return (
    <div className="min-h-[600px] bg-black/80 backdrop-blur-xl rounded-lg border border-konform-neon-blue/20 overflow-hidden p-6">
      <div className="grid grid-cols-[2fr_1fr] gap-8">
        {/* Main Harmony Display */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Harmony Generator</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-konform-neon-blue/20 text-white hover:bg-konform-neon-blue/10"
                onClick={generateProgression}
              >
                <Refresh className="w-4 h-4 mr-2" />
                Generate
              </Button>
              <Button
                variant="outline"
                className="border-konform-neon-blue/20 text-white hover:bg-konform-neon-blue/10"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Chord Progression Display */}
          <div className="grid grid-cols-4 gap-4">
            {progression.chords.map((chord, index) => (
              <div
                key={index}
                className="aspect-square bg-konform-neon-blue/10 rounded-lg border border-konform-neon-blue/20 flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{chord}</div>
                  <div className="text-sm text-gray-400">Position {index + 1}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Visualization */}
          <div className="h-48 bg-konform-neon-blue/5 rounded-lg border border-konform-neon-blue/20 p-4">
            <div className="flex items-center justify-center h-full text-gray-400">
              <Music className="w-8 h-8 mr-2" />
              Harmony Visualization
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6 bg-black/40 rounded-lg border border-konform-neon-blue/20 p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Parameters</h3>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Key</label>
              <Select
                value={key}
                onValueChange={setKey}
                options={musicalKeys}
                className="w-full bg-black/60 border border-konform-neon-blue/20 rounded text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Scale</label>
              <Select
                value={scale}
                onValueChange={setScale}
                options={scales}
                className="w-full bg-black/60 border border-konform-neon-blue/20 rounded text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Complexity</label>
              <Slider
                value={[complexity]}
                onValueChange={(value) => setComplexity(value[0])}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Simple</span>
                <span>Complex</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Playback</h3>
            <Button
              className="w-full bg-konform-neon-blue hover:bg-konform-neon-blue/80 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Play Progression
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
