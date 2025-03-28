
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaItemType {
  id: number | string;
  type: string;
  title: string;
  desc: string;
  url: string;
  span: string;
}

interface ImageGalleryProps {
  personaId: string;
}

export const ImageGallerySection = ({ personaId }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<MediaItemType | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: imagesData, isLoading, refetch } = useQuery({
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

  const images = imagesData?.map(img => ({
    id: img.id,
    type: 'image',
    title: img.prompt || 'AI Generated Image',
    desc: '',
    url: img.image_url,
    span: ''
  })) || [];

  useEffect(() => {
    if (images.length > 0 && !selectedImage) {
      setSelectedImage(images[0]);
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

  const GalleryModal = ({ selectedItem, isOpen, onClose }: { selectedItem: MediaItemType, isOpen: boolean, onClose: () => void }) => {
    if (!isOpen || !selectedItem) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="relative max-w-7xl w-full h-full md:h-auto md:aspect-video m-4 bg-black/40 rounded-lg overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <Trash2 className="w-6 h-6 text-white" />
          </button>
          <img
            src={selectedItem.url}
            alt={selectedItem.title}
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDownload(selectedItem.url)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <AnimatePresence>
        {selectedImage && (
          <GalleryModal
            selectedItem={selectedImage}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <motion.div
            key={image.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card
              className="overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-dreamaker-purple"
              onClick={() => {
                setSelectedImage(image);
                setIsModalOpen(true);
              }}
            >
              <div className="relative aspect-square">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                  <span className="text-xs text-white truncate max-w-[70%]">
                    {image.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-white hover:bg-red-500/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image.id as string);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
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
