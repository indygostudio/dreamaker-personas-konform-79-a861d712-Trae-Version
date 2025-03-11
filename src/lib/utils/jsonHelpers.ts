
export const safeJsonParse = <T>(jsonString: any, defaultValue: T): T => {
  try {
    if (typeof jsonString === 'string') {
      return JSON.parse(jsonString) as T;
    } else if (jsonString && typeof jsonString === 'object') {
      return jsonString as T;
    }
    return defaultValue;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return defaultValue;
  }
};
