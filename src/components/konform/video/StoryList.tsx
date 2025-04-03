import React from "react";
import { useStoryboard } from "@/contexts/StoryboardContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Edit, Trash2, Film, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface StoryListProps {
  onDeleteStory?: (storyId: string) => void;
}

const StoryList: React.FC<StoryListProps> = ({ onDeleteStory }) => {
  const { activeProject, activeScene, setActiveScene, dispatch } = useStoryboard();

  if (!activeProject) return null;
  if (activeProject.stories.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        <Film className="w-12 h-12 mx-auto mb-2 opacity-30" />
        <p>No stories created yet.</p>
        <p className="text-sm">Create your first story to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Your Stories</h3>
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {activeProject.stories.map((story) => {
          const isActive = activeScene?.id === story.id;
          const totalDuration = story.scenes.reduce(
            (sum, scene) => sum + scene.durationInSeconds,
            0
          );
          const formattedDuration = formatDuration(totalDuration);
          const updatedTimeAgo = formatDistanceToNow(new Date(story.updatedAt), {
            addSuffix: true,
          });

          return (
            <Card
              key={story.id}
              className={`border transition-all ${isActive
                ? "bg-blue-900/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                : "bg-black/40 border-white/10 hover:bg-black/60 hover:border-white/20"
                }`}
            >
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => setActiveScene(story)}
                  >
                    <h4 className="font-medium text-white truncate">{story.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {story.description}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      <span className="mr-3">{formattedDuration}</span>
                      <span>{updatedTimeAgo}</span>
                    </div>
                  </div>

                  <div className="flex space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-800"
                      onClick={() => setActiveScene(story)}
                      title="Edit Story"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-800"
                      onClick={() => onDeleteStory && onDeleteStory(story.id)}
                      title="Delete Story"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {story.scenes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {story.scenes.length} scene{story.scenes.length !== 1 && "s"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-950/30"
                        onClick={() => setActiveScene(story)}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Helper function to format duration in seconds to MM:SS format
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default StoryList;