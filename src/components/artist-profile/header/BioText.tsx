import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface BioTextProps {
  text: string;
}

export const BioText = ({ text }: BioTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  return (
    <div className="relative">
      <p 
        className={`text-gray-300 text-lg select-none ${!isExpanded ? 'line-clamp-4' : ''}`}
      >
        {text}
      </p>
      {text.split('\n').length > 4 && (
        <Button
          variant="link"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-dreamaker-purple hover:text-dreamaker-purple/80 p-0 h-auto font-medium"
        >
          {isExpanded ? 'Less' : 'More'}
        </Button>
      )}
    </div>
  );
};