
import { format } from "date-fns";
import { Users, Calendar } from "lucide-react";

interface HeaderInfoProps {
  name: string;
  description?: string;
  followersCount: number;
  createdAt?: string;
  isHeaderExpanded: boolean;
}

export const HeaderInfo = ({ 
  name, 
  description, 
  followersCount, 
  createdAt,
  isHeaderExpanded 
}: HeaderInfoProps) => {
  return (
    <div className={`absolute transition-all duration-300 ${
      isHeaderExpanded 
        ? 'bottom-4 left-4 max-w-2xl' 
        : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center'
    } z-20`}>
      <h1 className="text-4xl font-bold text-white mb-2 select-none">{name}</h1>
      {isHeaderExpanded && (
        <div className="space-y-3 select-none">
          {description && (
            <p className="text-gray-300 text-lg">{description}</p>
          )}
          <div className="flex items-center gap-6 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{followersCount || 0} followers</span>
            </div>
            {createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {format(new Date(createdAt), 'MMMM yyyy')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
