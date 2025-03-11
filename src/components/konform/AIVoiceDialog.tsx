import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, AudioWaveform } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AIVoiceDialog = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Integration with Suno API will go here
      toast({
        title: "Voice Generated",
        description: "Your AI voice track has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate voice track. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-[#245A5A] text-white hover:bg-[#346A6A] border-none"
        >
          <Mic className="w-4 h-4 mr-2" />
          Generate AI Voice
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-konform-surface border-konform-border">
        <DialogHeader>
          <DialogTitle className="text-white">AI Voice Generator</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#353F51]">
            <AudioWaveform className="w-full h-24 text-[#00D1FF]" />
          </div>
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full bg-[#245A5A] text-white hover:bg-[#346A6A]"
          >
            {isGenerating ? "Generating..." : "Generate Voice"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};