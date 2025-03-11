
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface MediaFile {
  id: string;
  title?: string;
  file_type?: string;
}

interface MediaFilesListProps {
  mediaFiles: MediaFile[];
  isLoading: boolean;
}

export const MediaFilesList = ({ mediaFiles, isLoading }: MediaFilesListProps) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Files</h2>
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-black/40 animate-pulse rounded"></div>
          ))}
        </div>
      ) : mediaFiles && mediaFiles.length > 0 ? (
        <div className="space-y-2">
          {mediaFiles.map(file => (
            <div 
              key={file.id} 
              className="flex items-center justify-between p-3 bg-black/40 rounded-lg hover:bg-blue-900/20"
            >
              <div>
                <div className="font-medium">{file.title || 'Untitled'}</div>
                <div className="text-sm text-gray-400">{file.file_type || 'Unknown type'}</div>
              </div>
              <Button size="sm" variant="outline" className="bg-blue-600/10 hover:bg-blue-600/20 border-blue-500/50">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 bg-black/20 rounded-lg">
          No files available for this media collection
        </div>
      )}
    </div>
  );
};
