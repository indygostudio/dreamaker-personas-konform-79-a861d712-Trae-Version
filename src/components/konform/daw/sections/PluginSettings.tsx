
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scanPlugins, type Plugin } from "@/lib/audio/pluginScanner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ScanFolder {
  id: string;
  path: string;
  format: 'vst' | 'au';
  enabled: boolean;
}

export const PluginSettings = () => {
  const [newPath, setNewPath] = useState('');
  const [newFormat, setNewFormat] = useState<'vst' | 'au'>('vst');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: plugins, isLoading: isLoadingPlugins } = useQuery({
    queryKey: ['plugins'],
    queryFn: async () => {
      const plugins = await scanPlugins();
      return plugins;
    }
  });

  const { data: scanFolders, isLoading: isLoadingFolders } = useQuery({
    queryKey: ['plugin-scan-folders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plugin_scan_folders')
        .select('*')
        .order('created_at');
      
      if (error) throw error;
      return data as ScanFolder[];
    }
  });

  const addFolderMutation = useMutation({
    mutationFn: async (folder: { path: string; format: 'vst' | 'au' }) => {
      const { error } = await supabase
        .from('plugin_scan_folders')
        .insert([{ 
          ...folder,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugin-scan-folders'] });
      toast({
        title: "Folder added",
        description: "Plugin scan folder has been added successfully"
      });
      setNewPath('');
    },
    onError: (error) => {
      toast({
        title: "Error adding folder",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteFolderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('plugin_scan_folders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugin-scan-folders'] });
      toast({
        title: "Folder removed",
        description: "Plugin scan folder has been removed successfully"
      });
    }
  });

  const handleAddFolder = () => {
    if (!newPath) return;
    addFolderMutation.mutate({ path: newPath, format: newFormat });
  };

  return (
    <CollapsibleContent>
      <div className="space-y-6">
        {/* Scan Folders Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Scan Folders</h3>
          
          <div className="flex gap-2">
            <Input 
              placeholder="Add plugin folder path..." 
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
            />
            <select 
              className="bg-black/40 border border-gray-600 rounded px-2"
              value={newFormat}
              onChange={(e) => setNewFormat(e.target.value as 'vst' | 'au')}
            >
              <option value="vst">VST</option>
              <option value="au">AU</option>
            </select>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleAddFolder}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-[100px] rounded-md border p-4">
            {isLoadingFolders ? (
              <div className="text-gray-400">Loading folders...</div>
            ) : !scanFolders?.length ? (
              <div className="text-gray-400">No scan folders configured</div>
            ) : (
              <div className="space-y-2">
                {scanFolders?.map((folder) => (
                  <div 
                    key={folder.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-black/40"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {folder.format.toUpperCase()}
                      </span>
                      <span className="text-sm">{folder.path}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteFolderMutation.mutate(folder.id)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Plugin List Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Virtual Instruments</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['plugins'] })}
            >
              Rescan Plugins
            </Button>
          </div>

          <ScrollArea className="h-[200px] rounded-md border p-4">
            {isLoadingPlugins ? (
              <div className="text-gray-400">Scanning plugins...</div>
            ) : !plugins?.length ? (
              <div className="text-gray-400">No plugins found</div>
            ) : (
              <div className="space-y-2">
                {plugins?.map((plugin) => (
                  <div 
                    key={plugin.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-black/60"
                  >
                    <div>
                      <p className="font-medium">{plugin.name}</p>
                      <p className="text-sm text-gray-400">{plugin.path}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {plugin.isInstrument && (
                        <span className="text-xs bg-konform-neon-blue/20 text-konform-neon-blue px-2 py-1 rounded">
                          Instrument
                        </span>
                      )}
                      {plugin.supportsMidi && (
                        <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                          MIDI
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </CollapsibleContent>
  );
};
