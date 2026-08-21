import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Download, Search, Sparkles, CheckCircle, FileText, Layers, Video, Code, Image as ImageIcon,
  Zap, ArrowUpRight, ShieldCheck, X, Eye, Package, ExternalLink, Settings, CheckCircle2,
  HardDrive, Cpu, Terminal, Sparkle, ArrowRight, Share2, Check
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { StaggerContainer, StaggerItem } from '../components/AnimatedStagger';
import {
  getStoredDigitalAssets,
  incrementDownloadCount,
  saveStoredDigitalAsset,
  syncAssetsFromSupabase,
  DigitalAsset
} from '../utils/assetStorage';

export const DigitalAssetsStore: React.FC = () => {
  const [assets, setAssets] = useState<DigitalAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'specs' | 'features'>('overview');

  useEffect(() => {
    setAssets(getStoredDigitalAssets());

    // Sync from Supabase for latest data
    syncAssetsFromSupabase().then((remote) => {
      if (remote) setAssets(remote);
    });
  }, []);

  const categories = [
    'All',
    'VFX & Overlays',
    'Editing Presets',
    'Web Templates',
    'AI Workflows',
    'Graphics & Thumbnails'
  ];

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (asset: DigitalAsset) => {
    setDownloadingId(asset.id);
    
    setTimeout(() => {
      const updated = incrementDownloadCount(asset.id);
      setAssets(updated);
      setDownloadingId(null);
      setDownloadSuccess(`Successfully downloaded "${asset.title}"!`);

      if (asset.downloadUrl && asset.downloadUrl.startsWith('http')) {
        window.open(asset.downloadUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Trigger package text file fallback download
        const element = document.createElement("a");
        const file = new Blob([
          `SM SAAD DIGITAL ASSET PACKAGE\n\nTitle: ${asset.title}\nCategory: ${asset.category}\nFormat: ${asset.fileFormat}\nLicense: ${asset.license}\nDownload Link: ${asset.downloadUrl || 'https://smsaad.online'}\n\nOfficial Website: https://smsaad.online\nGitHub: https://github.com/thesmsaad-hash\n\nThank you for downloading from SM SAAD's Creator Store!`
        ], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${asset.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-pack.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }

      setTimeout(() => setDownloadSuccess(null), 4000);
    }, 800);
  };

  const handleShareAsset = (asset: DigitalAsset) => {
    navigator.clipboard.writeText(`${window.location.origin}/assets?id=${asset.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-16 bg-north-bg text-north-black min-h-screen">
      
      {/* Toast Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-north-black text-north-lime border border-north-black px-6 py-4 shadow-[6px_6px_0px_0px_rgba(200,255,0,1)] font-heading text-xs uppercase font-extrabold flex items-center space-x-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-north-lime" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* 1. STORE HERO BANNER */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 md:pt-16">
        <div className="border border-north-black bg-white p-8 md:p-14 space-y-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-north-dark-sand pb-4">
            <div className="inline-flex items-center space-x-2 border border-north-black bg-north-lime px-3.5 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="w-2.5 h-2.5 bg-north-black rounded-full animate-pulse inline-block"></span>
              <span className="font-heading font-extrabold text-[11px] uppercase tracking-wider text-north-black">
                100% FREE CREATOR RESOURCES & ASSETS
              </span>
            </div>

            <span className="bg-north-black text-north-lime font-heading font-bold text-xs uppercase px-3 py-1 border border-north-black">
              NO SIGNUP REQUIRED
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase tracking-tight max-w-4xl leading-tight">
            Free Digital Assets & Toolkits
          </h1>

          <p className="text-north-gray font-body text-base sm:text-lg max-w-3xl leading-relaxed">
            Free VFX overlays, Premiere Pro & After Effects presets, motion graphic templates, web code starters, and AI workflows — engineered for personal and commercial projects by <strong>SM SAAD</strong>.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-north-dark-sand">
            <div className="border border-north-black bg-north-bg p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="font-heading text-xs uppercase font-bold text-north-gray block">Available Assets</span>
              <span className="font-heading text-2xl font-extrabold text-north-black mt-1 block">{assets.length} Packs</span>
            </div>
            <div className="border border-north-black bg-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="font-heading text-xs uppercase font-bold text-north-lime-dark block">License</span>
              <span className="font-heading text-2xl font-extrabold text-north-black mt-1 block">Commercial Use</span>
            </div>
            <div className="border border-north-black bg-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="font-heading text-xs uppercase font-bold text-north-gray block">Total Downloads</span>
              <span className="font-heading text-2xl font-extrabold text-north-black mt-1 block">
                {assets.reduce((sum, a) => sum + a.downloadCount, 0).toLocaleString()}+
              </span>
            </div>
            <div className="border border-north-black bg-north-black text-white p-4 shadow-[2px_2px_0px_0px_rgba(200,255,0,1)]">
              <span className="font-heading text-xs uppercase font-bold text-north-lime block">Official Store</span>
              <span className="font-heading text-2xl font-extrabold text-white mt-1 block">smsaad.online</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY & SEARCH FILTER BAR */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="border border-north-black bg-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-heading font-bold text-xs uppercase tracking-wider px-4 py-2.5 border border-north-black transition-all ${
                  selectedCategory === cat
                    ? 'bg-north-black text-north-lime shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-north-bg text-north-black hover:bg-north-lime'
                }`}
              >
                {cat === 'All' ? 'All Assets' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-north-gray" />
            <input
              type="text"
              placeholder="Search assets by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-north-bg border border-north-black text-north-black text-xs font-body focus:outline-none focus:ring-2 focus:ring-north-lime"
            />
          </div>
        </div>
      </section>

      {/* 3. PRODUCT GRID */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {filteredAssets.length === 0 ? (
          <div className="border border-north-black bg-white p-12 text-center space-y-4">
            <Package className="w-12 h-12 text-north-gray mx-auto" />
            <h3 className="font-heading text-xl font-bold uppercase">No Digital Assets Found</h3>
            <p className="text-north-gray text-xs">Try selecting another category or clearing your search term.</p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAssets.map((asset) => (
              <StaggerItem key={asset.id} className="h-full">
                <div className="border border-north-black bg-white flex flex-col justify-between group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 relative h-full">
                  
                  {/* Product Card Top Image & Badges */}
                  <div className="space-y-4">
                    <div className="relative aspect-[16/10] border-b border-north-black bg-north-bg overflow-hidden">
                      <img
                        src={asset.image}
                        alt={asset.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Free Badge */}
                      <span className="absolute top-3 right-3 bg-north-lime text-north-black font-heading font-extrabold text-[11px] uppercase px-3 py-1 border border-north-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        FREE DOWNLOAD
                      </span>

                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 bg-north-black text-white font-heading font-bold text-[10px] uppercase px-2.5 py-1 border border-north-black">
                        {asset.category}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs font-heading font-bold text-north-gray uppercase">
                        <span>{asset.fileFormat}</span>
                        <span>{asset.fileSize}</span>
                      </div>

                      <h3 className="font-heading text-xl font-bold uppercase text-north-black group-hover:text-north-lime-dark transition-colors line-clamp-2">
                        {asset.title}
                      </h3>

                      <p className="text-north-gray text-xs line-clamp-3 leading-relaxed">
                        {asset.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div className="p-6 pt-0 border-t border-north-dark-sand mt-4 space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-heading font-bold uppercase text-north-gray">
                      <span className="flex items-center">
                        <Download className="w-3.5 h-3.5 mr-1 text-north-lime-dark" />
                        {asset.downloadCount.toLocaleString()} Downloads
                      </span>
                      <span className="text-emerald-700 font-bold">Royalty Free</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setSelectedAsset(asset);
                          setActiveDetailTab('overview');
                        }}
                        className="w-full py-3 bg-white text-north-black border border-north-black font-heading font-bold text-xs uppercase hover:bg-north-bg transition-colors inline-flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        <span>View Details</span>
                      </button>

                      <button
                        onClick={() => handleDownload(asset)}
                        disabled={downloadingId === asset.id}
                        className="w-full py-3 bg-north-black text-north-lime hover:bg-north-lime hover:text-north-black border border-north-black font-heading font-extrabold text-xs uppercase transition-colors inline-flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        <span>{downloadingId === asset.id ? 'Getting...' : 'Free Download'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>

      {/* 4. REDESIGNED FREE ASSETS DETAILS & SPECIFICATIONS MODAL */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-north-black/85 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-sm">
          <div className="border-2 border-north-black bg-white w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedAsset(null)}
              className="absolute top-4 right-4 p-2 bg-north-black text-white hover:bg-north-lime hover:text-north-black border border-north-black z-20 shadow-[2px_2px_0px_0px_rgba(200,255,0,1)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* MODAL HEADER */}
            <div className="p-6 md:p-8 bg-north-bg border-b border-north-black space-y-3 pr-14">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-north-lime text-north-black font-heading font-extrabold text-xs uppercase px-3 py-1 border border-north-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {selectedAsset.category}
                </span>
                <span className="bg-north-black text-white font-heading font-bold text-xs uppercase px-3 py-1 border border-north-black">
                  100% FREE ASSET PACK
                </span>
              </div>

              <h2 className="font-heading text-2xl sm:text-4xl font-black uppercase text-north-black leading-tight">
                {selectedAsset.title}
              </h2>

              <p className="text-north-gray text-xs sm:text-sm font-body">
                Created by <strong>SM SAAD</strong> • Free for Personal & Commercial Use
              </p>
            </div>

            {/* TAB SELECTOR TOOLBAR */}
            <div className="flex items-center border-b border-north-black bg-white px-6 pt-3 space-x-2">
              <button
                onClick={() => setActiveDetailTab('overview')}
                className={`font-heading font-bold text-xs uppercase px-4 py-2 border border-north-black transition-colors ${
                  activeDetailTab === 'overview' ? 'bg-north-black text-north-lime shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-north-bg text-north-black hover:bg-white'
                }`}
              >
                Overview & Media
              </button>
              <button
                onClick={() => setActiveDetailTab('specs')}
                className={`font-heading font-bold text-xs uppercase px-4 py-2 border border-north-black transition-colors ${
                  activeDetailTab === 'specs' ? 'bg-north-black text-north-lime shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-north-bg text-north-black hover:bg-white'
                }`}
              >
                Technical Specs
              </button>
              <button
                onClick={() => setActiveDetailTab('features')}
                className={`font-heading font-bold text-xs uppercase px-4 py-2 border border-north-black transition-colors ${
                  activeDetailTab === 'features' ? 'bg-north-black text-north-lime shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-north-bg text-north-black hover:bg-white'
                }`}
              >
                Included Files
              </button>
            </div>

            {/* MODAL CONTENT BODY */}
            <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[65vh] bg-white">
              
              {activeDetailTab === 'overview' && (
                <div className="space-y-6">
                  {/* Media Cover Image Preview */}
                  <div className="relative aspect-[16/9] border-2 border-north-black overflow-hidden bg-north-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <img src={selectedAsset.image} alt={selectedAsset.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 bg-north-lime text-north-black font-heading font-extrabold text-xs uppercase px-3 py-1 border border-north-black">
                      4K PRORES / HIGH QUALITY
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-heading font-extrabold text-lg uppercase text-north-black">Asset Overview & Description</h4>
                    <p className="text-north-gray font-body text-sm sm:text-base leading-relaxed">
                      {selectedAsset.description}
                    </p>
                  </div>
                </div>
              )}

              {activeDetailTab === 'specs' && (
                <div className="space-y-6">
                  {/* REDESIGNED TECHNICAL SPECIFICATIONS GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="border border-north-black bg-north-bg p-5 space-y-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center space-x-2 text-north-lime-dark">
                        <FileText className="w-4 h-4" />
                        <span className="font-heading font-bold text-xs uppercase text-north-black">File Format</span>
                      </div>
                      <p className="font-mono font-bold text-base text-north-black">{selectedAsset.fileFormat}</p>
                      <p className="text-[11px] text-north-gray">High resolution media & preset files</p>
                    </div>

                    <div className="border border-north-black bg-north-bg p-5 space-y-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center space-x-2 text-north-lime-dark">
                        <HardDrive className="w-4 h-4" />
                        <span className="font-heading font-bold text-xs uppercase text-north-black">Package Size</span>
                      </div>
                      <p className="font-mono font-bold text-base text-north-black">{selectedAsset.fileSize}</p>
                      <p className="text-[11px] text-north-gray">Optimized compressed archive</p>
                    </div>

                    <div className="border border-north-black bg-north-bg p-5 space-y-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center space-x-2 text-north-lime-dark">
                        <Cpu className="w-4 h-4" />
                        <span className="font-heading font-bold text-xs uppercase text-north-black">Software Compatibility</span>
                      </div>
                      <p className="font-heading font-bold text-sm text-north-black">{selectedAsset.compatibility}</p>
                      <p className="text-[11px] text-north-gray">Drag & drop compatible</p>
                    </div>

                    <div className="border border-north-black bg-north-bg p-5 space-y-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center space-x-2 text-north-lime-dark">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="font-heading font-bold text-xs uppercase text-north-black">License & Usage</span>
                      </div>
                      <p className="font-heading font-bold text-sm text-emerald-700">{selectedAsset.license}</p>
                      <p className="text-[11px] text-north-gray">No attribution required for client work</p>
                    </div>

                  </div>
                </div>
              )}

              {activeDetailTab === 'features' && (
                <div className="space-y-4 border border-north-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h4 className="font-heading font-extrabold text-base uppercase text-north-black border-b border-north-dark-sand pb-2">
                    What's Included in this Asset Pack
                  </h4>
                  <div className="space-y-3 font-body text-xs sm:text-sm text-north-black">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-north-lime-dark shrink-0 mt-0.5" />
                      <span><strong>Full High-Resolution Source Files</strong>: {selectedAsset.fileFormat} format ready for editing timelines.</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-north-lime-dark shrink-0 mt-0.5" />
                      <span><strong>Universal NLE Support</strong>: Compatible with Premiere Pro, After Effects, DaVinci Resolve, and Final Cut Pro.</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-north-lime-dark shrink-0 mt-0.5" />
                      <span><strong>Commercial License Included</strong>: 100% royalty-free for personal projects, YouTube videos, and client deliverables.</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-north-lime-dark shrink-0 mt-0.5" />
                      <span><strong>Instant One-Click Download</strong>: No email registration or paywall required.</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* REDESIGNED DOWNLOAD ACTION BAR FOOTER */}
            <div className="border-t-2 border-north-black bg-north-black text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-north-lime rounded-full inline-block animate-pulse"></span>
                  <span className="font-heading font-extrabold text-xs uppercase text-north-lime">
                    FREE INSTANT DOWNLOAD PACKAGE
                  </span>
                </div>
                <p className="text-xs text-neutral-300">
                  Total Downloads: <strong>{selectedAsset.downloadCount.toLocaleString()}</strong> • Size: <strong>{selectedAsset.fileSize}</strong>
                </p>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={() => handleShareAsset(selectedAsset)}
                  className="p-3 border border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-heading font-bold uppercase inline-flex items-center gap-1.5"
                  title="Share Asset"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>

                <button
                  onClick={() => handleDownload(selectedAsset)}
                  disabled={downloadingId === selectedAsset.id}
                  className="btn-north bg-north-lime text-north-black hover:bg-white text-xs font-heading font-black uppercase py-3.5 px-6 w-full sm:w-auto inline-flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(200,255,0,1)]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>{downloadingId === selectedAsset.id ? 'Preparing Package...' : 'Free Download Now'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
