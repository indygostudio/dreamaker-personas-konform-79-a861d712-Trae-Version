import { FileMusic, Folder, MoreVertical } from "lucide-react";
import { TransportControls } from "./TransportControls";
import { KonformBanner } from "./KonformBanner";
import { useHeaderStore } from "./store/headerStore";

export const FileBrowserView = () => {
  const { filesHeaderCollapsed, setFilesHeaderCollapsed } = useHeaderStore();
  const files = [
    { name: "Track 01", type: "audio" },
    { name: "Project Files", type: "folder" },
    { name: "Vocals", type: "audio" },
    { name: "Beats", type: "folder" }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#131415] flex flex-col">
      <KonformBanner 
        title="FILE BROWSER" 
        description="Manage your project files and assets"
        isCollapsed={filesHeaderCollapsed}
        onCollapsedChange={setFilesHeaderCollapsed}
      />
      <div className="p-6 flex-1">
        <div className="grid gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-[#353F51] hover:bg-[#2A2A2A] transition-colors group"
            >
              <div className="flex items-center gap-3">
                {file.type === 'folder' ? (
                  <Folder className="w-5 h-5 text-[#00D1FF]" />
                ) : (
                  <FileMusic className="w-5 h-5 text-[#00D1FF]" />
                )}
                <span className="text-white">{file.name}</span>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-5 h-5 text-[#00D1FF]" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 bg-black/40 backdrop-blur-xl border-t border-konform-neon-blue/20">
        <TransportControls />
      </div>
    </div>
  );
};