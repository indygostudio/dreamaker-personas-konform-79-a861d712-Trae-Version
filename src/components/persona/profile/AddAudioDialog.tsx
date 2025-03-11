
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Music2, Activity } from "lucide-react";
import { toast } from "sonner";

interface AddAudioDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, isLoop: boolean) => void;
  onLoopDialog: () => void;
  isUploading: boolean;
}

export const AddAudioDialog = ({
  isOpen,
  onOpenChange,
  onUpload,
  onLoopDialog,
  isUploading
}: AddAudioDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an audio file
      if (!file.type.startsWith('audio/')) {
        toast.error("Please select an audio file");
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile, false);
    } else {
      toast.error("Please select a file to upload");
    }
  };

  const handleLoopOption = () => {
    if (selectedFile) {
      onLoopDialog();
    } else {
      toast.error("Please select a file first");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-dreamaker-purple/30 text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Add Audio to Playlist</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="bg-black/40 rounded-lg p-6 flex flex-col items-center justify-center border-2 border-dashed border-dreamaker-purple/30 hover:border-dreamaker-purple/50 cursor-pointer">
              <input 
                type="file" 
                id="audio-upload" 
                className="hidden" 
                accept="audio/*" 
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <label htmlFor="audio-upload" className="flex flex-col items-center cursor-pointer">
                <Music2 className="h-12 w-12 text-dreamaker-purple/70 mb-2" />
                <p className="text-white">
                  {selectedFile ? selectedFile.name : "Click to select audio file"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  MP3, WAV, or OGG files
                </p>
              </label>
            </div>
            
            {selectedFile && (
              <div className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-dreamaker-purple mr-2" />
                  <span className="text-white">{selectedFile.name}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedFile(null)}
                  className="text-red-400 hover:text-red-300 border-red-500/30"
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleLoopOption}
              disabled={!selectedFile || isUploading}
              className="border-amber-500/50 text-amber-400 hover:bg-amber-950/30"
            >
              <Activity className="h-4 w-4 mr-2" />
              Add as Loop
            </Button>
            
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="bg-dreamaker-purple hover:bg-dreamaker-purple/80"
            >
              {isUploading ? (
                <>
                  <span className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Add to Playlist
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
