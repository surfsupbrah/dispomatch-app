import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('https://vrffzozygukacmussykj.supabase.co');
}

if (!supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZmZ6b3p5Z3VrYWNtdXNzeWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MTk1ODUsImV4cCI6MjA0ODk5NTU4NX0.3YJoeKiXeyulTItwVKsj5yHif69tRF_iJIDN_qU7vswEY environment variable');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);