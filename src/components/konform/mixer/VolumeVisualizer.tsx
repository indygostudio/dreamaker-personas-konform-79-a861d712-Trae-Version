export const VolumeVisualizer = () => {
  return (
    <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#00FF00]/20">
      <div className="grid grid-cols-3 gap-2 h-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[#00FF00]/5 rounded-lg p-2 flex items-center justify-center">
            <div className="w-full h-1 bg-[#00FF00]/20 rounded-full">
              <div 
                className="h-full bg-[#00FF00] rounded-full animate-pulse"
                style={{ width: `${Math.random() * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};