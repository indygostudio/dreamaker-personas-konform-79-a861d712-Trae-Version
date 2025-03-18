import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PersonaBasicInfo } from "@/components/persona/form/PersonaBasicInfo";
import { PersonaTypeSelector } from "@/components/persona/form/PersonaTypeSelector";
import { PersonaSpecificFields } from "@/components/persona/form/PersonaSpecificFields";
import { AvatarUpload } from "@/components/persona/AvatarUpload";
import { BannerUpload } from "@/components/persona/BannerUpload";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Globe2, Lock, Trash2, Volume2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { DeleteConfirmationDialog } from "@/components/persona/card/dialogs/DeleteConfirmationDialog";
import { usePersonaDelete } from "@/components/persona/hooks/usePersonaDelete";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum([
    "AI_VOCALIST",
    "AI_WRITER",
    "AI_INSTRUMENTALIST",
    "AI_CHARACTER",
    "AI_MIXER",
    "AI_EFFECT",
    "AI_SOUND"
  ] as const),
  subtype: z.string().nullable().optional(),
  description: z.string().optional(),
  avatar_url: z.string().optional(),
  avatar_position: z.object({
    x: z.number(),
    y: z.number()
  }).default({ x: 50, y: 50 }),
  banner_url: z.string().optional(),
  banner_position: z.object({
    x: z.number(),
    y: z.number()
  }).default({ x: 50, y: 50 }),
  video_url: z.string().optional(),
  audio_preview_url: z.string().optional(),
  banner_darkness: z.number().min(0).max(100).default(50),
  age: z.string().optional(),
  style: z.string().optional(),
  voice_type: z.string().optional(),
  vocal_style: z.string().optional(),
  artist_category: z.string().optional(),
  is_public: z.boolean().default(false),
  id: z.string().optional(),
});

export type PersonaFormValues = z.infer<typeof formSchema>;

