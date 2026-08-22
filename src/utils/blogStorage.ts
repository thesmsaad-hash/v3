import { BlogPost, blogsData } from '../data/siteData';
import { upsertBlogPostToDB, deleteBlogPostFromDB, fetchBlogPostsFromDB } from './dbService';

const STORAGE_KEY = 'smsaad_blog_posts';

export interface ExtendedBlogPost extends BlogPost {
  content?: string;
  status?: 'published' | 'draft';
  updatedAt?: string;
}

const defaultContent = (b: BlogPost) => `## Executive Overview

${b.excerpt}

## Introduction

As a **Video Editor, VFX Compositing Artist & Web Developer**, creating high-impact content requires combining narrative pacing, visual polish, sound cues, and modern technological tools.

## Key Principles & Techniques

1. **Focus on Story First**: Every edit, transition, and effect should support the overarching message.
2. **Attention to Detail**: Subtle color adjustments, audio leveling, and edge compositing elevate production quality.
3. **Embrace Technology**: Utilizing modern software and AI workflows accelerates creative experimentation.

> "Good editing and compositing should feel seamless — guiding the viewer's attention without distracting from the story."

## Workflow Summary

- **Planning**: Define visual goals, structure, and media organization.
- **Execution**: Cut, composite, animate, and grade.
- **Finishing**: Sound design, subtitles, and platform-specific exports.

---
*Published on smsaad.online by SM SAAD.*
`;

// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE — synchronous reads (instant for UI)
// ─────────────────────────────────────────────────────────────

export const getStoredBlogPosts = (): ExtendedBlogPost[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data !== null) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load blog posts from localStorage', e);
  }

  const defaults: ExtendedBlogPost[] = blogsData.map((b) => ({
    ...b,
    status: 'published',
    content: defaultContent(b),
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  return defaults;
};

// ─────────────────────────────────────────────────────────────
// SUPABASE SYNC — async, call on mount to get latest from DB
// ─────────────────────────────────────────────────────────────

/**
 * Load posts from Supabase and refresh localStorage cache.
 * Returns null if Supabase is unreachable (falls back to localStorage).
 */
export const syncBlogPostsFromSupabase = async (): Promise<ExtendedBlogPost[] | null> => {
  const remote = await fetchBlogPostsFromDB();
  if (remote !== null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
    return remote;
  }
  return null;
};

// ─────────────────────────────────────────────────────────────
// WRITE — sync to both localStorage + Supabase
// ─────────────────────────────────────────────────────────────

export const saveStoredBlogPost = (post: ExtendedBlogPost): ExtendedBlogPost[] => {
  const current = getStoredBlogPosts();
  const index = current.findIndex((p) => p.id === post.id);
  const withTimestamp = { ...post, updatedAt: new Date().toISOString() };

  let updated: ExtendedBlogPost[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = withTimestamp;
  } else {
    updated = [withTimestamp, ...current];
  }

  // 1. Save locally (instant)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // 2. Sync to Supabase in background (non-blocking)
  upsertBlogPostToDB(withTimestamp).then((ok) => {
    if (ok) console.log('[DB] Blog post synced to Supabase:', post.title);
  });

  return updated;
};

export const deleteStoredBlogPost = (id: string): ExtendedBlogPost[] => {
  const current = getStoredBlogPosts();
  const updated = current.filter((p) => p.id !== id);

  // 1. Remove locally
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // 2. Remove from Supabase in background
  deleteBlogPostFromDB(id).then((ok) => {
    if (ok) console.log('[DB] Blog post deleted from Supabase:', id);
  });

  return updated;
};

export const resetStoredBlogPosts = (): ExtendedBlogPost[] => {
  localStorage.removeItem(STORAGE_KEY);
  return getStoredBlogPosts();
};
