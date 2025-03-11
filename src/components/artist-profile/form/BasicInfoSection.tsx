
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface BasicInfoSectionProps {
  displayName: string;
  bio: string;
  isPublic: boolean;
  location: string;
  onDisplayNameChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onIsPublicChange: (value: boolean) => void;
  onLocationChange: (value: string) => void;
}

export function BasicInfoSection({
  displayName,
  bio,
  isPublic,
  location,
  onDisplayNameChange,
  onBioChange,
  onIsPublicChange,
  onLocationChange,
}: BasicInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="display_name">Display Name *</Label>
        <Input
          id="display_name"
          value={displayName}
          onChange={(e) => onDisplayNameChange(e.target.value)}
          className="bg-black/50 border-dreamaker-purple/20 text-white"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          className="bg-black/50 border-dreamaker-purple/20 text-white min-h-[100px]"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="public" className="flex flex-col space-y-1">
          <span>Profile Visibility</span>
          <span className="text-sm text-gray-400">
            {isPublic ? "Public - Anyone can view your profile" : "Private - Users must request access"}
          </span>
        </Label>
        <Switch
          id="public"
          checked={isPublic}
          onCheckedChange={onIsPublicChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="bg-black/50 border-dreamaker-purple/20 text-white"
          placeholder="e.g., Los Angeles, CA"
        />
      </div>
    </div>
  );
}
