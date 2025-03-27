
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageIcon, Save, Upload, UploadCloud } from "lucide-react";
import { Track } from "@/types/track";
import { useState, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TrackArtworkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  track: Track | null;
  artworkPreview: string | null;
  onArtworkClick: () => void;
  onSave: (file?: File) => void;
}

export const TrackArtworkDialog = ({
  open,
  onOpenChange,
  track,
  artworkPreview,
  onArtworkClick,
  onSave
}: TrackArtworkDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);
  
  const handleSave = () => {
    setIsLoading(true);
    try {
      onSave(selectedFile || undefined);
      toast.success("Artwork updated successfully");
      // Reset state after saving
      setSelectedFile(null);
      setLocalPreview(null);
    } catch (error) {
      toast.error("Failed to update artwork");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Track Artwork</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="trackArtwork">Update Artwork</Label>
            <div className="flex flex-col gap-4">
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
                ) : artworkPreview ? (
                  <img 
                    src={artworkPreview} 
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
              
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleUploadClick}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onArtworkClick}
                  className="flex-1"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Choose URL
                </Button>
              </div>
            </div>
            {track && (
              <p className="text-sm text-gray-400 mt-2">
                For track: {track.title}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
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
  );
};
