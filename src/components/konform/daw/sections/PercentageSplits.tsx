import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PieChart, Percent, Users, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PersonaType } from "@/types/persona";

interface PercentageSplitsProps {
  sessionId: string;
}

interface PersonaWithSplit {
  id: string;
  name: string;
  type: PersonaType;
  avatar_url?: string;
  user_id: string;
  creator_name?: string;
  percentage: number;
}

const PERSONA_TYPE_LABELS: Record<PersonaType, string> = {
  "AI_WRITER": "Writer",
  "AI_VOCALIST": "Vocalist",
  "AI_INSTRUMENTALIST": "Instrumentalist",
  "AI_CHARACTER": "Character",
  "AI_EFFECT": "Effect",
  "AI_SOUND": "Sound",
  "AI_MIXER": "Mixer"
};

const PERSONA_TYPE_ORDER: PersonaType[] = [
  "AI_WRITER",
  "AI_VOCALIST",
  "AI_INSTRUMENTALIST",
  "AI_CHARACTER",
  "AI_EFFECT",
  "AI_SOUND",
  "AI_MIXER"
];

export const PercentageSplits = ({ sessionId }: PercentageSplitsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAutoSplit, setIsAutoSplit] = useState(true);
  const [personasWithSplits, setPersonasWithSplits] = useState<PersonaWithSplit[]>([]);
  
  // Fetch session data including personas
  const { data: session, isLoading } = useQuery({
    queryKey: ['collaboration_session_splits', sessionId],
    queryFn: async () => {
      const { data: sessionData, error: sessionError } = await supabase
        .from('collaboration_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (sessionError) throw sessionError;

      if (sessionData?.personas?.length) {
        const { data: personasData, error: personasError } = await supabase
          .from('personas')
          .select('*')
          .in('id', sessionData.personas);

        if (personasError) throw personasError;
        
        return {
          ...sessionData,
          personas: personasData
        };
      }
      
      return sessionData;
    }
  });

  // Initialize personas with splits
  useEffect(() => {
    if (session?.personas) {
      // Check if we have existing percentage splits stored
      const existingSplits = session.style_blend_settings?.percentage_splits || {};
      const isAutoSplitSaved = session.style_blend_settings?.auto_split ?? true;
      setIsAutoSplit(isAutoSplitSaved);
      
      // Map personas with their percentage splits
      const withSplits = session.personas.map((persona: any) => {
        // If we have an existing split for this persona, use it
        // Otherwise calculate an equal split
        const defaultSplit = 100 / session.personas.length;
        const percentage = existingSplits[persona.id] || defaultSplit;
        
        return {
          ...persona,
          percentage
        };
      });
      
      setPersonasWithSplits(withSplits);
    }
  }, [session]);

  // Update a persona's percentage split
  const handlePercentageChange = (personaId: string, value: number[]) => {
    if (isAutoSplit) return; // Don't allow manual changes in auto mode
    
    const newPercentage = value[0];
    
    setPersonasWithSplits(prev => {
      const updated = prev.map(p => {
        if (p.id === personaId) {
          return { ...p, percentage: newPercentage };
        }
        return p;
      });
      
      // Calculate how much we need to adjust other percentages
      const totalPercentage = updated.reduce((sum, p) => sum + p.percentage, 0);
      const diff = totalPercentage - 100;
      
      if (Math.abs(diff) > 0.1) {
        // Distribute the difference among other personas proportionally
        const otherPersonas = updated.filter(p => p.id !== personaId);
        const otherTotal = otherPersonas.reduce((sum, p) => sum + p.percentage, 0);
        
        if (otherTotal > 0) {
          return updated.map(p => {
            if (p.id !== personaId) {
              const adjustmentFactor = p.percentage / otherTotal;
              return {
                ...p,
                percentage: Math.max(0, p.percentage - (diff * adjustmentFactor))
              };
            }
            return p;
          });
        }
      }
      
      return updated;
    });
  };

  // Reset to equal splits
  const handleResetSplits = () => {
    const equalSplit = 100 / personasWithSplits.length;
    setPersonasWithSplits(prev => 
      prev.map(p => ({ ...p, percentage: equalSplit }))
    );
  };

  // Save the percentage splits
  const saveSplits = useMutation({
    mutationFn: async () => {
      // Create a record of percentage splits by persona ID
      const percentageSplits = personasWithSplits.reduce((acc, persona) => {
        acc[persona.id] = persona.percentage;
        return acc;
      }, {} as Record<string, number>);
      
      // Update the session with the new splits
      const { error } = await supabase
        .from('collaboration_sessions')
        .update({
          style_blend_settings: {
            ...session?.style_blend_settings,
            percentage_splits: percentageSplits,
            auto_split: isAutoSplit
          }
        })
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaboration_session_splits', sessionId] });
      toast({
        title: "Splits Saved",
        description: "Percentage splits have been updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error saving splits:', error);
      toast({
        title: "Error",
        description: "Failed to save percentage splits",
        variant: "destructive",
      });
    }
  });

  // Group personas by creator
  const personasByCreator = personasWithSplits.reduce((acc, persona) => {
    const creatorName = persona.creator_name || 'Unknown Creator';
    if (!acc[creatorName]) {
      acc[creatorName] = [];
    }
    acc[creatorName].push(persona);
    return acc;
  }, {} as Record<string, PersonaWithSplit[]>);

  // Get sorted list of creators
  const creatorNames = Object.keys(personasByCreator).sort();

  // Calculate total percentage for each creator
  const creatorPercentages = creatorNames.reduce((acc, creator) => {
    const personas = personasByCreator[creator];
    acc[creator] = personas.reduce((sum, p) => sum + p.percentage, 0);
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <Card className="bg-black/40">
        <CardHeader className="space-y-1">
          <CardTitle className="text-md flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Percentage Splits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            Loading percentage splits...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Percentage Splits
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="auto-split" 
                checked={isAutoSplit}
                onCheckedChange={setIsAutoSplit}
              />
              <Label htmlFor="auto-split">Auto Split</Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetSplits}
              disabled={isAutoSplit}
              className="text-gray-400 hover:text-white"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Reset
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => saveSplits.mutate()}
              className="bg-dreamaker-purple hover:bg-dreamaker-purple/90"
            >
              Save Splits
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!personasWithSplits.length ? (
          <div className="text-sm text-gray-400">
            No collaborators added yet
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary view with progress bars */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-200">Summary by Creator</h3>
              {creatorNames.map(creator => {
                const percentage = creatorPercentages[creator];
                if (percentage <= 0) return null;
                
                return (
                  <div key={creator}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{creator}</span>
                      <span className="text-white">{percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
            
            <Separator className="bg-gray-700/50" />
            
            {/* Detailed view with sliders for each persona */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-200">Individual Splits</h3>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-black/30">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {creatorNames.map(creator => {
                    if (personasByCreator[creator].length === 0) return null;
                    return (
                      <TabsTrigger key={creator} value={creator}>
                        {creator}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                
                <TabsContent value="all" className="mt-4 space-y-4">
                  {personasWithSplits.map(persona => (
                    <div key={persona.id} className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={persona.avatar_url} />
                        <AvatarFallback>{persona.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <div>
                            <p className="text-sm font-medium text-white truncate">{persona.name}</p>
                            <p className="text-xs text-gray-400">
                              {PERSONA_TYPE_LABELS[persona.type]} • {persona.creator_name || 'Unknown Creator'}
                            </p>
                          </div>
                          <span className="text-sm text-white">{persona.percentage.toFixed(1)}%</span>
                        </div>
                        <Slider
                          value={[persona.percentage]}
                          onValueChange={(value) => handlePercentageChange(persona.id, value)}
                          max={100}
                          step={0.1}
                          disabled={isAutoSplit}
                          className="[&_[role=slider]]:bg-konform-neon-blue"
                        />
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                {creatorNames.map(creator => {
                  if (personasByCreator[creator].length === 0) return null;
                  
                  return (
                    <TabsContent key={creator} value={creator} className="mt-4 space-y-4">
                      {personasByCreator[creator].map(persona => (
                        <div key={persona.id} className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={persona.avatar_url} />
                            <AvatarFallback>{persona.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <div>
                                <p className="text-sm font-medium text-white truncate">{persona.name}</p>
                                <p className="text-xs text-gray-400">{PERSONA_TYPE_LABELS[persona.type]}</p>
                              </div>
                              <span className="text-sm text-white">{persona.percentage.toFixed(1)}%</span>
                            </div>
                            <Slider
                              value={[persona.percentage]}
                              onValueChange={(value) => handlePercentageChange(persona.id, value)}
                              max={100}
                              step={0.1}
                              disabled={isAutoSplit}
                              className="[&_[role=slider]]:bg-konform-neon-blue"
                            />
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};