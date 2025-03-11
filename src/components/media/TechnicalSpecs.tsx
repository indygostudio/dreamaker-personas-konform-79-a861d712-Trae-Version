
interface TechnicalSpecsProps {
  specs: Record<string, any>;
}

export const TechnicalSpecs = ({ specs }: TechnicalSpecsProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Technical Specifications</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {specs.bpm && (
          <div className="bg-black/40 p-4 rounded-lg">
            <div className="text-sm text-gray-400">BPM</div>
            <div className="text-lg font-medium">{specs.bpm}</div>
          </div>
        )}
        {specs.key && (
          <div className="bg-black/40 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Key</div>
            <div className="text-lg font-medium">{specs.key}</div>
          </div>
        )}
        {specs.genre && (
          <div className="bg-black/40 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Genre</div>
            <div className="text-lg font-medium">{specs.genre}</div>
          </div>
        )}
        {specs.duration && (
          <div className="bg-black/40 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Duration</div>
            <div className="text-lg font-medium">{specs.duration}</div>
          </div>
        )}
      </div>
    </div>
  );
};
