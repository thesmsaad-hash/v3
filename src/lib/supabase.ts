/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const getEnvVar = (viteKey: string, nextKey: string, fallback: string): string => {
  const env = (import.meta as any).env || {};
  return env[viteKey] || env[nextKey] || process.env[viteKey] || process.env[nextKey] || fallback;
};

const supabaseUrl = getEnvVar(
  'VITE_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'https://forpkxqsczebezeutkta.supabase.co'
);

const supabaseAnonKey = getEnvVar(
  'VITE_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'sb_publishable_LqyuMjUEL9FjXOBm7faAIg_FTwVsO5z'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const AUTHORIZED_ADMIN_EMAIL = 'smsaad05082003@gmail.com';

// ----------------------------------------------------
// BACKEND SUPABASE DATABASE HELPERS
// ----------------------------------------------------

/**
 * Fetch articles from Supabase 'posts' table
 */
export const fetchPostsFromSupabase = async () => {
  try {
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetch error, fallback to local storage:', error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.warn('Supabase not reachable:', e);
    return null;
  }
};

/**
 * Sync / Upsert post to Supabase 'posts' table
 */
export const upsertPostToSupabase = async (post: any) => {
  try {
    const { data, error } = await supabase.from('posts').upsert(post);
    if (error) console.warn('Supabase post upsert error:', error.message);
    return data;
  } catch (e) {
    console.warn('Supabase post upsert exception:', e);
  }
};

/**
 * Delete post from Supabase
 */
export const deletePostFromSupabase = async (id: string) => {
  try {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) console.warn('Supabase delete error:', error.message);
  } catch (e) {
    console.warn('Supabase delete exception:', e);
  }
};
