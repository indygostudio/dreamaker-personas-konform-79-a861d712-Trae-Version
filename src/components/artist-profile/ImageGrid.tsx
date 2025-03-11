
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AIImage, ImageFilters } from "@/types/ai-image";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, Heart, Layers, X, Bookmark, EyeOff, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ImageGridProps {
  personaId?: string;
  onImageSelect: (image: AIImage) => void;
}

export const ImageGrid = ({ personaId, onImageSelect }: ImageGridProps) => {
  const [images, setImages] = useState<AIImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ImageFilters>({
    searchTerm: "",
    sortBy: "newest",
    type: "all",
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchImages();
    }
  }, [user, personaId, filters]);

  const fetchImages = async () => {
    setIsLoading(true);

    try {
      // Start building the query
      let query = supabase.from('ai_images').select('*');

      // Apply persona filter if provided
      if (personaId) {
        query = query.eq('persona_id', personaId);
      }

      // Apply search filter if provided
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,prompt.ilike.%${filters.searchTerm}%`);
      }

      // Apply other filters
      if (filters.isLiked === true) {
        query = query.eq('is_liked', true);
      }

      if (filters.isHidden === true) {
        query = query.eq('is_hidden', true);
      }

      if (filters.tags && filters.tags.length > 0) {
        // This assumes tags are stored as an array in Postgres
        query = query.contains('tags', filters.tags);
      }

      // Apply sorting
      if (filters.sortBy === "newest") {
        query = query.order('created_at', { ascending: false });
      } else if (filters.sortBy === "oldest") {
        query = query.order('created_at', { ascending: true });
      } else if (filters.sortBy === "popular") {
        query = query.order('rating', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to match AIImage interface
      const formattedImages: AIImage[] = data?.map(img => ({
        ...img,
        metadata: img.metadata ? (typeof img.metadata === 'string' ? JSON.parse(img.metadata) : img.metadata) : {},
      })) || [];

      setImages(formattedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load images");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = async (image: AIImage) => {
    try {
      const updatedImage = { ...image, is_liked: !image.is_liked };
      
      const { error } = await supabase
        .from('ai_images')
        .update({ is_liked: updatedImage.is_liked })
        .eq('id', image.id);

      if (error) throw error;

      setImages(images.map(img => img.id === image.id ? updatedImage : img));
      toast.success(updatedImage.is_liked ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Failed to update image");
    }
  };

  const toggleHidden = async (image: AIImage) => {
    try {
      const updatedImage = { ...image, is_hidden: !image.is_hidden };
      
      const { error } = await supabase
        .from('ai_images')
        .update({ is_hidden: updatedImage.is_hidden })
        .eq('id', image.id);

      if (error) throw error;

      setImages(images.map(img => img.id === image.id ? updatedImage : img));
      toast.success(updatedImage.is_hidden ? "Image hidden" : "Image unhidden");
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Failed to update image");
    }
  };

  const applyFilter = (type: string, value: any) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);

    // Update active filters list for display
    const activeFiltersList = Object.entries(newFilters)
      .filter(([key, val]) => {
        if (key === 'searchTerm' && val) return true;
        if (key === 'isLiked' && val === true) return true;
        if (key === 'isHidden' && val === true) return true;
        if (key === 'tags' && val && Array.isArray(val) && val.length > 0) return true;
        if (key === 'sortBy' && val !== 'newest') return true;
        if (key === 'type' && val !== 'all') return true;
        if (key === 'ratio' && val) return true;
        if (key === 'size' && val) return true;
        return false;
      })
      .map(([key]) => key);

    setActiveFilters(activeFiltersList);
  };

  const clearFilter = (type: string) => {
    const newFilters = { ...filters };
    if (type === 'searchTerm') newFilters.searchTerm = '';
    if (type === 'isLiked') newFilters.isLiked = undefined;
    if (type === 'isHidden') newFilters.isHidden = undefined;
    if (type === 'tags') newFilters.tags = undefined;
    if (type === 'sortBy') newFilters.sortBy = 'newest';
    if (type === 'type') newFilters.type = 'all';
    if (type === 'ratio') newFilters.ratio = undefined;
    if (type === 'size') newFilters.size = undefined;
    setFilters(newFilters);

    // Update active filters list
    setActiveFilters(activeFilters.filter(filter => filter !== type));
  };

  const clearAllFilters = () => {
    setFilters({
      searchTerm: "",
      sortBy: "newest",
      type: "all",
    });
    setActiveFilters([]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search images..."
            value={filters.searchTerm || ''}
            onChange={(e) => applyFilter('searchTerm', e.target.value)}
            className="pl-10 bg-black/30 border-dreamaker-purple/30"
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="border-dreamaker-purple/30 hover:bg-dreamaker-purple/10 relative"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFilters.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-dreamaker-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-black/90 border-dreamaker-purple/30 text-white">
            <SheetHeader>
              <SheetTitle className="text-white">Filters</SheetTitle>
              <SheetDescription className="text-gray-400">
                Refine your image search results
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-400 block mb-1">Sort By</label>
                <Select
                  value={filters.sortBy || 'newest'}
                  onValueChange={(value) => applyFilter('sortBy', value)}
                >
                  <SelectTrigger className="bg-black/30 border-dreamaker-purple/30">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-400 block mb-1">Image Type</label>
                <Select
                  value={filters.type || 'all'}
                  onValueChange={(value) => applyFilter('type', value)}
                >
                  <SelectTrigger className="bg-black/30 border-dreamaker-purple/30">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Images</SelectItem>
                    <SelectItem value="generated">AI Generated</SelectItem>
                    <SelectItem value="uploaded">Uploaded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-400 block mb-1">Aspect Ratio</label>
                <Select
                  value={filters.ratio || ''}
                  onValueChange={(value) => applyFilter('ratio', value)}
                >
                  <SelectTrigger className="bg-black/30 border-dreamaker-purple/30">
                    <SelectValue placeholder="Any ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Ratio</SelectItem>
                    <SelectItem value="1:1">Square (1:1)</SelectItem>
                    <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                    <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                    <SelectItem value="4:3">Standard (4:3)</SelectItem>
                    <SelectItem value="3:4">Portrait (3:4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className={`flex-1 ${filters.isLiked ? 'bg-dreamaker-purple text-white' : 'border-dreamaker-purple/30'}`}
                  onClick={() => applyFilter('isLiked', !filters.isLiked)}
                >
                  <Heart className={`h-4 w-4 mr-2 ${filters.isLiked ? 'fill-white' : ''}`} />
                  Favorites
                </Button>
                <Button
                  variant="outline"
                  className={`flex-1 ${filters.isHidden ? 'bg-dreamaker-purple text-white' : 'border-dreamaker-purple/30'}`}
                  onClick={() => applyFilter('isHidden', !filters.isHidden)}
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hidden
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6 border-t border-dreamaker-purple/20 pt-4">
              <Button
                variant="ghost"
                onClick={clearAllFilters}
                disabled={activeFilters.length === 0}
                className="text-gray-400"
              >
                Clear all
              </Button>
              <Button className="bg-dreamaker-purple">Apply Filters</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map(filter => (
            <Badge 
              key={filter} 
              variant="outline"
              className="bg-dreamaker-purple/10 text-white border-dreamaker-purple/30"
            >
              {filter === 'searchTerm' ? 'Search' : 
               filter === 'isLiked' ? 'Favorites' :
               filter === 'isHidden' ? 'Hidden' :
               filter === 'sortBy' ? 'Sort' :
               filter === 'type' ? 'Type' :
               filter === 'ratio' ? 'Ratio' :
               filter === 'size' ? 'Size' :
               filter === 'tags' ? 'Tags' : filter}
              <button 
                className="ml-1 hover:bg-dreamaker-purple/20 rounded-full p-0.5"
                onClick={() => clearFilter(filter)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-gray-400 h-6 px-2"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-dreamaker-purple/10 rounded-lg"></div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-dreamaker-purple/20 rounded-lg">
          <Layers className="w-12 h-12 mx-auto text-dreamaker-purple/40" />
          <h3 className="mt-4 text-lg font-medium">No images found</h3>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or create a new image</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div 
              key={image.id} 
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-black/30" 
              onClick={() => onImageSelect(image)}
            >
              <img
                src={image.thumbnail_url || image.image_url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <div className="flex justify-between items-end">
                    <p className="text-white text-sm line-clamp-2 mr-2">{image.title}</p>
                    <div className="flex space-x-1">
                      <button 
                        className={`p-1.5 rounded-full ${image.is_liked ? 'bg-dreamaker-purple' : 'bg-black/50 hover:bg-black/70'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(image);
                        }}
                      >
                        <Heart className={`h-3.5 w-3.5 ${image.is_liked ? 'fill-white text-white' : 'text-white'}`} />
                      </button>
                      <button 
                        className={`p-1.5 rounded-full ${image.is_hidden ? 'bg-dreamaker-purple' : 'bg-black/50 hover:bg-black/70'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleHidden(image);
                        }}
                      >
                        <EyeOff className="h-3.5 w-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
