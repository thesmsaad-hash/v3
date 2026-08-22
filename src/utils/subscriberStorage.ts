/**
 * Blog Subscribers Storage & Supabase Sync
 * Handles blog newsletter subscriptions, local caching, and Supabase integration.
 */

import { supabase } from '../lib/supabase';

export interface BlogSubscriber {
  id: string;
  email: string;
  source: string;
  status: 'active' | 'unsubscribed';
  createdAt: string;
}

const STORAGE_KEY = 'smsaad_blog_subscribers';

export const defaultSubscribers: BlogSubscriber[] = [
  {
    id: 'sub-1',
    email: 'creator.alex@gmail.com',
    source: 'Blog Footer Newsletter',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
  },
  {
    id: 'sub-2',
    email: 'vfx.pro.studio@outlook.com',
    source: 'VFX Article',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
  },
  {
    id: 'sub-3',
    email: 'editor.marcus@creativehub.io',
    source: 'Free Assets Download',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString()
  }
];

// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE — Synchronous reads for UI
// ─────────────────────────────────────────────────────────────

export const getStoredSubscribers = (): BlogSubscriber[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data !== null) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load subscribers from localStorage', e);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSubscribers));
  return defaultSubscribers;
};

// ─────────────────────────────────────────────────────────────
// SUPABASE SYNC — Async DB helpers
// ─────────────────────────────────────────────────────────────

export const fetchSubscribersFromDB = async (): Promise<BlogSubscriber[] | null> => {
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] fetchSubscribers error:', error.message);
      return null;
    }

    return (data || []).map((row: any) => ({
      id: row.id || row.email,
      email: row.email,
      source: row.source || 'Blog Newsletter',
      status: row.status || 'active',
      createdAt: row.created_at || new Date().toISOString()
    }));
  } catch (e) {
    console.warn('[Supabase] fetchSubscribers exception:', e);
    return null;
  }
};

export const syncSubscribersFromSupabase = async (): Promise<BlogSubscriber[] | null> => {
  const remote = await fetchSubscribersFromDB();
  if (remote !== null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
    return remote;
  }
  return null;
};

export const addSubscriberToDB = async (subscriber: BlogSubscriber): Promise<boolean> => {
  try {
    const { error } = await supabase.from('subscribers').upsert({
      id: subscriber.id,
      email: subscriber.email.toLowerCase().trim(),
      source: subscriber.source,
      status: subscriber.status,
      created_at: subscriber.createdAt
    });

    if (error) {
      console.warn('[Supabase] addSubscriber error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[Supabase] addSubscriber exception:', e);
    return false;
  }
};

export const deleteSubscriberFromDB = async (idOrEmail: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .or(`id.eq.${idOrEmail},email.eq.${idOrEmail}`);

    if (error) {
      console.warn('[Supabase] deleteSubscriber error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[Supabase] deleteSubscriber exception:', e);
    return false;
  }
};

// ─────────────────────────────────────────────────────────────
// WRITE OPERATIONS (Save / Delete / Subscribe)
// ─────────────────────────────────────────────────────────────

export const saveStoredSubscriber = async (subscriber: BlogSubscriber): Promise<BlogSubscriber[]> => {
  const current = getStoredSubscribers();
  const index = current.findIndex(
    (s) => s.id === subscriber.id || s.email.toLowerCase() === subscriber.email.toLowerCase()
  );

  let updated: BlogSubscriber[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = subscriber;
  } else {
    updated = [subscriber, ...current];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  await addSubscriberToDB(subscriber);
  return updated;
};

export const deleteStoredSubscriber = async (id: string): Promise<BlogSubscriber[]> => {
  const current = getStoredSubscribers();
  const updated = current.filter((s) => s.id !== id && s.email !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  await deleteSubscriberFromDB(id);
  return updated;
};

/**
 * Helper to subscribe from public blog forms
 */
export const addNewsletterSubscriber = async (
  email: string,
  source: string = 'Blog Newsletter'
): Promise<{ success: boolean; message: string }> => {
  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  const current = getStoredSubscribers();
  const existing = current.find((s) => s.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: true, message: 'You are already subscribed to the creator newsletter!' };
  }

  const newSub: BlogSubscriber = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    source,
    status: 'active',
    createdAt: new Date().toISOString()
  };

  await saveStoredSubscriber(newSub);
  return { success: true, message: 'Thank you for subscribing! You will receive new video insights.' };
};
