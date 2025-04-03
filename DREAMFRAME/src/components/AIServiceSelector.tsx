
import React from "react";
import { useAIService, AI_SERVICES } from "../contexts/AIServiceContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const AIServiceSelector = () => {
  const { selectedService, setSelectedService } = useAIService();

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-400">AI Engine:</span>
      <div className="flex items-center">
        <Select
          value={selectedService.id}
          onValueChange={(value) => {
            const service = AI_SERVICES.find((s) => s.id === value);
            if (service) setSelectedService(service);
          }}
        >
          <SelectTrigger className="w-[140px] h-8 text-sm bg-[#222] border-[#444]">
            <SelectValue placeholder="Select AI Service" />
          </SelectTrigger>
          <SelectContent className="bg-[#222] border-[#333]">
            {AI_SERVICES.map((service) => (
              <SelectItem 
                key={service.id} 
                value={service.id}
                className="text-white hover:bg-[#333]"
              >
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400">
              <Info className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-[#222] border-[#444] text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">{selectedService.name}</h4>
              <p className="text-gray-300">{selectedService.description}</p>
              {selectedService.id === "runway-gen4" && (
                <p className="text-gray-400 text-xs">
                  Uses positive prompting and specialized syntax for creating cinematic video generation prompts.
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default AIServiceSelector;
