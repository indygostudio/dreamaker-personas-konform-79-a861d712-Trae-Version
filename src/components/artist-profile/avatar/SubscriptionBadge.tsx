import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface SubscriptionBadgeProps {
  type: string;
  renewalDate?: string;
  dataUsage?: {
    used: number;
    total: number;
  };
}

export const SubscriptionBadge = ({ type, renewalDate, dataUsage }: SubscriptionBadgeProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="absolute top-0 right-0 bg-dreamaker-purple/20 px-2 py-1 rounded-full text-xs cursor-help">
          {type}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-black/90 border-dreamaker-purple/20">
        <div className="space-y-2">
          <p className="text-sm text-gray-300">
            Subscription renews: {renewalDate || 'N/A'}
          </p>
          {dataUsage && (
            <div className="space-y-1">
              <p className="text-sm text-gray-300">
                Data Usage: {dataUsage.used}/{dataUsage.total} GB
              </p>
              <div className="h-2 bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-dreamaker-purple rounded-full"
                  style={{ 
                    width: `${(dataUsage.used / dataUsage.total) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};