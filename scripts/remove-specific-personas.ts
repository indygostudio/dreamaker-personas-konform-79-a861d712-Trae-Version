import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Names of personas to remove
const personasToRemove = ['Mena Lane', 'Romme Belle', 'Lex Royce'];

async function removePersonas() {
  console.log(`Searching for personas: ${personasToRemove.join(', ')}`);
  
  try {
    // Find personas by name
    const { data: personas, error: searchError } = await supabase
      .from('personas')
      .select('id, name, user_id, artist_profile_id')
      .in('name', personasToRemove);
    
    if (searchError) {
      console.error('Error searching for personas:', searchError);
      return;
    }
    
    if (!personas || personas.length === 0) {
      console.log('No matching personas found in the database.');
      return;
    }
    
    console.log(`Found ${personas.length} matching personas:`);
    personas.forEach(p => console.log(`- ${p.name} (ID: ${p.id})`))
    
    // Process each persona
    for (const persona of personas) {
      console.log(`\nProcessing: ${persona.name} (ID: ${persona.id})`);
      
      // 1. Update artist profile if needed
      if (persona.artist_profile_id) {
        console.log(`Updating artist profile: ${persona.artist_profile_id}`);
        
        const { data: profile, error: profileError } = await supabase
          .from('artist_profiles')
          .select('persona_ids, persona_count')
          .eq('id', persona.artist_profile_id)
          .single();
        
        if (profileError) {
          console.error(`Error fetching artist profile for ${persona.name}:`, profileError);
          continue;
        }
        
        // Remove persona ID from the array
        const updatedPersonaIds = (profile.persona_ids || []).filter(pid => pid !== persona.id);
        
        const { error: updateError } = await supabase
          .from('artist_profiles')
          .update({ 
            persona_ids: updatedPersonaIds,
            persona_count: Math.max(0, (profile.persona_count || 1) - 1)
          })
          .eq('id', persona.artist_profile_id);
        
        if (updateError) {
          console.error(`Error updating artist profile for ${persona.name}:`, updateError);
          continue;
        }
        
        console.log(`Successfully updated artist profile for ${persona.name}`);
      }
      
      // 2. Check for collaboration sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('collaboration_sessions')
        .select('id, personas')
        .contains('personas', [persona.id]);
      
      if (sessionsError) {
        console.error(`Error checking collaboration sessions for ${persona.name}:`, sessionsError);
      } else if (sessions && sessions.length > 0) {
        console.log(`Found ${sessions.length} collaboration sessions containing this persona.`);
        
        // Update each session to remove the persona
        for (const session of sessions) {
          const updatedPersonas = (session.personas || []).filter(pid => pid !== persona.id);
          
          const { error: updateSessionError } = await supabase
            .from('collaboration_sessions')
            .update({ personas: updatedPersonas })
            .eq('id', session.id);
          
          if (updateSessionError) {
            console.error(`Error updating collaboration session ${session.id}:`, updateSessionError);
          } else {
            console.log(`Removed persona from collaboration session ${session.id}`);
          }
        }
      } else {
        console.log('No collaboration sessions found containing this persona.');
      }
      
      // 3. Delete the persona
      const { error: deleteError } = await supabase
        .from('personas')
        .delete()
        .eq('id', persona.id);
      
      if (deleteError) {
        console.error(`Error deleting persona ${persona.name}:`, deleteError);
      } else {
        console.log(`Successfully deleted persona: ${persona.name}`);
      }
    }
    
    console.log('\nPersona removal process completed.');
    
  } catch (error) {
    console.error('Unexpected error during persona removal:', error);
  }
}

// Execute the function
removePersonas().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});