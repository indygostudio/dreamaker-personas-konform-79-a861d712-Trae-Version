import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface TrainingData {
  userId: string;
  dataType: 'interaction' | 'creative' | 'workflow';
  content: Record<string, any>;
  timestamp: number;
  source: string;
  metadata?: Record<string, any>;
}

interface ModelMetrics {
  modelId: string;
  accuracy: number;
  performance: Record<string, number>;
  timestamp: number;
}

class TrainingSystem {
  private static instance: TrainingSystem;
  private currentUser: User | null = null;
  
  private constructor() {}

  public static getInstance(): TrainingSystem {
    if (!TrainingSystem.instance) {
      TrainingSystem.instance = new TrainingSystem();
    }
    return TrainingSystem.instance;
  }

  public setUser(user: User | null) {
    this.currentUser = user;
  }

  public async collectData(data: Omit<TrainingData, 'userId' | 'timestamp'>): Promise<void> {
    if (!this.currentUser) {
      console.warn('No user logged in, training data collection skipped');
      return;
    }

    const trainingData: TrainingData = {
      userId: this.currentUser.id,
      timestamp: Date.now(),
      ...data
    };

    try {
      const { error } = await supabase
        .from('training_data')
        .insert([trainingData]);

      if (error) throw error;

      // Trigger real-time model update if needed
      await this.evaluateModelUpdate(trainingData);
    } catch (error) {
      console.error('Error collecting training data:', error);
    }
  }

  private async evaluateModelUpdate(newData: TrainingData): Promise<void> {
    // Implement logic to determine if model needs updating
    const shouldUpdate = await this.checkUpdateCriteria(newData);
    
    if (shouldUpdate) {
      await this.triggerModelTraining(newData.dataType);
    }
  }

  private async checkUpdateCriteria(newData: TrainingData): Promise<boolean> {
    try {
      // Get recent data count for this type
      const { count } = await supabase
        .from('training_data')
        .select('*', { count: 'exact' })
        .eq('dataType', newData.dataType)
        .gt('timestamp', Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours

      // Update if we have enough new data points
      return count !== null && count > 100;
    } catch (error) {
      console.error('Error checking update criteria:', error);
      return false;
    }
  }

  private async triggerModelTraining(dataType: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('model_training_queue')
        .insert([{
          dataType,
          status: 'pending',
          timestamp: Date.now()
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error triggering model training:', error);
    }
  }

  public async recordModelMetrics(metrics: Omit<ModelMetrics, 'timestamp'>): Promise<void> {
    try {
      const modelMetrics: ModelMetrics = {
        ...metrics,
        timestamp: Date.now()
      };

      const { error } = await supabase
        .from('model_metrics')
        .insert([modelMetrics]);

      if (error) throw error;
    } catch (error) {
      console.error('Error recording model metrics:', error);
    }
  }

  public async getFeedbackLoop(modelId: string): Promise<ModelMetrics[]> {
    try {
      const { data, error } = await supabase
        .from('model_metrics')
        .select('*')
        .eq('modelId', modelId)
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as ModelMetrics[];
    } catch (error) {
      console.error('Error getting feedback loop:', error);
      return [];
    }
  }
}

export const trainingSystem = TrainingSystem.getInstance();