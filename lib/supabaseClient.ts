import { createClient } from '@supabase/supabase-js';

// NOTE: In a real production app, these should be in environment variables.
// For this demo, we handle the case where they might be missing to prevent crashes.
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'public-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to check if supabase is actually configured
export const isSupabaseConfigured = () => {
    return SUPABASE_URL !== 'https://xyzcompany.supabase.co' && SUPABASE_ANON_KEY !== 'public-anon-key';
};