
// Utility for handling avatar storage in SessionStorage until database is set up

// Type for avatar data
export interface AvatarData {
  id?: string;
  user_id: string;
  persona_id?: string;
  model_url: string;
  name: string;
  prompt: string;
  created_at: string;
}

// Prefix for sessionStorage keys
const STORAGE_KEY = 'dreamaker_avatars';

export const avatarStorage = {
  // Save avatar data to sessionStorage
  saveAvatar: (avatarData: AvatarData): AvatarData => {
    // Generate ID if not provided
    if (!avatarData.id) {
      avatarData.id = 'avatar_' + Date.now().toString();
    }
    
    // Set creation timestamp if not provided
    if (!avatarData.created_at) {
      avatarData.created_at = new Date().toISOString();
    }
    
    // Get existing avatars
    const existingAvatars = avatarStorage.getAvatars();
    
    // Add new avatar
    existingAvatars.push(avatarData);
    
    // Save to sessionStorage
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existingAvatars));
    
    return avatarData;
  },
  
  // Get all avatars
  getAvatars: (): AvatarData[] => {
    const storedData = sessionStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  },
  
  // Get avatars for a specific user
  getUserAvatars: (userId: string): AvatarData[] => {
    return avatarStorage.getAvatars().filter(avatar => avatar.user_id === userId);
  },
  
  // Get a specific avatar by ID
  getAvatarById: (avatarId: string): AvatarData | undefined => {
    return avatarStorage.getAvatars().find(avatar => avatar.id === avatarId);
  },
  
  // Delete an avatar
  deleteAvatar: (avatarId: string): boolean => {
    const avatars = avatarStorage.getAvatars();
    const filteredAvatars = avatars.filter(avatar => avatar.id !== avatarId);
    
    if (filteredAvatars.length < avatars.length) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filteredAvatars));
      return true;
    }
    
    return false;
  }
};
