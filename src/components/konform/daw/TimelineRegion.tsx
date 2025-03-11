interface TimelineRegion {
  id: string;
  startTime: number;
  duration: number;
  name: string;
  color: string;
}

interface TimelineRegionProps {
  region: TimelineRegion;
}

export const TimelineRegionComponent = ({ region }: TimelineRegionProps) => (
  <div
    className="absolute h-12 rounded-md cursor-pointer hover:brightness-110 transition-all flex items-center justify-center text-xs font-medium text-black"
    style={{
      left: `${region.startTime}%`,
      width: `${region.duration}%`,
      backgroundColor: region.color,
    }}
  >
    {region.name}
  </div>
);

export type { TimelineRegion };