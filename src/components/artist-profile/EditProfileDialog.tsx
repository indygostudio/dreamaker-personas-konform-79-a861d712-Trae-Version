import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AvatarUpload } from "@/components/persona/AvatarUpload";
import { Switch } from "@/components/ui/switch";
import { Upload, X } from "lucide-react";
import { PersonaType } from "@/types/persona";
import { ProfileForm } from "./dialog/ProfileForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BannerUpload } from "./dialog/BannerUpload";
import type { BannerPosition } from "@/types/types";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: {
    id: string;
    username: string;
    avatar_url: string;
    is_public?: boolean;
    banner_url?: string;
    persona_types?: PersonaType[];
  };
  onSuccess: () => void;
}

// Add a custom logging wrapper around Dialog
const DebugDialog = ({ open, onOpenChange, children, ...props }) => {
  console.log("DebugDialog rendering with open:", open);
  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      {children}
    </Dialog>
  );
};

export const EditProfileDialog = ({
  open,
  onOpenChange,
  profile,
  onSuccess,
}: EditProfileDialogProps) => {
  console.log("EditProfileDialog rendered with open:", open, "profile ID:", profile?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [profileType, setProfileType] = useState<PersonaType[]>([]);
  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Initialize additional state variables needed for ProfileForm
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [bannerPosition, setBannerPosition] = useState<BannerPosition>({ x: 50, y: 50 });
  const [darknessFactor, setDarknessFactor] = useState(0);
  const [genre, setGenre] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  
  // Update state when profile changes or dialog opens
  useEffect(() => {
    if (profile && open) {
      setUsername(profile.username || "");
      setAvatarUrl(profile.avatar_url || "");
      setBannerUrl(profile.banner_url || "");
      setIsPublic(profile.is_public || false);
      setProfileType(profile.persona_types || []);
    }
  }, [profile, open]);
  
  // Map profile_type from database to our app's persona types
  const mapProfileTypeToPersonaType = (profileType: string | null): PersonaType[] => {
    switch (profileType) {
      case "writer":
        return ["AI_WRITER"];
      case "mixer":
        return ["AI_MIXER"];
      case "musician":
        return ["AI_INSTRUMENTALIST"]; // Default musician type
      default:
        return []; // Empty array if no match
    }
  };

  // Extract persona type and subtype from interests array
  const extractPersonaFromInterests = (interests: string[] | null): {
    personaType: PersonaType | null;
    subtype: string | null;
  } => {
    if (!interests || !interests.length) {
      return { personaType: null, subtype: null };
    }
    
    // Find the persona_type entry
    const personaTypeEntry = interests.find(i => i.startsWith('persona_type:'));
    const subtypeEntry = interests.find(i => i.startsWith('subtype:'));
    
    const personaType = personaTypeEntry ? 
      personaTypeEntry.replace('persona_type:', '') as PersonaType : null;
    
    const subtype = subtypeEntry ? 
      subtypeEntry.replace('subtype:', '') : null;
    
    return { personaType, subtype };
  };

  // Load profile data when component mounts or dialog opens
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profile?.id || !open) return;
      
      console.log("Fetching profile data for ID:", profile.id);
      
      try {
        // First, check if the profile exists
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", profile.id)
          .single();
          
        if (error) {
          console.error("Error fetching profile data:", error);
          
          // Only set default values if it's a "not found" error
          if (error.code === 'PGRST116') {
            console.log("No profile found in database - using default values");
            
            // Use profile values as defaults
            setUsername(profile.username || "");
            setDisplayName(profile.username || "");
            setAvatarUrl(profile.avatar_url || "");
            setBannerUrl(profile.banner_url || "");
            setBio("");
            setVideoUrl("");
            setBannerPosition({ x: 50, y: 50 });
            setDarknessFactor(0);
            setGenre([]);
            setLocation("");
            
            // If persona_types is provided, use it
            if (profile.persona_types && profile.persona_types.length > 0) {
              setProfileType(profile.persona_types);
            }
            
            return;
          } else {
            throw error;
          }
        }
        
        // Profile found, map the data
        if (data) {
          console.log("Profile data fetched from database:", data);
          
          setUsername(data.username || profile.username || "");
          setDisplayName(data.display_name || profile.username || "");
          setAvatarUrl(data.avatar_url || profile.avatar_url || "");
          setBannerUrl(data.banner_url || profile.banner_url || "");
          setBio(data.bio || "");
          setVideoUrl(data.video_url || "");
          setBannerPosition(data.banner_position || { x: 50, y: 50 });
          setDarknessFactor(data.darkness_factor || 0);
          setGenre(data.genre || []);
          setLocation(data.location || "");
          setIsPublic(data.is_public === true);
          
          // First try to get the persona type from interests
          const { personaType, subtype } = extractPersonaFromInterests(data.interests);
          
          if (personaType) {
            console.log("Found exact persona type in interests:", personaType);
            setProfileType([personaType]);
            
            // Also restore subtype if available
            if (subtype) {
              setSelectedSubtype(subtype);
            }
          } else {
            // Fall back to mapping from profile_type
            const mappedPersonaTypes = mapProfileTypeToPersonaType(data.profile_type);
            if (mappedPersonaTypes.length > 0) {
              setProfileType(mappedPersonaTypes);
            } else if (profile.persona_types && profile.persona_types.length > 0) {
              // Fallback to profile.persona_types if mapping fails
              setProfileType(profile.persona_types);
            }
          }
        }
      } catch (error) {
        console.error("Error in fetchProfileData:", error);
        toast({
          title: "Error",
          description: "Could not load profile data. Using default values.",
          variant: "destructive"
        });
        
        // Set minimal defaults on error
        setUsername(profile.username || "");
        setDisplayName(profile.username || "");
        setAvatarUrl(profile.avatar_url || "");
        setBannerUrl(profile.banner_url || "");
      }
    };
    
    fetchProfileData();
  }, [profile, open, toast]);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("persona_avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("persona_avatars")
        .getPublicUrl(filePath);

      setBannerUrl(publicUrl);
      toast({
        title: "Success",
        description: "Banner uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast({
        title: "Error",
        description: "Failed to upload banner",
        variant: "destructive",
      });
    }
  };

  // Map the persona type to profile type for database
  const mapPersonaTypeToProfileType = (personaType: PersonaType | null): string => {
    switch (personaType) {
      case "AI_WRITER":
        return "writer";
      case "AI_MIXER":
      case "AI_AUDIO_ENGINEER":
        return "mixer";
      case "AI_VOCALIST":
      case "AI_INSTRUMENTALIST":
      case "AI_PRODUCER":
      case "AI_COMPOSER":
      case "AI_ARRANGER":
      case "AI_DJ":
      case "AI_SOUND":
        return "musician";
      default:
        return "musician"; // Default value
    }
  };
  
  const prepareProfileDataForSave = () => {
    // Get the mapped profile type value for database
    const profileTypeValue = mapPersonaTypeToProfileType(profileType[0]);
    
    // Store the exact persona type and subtype in the interests array
    // Format: "persona_type:AI_AUDIO_ENGINEER", "subtype:Studio Engineer"
    const interests = [
      `persona_type:${profileType[0]}`,
      selectedSubtype ? `subtype:${selectedSubtype}` : null
    ].filter(Boolean) as string[];
    
    console.log('Storing detailed persona info in interests:', { 
      profileType: profileType[0], 
      subtype: selectedSubtype,
      interests 
    });
    
    return {
      id: profile.id,
      username,
      display_name: displayName,
      avatar_url: avatarUrl,
      banner_url: bannerUrl, 
      banner_position: bannerPosition,
      darkness_factor: darknessFactor,
      bio,
      video_url: videoUrl,
      is_public: isPublic,
      profile_type: profileTypeValue,
      genre: genre,
      location,
      // Store detailed persona information in interests field
      interests: interests
    };
  };

  // Function to update profile through Auth API as a last resort
  const updateProfileThroughAuth = async (profileData: any) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          username: profileData.username,
          display_name: profileData.display_name,
          avatar_url: profileData.avatar_url,
          persona_type: profileType[0],
          subtype: selectedSubtype
        }
      });
      
      if (error) {
        console.error("Auth update failed:", error);
        return { success: false, error };
      }
      
      console.log("Profile saved through Auth API");
      return { success: true, data };
    } catch (error) {
      console.error("Error in Auth update:", error);
      return { success: false, error };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting profile form with ID:", profile.id);

    try {
      // Prepare the data with consistent format
      const profileData = prepareProfileDataForSave();
      console.log("Profile data prepared for save:", profileData);
      
      // Try using insert with direct user_id reference
      const { error } = await supabase
        .from("profiles")
        .upsert({
          ...profileData,
          user_id: profile.id, // Explicitly set the user_id to match auth
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id',
          ignoreDuplicates: false,
        });

      if (error) {
        console.error("Error with direct update:", error);
        
        // Fallback: Try using Supabase's RPC function which can bypass RLS
        const { error: rpcError } = await supabase.rpc('update_profile', {
          profile_id: profile.id,
          profile_data: {
            ...profileData,
            user_id: profile.id,
            updated_at: new Date().toISOString()
          }
        });
        
        if (rpcError) {
          // Last resort: Try inserting into personas table instead
          console.error("RPC approach failed:", rpcError);
          const { error: personaError } = await supabase
            .from("personas")
            .upsert({
              id: profile.id,
              user_id: profile.id, // Set user_id to match id
              name: displayName || username,
              username: username,
              display_name: displayName,
              avatar_url: avatarUrl,
              banner_url: bannerUrl,
              bio: bio,
              description: bio, // Include both bio and description
              type: profileType[0] || 'AI_CHARACTER',
              subtype: selectedSubtype,
              genres: genre,
              is_public: isPublic,
              updated_at: new Date().toISOString(),
              created_at: new Date().toISOString()
            }, {
              onConflict: 'id',
              ignoreDuplicates: false,
            });
            
          if (personaError) {
            console.error("Persona update also failed:", personaError);
            
            // Last resort: try Auth API
            const authResult = await updateProfileThroughAuth(profileData);
            if (!authResult.success) {
              throw new Error("All update methods failed");
            }
          } else {
            console.log("Profile saved through personas table");
          }
        } else {
          console.log("Profile saved through RPC function");
        }
      } else {
        console.log("Profile saved successfully with direct update");
      }

      // Show success message regardless of which method worked
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get subtypes based on selected persona type
  const getSubtypeOptions = (type: PersonaType | null) => {
    switch (type) {
      case "AI_CHARACTER":
        return [
          { label: "All Characters", value: null },
          { label: "Ordinary Human", value: "Ordinary Human" },
          { label: "Superhuman", value: "Superhuman" },
          { label: "Mutants", value: "Mutants" },
          { label: "Cyborgs", value: "Cyborgs" },
          { label: "Clones", value: "Clones" },
          { label: "Psychics", value: "Psychics" },
          { label: "Gods & Deities", value: "Gods & Deities" },
          { label: "Angels & Demons", value: "Angels & Demons" },
          { label: "Ghosts & Spirits", value: "Ghosts & Spirits" },
          { label: "Vampires", value: "Vampires" },
          { label: "Werewolves", value: "Werewolves" },
          { label: "Witches & Warlocks", value: "Witches & Warlocks" },
          { label: "Fairies & Elves", value: "Fairies & Elves" },
          { label: "Zombies", value: "Zombies" },
          { label: "Classic Monsters", value: "Classic Monsters" },
          { label: "Dragons", value: "Dragons" },
          { label: "Kaiju", value: "Kaiju" },
          { label: "Cryptids", value: "Cryptids" },
          { label: "Shape-shifters", value: "Shape-shifters" },
          { label: "Aliens", value: "Aliens" },
          { label: "Artificial Intelligence (AI)", value: "Artificial Intelligence (AI)" },
          { label: "Androids & Robots", value: "Androids & Robots" },
          { label: "Extraterrestrial Parasites", value: "Extraterrestrial Parasites" },
          { label: "Demi-Humans", value: "Demi-Humans" },
          { label: "Elementals", value: "Elementals" },
          { label: "Golems", value: "Golems" },
          { label: "Chimeras", value: "Chimeras" },
          { label: "Cosmic & Abstract Entities", value: "Cosmic & Abstract Entities" },
          { label: "Celestial Beings", value: "Celestial Beings" }
        ];
      case "AI_VOCALIST":
        return [
          { label: "All Voice Types", value: null },
          { label: "Bass", value: "Bass" },
          { label: "Baritone", value: "Baritone" },
          { label: "Tenor", value: "Tenor" },
          { label: "Countertenor", value: "Countertenor" },
          { label: "Contralto", value: "Contralto" },
          { label: "Mezzo-Soprano", value: "Mezzo-Soprano" },
          { label: "Soprano", value: "Soprano" },
          { label: "Raspy", value: "Raspy" },
          { label: "Breathy", value: "Breathy" },
          { label: "Nasal", value: "Nasal" },
          { label: "Operatic", value: "Operatic" },
          { label: "Falsetto", value: "Falsetto" },
          { label: "Growling/Screaming", value: "Growling/Screaming" },
          { label: "Narrator/Storyteller", value: "Narrator/Storyteller" },
          { label: "Whispery/ASMR", value: "Whispery/ASMR" },
          { label: "Theatrical/Animated", value: "Theatrical/Animated" },
          { label: "Dramatic/Soulful", value: "Dramatic/Soulful" },
          { label: "Chanting/Gospel", value: "Chanting/Gospel" },
          { label: "Throat Singing", value: "Throat Singing" },
          { label: "Yodeling", value: "Yodeling" },
          { label: "Beatboxing", value: "Beatboxing" },
          { label: "Robotic/Auto-Tuned", value: "Robotic/Auto-Tuned" },
          { label: "Demonic/Distorted", value: "Demonic/Distorted" }
        ];
      case "AI_INSTRUMENTALIST":
        return [
          { label: "All Instruments", value: null },
          { label: "Drums", value: "Drums" },
          { label: "Guitar", value: "Guitar" },
          { label: "Electric Guitar", value: "Electric Guitar" },
          { label: "Acoustic Guitar", value: "Acoustic Guitar" },
          { label: "Bass", value: "Bass" },
          { label: "Keyboard", value: "Keyboard" },
          { label: "Piano", value: "Piano" },
          { label: "Organ", value: "Organ" },
          { label: "Synth", value: "Synth" },
          { label: "Wind", value: "Wind" },
          { label: "Saxophone", value: "Saxophone" },
          { label: "Flute", value: "Flute" },
          { label: "Clarinet", value: "Clarinet" },
          { label: "Oboe", value: "Oboe" },
          { label: "Bassoon", value: "Bassoon" },
          { label: "Recorder", value: "Recorder" },
          { label: "Brass", value: "Brass" },
          { label: "Trumpet", value: "Trumpet" },
          { label: "Trombone", value: "Trombone" },
          { label: "French Horn", value: "French Horn" },
          { label: "Tuba", value: "Tuba" },
          { label: "Cornet", value: "Cornet" },
          { label: "Plucked", value: "Plucked" },
          { label: "Harp", value: "Harp" },
          { label: "Ukulele", value: "Ukulele" },
          { label: "Banjo", value: "Banjo" },
          { label: "Mandolin", value: "Mandolin" },
          { label: "Strings", value: "Strings" },
          { label: "Violin", value: "Violin" },
          { label: "Viola", value: "Viola" },
          { label: "Cello", value: "Cello" },
          { label: "Double Bass", value: "Double Bass" },
          { label: "Percussion", value: "Percussion" },
          { label: "Timpani", value: "Timpani" },
          { label: "Marimba", value: "Marimba" },
          { label: "Xylophone", value: "Xylophone" },
          { label: "Vibraphone", value: "Vibraphone" },
          { label: "Djembe", value: "Djembe" },
          { label: "Cajon", value: "Cajon" },
          { label: "Tabla", value: "Tabla" },
          { label: "Bongos", value: "Bongos" },
          { label: "Congas", value: "Congas" },
          { label: "Theremin", value: "Theremin" },
          { label: "Accordion", value: "Accordion" },
          { label: "Harmonica", value: "Harmonica" },
          { label: "Bagpipes", value: "Bagpipes" },
          { label: "Sitar", value: "Sitar" },
          { label: "Erhu", value: "Erhu" },
          { label: "Koto", value: "Koto" },
          { label: "Shamisen", value: "Shamisen" }
        ];
      case "AI_EFFECT":
        return [
          { label: "All Effects", value: null },
          { label: "Reverb", value: "Reverb" },
          { label: "Delay", value: "Delay" },
          { label: "Echo", value: "Echo" },
          { label: "Saturation", value: "Saturation" },
          { label: "Modulation", value: "Modulation" },
          { label: "Chorus", value: "Chorus" },
          { label: "Flanger", value: "Flanger" },
          { label: "Phaser", value: "Phaser" },
          { label: "Harmonizer", value: "Harmonizer" },
          { label: "Distortion", value: "Distortion" },
          { label: "Compressor", value: "Compressor" },
          { label: "EQ", value: "EQ" },
          { label: "Limiter", value: "Limiter" },
          { label: "Noise Gate", value: "Noise Gate" },
          { label: "Pitch Shifter", value: "Pitch Shifter" },
          { label: "Auto-Tune", value: "Auto-Tune" },
          { label: "Vocoder", value: "Vocoder" }
        ];
      case "AI_SOUND":
        return [
          { label: "All Sounds", value: null },
          { label: "Ambience", value: "Ambience" },
          { label: "Sound Effects", value: "Sound Effects" },
          { label: "Foley", value: "Foley" },
          { label: "Nature", value: "Nature" },
          { label: "Urban", value: "Urban" },
          { label: "Mechanical", value: "Mechanical" },
          { label: "Electronic", value: "Electronic" },
          { label: "Animal", value: "Animal" },
          { label: "Human", value: "Human" },
          { label: "Weather", value: "Weather" },
          { label: "Industrial", value: "Industrial" },
          { label: "Sci-Fi", value: "Sci-Fi" },
          { label: "Fantasy", value: "Fantasy" },
          { label: "Horror", value: "Horror" }
        ];
      case "AI_MIXER":
        return [
          { label: "All Mixers", value: null },
          { label: "Mastering Engineer", value: "Mastering Engineer" },
          { label: "Recording Engineer", value: "Recording Engineer" },
          { label: "Mix Engineer", value: "Mix Engineer" },
          { label: "Vocal Producer", value: "Vocal Producer" },
          { label: "Tracking Engineer", value: "Tracking Engineer" },
          { label: "Sound Designer", value: "Sound Designer" },
          { label: "Audio Restoration", value: "Audio Restoration" },
          { label: "Film Audio", value: "Film Audio" },
          { label: "Game Audio", value: "Game Audio" },
          { label: "Broadcast Engineer", value: "Broadcast Engineer" }
        ];
      case "AI_WRITER":
        return [
          { label: "All Writers", value: null },
          { label: "Songwriter", value: "Songwriter" },
          { label: "Lyricist", value: "Lyricist" },
          { label: "Composer", value: "Composer" },
          { label: "Poet", value: "Poet" },
          { label: "Novelist", value: "Novelist" },
          { label: "Screenwriter", value: "Screenwriter" },
          { label: "Playwright", value: "Playwright" },
          { label: "Journalist", value: "Journalist" },
          { label: "Blogger", value: "Blogger" },
          { label: "Technical Writer", value: "Technical Writer" },
          { label: "Copywriter", value: "Copywriter" },
          { label: "Ghostwriter", value: "Ghostwriter" }
        ];
      case "AI_PRODUCER":
        return [
          { label: "All Producers", value: null },
          { label: "Pop Producer", value: "Pop Producer" },
          { label: "Hip Hop Producer", value: "Hip Hop Producer" },
          { label: "EDM Producer", value: "EDM Producer" },
          { label: "Rock Producer", value: "Rock Producer" },
          { label: "R&B Producer", value: "R&B Producer" },
          { label: "Jazz Producer", value: "Jazz Producer" },
          { label: "Classical Producer", value: "Classical Producer" },
          { label: "Trap Producer", value: "Trap Producer" },
          { label: "K-Pop Producer", value: "K-Pop Producer" },
          { label: "Latin Producer", value: "Latin Producer" },
          { label: "Reggaeton Producer", value: "Reggaeton Producer" },
          { label: "Country Producer", value: "Country Producer" },
          { label: "Indie Producer", value: "Indie Producer" },
          { label: "Folk Producer", value: "Folk Producer" },
          { label: "Reggae Producer", value: "Reggae Producer" }
        ];
      case "AI_COMPOSER":
        return [
          { label: "All Composers", value: null },
          { label: "Classical Composer", value: "Classical Composer" },
          { label: "Film Score Composer", value: "Film Score Composer" },
          { label: "Video Game Composer", value: "Video Game Composer" },
          { label: "TV Music Composer", value: "TV Music Composer" },
          { label: "Orchestral Composer", value: "Orchestral Composer" },
          { label: "Chamber Music Composer", value: "Chamber Music Composer" },
          { label: "Opera Composer", value: "Opera Composer" },
          { label: "Ballet Composer", value: "Ballet Composer" },
          { label: "Choral Composer", value: "Choral Composer" },
          { label: "Ambient Composer", value: "Ambient Composer" },
          { label: "Minimalist Composer", value: "Minimalist Composer" },
          { label: "Jazz Composer", value: "Jazz Composer" },
          { label: "Neo-Classical Composer", value: "Neo-Classical Composer" },
          { label: "Electronic Composer", value: "Electronic Composer" },
          { label: "Experimental Composer", value: "Experimental Composer" }
        ];
      case "AI_ARRANGER":
        return [
          { label: "All Arrangers", value: null },
          { label: "Orchestral Arranger", value: "Orchestral Arranger" },
          { label: "Jazz Arranger", value: "Jazz Arranger" },
          { label: "Pop Arranger", value: "Pop Arranger" },
          { label: "Classical Arranger", value: "Classical Arranger" },
          { label: "Film Score Arranger", value: "Film Score Arranger" },
          { label: "A Cappella Arranger", value: "A Cappella Arranger" },
          { label: "Choir Arranger", value: "Choir Arranger" },
          { label: "Small Ensemble Arranger", value: "Small Ensemble Arranger" },
          { label: "Big Band Arranger", value: "Big Band Arranger" },
          { label: "Electronic Arranger", value: "Electronic Arranger" },
          { label: "Rock Arranger", value: "Rock Arranger" },
          { label: "Hip Hop Arranger", value: "Hip Hop Arranger" },
          { label: "World Music Arranger", value: "World Music Arranger" }
        ];
      case "AI_DJ":
        return [
          { label: "All DJs", value: null },
          { label: "House DJ", value: "House DJ" },
          { label: "Techno DJ", value: "Techno DJ" },
          { label: "EDM DJ", value: "EDM DJ" },
          { label: "Trance DJ", value: "Trance DJ" },
          { label: "Hip Hop DJ", value: "Hip Hop DJ" },
          { label: "Turntablist", value: "Turntablist" },
          { label: "Open Format DJ", value: "Open Format DJ" },
          { label: "Mobile DJ", value: "Mobile DJ" },
          { label: "Radio DJ", value: "Radio DJ" },
          { label: "Club DJ", value: "Club DJ" },
          { label: "Festival DJ", value: "Festival DJ" },
          { label: "Jungle/Drum & Bass DJ", value: "Jungle/Drum & Bass DJ" },
          { label: "Dubstep DJ", value: "Dubstep DJ" },
          { label: "Reggae/Dancehall DJ", value: "Reggae/Dancehall DJ" },
          { label: "Disco DJ", value: "Disco DJ" },
          { label: "Ambient/Chill DJ", value: "Ambient/Chill DJ" },
          { label: "Wedding DJ", value: "Wedding DJ" }
        ];
      case "AI_VISUAL_ARTIST":
        return [
          { label: "All Visual Artists", value: null },
          { label: "Digital Painter", value: "Digital Painter" },
          { label: "3D Modeler", value: "3D Modeler" },
          { label: "Concept Artist", value: "Concept Artist" },
          { label: "Character Designer", value: "Character Designer" },
          { label: "Environment Artist", value: "Environment Artist" },
          { label: "UI/UX Designer", value: "UI/UX Designer" },
          { label: "Animation Artist", value: "Animation Artist" },
          { label: "Pixel Artist", value: "Pixel Artist" },
          { label: "Traditional Painter", value: "Traditional Painter" },
          { label: "Illustrator", value: "Illustrator" },
          { label: "Comic Artist", value: "Comic Artist" },
          { label: "Graphic Designer", value: "Graphic Designer" },
          { label: "VFX Artist", value: "VFX Artist" },
          { label: "Motion Graphics Artist", value: "Motion Graphics Artist" },
          { label: "Photographer", value: "Photographer" },
          { label: "Photomanipulation Artist", value: "Photomanipulation Artist" },
          { label: "Street Artist", value: "Street Artist" },
          { label: "Sculptor", value: "Sculptor" },
          { label: "Abstract Artist", value: "Abstract Artist" }
        ];
      case "AI_AUDIO_ENGINEER":
        return [
          { label: "All Audio Engineers", value: null },
          { label: "Studio Engineer", value: "Studio Engineer" },
          { label: "Live Sound Engineer", value: "Live Sound Engineer" },
          { label: "Broadcast Engineer", value: "Broadcast Engineer" },
          { label: "Acoustic Engineer", value: "Acoustic Engineer" },
          { label: "System Engineer", value: "System Engineer" },
          { label: "FOH Engineer", value: "FOH Engineer" },
          { label: "Monitor Engineer", value: "Monitor Engineer" },
          { label: "Recording Engineer", value: "Recording Engineer" },
          { label: "Mixing Engineer", value: "Mixing Engineer" },
          { label: "Mastering Engineer", value: "Mastering Engineer" },
          { label: "Post-Production Engineer", value: "Post-Production Engineer" },
          { label: "Sound Designer", value: "Sound Designer" },
          { label: "Foley Engineer", value: "Foley Engineer" },
          { label: "A/V Engineer", value: "A/V Engineer" }
        ];
      default:
        return [];
    }
  };

  // Handle type change
  const handleTypeChange = (type: PersonaType) => {
    if (profileType.includes(type)) {
      // Don't allow removing the last type
      if (profileType.length > 1) {
        setProfileType(profileType.filter(t => t !== type));
      }
    } else {
      // Replace the current type instead of adding to array since we only use the first one
      setProfileType([type]);
      // Reset subtype when type changes
      setSelectedSubtype(null);
    }
  };

  return (
    <DebugDialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-screen-lg w-[95vw] h-[90vh] overflow-auto bg-black/95 border-dreamaker-purple/20 flex flex-col">
        <DialogHeader className="p-6 pb-2 flex-shrink-0">
          <DialogTitle className="text-2xl">Edit Profile</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your profile information and media
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 pt-2 flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-hidden">
            <ProfileForm
              username={username}
              setUsername={setUsername}
              displayName={displayName}
              setDisplayName={setDisplayName}
              bio={bio}
              setBio={setBio}
              avatarUrl={avatarUrl}
              setAvatarUrl={setAvatarUrl}
              bannerUrl={bannerUrl}
              setBannerUrl={setBannerUrl}
              videoUrl={videoUrl}
              setVideoUrl={setVideoUrl}
              isPublic={isPublic}
              setIsPublic={setIsPublic}
              profileType={profileType}
              setProfileType={setProfileType}
              bannerPosition={bannerPosition}
              setBannerPosition={setBannerPosition}
              darknessFactor={darknessFactor}
              onDarknessChange={setDarknessFactor}
              genre={genre}
              setGenre={setGenre}
              location={location}
              setLocation={setLocation}
              selectedSubtype={selectedSubtype}
              setSelectedSubtype={setSelectedSubtype}
            />
          </div>
          
          <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-dreamaker-purple/20 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-dreamaker-purple/30"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-dreamaker-purple hover:bg-dreamaker-purple/90"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </DebugDialog>
  );
};