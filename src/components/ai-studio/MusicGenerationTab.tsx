
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenerationForm } from './music-generation/GenerationForm';
import { LyricsForm } from './music-generation/LyricsForm';
import { ExtensionForm } from './music-generation/ExtensionForm';
import { Persona } from '@/types/persona';

interface MusicGenerationTabProps {
  persona?: Persona;
}

export function MusicGenerationTab({ persona }: MusicGenerationTabProps) {
  return (
    <Card className="bg-black/20 border-dreamaker-purple/20">
      <CardContent className="p-6">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger
              value="generate"
              className="rounded-full border border-dreamaker-purple/30 px-4 data-[state=active]:bg-dreamaker-purple data-[state=active]:text-white data-[state=inactive]:bg-transparent"
            >
              Generate Music
            </TabsTrigger>
            <TabsTrigger
              value="lyrics"
              className="rounded-full border border-dreamaker-purple/30 px-4 data-[state=active]:bg-dreamaker-purple data-[state=active]:text-white data-[state=inactive]:bg-transparent"
            >
              Generate Lyrics
            </TabsTrigger>
            <TabsTrigger
              value="extend"
              className="rounded-full border border-dreamaker-purple/30 px-4 data-[state=active]:bg-dreamaker-purple data-[state=active]:text-white data-[state=inactive]:bg-transparent"
            >
              Extend Music
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <GenerationForm persona={persona} />
          </TabsContent>

          <TabsContent value="lyrics">
            <LyricsForm persona={persona} />
          </TabsContent>

          <TabsContent value="extend">
            <ExtensionForm persona={persona} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
