
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextGenerationTab } from './TextGenerationTab';
import { ImageGenerationTab } from './ImageGenerationTab';
import { VoiceGenerationTab } from './VoiceGenerationTab';
import { VideoGenerationTab } from './VideoGenerationTab';
import { AvatarGenerationTab } from './AvatarGenerationTab';
import { MusicGenerationTab } from './MusicGenerationTab';
import { GenerationHistory } from './GenerationHistory';
import { useSession } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';

interface AIStudioTabsProps {
  persona: any;
}

export default function AIStudioTabs({ persona }: AIStudioTabsProps) {
  const [selectedTab, setSelectedTab] = useState("text");
  const session = useSession();
  
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <h2 className="text-2xl font-bold text-white">Sign in to access AI Studio</h2>
        <Button variant="outline">Sign In</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="text" 
        className="w-full"
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <TabsList className="grid w-full grid-cols-7 rounded-xl glass-panel p-1">
          <TabsTrigger 
            value="text" 
            className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
            text-white/80 data-[state=active]:bg-[#ea384c]/10 data-[state=active]:text-white data-[state=active]:border-[#ea384c]/20 data-[state=active]:shadow-[0_4px_20px_rgba(234,56,76,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#ea384c]/10 hover:text-white hover:border-[#ea384c]/20 hover:shadow-[0_4px_20px_rgba(234,56,76,0.3)] hover:-translate-y-0.5"
          >
            Text
          </TabsTrigger>
          
          <TabsTrigger 
            value="voice" 
            className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
            text-white/80 data-[state=active]:bg-[#ea384c]/10 data-[state=active]:text-white data-[state=active]:border-[#ea384c]/20 data-[state=active]:shadow-[0_4px_20px_rgba(234,56,76,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#ea384c]/10 hover:text-white hover:border-[#ea384c]/20 hover:shadow-[0_4px_20px_rgba(234,56,76,0.3)] hover:-translate-y-0.5"
          >
            Voice
          </TabsTrigger>
          
          <TabsTrigger 
            value="music" 
            className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
            text-white/80 data-[state=active]:bg-[#ea384c]/10 data-[state=active]:text-white data-[state=active]:border-[#ea384c]/20 data-[state=active]:shadow-[0_4px_20px_rgba(234,56,76,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#ea384c]/10 hover:text-white hover:border-[#ea384c]/20 hover:shadow-[0_4px_20px_rgba(234,56,76,0.3)] hover:-translate-y-0.5"
          >
            Music
          </TabsTrigger>
          
          <TabsTrigger 
            value="image" 
            className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
            text-white/80 data-[state=active]:bg-[#ea384c]/10 data-[state=active]:text-white data-[state=active]:border-[#ea384c]/20 data-[state=active]:shadow-[0_4px_20px_rgba(234,56,76,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#ea384c]/10 hover:text-white hover:border-[#ea384c]/20 hover:shadow-[0_4px_20px_rgba(234,56,76,0.3)] hover:-translate-y-0.5"
          >
            Image
          </TabsTrigger>
          
          <TabsTrigger 
            value="video" 
            className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
            text-white/80 data-[state=active]:bg-[#ea384c]/10 data-[state=active]:text-white data-[state=active]:border-[#ea384c]/20 data-[state=active]:shadow-[0_4px_20px_rgba(234,56,76,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#ea384c]/10 hover:text-white hover:border-[#ea384c]/20 hover:shadow-[0_4px_20px_rgba(234,56,76,0.3)] hover:-translate-y-0.5"
          >
            Video
          </TabsTrigger>
          
          <TabsTrigger 
            value="avatar" 
            className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
            text-white/80 data-[state=active]:bg-[#ea384c]/10 data-[state=active]:text-white data-[state=active]:border-[#ea384c]/20 data-[state=active]:shadow-[0_4px_20px_rgba(234,56,76,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#ea384c]/10 hover:text-white hover:border-[#ea384c]/20 hover:shadow-[0_4px_20px_rgba(234,56,76,0.3)] hover:-translate-y-0.5"
          >
            Avatar
          </TabsTrigger>
          
          <TabsTrigger 
            value="history" 
            className="px-6 py-3 rounded-full transition-all duration-300 font-medium uppercase border 
            text-white/80 data-[state=active]:bg-[#ea384c]/10 data-[state=active]:text-white data-[state=active]:border-[#ea384c]/20 data-[state=active]:shadow-[0_4px_20px_rgba(234,56,76,0.3)] data-[state=active]:-translate-y-0.5 bg-black/20 border-white/10 hover:bg-[#ea384c]/10 hover:text-white hover:border-[#ea384c]/20 hover:shadow-[0_4px_20px_rgba(234,56,76,0.3)] hover:-translate-y-0.5"
          >
            History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="mt-6">
          <TextGenerationTab persona={persona} />
        </TabsContent>
        
        <TabsContent value="voice" className="mt-6">
          <VoiceGenerationTab persona={persona} />
        </TabsContent>
        
        <TabsContent value="music" className="mt-6">
          <MusicGenerationTab />
        </TabsContent>
        
        <TabsContent value="image" className="mt-6">
          <ImageGenerationTab persona={persona} />
        </TabsContent>
        
        <TabsContent value="video" className="mt-6">
          <VideoGenerationTab persona={persona} />
        </TabsContent>
        
        <TabsContent value="avatar" className="mt-6">
          <AvatarGenerationTab persona={persona} />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <GenerationHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
