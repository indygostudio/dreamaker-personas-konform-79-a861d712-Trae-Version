
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageGalleryProps {
  personaId: string;
}

export const ImageGallerySection = ({ personaId }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: images, isLoading, refetch } = useQuery({
    queryKey: ['ai-images', personaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_images')
        .select('*')
        .eq('persona_id', personaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (images && images.length > 0 && !selectedImage) {
      setSelectedImage(images[0].image_url);
    }
  }, [images, selectedImage]);

  const handleDeleteImage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Image deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleDownload = (url: string, filename = 'ai-generated-image.png') => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-400">Loading images...</div>;
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="mb-4">No AI-generated images yet.</p>
        <p>Create images in the AI Studio tab to see them here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        {selectedImage ? (
          <div className="relative bg-black/40 rounded-lg overflow-hidden">
            <img
              src={selectedImage}
              alt="Selected AI Image"
              className="w-full h-auto object-contain rounded-lg"
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => handleDownload(selectedImage)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center bg-black/40 rounded-lg">
            <p className="text-gray-400">Select an image to view</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">AI Generated Images</h3>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {images.map((image) => (
            <Card 
              key={image.id} 
              className={`overflow-hidden cursor-pointer transition-all ${
                selectedImage === image.image_url ? 'ring-2 ring-dreamaker-purple' : 'hover:opacity-80'
              }`}
              onClick={() => setSelectedImage(image.image_url)}
            >
              <div className="relative aspect-video">
                <img 
                  src={image.image_url} 
                  alt={image.prompt || 'AI Generated Image'} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                  <span className="text-xs text-white truncate max-w-[70%]">
                    {image.prompt || 'AI Generated Image'}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-white hover:bg-red-500/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
