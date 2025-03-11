import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dice3 } from "lucide-react";
import { toast } from "sonner";
import { KonformBanner } from "./KonformBanner";
import { useHeaderStore } from "./store/headerStore";
import { TransportControls } from "./TransportControls";

const LyricCreator = () => {
  const { lyricsHeaderCollapsed, setLyricsHeaderCollapsed } = useHeaderStore();
  const [lyrics, setLyrics] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Pop");

  const genres = ["Pop", "Rock", "EDM", "R&B", "Hip Hop", "Disco"];

  const handleRandomPrompt = () => {
    const prompts = [
      "A laid-back, romantic song about a late-night conversation with someone special.",
      "A heartfelt, emotional song about missing someone deeply",
      "A dreamy, romantic song about neon lights, where time stands still and every moment feels unforgettable.",
      "Powerful anthem with strong vocals and uplifting beats, about conquering challenges together, facing the unknown hand in hand."
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setLyrics(randomPrompt);
  };

  const handleCreate = () => {
    if (!songTitle.trim() || !lyrics.trim()) {
      toast("Please enter both a song title and lyrics", {
        description: "Both fields are required to create lyrics",
      });
      return;
    }
    // TODO: Implement lyrics creation logic
    toast("Lyrics created successfully!", {
      description: "Your lyrics have been saved",
    });
  };

  return (
    <div className="flex-1 bg-[#131415] flex flex-col">
      <KonformBanner 
        title="Lyric Creator" 
        description="Create and edit lyrics for your songs with AI assistance"
        isCollapsed={lyricsHeaderCollapsed}
        onCollapsedChange={setLyricsHeaderCollapsed}
      />
      
      <div className="p-6 flex-1">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-[400px] grid-cols-2 bg-[#1A1A1A]">
            <TabsTrigger value="basic" className="data-[state=active]:bg-[#2A2A2A]">Basic</TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-[#2A2A2A]">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="mt-6">
              <Input
                placeholder="Enter the song title"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                className="bg-[#1A1A1A] border-[#2A2A2A] text-white"
              />
              <Button
                variant="outline"
                size="icon"
                className="ml-2 bg-[#1A1A1A] hover:bg-[#2A2A2A]"
                onClick={handleRandomPrompt}
              >
                <Dice3 className="h-4 w-4" />
              </Button>
            </div>

            <Textarea
              placeholder="Enter lyrics here"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              className="min-h-[300px] bg-[#1A1A1A] border-[#2A2A2A] text-white"
            />

            <div className="flex gap-2 overflow-x-auto py-4">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  onClick={() => setSelectedGenre(genre)}
                  className={selectedGenre === genre ? "bg-[#00D1FF] text-black" : "bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white"}
                >
                  {genre}
                </Button>
              ))}
            </div>

            <Button 
              onClick={handleCreate}
              className="w-full bg-gradient-to-r from-[#00D1FF] to-[#0EA5E9] hover:opacity-90"
            >
              Create
            </Button>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-6 rounded-lg bg-[#1A1A1A]">
                <h3 className="text-lg font-semibold text-white">Reference</h3>
                <p className="text-gray-400">Create songs inspired by a reference track</p>
                <Button variant="outline" className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A]">
                  Select Track
                </Button>
              </div>

              <div className="space-y-4 p-6 rounded-lg bg-[#1A1A1A]">
                <h3 className="text-lg font-semibold text-white">Vocal</h3>
                <p className="text-gray-400">Sing your song with any voice you like</p>
                <Button variant="outline" className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A]">
                  Choose Voice
                </Button>
              </div>

              <div className="space-y-4 p-6 rounded-lg bg-[#1A1A1A]">
                <h3 className="text-lg font-semibold text-white">Description</h3>
                <p className="text-gray-400">Describe the music style you're aiming for</p>
                <Textarea 
                  placeholder="Enter description"
                  className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                />
              </div>

              <div className="space-y-4 p-6 rounded-lg bg-[#1A1A1A]">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Melody ideas</h3>
                  <span className="px-2 py-1 text-xs bg-yellow-400 text-black rounded">Pro plan</span>
                </div>
                <p className="text-gray-400">Record a melody idea to kickstart your song</p>
                <Button variant="outline" className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A]" disabled>
                  Record Melody
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="sticky bottom-0 bg-black/40 backdrop-blur-xl border-t border-konform-neon-blue/20">
        <TransportControls />
      </div>
    </div>
  );
};

export default LyricCreator;
