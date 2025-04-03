
import React, { createContext, useContext, useState } from "react";

// Define the available AI services
export type AIService = {
  id: string;
  name: string;
  description: string;
};

export const AI_SERVICES: AIService[] = [
  {
    id: "runway-gen4",
    name: "Runway Gen-4",
    description: "Runway's Gen-4 video generation model"
  },
  {
    id: "kling",
    name: "Kling",
    description: "Kling video generation API"
  },
  {
    id: "midjourney",
    name: "Midjourney",
    description: "Midjourney video generation service"
  },
  {
    id: "leonardo",
    name: "Leonardo",
    description: "Leonardo AI video generator"
  },
  {
    id: "pika",
    name: "Pika",
    description: "Pika Labs video generation"
  }
];

type AIServiceContextType = {
  selectedService: AIService;
  setSelectedService: (service: AIService) => void;
};

const AIServiceContext = createContext<AIServiceContextType | undefined>(undefined);

export const AIServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedService, setSelectedService] = useState<AIService>(AI_SERVICES[0]);

  return (
    <AIServiceContext.Provider value={{ selectedService, setSelectedService }}>
      {children}
    </AIServiceContext.Provider>
  );
};

export const useAIService = () => {
  const context = useContext(AIServiceContext);
  if (context === undefined) {
    throw new Error("useAIService must be used within an AIServiceProvider");
  }
  return context;
};
