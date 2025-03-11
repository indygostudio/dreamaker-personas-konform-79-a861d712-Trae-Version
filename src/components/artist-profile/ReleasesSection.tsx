
import React from 'react';
import { safeJsonParse } from '@/lib/utils/jsonHelpers';

interface ReleaseProps {
  release: {
    id: string;
    title: string;
    metadata: any;
    created_at: string;
  };
}

export const ReleasesSection: React.FC<ReleaseProps> = ({ release }) => {
  const metadata = safeJsonParse(release.metadata, { name: '', description: '' });
  
  return (
    <div className="bg-black/20 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{release.title}</h3>
      <div className="text-sm text-gray-400">
        <p>Name: {metadata.name || 'Unnamed'}</p>
        <p>Description: {metadata.description || 'No description'}</p>
        <p>Released: {new Date(release.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};
