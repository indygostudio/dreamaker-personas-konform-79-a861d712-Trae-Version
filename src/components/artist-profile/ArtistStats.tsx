interface ArtistStatsProps {
  profile: {
    id: string;
  };
}

export const ArtistStats = ({ profile }: ArtistStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-black/40 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Engagement</h3>
        <div className="space-y-2">
          <p className="text-gray-400">Coming soon...</p>
        </div>
      </div>
      
      <div className="bg-black/40 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Performance</h3>
        <div className="space-y-2">
          <p className="text-gray-400">Coming soon...</p>
        </div>
      </div>
      
      <div className="bg-black/40 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Growth</h3>
        <div className="space-y-2">
          <p className="text-gray-400">Coming soon...</p>
        </div>
      </div>
    </div>
  );
};