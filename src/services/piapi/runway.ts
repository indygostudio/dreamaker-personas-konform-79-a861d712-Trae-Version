
import { GenerationResult, RunwayImageToVideoParams, GenerationStatus } from "./types";

export const runwayService = {
  async generateVideoFromImage(params: RunwayImageToVideoParams): Promise<GenerationResult> {
    try {
      // Simulate API call with a delayed response
      console.log("Generating video from image with Runway API", params);
      
      // For demo purposes, return a mock successful response after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        status: 'complete',
        video_url: 'https://example.com/video.mp4',
        task_id: 'runway-' + Math.random().toString(36).substring(2, 15),
      };
    } catch (error) {
      console.error("Error generating video with Runway:", error);
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
  
  async checkTaskStatus(taskId: string): Promise<GenerationResult> {
    try {
      // Simulate API call to check task status
      console.log("Checking Runway task status:", taskId);
      
      // For demo purposes, return a mock successful response
      return {
        status: 'complete',
        video_url: 'https://example.com/video.mp4',
        task_id: taskId,
      };
    } catch (error) {
      console.error("Error checking Runway task status:", error);
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
  
  // Track generation progress based on task status and time elapsed
  async getGenerationProgress(taskId: string): Promise<number> {
    try {
      const result = await this.checkTaskStatus(taskId);
      
      if (result.status === 'complete') return 100;
      if (result.status === 'failed') return 0;
      
      // Get task start time from taskId timestamp
      const taskTimestamp = parseInt(taskId.split('-')[1], 36);
      const elapsedTime = Date.now() - taskTimestamp;
      const estimatedDuration = 30000; // Estimated 30s for generation
      
      // Calculate progress based on elapsed time
      const progress = Math.min(95, (elapsedTime / estimatedDuration) * 100);
      return Math.floor(progress);
    } catch (error) {
      console.error('Error getting generation progress:', error);
      return 0;
    }
  }
};
