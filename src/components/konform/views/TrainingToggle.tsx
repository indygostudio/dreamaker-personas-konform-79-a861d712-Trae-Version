import { useTrainingModeStore } from "../store/trainingModeStore";

export const TrainingToggle = () => {
  // Keep the functionality but don't render a visible button
  const { isTrainingEnabled } = useTrainingModeStore();
  
  // Return null (nothing) instead of a visible button
  return null;
}; 