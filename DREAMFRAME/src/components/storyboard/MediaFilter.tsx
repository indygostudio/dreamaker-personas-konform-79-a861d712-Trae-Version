
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Tags, 
  Tag, 
  X, 
  FolderIcon,
  SlidersHorizontal,
  Clock
} from "lucide-react";
import { 
  extractUniqueTags, 
  extractUniqueCategories 
} from "@/utils/mediaSearchUtils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaSearchParams, ProjectMedia } from "@/types/storyboardTypes";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

interface MediaFilterProps {
  mediaItems: ProjectMedia[];
  onFilterChange: (searchParams: MediaSearchParams) => void;
}

const MediaFilter: React.FC<MediaFilterProps> = ({ 
  mediaItems, 
  onFilterChange 
}) => {
  // Initialize search params
  const [searchParams, setSearchParams] = useState<MediaSearchParams>({
    query: "",
    type: "all",
    tags: [],
    favorites: false,
    sortBy: "dateAdded",
    sortDirection: "desc"
  });
  
  // Get available tags and categories
  const availableTags = extractUniqueTags(mediaItems);
  const availableCategories = extractUniqueCategories(mediaItems);
  
  // Advanced filter visibility
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Apply filters when search params change
  useEffect(() => {
    onFilterChange(searchParams);
  }, [searchParams, onFilterChange]);
  
  // Update search query
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => ({ ...prev, query: e.target.value }));
  };
  
  // Update media type filter
  const handleTypeChange = (value: string) => {
    setSearchParams(prev => ({ 
      ...prev, 
      type: value as "all" | "image" | "video" | "audio" 
    }));
  };
  
  // Toggle a tag in the filter
  const toggleTag = (tag: string) => {
    setSearchParams(prev => {
      const currentTags = prev.tags || [];
      const newTags = currentTags.includes(tag)
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag];
      
      return { ...prev, tags: newTags };
    });
  };
  
  // Update category filter
  const handleCategoryChange = (value: string) => {
    setSearchParams(prev => ({ 
      ...prev, 
      category: value === "all" ? undefined : value
    }));
  };
  
  // Toggle favorites filter
  const toggleFavorites = (checked: boolean) => {
    setSearchParams(prev => ({ ...prev, favorites: checked }));
  };
  
  // Update sort options
  const handleSortChange = (value: string) => {
    setSearchParams(prev => ({ 
      ...prev, 
      sortBy: value as "dateAdded" | "name" | "type"
    }));
  };
  
  // Toggle sort direction
  const toggleSortDirection = () => {
    setSearchParams(prev => ({ 
      ...prev, 
      sortDirection: prev.sortDirection === "asc" ? "desc" : "asc" 
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchParams({
      query: "",
      type: "all",
      tags: [],
      favorites: false,
      sortBy: "dateAdded",
      sortDirection: "desc"
    });
  };
  
  return (
    <div className="space-y-3 p-2">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search media..."
          value={searchParams.query}
          onChange={handleQueryChange}
          className="pl-8"
        />
      </div>
      
      {/* Basic Filters */}
      <div className="flex flex-wrap gap-2">
        <Select
          value={searchParams.type}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue placeholder="Media Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={searchParams.sortBy || "dateAdded"}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dateAdded">Date Added</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="type">Type</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="sm"
          className="h-8"
          onClick={toggleSortDirection}
        >
          {searchParams.sortDirection === "asc" ? "Ascending" : "Descending"}
        </Button>
      </div>
      
      {/* Advanced Filters */}
      <Collapsible
        open={showAdvanced}
        onOpenChange={setShowAdvanced}
        className="border rounded-md p-2"
      >
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full flex justify-between items-center p-2 text-xs"
          >
            <span className="flex items-center">
              <SlidersHorizontal className="mr-2 h-3 w-3" />
              Advanced Filters
            </span>
            <span>{showAdvanced ? "Hide" : "Show"}</span>
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-3 pt-2">
          {/* Favorites */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="favorites" 
              checked={searchParams.favorites}
              onCheckedChange={toggleFavorites}
            />
            <Label htmlFor="favorites" className="text-sm">
              Favorites Only
            </Label>
          </div>
          
          {/* Categories */}
          {availableCategories.length > 0 && (
            <div className="space-y-1">
              <Label className="text-xs flex items-center">
                <FolderIcon className="h-3 w-3 mr-1" /> Categories
              </Label>
              <Select
                value={searchParams.category || "all"}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {availableCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Tags */}
          {availableTags.length > 0 && (
            <div className="space-y-1">
              <Label className="text-xs flex items-center">
                <Tags className="h-3 w-3 mr-1" /> Tags
              </Label>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1">
                {availableTags.map(tag => {
                  const isSelected = searchParams.tags?.includes(tag);
                  return (
                    <Badge
                      key={tag}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      {isSelected && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Clear Filters */}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="w-full text-xs"
          >
            Clear All Filters
          </Button>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Active Filters Display */}
      {(searchParams.query || 
        searchParams.type !== "all" || 
        (searchParams.tags && searchParams.tags.length > 0) || 
        searchParams.category || 
        searchParams.favorites) && (
        <div className="flex flex-wrap gap-1 text-xs">
          <span className="text-muted-foreground py-1">Active filters:</span>
          
          {searchParams.query && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              {searchParams.query}
              <X
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSearchParams(prev => ({ ...prev, query: "" }))}
              />
            </Badge>
          )}
          
          {searchParams.type !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Type: {searchParams.type}
              <X
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSearchParams(prev => ({ ...prev, type: "all" }))}
              />
            </Badge>
          )}
          
          {searchParams.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <FolderIcon className="h-3 w-3" />
              {searchParams.category}
              <X
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSearchParams(prev => ({ ...prev, category: undefined }))}
              />
            </Badge>
          )}
          
          {searchParams.favorites && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Favorites
              <X
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSearchParams(prev => ({ ...prev, favorites: false }))}
              />
            </Badge>
          )}
          
          {searchParams.tags && searchParams.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {tag}
              <X
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaFilter;
