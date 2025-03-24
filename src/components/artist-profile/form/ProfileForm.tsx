import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormSchema, type ProfileFormValues } from "@/lib/validations/profile";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "../header/FileUploader";
import { BannerPositionControls } from "../header/BannerPositionControls";
import { AudioUploadSection } from "./AudioUploadSection";
import { User, Image, Music, Link, Save } from "lucide-react";

interface ProfileFormProps {
  initialData: ProfileFormValues;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function ProfileForm({ initialData, onSubmit, isLoading }: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData,
  });

  const handleSubmit = async (data: ProfileFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="bg-black/60 w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Media</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span>Audio</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              <span>Social</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <FormField
              control={form.control}
              name="display_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-black/50 border-dreamaker-purple/20 text-white"
                      placeholder="Enter your display name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="bg-black/50 border-dreamaker-purple/20 text-white min-h-[100px]"
                      placeholder="Tell us about yourself..."
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
                  <FormLabel className="flex flex-col space-y-1">
                    <span>Profile Visibility</span>
                    <span className="text-sm text-gray-400">
                      {field.value ? "Public - Anyone can view your profile" : "Private - Users must request access"}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-black/50 border-dreamaker-purple/20 text-white"
                      placeholder="e.g., Los Angeles, CA"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <MediaUploadSection />
          </TabsContent>

          <TabsContent value="audio" className="space-y-6">
            {/* Audio upload section will be implemented here */}
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <SocialLinksSection />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-dreamaker-purple hover:bg-dreamaker-purple/90 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}