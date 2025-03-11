
import { supabase } from "@/integrations/supabase/client";
import { piapiService } from "./piapiService";

export interface MidjourneyTask {
  id: string;
  prompt: string;
  status: string;
  taskId: string;
  userId: string;
  personaId?: string;
  resultUrl?: string;
  createdAt: string;
  updatedAt?: string;
  title?: string;
}

const midjourneyTaskService = {
  async createTask(prompt: string, taskId: string, userId: string, personaId?: string, title?: string): Promise<MidjourneyTask> {
    try {
      const { data, error } = await supabase
        .from('ai_image_tasks')
        .insert({
          prompt,
          task_id: taskId,
          user_id: userId,
          persona_id: personaId,
          status: 'pending',
          title: title || `Task - ${new Date().toLocaleString()}`
        })
        .select();

      if (error) throw error;
      
      return {
        id: data[0].id,
        prompt: data[0].prompt,
        status: data[0].status,
        taskId: data[0].task_id,
        userId: data[0].user_id,
        personaId: data[0].persona_id,
        resultUrl: data[0].result_url,
        createdAt: data[0].created_at,
        updatedAt: data[0].updated_at,
        title: data[0].title
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  async getUserTasks(userId: string): Promise<MidjourneyTask[]> {
    try {
      const { data, error } = await supabase
        .from('ai_image_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(task => ({
        id: task.id,
        prompt: task.prompt,
        status: task.status,
        taskId: task.task_id,
        userId: task.user_id,
        personaId: task.persona_id,
        resultUrl: task.result_url,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        title: task.title
      }));
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  },

  async updateTaskStatus(taskId: string, status: string, resultUrl?: string): Promise<MidjourneyTask> {
    try {
      const { data, error } = await supabase
        .from('ai_image_tasks')
        .update({
          status,
          result_url: resultUrl,
          updated_at: new Date().toISOString()
        })
        .eq('task_id', taskId)
        .select();

      if (error) throw error;
      
      return {
        id: data[0].id,
        prompt: data[0].prompt,
        status: data[0].status,
        taskId: data[0].task_id,
        userId: data[0].user_id,
        personaId: data[0].persona_id,
        resultUrl: data[0].result_url,
        createdAt: data[0].created_at,
        updatedAt: data[0].updated_at,
        title: data[0].title
      };
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  },

  async deleteTask(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_image_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Helper function to poll task status until it's completed
  async pollTaskStatus(taskId: string): Promise<MidjourneyTask> {
    try {
      const data = await piapiService.midjourney.checkTaskStatus(taskId);
      
      if (data.status === 'PROCESSING') {
        // Still processing, wait and try again
        await new Promise(resolve => setTimeout(resolve, 3000));
        return this.pollTaskStatus(taskId);
      } else if (data.status === 'SUCCESS') {
        // Update our database and return the updated task
        const imageUrl = data.image_url || data.output?.image_url || '';
        return await this.updateTaskStatus(taskId, 'completed', imageUrl);
      } else {
        // Failed or other status
        return await this.updateTaskStatus(taskId, 'failed');
      }
    } catch (error) {
      console.error('Error polling task status:', error);
      await this.updateTaskStatus(taskId, 'failed');
      throw error;
    }
  }
};

export default midjourneyTaskService;
