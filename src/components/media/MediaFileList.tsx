
import { useMemo } from 'react';
import { MediaFile } from '@/types/media';
import { FileIcon, FileVideo, FileMusic, FileImage } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface MediaFileListProps {
  files: MediaFile[];
  onFileSelect?: (file: MediaFile) => void;
}

export const MediaFileList = ({ files, onFileSelect }: MediaFileListProps) => {
  const renderFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'video':
        return <FileVideo className="h-5 w-5" />;
      case 'audio':
        return <FileMusic className="h-5 w-5" />;
      case 'image':
        return <FileImage className="h-5 w-5" />;
      default:
        return <FileIcon className="h-5 w-5" />;
    }
  };

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [files]);

  return (
    <div className="space-y-2">
      {sortedFiles.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition cursor-pointer"
          onClick={() => onFileSelect?.(file)}
        >
          <div className="flex items-center gap-3">
            {renderFileIcon(file.file_type)}
            <div>
              <p className="text-sm font-medium text-white">{file.title}</p>
              <p className="text-xs text-gray-400">{formatBytes(file.file_size)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
