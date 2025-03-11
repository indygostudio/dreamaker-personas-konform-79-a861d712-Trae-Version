
import { createContext, useContext, useState, ReactNode } from 'react';

interface VoiceModelContextType {
  modelParameters: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
  updateParameter: (key: string, value: number | boolean) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const VoiceModelContext = createContext<VoiceModelContextType | undefined>(undefined);

export const VoiceModelProvider = ({ children }: { children: ReactNode }) => {
  const [modelParameters, setModelParameters] = useState({
    stability: 0.75,
    similarity_boost: 0.75,
    style: 0.5,
    use_speaker_boost: true
  });
  const [selectedModel, setSelectedModel] = useState("eleven_multilingual_v2");

  const updateParameter = (key: string, value: number | boolean) => {
    setModelParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <VoiceModelContext.Provider 
      value={{ 
        modelParameters, 
        updateParameter, 
        selectedModel, 
        setSelectedModel 
      }}
    >
      {children}
    </VoiceModelContext.Provider>
  );
};

export const useVoiceModel = () => {
  const context = useContext(VoiceModelContext);
  if (context === undefined) {
    throw new Error('useVoiceModel must be used within a VoiceModelProvider');
  }
  return context;
};
