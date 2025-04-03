export const saveToLocalStorage = (key: string, data: any): boolean => {
  try {
    const serializedData = JSON.stringify(data);
    
    const size = new Blob([serializedData]).size;
    
    if (size > 4.5 * 1024 * 1024) {
      console.warn(`Data size (${(size / (1024 * 1024)).toFixed(2)}MB) is too large for localStorage`);
      return false;
    }
    
    localStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
    return false;
  }
};

export const loadFromLocalStorage = (key: string): any | null => {
  try {
    const serializedData = localStorage.getItem(key);
    return serializedData ? JSON.parse(serializedData) : null;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return null;
  }
};