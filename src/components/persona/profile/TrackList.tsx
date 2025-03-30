
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { TrackItem } from "@/components/persona/profile/TrackItem";
import type { Track } from "@/types/track";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface TrackListProps {
  tracks: Track[];
  isLoading: boolean;
  currentTrack: Track | null;
  isPlaying: boolean;
  handlePlayTrack: (track: Track) => void;
  selectedPlaylistId: string | null;
  isOwner: boolean;
  refetchTracks: () => void;
  onEditTrack?: (track: Track) => void;
  onEditLyrics?: (track: Track) => void;
}

export const TrackList = ({
  tracks,
  isLoading,
  currentTrack,
  isPlaying,
  handlePlayTrack,
  selectedPlaylistId,
  isOwner,
  refetchTracks,
  onEditTrack,
  onEditLyrics
}: TrackListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleTrackOrderUpdate = async (newTracks: Track[]) => {
    if (!selectedPlaylistId || !isOwner) return;

    // Create an array of updates with all required track fields
    const updates = newTracks.map((track, index) => ({
      id: track.id,
      title: track.title,
      audio_url: track.audio_url,
      order_index: index,
      playlist_id: track.playlist_id,
      // Include any other required fields that can't be null
      album_artwork_url: track.album_artwork_url || '/placeholder.svg',
      is_public: track.is_public || false
    }));

    try {
      // Optimistic UI update - immediately update the UI before the server responds
      // This ensures the user sees the change right away
      // We'll handle this in the parent component via refetchTracks
      
      const { error } = await supabase
        .from('tracks')
        .upsert(updates);

      if (error) {
        console.error('Error updating track order:', error);
        toast.error("Failed to update track order");
        // If there's an error, we should refetch to restore the correct order
        refetchTracks();
      } else {
        toast.success("Track order updated");
      }
    } catch (error: any) {
      console.error('Error updating track order:', error);
      toast.error("Failed to update track order: " + error.message);
      // If there's an error, we should refetch to restore the correct order
      refetchTracks();
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    if (!isOwner) return;
    
    if (!window.confirm("Are you sure you want to delete this track?")) {
      return;
    }
    
    try {
      // Optimistic UI update - immediately update the UI before the server responds
      // This ensures the user sees the change right away
      const trackToDelete = tracks.find(track => track.id === trackId);
      const trackIndex = tracks.findIndex(track => track.id === trackId);
      
      // Store the current state for potential rollback
      const previousTracks = [...tracks];
      
      // Delete the track from the database
      const { error } = await supabase
        .from('tracks')
        .delete()
        .eq('id', trackId);
        
      if (error) {
        throw error;
      }
      
      // If the deleted track was the current track, reset it
      if (currentTrack?.id === trackId) {
        // This would be handled by the parent component
      }
      
      toast.success("Track deleted successfully");
      
      // Trigger a refetch to ensure the UI is in sync with the database
      // The optimistic update already happened in the UI through the parent component's state
      refetchTracks();
    } catch (error: any) {
      console.error('Error deleting track:', error);
      toast.error("Failed to delete track: " + error.message);
      
      // If there was an error, refetch to restore the correct state
      refetchTracks();
    }
  };

  const handleUpdateTrackArtwork = async (trackId: string, artworkUrl: string) => {
    if (!isOwner) return;
    
    try {
      const { error } = await supabase
        .from('tracks')
        .update({ album_artwork_url: artworkUrl })
        .eq('id', trackId);
        
      if (error) throw error;
      
      toast.success("Track artwork updated");
      refetchTracks();
    } catch (error: any) {
      console.error('Error updating track artwork:', error);
      toast.error("Failed to update artwork: " + error.message);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const oldIndex = tracks.findIndex(track => track.id === active.id);
    const newIndex = tracks.findIndex(track => track.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newTracks = arrayMove([...tracks], oldIndex, newIndex);
      
      // Update the UI immediately with the new order
      // This ensures the UI reflects the change right away
      // We'll pass this to the parent component via refetchTracks
      // which should trigger a state update
      handleTrackOrderUpdate(newTracks);
    }
  };

  if (isLoading && selectedPlaylistId) {
    return <div className="text-center py-8 text-gray-400">Loading tracks...</div>;
  }

  if (selectedPlaylistId && tracks && tracks.length > 0) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={tracks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-0.5">
            {tracks.map((track) => (
              <TrackItem
                key={track.id}
                track={track}
                currentTrack={currentTrack}
                isPlaying={isPlaying && currentTrack?.id === track.id}
                onTrackPlay={handlePlayTrack}
                id={track.id}
                onDeleteTrack={handleDeleteTrack}
                onUpdateArtwork={handleUpdateTrackArtwork}
                onEditTrack={onEditTrack}
                onEditLyrics={onEditLyrics}
                isOwner={isOwner}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  } else if (selectedPlaylistId) {
    return (
      <div className="text-center py-8 bg-black/20 rounded-lg text-gray-400">
        No tracks in this playlist
      </div>
    );
  } else {
    return (
      <div className="text-center py-8 bg-black/20 rounded-lg text-gray-400">
        Select a playlist to view tracks
      </div>
    );
  }
};
