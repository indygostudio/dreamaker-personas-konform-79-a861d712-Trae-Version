import { useState, useEffect, useRef } from "react";
import { TrackItem } from "@/components/artist-profile/TrackItem";
import { MusicPlayer } from "@/components/persona/profile/MusicPlayer";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Music, 
  Image as ImageIcon, 
  Trash, 
  Edit, 
  Plus, 
  Save,
  X,
  ListMusic,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AudioUploadSection } from "@/components/artist-profile/form/AudioUploadSection";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Track } from "@/types/track";
import type { Persona } from "@/types/persona";
import type { Playlist } from "@/types/playlist";

interface AudioSectionProps {
  persona: Persona | null;
  selectedModel: string;
}

export const AudioSection = ({ persona, selectedModel }: AudioSectionProps) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showEditPlaylist, setShowEditPlaylist] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showTrackArtwork, setShowTrackArtwork] = useState(false);
  const [currentEditTrack, setCurrentEditTrack] = useState<Track | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [createPlaylistName, setCreatePlaylistName] = useState("");
  const [createAlbumTitle, setCreateAlbumTitle] = useState("");
  const [trackArtworkFile, setTrackArtworkFile] = useState<File | null>(null);
  const [albumArtworkFile, setAlbumArtworkFile] = useState<File | null>(null);
  const [albumArtworkPreview, setAlbumArtworkPreview] = useState<string | null>(null);
  const [trackArtworkPreview, setTrackArtworkPreview] = useState<string | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const albumArtworkInputRef = useRef<HTMLInputElement>(null);

  const { data: playlists = [], isLoading: isLoadingPlaylists, refetch: refetchPlaylists } = useQuery<Playlist[]>({
    queryKey: ['persona-playlists', persona?.id],
    queryFn: async () => {
      if (!persona?.id) return [];

      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('persona_id', persona.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching playlists:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!persona?.id
  });

  useEffect(() => {
    if (playlists.length > 0 && !selectedPlaylistId) {
      const defaultPlaylist = playlists.find(p => p.is_default) || playlists[0];
      setSelectedPlaylistId(defaultPlaylist.id);
    }
  }, [playlists, selectedPlaylistId]);

  const { data: currentPlaylist = null, isLoading: isLoadingCurrentPlaylist } = useQuery<Playlist | null>({
    queryKey: ['current-playlist', selectedPlaylistId],
    queryFn: async () => {
      if (!selectedPlaylistId) return null;

      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('id', selectedPlaylistId)
        .single();

      if (error) {
        console.error('Error fetching playlist:', error);
        return null;
      }

      return data;
    },
    enabled: !!selectedPlaylistId
  });

  useEffect(() => {
    if (currentPlaylist) {
      setNewPlaylistName(currentPlaylist.name || "My Playlist");
      setNewAlbumTitle(currentPlaylist.album_title || "My Album");
      setAlbumArtworkPreview(currentPlaylist.album_artwork_url || null);
    }
  }, [currentPlaylist]);

  const { data: tracks = [], isLoading, refetch } = useQuery({
    queryKey: ['playlist-tracks', selectedPlaylistId],
    queryFn: async () => {
      if (!selectedPlaylistId) return [];

      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('playlist_id', selectedPlaylistId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((item: any): Track => ({
        id: item.id,
        title: item.title,
        audio_url: item.audio_url,
        album_artwork_url: item.album_artwork_url || '/placeholder.svg',
        duration: item.duration || 0,
        order_index: item.order_index || 0,
        is_public: item.is_public,
        playlist_id: item.playlist_id,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    },
    enabled: !!selectedPlaylistId
  });

  const handleAudioSuccess = async (url: string, trimData?: { start: number; end: number }) => {
    if (!persona?.id || !selectedPlaylistId) return;

    try {
      const { error } = await supabase
        .from('tracks')
        .insert({
          title: 'New Track',
          audio_url: url,
          playlist_id: selectedPlaylistId,
          is_public: true,
          order_index: tracks.length,
          trim_start: trimData?.start,
          trim_end: trimData?.end
        });

      if (error) throw error;

      toast.success("Track added successfully");
      refetch();
    } catch (error) {
      console.error('Error saving track:', error);
      toast.error("Failed to save track");
    }
  };

  const handleTrackPlay = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    if (!confirm("Are you sure you want to delete this track?")) return;

    try {
      const { error } = await supabase
        .from('tracks')
        .delete()
        .eq('id', trackId);

      if (error) throw error;

      toast.success("Track deleted successfully");
      
      if (currentTrack?.id === trackId) {
        setCurrentTrack(null);
        setIsPlaying(false);
      }
      
      refetch();
    } catch (error) {
      console.error('Error deleting track:', error);
      toast.error("Failed to delete track");
    }
  };

  const handleEditPlaylist = async () => {
    if (!currentPlaylist?.id) return;

    try {
      let album_artwork_url = currentPlaylist.album_artwork_url;

      if (albumArtworkFile) {
        const fileName = `album_${currentPlaylist.id}_${Date.now()}.${albumArtworkFile.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage
          .from('audio-previews')
          .upload(fileName, albumArtworkFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('audio-previews')
          .getPublicUrl(fileName);

        album_artwork_url = publicUrl;
      }

      const { error } = await supabase
        .from('playlists')
        .update({
          name: newPlaylistName,
          album_title: newAlbumTitle,
          album_artwork_url
        })
        .eq('id', currentPlaylist.id);

      if (error) throw error;

      toast.success("Playlist updated successfully");
      setShowEditPlaylist(false);
      refetchPlaylists();
    } catch (error) {
      console.error('Error updating playlist:', error);
      toast.error("Failed to update playlist");
    }
  };

  const handleCreatePlaylist = async () => {
    if (!persona?.id) return;

    try {
      let album_artwork_url = null;

      if (albumArtworkFile) {
        const fileName = `album_new_${Date.now()}.${albumArtworkFile.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage
          .from('audio-previews')
          .upload(fileName, albumArtworkFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('audio-previews')
          .getPublicUrl(fileName);

        album_artwork_url = publicUrl;
      }

      const { data, error } = await supabase
        .from('playlists')
        .insert({
          name: createPlaylistName || "New Playlist",
          album_title: createAlbumTitle || "New Album",
          album_artwork_url,
          persona_id: persona.id,
          is_default: playlists.length === 0
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Playlist created successfully");
      setShowCreatePlaylist(false);
      setCreatePlaylistName("");
      setCreateAlbumTitle("");
      setAlbumArtworkFile(null);
      setAlbumArtworkPreview(null);
      await refetchPlaylists();
      
      if (data) {
        setSelectedPlaylistId(data.id);
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error("Failed to create playlist");
    }
  };

  const handleDeletePlaylist = async () => {
    if (!currentPlaylist?.id) return;
    if (!confirm("Are you sure you want to delete this playlist? All tracks will be removed.")) return;

    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', currentPlaylist.id);

      if (error) throw error;

      toast.success("Playlist deleted successfully");
      setCurrentTrack(null);
      setIsPlaying(false);
      setShowEditPlaylist(false);
      
      await refetchPlaylists();
      
      if (playlists.length > 1) {
        const remainingPlaylists = playlists.filter(p => p.id !== currentPlaylist.id);
        if (remainingPlaylists.length > 0) {
          setSelectedPlaylistId(remainingPlaylists[0].id);
        } else {
          setSelectedPlaylistId(null);
        }
      } else {
        setSelectedPlaylistId(null);
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error("Failed to delete playlist");
    }
  };

  const handleUpdateTrackArtwork = async () => {
    if (!currentEditTrack || !trackArtworkFile) return;

    try {
      const fileName = `track_${currentEditTrack.id}_${Date.now()}.${trackArtworkFile.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from('audio-previews')
        .upload(fileName, trackArtworkFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('audio-previews')
        .getPublicUrl(fileName);

      const { error } = await supabase
        .from('tracks')
        .update({
          album_artwork_url: publicUrl
        })
        .eq('id', currentEditTrack.id);

      if (error) throw error;

      toast.success("Track artwork updated successfully");
      setShowTrackArtwork(false);
      setTrackArtworkFile(null);
      setTrackArtworkPreview(null);
      refetch();
    } catch (error) {
      console.error('Error updating track artwork:', error);
      toast.error("Failed to update track artwork");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const audioFiles = files.filter(file => 
      file.type.startsWith('audio/') || file.name.endsWith('.mp3')
    );

    if (audioFiles.length === 0) {
      toast.error("Please drop only audio files");
      return;
    }

    if (!selectedPlaylistId) {
      toast.error("No playlist selected");
      return;
    }

    for (const file of audioFiles) {
      toast.loading(`Uploading ${file.name}...`, { id: file.name });
      
      try {
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError, data } = await supabase.storage
          .from('audio-previews')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('audio-previews')
          .getPublicUrl(fileName);

        const { error: dbError } = await supabase
          .from('tracks')
          .insert({
            title: file.name.replace(/\.[^/.]+$/, ""),
            audio_url: publicUrl,
            playlist_id: selectedPlaylistId,
            is_public: true,
            order_index: tracks.length
          });

        if (dbError) throw dbError;

        toast.success(`Uploaded ${file.name}`, { id: file.name });
        refetch();
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        toast.error(`Failed to upload ${file.name}`, { id: file.name });
      }
    }
  };

  const handleAlbumArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setAlbumArtworkFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setAlbumArtworkPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTrackArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setTrackArtworkFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setTrackArtworkPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSetDefaultPlaylist = async (playlistId: string) => {
    try {
      await supabase
        .from('playlists')
        .update({ is_default: false })
        .eq('persona_id', persona?.id);
      
      const { error } = await supabase
        .from('playlists')
        .update({ is_default: true })
        .eq('id', playlistId);

      if (error) throw error;
      
      toast.success("Default playlist updated");
      refetchPlaylists();
    } catch (error) {
      console.error('Error setting default playlist:', error);
      toast.error("Failed to update default playlist");
    }
  };

  useEffect(() => {
    if (tracks.length > 0 && !currentTrack) {
      setCurrentTrack(tracks[0]);
    }
  }, [tracks, currentTrack]);

  if (isLoading || isLoadingPlaylists || isLoadingCurrentPlaylist) {
    return <div className="text-center py-8 text-gray-400">Loading audio content...</div>;
  }

  return (
    <div 
      className="space-y-4 pb-28"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Audio Tracks</h2>
        </div>
        
        <div className="flex items-center gap-4">
          {selectedPlaylistId && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowEditPlaylist(true)}
              className="text-dreamaker-purple hover:text-dreamaker-purple/80"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
          
          {playlists.length > 0 && (
            <div className="flex items-center gap-2">
              <Select
                value={selectedPlaylistId || ''}
                onValueChange={(value) => setSelectedPlaylistId(value)}
              >
                <SelectTrigger className="w-[200px] bg-black/50 border-gray-700">
                  <SelectValue placeholder="Select a playlist" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {playlists.map((playlist) => (
                    <SelectItem key={playlist.id} value={playlist.id} className="text-white">
                      {playlist.name} {playlist.is_default && "(Default)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedPlaylistId && !currentPlaylist?.is_default && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSetDefaultPlaylist(selectedPlaylistId)}
                  className="text-green-500 hover:text-green-400"
                >
                  Set as Default
                </Button>
              )}
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowCreatePlaylist(true);
              setCreatePlaylistName("");
              setCreateAlbumTitle("");
              setAlbumArtworkFile(null);
              setAlbumArtworkPreview(null);
            }}
            className="flex items-center gap-1 bg-black/40 border-gray-700 text-white"
          >
            <ListMusic className="h-4 w-4" />
            <Plus className="h-3 w-3" />
            New Playlist
          </Button>
          
          {persona && selectedPlaylistId && (
            <AudioUploadSection
              audioUrl=""
              profileId={selectedPlaylistId}
              userId={persona.user_id}
              onSuccess={handleAudioSuccess}
            />
          )}
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-4 flex items-center gap-2">
        <Music className="w-4 h-4 text-dreamaker-purple" />
        Drag and drop audio files directly into this area to add them to your playlist
      </div>

      {isDragging && (
        <div className="border-2 border-dashed border-dreamaker-purple/50 rounded-lg p-8 flex items-center justify-center bg-black/30">
          <div className="text-center">
            <Music className="w-12 h-12 mx-auto mb-2 text-dreamaker-purple opacity-70" />
            <p className="text-white text-lg">Drop audio files to upload</p>
          </div>
        </div>
      )}

      {selectedPlaylistId && tracks.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No tracks yet in this playlist. Upload your first audio track!
        </div>
      ) : !selectedPlaylistId && playlists.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No playlists yet. Create your first playlist!
        </div>
      ) : !selectedPlaylistId ? (
        <div className="text-center py-8 text-gray-400">
          Select a playlist to view tracks
        </div>
      ) : (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {currentPlaylist && (
              <Collapsible
                open={isPlaylistOpen}
                onOpenChange={setIsPlaylistOpen}
                className="w-full"
              >
                <CollapsibleTrigger className="w-full">
                  <div 
                    className="bg-black/40 p-4 rounded-lg mb-4 cursor-pointer flex items-center justify-between"
                    onDoubleClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-800 rounded overflow-hidden">
                        <img 
                          src={currentPlaylist.album_artwork_url || '/placeholder.svg'} 
                          alt={currentPlaylist.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-left">{currentPlaylist.name}</h3>
                        <p className="text-gray-400 text-sm text-left">{currentPlaylist.album_title}</p>
                        <p className="text-gray-500 text-xs mt-1 text-left">{tracks.length} tracks</p>
                      </div>
                    </div>
                    {isPlaylistOpen ? 
                      <ChevronDown className="h-5 w-5 text-gray-400" /> : 
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    }
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-4">
                    {tracks.map((track) => (
                      <div key={track.id} className="group relative">
                        <TrackItem
                          id={track.id}
                          track={track}
                          currentTrack={currentTrack}
                          isPlaying={isPlaying && currentTrack?.id === track.id}
                          onTrackPlay={handleTrackPlay}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-2 z-10">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentEditTrack(track);
                              setTrackArtworkPreview(track.album_artwork_url);
                              setShowTrackArtwork(true);
                            }}
                            className="bg-black/50 hover:bg-black/70 text-white"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTrack(track.id);
                            }}
                            className="bg-black/50 hover:bg-red-600/70 text-white"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </ScrollArea>
      )}

      {tracks.length > 0 && currentTrack && (
        <MusicPlayer
          currentTrack={currentTrack}
          tracks={tracks}
          isPlaying={isPlaying}
          isShuffled={isShuffled}
          isLooping={isLooping}
          setIsPlaying={setIsPlaying}
          setIsShuffled={setIsShuffled}
          setIsLooping={setIsLooping}
          onTrackSelect={(track: Track) => {
            setCurrentTrack(track);
            setIsPlaying(true);
          }}
          trimStart={currentTrack.trim_start}
          trimEnd={currentTrack.trim_end}
        />
      )}

      <Dialog open={showEditPlaylist} onOpenChange={setShowEditPlaylist}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="playlistName">Playlist Name</Label>
              <Input
                id="playlistName"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="albumTitle">Album Title</Label>
              <Input
                id="albumTitle"
                value={newAlbumTitle}
                onChange={(e) => setNewAlbumTitle(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="albumArtwork">Album Artwork</Label>
              <div className="flex items-center gap-4">
                <div 
                  className="w-24 h-24 bg-gray-800 flex items-center justify-center rounded cursor-pointer border border-gray-700"
                  onClick={() => albumArtworkInputRef.current?.click()}
                >
                  {albumArtworkPreview ? (
                    <img 
                      src={albumArtworkPreview} 
                      alt="Album Artwork" 
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-500" />
                  )}
                </div>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => albumArtworkInputRef.current?.click()}
                >
                  Choose Image
                </Button>
                <input
                  ref={albumArtworkInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAlbumArtworkChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="destructive" onClick={handleDeletePlaylist}>
              <Trash className="w-4 h-4 mr-2" />
              Delete Playlist
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setShowEditPlaylist(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditPlaylist}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreatePlaylist} onOpenChange={setShowCreatePlaylist}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create New Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="createPlaylistName">Playlist Name</Label>
              <Input
                id="createPlaylistName"
                value={createPlaylistName}
                onChange={(e) => setCreatePlaylistName(e.target.value)}
                placeholder="My Playlist"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="createAlbumTitle">Album Title</Label>
              <Input
                id="createAlbumTitle"
                value={createAlbumTitle}
                onChange={(e) => setCreateAlbumTitle(e.target.value)}
                placeholder="My Album"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="createAlbumArtwork">Album Artwork</Label>
              <div className="flex items-center gap-4">
                <div 
                  className="w-24 h-24 bg-gray-800 flex items-center justify-center rounded cursor-pointer border border-gray-700"
                  onClick={() => albumArtworkInputRef.current?.click()}
                >
                  {albumArtworkPreview ? (
                    <img 
                      src={albumArtworkPreview} 
                      alt="Album Artwork" 
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-500" />
                  )}
                </div>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => albumArtworkInputRef.current?.click()}
                >
                  Choose Image
                </Button>
                <input
                  ref={albumArtworkInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAlbumArtworkChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreatePlaylist(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePlaylist}>
              <Save className="w-4 h-4 mr-2" />
              Create Playlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showTrackArtwork} onOpenChange={setShowTrackArtwork}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Track Artwork</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="trackArtwork">Update Artwork</Label>
              <div className="flex items-center gap-4">
                <div 
                  className="w-32 h-32 bg-gray-800 flex items-center justify-center rounded cursor-pointer border border-gray-700"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {trackArtworkPreview ? (
                    <img 
                      src={trackArtworkPreview} 
                      alt="Track Artwork" 
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-500" />
                  )}
                </div>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleTrackArtworkChange}
                  style={{ display: 'none' }}
                />
              </div>
              {currentEditTrack && (
                <p className="text-sm text-gray-400 mt-2">
                  For track: {currentEditTrack.title}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTrackArtwork(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTrackArtwork} disabled={!trackArtworkFile}>
              <Save className="w-4 h-4 mr-2" />
              Save Artwork
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
