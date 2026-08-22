import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Eye, EyeOff, Search, RefreshCw, FileText, CheckCircle, Clock,
  ArrowLeft, ArrowUpRight, LayoutGrid, List, Sparkles, Image as ImageIcon, Package, Download, FolderPlus, Tag,
  Bold, Italic, Heading1, Heading2, Heading3, ListOrdered, Quote, Code, Check, X, BookOpen, Send, ShieldCheck,
  Split, HelpCircle, AlertCircle, CheckSquare, Layers, Sparkle, PlusCircle, Maximize2
} from 'lucide-react';
import {
  getStoredBlogPosts,
  saveStoredBlogPost,
  deleteStoredBlogPost,
  resetStoredBlogPosts,
  syncBlogPostsFromSupabase,
  ExtendedBlogPost
} from '../utils/blogStorage';
import {
  getStoredDigitalAssets,
  saveStoredDigitalAsset,
  deleteStoredDigitalAsset,
  resetStoredDigitalAssets,
  syncAssetsFromSupabase,
  DigitalAsset
} from '../utils/assetStorage';
import { SEO } from '../components/SEO';
import { AdminAuthGuard } from '../components/AdminAuthGuard';

export const AdminDashboard: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'blogs' | 'assets'>('blogs');

  // BLOG STATES
  const [posts, setPosts] = useState<ExtendedBlogPost[]>([]);
  const [blogSearch, setBlogSearch] = useState('');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('All');
  const [blogStatusFilter, setBlogStatusFilter] = useState('All');
  const [isBlogEditorOpen, setIsBlogEditorOpen] = useState(false);
  const [blogActiveTab, setBlogActiveTab] = useState<'write' | 'split' | 'preview'>('split');
  const [currentPost, setCurrentPost] = useState<Partial<ExtendedBlogPost>>({});
  const [deleteBlogConfirmId, setDeleteBlogConfirmId] = useState<string | null>(null);

  // ASSETS STATES
  const [assets, setAssets] = useState<DigitalAsset[]>([]);
  const [assetSearch, setAssetSearch] = useState('');
  const [assetCategoryFilter, setAssetCategoryFilter] = useState('All');
  const [isAssetEditorOpen, setIsAssetEditorOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Partial<DigitalAsset>>({});
  const [deleteAssetConfirmId, setDeleteAssetConfirmId] = useState<string | null>(null);

  // Toast Notification State
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Load instantly from localStorage
    setPosts(getStoredBlogPosts());
    setAssets(getStoredDigitalAssets());

    // Then sync from Supabase and refresh if newer data exists
    syncBlogPostsFromSupabase().then((remote) => {
      if (remote) setPosts(remote);
    });
    syncAssetsFromSupabase().then((remote) => {
      if (remote) setAssets(remote);
    });
  }, []);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Preset images
  const presetImages = [
    '/assets/images/works1.jpg',
    '/assets/images/works2.jpg',
    '/assets/images/works3.jpg',
    '/assets/images/works4.jpg',
    '/assets/images/why.jpg',
    '/assets/images/about.jpg',
    '/assets/images/hero.jpg'
  ];

  // ----------------------------------------------------
  // BLOG HANDLERS
  // ----------------------------------------------------
  const handleCreateNewBlog = () => {
    setCurrentPost({
      id: Date.now().toString(),
      title: '',
      category: 'Video Editing',
      excerpt: '',
      content: `## Executive Overview

Write your article introduction here explaining key concepts, goals, and visual techniques...

## Key Principles & Best Practices

1. **Narrative Pacing**: Structure raw media into a cohesive story arc.
2. **Visual Compositing**: Blend layers, green screen keying, and motion graphics.
3. **Sound Architecture**: Layer Foley effects, impact risers, and ambient audio.

> "Seamless editing guides viewer focus naturally without drawing unnecessary attention to individual cuts."

## Step-by-Step Production Workflow

- **Pre-Production**: Organize timeline bins, markers, and proxy files.
- **Assembly & Fine Cut**: Precision trimming, ripple edits, and motion pacing.
- **Color & Audio Finishing**: Rec.709 color grading, loudness normalization, and export.

---
*Written by SM SAAD on smsaad.online.*
`,
      readTime: '5 min read',
      date: new Date().getFullYear().toString(),
      image: '/assets/images/works1.jpg',
      author: 'SM SAAD',
      status: 'published',
    });
    setBlogActiveTab('split');
    setIsBlogEditorOpen(true);
  };

  const handleEditBlog = (post: ExtendedBlogPost) => {
    setCurrentPost({ ...post });
    setBlogActiveTab('split');
    setIsBlogEditorOpen(true);
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost.title || !currentPost.excerpt) {
      alert('Please provide a title and excerpt.');
      return;
    }

    const postToSave: ExtendedBlogPost = {
      id: currentPost.id || Date.now().toString(),
      title: currentPost.title || 'Untitled Article',
      category: currentPost.category || 'Video Editing',
      excerpt: currentPost.excerpt || '',
      content: currentPost.content || '',
      date: currentPost.date || new Date().getFullYear().toString(),
      readTime: currentPost.readTime || '5 min read',
      image: currentPost.image || '/assets/images/works1.jpg',
      author: currentPost.author || 'SM SAAD',
      status: currentPost.status || 'published',
    };

    const updated = saveStoredBlogPost(postToSave);
    setPosts(updated);
    setIsBlogEditorOpen(false);
    showNotify(`Article "${postToSave.title}" ${postToSave.status === 'published' ? 'Published' : 'Saved as Draft'}!`);
  };

  const handleToggleBlogStatus = (post: ExtendedBlogPost) => {
    const newStatus: 'published' | 'draft' = post.status === 'published' ? 'draft' : 'published';
    const updatedPost: ExtendedBlogPost = { ...post, status: newStatus };
    const updated = saveStoredBlogPost(updatedPost);
    setPosts(updated);
    showNotify(`Article "${post.title}" status updated to ${newStatus.toUpperCase()}`);
  };

  const handleDeleteBlog = async (id: string) => {
    const updated = await deleteStoredBlogPost(id);
    setPosts(updated);
    setDeleteBlogConfirmId(null);
    showNotify('Article deleted from Supabase.');
  };

  const handleResetBlogs = () => {
    if (window.confirm('Reset all blog posts to default demo articles?')) {
      const reset = resetStoredBlogPosts();
      setPosts(reset);
      showNotify('Blog posts reset to default.');
    }
  };

  // Helper for Markdown Text Toolbar Customization
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('blog-content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || 'Sample Text';

    const replacement = `${prefix}${selected}${suffix}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    
    setCurrentPost({ ...currentPost, content: newContent });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  // Append Custom Section Block to Article Content
  const appendSectionBlock = (blockType: string) => {
    let blockText = '';
    if (blockType === 'intro') {
      blockText = `\n\n## Overview & Context\n\nWrite section introduction describing context, goals, and tools...\n`;
    } else if (blockType === 'takeaways') {
      blockText = `\n\n## Key Takeaways\n\n1. **Core Insight**: Primary technique summary.\n2. **Execution**: How to apply in your workflow.\n3. **Quality Finish**: Polishing details for maximum impact.\n`;
    } else if (blockType === 'quote') {
      blockText = `\n\n> "Add an inspiring quote or key editorial takeaway callout here."\n`;
    } else if (blockType === 'workflow') {
      blockText = `\n\n## Step-by-Step Workflow\n\n- **Step 1**: Pre-production setup.\n- **Step 2**: Primary editing & compositing.\n- **Step 3**: Final export & sound design.\n`;
    } else if (blockType === 'code') {
      blockText = `\n\n\`\`\`javascript\n// Custom Code Snippet\nconst project = "Visual Compositing";\nconsole.log(\`Building \${project}\`);\n\`\`\`\n`;
    }

    setCurrentPost({
      ...currentPost,
      content: (currentPost.content || '') + blockText
    });
    showNotify(`Added ${blockType.toUpperCase()} Section Block!`);
  };

  // ----------------------------------------------------
  // DIGITAL ASSET HANDLERS
  // ----------------------------------------------------
  const handleCreateNewAsset = () => {
    setCurrentAsset({
      id: `asset-${Date.now()}`,
      title: '',
      category: 'VFX & Overlays',
      description: '',
      fileFormat: '.zip',
      fileSize: '150 MB',
      compatibility: 'Premiere Pro, After Effects, DaVinci Resolve',
      license: 'Free for Personal & Commercial Use',
      image: '/assets/images/works2.jpg',
      downloadUrl: '#',
      downloadCount: 0,
      isFree: true,
    });
    setIsAssetEditorOpen(true);
  };

  const handleEditAsset = (asset: DigitalAsset) => {
    setCurrentAsset({ ...asset });
    setIsAssetEditorOpen(true);
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAsset.title || !currentAsset.description) {
      alert('Please provide an asset title and description.');
      return;
    }

    const assetToSave: DigitalAsset = {
      id: currentAsset.id || `asset-${Date.now()}`,
      title: currentAsset.title || 'Untitled Asset',
      category: currentAsset.category || 'VFX & Overlays',
      description: currentAsset.description || '',
      fileFormat: currentAsset.fileFormat || '.zip',
      fileSize: currentAsset.fileSize || '100 MB',
      compatibility: currentAsset.compatibility || 'Premiere Pro, After Effects',
      license: currentAsset.license || 'Free Use',
      image: currentAsset.image || '/assets/images/works2.jpg',
      downloadUrl: currentAsset.downloadUrl || '#',
      downloadCount: currentAsset.downloadCount || 0,
      isFree: currentAsset.isFree !== undefined ? currentAsset.isFree : true,
    };

    const updated = saveStoredDigitalAsset(assetToSave);
    setAssets(updated);
    setIsAssetEditorOpen(false);
    showNotify(`Digital Asset "${assetToSave.title}" saved!`);
  };

  const handleDeleteAsset = async (id: string) => {
    const updated = await deleteStoredDigitalAsset(id);
    setAssets(updated);
    setDeleteAssetConfirmId(null);
    showNotify('Digital asset deleted from Supabase.');
  };

  const handleResetAssets = () => {
    if (window.confirm('Reset all store assets to default items?')) {
      const reset = resetStoredDigitalAssets();
      setAssets(reset);
      showNotify('Digital assets reset to default.');
    }
  };

  // Filtered Data
  const blogCategories = ['All', 'Video Editing', 'VFX & Compositing', 'Workflow', 'Web & AI', 'AI Technology', 'Post Production'];
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(blogSearch.toLowerCase()) || p.excerpt.toLowerCase().includes(blogSearch.toLowerCase());
      const matchCat = blogCategoryFilter === 'All' || p.category === blogCategoryFilter;
      const matchStatus = blogStatusFilter === 'All' || p.status === blogStatusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [posts, blogSearch, blogCategoryFilter, blogStatusFilter]);

  const assetCategories = ['All', 'VFX & Overlays', 'Presets & Project Files', 'Sound FX & Audio', 'Web Templates', 'Motion Graphics'];
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchSearch = a.title.toLowerCase().includes(assetSearch.toLowerCase()) || a.description.toLowerCase().includes(assetSearch.toLowerCase());
      const matchCat = assetCategoryFilter === 'All' || a.category === assetCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [assets, assetSearch, assetCategoryFilter]);

  // Dashboard Stats
  const publishedBlogCount = posts.filter((p) => p.status === 'published').length;
  const draftBlogCount = posts.filter((p) => p.status === 'draft').length;
  const totalDownloads = assets.reduce((sum, a) => sum + (a.downloadCount || 0), 0);

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-north-bg text-north-black pb-24">
        <SEO title="Admin Creator Studio & Article Customizer — SM SAAD" description="Manage blog articles, custom section editor, text formatting, and store assets." />

        {/* TOAST NOTIFICATION */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-north-black text-north-lime font-heading font-bold text-xs uppercase px-5 py-3 border border-north-black shadow-[4px_4px_0px_0px_rgba(200,255,0,1)] flex items-center space-x-2 animate-bounce">
            <CheckCircle className="w-4 h-4 text-north-lime" />
            <span>{notification}</span>
          </div>
        )}

        {/* ADMIN HEADER */}
        <section className="border-b border-north-black bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-north-dark-sand pb-4">
              <div className="flex items-center space-x-3">
                <Link to="/" className="p-2 border border-north-black bg-north-bg hover:bg-north-black hover:text-north-lime transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-north-lime text-north-black font-heading font-extrabold text-[10px] uppercase px-2 py-0.5 border border-north-black">
                      CREATOR STUDIO
                    </span>
                    <span className="text-xs font-heading font-bold uppercase text-north-gray">Article Customizer & Manager</span>
                  </div>
                  <h1 className="font-heading text-3xl sm:text-4xl font-black uppercase text-north-black leading-none mt-1">
                    Blog Studio & Customizer
                  </h1>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCreateNewBlog}
                  className="btn-north bg-north-lime text-north-black hover:bg-north-black hover:text-north-lime text-xs font-heading font-extrabold uppercase py-2.5 px-4 inline-flex items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  <span>Create Custom Article</span>
                </button>

                <button
                  onClick={handleCreateNewAsset}
                  className="btn-north bg-north-black text-white hover:bg-north-lime hover:text-black text-xs font-heading font-bold uppercase py-2.5 px-4 inline-flex items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <FolderPlus className="w-4 h-4 mr-1.5" />
                  <span>Upload Asset</span>
                </button>
              </div>
            </div>

            {/* DASHBOARD STATS METRICS BAR */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-north-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between text-xs font-heading font-bold uppercase text-north-gray">
                  <span>Published Articles</span>
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <p className="font-heading font-black text-2xl text-north-black mt-2">{publishedBlogCount}</p>
              </div>

              <div className="bg-white border border-north-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between text-xs font-heading font-bold uppercase text-north-gray">
                  <span>Draft Articles</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <p className="font-heading font-black text-2xl text-north-black mt-2">{draftBlogCount}</p>
              </div>

              <div className="bg-white border border-north-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between text-xs font-heading font-bold uppercase text-north-gray">
                  <span>Store Assets</span>
                  <Package className="w-4 h-4 text-north-lime-dark" />
                </div>
                <p className="font-heading font-black text-2xl text-north-black mt-2">{assets.length}</p>
              </div>

              <div className="bg-white border border-north-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between text-xs font-heading font-bold uppercase text-north-gray">
                  <span>Total Downloads</span>
                  <Download className="w-4 h-4 text-north-lime-dark" />
                </div>
                <p className="font-heading font-black text-2xl text-north-black mt-2">{totalDownloads.toLocaleString()}</p>
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setActiveMainTab('blogs')}
                className={`font-heading font-extrabold text-xs uppercase px-5 py-2.5 border border-north-black transition-all flex items-center space-x-2 ${
                  activeMainTab === 'blogs'
                    ? 'bg-north-black text-north-lime shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-north-black hover:bg-north-bg'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Articles Customizer & Studio ({posts.length})</span>
              </button>

              <button
                onClick={() => setActiveMainTab('assets')}
                className={`font-heading font-extrabold text-xs uppercase px-5 py-2.5 border border-north-black transition-all flex items-center space-x-2 ${
                  activeMainTab === 'assets'
                    ? 'bg-north-black text-north-lime shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-north-black hover:bg-north-bg'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Digital Asset Store ({assets.length})</span>
              </button>
            </div>
          </div>
        </section>

        {/* TAB 1: BLOG ARTICLES MANAGER */}
        {activeMainTab === 'blogs' && (
          <div className="space-y-6">
            {/* SEARCH & FILTER CONTROLS */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8">
              <div className="border border-north-black bg-white p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-north-gray" />
                  <input
                    type="text"
                    placeholder="Search articles by title, excerpt, or category..."
                    value={blogSearch}
                    onChange={(e) => setBlogSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-north-bg border border-north-black text-north-black text-xs font-body focus:outline-none focus:ring-2 focus:ring-north-lime"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={blogCategoryFilter}
                    onChange={(e) => setBlogCategoryFilter(e.target.value)}
                    className="px-3 py-2.5 bg-north-bg border border-north-black text-xs font-heading font-bold uppercase cursor-pointer"
                  >
                    {blogCategories.map((c) => (
                      <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                    ))}
                  </select>

                  <select
                    value={blogStatusFilter}
                    onChange={(e) => setBlogStatusFilter(e.target.value)}
                    className="px-3 py-2.5 bg-north-bg border border-north-black text-xs font-heading font-bold uppercase cursor-pointer"
                  >
                    <option value="All">All Status</option>
                    <option value="published">Published Only</option>
                    <option value="draft">Drafts Only</option>
                  </select>

                  <button
                    onClick={handleResetBlogs}
                    className="p-2.5 border border-north-black bg-white text-north-black text-xs font-heading font-bold uppercase inline-flex items-center hover:bg-north-bg"
                    title="Reset Demo Articles"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* ARTICLES TABLE */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
              <div className="border border-north-black bg-white overflow-x-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-north-black bg-north-black text-white text-xs font-heading uppercase">
                      <th className="p-4">Cover</th>
                      <th className="p-4">Article Title & Summary</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Publishing Status</th>
                      <th className="p-4">Est. Read Time</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-north-dark-sand text-xs font-body">
                    {filteredPosts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-north-gray font-heading font-bold uppercase">
                          No articles found. Click "Create Custom Article" to write one!
                        </td>
                      </tr>
                    ) : (
                      filteredPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-north-bg/60 transition-colors">
                          <td className="p-4 w-24">
                            <div className="w-16 h-12 border border-north-black overflow-hidden bg-north-bg">
                              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="p-4 max-w-sm">
                            <h4 className="font-heading font-bold text-sm uppercase text-north-black line-clamp-1">{post.title}</h4>
                            <p className="text-north-gray text-[11px] line-clamp-1 mt-0.5">{post.excerpt}</p>
                          </td>
                          <td className="p-4">
                            <span className="bg-north-bg px-2.5 py-1 font-heading font-bold text-[10px] uppercase border border-north-black">
                              {post.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 font-heading font-bold text-[10px] uppercase border ${
                                post.status === 'published'
                                  ? 'bg-north-lime text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                  : 'bg-amber-200 text-amber-900 border-amber-500'
                              }`}
                            >
                              {post.status}
                            </span>
                          </td>
                          <td className="p-4 text-north-gray font-heading text-xs font-bold">{post.readTime}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                to={`/blogs/${post.id}`}
                                className="p-2 border border-north-black bg-white hover:bg-north-lime transition-colors"
                                title="View Article Page"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => handleToggleBlogStatus(post)}
                                className="p-2 border border-north-black bg-white hover:bg-north-lime transition-colors"
                                title={post.status === 'published' ? 'Switch to Draft' : 'Publish Article'}
                              >
                                {post.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => handleEditBlog(post)}
                                className="p-2 border border-north-black bg-north-black text-white hover:bg-north-lime hover:text-black transition-colors flex items-center space-x-1"
                                title="Edit & Customize Article"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-heading font-bold uppercase">Edit</span>
                              </button>
                              <button
                                onClick={() => setDeleteBlogConfirmId(post.id)}
                                className="p-2 border border-north-black bg-red-100 text-red-700 hover:bg-red-600 hover:text-white transition-colors"
                                title="Delete Article"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {deleteBlogConfirmId === post.id && (
                              <div className="mt-2 flex items-center justify-end space-x-2 bg-red-50 p-2 border border-red-400">
                                <span className="text-[10px] font-bold text-red-700 uppercase">Confirm Delete?</span>
                                <button
                                  onClick={() => handleDeleteBlog(post.id)}
                                  className="bg-red-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setDeleteBlogConfirmId(null)}
                                  className="bg-gray-200 text-black px-2 py-0.5 text-[10px] font-bold uppercase"
                                >
                                  No
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: DIGITAL ASSETS STORE MANAGER */}
        {activeMainTab === 'assets' && (
          <div className="space-y-6">
            <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8">
              <div className="border border-north-black bg-white p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-north-gray" />
                  <input
                    type="text"
                    placeholder="Search digital assets by title or description..."
                    value={assetSearch}
                    onChange={(e) => setAssetSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-north-bg border border-north-black text-north-black text-xs focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={assetCategoryFilter}
                    onChange={(e) => setAssetCategoryFilter(e.target.value)}
                    className="px-3 py-2.5 bg-north-bg border border-north-black text-xs font-heading font-bold uppercase cursor-pointer"
                  >
                    {assetCategories.map((c) => (
                      <option key={c} value={c}>{c === 'All' ? 'All Asset Categories' : c}</option>
                    ))}
                  </select>

                  <button
                    onClick={handleResetAssets}
                    className="p-2.5 border border-north-black bg-white text-north-black text-xs font-heading font-bold uppercase inline-flex items-center hover:bg-north-bg"
                    title="Reset Store Assets"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* DIGITAL ASSETS TABLE */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
              <div className="border border-north-black bg-white overflow-x-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-north-black bg-north-black text-white text-xs font-heading uppercase">
                      <th className="p-4">Cover</th>
                      <th className="p-4">Asset Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Format</th>
                      <th className="p-4">Size</th>
                      <th className="p-4">Downloads</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-north-dark-sand text-xs font-body">
                    {filteredAssets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-north-bg/60">
                        <td className="p-4 w-24">
                          <img src={asset.image} alt={asset.title} className="w-16 h-10 object-cover border border-north-black" />
                        </td>
                        <td className="p-4 max-w-xs">
                          <h4 className="font-heading font-bold text-sm uppercase">{asset.title}</h4>
                          <p className="text-north-gray text-[11px] line-clamp-1">{asset.description}</p>
                        </td>
                        <td className="p-4">
                          <span className="bg-north-lime text-black px-2.5 py-1 font-heading font-bold text-[10px] uppercase border border-north-black">
                            {asset.category}
                          </span>
                        </td>
                        <td className="p-4 font-mono">{asset.fileFormat}</td>
                        <td className="p-4 font-mono">{asset.fileSize}</td>
                        <td className="p-4 font-bold text-north-black">
                          <span className="inline-flex items-center">
                            <Download className="w-3 h-3 mr-1 text-north-lime-dark" />
                            {asset.downloadCount.toLocaleString()}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link to="/assets" className="p-2 border border-north-black bg-white hover:bg-north-lime" title="Preview in Store">
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                            <button onClick={() => handleEditAsset(asset)} className="p-2 border border-north-black bg-north-black text-white hover:bg-north-lime hover:text-black">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteAsset(asset.id)} className="p-2 border border-north-black bg-red-100 text-red-700 hover:bg-red-600 hover:text-white">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* FULL ARTICLE WRITER & SECTION CUSTOMIZER STUDIO MODAL */}
        {isBlogEditorOpen && (
          <div className="fixed inset-0 z-50 bg-north-black/85 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-sm">
            <div className="border-2 border-north-black bg-white w-full max-w-6xl max-h-[94vh] flex flex-col shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
              
              {/* MODAL HEADER WITH MODE SWITCHER */}
              <div className="border-b border-north-black p-4 sm:p-5 bg-north-bg flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center space-x-3">
                  <span className="bg-north-lime text-north-black font-heading font-extrabold text-xs uppercase px-3 py-1 border border-north-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {currentPost.id ? 'ARTICLE CUSTOMIZER' : 'NEW ARTICLE'}
                  </span>
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl uppercase text-north-black">
                    Blog Writing & Section Studio
                  </h3>
                </div>

                {/* View Mode Controls (Write / Split Screen / Live Preview) */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-north-black bg-white p-0.5">
                    <button
                      onClick={() => setBlogActiveTab('write')}
                      className={`px-3 py-1.5 font-heading font-bold text-xs uppercase transition-colors flex items-center gap-1 ${
                        blogActiveTab === 'write' ? 'bg-north-black text-north-lime' : 'text-north-black hover:bg-north-bg'
                      }`}
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Write</span>
                    </button>

                    <button
                      onClick={() => setBlogActiveTab('split')}
                      className={`px-3 py-1.5 font-heading font-bold text-xs uppercase transition-colors flex items-center gap-1 ${
                        blogActiveTab === 'split' ? 'bg-north-black text-north-lime' : 'text-north-black hover:bg-north-bg'
                      }`}
                    >
                      <Split className="w-3.5 h-3.5" />
                      <span>Split View</span>
                    </button>

                    <button
                      onClick={() => setBlogActiveTab('preview')}
                      className={`px-3 py-1.5 font-heading font-bold text-xs uppercase transition-colors flex items-center gap-1 ${
                        blogActiveTab === 'preview' ? 'bg-north-black text-north-lime' : 'text-north-black hover:bg-north-bg'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Preview</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setIsBlogEditorOpen(false)}
                    className="p-1.5 border border-north-black bg-white hover:bg-north-black hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* MAIN STUDIO FORM */}
              <form onSubmit={handleSaveBlog} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-white">
                
                {/* ARTICLE METADATA FORM ROW */}
                <div className="bg-north-bg p-4 sm:p-5 border border-north-black space-y-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <span className="font-heading font-bold text-xs uppercase text-north-lime-dark block">
                    ARTICLE METADATA & PUBLISHING SETTINGS
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Title */}
                    <div className="md:col-span-8 space-y-1">
                      <label className="font-heading font-bold text-xs uppercase text-north-black">Article Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 5 Video Editing Workflows Every Creator Needs..."
                        value={currentPost.title || ''}
                        onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                        className="w-full p-2.5 bg-white border border-north-black text-sm font-heading font-bold text-north-black focus:outline-none focus:ring-2 focus:ring-north-lime"
                      />
                    </div>

                    {/* Category */}
                    <div className="md:col-span-4 space-y-1">
                      <label className="font-heading font-bold text-xs uppercase text-north-black">Category *</label>
                      <select
                        value={currentPost.category || 'Video Editing'}
                        onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                        className="w-full p-2.5 bg-white border border-north-black text-xs font-heading font-bold uppercase cursor-pointer"
                      >
                        {blogCategories.filter((c) => c !== 'All').map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Read Time */}
                    <div className="md:col-span-4 space-y-1">
                      <label className="font-heading font-bold text-xs uppercase text-north-black">Est. Read Time *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 5 min read"
                        value={currentPost.readTime || '5 min read'}
                        onChange={(e) => setCurrentPost({ ...currentPost, readTime: e.target.value })}
                        className="w-full p-2.5 bg-white border border-north-black text-xs font-body"
                      />
                    </div>

                    {/* Status */}
                    <div className="md:col-span-4 space-y-1">
                      <label className="font-heading font-bold text-xs uppercase text-north-black">Publish Status *</label>
                      <select
                        value={currentPost.status || 'published'}
                        onChange={(e) => setCurrentPost({ ...currentPost, status: e.target.value as any })}
                        className="w-full p-2.5 bg-white border border-north-black text-xs font-heading font-bold uppercase cursor-pointer"
                      >
                        <option value="published">● Published (Live on Site)</option>
                        <option value="draft">○ Draft (Saved / Hidden)</option>
                      </select>
                    </div>

                    {/* Author */}
                    <div className="md:col-span-4 space-y-1">
                      <label className="font-heading font-bold text-xs uppercase text-north-black">Author</label>
                      <input
                        type="text"
                        value={currentPost.author || 'SM SAAD'}
                        onChange={(e) => setCurrentPost({ ...currentPost, author: e.target.value })}
                        className="w-full p-2.5 bg-white border border-north-black text-xs font-body"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-1">
                    <label className="font-heading font-bold text-xs uppercase text-north-black">Summary Excerpt *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Write a 2-line article summary preview..."
                      value={currentPost.excerpt || ''}
                      onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                      className="w-full p-2.5 bg-white border border-north-black text-xs font-body focus:outline-none focus:ring-2 focus:ring-north-lime"
                    ></textarea>
                  </div>

                  {/* Preset Image Picker */}
                  <div className="space-y-2 pt-2 border-t border-north-dark-sand">
                    <label className="font-heading font-bold text-xs uppercase text-north-black block">Cover Image URL *</label>
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                      <input
                        type="text"
                        required
                        value={currentPost.image || ''}
                        onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.value })}
                        className="flex-1 p-2 bg-white border border-north-black text-xs font-mono"
                      />
                      {currentPost.image && (
                        <div className="w-14 h-10 border border-north-black overflow-hidden bg-white shrink-0">
                          <img src={currentPost.image} alt="Cover Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="text-[10px] font-heading font-bold uppercase text-north-gray self-center mr-1">Presets:</span>
                      {presetImages.map((imgUrl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCurrentPost({ ...currentPost, image: imgUrl })}
                          className={`w-10 h-7 border overflow-hidden ${
                            currentPost.image === imgUrl ? 'border-2 border-north-black ring-2 ring-north-lime' : 'border-gray-400 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={imgUrl} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* TEXT CUSTOMIZATION TOOLBAR & SECTION BUILDER BAR */}
                <div className="space-y-4">
                  
                  {/* TEXT CUSTOMIZING TOOLBAR */}
                  <div className="border border-north-black bg-north-black text-white p-3 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-heading font-bold text-xs uppercase text-north-lime flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Text Formatting Toolbar
                      </span>

                      {/* Text Formatting Quick Action Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => insertMarkdown('# ', '')}
                          className="bg-neutral-800 hover:bg-north-lime hover:text-black text-white text-[11px] font-bold px-2 py-1 border border-neutral-700 transition-colors"
                          title="Main Heading (H1)"
                        >
                          # H1
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('## ', '')}
                          className="bg-neutral-800 hover:bg-north-lime hover:text-black text-white text-[11px] font-bold px-2 py-1 border border-neutral-700 transition-colors"
                          title="Section Heading (H2)"
                        >
                          ## H2
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('### ', '')}
                          className="bg-neutral-800 hover:bg-north-lime hover:text-black text-white text-[11px] font-bold px-2 py-1 border border-neutral-700 transition-colors"
                          title="Sub Heading (H3)"
                        >
                          ### H3
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('**', '**')}
                          className="bg-neutral-800 hover:bg-north-lime hover:text-black text-white text-[11px] font-bold px-2 py-1 border border-neutral-700 transition-colors"
                          title="Bold Text (**text**)"
                        >
                          B Bold
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('*', '*')}
                          className="bg-neutral-800 hover:bg-north-lime hover:text-black text-white text-[11px] font-bold px-2 py-1 border border-neutral-700 transition-colors"
                          title="Italic Text (*text*)"
                        >
                          I Italic
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('> ')}
                          className="bg-neutral-800 hover:bg-north-lime hover:text-black text-white text-[11px] font-bold px-2 py-1 border border-neutral-700 transition-colors"
                          title="Blockquote Callout (> quote)"
                        >
                          " Quote
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('1. ')}
                          className="bg-neutral-800 hover:bg-north-lime hover:text-black text-white text-[11px] font-bold px-2 py-1 border border-neutral-700 transition-colors"
                          title="Numbered List"
                        >
                          1. List
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('- ')}
                          className="bg-neutral-800 hover:bg-north-lime hover:text-black text-white text-[11px] font-bold px-2 py-1 border border-neutral-700 transition-colors"
                          title="Bullet Item"
                        >
                          • Bullet
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('---')}
                          className="bg-neutral-800 hover:bg-north-lime hover:text-black text-white text-[11px] font-bold px-2 py-1 border border-neutral-700 transition-colors"
                          title="Divider Line"
                        >
                          --- Divider
                        </button>
                      </div>
                    </div>

                    {/* SECTION BLOCK BUILDER BUTTONS */}
                    <div className="pt-2 border-t border-neutral-800 flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-heading font-bold uppercase text-gray-400">Add Section Block:</span>
                      <button
                        type="button"
                        onClick={() => appendSectionBlock('intro')}
                        className="bg-north-lime text-black font-heading font-extrabold text-[10px] uppercase px-2.5 py-1 border border-black hover:bg-white transition-colors"
                      >
                        + Intro Section
                      </button>
                      <button
                        type="button"
                        onClick={() => appendSectionBlock('takeaways')}
                        className="bg-north-lime text-black font-heading font-extrabold text-[10px] uppercase px-2.5 py-1 border border-black hover:bg-white transition-colors"
                      >
                        + Key Takeaways
                      </button>
                      <button
                        type="button"
                        onClick={() => appendSectionBlock('workflow')}
                        className="bg-north-lime text-black font-heading font-extrabold text-[10px] uppercase px-2.5 py-1 border border-black hover:bg-white transition-colors"
                      >
                        + Workflow Block
                      </button>
                      <button
                        type="button"
                        onClick={() => appendSectionBlock('quote')}
                        className="bg-north-lime text-black font-heading font-extrabold text-[10px] uppercase px-2.5 py-1 border border-black hover:bg-white transition-colors"
                      >
                        + Quote Callout
                      </button>
                      <button
                        type="button"
                        onClick={() => appendSectionBlock('code')}
                        className="bg-north-lime text-black font-heading font-extrabold text-[10px] uppercase px-2.5 py-1 border border-black hover:bg-white transition-colors"
                      >
                        + Code Snippet
                      </button>
                    </div>
                  </div>

                  {/* VIEW MODE CONTENT AREA */}
                  {blogActiveTab === 'write' && (
                    <div className="space-y-1">
                      <textarea
                        id="blog-content-editor"
                        rows={14}
                        required
                        placeholder="Write your article here using the text formatting buttons or markdown syntax..."
                        value={currentPost.content || ''}
                        onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                        className="w-full p-4 bg-north-bg border-2 border-north-black text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-north-lime"
                      ></textarea>
                    </div>
                  )}

                  {blogActiveTab === 'split' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Left: Editor */}
                      <div className="space-y-1">
                        <span className="font-heading font-bold text-xs uppercase text-north-black block mb-1">
                          Markdown Editor
                        </span>
                        <textarea
                          id="blog-content-editor"
                          rows={14}
                          required
                          value={currentPost.content || ''}
                          onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                          className="w-full p-3 bg-north-bg border-2 border-north-black text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-north-lime"
                        ></textarea>
                      </div>

                      {/* Right: Instant Live Preview */}
                      <div className="space-y-1">
                        <span className="font-heading font-bold text-xs uppercase text-north-lime-dark block mb-1">
                          Instant Live Preview
                        </span>
                        <div className="p-4 border-2 border-north-black bg-white max-h-[380px] overflow-y-auto space-y-3 font-body text-xs leading-relaxed">
                          <span className="bg-north-lime text-north-black font-heading font-bold text-[10px] uppercase px-2 py-0.5 border border-north-black inline-block">
                            {currentPost.category || 'Category'}
                          </span>
                          <h2 className="font-heading font-extrabold text-lg uppercase">{currentPost.title || 'Untitled Article'}</h2>
                          <p className="text-north-gray italic border-l-2 border-north-lime pl-2 text-[11px]">"{currentPost.excerpt}"</p>
                          <div className="whitespace-pre-line border-t pt-2 font-body text-north-black">
                            {currentPost.content || currentPost.excerpt}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {blogActiveTab === 'preview' && (
                    <div className="border-2 border-north-black bg-north-bg p-6 space-y-4">
                      <div className="bg-white p-8 border border-north-black space-y-6">
                        <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase px-3 py-1 border border-north-black inline-block">
                          {currentPost.category || 'Category'}
                        </span>
                        <h1 className="font-heading text-3xl font-extrabold uppercase">{currentPost.title || 'Untitled Article'}</h1>
                        <p className="text-north-gray text-base italic border-l-4 border-north-lime pl-4">"{currentPost.excerpt}"</p>
                        {currentPost.image && (
                          <div className="aspect-[16/9] border border-north-black overflow-hidden max-h-[320px]">
                            <img src={currentPost.image} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="prose max-w-none text-sm font-body leading-relaxed whitespace-pre-line border-t border-north-dark-sand pt-4">
                          {currentPost.content || currentPost.excerpt}
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* FORM ACTIONS FOOTER */}
                <div className="pt-4 border-t-2 border-north-black flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-heading font-bold uppercase text-north-gray">
                    <ShieldCheck className="w-4 h-4 text-north-lime-dark" />
                    <span>Auto-saved locally</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsBlogEditorOpen(false)}
                      className="btn-north bg-white text-north-black border border-north-black hover:bg-north-bg text-xs py-2.5 px-4"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-north bg-north-black text-north-lime hover:bg-north-lime hover:text-north-black text-xs font-heading font-extrabold uppercase py-2.5 px-6 inline-flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      <span>{currentPost.status === 'published' ? 'Publish Article Now' : 'Save Draft'}</span>
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ASSET EDITOR MODAL */}
        {isAssetEditorOpen && (
          <div className="fixed inset-0 z-50 bg-north-black/80 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
            <div className="border-2 border-north-black bg-white w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="border-b border-north-black p-6 bg-north-bg flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-xl uppercase">
                  {currentAsset.id ? 'Edit Digital Asset' : 'New Digital Asset'}
                </h3>
                <button onClick={() => setIsAssetEditorOpen(false)} className="btn-north bg-white text-black py-1 px-3">
                  Close
                </button>
              </div>
              <form onSubmit={handleSaveAsset} className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-heading font-bold text-xs uppercase block mb-1">Asset Title *</label>
                    <input
                      type="text"
                      required
                      value={currentAsset.title || ''}
                      onChange={(e) => setCurrentAsset({ ...currentAsset, title: e.target.value })}
                      className="w-full p-3 bg-north-bg border border-north-black text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-heading font-bold text-xs uppercase block mb-1">Category *</label>
                    <select
                      value={currentAsset.category || 'VFX & Overlays'}
                      onChange={(e) => setCurrentAsset({ ...currentAsset, category: e.target.value as any })}
                      className="w-full p-3 bg-north-bg border border-north-black text-xs font-bold uppercase cursor-pointer"
                    >
                      {assetCategories.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="font-heading font-bold text-xs uppercase block mb-1">File Format *</label>
                    <input
                      type="text"
                      required
                      value={currentAsset.fileFormat || '.zip'}
                      onChange={(e) => setCurrentAsset({ ...currentAsset, fileFormat: e.target.value })}
                      className="w-full p-3 bg-north-bg border border-north-black text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-heading font-bold text-xs uppercase block mb-1">File Size *</label>
                    <input
                      type="text"
                      required
                      value={currentAsset.fileSize || '150 MB'}
                      onChange={(e) => setCurrentAsset({ ...currentAsset, fileSize: e.target.value })}
                      className="w-full p-3 bg-north-bg border border-north-black text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-heading font-bold text-xs uppercase block mb-1">Cover Image *</label>
                    <input
                      type="text"
                      required
                      value={currentAsset.image || ''}
                      onChange={(e) => setCurrentAsset({ ...currentAsset, image: e.target.value })}
                      className="w-full p-3 bg-north-bg border border-north-black text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-heading font-bold text-xs uppercase block mb-1">Asset Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={currentAsset.description || ''}
                    onChange={(e) => setCurrentAsset({ ...currentAsset, description: e.target.value })}
                    className="w-full p-3 bg-north-bg border border-north-black text-xs"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-north-black">
                  <button type="button" onClick={() => setIsAssetEditorOpen(false)} className="btn-north bg-white text-black">
                    Cancel
                  </button>
                  <button type="submit" className="btn-north bg-north-black text-north-lime">
                    Save Asset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminAuthGuard>
  );
};
