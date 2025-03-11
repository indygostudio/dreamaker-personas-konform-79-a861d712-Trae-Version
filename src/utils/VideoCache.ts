
/**
 * A utility for caching and preloading video elements to improve performance
 * when navigating between pages with video content.
 */

type CachedVideo = {
  el: HTMLVideoElement;
  lastAccessed: number;
  src: string;
  loaded: boolean;
};

class VideoCache {
  private cache: Map<string, CachedVideo> = new Map();
  private maxCacheSize: number = 10;
  private preloadQueue: string[] = [];
  private isPreloading: boolean = false;
  private preloadBatchSize: number = 3;
  
  /**
   * Get a video element from cache or create a new one
   */
  public getVideo(src: string): HTMLVideoElement {
    const now = Date.now();
    
    // If video exists in cache, update last accessed time and return
    if (this.cache.has(src)) {
      const cached = this.cache.get(src)!;
      cached.lastAccessed = now;
      return cached.el;
    }
    
    // Create new video element
    const videoEl = document.createElement('video');
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.crossOrigin = "anonymous";
    videoEl.preload = "metadata";
    
    // Add to cache
    this.cache.set(src, {
      el: videoEl,
      lastAccessed: now,
      src,
      loaded: false
    });
    
    // Load the video
    this.loadVideo(src);
    
    // Clean cache if needed
    this.cleanCacheIfNeeded();
    
    return videoEl;
  }
  
  /**
   * Preload a batch of videos in order of priority
   */
  public preloadVideos(srcs: string[]): void {
    // Filter out already cached videos
    const newSrcs = srcs.filter(src => !this.cache.has(src) || !this.cache.get(src)!.loaded);
    
    // Add to preload queue
    this.preloadQueue = [...newSrcs, ...this.preloadQueue.filter(src => !newSrcs.includes(src))];
    
    // Start preloading if not already doing so
    if (!this.isPreloading) {
      this.preloadNextBatch();
    }
  }
  
  /**
   * Preload the next batch of videos in the queue
   */
  private preloadNextBatch(): void {
    if (this.preloadQueue.length === 0) {
      this.isPreloading = false;
      return;
    }
    
    this.isPreloading = true;
    
    // Take next batch from queue
    const batch = this.preloadQueue.splice(0, this.preloadBatchSize);
    
    // Preload each video in batch
    const promises = batch.map(src => this.loadVideo(src));
    
    // When batch is done, load next batch
    Promise.all(promises).then(() => {
      setTimeout(() => this.preloadNextBatch(), 100);
    });
  }
  
  /**
   * Load a single video and return a promise
   */
  private loadVideo(src: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.cache.has(src)) {
        resolve();
        return;
      }
      
      const cached = this.cache.get(src)!;
      
      if (cached.loaded) {
        resolve();
        return;
      }
      
      const videoEl = cached.el;
      videoEl.src = src;
      
      const onLoaded = () => {
        if (this.cache.has(src)) {
          this.cache.get(src)!.loaded = true;
        }
        videoEl.removeEventListener('loadeddata', onLoaded);
        resolve();
      };
      
      const onError = () => {
        console.error(`Failed to load video: ${src}`);
        videoEl.removeEventListener('error', onError);
        resolve();
      };
      
      videoEl.addEventListener('loadeddata', onLoaded);
      videoEl.addEventListener('error', onError);
    });
  }
  
  /**
   * Clean the least recently used videos if cache exceeds max size
   */
  private cleanCacheIfNeeded(): void {
    if (this.cache.size <= this.maxCacheSize) {
      return;
    }
    
    // Convert map to array and sort by last accessed time
    const videos = Array.from(this.cache.entries())
      .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
    
    // Remove oldest videos until we're under the limit
    const toRemove = videos.slice(0, this.cache.size - this.maxCacheSize);
    toRemove.forEach(([src, cached]) => {
      cached.el.src = '';
      cached.el.load(); // Force unload
      this.cache.delete(src);
    });
  }
  
  /**
   * Clear the entire cache
   */
  public clearCache(): void {
    this.cache.forEach(cached => {
      cached.el.src = '';
      cached.el.load(); // Force unload
    });
    this.cache.clear();
    this.preloadQueue = [];
    this.isPreloading = false;
  }
}

// Create singleton instance
const videoCache = new VideoCache();
export default videoCache;
