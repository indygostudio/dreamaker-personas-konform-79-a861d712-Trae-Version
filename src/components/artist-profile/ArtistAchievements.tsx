interface ArtistAchievementsProps {
  profile: {
    id: string;
  };
}

export const ArtistAchievements = ({ profile }: ArtistAchievementsProps) => {
  return (
    <div className="bg-black/40 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <p className="text-gray-400">Coming soon...</p>
      </div>
    </div>
  );
};