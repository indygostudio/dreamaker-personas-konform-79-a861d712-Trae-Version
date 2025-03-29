// Centralized debug logging utility
// This helps us monitor specific issues without cluttering the console

type LogCategory = 'auth' | 'video' | 'audio' | 'render' | 'general';

interface LogOptions {
  category: LogCategory;
  level?: 'info' | 'warning' | 'error';
  includeTimestamp?: boolean;
}

// Debug flags that can be toggled at runtime
const debugFlags = {
  enabled: true,  // Master toggle
  categories: {
    auth: true,    // Authentication related logs
    video: true,   // Video playback logs
    audio: true,   // Audio playback logs
    render: true,  // UI rendering logs
    general: true  // General application logs
  },
  persistLogs: false, // Whether to save logs for later review
  storedLogs: [] as string[],
  maxStoredLogs: 1000 // Prevent memory issues
};

// Enable from URL with ?debug=true or ?debug=audio,video
const initDebugFromURL = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const debugParam = urlParams.get('debug');
    
    if (debugParam) {
      if (debugParam === 'true' || debugParam === '1') {
        // Enable all debug
        debugFlags.enabled = true;
        Object.keys(debugFlags.categories).forEach(key => {
          debugFlags.categories[key as LogCategory] = true;
        });
      } else if (debugParam === 'false' || debugParam === '0') {
        // Disable all debug
        debugFlags.enabled = false;
      } else {
        // Enable specific categories
        debugFlags.enabled = true;
        // First set all to false
        Object.keys(debugFlags.categories).forEach(key => {
          debugFlags.categories[key as LogCategory] = false;
        });
        // Then enable only specified categories
        const categories = debugParam.split(',');
        categories.forEach(cat => {
          if (cat in debugFlags.categories) {
            debugFlags.categories[cat as LogCategory] = true;
          }
        });
      }
    }
  }
};

// Call this immediately to initialize from URL
initDebugFromURL();

// Main logging function
export const debugLog = (
  message: string, 
  data?: any, 
  options: LogOptions = { category: 'general', level: 'info', includeTimestamp: true }
) => {
  // Skip if debugging is disabled globally or for this category
  if (!debugFlags.enabled || !debugFlags.categories[options.category]) {
    return;
  }
  
  const timestamp = options.includeTimestamp ? new Date().toISOString() : '';
  const prefix = `[DEBUG:${options.category.toUpperCase()}]${timestamp ? ' ' + timestamp : ''}`;
  
  // Format the log message
  const logMessage = `${prefix} ${message}`;
  
  // Log to console based on level
  switch (options.level) {
    case 'warning':
      console.warn(logMessage, data || '');
      break;
    case 'error':
      console.error(logMessage, data || '');
      break;
    default:
      console.log(logMessage, data || '');
  }
  
  // Store logs if persistence is enabled
  if (debugFlags.persistLogs) {
    debugFlags.storedLogs.push(`${logMessage} ${data ? JSON.stringify(data) : ''}`);
    // Trim logs if needed
    if (debugFlags.storedLogs.length > debugFlags.maxStoredLogs) {
      debugFlags.storedLogs = debugFlags.storedLogs.slice(-debugFlags.maxStoredLogs);
    }
  }
};

// Toggle debug for a specific category
export const toggleDebugCategory = (category: LogCategory, enabled: boolean) => {
  debugFlags.categories[category] = enabled;
};

// Toggle all debugging
export const toggleDebug = (enabled: boolean) => {
  debugFlags.enabled = enabled;
};

// Helper function to download stored logs
export const downloadDebugLogs = () => {
  if (!debugFlags.persistLogs || debugFlags.storedLogs.length === 0) {
    console.warn('No logs to download or log persistence is disabled');
    return;
  }
  
  const logsText = debugFlags.storedLogs.join('\n');
  const blob = new Blob([logsText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `app-debug-logs-${new Date().toISOString()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Clear stored logs
export const clearDebugLogs = () => {
  debugFlags.storedLogs = [];
};

// Monitoring helper that checks for media element conflicts
export const checkMediaInterferences = () => {
  if (!debugFlags.enabled) return;
  
  const audioElements = document.querySelectorAll('audio');
  const videoElements = document.querySelectorAll('video');
  
  // Find active elements
  const activeAudio = Array.from(audioElements).filter(audio => !audio.paused);
  const activeVideo = Array.from(videoElements).filter(video => !video.paused);
  
  if (activeAudio.length > 0 && activeVideo.length > 0) {
    debugLog(
      'Potential media conflict detected', 
      {
        activeAudioCount: activeAudio.length,
        activeVideoCount: activeVideo.length,
        audioIds: activeAudio.map(a => a.id || 'unnamed'),
        videoIds: activeVideo.map(v => v.id || 'unnamed')
      },
      { category: 'audio', level: 'warning' }
    );
  }
  
  return {
    audioCount: audioElements.length,
    videoCount: videoElements.length,
    activeAudioCount: activeAudio.length,
    activeVideoCount: activeVideo.length
  };
};

// Helper for monitoring auth issues
export const logAuthState = (session: any) => {
  debugLog(
    'Auth state update', 
    {
      sessionExists: !!session,
      sessionType: session ? typeof session : 'null/undefined',
      isNull: session === null,
      isUndefined: session === undefined,
      timestamp: new Date().toISOString()
    },
    { category: 'auth' }
  );
};

// Create a listener for Web Audio context suspensions
export const monitorAudioContexts = () => {
  if (typeof window === 'undefined') return;
  
  // This is a known browser limitation where audio contexts can be suspended
  const audioContexts = (window as any).audioContexts || [];
  
  if (audioContexts.length > 0) {
    audioContexts.forEach((ctx: any, i: number) => {
      if (ctx.state === 'suspended') {
        debugLog(
          'Audio context suspended', 
          { contextIndex: i, state: ctx.state },
          { category: 'audio', level: 'warning' }
        );
        
        // Try to resume the context
        ctx.resume().catch((e: any) => {
          debugLog(
            'Failed to resume audio context', 
            { error: e.message },
            { category: 'audio', level: 'error' }
          );
        });
      }
    });
  }
};

// Set up interval checking for common issues
export let monitoringInterval: number | null = null;

export const startMonitoring = (intervalMs: number = 2000) => {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
  }
  
  monitoringInterval = window.setInterval(() => {
    checkMediaInterferences();
    monitorAudioContexts();
  }, intervalMs);
  
  debugLog('Debug monitoring started', { intervalMs }, { category: 'general' });
  
  return () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      monitoringInterval = null;
    }
  };
};

// Stop the monitoring
export const stopMonitoring = () => {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
    debugLog('Debug monitoring stopped', {}, { category: 'general' });
  }
};
