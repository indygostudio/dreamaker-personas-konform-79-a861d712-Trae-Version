import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';

interface AdminModeContextType {
  isAdmin: boolean;
  isAdminMode: boolean;
  toggleAdminMode: () => void;
  loading: boolean;
}

const AdminModeContext = createContext<AdminModeContextType>({
  isAdmin: false,
  isAdminMode: false,
  toggleAdminMode: () => {},
  loading: true,
});

export const useAdminMode = () => useContext(AdminModeContext);

interface AdminModeProviderProps {
  children: React.ReactNode;
}

// List of admin user IDs
// In a production environment, this would be fetched from the database
const ADMIN_USER_IDS = [
  // Add your actual user ID here
  // You can get it from the browser console by running:
  // console.log((await supabase.auth.getUser()).data.user?.id)
  "41bbfeda-29be-49ad-bebd-56f62fcf3e58", // Example ID - replace with your actual ID
  // Add any additional admin user IDs here
];

export const AdminModeProvider: React.FC<AdminModeProviderProps> = ({ children }) => {
  const session = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user) {
        setIsAdmin(false);
        setIsAdminMode(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user is in the admin list
        const userId = session.user.id;
        
        // Option 1: Check against hardcoded list
        const isAdminUser = ADMIN_USER_IDS.includes(userId);
        
        // Option 2: Check against database (uncomment to use)
        // const { data, error } = await supabase
        //   .from('admin_users')
        //   .select('id')
        //   .eq('id', userId)
        //   .single();
        // 
        // const isAdminUser = !!data && !error;

        setIsAdmin(isAdminUser);
        setLoading(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [session]);

  const toggleAdminMode = () => {
    if (!isAdmin) {
      toast.error('You do not have admin privileges');
      return;
    }
    
    setIsAdminMode(prev => {
      const newMode = !prev;
      if (newMode) {
        toast.success('Admin mode enabled');
      } else {
        toast.info('Admin mode disabled');
      }
      return newMode;
    });
  };

  return (
    <AdminModeContext.Provider value={{ isAdmin, isAdminMode, toggleAdminMode, loading }}>
      {children}
    </AdminModeContext.Provider>
  );
};