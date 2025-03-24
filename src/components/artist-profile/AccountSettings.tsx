import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AccountSettingsSection } from './form/AccountSettingsSection';

interface AccountSettingsProps {
  profile: {
    id: string;
    email?: string;
  };
}

export const AccountSettings = ({ profile }: AccountSettingsProps) => {
  const { user } = useUser();

  return (
    <div className="bg-black/40 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
      <div className="space-y-6">
        <AccountSettingsSection
          email={user?.email || ''}
          isDisabled={false}
        />
      </div>
    </div>
  );
};