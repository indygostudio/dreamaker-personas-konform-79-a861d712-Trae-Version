
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Persona } from "@/types/persona";

interface FaceSwapTabProps {
  persona?: Persona;
}

export const FaceSwapTab = ({ persona }: FaceSwapTabProps) => {
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [targetImage, setTargetImage] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleSourceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSourceImage(e.target.files[0]);
    }
  };

  const handleTargetImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTargetImage(e.target.files[0]);
    }
  };

  const handleFaceSwap = async () => {
    if (!sourceImage || !targetImage) {
      return;
    }

    // Mock implementation - would connect to a face swap API in production
    setResult(URL.createObjectURL(targetImage));
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Images</TabsTrigger>
          <TabsTrigger value="webcam">Use Webcam</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source-image">Source Face Image</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  id="source-image"
                  type="file"
                  accept="image/*"
                  onChange={handleSourceImageUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer h-40 flex items-center justify-center" onClick={() => document.getElementById('source-image')?.click()}>
                  {sourceImage ? (
                    <img src={URL.createObjectURL(sourceImage)} alt="Source" className="max-h-full" />
                  ) : (
                    <span className="text-gray-500">Click to upload source image</span>
                  )}
                </div>
              </div>
              
              {persona?.avatar_url && (
                <div 
                  className="border border-blue-500 rounded-lg p-1 cursor-pointer h-40 overflow-hidden"
                  onClick={() => {
                    // In a real implementation, we would load this image as a File
                    console.log("Selected persona avatar as source image");
                  }}
                >
                  <img src={persona.avatar_url} alt={persona.name} className="w-full h-full object-cover rounded" />
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target-image">Target Image</Label>
            <input
              id="target-image"
              type="file"
              accept="image/*"
              onChange={handleTargetImageUpload}
              className="hidden"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer h-40 flex items-center justify-center" onClick={() => document.getElementById('target-image')?.click()}>
              {targetImage ? (
                <img src={URL.createObjectURL(targetImage)} alt="Target" className="max-h-full" />
              ) : (
                <span className="text-gray-500">Click to upload target image</span>
              )}
            </div>
          </div>
          
          <Button onClick={handleFaceSwap} disabled={!sourceImage || !targetImage} className="w-full">
            Swap Faces
          </Button>
        </TabsContent>
        
        <TabsContent value="webcam">
          <div className="h-80 bg-black/20 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Webcam access would be implemented here</span>
          </div>
          
          <Button className="w-full mt-4">
            Capture Image
          </Button>
        </TabsContent>
      </Tabs>
      
      {result && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Result:</h3>
          <div className="border rounded-lg overflow-hidden">
            <img src={result} alt="Face Swap Result" className="w-full" />
          </div>
        </div>
      )}
    </div>
  );
};
