import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// If run via `node --env-file=.env`, process.env is populated.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("WARNING: Missing Supabase credentials in process.env. Ensure you run this script with --env-file=.env");
}

const supabase = createClient(supabaseUrl || 'http://placeholder', supabaseKey || 'placeholder');

/**
 * Idempotently inserts a normalized lead using the identity_hash.
 */
export async function upsertLead(normalizedLead) {
  const { data, error } = await supabase
    .from('leads')
    .upsert(normalizedLead, { onConflict: 'identity_hash', ignoreDuplicates: true })
    .select()
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`DB Error on upsert: ${error.message}`);
  }
  return data;
}

/**
 * Fetches leads by their state machine status.
 */
export async function getLeadsByState(state, limit = 10) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('status', state)
    .limit(limit);

  if (error) {
    throw new Error(`DB Error on fetch: ${error.message}`);
  }
  return data || [];
}

/**
 * Atomically updates a lead's state and data.
 */
export async function updateLeadState(id, newState, extraData = {}) {
  const { data, error } = await supabase
    .from('leads')
    .update({ status: newState, ...extraData })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`DB Error on update: ${error.message}`);
  }
  return data;
}
