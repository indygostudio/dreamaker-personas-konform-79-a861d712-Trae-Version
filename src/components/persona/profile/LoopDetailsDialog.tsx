
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Music, Upload, HashIcon } from "lucide-react";

interface LoopDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, isLoop: boolean, loopData: {
    title?: string;
    tempo?: number;
    musical_key?: string;
    meter?: string;
    sample_name?: string;
  }) => void;
  file: File | null;
  isUploading: boolean;
}

export const LoopDetailsDialog = ({
  isOpen,
  onOpenChange,
  onUpload,
  file,
  isUploading
}: LoopDetailsDialogProps) => {
  const [loopData, setLoopData] = useState({
    title: file?.name.split('.')[0] || '',
    tempo: 120,
    musical_key: 'C Major',
    meter: '4/4',
    sample_name: ''
  });

  const handleChange = (field: string, value: string | number) => {
    setLoopData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (file) {
      onUpload(file, true, loopData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-dreamaker-purple/30 text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Add Loop to Database</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="flex items-center gap-2 bg-dreamaker-purple/20 rounded-lg p-3">
            <Activity className="h-5 w-5 text-dreamaker-purple" />
            <span className="text-white">{file?.name}</span>
          </div>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title">Loop Title</Label>
              <Input
                id="title"
                value={loopData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter a title for this loop"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tempo">Tempo (BPM)</Label>
                <Input
                  id="tempo"
                  type="number"
                  value={loopData.tempo}
                  onChange={(e) => handleChange('tempo', parseInt(e.target.value) || 0)}
                  placeholder="120"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="musical_key">Key</Label>
                <Input
                  id="musical_key"
                  value={loopData.musical_key}
                  onChange={(e) => handleChange('musical_key', e.target.value)}
                  placeholder="C Major"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meter">Meter</Label>
                <Input
                  id="meter"
                  value={loopData.meter}
                  onChange={(e) => handleChange('meter', e.target.value)}
                  placeholder="4/4"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="sample_name">Sample Name</Label>
                <Input
                  id="sample_name"
                  value={loopData.sample_name}
                  onChange={(e) => handleChange('sample_name', e.target.value)}
                  placeholder="Optional sample name"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-gray-700 text-white"
            disabled={isUploading}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleSubmit}
            className="bg-dreamaker-purple hover:bg-dreamaker-purple/80"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <HashIcon className="h-4 w-4 mr-2" />
                Save to Loop Database
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
