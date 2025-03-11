import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Plus, Image, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
interface PlaylistCreatorProps {
  personaId: string;
  onPlaylistCreated: () => void;
}
export const PlaylistCreator = ({
  personaId,
  onPlaylistCreated
}: PlaylistCreatorProps) => {
  const {
    toast
  } = useToast();
  const {
    user
  } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    if (isDialogOpen) {
      fetchPlaylists();
    }
  }, [isDialogOpen, personaId]);
  const fetchPlaylists = async () => {
    if (!personaId) return;
    try {
      const {
        data,
        error
      } = await supabase.from('playlists').select('*').eq('persona_id', personaId);
      if (error) throw error;
      setPlaylists(data || []);
      if (data && data.length > 0 && !selectedPlaylist) {
        setSelectedPlaylist(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast({
        title: "Error",
        description: "Failed to load playlists",
        variant: "destructive"
      });
    }
  };
  const handleCreatePlaylist = async () => {
    if (!personaId || !newPlaylistName.trim() || !user) return;
    setIsCreatingPlaylist(true);
    try {
      const {
        data,
        error
      } = await supabase.from('playlists').insert([{
        persona_id: personaId,
        name: newPlaylistName.trim()
      }]).select();
      if (error) throw error;
      if (data && data.length > 0) {
        toast({
          title: "Success",
          description: "Playlist created successfully"
        });
        setPlaylists([...playlists, data[0]]);
        setSelectedPlaylist(data[0].id);
        setNewPlaylistName("");
        onPlaylistCreated();
      }
    } catch (error: any) {
      console.error('Error creating playlist:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create playlist",
        variant: "destructive"
      });
    } finally {
      setIsCreatingPlaylist(false);
    }
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPlaylist) return;
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to upload files",
        variant: "destructive"
      });
      return;
    }
    setSelectedFile(file);
  };
  const handleArtworkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPlaylist) return;
    setArtworkFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setArtworkPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  const uploadTrack = async () => {
    if (!selectedFile || !selectedPlaylist || !user) return;
    setIsUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${personaId}/${crypto.randomUUID()}.${fileExt}`;
      const {
        error: uploadError
      } = await supabase.storage.from('audio_files').upload(filePath, selectedFile);
      if (uploadError) throw uploadError;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('audio_files').getPublicUrl(filePath);
      const {
        data: existingTracks,
        error: countError
      } = await supabase.from('tracks').select('id').eq('playlist_id', selectedPlaylist);
      if (countError) throw countError;
      const orderIndex = existingTracks ? existingTracks.length : 0;
      const {
        error: trackError
      } = await supabase.from('tracks').insert([{
        playlist_id: selectedPlaylist,
        title: selectedFile.name.replace(`.${fileExt}`, ''),
        audio_url: publicUrl,
        order_index: orderIndex,
        is_public: true,
        persona_id: personaId,
        user_id: user.id,
        duration: 0
      }]);
      if (trackError) throw trackError;
      if (artworkFile && selectedPlaylist) {
        await uploadArtwork();
      }
      toast({
        title: "Success",
        description: "Track uploaded successfully"
      });
      onPlaylistCreated();
      setSelectedFile(null);
      setArtworkFile(null);
      setArtworkPreview(null);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  const uploadArtwork = async () => {
    if (!artworkFile || !selectedPlaylist) return;
    try {
      const fileExt = artworkFile.name.split('.').pop();
      const filePath = `artwork/${selectedPlaylist}/${crypto.randomUUID()}.${fileExt}`;
      const {
        error: uploadError
      } = await supabase.storage.from('audio_files').upload(filePath, artworkFile);
      if (uploadError) throw uploadError;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('audio_files').getPublicUrl(filePath);
      const {
        error: updateError
      } = await supabase.from('playlists').update({
        album_artwork_url: publicUrl
      }).eq('id', selectedPlaylist);
      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error uploading artwork:', error);
      throw error;
    }
  };
  const handleDeletePlaylist = async (playlistId: string) => {
    if (!playlistId) return;
    if (!confirm("Are you sure you want to delete this playlist? All tracks in this playlist will also be deleted.")) {
      return;
    }
    try {
      const {
        error: tracksError
      } = await supabase.from('tracks').delete().eq('playlist_id', playlistId);
      if (tracksError) throw tracksError;
      const {
        error: playlistError
      } = await supabase.from('playlists').delete().eq('id', playlistId);
      if (playlistError) throw playlistError;
      toast({
        title: "Success",
        description: "Playlist deleted successfully"
      });
      setPlaylists(playlists.filter(p => p.id !== playlistId));
      if (selectedPlaylist === playlistId) {
        setSelectedPlaylist(playlists.length > 1 ? playlists[0].id : null);
      }
      onPlaylistCreated();
    } catch (error: any) {
      console.error('Error deleting playlist:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete playlist",
        variant: "destructive"
      });
    }
  };
  return <div className="bg-black/20 rounded-lg p-6">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 px-4 py-2 text-white rounded-md cursor-pointer transition-colors bg-zinc-950 hover:bg-zinc-800">
            <Plus className="h-4 w-4" />
            <span>Manage Playlists</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md mx-auto bg-gray-900 border-dreamaker-purple/30">
          <DialogHeader>
            <DialogTitle className="text-white">Manage Playlists</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-300">Create New Playlist</h3>
              <div className="flex space-x-2">
                <Input value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)} placeholder="Playlist name" className="flex-1 bg-gray-800 border-gray-700 text-white" />
                <Button onClick={handleCreatePlaylist} disabled={isCreatingPlaylist || !newPlaylistName.trim()} className="bg-dreamaker-purple hover:bg-dreamaker-purple/90">
                  {isCreatingPlaylist ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Your Playlists</h3>
              {playlists.length === 0 ? <p className="text-gray-500 text-sm">No playlists created yet</p> : <div className="space-y-2">
                  {playlists.map(playlist => <div key={playlist.id} className={`flex justify-between items-center p-2 rounded ${selectedPlaylist === playlist.id ? 'bg-gray-700' : 'bg-gray-800'} hover:bg-gray-700 cursor-pointer`} onClick={() => setSelectedPlaylist(playlist.id)}>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-600 rounded overflow-hidden mr-2 flex-shrink-0">
                          {playlist.album_artwork_url ? <img src={playlist.album_artwork_url} alt={playlist.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">
                              <Image className="w-4 h-4 text-gray-400" />
                            </div>}
                        </div>
                        <span className="text-gray-300">{playlist.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={e => {
                  e.stopPropagation();
                  handleDeletePlaylist(playlist.id);
                }} className="text-gray-400 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>)}
                </div>}
            </div>
            
            {selectedPlaylist && <div className="space-y-3 mt-6 p-3 bg-gray-800 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-300">Upload to Selected Playlist</h3>
                
                <div>
                  <Label htmlFor="track-upload" className="text-xs text-gray-400">Audio Track</Label>
                  <div className="flex items-center mt-1">
                    <input type="file" accept="audio/mpeg,audio/wav" onChange={handleFileUpload} className="hidden" id="track-upload" disabled={isUploading} />
                    <label htmlFor="track-upload" className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-600 transition-colors text-sm">
                      <Upload className="h-3 w-3" />
                      <span>{selectedFile ? selectedFile.name : "Select MP3"}</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="artwork-upload" className="text-xs text-gray-400">Album Artwork</Label>
                  <div className="flex items-center mt-1 space-x-2">
                    <input type="file" accept="image/*" onChange={handleArtworkUpload} className="hidden" id="artwork-upload" disabled={isUploading} />
                    <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center overflow-hidden">
                      {artworkPreview ? <img src={artworkPreview} alt="Preview" className="w-full h-full object-cover" /> : <Image className="h-5 w-5 text-gray-500" />}
                    </div>
                    <label htmlFor="artwork-upload" className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-600 transition-colors text-sm">
                      <Image className="h-3 w-3" />
                      <span>{artworkFile ? artworkFile.name : "Select Image"}</span>
                    </label>
                  </div>
                </div>
                
                <Button onClick={uploadTrack} disabled={isUploading || !selectedFile} className="w-full mt-2 bg-dreamaker-purple hover:bg-dreamaker-purple/90">
                  {isUploading ? "Uploading..." : "Upload to Playlist"}
                </Button>
              </div>}
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};