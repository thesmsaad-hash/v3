/**
 * Supabase Database Seeder
 * Seeds default blog posts and assets into Supabase if tables are empty.
 * Called once on app startup from App.tsx.
 */

import { supabase } from '../lib/supabase';
import { defaultDigitalAssets } from './assetStorage';
import { blogsData } from '../data/siteData';
import { richBlogContents } from './blogStorage';

export const seedSupabaseIfEmpty = async (): Promise<void> => {
  try {
    // Only attempt seed once per browser session to prevent recreating deleted items
    const alreadySeeded = localStorage.getItem('smsaad_db_seeded_done');
    if (alreadySeeded === 'true') {
      return;
    }

    // ── SEED BLOG POSTS ──────────────────────────────────────
    const { data: existingPosts, error: postsErr } = await supabase
      .from('posts')
      .select('id')
      .limit(1);

    if (postsErr) {
      console.warn('[Seed] Could not check posts table:', postsErr.message);
    } else if (!existingPosts || existingPosts.length === 0) {
      console.log('[Seed] Posts table is empty — seeding default blog posts...');

      const defaultPosts = blogsData.map((b) => ({
        id: b.id,
        title: b.title,
        category: b.category,
        excerpt: b.excerpt,
        content: richBlogContents[b.id] || richBlogContents['1'],
        read_time: b.readTime,
        date: b.date,
        image: b.image,
        author: b.author || 'SM SAAD',
        status: 'published',
        updated_at: new Date().toISOString(),
      }));

      const { error: insertErr } = await supabase.from('posts').insert(defaultPosts);
      if (insertErr) {
        console.warn('[Seed] Failed to seed posts:', insertErr.message);
      } else {
        console.log(`[Seed] ✅ Seeded ${defaultPosts.length} blog posts to Supabase.`);
      }
    } else {
      console.log('[Seed] Posts table already has data — skipping seed.');
    }

    // ── SEED DIGITAL ASSETS ──────────────────────────────────
    const { data: existingAssets, error: assetsErr } = await supabase
      .from('assets')
      .select('id')
      .limit(1);

    if (assetsErr) {
      console.warn('[Seed] Could not check assets table:', assetsErr.message);
    } else if (!existingAssets || existingAssets.length === 0) {
      console.log('[Seed] Assets table is empty — seeding default digital assets...');

      const assetRows = defaultDigitalAssets.map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        description: a.description,
        file_format: a.fileFormat,
        file_size: a.fileSize,
        compatibility: a.compatibility,
        license: a.license,
        image: a.image,
        download_url: a.downloadUrl || '',
        download_count: a.downloadCount,
        featured: a.featured ?? false,
        is_free: a.isFree ?? true,
      }));

      const { error: insertErr } = await supabase.from('assets').insert(assetRows);
      if (insertErr) {
        console.warn('[Seed] Failed to seed assets:', insertErr.message);
      } else {
        console.log(`[Seed] ✅ Seeded ${assetRows.length} digital assets to Supabase.`);
      }
    } else {
      console.log('[Seed] Assets table already has data — skipping seed.');
    }

    localStorage.setItem('smsaad_db_seeded_done', 'true');
  } catch (e) {
    console.warn('[Seed] Supabase not reachable during seed:', e);
  }
};
