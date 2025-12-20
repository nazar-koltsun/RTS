// This is a test file to verify Supabase connection
// You can import and use this in a page to test the connection

import { supabase } from './supabase';

export async function testSupabaseConnection() {
  try {
    // Test connection by fetching from a table (adjust table name as needed)
    const { data, error } = await supabase.from('test').select('*').limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error: error.message };
    }

    console.log('Supabase connected successfully!', data);
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: err.message };
  }
}
