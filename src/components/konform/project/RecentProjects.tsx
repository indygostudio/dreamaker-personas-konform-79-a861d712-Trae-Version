
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Clock, 
  Download, 
  Upload,
  Plus
} from "lucide-react";
import { useKonformProject } from "@/hooks/useKonformProject";
import { formatDistanceToNow } from "date-fns";

export const RecentProjects = () => {
  const { 
    recentProjects, 
    isLoadingRecent,
    createProject,
    importProject
  } = useKonformProject();

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.konform';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        importProject(file);
      }
    };
    input.click();
  };

  const handleCreateNew = () => {
    createProject.mutate({
      name: 'Untitled Project',
      status: 'draft',
      mixer_state: {},
      editor_state: {},
      lyrics_state: {}
    });
  };

  if (isLoadingRecent) {
    return <div className="p-4 text-center">Loading recent projects...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recent Projects</h2>
        <div className="flex gap-2">
          <Button onClick={handleImport}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {recentProjects?.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-konform-neon-blue/10 hover:border-konform-neon-blue/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-konform-neon-blue" />
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(project.last_opened_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Open
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
