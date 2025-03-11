
import { supabase } from "@/integrations/supabase/client";
import { musicService } from "./piapi/music";
import { coreService } from "./piapi/core";
import { faceSwapService } from "./piapi/faceswap";
import { mediaService } from "./piapi/media";
import { runwayService } from "./piapi/runway";
import { midjourneyService } from "./piapi/midjourney";

// Unified service for all PI-API related functions
export const piapiService = {
  ...musicService,
  ...coreService,
  ...faceSwapService,
  ...mediaService,
  ...runwayService,
  
  // Expose both the namespaced and direct access to midjourney methods
  midjourney: midjourneyService,
  generateMidjourneyImage: midjourneyService.generateImage,
  blendMidjourneyImages: midjourneyService.blendImages,
  checkMidjourneyTaskStatus: midjourneyService.checkTaskStatus,
};
