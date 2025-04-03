
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Image as ImageIcon, Video, AudioWaveform, Trash2, Heart, Edit, Tag, X } from "lucide-react";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuItem,
  ContextMenuContent,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuSeparator
} from "@/components/ui/context-menu";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MediaFilter from "./MediaFilter";
import { ProjectMedia, MediaSearchParams } from "@/types/storyboardTypes";
import { 
  filterMediaItems, 
  generateTagSuggestions, 
  suggestCategory 
} from "@/utils/mediaSearchUtils";

interface MediaGalleryProps {
  // Any props if needed
}

// Function to get media from localStorage
const getMediaFromStorage = (): ProjectMedia[] => {
  try {
    const media = localStorage.getItem("projectMedia");
    return media ? JSON.parse(media) : [];
  } catch (error) {
    console.error("Error loading media from storage:", error);
    return [];
  }
};

// Function to save media to localStorage
const saveMediaToStorage = (media: ProjectMedia[]) => {
  try {
    localStorage.setItem("projectMedia", JSON.stringify(media));
    return true;
  } catch (error) {
    console.error("Error saving media to storage:", error);
    return false;
  }
};

const MediaGallery: React.FC<MediaGalleryProps> = () => {
  const [activeTab, setActiveTab] = useState("images");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [media, setMedia] = useState<ProjectMedia[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<ProjectMedia[]>([]);
  const [searchParams, setSearchParams] = useState<MediaSearchParams>({
    query: "",
    type: "all",
    sortBy: "dateAdded",
    sortDirection: "desc"
  });
  
  // Media editing
  const [editingMedia, setEditingMedia] = useState<ProjectMedia | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editCategory, setEditCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load media on component mount and when local storage changes
  useEffect(() => {
    const loadMedia = () => {
      setMedia(getMediaFromStorage());
    };

    // Load media initially
    loadMedia();
    
    // Listen for storage events (when other tabs update localStorage)
    window.addEventListener('storage', loadMedia);
    
    return () => {
      window.removeEventListener('storage', loadMedia);
    };
  }, []);
  
  // Apply filters when media or search params change
  useEffect(() => {
    setFilteredMedia(filterMediaItems(media, searchParams));
  }, [media, searchParams]);
  
  // Update filter parameters
  const handleFilterChange = (params: MediaSearchParams) => {
    setSearchParams(params);
  };
  
  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newMedia: ProjectMedia[] = [];
    let processedCount = 0;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const fileType = file.type.split('/')[0];
          const mediaType = fileType === 'image' 
            ? 'image' 
            : fileType === 'video' 
              ? 'video' 
              : fileType === 'audio' 
                ? 'audio' 
                : null;
          
          if (mediaType) {
            // Generate suggested tags and category from the filename
            const suggTags = generateTagSuggestions(file.name);
            const suggCategory = suggestCategory(file.name);
            
            const mediaItem: ProjectMedia = {
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              type: mediaType as "image" | "video" | "audio",
              url: event.target.result as string,
              name: file.name,
              dateAdded: new Date(),
              tags: suggTags,
              category: suggCategory,
              description: "",
              favorite: false
            };
            
            newMedia.push(mediaItem);
            processedCount++;
            
            if (processedCount === files.length) {
              const updatedMedia = [...media, ...newMedia];
              setMedia(updatedMedia);
              const saved = saveMediaToStorage(updatedMedia);
              
              if (saved) {
                // Force storage event to trigger updates in other components
                window.dispatchEvent(new Event('storage'));
                toast.success(`${newMedia.length} files uploaded`);
              } else {
                toast.error("Failed to save media to storage");
              }
            }
          }
        }
      };
      
      reader.readAsDataURL(file);
    });
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Filter media based on the active tab
  const tabFilteredMedia = filteredMedia.filter(item => {
    if (activeTab === "images") return item.type === "image";
    if (activeTab === "videos") return item.type === "video";
    if (activeTab === "audio") return item.type === "audio";
    return true;
  });
  
  const toggleItemSelection = (id: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };
  
  const handleDragStart = (e: React.DragEvent, item: ProjectMedia) => {
    // If multiple items are selected and the dragged item is among them
    if (selectedItems.has(item.id) && selectedItems.size > 1) {
      // Get all selected items
      const selectedMediaItems = media.filter(m => selectedItems.has(m.id));
      
      // Pass the selected items data
      e.dataTransfer.setData(
        "application/json", 
        JSON.stringify({
          type: 'gallery-media',
          mediaType: item.type,
          mediaUrl: item.url,
          mediaItems: selectedMediaItems,
          multipleItems: true
        })
      );
    } else {
      // Single item drag
      e.dataTransfer.setData(
        "application/json", 
        JSON.stringify({
          type: 'gallery-media',
          mediaType: item.type,
          mediaUrl: item.url,
          multipleItems: false
        })
      );
      
      // Clear selection if dragging an unselected item
      if (!selectedItems.has(item.id)) {
        setSelectedItems(new Set());
      }
    }
  };

  // Delete media item
  const handleDeleteMedia = (id: string) => {
    const updatedMedia = media.filter(item => item.id !== id);
    setMedia(updatedMedia);
    const saved = saveMediaToStorage(updatedMedia);
    
    if (saved) {
      // Force storage event to trigger updates in other components
      window.dispatchEvent(new Event('storage'));
      
      // Remove from selection if selected
      if (selectedItems.has(id)) {
        const newSelection = new Set(selectedItems);
        newSelection.delete(id);
        setSelectedItems(newSelection);
      }
      
      toast.success("Media item removed");
    } else {
      toast.error("Failed to remove media item");
    }
  };
  
  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    const updatedMedia = media.map(item => 
      item.id === id ? { ...item, favorite: !item.favorite } : item
    );
    
    setMedia(updatedMedia);
    saveMediaToStorage(updatedMedia);
    window.dispatchEvent(new Event('storage'));
  };
  
  // Open edit dialog
  const openEditDialog = (item: ProjectMedia) => {
    setEditingMedia(item);
    setEditName(item.name);
    setEditDescription(item.description || "");
    setEditTags(item.tags || []);
    setEditCategory(item.category || "");
    setNewTag("");
  };
  
  // Save media edits
  const saveMediaEdits = () => {
    if (!editingMedia) return;
    
    const updatedMedia = media.map(item => 
      item.id === editingMedia.id 
        ? { 
            ...item, 
            name: editName,
            description: editDescription,
            tags: editTags,
            category: editCategory
          } 
        : item
    );
    
    setMedia(updatedMedia);
    saveMediaToStorage(updatedMedia);
    window.dispatchEvent(new Event('storage'));
    
    setEditingMedia(null);
    toast.success("Media details updated");
  };
  
  // Add a new tag
  const addTag = () => {
    if (!newTag.trim()) return;
    
    // Prevent duplicates
    if (!editTags.includes(newTag.trim())) {
      setEditTags([...editTags, newTag.trim()]);
    }
    
    setNewTag("");
  };
  
  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setEditTags(editTags.filter(tag => tag !== tagToRemove));
  };
  
  const renderMediaItems = () => {
    if (tabFilteredMedia.length === 0) {
      const EmptyState = () => {
        let icon = <ImageIcon className="h-10 w-10 mx-auto mb-2 text-gray-500" />;
        let text = "No images found";
        let actionText = "Upload Images";
        
        if (activeTab === "videos") {
          icon = <Video className="h-10 w-10 mx-auto mb-2 text-gray-500" />;
          text = "No videos found";
          actionText = "Upload Videos";
        } else if (activeTab === "audio") {
          icon = <AudioWaveform className="h-10 w-10 mx-auto mb-2 text-gray-500" />;
          text = "No audio files found";
          actionText = "Upload Audio";
        }
        
        return (
          <div className="text-center py-10">
            {icon}
            <p className="text-gray-400">{text}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileUpload}
              className="mt-2"
            >
              {actionText}
            </Button>
          </div>
        );
      };
      
      return <EmptyState />;
    }
    
    if (activeTab === "audio") {
      return (
        <div className="space-y-2">
          {tabFilteredMedia.map(item => (
            <ContextMenu key={item.id}>
              <ContextMenuTrigger>
                <div 
                  className={`media-item bg-runway-input p-2 rounded relative flex items-center cursor-grab ${
                    selectedItems.has(item.id) ? 'ring-2 ring-blue-500' : ''
                  } ${item.favorite ? 'border-l-4 border-yellow-500' : ''}`}
                  onClick={() => toggleItemSelection(item.id)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  <AudioWaveform className="h-8 w-8 mr-2 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate flex items-center">
                      {item.name}
                      {item.favorite && <Heart className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />}
                    </div>
                    {item.description && (
                      <div className="text-xs text-gray-400 truncate">{item.description}</div>
                    )}
                    <audio 
                      src={item.url} 
                      controls
                      className="w-full h-8 mt-1"
                    />
                  </div>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-48 bg-runway-glass backdrop-blur-md border-runway-glass-border">
                <ContextMenuItem 
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleFavorite(item.id)}
                >
                  <Heart className={`h-4 w-4 mr-2 ${item.favorite ? 'fill-yellow-500 text-yellow-500' : ''}`} /> 
                  {item.favorite ? "Remove Favorite" : "Add to Favorites"}
                </ContextMenuItem>
                
                <ContextMenuItem 
                  className="flex items-center cursor-pointer"
                  onClick={() => openEditDialog(item)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit Details
                </ContextMenuItem>
                
                <ContextMenuSeparator />
                
                <ContextMenuItem 
                  className="flex items-center cursor-pointer text-red-500 focus:text-red-500"
                  onClick={() => handleDeleteMedia(item.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      );
    }
    
    // Grid view for images and videos
    return (
      <div className="grid grid-cols-2 gap-2">
        {tabFilteredMedia.map(item => (
          <ContextMenu key={item.id}>
            <ContextMenuTrigger>
              <div 
                className={`media-item relative aspect-video rounded overflow-hidden cursor-grab ${
                  selectedItems.has(item.id) ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => toggleItemSelection(item.id)}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
              >
                {item.type === "image" ? (
                  <img 
                    src={item.url} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video 
                    src={item.url} 
                    className="w-full h-full object-cover"
                    muted
                  />
                )}
                
                {/* Metadata overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1">
                  <div className="text-xs text-white truncate flex items-center justify-between">
                    <span className="truncate">{item.name}</span>
                    {item.favorite && <Heart className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                  </div>
                </div>
                
                {/* Tag indicator */}
                {item.tags && item.tags.length > 0 && (
                  <div className="absolute top-1 right-1">
                    <Tag className="h-3 w-3 text-blue-400" />
                  </div>
                )}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-56 bg-runway-glass backdrop-blur-md border-runway-glass-border">
              <ContextMenuItem 
                className="flex items-center cursor-pointer"
                onClick={() => toggleFavorite(item.id)}
              >
                <Heart className={`h-4 w-4 mr-2 ${item.favorite ? 'fill-yellow-500 text-yellow-500' : ''}`} /> 
                {item.favorite ? "Remove Favorite" : "Add to Favorites"}
              </ContextMenuItem>
              
              <ContextMenuItem 
                className="flex items-center cursor-pointer"
                onClick={() => openEditDialog(item)}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit Details
              </ContextMenuItem>
              
              {/* Tags submenu */}
              {item.tags && item.tags.length > 0 && (
                <ContextMenuSub>
                  <ContextMenuSubTrigger className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" /> Tags
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent className="w-48 bg-runway-glass backdrop-blur-md border-runway-glass-border">
                    {item.tags.map(tag => (
                      <ContextMenuItem key={tag} className="text-xs">
                        {tag}
                      </ContextMenuItem>
                    ))}
                  </ContextMenuSubContent>
                </ContextMenuSub>
              )}
              
              <ContextMenuSeparator />
              
              <ContextMenuItem 
                className="flex items-center cursor-pointer text-red-500 focus:text-red-500"
                onClick={() => handleDeleteMedia(item.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
    );
  };
  
  return (
    <Card className="h-full bg-runway-glass border border-runway-glass-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Media Gallery</span>
          <Button
            variant="runway"
            size="sm"
            onClick={handleFileUpload}
            className="flex items-center gap-1"
          >
            <Upload className="h-4 w-4" /> Upload
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search and filters */}
        <MediaFilter 
          mediaItems={media} 
          onFilterChange={handleFilterChange} 
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4 bg-runway-input">
            <TabsTrigger value="images" className="flex-1">Images</TabsTrigger>
            <TabsTrigger value="videos" className="flex-1">Videos</TabsTrigger>
            <TabsTrigger value="audio" className="flex-1">Audio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="images">
            <ScrollArea className="h-[calc(100vh-680px)] min-h-[200px]">
              {renderMediaItems()}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="videos">
            <ScrollArea className="h-[calc(100vh-680px)] min-h-[200px]">
              {renderMediaItems()}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="audio">
            <ScrollArea className="h-[calc(100vh-680px)] min-h-[200px]">
              {renderMediaItems()}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*,video/*,audio/*"
        multiple 
        onChange={handleFileSelect}
      />
      
      {/* Edit media dialog */}
      {editingMedia && (
        <Dialog open={!!editingMedia} onOpenChange={(open) => !open && setEditingMedia(null)}>
          <DialogContent className="bg-runway-glass backdrop-blur-md border-runway-glass-border">
            <DialogHeader>
              <DialogTitle>Edit Media Details</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="media-name">Name</Label>
                <Input
                  id="media-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="media-description">Description</Label>
                <Input
                  id="media-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add a description..."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="media-category">Category</Label>
                <Input
                  id="media-category"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  placeholder="e.g., Nature, People, Abstract..."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="media-tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="media-tags"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button type="button" onClick={addTag} variant="outline" size="sm">
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {editTags.map(tag => (
                    <div key={tag} className="bg-runway-input rounded-md px-2 py-1 text-xs flex items-center">
                      {tag}
                      <button 
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-gray-400 hover:text-gray-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setEditingMedia(null)} variant="outline">
                Cancel
              </Button>
              <Button onClick={saveMediaEdits} variant="default">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default MediaGallery;
