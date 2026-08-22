/**
 * Supabase Database Seeder
 * Seeds default blog posts and assets into Supabase if tables are empty.
 * Called once on app startup from App.tsx.
 */

import { supabase } from '../lib/supabase';
import { defaultDigitalAssets } from './assetStorage';
import { blogsData } from '../data/siteData';

const DEFAULT_CONTENT = (title: string, excerpt: string) => `## Executive Overview

${excerpt}

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
        content: DEFAULT_CONTENT(b.title, b.excerpt),
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
