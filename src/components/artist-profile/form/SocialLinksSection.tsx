import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import type { ProfileFormValues } from "@/lib/validations/profile";

const socialPlatforms = [
  { label: "Twitter", value: "twitter" },
  { label: "Instagram", value: "instagram" },
  { label: "Facebook", value: "facebook" },
  { label: "YouTube", value: "youtube" },
  { label: "SoundCloud", value: "soundcloud" },
  { label: "Spotify", value: "spotify" },
  { label: "TikTok", value: "tiktok" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Website", value: "website" },
];

export function SocialLinksSection() {
  const { control } = useFormContext<ProfileFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "social_links",
  });

  const handleAddLink = () => {
    append({ platform: "", url: "", id: crypto.randomUUID() });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Social Links</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddLink}
          className="flex items-center gap-2 border-dreamaker-purple/20 hover:border-dreamaker-purple/40"
        >
          <Plus className="h-4 w-4" />
          Add Link
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-4">
          <FormField
            control={control}
            name={`social_links.${index}.platform`}
            render={({ field: platformField }) => (
              <FormItem className="flex-1">
                <FormLabel>Platform</FormLabel>
                <Select
                  value={platformField.value}
                  onValueChange={platformField.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="bg-black/50 border-dreamaker-purple/20">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {socialPlatforms.map((platform) => (
                      <SelectItem
                        key={platform.value}
                        value={platform.value}
                        className="cursor-pointer"
                      >
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`social_links.${index}.url`}
            render={({ field: urlField }) => (
              <FormItem className="flex-[2]">
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input
                    {...urlField}
                    placeholder="Enter URL"
                    className="bg-black/50 border-dreamaker-purple/20 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            className="mt-8 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}