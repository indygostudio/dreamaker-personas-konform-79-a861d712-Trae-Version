
import { ProjectMedia, MediaSearchParams } from "../types/storyboardTypes";

/**
 * Filter media items based on search parameters
 */
export const filterMediaItems = (
  mediaItems: ProjectMedia[],
  searchParams: MediaSearchParams
): ProjectMedia[] => {
  if (!mediaItems || mediaItems.length === 0) {
    return [];
  }

  let filteredItems = [...mediaItems];

  // Filter by text query
  if (searchParams.query) {
    const query = searchParams.query.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.description?.toLowerCase().includes(query) || 
      item.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Filter by media type
  if (searchParams.type && searchParams.type !== 'all') {
    filteredItems = filteredItems.filter(item => item.type === searchParams.type);
  }

  // Filter by tags
  if (searchParams.tags && searchParams.tags.length > 0) {
    filteredItems = filteredItems.filter(item => 
      item.tags && searchParams.tags?.some(tag => item.tags?.includes(tag))
    );
  }

  // Filter by category
  if (searchParams.category) {
    filteredItems = filteredItems.filter(item => 
      item.category === searchParams.category
    );
  }

  // Filter favorites
  if (searchParams.favorites) {
    filteredItems = filteredItems.filter(item => item.favorite);
  }

  // Filter by date range
  if (searchParams.dateRange) {
    if (searchParams.dateRange.start) {
      filteredItems = filteredItems.filter(item => 
        item.dateAdded >= searchParams.dateRange!.start!
      );
    }
    if (searchParams.dateRange.end) {
      filteredItems = filteredItems.filter(item => 
        item.dateAdded <= searchParams.dateRange!.end!
      );
    }
  }

  // Sort results
  if (searchParams.sortBy) {
    filteredItems.sort((a, b) => {
      const direction = searchParams.sortDirection === 'desc' ? -1 : 1;
      
      switch(searchParams.sortBy) {
        case 'name':
          return direction * a.name.localeCompare(b.name);
        case 'type':
          return direction * a.type.localeCompare(b.type);
        case 'dateAdded':
        default:
          return direction * (a.dateAdded.getTime() - b.dateAdded.getTime());
      }
    });
  }

  return filteredItems;
};

/**
 * Extract unique tags from media items
 */
export const extractUniqueTags = (mediaItems: ProjectMedia[]): string[] => {
  const tagsSet = new Set<string>();
  
  mediaItems.forEach(item => {
    if (item.tags && item.tags.length > 0) {
      item.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  
  return Array.from(tagsSet).sort();
};

/**
 * Extract unique categories from media items
 */
export const extractUniqueCategories = (mediaItems: ProjectMedia[]): string[] => {
  const categoriesSet = new Set<string>();
  
  mediaItems.forEach(item => {
    if (item.category) {
      categoriesSet.add(item.category);
    }
  });
  
  return Array.from(categoriesSet).sort();
};

/**
 * Generate tag suggestions based on image/video content or prompts
 */
export const generateTagSuggestions = (prompt: string): string[] => {
  // Extract keywords from the prompt
  const words = prompt.toLowerCase().split(/\s+/);
  
  // Filter out common words, prepositions, etc.
  const commonWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'as', 'of', 'by', 'that', 'this', 'these', 'those'
  ]);
  
  // Extract potential tags
  const potentialTags = words.filter(word => 
    word.length > 3 && !commonWords.has(word)
  );
  
  // Remove duplicates and limit to 5 tags
  return Array.from(new Set(potentialTags)).slice(0, 5);
};

/**
 * Suggest a category based on media content or prompt
 */
export const suggestCategory = (prompt: string): string => {
  const lowercasePrompt = prompt.toLowerCase();
  
  // Define category keywords
  const categoryKeywords: Record<string, string[]> = {
    'Nature': ['nature', 'landscape', 'mountain', 'ocean', 'forest', 'tree', 'river', 'sky', 'sunset'],
    'People': ['person', 'people', 'portrait', 'human', 'face', 'character', 'woman', 'man', 'child'],
    'Abstract': ['abstract', 'pattern', 'texture', 'geometric', 'surreal', 'dream', 'fantasy'],
    'Urban': ['city', 'building', 'architecture', 'street', 'urban', 'skyline'],
    'Animals': ['animal', 'pet', 'dog', 'cat', 'bird', 'wildlife', 'creature'],
    'Technology': ['technology', 'device', 'machine', 'robot', 'futuristic', 'cyber', 'digital'],
    'Art': ['art', 'painting', 'drawing', 'illustration', 'artistic', 'style', 'composition']
  };
  
  // Find a matching category
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowercasePrompt.includes(keyword))) {
      return category;
    }
  }
  
  // Default category if no match
  return 'Miscellaneous';
};
