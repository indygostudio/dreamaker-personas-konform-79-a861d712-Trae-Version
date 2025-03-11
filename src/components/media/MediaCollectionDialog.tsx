
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, Upload } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  is_public: z.boolean().default(false),
  audio_file: z.any().optional(),
  genre: z.array(z.string()).default([]),
  style_tags: z.array(z.string()).default([]),
  media_type: z.string().default('audio')
});

interface MediaCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  defaultMediaType?: string;
  personaId: string;
}

export const MediaCollectionDialog = ({
  open,
  onOpenChange,
  onSuccess,
  defaultMediaType = 'audio',
  personaId,
}: MediaCollectionDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      is_public: false,
      genre: [],
      style_tags: []
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      let fileUrl: string | undefined;
      let previewUrl: string | undefined;

      // Handle file upload if a file is selected
      const audioFile = (form.getValues().audio_file as FileList)?.[0];
      if (audioFile) {
        const fileExt = audioFile.name.split('.').pop();
        const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('audio_files')
          .upload(filePath, audioFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('audio_files')
          .getPublicUrl(filePath);

        fileUrl = publicUrl;
        previewUrl = publicUrl; // For now, using same URL for preview
      }

      const collectionData = {
        ...values,
        user_id: user.id,
        media_type: defaultMediaType,
        file_url: fileUrl,
        preview_url: previewUrl,
        required_tier: 'free' as const,
        banner_position: { x: 50, y: 50 },
        likes_count: 0,
        downloads_count: 0,
        technical_specs: {
          format: audioFile?.type,
          size: audioFile?.size,
        },
        persona_id: personaId,
      };

      const { error, data } = await supabase
        .from('media_collections')
        .insert(collectionData);

      if (error) throw error;

      toast.success("Collection created successfully");
      form.reset();
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Failed to create collection: " + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Media Collection</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter collection title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter collection description" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="audio_file"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Audio File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => onChange(e.target.files)}
                      className="cursor-pointer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_public"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => field.onChange(!field.value)}
                      className="flex items-center gap-2"
                    >
                      {field.value ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      {field.value ? "Public" : "Private"}
                    </Button>
                    <p className="text-sm text-gray-400">
                      {field.value ? "Collection is visible to all users" : "Collection is only visible to you"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="media_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || defaultMediaType}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a media type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="midi">MIDI</SelectItem>
                      <SelectItem value="plugin">Plugin</SelectItem>
                      <SelectItem value="patch">Patch</SelectItem>
                      <SelectItem value="album">Album</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Collection</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
