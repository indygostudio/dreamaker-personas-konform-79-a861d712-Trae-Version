
import { Skeleton } from '@/components/ui/skeleton';

export const HeaderSkeleton = () => {
  return (
    <div className="relative w-full mt-16">
      <div className="h-[300px] w-full bg-gradient-to-r from-dreamaker-gray/20 to-dreamaker-dark/40 rounded-xl animate-pulse overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-dreamaker-purple/30 border-t-dreamaker-purple rounded-full animate-spin"></div>
        </div>
      </div>
      
      <div className="absolute bottom-0 w-full p-6 flex items-end justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full bg-dreamaker-gray/30" />
          <div>
            <Skeleton className="h-8 w-40 mb-2 bg-dreamaker-gray/30" />
            <Skeleton className="h-4 w-60 bg-dreamaker-gray/20" />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-md bg-dreamaker-gray/30" />
          <Skeleton className="h-9 w-24 rounded-md bg-dreamaker-gray/20" />
        </div>
      </div>
    </div>
  );
};
