import { createClient } from '@supabase/supabase-js';

// Using production Supabase configuration since local setup is having issues
// Import from integrations/supabase/client.ts for the production client
import { supabase as productionSupabase } from '@/integrations/supabase/client';

// Export the production Supabase client
export const supabase = productionSupabase;
