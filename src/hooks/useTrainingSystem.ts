import { useEffect } from 'react';
import { useUser } from './useUser';
import { trainingSystem } from '../lib/ai/TrainingSystem';

import { TrainingDataCollector } from '@/lib/ai/TrainingDataCollector';
import { useTrainingModeStore } from '@/components/konform/store/trainingModeStore';

export const useTrainingSystem = () => {
  const { user } = useUser();
  const { isTrainingEnabled } = useTrainingModeStore();
  const trainingDataCollector = TrainingDataCollector.getInstance();

  useEffect(() => {
    trainingSystem.setUser(user);
    trainingDataCollector.setUser(user);
  }, [user]);

  useEffect(() => {
    trainingDataCollector.setCollectionState(isTrainingEnabled);
  }, [isTrainingEnabled]);

  const collectInteractionData = async (content: Record<string, any>, source: string, metadata?: Record<string, any>) => {
    await trainingDataCollector.collectInteractionData({
      action: source,
      context: JSON.stringify(content),
      metadata
    });
  };

  const collectCreativeData = async (content: Record<string, any>, source: string, metadata?: Record<string, any>) => {
    await trainingDataCollector.collectCreativeData({
      type: source,
      content,
      metadata
    });
  };

  const collectWorkflowData = async (content: Record<string, any>, source: string, metadata?: Record<string, any>) => {
    await trainingDataCollector.collectWorkflowData({
      step: source,
      context: JSON.stringify(content),
      metadata
    });
  };

  const recordMetrics = async (modelId: string, accuracy: number, performance: Record<string, number>) => {
    await trainingSystem.recordModelMetrics({
      modelId,
      accuracy,
      performance
    });
  };

  const getFeedbackData = async (modelId: string) => {
    return await trainingSystem.getFeedbackLoop(modelId);
  };

  return {
    collectInteractionData,
    collectCreativeData,
    collectWorkflowData,
    recordMetrics,
    getFeedbackData
  };
};