interface PersonaFormProps {
  defaultValues: PersonaFormValues;
  onSubmit: (values: PersonaFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function PersonaForm({ defaultValues, onSubmit, onCancel, isSubmitting = false }: PersonaFormProps) {
  const form = useForm<PersonaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      banner_position: {
        x: defaultValues.banner_position?.x ?? 50,
        y: defaultValues.banner_position?.y ?? 50
      }
    },
  });

  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [isGeneratingBanner, setIsGeneratingBanner] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { handleDeletePersona } = usePersonaDelete();
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(defaultValues.audio_preview_url || null);

  const isExistingPersona = Boolean(defaultValues.id);

  useEffect(() => {
    if (defaultValues.audio_preview_url) {
      setAudioPreviewUrl(defaultValues.audio_preview_url);
      form.setValue('audio_preview_url', defaultValues.audio_preview_url);
    }
  }, [defaultValues.audio_preview_url, form]);

  const ensureAudioBucketExists = async (): Promise<boolean> => {
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error("Error checking buckets:", error);
        return false;
      }
      
      const bucketExists = buckets.some(bucket => bucket.name === 'audio-previews');
      
      if (!bucketExists) {
        try {
          const { error: createError } = await supabase.functions.invoke('create-storage-bucket', {
            body: { 
              bucketName: 'audio-previews',
              isPublic: true
            }
          });
          
          if (createError) {
            console.error("Error creating bucket:", createError);
            toast.error("Unable to create storage bucket. Please try again later.");
            return false;
          }
          
          console.log("Successfully created audio-previews bucket");
          return true;
        } catch (err) {
          console.error("Error ensuring bucket exists:", err);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error in ensureAudioBucketExists:", error);
      return false;
    }
  };

  const uploadWithProgress = async (file: File, path: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const bucketExists = await ensureAudioBucketExists();
        if (!bucketExists) {
          reject(new Error("Storage bucket is not available"));
          return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('bucket', 'audio-previews');
        formData.append('title', 'Audio Preview');
        
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eybrmzbvvckdlvlckfms.supabase.co';
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          reject(new Error('You must be logged in to upload files'));
          return;
        }
        
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentage);
          }
        });
        
        xhr.addEventListener('load', async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              console.log("Upload response:", response);
              
              if (response.success && response.image && response.image.url) {
                resolve(response.image.url);
              } else {
                const fileName = `${crypto.randomUUID()}.${file.name.split('.').pop()}`;
                const filePath = `${fileName}`;
                
                const { data, error } = await supabase.storage
                  .from('audio-previews')
                  .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                  });
                
                if (error) throw error;
                
                const { data: { publicUrl } } = supabase.storage
                  .from('audio-previews')
                  .getPublicUrl(filePath);
                
                resolve(publicUrl);
              }
            } catch (error) {
              console.error("Error parsing response:", error);
              reject(error);
            }
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed due to network error'));
        });
        
        xhr.addEventListener('abort', () => {
          reject(new Error('Upload aborted'));
        });
        
        xhr.open('POST', `${supabaseUrl}/functions/v1/upload-image`);
        xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
        xhr.send(formData);
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const fileName = `${crypto.randomUUID()}.${file.name.split('.').pop()}`;
      
      const publicUrl = await uploadWithProgress(file, fileName);
      form.setValue('audio_preview_url', publicUrl);
      setAudioPreviewUrl(publicUrl);
      
      toast.success("Audio preview uploaded successfully");

      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    } catch (error) {
      console.error('Error uploading audio:', error);
      toast.error("There was an error uploading your audio preview");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearAvatar = () => {
    form.setValue("avatar_url", "");
    toast.success("Avatar image cleared");
  };

  const handleClearBanner = () => {
    form.setValue("video_url", "");
    toast.success("Banner image cleared");
  };

  const handleClearAudioPreview = () => {
    form.setValue("audio_preview_url", "");
    setAudioPreviewUrl(null);
    toast.success("Audio preview cleared");
  };

  const handleSubmit = async (values: PersonaFormValues) => {
    try {
      const updatedValues = {
        ...values,
        audio_preview_url: form.getValues('audio_preview_url') || audioPreviewUrl
      };
      
      await onSubmit(updatedValues);
      
      toast.success("Persona saved successfully");
      
      onCancel();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save persona");
    }
  };

  const handleDelete = async () => {
    if (!defaultValues.id) return;
    
    const success = await handleDeletePersona(defaultValues.id);
    if (success) {
      onCancel();
    }
  };

  const handlePlayAudio = () => {
    if (!audioPreviewUrl) return;
    
    const audio = new Audio(audioPreviewUrl);
    audio.play().catch(error => {
      console.error("Error playing audio:", error);
      toast.error("Failed to play audio preview");
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <PersonaBasicInfo form={form} />
            <PersonaTypeSelector form={form} />
            
            <div className="space-y-4 p-4 rounded-lg bg-gray-900/50">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-200">Visibility</Label>
                <div className="text-xs text-gray-400 mb-3">
                  Choose who can see this persona
                </div>
                <RadioGroup
                  value={form.watch("is_public").toString()}
                  onValueChange={(value) => form.setValue("is_public", value === "true")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="public" />
                    <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer">
                      <Globe2 className="h-4 w-4 text-green-500" />
                      Public
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="private" />
                    <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
                      <Lock className="h-4 w-4 text-gray-500" />
                      Private
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-200">Avatar Image</h3>
                {form.watch("avatar_url") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearAvatar}
                    className="bg-red-500/10 hover:bg-red-500/20 border-red-500/50 text-red-400 h-8"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear Avatar
                  </Button>
                )}
              </div>
              <AvatarUpload
                value={form.watch("avatar_url")}
                onChange={(url) => form.setValue("avatar_url", url)}
                name={form.watch("name")}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-200">Banner Image</h3>
                {form.watch("video_url") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearBanner}
                    className="bg-red-500/10 hover:bg-red-500/20 border-red-500/50 text-red-400 h-8"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear Banner
                  </Button>
                )}
              </div>
              <BannerUpload
                value={form.watch("video_url")}
                onChange={(url) => form.setValue("video_url", url)}
                name={form.watch("name")}
                onPositionChange={(position) => form.setValue("banner_position", {
                  x: position.x ?? 50,
                  y: position.y ?? 50
                })}
                initialPosition={{
                  x: form.watch("banner_position")?.x ?? 50,
                  y: form.watch("banner_position")?.y ?? 50
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-gray-200">Audio Preview</Label>
                {audioPreviewUrl && (
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearAudioPreview}
                    className="bg-red-500/10 hover:bg-red-500/20 border-red-500/50 text-red-400 h-8"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear Audio
                  </Button>
                )}
              </div>
              <div className="flex gap-2 items-start">
                <Input
                  type="file"
                  accept="audio/mp3,audio/wav,audio/m4a"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await handleUpload(file);
                    }
                  }}
                  className="flex-1"
                  disabled={isUploading}
                />
              </div>
              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-gray-400">
                    {uploadProgress === 100 ? 'Upload complete!' : `Uploading... ${uploadProgress}%`}
                  </p>
                </div>
              )}
              {audioPreviewUrl && (
                <div className="mt-2 bg-black/30 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-200">Audio Preview</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={handlePlayAudio}
                      type="button"
                    >
                      <Volume2 className="h-4 w-4 text-dreamaker-purple" />
                    </Button>
                  </div>
                  <audio controls src={audioPreviewUrl} className="w-full" />
                </div>
              )}
              <p className="text-xs text-gray-400">
                Upload an MP3 or WAV file for the persona's audio preview
              </p>
            </div>
            <PersonaSpecificFields form={form} />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {isExistingPersona && (
            <Button
              type="button"
              variant="outline"
              className="border-red-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/40 text-red-400"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isSubmitting || isUploading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || isUploading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
      
      {isExistingPersona && (
        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          personaId={defaultValues.id || ""}
          onDelete={handleDelete}
        />
      )}
    </Form>
  );
}
