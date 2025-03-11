
// Utility for handling voice model storage in SessionStorage until database is set up

// Type for voice model data
export interface VoiceModelData {
  id?: string;
  user_id: string;
  persona_id?: string;
  name: string;
  audio_url: string;
  prompt: string;
  created_at: string;
}

// Prefix for sessionStorage keys
const STORAGE_KEY = 'dreamaker_voice_models';

export const voiceModelStorage = {
  // Save voice model data to sessionStorage
  saveVoiceModel: (modelData: VoiceModelData): VoiceModelData => {
    // Generate ID if not provided
    if (!modelData.id) {
      modelData.id = 'voice_' + Date.now().toString();
    }
    
    // Set creation timestamp if not provided
    if (!modelData.created_at) {
      modelData.created_at = new Date().toISOString();
    }
    
    // Get existing models
    const existingModels = voiceModelStorage.getVoiceModels();
    
    // Add new model
    existingModels.push(modelData);
    
    // Save to sessionStorage
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existingModels));
    
    return modelData;
  },
  
  // Get all voice models
  getVoiceModels: (): VoiceModelData[] => {
    const storedData = sessionStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  },
  
  // Get voice models for a specific user
  getUserVoiceModels: (userId: string): VoiceModelData[] => {
    return voiceModelStorage.getVoiceModels().filter(model => model.user_id === userId);
  },
  
  // Get a specific voice model by ID
  getVoiceModelById: (modelId: string): VoiceModelData | undefined => {
    return voiceModelStorage.getVoiceModels().find(model => model.id === modelId);
  },
  
  // Delete a voice model
  deleteVoiceModel: (modelId: string): boolean => {
    const models = voiceModelStorage.getVoiceModels();
    const filteredModels = models.filter(model => model.id !== modelId);
    
    if (filteredModels.length < models.length) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filteredModels));
      return true;
    }
    
    return false;
  }
};
