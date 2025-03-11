// Export all services
export * from './types';
export * from './core';
export * from './midjourney';
export * from './music';
export * from './media';
export * from './faceswap';

// Re-export the MusicModel type for forms
export type { MusicModel } from './types';

// Import the services
import { coreService } from './core';
import { midjourneyService } from './midjourney';
import { musicService } from './music';
import { mediaService } from './media';
import { faceSwapService } from './faceswap';

// Create a composite service object with all methods flattened
// This allows direct access like piapiService.generateImage instead of piapiService.media.generateImage
export const piapiService = {
  ...coreService,
  ...mediaService,
  ...musicService,
  faceSwap: faceSwapService,
  // Keep the original namespaced services for organization when needed
  midjourney: midjourneyService,
  music: musicService,
  media: mediaService
};
