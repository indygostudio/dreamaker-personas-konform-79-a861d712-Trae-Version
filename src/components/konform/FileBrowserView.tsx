import { FileMusic, Folder, MoreVertical, Plus } from "lucide-react";
import { TransportControls } from "./TransportControls";
import { KonformBanner } from "./KonformBanner";
import { useHeaderStore } from "./store/headerStore";
import { useKonformProject } from "@/hooks/useKonformProject";
import { Button } from "../ui/button";
import { ProjectFile } from "@/types/project";

export const FileBrowserView = () => {
  const { filesHeaderCollapsed, setFilesHeaderCollapsed } = useHeaderStore();
  const { currentProject } = useKonformProject();
  const projectFiles = currentProject?.project_files || [];

  return (
    <div className="flex-1 overflow-y-auto bg-[#131415] flex flex-col">
      <KonformBanner 
        title="FILE BROWSER" 
        description="Manage your project files and assets"
        isCollapsed={filesHeaderCollapsed}
        onCollapsedChange={setFilesHeaderCollapsed}
      />
      <div className="p-6 flex-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg">Project Files</h3>
          <Button
            variant="outline"
            size="sm"
            className="text-konform-neon-blue hover:text-konform-neon-blue/80"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add File
          </Button>
        </div>
        <div className="grid gap-2">
          {projectFiles.map((file: ProjectFile) => (
            <div
              key={file.id
              className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-[#353F51] hover:bg-[#2A2A2A] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <FileMusic className="w-5 h-5 text-[#00D1FF]" />
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