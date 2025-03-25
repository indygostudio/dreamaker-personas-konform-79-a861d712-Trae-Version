import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useKonformProject } from '@/hooks/useKonformProject';
import { useAuth } from '@/hooks/use-auth';
import { ChevronDown, Save, Download, Upload, Plus, Edit2, Trash2, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MixerPreset {
  id: string;
  name: string;
  mixer_state: any;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface MixerPresetMenuProps {
  onClose: () => void;
  currentMixerState: any;
  onLoadPreset: (mixerState: any) => void;
}

export const MixerPresetMenu = ({ onClose, currentMixerState, onLoadPreset }: MixerPresetMenuProps) => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [presets, setPresets] = useState<MixerPreset[]>([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('mixer_presets')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading presets:', error);
      return;
    }

    setPresets(data || []);
  };

  const handleSavePreset = async () => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to save presets",
        variant: "destructive"
      });
      return;
    }

    if (!newPresetName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a preset name",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('mixer_presets')
        .insert({
          name: newPresetName,
          mixer_state: currentMixerState,
          user_id: session.user.id
        })
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Mixer preset saved successfully",
      });

      setNewPresetName('');
      setIsCreatingNew(false);
      loadPresets();
    } catch (error) {
      console.error('Error saving preset:', error);
      toast({
        title: "Save Failed",
        description: "Could not save the mixer preset.",
        variant: "destructive"
      });
    }
  };

  const handleRenamePreset = async (presetId: string) => {
    if (!renameValue.trim()) {
      toast({
        title: "Error",
        description: "Please enter a preset name",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('mixer_presets')
        .update({ name: renameValue })
        .eq('id', presetId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Preset renamed successfully",
      });

      setIsRenaming(null);
      setRenameValue('');
      loadPresets();
    } catch (error) {
      console.error('Error renaming preset:', error);
      toast({
        title: "Rename Failed",
        description: "Could not rename the preset.",
        variant: "destructive"
      });
    }
  };

  const handleDeletePreset = async (presetId: string) => {
    try {
      const { error } = await supabase
        .from('mixer_presets')
        .delete()
        .eq('id', presetId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Preset deleted successfully",
      });

      loadPresets();
    } catch (error) {
      console.error('Error deleting preset:', error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the preset.",
        variant: "destructive"
      });
    }
  };

  const handleExportPreset = (preset: MixerPreset) => {
    const dataStr = JSON.stringify(preset.mixer_state);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `${preset.name.replace(/\s+/g, '_')}_mixer_preset.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Success",
      description: "Preset exported successfully",
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportPreset = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== 'string') return;
        
        const mixerState = JSON.parse(content);
        
        if (!session?.user) {
          toast({
            title: "Error",
            description: "You must be logged in to import presets",
            variant: "destructive"
          });
          return;
        }
        
        // Extract preset name from filename
        const fileName = file.name.replace(/\.json$/, '').replace(/_mixer_preset$/, '');
        const presetName = fileName.replace(/_/g, ' ');
        
        const { error } = await supabase
          .from('mixer_presets')
          .insert({
            name: presetName,
            mixer_state: mixerState,
            user_id: session.user.id
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Preset imported successfully",
        });
        
        loadPresets();
      } catch (error) {
        console.error('Error importing preset:', error);
        toast({
          title: "Import Failed",
          description: "Could not import the preset. Invalid file format.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadPreset = (preset: MixerPreset) => {
    onLoadPreset(preset.mixer_state);
    onClose();
    toast({
      title: "Success",
      description: `Loaded preset: ${preset.name}`,
    });
  };

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-[#00FF00]/20 rounded-lg shadow-lg p-4 w-72 z-[100]">
      {isCreatingNew ? (
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium">New Mixer Preset</h3>
          <Input
            placeholder="Preset Name"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            className="bg-black/40 border-[#00FF00]/20 text-white"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsCreatingNew(false)}
              className="text-white/80 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleSavePreset}
              className="bg-[#00FF00]/80 hover:bg-[#00FF00] text-black"
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium">Mixer Presets</h3>
          
          <div className="space-y-2">
            <Button
              variant="default"
              size="sm"
              className="w-full justify-start text-black bg-[#00FF00]/80 hover:bg-[#00FF00]"
              onClick={() => setIsCreatingNew(true)}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Current Settings
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
              onClick={handleImportClick}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Preset
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportPreset}
              accept=".json"
              className="hidden"
            />
          </div>
          
          {presets.length > 0 && (
            <div className="space-y-1">
              <Label className="text-white/60 text-xs">Saved Presets</Label>
              <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                {presets.map((preset) => (
                  <div key={preset.id} className="group relative">
                    {isRenaming === preset.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          className="bg-black/40 border-[#00FF00]/20 text-white text-sm py-1 h-8"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleRenamePreset(preset.id)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-white/60 hover:text-white"
                          onClick={() => handleRenamePreset(preset.id)}
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-white/60 hover:text-white"
                          onClick={() => {
                            setIsRenaming(null);
                            setRenameValue('');
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-white/80 hover:text-white hover:bg-[#00FF00]/10 pr-16"
                          onClick={() => handleLoadPreset(preset)}
                        >
                          {preset.name}
                        </Button>
                        <div className="absolute right-0 hidden group-hover:flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-white/60 hover:text-white"
                            onClick={() => {
                              setIsRenaming(preset.id);
                              setRenameValue(preset.name);
                            }}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-white/60 hover:text-white"
                            onClick={() => handleExportPreset(preset)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-white/60 hover:text-white"
                            onClick={() => handleDeletePreset(preset.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};