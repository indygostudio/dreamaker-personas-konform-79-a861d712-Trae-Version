import { useToast } from "@/hooks/use-toast";

export const useMediaActions = (avatarUrl: string) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const response = await fetch(avatarUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `avatar.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Success",
        description: "Image downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    try {
      const response = await fetch(avatarUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      toast({
        title: "Success",
        description: "Image copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy image",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Avatar`,
          text: `Check out this avatar`,
          url: avatarUrl,
        });
      } else {
        await navigator.clipboard.writeText(avatarUrl);
        toast({
          title: "Success",
          description: "Image URL copied to clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share image",
        variant: "destructive",
      });
    }
  };

  return {
    handleDownload,
    handleCopy,
    handleShare
  };
};