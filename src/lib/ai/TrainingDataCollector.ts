import { User } from '@/types/user';
import { TrainingData } from '@/types/training';
import { supabase } from '@/lib/supabaseClient';

export class TrainingDataCollector {
  private static instance: TrainingDataCollector;
  private currentUser: User | null = null;
  private isCollecting: boolean = false;

  private constructor() {}

  public static getInstance(): TrainingDataCollector {
    if (!TrainingDataCollector.instance) {
      TrainingDataCollector.instance = new TrainingDataCollector();
    }
    return TrainingDataCollector.instance;
  }

  public setUser(user: User | null) {
    this.currentUser = user;
  }

  public setCollectionState(isCollecting: boolean) {
    this.isCollecting = isCollecting;
  }

  public async collectInteractionData(data: {
    action: string;
    context: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    if (!this.shouldCollect()) return;

    await this.saveTrainingData({
      dataType: 'interaction',
      content: data,
      source: 'user_interaction',
    });
  }

  public async collectCreativeData(data: {
    type: string;
    content: any;
    metadata?: Record<string, any>;
  }): Promise<void> {
    if (!this.shouldCollect()) return;

    await this.saveTrainingData({
      dataType: 'creative',
      content: data,
      source: 'creative_process',
    });
  }

  public async collectWorkflowData(data: {
    step: string;
    context: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    if (!this.shouldCollect()) return;

    await this.saveTrainingData({
      dataType: 'workflow',
      content: data,
      source: 'user_workflow',
    });
  }

  private shouldCollect(): boolean {
    return this.isCollecting && this.currentUser !== null;
  }

  private async saveTrainingData(data: Omit<TrainingData, 'userId' | 'timestamp'>): Promise<void> {
    if (!this.currentUser) return;

    const trainingData: TrainingData = {
      userId: this.currentUser.id,
      timestamp: Date.now(),
      ...data,
    };

    try {
      const { error } = await supabase
        .from('training_data')
        .insert([trainingData]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving training data:', error);
    }
  }
}