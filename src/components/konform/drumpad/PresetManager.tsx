import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, List } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface PresetManagerProps {
  currentPattern: any[];
  onLoadPreset: (pattern: any[]) => void;
}

export const PresetManager = ({ currentPattern, onLoadPreset }: PresetManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [presets, setPresets] = useState<any[]>([]);
  const { toast } = useToast();
  const { session } = useAuth();

  const loadPresets = async () => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('drum_machine_presets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading presets:', error);
      return;
    }

    setPresets(data || []);
  };

  const savePreset = async () => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to save presets",
        variant: "destructive",
      });
      return;
    }

    if (!presetName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a preset name",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('drum_machine_presets')
      .insert({
        name: presetName,
        pattern: currentPattern,
        user_id: session.user.id
      });

    if (error) {
      console.error('Error saving preset:', error);
      toast({
        title: "Error",
        description: "Failed to save preset",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Preset saved successfully",
    });
    
    setPresetName("");
    loadPresets();
  };

  const handleLoadPreset = (pattern: any[]) => {
    onLoadPreset(pattern);
    setIsOpen(false);
    toast({
      title: "Success",
      description: "Preset loaded successfully",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => {
            loadPresets();
            setIsOpen(true);
          }}
          className="hover:bg-konform-neon-blue/10"
        >
          <List className="h-4 w-4 text-konform-neon-blue" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1A1A1A] border-konform-neon-blue/30">
        <DialogHeader>
          <DialogTitle className="text-white">Drum Machine Presets</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="bg-black/40 border-konform-neon-blue/30 text-white"
            />
            <Button 
              onClick={savePreset}
              className="bg-konform-neon-blue/20 hover:bg-konform-neon-blue/30 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
          <div className="space-y-2">
            {presets.map((preset) => (
              <Button
                key={preset.id}
                variant="ghost"
                className="w-full justify-start hover:bg-konform-neon-blue/10 text-white"
                onClick={() => handleLoadPreset(preset.pattern)}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};