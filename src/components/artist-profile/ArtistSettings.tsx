import { AccountSettings } from './AccountSettings';

interface ArtistSettingsProps {
  profile: {
    id: string;
    email?: string;
  };
}

export const ArtistSettings = ({ profile }: ArtistSettingsProps) => {
  return (
    <div className="space-y-8">
      <AccountSettings profile={profile} />
    </div>
  );
};