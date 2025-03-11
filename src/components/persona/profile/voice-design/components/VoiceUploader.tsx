
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from 'lucide-react';

interface VoiceUploaderProps {
  files: File[];
  setFiles: (files: File[]) => void;
  onUpload: () => void;
  isUploading: boolean;
}

export const VoiceUploader = ({
  files,
  setFiles,
  onUpload,
  isUploading
}: VoiceUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles([...files, ...acceptedFiles]);
  }, [files, setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    maxFiles: 25
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-dreamaker-purple bg-dreamaker-purple/10' : 'border-gray-600'}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
        {isDragActive ? (
          <p className="text-dreamaker-purple">Drop the audio files here</p>
        ) : (
          <div className="space-y-2 text-gray-400">
            <p>Drag & drop voice samples here, or click to select files</p>
            <p className="text-sm">Supported formats: MP3, WAV, M4A (max 25 files)</p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-300">Selected Files:</h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-black/20 p-2 rounded">
              <span className="text-sm text-gray-400">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiles(files.filter((_, i) => i !== index))}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        className="w-full"
        onClick={onUpload}
        disabled={files.length === 0 || isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload Voice Samples'
        )}
      </Button>
    </div>
  );
};
