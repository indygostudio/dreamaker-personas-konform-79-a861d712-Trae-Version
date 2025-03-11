interface ArtistSettingsProps {
  profile: {
    id: string;
  };
}

export const ArtistSettings = ({ profile }: ArtistSettingsProps) => {
  return (
    <div className="bg-black/40 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
      <div className="space-y-6">
        <p className="text-gray-400">Coming soon...</p>
      </div>
    </div>
  );
};