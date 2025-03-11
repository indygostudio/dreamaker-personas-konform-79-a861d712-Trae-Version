
import React from 'react';

interface TrackLyricsProps {
  showLyrics: boolean;
  trackLyrics: string;
}

export const TrackLyrics = ({ showLyrics, trackLyrics }: TrackLyricsProps) => {
  if (!showLyrics || !trackLyrics) return null;

  return (
    <div className="bg-black/40 p-4 rounded-lg mt-1 mb-3 whitespace-pre-line">
      {trackLyrics}
    </div>
  );
};
