
import { useState, useRef, useCallback } from "react";
import { GripVertical, Image, Scissors, Upload, UploadCloud, ImageIcon, Save } from "lucide-react";
import type { Track } from "@/types/track";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrackContextMenu } from "./TrackContextMenu";
import { EditTrackDialog } from "./EditTrackDialog";
import { LyricsEditor } from "./LyricsEditor";
import { TrackContent } from "./TrackContent";
import { TrackLyrics } from "./TrackLyrics";
import { useTrackLyrics } from "./hooks/useTrackLyrics";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";

interface TrackItemProps {
  track: Track;
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackPlay: (track: Track) => void;
  id: string;
  onPlay?: () => void;
  onDeleteTrack?: (trackId: string) => void;
  onUpdateArtwork?: (trackId: string, artworkUrl: string) => void;
  isOwner?: boolean;
}

export const TrackItem = ({ 
  track, 
  currentTrack, 
  isPlaying, 
  onTrackPlay, 
  id, 
  onPlay,
  onDeleteTrack,
  onUpdateArtwork,
  isOwner = false
}: TrackItemProps) => {
  if (!track) return null;
  
  // Using useState with the track as initial value to maintain local state
  const [trackState, setTrackState] = useState<Track>(track);
  const isActive = currentTrack?.id === trackState.id;
  
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isArtworkDialogOpen, setIsArtworkDialogOpen] = useState(false);
  const [newArtworkUrl, setNewArtworkUrl] = useState(trackState.album_artwork_url || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const {
    trackLyrics,
    showLyrics,
    isLyricsEditorOpen,
    setIsLyricsEditorOpen,
    handleLyricsClick,
    handleLyricsSaved
  } = useTrackLyrics(trackState, isActive, isPlaying);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Use onPlay if provided, otherwise fall back to onTrackPlay
  const handleClick = (e: React.MouseEvent) => {
    // Only process click if dialogs are closed
    if (!isEditDialogOpen && !isLyricsEditorOpen && !isArtworkDialogOpen) {
      if (onPlay) {
        onPlay();
      } else {
        onTrackPlay(trackState);
      }
    } else {
      // Prevent click propagation if dialogs are open
      e.stopPropagation();
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteTrack) {
      onDeleteTrack(trackState.id);
    }
  };

  const handleArtworkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNewArtworkUrl(trackState.album_artwork_url || '');
    setLocalPreview(null);
    setSelectedFile(null);
    setShowUrlInput(false);
    setIsArtworkDialogOpen(true);
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateImageFile = (file: File): boolean => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return false;
    }
    
    // Check file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size exceeds 5MB limit (${formatFileSize(file.size)})`);
      return false;
    }
    
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!validateImageFile(file)) return;
    
    setSelectedFile(file);
    setShowUrlInput(false);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    if (!validateImageFile(file)) return;
    
    setSelectedFile(file);
    setShowUrlInput(false);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleUrlClick = () => {
    setShowUrlInput(true);
    setSelectedFile(null);
    setLocalPreview(null);
  };

  const handleArtworkSave = async () => {
    setIsLoading(true);
    try {
      if (selectedFile) {
        // Upload file to Supabase storage
        const fileName = `track_${trackState.id}_${Date.now()}.${selectedFile.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage
          .from('audio-previews')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('audio-previews')
          .getPublicUrl(fileName);

        if (onUpdateArtwork) {
          onUpdateArtwork(trackState.id, publicUrl);
          
          // Update local state immediately for better UX
          setTrackState({
            ...trackState,
            album_artwork_url: publicUrl
          });
        }
      } else if (showUrlInput && newArtworkUrl && onUpdateArtwork) {
        onUpdateArtwork(trackState.id, newArtworkUrl);
        
        // Update local state immediately for better UX
        setTrackState({
          ...trackState,
          album_artwork_url: newArtworkUrl
        });
      }
      
      toast.success("Artwork updated successfully");
      setIsArtworkDialogOpen(false);
      // Reset state
      setSelectedFile(null);
      setLocalPreview(null);
      setShowUrlInput(false);
    } catch (error) {
      console.error('Error updating artwork:', error);
      toast.error("Failed to update artwork");
    } finally {
      setIsLoading(false);
    }
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  const handleTrackUpdated = (updatedTrack: Track) => {
    // Update both the reference track and our local state
    Object.assign(track, updatedTrack);
    setTrackState({...updatedTrack});
  };

  return (
    <>
      <div className="mb-1">
        <TrackContextMenu 
          onEditClick={handleEditClick} 
          onDeleteClick={isOwner ? handleDeleteClick : undefined}
          onLyricsClick={handleLyricsClick}
          onPlayClick={() => onTrackPlay(trackState)}
          onArtworkClick={isOwner ? handleArtworkClick : undefined}
        >
          <div 
            ref={setNodeRef}
            style={style}
            className={`group flex items-center gap-4 bg-black/60 p-4 rounded-lg hover:bg-black/80 transition-colors cursor-pointer ${
              isActive && isPlaying ? 'animate-pulse duration-2000' : ''
            } ${
              isActive ? 'border-l-4 border-l-dreamaker-purple border border-dreamaker-purple/30 bg-gradient-to-r from-dreamaker-purple/10 to-black/60' : ''
            }`}
            onClick={handleClick}
          >
            <div 
              className="text-gray-500 flex items-center justify-center pr-2 cursor-grab"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </div>
            
            <div 
              className="w-10 h-10 bg-gray-800 rounded overflow-hidden flex-shrink-0 relative group"
              onClick={(e) => isOwner && handleArtworkClick(e)}
            >
              <img 
                src={trackState.album_artwork_url || '/placeholder.svg'} 
                alt={trackState.title} 
                className="w-full h-full object-cover"
              />
              {isOwner && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Image className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            
            <TrackContent 
              track={trackState} 
              isActive={isActive} 
              onLyricsClick={handleLyricsClick} 
            />
          </div>
        </TrackContextMenu>

        <TrackLyrics 
          showLyrics={showLyrics} 
          trackLyrics={trackLyrics} 
        />
      </div>

      <EditTrackDialog 
        isOpen={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        track={trackState}
        onTrackUpdated={handleTrackUpdated}
      />

      <LyricsEditor
        trackId={trackState.id}
        initialLyrics={trackLyrics}
        isOpen={isLyricsEditorOpen}
        onOpenChange={setIsLyricsEditorOpen}
        onLyricsSaved={handleLyricsSaved}
        trackAudioUrl={trackState.audio_url}
      />

      {/* Artwork Upload Dialog */}
      <Dialog open={isArtworkDialogOpen} onOpenChange={setIsArtworkDialogOpen}>
        <DialogContent className="bg-[#1A1F2C] border-dreamaker-purple/30 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Update Track Artwork</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="trackArtwork">Update Artwork</Label>
              <div className="flex flex-col gap-4">
                {!showUrlInput ? (
                  <div 
                    {...getRootProps()}
                    className={cn(
                      "w-full h-40 bg-gray-800 flex flex-col items-center justify-center rounded cursor-pointer border-2 border-dashed transition-colors",
                      isDragActive 
                        ? "border-dreamaker-purple bg-dreamaker-purple/10" 
                        : "border-gray-700 hover:border-dreamaker-purple/50"
                    )}
                  >
                    <input
                      {...getInputProps()}
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    
                    {localPreview ? (
                      <img 
                        src={localPreview} 
                        alt="Track Artwork" 
                        className="w-full h-full object-cover rounded" 
                      />
                    ) : trackState.album_artwork_url ? (
                      <img 
                        src={trackState.album_artwork_url} 
                        alt="Track Artwork" 
                        className="w-full h-full object-cover rounded" 
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 p-4 text-center">
                        <UploadCloud className="w-10 h-10 text-dreamaker-purple" />
                        {isDragActive ? (
                          <p className="text-dreamaker-purple">Drop the image here</p>
                        ) : (
                          <>
                            <p className="font-medium text-gray-300">Drag & drop image here, or click to select</p>
                            <p className="text-xs text-gray-400">Supported formats: JPG, PNG, GIF, WEBP (max 5MB)</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-center mb-4">
                      <div className="w-32 h-32 bg-gray-800 rounded overflow-hidden">
                        <img 
                          src={newArtworkUrl || '/placeholder.svg'} 
                          alt="Track Artwork Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <Label htmlFor="artwork-url" className="text-sm text-gray-300 mb-1 block">
                      Artwork URL
                    </Label>
                    <Input
                      id="artwork-url"
                      value={newArtworkUrl}
                      onChange={(e) => setNewArtworkUrl(e.target.value)}
                      placeholder="Enter image URL"
                      className="bg-gray-800 border-dreamaker-purple/30 text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Enter a URL for the track artwork image
                    </p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleUploadClick}
                    className={cn("flex-1", showUrlInput && "bg-gray-800")}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleUrlClick}
                    className={cn("flex-1", !showUrlInput && "bg-gray-800")}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Enter URL
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsArtworkDialogOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button 
              onClick={handleArtworkSave} 
              className="bg-dreamaker-purple hover:bg-dreamaker-purple/90"
              disabled={(showUrlInput && !newArtworkUrl) || (!showUrlInput && !selectedFile && !trackState.album_artwork_url)}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Artwork
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
