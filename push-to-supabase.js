/**
 * push-to-supabase.js
 * Run: node push-to-supabase.js
 * Pushes all default blog posts and digital assets directly to Supabase.
 */

const SUPABASE_URL = 'https://forpkxqsczebezeutkta.supabase.co';
const SUPABASE_KEY = 'sb_publishable_LqyuMjUEL9FjXOBm7faAIg_FTwVsO5z';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Prefer': 'resolution=merge-duplicates'
};

// ──────────────────────────────────────────────
// DEFAULT BLOG POSTS DATA
// ──────────────────────────────────────────────
const defaultContent = (title, excerpt) => `## Executive Overview

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

const blogPosts = [
  {
    id: "1",
    title: "Kalakar AI Review: AI Captioning Software for Desi Creators",
    excerpt: "Discover Kalakar AI, an AI captioning platform built for Desi creators with multilingual captions, templates, audio enhancement, and professional editing integrations.",
    category: "Web & AI",
    date: "2026",
    read_time: "5 min read",
    image: "/assets/images/works4.jpg",
    author: "SM SAAD",
    status: 'published',
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "How AI Is Changing Creative Workflows",
    excerpt: "Exploring how modern AI tools accelerate visual ideation, concept generation, and repetitive task automation without replacing human creativity.",
    category: "AI Technology",
    date: "2026",
    read_time: "5 min read",
    image: "/assets/images/works2.jpg",
    author: "SM SAAD",
    status: 'published',
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    title: "Why Sound Design Matters in Video Editing",
    excerpt: "How subtle audio layering, Foley effects, risers, and impact cues transform average edits into immersive visual experiences.",
    category: "Post Production",
    date: "2026",
    read_time: "4 min read",
    image: "/assets/images/works3.jpg",
    author: "SM SAAD",
    status: 'published',
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    title: "My Video Editing Workflow",
    excerpt: "A step-by-step walkthrough of organizing media, rough cuts, fine tuning, VFX integration, color grading, and final platform delivery.",
    category: "Workflow",
    date: "2026",
    read_time: "6 min read",
    image: "/assets/images/works4.jpg",
    author: "SM SAAD",
    status: 'published',
    updated_at: new Date().toISOString()
  },
  {
    id: "5",
    title: "VFX Compositing Techniques Every Editor Should Understand",
    excerpt: "Essential compositing principles including light wrap, color matching, grain management, and edge blending for seamless visual integration.",
    category: "VFX & Compositing",
    date: "2026",
    read_time: "5 min read",
    image: "/assets/images/why.jpg",
    author: "SM SAAD",
    status: 'published',
    updated_at: new Date().toISOString()
  },
  {
    id: "6",
    title: "Building Digital Projects With AI-Assisted Development",
    excerpt: "Combining web development fundamentals with AI tools to build experimental interfaces, automations, and modern web applications.",
    category: "Web & AI",
    date: "2026",
    read_time: "5 min read",
    image: "/assets/images/about.jpg",
    author: "SM SAAD",
    status: 'published',
    updated_at: new Date().toISOString()
  }
].map(p => ({ ...p, content: defaultContent(p.title, p.excerpt) }));

// ──────────────────────────────────────────────
// DEFAULT DIGITAL ASSETS DATA
// ──────────────────────────────────────────────
const digitalAssets = [
  {
    id: 'asset-1',
    title: '4K Cinematic Film Grain & Dust Overlays Pack',
    category: 'VFX & Overlays',
    description: 'High-quality 4K ProRes 35mm film grain, dust particles, and organic light leak overlays for cinematic video editing.',
    file_format: 'MP4 / ProRes (.zip)',
    file_size: '485 MB',
    compatibility: 'Premiere Pro, After Effects, DaVinci Resolve, Final Cut Pro',
    license: 'Free for Personal & Commercial Use',
    image: '/assets/images/works2.jpg',
    download_url: 'https://github.com/thesmsaad-hash',
    download_count: 1420,
    featured: true,
    is_free: true
  },
  {
    id: 'asset-2',
    title: 'Smooth Kinetic Title & Typography Animation Kit',
    category: 'Editing Presets',
    description: 'Customizable motion graphics title templates with kinetic text animations, glow effects, and sound triggers.',
    file_format: '.mogrt / .aep',
    file_size: '120 MB',
    compatibility: 'Premiere Pro 2024+ & After Effects',
    license: 'Free for Personal & Commercial Use',
    image: '/assets/images/works3.jpg',
    download_url: 'https://github.com/thesmsaad-hash',
    download_count: 980,
    featured: true,
    is_free: true
  },
  {
    id: 'asset-3',
    title: 'React & Tailwind Creator Portfolio Starter Kit',
    category: 'Web Templates',
    description: 'Production-ready React + TypeScript + Tailwind CSS portfolio template with dark mode, grid layout, and smooth routing.',
    file_format: 'Source Code (.zip)',
    file_size: '4.2 MB',
    compatibility: 'React 18, Vite, Next.js, Node.js 18+',
    license: 'MIT License (100% Open Source)',
    image: '/assets/images/works1.jpg',
    download_url: 'https://github.com/thesmsaad-hash',
    download_count: 2150,
    featured: true,
    is_free: true
  },
  {
    id: 'asset-4',
    title: 'High-CTR YouTube Thumbnail PSD & Canva Templates',
    category: 'Graphics & Thumbnails',
    description: 'Attention-focused YouTube thumbnail design templates featuring high-contrast subject cutouts, lighting effects, and bold fonts.',
    file_format: '.psd & Canva Link',
    file_size: '85 MB',
    compatibility: 'Adobe Photoshop & Canva Free/Pro',
    license: 'Free for Personal & Commercial Use',
    image: '/assets/images/works4.jpg',
    download_url: 'https://github.com/thesmsaad-hash',
    download_count: 1840,
    featured: false,
    is_free: true
  },
  {
    id: 'asset-5',
    title: 'n8n Video Editing & Social Content Automation Workflow',
    category: 'AI Workflows',
    description: 'Node-based n8n automation workflow JSON for auto-generating captions, organizing raw media files, and triggering AI video ideation.',
    file_format: 'n8n Workflow (.json)',
    file_size: '150 KB',
    compatibility: 'n8n Desktop / Cloud & Ollama Local AI',
    license: 'Free for Personal & Commercial Use',
    image: '/assets/images/why.jpg',
    download_url: 'https://github.com/thesmsaad-hash',
    download_count: 760,
    featured: false,
    is_free: true
  },
  {
    id: 'asset-6',
    title: 'Fast-Cut Short-Form Sound Effects & Risers Pack',
    category: 'Editing Presets',
    description: 'Clean audio collection of swooshes, impacts, pop sounds, risers, and click cues engineered for Instagram Reels & Shorts.',
    file_format: 'WAV 24-bit 48kHz (.zip)',
    file_size: '95 MB',
    compatibility: 'All NLE Video Editors',
    license: 'Royalty-Free Commercial License',
    image: '/assets/images/about.jpg',
    download_url: 'https://github.com/thesmsaad-hash',
    download_count: 1290,
    featured: false,
    is_free: true
  }
];

// ──────────────────────────────────────────────
// PUSH FUNCTIONS
// ──────────────────────────────────────────────
async function pushTable(tableName, rows) {
  console.log(`\n📤 Pushing ${rows.length} rows to [${tableName}]...`);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(rows)
  });

  if (res.ok) {
    console.log(`✅ [${tableName}] — ${rows.length} rows upserted successfully!`);
  } else {
    const err = await res.json().catch(() => res.text());
    console.error(`❌ [${tableName}] failed:`, JSON.stringify(err, null, 2));
  }
}

async function main() {
  console.log('🚀 SM SAAD — Supabase Data Push');
  console.log('📡 Target:', SUPABASE_URL);
  console.log('─'.repeat(50));

  await pushTable('posts', blogPosts);
  await pushTable('assets', digitalAssets);

  console.log('\n─'.repeat(50));
  console.log('🎉 Done! Check your Supabase Dashboard → Table Editor.');
}

main().catch(console.error);
