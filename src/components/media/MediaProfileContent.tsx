
import type { MediaCollection } from "@/types/media";
import { TechnicalSpecs } from "./TechnicalSpecs";

interface MediaProfileContentProps {
  mediaCollection: MediaCollection;
}

export const MediaProfileContent = ({ mediaCollection }: MediaProfileContentProps) => {
  const {
    title,
    description,
    technical_specs,
    required_tier,
    created_at
  } = mediaCollection;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{title || 'Untitled'}</h1>
          <p className="text-gray-400">{description || 'No description available'}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Added {new Date(created_at || '').toLocaleDateString()}</span>
        <span>•</span>
        <span>{required_tier || 'Free'} Tier</span>
      </div>

      {/* Technical specs */}
      {technical_specs && Object.keys(technical_specs).length > 0 && (
        <TechnicalSpecs specs={technical_specs} />
      )}
    </div>
  );
};
