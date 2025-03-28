
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageGalleryProps {
  personaId: string;
}

export const ImageGallerySection = ({ personaId }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

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

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    // Only accept image files
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${personaId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('persona_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('persona_images')
        .getPublicUrl(filePath);

      // Save image reference to database
      const { error: dbError } = await supabase
        .from('ai_images')
        .insert({
          persona_id: personaId,
          image_url: publicUrl,
          prompt: file.name, // Using filename as prompt for user-uploaded images
          created_at: new Date().toISOString(),
        });

      if (dbError) throw dbError;

      toast.success('Image uploaded successfully');
      refetch();
      setSelectedImage(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-400">Loading images...</div>;
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="mb-4">No images in your gallery yet.</p>
        <p className="mb-6">Upload your own images or create them in the AI Studio tab.</p>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-8 transition-colors ${dragActive ? 'border-dreamaker-purple bg-dreamaker-purple/10' : 'border-gray-600'}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-4">
            <ImageIcon className="h-12 w-12 text-dreamaker-purple" />
            <div className="text-center">
              <p className="text-lg font-medium mb-1">Drag and drop your image here</p>
              <p className="text-sm text-gray-400 mb-4">or click to browse files</p>
            </div>
            <Button 
              onClick={handleButtonClick}
              disabled={isUploading}
              className="relative"
            >
              {isUploading ? (
                <div className="animate-spin h-5 w-5 border-2 border-dreamaker-purple border-t-transparent rounded-full" />
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
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
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">Image Gallery</h3>
          <Button 
            size="sm" 
            onClick={handleButtonClick}
            disabled={isUploading}
            className="flex items-center gap-1"
          >
            {isUploading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Upload className="h-3 w-3" />
                Upload
              </>
            )}
          </Button>
        </div>
        <div 
          className={`space-y-2 max-h-[600px] overflow-y-auto pr-2 ${dragActive ? 'ring-2 ring-dreamaker-purple p-2 rounded-lg bg-dreamaker-purple/5' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
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
