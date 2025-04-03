
import { ProjectMedia } from "../types/storyboardTypes";

/**
 * Add a tag to a media item
 */
export const addTagToMedia = (
  media: ProjectMedia,
  tag: string
): ProjectMedia => {
  if (!tag.trim()) return media;
  
  const tags = media.tags || [];
  
  // Check if tag already exists
  if (tags.includes(tag.trim())) {
    return media;
  }
  
  return {
    ...media,
    tags: [...tags, tag.trim()]
  };
};

/**
 * Remove a tag from a media item
 */
export const removeTagFromMedia = (
  media: ProjectMedia,
  tag: string
): ProjectMedia => {
  if (!media.tags) return media;
  
  return {
    ...media,
    tags: media.tags.filter(t => t !== tag)
  };
};

/**
 * Set the category for a media item
 */
export const setCategoryForMedia = (
  media: ProjectMedia,
  category: string
): ProjectMedia => {
  return {
    ...media,
    category: category.trim()
  };
};

/**
 * Toggle favorite status for a media item
 */
export const toggleFavoriteMedia = (
  media: ProjectMedia
): ProjectMedia => {
  return {
    ...media,
    favorite: !media.favorite
  };
};

/**
 * Update multiple properties of a media item
 */
export const updateMediaProperties = (
  media: ProjectMedia, 
  updates: Partial<ProjectMedia>
): ProjectMedia => {
  return {
    ...media,
    ...updates
  };
};

/**
 * Apply tags to multiple media items
 */
export const batchAddTag = (
  mediaItems: ProjectMedia[],
  tag: string,
  selectedIds: string[]
): ProjectMedia[] => {
  if (!tag.trim() || selectedIds.length === 0) return mediaItems;
  
  return mediaItems.map(item => {
    if (selectedIds.includes(item.id)) {
      return addTagToMedia(item, tag);
    }
    return item;
  });
};

/**
 * Set category for multiple media items
 */
export const batchSetCategory = (
  mediaItems: ProjectMedia[],
  category: string,
  selectedIds: string[]
): ProjectMedia[] => {
  if (selectedIds.length === 0) return mediaItems;
  
  return mediaItems.map(item => {
    if (selectedIds.includes(item.id)) {
      return setCategoryForMedia(item, category);
    }
    return item;
  });
};
