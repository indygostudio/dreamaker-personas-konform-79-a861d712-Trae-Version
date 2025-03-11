import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Image, Video, Music, FileText, Mic, User } from "lucide-react";
import { piapiService } from '@/services/piapiService';
import { toast } from 'sonner';

interface GenerationHistoryProps {
  personaId?: string;
}

export function GenerationHistory({ personaId }: GenerationHistoryProps) {
  const [activeTab, setActiveTab] = useState('image');
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory(activeTab);
  }, [activeTab]);

  const loadHistory = async (type: string) => {
    setIsLoading(true);
    try {
      const historyData = await piapiService.getGenerationHistory(type);
      setHistory(historyData || []);
    } catch (error) {
      console.error(`Error loading ${type} history:`, error);
      toast.error(`Failed to load ${type} history`);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'music': return <Music className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      case 'voice': return <Mic className="h-4 w-4" />;
      case 'avatar': return <User className="h-4 w-4" />;
      default: return <Image className="h-4 w-4" />;
    }
  };

  const renderHistoryContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-dreamaker-purple" />
        </div>
      );
    }

    if (history.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>No {activeTab} generation history found</p>
          <Button variant="outline" className="mt-4">
            Generate New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </Button>
        </div>
      );
    }

    if (activeTab === 'image') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {history.map(item => (
            <div key={item.id} className="aspect-square rounded-lg overflow-hidden bg-black/20">
              <img src={item.output_url} alt={item.prompt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'video') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {history.map(item => (
            <div key={item.id} className="aspect-video rounded-lg overflow-hidden bg-black/20">
              <video src={item.output_url} controls className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {history.map(item => (
          <Card key={item.id} className="bg-black/20 border-dreamaker-purple/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(activeTab)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{item.prompt}</p>
                  <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</p>
                  {(activeTab === 'music' || activeTab === 'voice') && item.output_url && (
                    <audio src={item.output_url} controls className="mt-2 w-full" />
                  )}
                  {activeTab === 'avatar' && item.output_url && (
                    <img src={item.output_url} alt={item.prompt} className="mt-2 w-20 h-20 rounded-full object-cover" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-black/20 border-dreamaker-purple/20">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Generation History</h3>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 gap-2 w-full mb-6">
            <TabsTrigger
              value="image"
              className="rounded-full border border-dreamaker-purple/30 px-4 data-[state=active]:bg-dreamaker-purple data-[state=active]:text-white data-[state=inactive]:bg-transparent"
            >
              Image
            </TabsTrigger>
            <TabsTrigger
              value="video"
              className="rounded-full border border-dreamaker-purple/30 px-4 data-[state=active]:bg-dreamaker-purple data-[state=active]:text-white data-[state=inactive]:bg-transparent"
            >
              Video
            </TabsTrigger>
            <TabsTrigger
              value="music"
              className="rounded-full border border-dreamaker-purple/30 px-4 data-[state=active]:bg-dreamaker-purple data-[state=active]:text-white data-[state=inactive]:bg-transparent"
            >
              Music
            </TabsTrigger>
            <TabsTrigger
              value="text"
              className="rounded-full border border-dreamaker-purple/30 px-4 data-[state=active]:bg-dreamaker-purple data-[state=active]:text-white data-[state=inactive]:bg-transparent"
            >
              Text
            </TabsTrigger>
            <TabsTrigger
              value="voice"
              className="rounded-full border border-dreamaker-purple/30 px-4 data-[state=active]:bg-dreamaker-purple data-[state=active]:text-white data-[state=inactive]:bg-transparent"
            >
              Voice
            </TabsTrigger>
            <TabsTrigger
              value="avatar"
              className="rounded-full border border-dreamaker-purple/30 px-4 data-[state=active]:bg-dreamaker-purple data-[state=active]:text-white data-[state=inactive]:bg-transparent"
            >
              Avatar
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {renderHistoryContent()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
