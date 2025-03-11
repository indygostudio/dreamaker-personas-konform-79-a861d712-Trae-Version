
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import midjourneyTaskService from '@/services/midjourney-task-service';
import { useUser } from '@/hooks/useUser';

export const MidjourneyTasksPanel = ({ onSelectImage }: { onSelectImage: (url: string) => void }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const userTasks = await midjourneyTaskService.getUserTasks(user.id);
        setTasks(userTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const handleDeleteTask = async (id: string) => {
    try {
      await midjourneyTaskService.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3>Recent Image Generations</h3>
      
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-400">No images generated yet</p>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => (
            <Card key={task.id} className="bg-gray-900/60">
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{task.title || 'Untitled'}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[150px]">{task.prompt}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {task.status === 'completed' && task.resultUrl && (
                      <Button 
                        size="sm" 
                        onClick={() => onSelectImage(task.resultUrl)}
                        variant="outline"
                      >
                        Use
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
