export const TimelineRuler = () => {
  const markers = Array.from({ length: 16 }, (_, i) => i);
  
  return (
    <div className="h-8 border-b border-konform-neon-blue/20 flex items-end">
      {markers.map((marker) => (
        <div 
          key={marker} 
          className="flex-1 border-l border-konform-neon-blue/20 pb-1"
        >
          <span className="text-xs text-konform-neon-blue/50 pl-1">
            {marker * 4}
          </span>
        </div>
      ))}
    </div>
  );
};