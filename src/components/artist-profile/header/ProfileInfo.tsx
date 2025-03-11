
import { ReactNode } from 'react';

interface ProfileInfoProps {
  name: string;
  tagline?: string;
  isExpanded: boolean;
  children?: ReactNode;
  onDoubleClick?: () => void;
}

export const ProfileInfo = ({
  name,
  tagline,
  isExpanded,
  children,
  onDoubleClick
}: ProfileInfoProps) => {
  return (
    <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-90'}`}>
      <h1 
        className="font-bold text-white drop-shadow-md text-4xl select-none cursor-pointer" 
        onDoubleClick={onDoubleClick}
      >
        {name}
      </h1>
      <p className={`text-white/80 drop-shadow-md text-lg transition-all duration-300 ${isExpanded ? 'opacity-100 max-h-20' : 'opacity-60 max-h-6 truncate'}`}>
        {tagline || ''}
      </p>
      {children}
    </div>
  );
};
