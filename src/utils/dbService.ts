/**
 * Supabase Database Service — Blogs & Assets
 *
 * This module provides async Supabase CRUD helpers for blogs and assets.
 * All functions fall back gracefully to localStorage if Supabase is unavailable.
 *
 * Required Supabase tables:
 *
 *  Table: posts
 *   id            text primary key
 *   title         text
 *   category      text
 *   excerpt       text
 *   content       text
 *   read_time     text
 *   date          text
 *   image         text
 *   author        text
 *   status        text  ('published' | 'draft')
 *   updated_at    timestamptz default now()
 *
 *  Table: assets
 *   id             text primary key
 *   title          text
 *   category       text
 *   description    text
 *   file_format    text
 *   file_size      text
 *   compatibility  text
 *   license        text
 *   image          text
 *   download_url   text
 *   download_count integer default 0
 *   featured       boolean default false
 *   is_free        boolean default true
 */

import { supabase } from '../lib/supabase';
import type { ExtendedBlogPost } from './blogStorage';
import type { DigitalAsset } from './assetStorage';

// ============================================================
// BLOG POSTS — Supabase
// ============================================================

/** Fetch all posts from Supabase */
export const fetchBlogPostsFromDB = async (): Promise<ExtendedBlogPost[] | null> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] fetchBlogPosts error:', error.message);
      return null;
    }

    // Map snake_case DB columns → camelCase app fields
    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      excerpt: row.excerpt,
      content: row.content,
      readTime: row.read_time,
      date: row.date,
      image: row.image,
      author: row.author,
      status: row.status,
      updatedAt: row.updated_at,
    }));
  } catch (e) {
    console.warn('[Supabase] fetchBlogPosts exception:', e);
    return null;
  }
};

/** Upsert (create or update) a single post in Supabase */
export const upsertBlogPostToDB = async (post: ExtendedBlogPost): Promise<boolean> => {
  try {
    const { error } = await supabase.from('posts').upsert({
      id: post.id,
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      read_time: post.readTime,
      date: post.date,
      image: post.image,
      author: post.author,
      status: post.status,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('[Supabase] upsertBlogPost error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[Supabase] upsertBlogPost exception:', e);
    return false;
  }
};

/** Delete a post from Supabase */
export const deleteBlogPostFromDB = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      console.warn('[Supabase] deleteBlogPost error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[Supabase] deleteBlogPost exception:', e);
    return false;
  }
};

// ============================================================
// DIGITAL ASSETS — Supabase
// ============================================================

/** Fetch all assets from Supabase */
export const fetchAssetsFromDB = async (): Promise<DigitalAsset[] | null> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.warn('[Supabase] fetchAssets error:', error.message);
      return null;
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      description: row.description,
      fileFormat: row.file_format,
      fileSize: row.file_size,
      compatibility: row.compatibility,
      license: row.license,
      image: row.image,
      downloadUrl: row.download_url,
      downloadCount: row.download_count ?? 0,
      featured: row.featured ?? false,
      isFree: row.is_free ?? true,
    }));
  } catch (e) {
    console.warn('[Supabase] fetchAssets exception:', e);
    return null;
  }
};

/** Upsert (create or update) a single asset in Supabase */
export const upsertAssetToDB = async (asset: DigitalAsset): Promise<boolean> => {
  try {
    const { error } = await supabase.from('assets').upsert({
      id: asset.id,
      title: asset.title,
      category: asset.category,
      description: asset.description,
      file_format: asset.fileFormat,
      file_size: asset.fileSize,
      compatibility: asset.compatibility,
      license: asset.license,
      image: asset.image,
      download_url: asset.downloadUrl,
      download_count: asset.downloadCount,
      featured: asset.featured ?? false,
      is_free: asset.isFree ?? true,
    });

    if (error) {
      console.warn('[Supabase] upsertAsset error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[Supabase] upsertAsset exception:', e);
    return false;
  }
};

/** Increment download count in Supabase */
export const incrementAssetDownloadInDB = async (id: string, newCount: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('assets')
      .update({ download_count: newCount })
      .eq('id', id);

    if (error) {
      console.warn('[Supabase] incrementDownload error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[Supabase] incrementDownload exception:', e);
    return false;
  }
};

/** Delete an asset from Supabase */
export const deleteAssetFromDB = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('assets').delete().eq('id', id);
    if (error) {
      console.warn('[Supabase] deleteAsset error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[Supabase] deleteAsset exception:', e);
    return false;
  }
};
