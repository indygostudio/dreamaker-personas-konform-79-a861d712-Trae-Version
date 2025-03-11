
import { useState } from "react";
import { ImageGenerationForm } from "./ImageGenerationForm";
import { ImageGrid } from "./ImageGrid";
import { AIImage } from "@/types/ai-image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, X } from "lucide-react";
import { toast } from "sonner";

interface ImageSectionProps {
  persona?: {
    id: string;
    name: string;
  };
}

export const ImageSection = ({ persona }: ImageSectionProps) => {
  const [selectedImage, setSelectedImage] = useState<AIImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleImageSelect = (image: AIImage) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  const handleImageGenerated = (imageUrl: string) => {
    // Refresh the image grid
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
    
    // Show toast
    toast.success("New image added to your collection");
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename || 'image.png';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
      
      toast.success('Image downloaded successfully');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  const shareImage = async (image: AIImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title || 'Shared Image',
          text: image.prompt || 'Check out this image!',
          url: image.image_url,
        });
        toast.success('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
        
        // If share was canceled, don't show error
        if (error instanceof Error && error.name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(image.image_url);
        toast.success('Image URL copied to clipboard');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast.error('Failed to copy URL');
      }
    }
  };

  return (
    <div className="space-y-6">
      <ImageGenerationForm 
        personaId={persona?.id || ''} 
        onImageGenerated={handleImageGenerated} 
      />
      
      {!isRefreshing && (
        <ImageGrid 
          personaId={persona?.id} 
          onImageSelect={handleImageSelect} 
        />
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl bg-black/90 border-dreamaker-purple/30">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{selectedImage?.title || 'Image Preview'}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsDialogOpen(false)}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 rounded-lg overflow-hidden bg-black/40">
              {selectedImage && (
                <img 
                  src={selectedImage.image_url} 
                  alt={selectedImage.title || 'AI Generated Image'} 
                  className="w-full h-auto object-contain max-h-[70vh]"
                />
              )}
            </div>
            
            <div className="md:w-64 space-y-4">
              {selectedImage?.prompt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Prompt</h3>
                  <p className="text-sm mt-1">{selectedImage.prompt}</p>
                </div>
              )}
              
              {selectedImage?.tags && selectedImage.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Tags</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedImage.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-dreamaker-purple/20 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-400">Created</h3>
                <p className="text-sm mt-1">
                  {selectedImage?.created_at ? new Date(selectedImage.created_at).toLocaleDateString() : '-'}
                </p>
              </div>
              
              <div className="pt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-black/30 border-dreamaker-purple/30"
                  onClick={() => selectedImage && downloadImage(
                    selectedImage.image_url, 
                    `${selectedImage.title || 'image'}.png`
                  )}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-black/30 border-dreamaker-purple/30"
                  onClick={() => selectedImage && shareImage(selectedImage)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
