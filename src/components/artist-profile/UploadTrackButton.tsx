
import { Upload } from "lucide-react";

interface UploadTrackButtonProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadTrackButton = ({ onChange }: UploadTrackButtonProps) => {
  return (
    <div>
      <input
        type="file"
        accept="audio/*"
        onChange={onChange}
        className="hidden"
        id="audio-upload"
      />
      <label
        htmlFor="audio-upload"
        className="flex items-center gap-2 px-4 py-2 bg-dreamaker-purple text-white rounded-md cursor-pointer hover:bg-dreamaker-purple/90 transition-colors"
      >
        <Upload className="w-4 h-4" />
        <span>Upload Audio</span>
      </label>
    </div>
  );
};
