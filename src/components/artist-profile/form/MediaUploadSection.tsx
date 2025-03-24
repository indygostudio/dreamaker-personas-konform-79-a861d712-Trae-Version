import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { FileUploader } from "../header/FileUploader";
import { BannerPositionControls } from "../header/BannerPositionControls";
import { useState } from "react";
import { Upload, Trash2, Video, Image as ImageIcon } from "lucide-react";
import type { ProfileFormValues } from "@/lib/validations/profile";

export function MediaUploadSection() {
  const { control, watch, setValue } = useFormContext<ProfileFormValues>();
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  
  const avatarUrl = watch("avatar_url");
  const bannerUrl = watch("banner_url");
  const videoUrl = watch("video_url");
  const bannerPosition = watch("banner_position");
  const darknessFactor = watch("darkness_factor");

  const handleFileUpload = async (file: File, type: "avatar" | "banner") => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Here you would typically upload to your storage service
      // For now, we'll just create an object URL as a placeholder
      const url = URL.createObjectURL(file);

      if (type === "avatar") {
        setValue("avatar_url", url);
      } else {
        setValue("banner_url", url);
        // If it's a video file, also set the video_url
        if (file.type.startsWith("video/")) {
          setValue("video_url", url);
        }
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
    }
  };

  const handlePositionChange = (position: { x: number; y: number }) => {
    setValue("banner_position", position);
  };

  const handleDarknessChange = (value: number[]) => {
    setValue("darkness_factor", value[0]);
  };

  const handleClearAvatar = () => {
    setValue("avatar_url", "");
  };

  const handleClearBanner = () => {
    setValue("banner_url", "");
    setValue("video_url", "");
  };

  return (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <FormField
        control={control}
        name="avatar_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profile Picture</FormLabel>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-black/20 border border-dreamaker-purple/20">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("avatar-upload")?.click()}
                  className="flex items-center gap-2 border-dreamaker-purple/20"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
                {avatarUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClearAvatar}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "avatar");
                }}
                key={fileInputKey}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Banner Upload */}
      <FormField
        control={control}
        name="banner_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Banner Image or Video</FormLabel>
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black/20 border border-dreamaker-purple/20">
                {bannerUrl ? (
                  videoUrl ? (
                    <video
                      src={videoUrl}
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={bannerUrl}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <Video className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("banner-upload")?.click()}
                  className="flex items-center gap-2 border-dreamaker-purple/20"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
                {bannerUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClearBanner}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <Input
                id="banner-upload"
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "banner");
                }}
                key={fileInputKey}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Banner Position Controls */}
      {bannerUrl && (
        <div className="space-y-4">
          <FormField
            control={control}
            name="banner_position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner Position</FormLabel>
                <FormControl>
                  <BannerPositionControls
                    position={bannerPosition}
                    onChange={handlePositionChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="darkness_factor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Darkness Overlay</FormLabel>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleDarknessChange}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}