import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AvatarUpload } from "@/components/persona/AvatarUpload";
import { Switch } from "@/components/ui/switch";
import { Upload, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useUser } from "@/hooks/useUser";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: {
    id: string;
    username: string;
    avatar_url: string;
    is_public?: boolean;
    banner_url?: string;
    email?: string;
  };
  onSuccess: () => void;
}

export const EditProfileDialog = ({
  open,
  onOpenChange,
  profile,
  onSuccess,
}: EditProfileDialogProps) => {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState(profile.username || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [bannerUrl, setBannerUrl] = useState(profile.banner_url || "");
  const [isPublic, setIsPublic] = useState(profile.is_public || false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { toast } = useToast();

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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to change your password",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast({
        title: "Error",
        description: `Failed to change password: ${error.message || "Unknown error"}`
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          avatar_url: avatarUrl,
          banner_url: bannerUrl,
          is_public: isPublic,
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-black/90 border border-dreamaker-purple/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <AvatarUpload
                value={avatarUrl}
                onChange={setAvatarUrl}
                name={username}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="banner">Banner Image</Label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                  id="banner-upload"
                />
                <Label
                  htmlFor="banner-upload"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-dreamaker-purple/50"
                >
                  {bannerUrl ? (
                    <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <span className="text-sm text-gray-400">Upload Banner</span>
                    </div>
                  )}
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-black/50 border-dreamaker-purple/30"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="visibility">Public Profile</Label>
              <Switch
                id="visibility"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  value={profile.email}
                  disabled={true}
                  className="pl-10 bg-black/40 border-white/10"
                />
              </div>
              <p className="text-xs text-gray-400">
                Contact support to change your email address
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium">Change Password</h4>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isChangingPassword}
                    className="pl-10 pr-10 bg-black/40 border-white/10"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isChangingPassword}
                    className="pl-10 pr-10 bg-black/40 border-white/10"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isChangingPassword}
                    className="pl-10 pr-10 bg-black/40 border-white/10"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="button"
                onClick={handlePasswordChange}
                disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="w-full bg-dreamaker-purple hover:bg-dreamaker-purple/90"
              >
                {isChangingPassword ? "Changing Password..." : "Change Password"}
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="border-dreamaker-purple/50"
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
    </Dialog>
  );
};