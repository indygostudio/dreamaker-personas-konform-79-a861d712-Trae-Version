import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface AccountSettingsSectionProps {
  email: string;
  isDisabled?: boolean;
}

export const AccountSettingsSection = ({
  email,
  isDisabled = false,
}: AccountSettingsSectionProps) => {
  const { user } = useUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to change your password');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);

    try {
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('Current password is incorrect');
      }

      // Then update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(`Failed to change password: ${error.message || 'Unknown error'}`);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Account Settings</h3>
        <p className="text-sm text-gray-400">
          Manage your account email and password
        </p>
      </div>

      <Card className="bg-black/20 border-white/10">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center space-x-2">
                <div className="relative w-full">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    value={email}
                    disabled={true}
                    className="pl-10 bg-black/40 border-white/10"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Contact support to change your email address
              </p>
            </div>

            <div className="pt-4">
              <h4 className="text-md font-medium mb-4">Change Password</h4>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={isDisabled || isChangingPassword}
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
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isDisabled || isChangingPassword}
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
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isDisabled || isChangingPassword}
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
                  type="submit"
                  disabled={isDisabled || isChangingPassword || !currentPassword || !newPasswor