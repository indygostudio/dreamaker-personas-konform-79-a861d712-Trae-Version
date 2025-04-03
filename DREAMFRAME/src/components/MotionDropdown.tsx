
import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MotionOption } from "@/types/promptTypes";

interface MotionDropdownProps {
  label: string;
  id: string;
  placeholder: string;
  options: MotionOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const MotionDropdown = ({ 
  label, 
  id, 
  placeholder, 
  options, 
  value, 
  onChange, 
  required = false 
}: MotionDropdownProps) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === "custom") {
      setIsCustom(true);
      if (customValue) {
        onChange(customValue);
      } else {
        onChange("");
      }
    } else {
      setIsCustom(false);
      onChange(selectedValue);
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomValue(newValue);
    onChange(newValue);
  };

  // Determine if the current value is not in the options list
  const isValueCustom = () => {
    if (!value) return false;
    return !options.some(option => option.value === value);
  };

  // Set custom mode if value is custom and not already in custom mode
  if (isValueCustom() && !isCustom) {
    setIsCustom(true);
    setCustomValue(value);
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-md mb-2 block">
        {label} {required && <span className="text-rose-400">*</span>}
      </Label>
      
      {isCustom ? (
        <div className="space-y-2">
          <Input
            id={id}
            value={customValue}
            onChange={handleCustomChange}
            placeholder={placeholder}
            className="bg-slate-700/60 border-slate-600"
          />
          <div className="text-right">
            <button
              type="button"
              onClick={() => {
                setIsCustom(false);
                onChange("");
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              Use preset options
            </button>
          </div>
        </div>
      ) : (
        <Select value={value} onValueChange={handleSelectChange}>
          <SelectTrigger id={id} className="bg-slate-700/60 border-slate-600">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom (type your own)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default MotionDropdown;
