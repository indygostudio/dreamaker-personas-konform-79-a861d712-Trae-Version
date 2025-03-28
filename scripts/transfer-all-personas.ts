import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// The email to transfer all personas to
const targetEmail = 'indygorecording@gmail.com';

async function transferAllPersonas() {
  console.log(`Starting transfer of all personas to ${targetEmail}`);

  try {
    // Step 1: Get the user ID for the target email
    console.log(`Looking up user ID for email: ${targetEmail}`);
    
    // First try to get the user from auth.users
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(targetEmail);
    
    if (userError) {
      console.error('Error looking up user by email:', userError);
      throw new Error(`Failed to find user with email ${targetEmail}`);
    }
    
    if (!userData?.user) {
      throw new Error(`User with email ${targetEmail} not found`);
    }
    
    const targetUserId = userData.user.id;
    console.log(`Found user ID: ${targetUserId}`);

    // Step 2: Get all personas
    const { data: personas, error: personasError } = await supabase
      .from('personas')
      .select('id, user_id, name');

    if (personasError) {
      console.error('Error fetching personas:', personasError);
      throw new Error('Failed to fetch personas');
    }

    console.log(`Found ${personas?.length || 0} personas in the database`);

    // Step 3: Update each persona to the new user ID
    let successCount = 0;
    let errorCount = 0;

    for (const persona of personas || []) {
      if (persona.user_id === targetUserId) {
        console.log(`Persona "${persona.name}" (${persona.id}) already belongs to the target user`);
        successCount++;
        continue;
      }

      console.log(`Transferring persona "${persona.name}" (${persona.id}) from ${persona.user_id} to ${targetUserId}`);
      
      // Try to use the transfer_persona_ownership RPC function if it exists
      try {
        const { data: transferData, error: transferError } = await supabase.rpc(
          'transfer_persona_ownership',
          {
            persona_id: persona.id,
            current_owner_id: persona.user_id,
            new_owner_id: targetUserId
          }
        );

        if (transferError) {
          console.error(`RPC transfer failed for persona ${persona.id}:`, transferError);
          
          // Fallback to direct update if RPC fails
          const { error: updateError } = await supabase
            .from('personas')
            .update({ user_id: targetUserId })
            .eq('id', persona.id);

          if (updateError) {
            console.error(`Direct update failed for persona ${persona.id}:`, updateError);
            errorCount++;
          } else {
            console.log(`Successfully transferred persona ${persona.id} via direct update`);
            successCount++;
          }
        } else {
          console.log(`Successfully transferred persona ${persona.id} via RPC`);
          successCount++;
        }
      } catch (error) {
        console.error(`Error transferring persona ${persona.id}:`, error);
        errorCount++;
      }
    }

    console.log('\nTransfer summary:');
    console.log(`Total personas: ${personas?.length || 0}`);
    console.log(`Successfully transferred: ${successCount}`);
    console.log(`Failed transfers: ${errorCount}`);

  } catch (error) {
    console.error('Error in transfer process:', error);
  }
}

// Execute the transfer function
transferAllPersonas();