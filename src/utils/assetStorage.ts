import { upsertAssetToDB, deleteAssetFromDB, fetchAssetsFromDB, incrementAssetDownloadInDB } from './dbService';

export interface DigitalAsset {
  id: string;
  title: string;
  category: 'VFX & Overlays' | 'Editing Presets' | 'Web Templates' | 'AI Workflows' | 'Graphics & Thumbnails';
  description: string;
  fileFormat: string;
  fileSize: string;
  compatibility: string;
  license: string;
  image: string;
  downloadUrl?: string;
  downloadCount: number;
  featured?: boolean;
  isFree: boolean;
}

const STORAGE_KEY = 'smsaad_digital_assets';

export const defaultDigitalAssets: DigitalAsset[] = [
  {
    id: 'asset-1',
    title: '4K Cinematic Film Grain & Dust Overlays Pack',
    category: 'VFX & Overlays',
    description: 'High-quality 4K ProRes 35mm film grain, dust particles, and organic light leak overlays for cinematic video editing.',
    fileFormat: 'MP4 / ProRes (.zip)',
    fileSize: '485 MB',
    compatibility: 'Premiere Pro, After Effects, DaVinci Resolve, Final Cut Pro',
    license: 'Free for Personal & Commercial Use',
    image: '/assets/images/works2.jpg',
    downloadUrl: 'https://github.com/thesmsaad-hash',
    downloadCount: 1420,
    featured: true,
    isFree: true
  },
  {
    id: 'asset-2',
    title: 'Smooth Kinetic Title & Typography Animation Kit',
    category: 'Editing Presets',
    description: 'Customizable motion graphics title templates with kinetic text animations, glow effects, and sound triggers.',
    fileFormat: '.mogrt / .aep',
    fileSize: '120 MB',
    compatibility: 'Premiere Pro 2024+ & After Effects',
    license: 'Free for Personal & Commercial Use',
    image: '/assets/images/works3.jpg',
    downloadUrl: 'https://github.com/thesmsaad-hash',
    downloadCount: 980,
    featured: true,
    isFree: true
  },
  {
    id: 'asset-3',
    title: 'React & Tailwind Creator Portfolio Starter Kit',
    category: 'Web Templates',
    description: 'Production-ready React + TypeScript + Tailwind CSS portfolio template with dark mode, grid layout, and smooth routing.',
    fileFormat: 'Source Code (.zip)',
    fileSize: '4.2 MB',
    compatibility: 'React 18, Vite, Next.js, Node.js 18+',
    license: 'MIT License (100% Open Source)',
    image: '/assets/images/works1.jpg',
    downloadUrl: 'https://github.com/thesmsaad-hash',
    downloadCount: 2150,
    featured: true,
    isFree: true
  },
  {
    id: 'asset-4',
    title: 'High-CTR YouTube Thumbnail PSD & Canva Templates',
    category: 'Graphics & Thumbnails',
    description: 'Attention-focused YouTube thumbnail design templates featuring high-contrast subject cutouts, lighting effects, and bold fonts.',
    fileFormat: '.psd & Canva Link',
    fileSize: '85 MB',
    compatibility: 'Adobe Photoshop & Canva Free/Pro',
    license: 'Free for Personal & Commercial Use',
    image: '/assets/images/works4.jpg',
    downloadUrl: 'https://github.com/thesmsaad-hash',
    downloadCount: 1840,
    featured: false,
    isFree: true
  },
  {
    id: 'asset-5',
    title: 'n8n Video Editing & Social Content Automation Workflow',
    category: 'AI Workflows',
    description: 'Node-based n8n automation workflow JSON for auto-generating captions, organizing raw media files, and triggering AI video ideation.',
    fileFormat: 'n8n Workflow (.json)',
    fileSize: '150 KB',
    compatibility: 'n8n Desktop / Cloud & Ollama Local AI',
    license: 'Free for Personal & Commercial Use',
    image: '/assets/images/why.jpg',
    downloadUrl: 'https://github.com/thesmsaad-hash',
    downloadCount: 760,
    featured: false,
    isFree: true
  },
  {
    id: 'asset-6',
    title: 'Fast-Cut Short-Form Sound Effects & Risers Pack',
    category: 'Editing Presets',
    description: 'Clean audio collection of swooshes, impacts, pop sounds, risers, and click cues engineered for Instagram Reels & Shorts.',
    fileFormat: 'WAV 24-bit 48kHz (.zip)',
    fileSize: '95 MB',
    compatibility: 'All NLE Video Editors',
    license: 'Royalty-Free Commercial License',
    image: '/assets/images/about.jpg',
    downloadUrl: 'https://github.com/thesmsaad-hash',
    downloadCount: 1290,
    featured: false,
    isFree: true
  }
];

// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE — synchronous reads (instant for UI)
// ─────────────────────────────────────────────────────────────

export const getStoredDigitalAssets = (): DigitalAsset[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load digital assets from localStorage', e);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDigitalAssets));
  return defaultDigitalAssets;
};

// ─────────────────────────────────────────────────────────────
// SUPABASE SYNC — async, call on mount to get latest from DB
// ─────────────────────────────────────────────────────────────

/**
 * Load assets from Supabase and refresh localStorage cache.
 * Returns null if Supabase is unreachable (falls back to localStorage).
 */
export const syncAssetsFromSupabase = async (): Promise<DigitalAsset[] | null> => {
  const remote = await fetchAssetsFromDB();
  if (remote && remote.length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
    return remote;
  }
  return null;
};

// ─────────────────────────────────────────────────────────────
// WRITE — sync to both localStorage + Supabase
// ─────────────────────────────────────────────────────────────

export const saveStoredDigitalAsset = (asset: DigitalAsset): DigitalAsset[] => {
  const current = getStoredDigitalAssets();
  const index = current.findIndex((a) => a.id === asset.id);

  let updated: DigitalAsset[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = asset;
  } else {
    updated = [asset, ...current];
  }

  // 1. Save locally (instant)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // 2. Sync to Supabase in background (non-blocking)
  upsertAssetToDB(asset).then((ok) => {
    if (ok) console.log('[DB] Asset synced to Supabase:', asset.title);
  });

  return updated;
};

export const incrementDownloadCount = (id: string): DigitalAsset[] => {
  const current = getStoredDigitalAssets();
  const updated = current.map((a) =>
    a.id === id ? { ...a, downloadCount: a.downloadCount + 1 } : a
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Sync new count to Supabase
  const updatedAsset = updated.find((a) => a.id === id);
  if (updatedAsset) {
    incrementAssetDownloadInDB(id, updatedAsset.downloadCount).then((ok) => {
      if (ok) console.log('[DB] Download count synced to Supabase:', id);
    });
  }

  return updated;
};

export const deleteStoredDigitalAsset = (id: string): DigitalAsset[] => {
  const current = getStoredDigitalAssets();
  const updated = current.filter((a) => a.id !== id);

  // 1. Remove locally
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // 2. Remove from Supabase in background
  deleteAssetFromDB(id).then((ok) => {
    if (ok) console.log('[DB] Asset deleted from Supabase:', id);
  });

  return updated;
};

export const resetStoredDigitalAssets = (): DigitalAsset[] => {
  localStorage.removeItem(STORAGE_KEY);
  return getStoredDigitalAssets();
};
