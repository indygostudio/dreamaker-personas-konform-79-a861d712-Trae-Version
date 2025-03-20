
import React from 'react';
import { SubscriptionTier } from '@/types/subscription';
import { Profile } from '@/types/types';

interface MediaSectionProps {
  profile?: Profile | any; // Using any as a fallback for backward compatibility
}

export const MediaSection = ({ profile }: MediaSectionProps) => {
  // Function to check if a subscription tier is valid
  const isValidSubscriptionTier = (tier: string): tier is SubscriptionTier => {
    return ['unsigned', 'indie', 'pro', 'label'].includes(tier as SubscriptionTier);
  };

  // When comparing subscription tiers
  const checkAccess = (userTier: string) => {
    // Convert to valid SubscriptionTier or default to 'unsigned'
    const validTier: SubscriptionTier = isValidSubscriptionTier(userTier) 
      ? userTier as SubscriptionTier 
      : 'unsigned';
      
    return validTier === 'label';
  };

  // When assigning a subscription tier
  const setUserSubscription = (tier: string): SubscriptionTier => {
    return isValidSubscriptionTier(tier) ? tier as SubscriptionTier : 'unsigned';
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Media</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Media items would go here */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="aspect-video bg-gray-700 rounded mb-2"></div>
          <h3 className="text-lg font-semibold">Media Title</h3>
          <p className="text-sm text-gray-400">Description of the media item</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="aspect-video bg-gray-700 rounded mb-2"></div>
          <h3 className="text-lg font-semibold">Media Title</h3>
          <p className="text-sm text-gray-400">Description of the media item</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="aspect-video bg-gray-700 rounded mb-2"></div>
          <h3 className="text-lg font-semibold">Media Title</h3>
          <p className="text-sm text-gray-400">Description of the media item</p>
        </div>
      </div>
      
      {/* Access control example */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
        {checkAccess('free') ? (
          <div className="bg-gray-800 rounded-lg p-4">
            <p>This is premium content visible only to enterprise subscribers.</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-4 opacity-50">
            <p>Upgrade to Enterprise tier to access premium content.</p>
          </div>
        )}
      </div>
    </div>
  );
};
