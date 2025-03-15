Media import { CollapsibleContent } from "@/components/ui/collapsible";
import { format, formatDistanceToNow } from "date-fns";
import { Clock, GitCommit } from "lucide-react";
import { useKonformProject } from "@/hooks/useKonformProject";

export const ProjectTimeline = () => {
  const { currentProject, projectVersions } = useKonformProject();

  if (!currentProject) {
    return (
      <CollapsibleContent>
        <div className="text-gray-400 text-center py-2">
          No project loaded
        </div>
      </CollapsibleContent>
    );
  }

  return (
    <CollapsibleContent>
      <div className="space-y-4">
        {/* Creation timestamp */}
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-konform-neon-blue" />
          <div>
            <p className="text-white text-sm">Created on {format(new Date(currentProject.created_at), 'MMM d, yyyy')}</p>
            <p className="text-gray-400 text-xs">{formatDistanceToNow(new Date(currentProject.created_at), { addSuffix: true })}</p>
          </div>
        </div>

        {/* Version history */}
        <div className="mt-4">
          <p className="text-white text-sm mb-2">Change History</p>
          <div className="space-y-3">
            {projectVersions && projectVersions.length > 0 ? (
              projectVersions.map((version) => (
                <div key={version.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-konform-neon-blue" />
                  <div>
                    <p className="text-white text-sm">Version {version.version}</p>
                    <p className="text-gray-400 text-xs flex items-center gap-1">
                      <GitCommit className="w-3 h-3" />
                      {version.description || 'No description'} • 
                      {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No version history available</p>
            )}
          </div>
        </div>
      </div>
    </CollapsibleContent>
  );
};