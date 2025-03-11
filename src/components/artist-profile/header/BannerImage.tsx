
import { BannerPosition } from '@/types/types';

interface BannerImageProps {
  url?: string;
  isExpanded: boolean;
  position?: BannerPosition;
  darkness?: number;
}

export const BannerImage = ({ url, isExpanded, position, darkness }: BannerImageProps) => {
  return (
    <div 
      className="h-[200px] w-full bg-gradient-to-r from-dreamaker-gray to-dreamaker-dark rounded-xl overflow-hidden transition-all duration-300"
      style={{
        height: isExpanded ? '200px' : '120px',
      }}
    >
      {url && (
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={url} 
            alt="Banner"
            className="w-full h-full object-cover" 
            style={{
              objectPosition: position ? `${position.x}% ${position.y}%` : '50% 50%',
            }}
          />
          <div 
            className="absolute inset-0 bg-black" 
            style={{
              opacity: darkness ? darkness / 100 : 0.4
            }}
          ></div>
        </div>
      )}
    </div>
  );
};
