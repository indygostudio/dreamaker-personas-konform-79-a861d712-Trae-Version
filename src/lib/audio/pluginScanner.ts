
import { supabase } from "@/integrations/supabase/client";
import { nativeBridge } from "./nativeBridge";

export interface Plugin {
  id: string;
  name: string;
  path: string;
  format: 'vst' | 'au';
  version?: string;
  vendor?: string;
  category?: string;
  isInstrument: boolean;
  isEffect: boolean;
  supportsMidi: boolean;
}

export interface PluginPreset {
  id: string;
  name: string;
  pluginId: string;
  settings: Record<string, any>;
}

export const scanPlugins = async (): Promise<Plugin[]> => {
  try {
    // Get scan folders from database
    const { data: scanFolders, error: foldersError } = await supabase
      .from('plugin_scan_folders')
      .select('*')
      .eq('enabled', true);
    
    if (foldersError) {
      console.error('Error fetching scan folders:', foldersError);
      throw new Error(`Failed to fetch scan folders: ${foldersError.message}`);
    }

    if (!scanFolders || scanFolders.length === 0) {
      console.warn('No scan folders configured or enabled');
      return [];
    }

    // Start native scan
    const paths = scanFolders.map(folder => folder.path);
    try {
      nativeBridge.sendMessage({
        type: 'scan_plugins',
        paths
      });
    } catch (bridgeError) {
      console.error('Native bridge error:', bridgeError);
      throw new Error('Failed to communicate with native plugin scanner');
    }

    // Get cached plugin info from database
    const { data: cachedPlugins, error } = await supabase
      .from('plugin_scan_info')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching plugin info:', error);
      throw new Error(`Failed to fetch plugin information: ${error.message}`);
    }

    return (cachedPlugins || []).map(plugin => ({
      id: plugin.id,
      name: plugin.name,
      path: plugin.path,
      format: plugin.format as 'vst' | 'au',
      version: plugin.version,
      vendor: plugin.vendor,
      category: plugin.category,
      isInstrument: plugin.is_instrument,
      isEffect: plugin.is_effect,
      supportsMidi: plugin.supports_midi
    }));
  } catch (err) {
    console.error('Error scanning plugins:', err);
    return [];
  }
};

export const loadPlugin = async (plugin: Plugin): Promise<boolean> => {
  try {
    // First try loading through native bridge
    const nativeResult = await nativeBridge.loadPlugin(plugin.path, plugin.format);
    if (nativeResult) {
      // Update last scan timestamp
      await supabase
        .from('plugin_scan_info')
        .update({ last_scan: new Date().toISOString() })
        .eq('id', plugin.id);
      
      return true;
    }

    throw new Error('Failed to load plugin through native bridge');
  } catch (err) {
    console.error('Error loading plugin:', err);
    return false;
  }
};

export const savePluginPreset = async (
  pluginId: string,
  name: string,
  settings: Record<string, any>
): Promise<PluginPreset | null> => {
  try {
    const { data, error } = await supabase
      .from('plugin_presets')
      .insert({
        plugin_id: pluginId,
        name,
        settings: settings
      })
      .select()
      .single();
    
    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      pluginId: data.plugin_id,
      settings: data.settings as Record<string, any>
    };
  } catch (err) {
    console.error('Error saving preset:', err);
    return null;
  }
};

export const loadPluginPresets = async (pluginId: string): Promise<PluginPreset[]> => {
  try {
    const { data, error } = await supabase
      .from('plugin_presets')
      .select('*')
      .eq('plugin_id', pluginId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;

    return data.map(preset => ({
      id: preset.id,
      name: preset.name,
      pluginId: preset.plugin_id,
      settings: preset.settings as Record<string, any>
    }));
  } catch (err) {
    console.error('Error loading presets:', err);
    return [];
  }
};

