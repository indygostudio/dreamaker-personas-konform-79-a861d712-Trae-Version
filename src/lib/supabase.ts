
import { createClient } from '@supabase/supabase-js';

// Using production Supabase configuration since local setup is having issues
// Import from integrations/supabase/client.ts for the production client
import { supabase as productionSupabase } from '@/integrations/supabase/client';

// Local Supabase configuration (commented out as it's not working)
// const supabaseUrl = 'http://localhost:54322';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
// export const supabase = createClient(supabaseUrl, supabaseKey);

// Export the production Supabase client instead
export const supabase = productionSupabase;
