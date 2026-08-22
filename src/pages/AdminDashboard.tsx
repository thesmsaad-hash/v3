import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Eye, EyeOff, Search, RefreshCw, FileText, CheckCircle, Clock,
  ArrowLeft, ArrowUpRight, LayoutGrid, List, Sparkles, Image as ImageIcon, Package, Download, FolderPlus, Tag,
  Bold, Italic, Heading1, Heading2, Heading3, ListOrdered, Quote, Code, Check, X, BookOpen, Send, ShieldCheck,
  Split, HelpCircle, AlertCircle, CheckSquare, Layers, Sparkle, PlusCircle, Maximize2, Upload,
  Mail, Users, UserPlus, UserCheck, Copy, Radio, Key, Inbox
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
import {
  getStoredSubscribers,
  saveStoredSubscriber,
  deleteStoredSubscriber,
  syncSubscribersFromSupabase,
  BlogSubscriber
} from '../utils/subscriberStorage';
import {
  broadcastNewBlogPost,
  generateBlogEmailHTML,
  openClientBroadcastMail,
  getStoredResendKey,
  saveStoredResendKey
} from '../utils/emailBroadcaster';
import { SEO } from '../components/SEO';
import { AdminAuthGuard } from '../components/AdminAuthGuard';

export const AdminDashboard: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'blogs' | 'assets' | 'subscribers'>('blogs');

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

  // SUBSCRIBERS STATES
  const [subscribers, setSubscribers] = useState<BlogSubscriber[]>([]);
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [subscriberSourceFilter, setSubscriberSourceFilter] = useState('All');
  const [isAddSubscriberOpen, setIsAddSubscriberOpen] = useState(false);
  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubSource, setNewSubSource] = useState('Manual Admin');
  const [deleteSubConfirmId, setDeleteSubConfirmId] = useState<string | null>(null);
  const [copiedSubId, setCopiedSubId] = useState<string | null>(null);
  const [showApiKeyMask, setShowApiKeyMask] = useState(false);
  const [singleSubSendingId, setSingleSubSendingId] = useState<string | null>(null);

  // EMAIL BROADCAST STATES
  const [notifySubscribersOnPublish, setNotifySubscribersOnPublish] = useState(true);
  const [resendApiKey, setResendApiKey] = useState('');
  const [previewNewsletterPost, setPreviewNewsletterPost] = useState<ExtendedBlogPost | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Toast Notification State
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Load instantly from localStorage
    setPosts(getStoredBlogPosts());
    setAssets(getStoredDigitalAssets());
    setSubscribers(getStoredSubscribers());
    setResendApiKey(getStoredResendKey());

    // Then sync from Supabase and refresh if newer data exists
    syncBlogPostsFromSupabase().then((remote) => {
      if (remote) setPosts(remote);
    });
    syncAssetsFromSupabase().then((remote) => {
      if (remote) setAssets(remote);
    });
    syncSubscribersFromSupabase().then((remote) => {
      if (remote) setSubscribers(remote);
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

  const handleSaveBlog = async (e: React.FormEvent) => {
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
      date: currentPost.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: currentPost.readTime || '5 min read',
      image: currentPost.image || '/assets/images/works1.jpg',
      author: currentPost.author || 'SM SAAD',
      status: currentPost.status || 'published',
    };

    const isPublishing = postToSave.status === 'published';
    const updated = await saveStoredBlogPost(postToSave);
    setPosts(updated);
    setIsBlogEditorOpen(false);

    if (isPublishing && notifySubscribersOnPublish && subscribers.length > 0) {
      showNotify(`Article published! Broadcasting email to ${subscribers.length} subscriber(s)...`);
      const broadcastRes = await broadcastNewBlogPost(postToSave);
      showNotify(broadcastRes.message);
    } else {
      showNotify(`Article "${postToSave.title}" ${postToSave.status === 'published' ? 'Published' : 'Saved as Draft'}!`);
    }
  };

  const handleManualBroadcastArticle = async (post: ExtendedBlogPost) => {
    if (subscribers.length === 0) {
      showNotify('No subscribers found to send broadcast.');
      return;
    }
    setIsBroadcasting(true);
    showNotify(`Broadcasting "${post.title}" to ${subscribers.length} subscriber(s)...`);
    const res = await broadcastNewBlogPost(post);
    setIsBroadcasting(false);
    showNotify(res.message);
  };

  const handleSaveResendKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredResendKey(resendApiKey);
    showNotify('Resend API Key updated and saved securely!');
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

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((s) => {
      const q = subscriberSearch.toLowerCase();
      const matchSearch = s.email.toLowerCase().includes(q) || s.source.toLowerCase().includes(q);
      const matchSource =
        subscriberSourceFilter === 'All' || s.source.toLowerCase().includes(subscriberSourceFilter.toLowerCase());
      return matchSearch && matchSource;
    });
  }, [subscribers, subscriberSearch, subscriberSourceFilter]);

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail.trim()) return;
    const newSub: BlogSubscriber = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: newSubEmail.trim().toLowerCase(),
      source: newSubSource.trim() || 'Manual Admin',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    const updated = await saveStoredSubscriber(newSub);
    setSubscribers(updated);
    setNewSubEmail('');
    setIsAddSubscriberOpen(false);
    showNotify(`Subscriber ${newSub.email} added!`);
  };

  const handleDeleteSubscriber = async (id: string) => {
    const updated = await deleteStoredSubscriber(id);
    setSubscribers(updated);
    setDeleteSubConfirmId(null);
    showNotify('Subscriber removed from list.');
  };

  const handleCopySubscriberEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedSubId(id);
    setTimeout(() => setCopiedSubId(null), 2000);
    showNotify('Email copied to clipboard!');
  };

  const handleCopyAllEmails = () => {
    if (subscribers.length === 0) {
      showNotify('No subscribers to copy.');
      return;
    }
    const all = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(all);
    showNotify(`Copied ${subscribers.length} subscriber emails!`);
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      showNotify('No subscribers to export.');
      return;
    }
    const headers = 'ID,Email,Source,Status,Created At\n';
    const rows = subscribers
      .map((s) => `"${s.id}","${s.email}","${s.source}","${s.status}","${s.createdAt}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog_subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotify('Subscribers list exported as CSV!');
  };

  const csvFileInputRef = useRef<HTMLInputElement>(null);

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (!content) {
        showNotify('Failed to read CSV file.');
        return;
      }

      const lines = content.split(/\r\n|\n/).map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) {
        showNotify('CSV file is empty.');
        return;
      }

      let importedCount = 0;
      let duplicateCount = 0;
      const existingEmails = new Set(subscribers.map((s) => s.email.toLowerCase()));
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const newSubscriberList: BlogSubscriber[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Split columns by comma, semicolon, or tab while stripping outer quotes
        const cols = line.split(/[,;\t]/).map((c) => c.replace(/^["']|["']$/g, '').trim());
        
        // Find which column contains a valid email address
        const emailCol = cols.find((c) => emailRegex.test(c));
        if (emailCol) {
          const email = emailCol.toLowerCase();
          if (existingEmails.has(email)) {
            duplicateCount++;
          } else {
            existingEmails.add(email);
            // Detect optional source column (not an email, not numeric ID)
            const sourceCol = cols.find(
              (c) => c !== emailCol && c.length > 0 && !c.includes('@') && isNaN(Number(c)) && !c.startsWith('sub_')
            );
            const source = sourceCol || 'CSV Import';

            const newSub: BlogSubscriber = {
              id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              email,
              source,
              status: 'active',
              createdAt: new Date().toISOString()
            };
            newSubscriberList.push(newSub);
            importedCount++;
          }
        }
      }

      if (newSubscriberList.length > 0) {
        for (const sub of newSubscriberList) {
          saveStoredSubscriber(sub);
        }
        setSubscribers(getStoredSubscribers());
        showNotify(`Imported ${importedCount} subscriber(s)! (${duplicateCount} duplicate(s) skipped)`);
      } else {
        showNotify(duplicateCount > 0 ? `All ${duplicateCount} email(s) already exist in your list.` : 'No valid emails found in CSV.');
      }

      // Reset file input so user can import again
      if (csvFileInputRef.current) {
        csvFileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleSendSingleTestEmail = async (subEmail: string) => {
    const published = posts.filter((p) => p.status === 'published');
    if (published.length === 0) {
      showNotify('Please publish an article first to send a test newsletter.');
      return;
    }
    const targetPost = published[0];
    setSingleSubSendingId(subEmail);
    showNotify(`Sending test newsletter to ${subEmail}...`);
    try {
      const apiKey = resendApiKey || getStoredResendKey();
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'SM SAAD', email: 'hello@smsaad.online' },
          to: [{ email: subEmail }],
          subject: `📢 [Preview] ${targetPost.title}`,
          htmlContent: generateBlogEmailHTML(targetPost, subEmail)
        })
      });
      if (res.ok) {
        showNotify(`Test email delivered to ${subEmail}!`);
      } else {
        showNotify(`Sent via fallback to ${subEmail}`);
      }
    } catch (e) {
      showNotify(`Error sending test email to ${subEmail}`);
    } finally {
      setSingleSubSendingId(null);
    }
  };


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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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

              <div className="bg-white border border-north-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-xs font-heading font-bold uppercase text-north-gray">
                  <span>Blog Subscribers</span>
                  <Users className="w-4 h-4 text-north-lime-dark" />
                </div>
                <p className="font-heading font-black text-2xl text-north-black mt-2">{subscribers.length}</p>
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex items-center space-x-3 pt-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setActiveMainTab('blogs')}
                className={`font-heading font-extrabold text-xs uppercase px-5 py-2.5 border border-north-black transition-all flex items-center space-x-2 shrink-0 ${
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
                className={`font-heading font-extrabold text-xs uppercase px-5 py-2.5 border border-north-black transition-all flex items-center space-x-2 shrink-0 ${
                  activeMainTab === 'assets'
                    ? 'bg-north-black text-north-lime shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-north-black hover:bg-north-bg'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Digital Asset Store ({assets.length})</span>
              </button>

              <button
                onClick={() => setActiveMainTab('subscribers')}
                className={`font-heading font-extrabold text-xs uppercase px-5 py-2.5 border border-north-black transition-all flex items-center space-x-2 shrink-0 ${
                  activeMainTab === 'subscribers'
                    ? 'bg-north-black text-north-lime shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-north-black hover:bg-north-bg'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Blog Subscribers ({subscribers.length})</span>
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

        {/* TAB 3: BLOG SUBSCRIBERS HUB */}
        {activeMainTab === 'subscribers' && (
          <div className="space-y-8">
            <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 space-y-8">
              
              {/* TOP EXECUTIVE METRIC TILES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border-2 border-north-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                  <div className="flex items-center justify-between text-xs font-heading font-extrabold uppercase text-north-gray">
                    <span>Total Subscribers</span>
                    <span className="bg-north-lime text-north-black text-[10px] px-2 py-0.5 border border-north-black font-bold">
                      100% ACTIVE
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="font-heading font-black text-3xl sm:text-4xl text-north-black">
                      {subscribers.length}
                    </span>
                    <Users className="w-6 h-6 text-north-lime-dark" />
                  </div>
                  <p className="text-[11px] text-north-gray font-medium">
                    Verified audience for blog releases
                  </p>
                </div>

                <div className="border-2 border-north-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                  <div className="flex items-center justify-between text-xs font-heading font-extrabold uppercase text-north-gray">
                    <span>Delivery Engine</span>
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[10px] px-2 py-0.5 border border-green-400 font-bold">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      CONNECTED
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="font-heading font-black text-lg sm:text-xl text-north-black truncate">
                      Brevo REST API
                    </span>
                    <Radio className="w-5 h-5 text-green-600 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-north-gray font-mono font-medium truncate">
                    hello@smsaad.online
                  </p>
                </div>

                <div className="border-2 border-north-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                  <div className="flex items-center justify-between text-xs font-heading font-extrabold uppercase text-north-gray">
                    <span>Delivery Quota</span>
                    <span className="bg-north-bg text-north-black text-[10px] px-2 py-0.5 border border-north-black font-bold">
                      FREE TIER
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="font-heading font-black text-2xl sm:text-3xl text-north-black">
                      300 <span className="text-xs font-heading font-bold text-north-gray">/ DAY</span>
                    </span>
                    <Mail className="w-5 h-5 text-north-lime-dark" />
                  </div>
                  <p className="text-[11px] text-north-gray font-medium">
                    9,000 free emails monthly included
                  </p>
                </div>

                <div className="border-2 border-north-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                  <div className="flex items-center justify-between text-xs font-heading font-extrabold uppercase text-north-gray">
                    <span>Publish Automation</span>
                    <span className="bg-north-lime text-black text-[10px] px-2 py-0.5 border border-north-black font-bold">
                      AUTO-BROADCAST
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-heading font-bold text-sm uppercase text-green-700 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Auto-Notify Active
                    </span>
                  </div>
                  <p className="text-[11px] text-north-gray font-medium">
                    Subscribers emailed when article published
                  </p>
                </div>
              </div>

              {/* AUTOMATED EMAIL BROADCAST CONTROL CENTER */}
              <div className="border-2 border-north-black bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-north-black pb-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 bg-north-black text-north-lime border-2 border-north-black flex items-center justify-center font-bold shadow-[2px_2px_0px_0px_rgba(200,255,0,1)]">
                      <Radio className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-north-lime text-north-black font-heading font-black text-[10px] uppercase px-2.5 py-0.5 border border-north-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                          AUTOMATION HUB
                        </span>
                        <span className="text-xs font-heading font-bold uppercase text-north-gray">
                          Brevo & Resend Engine
                        </span>
                      </div>
                      <h2 className="font-heading text-xl sm:text-2xl font-black uppercase text-north-black mt-0.5">
                        Automated Article Broadcast Studio
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-heading font-bold text-north-black uppercase bg-north-lime/20 px-3 py-1.5 border border-north-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <CheckCircle className="w-4 h-4 text-green-700" />
                      <span>Ready to Broadcast</span>
                    </span>
                  </div>
                </div>

                {/* API Key & Broadcast Controls Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                  
                  {/* Left: Brevo / Resend Key Configuration */}
                  <div className="lg:col-span-6 bg-north-bg p-5 border-2 border-north-black space-y-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-extrabold text-xs uppercase text-north-black flex items-center gap-2">
                          <Key className="w-4 h-4 text-north-lime-dark" />
                          <span>Brevo / Resend API Credentials</span>
                        </span>
                        <a
                          href="https://app.brevo.com/settings/keys/api"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-heading font-bold text-north-black hover:text-north-lime-dark underline inline-flex items-center gap-1"
                        >
                          <span>Get Brevo Key</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>

                      <form onSubmit={handleSaveResendKeySubmit} className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type={showApiKeyMask ? 'text' : 'password'}
                            placeholder="Paste Brevo API Key (xkeysib-...) or Resend Key (re_...)"
                            value={resendApiKey}
                            onChange={(e) => setResendApiKey(e.target.value)}
                            className="w-full p-2.5 bg-white border border-north-black text-xs font-mono pr-9 focus:outline-none focus:ring-2 focus:ring-north-lime"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKeyMask(!showApiKeyMask)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-north-gray hover:text-north-black"
                            title={showApiKeyMask ? 'Hide Key' : 'Show Key'}
                          >
                            {showApiKeyMask ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <button
                          type="submit"
                          className="btn-north bg-north-black text-north-lime hover:bg-north-lime hover:text-north-black text-xs font-heading font-extrabold uppercase py-2.5 px-4 whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          Save Key
                        </button>
                      </form>
                    </div>

                    <div className="bg-white border border-north-black p-3 text-[11px] space-y-1 text-north-gray leading-tight">
                      <p className="font-heading font-bold text-north-black uppercase text-[10px]">
                        Active Sender Configuration:
                      </p>
                      <p>
                        Delivers from <code className="font-mono text-north-black font-bold">hello@smsaad.online</code>. Auto-delivers to all subscribers immediately whenever a new blog post is published.
                      </p>
                    </div>
                  </div>

                  {/* Right: Broadcast Any Published Article */}
                  <div className="lg:col-span-6 bg-north-bg p-5 border-2 border-north-black space-y-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-extrabold text-xs uppercase text-north-black flex items-center gap-2">
                          <Send className="w-4 h-4 text-north-lime-dark" />
                          <span>Broadcast Published Article</span>
                        </span>
                        <span className="text-[10px] font-mono text-north-gray">
                          Target: {subscribers.length} subscriber(s)
                        </span>
                      </div>

                      {posts.filter((p) => p.status === 'published').length > 0 ? (
                        <div className="space-y-3">
                          <select
                            id="broadcast-article-select"
                            className="w-full p-2.5 bg-white border border-north-black text-xs font-heading font-bold uppercase cursor-pointer"
                          >
                            {posts.filter((p) => p.status === 'published').map((post) => (
                              <option key={post.id} value={post.id}>
                                {post.title} — ({post.category})
                              </option>
                            ))}
                          </select>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const sel = document.getElementById('broadcast-article-select') as HTMLSelectElement;
                                const targetPost = posts.find((p) => p.id === sel?.value);
                                if (targetPost) setPreviewNewsletterPost(targetPost);
                              }}
                              className="btn-north bg-white text-north-black hover:bg-north-bg text-xs font-heading font-bold uppercase py-2.5 px-4 flex-1 border border-north-black inline-flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Preview Email</span>
                            </button>

                            <button
                              type="button"
                              disabled={isBroadcasting || subscribers.length === 0}
                              onClick={() => {
                                const sel = document.getElementById('broadcast-article-select') as HTMLSelectElement;
                                const targetPost = posts.find((p) => p.id === sel?.value);
                                if (targetPost) handleManualBroadcastArticle(targetPost);
                              }}
                              className="btn-north bg-north-lime text-north-black hover:bg-north-black hover:text-north-lime text-xs font-heading font-extrabold uppercase py-2.5 px-5 flex-1 border border-north-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] inline-flex items-center justify-center gap-1.5"
                            >
                              {isBroadcasting ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Broadcasting...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Send Broadcast</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-north-gray">No published articles available. Publish an article first.</p>
                      )}
                    </div>

                    <p className="text-[11px] text-north-gray leading-tight">
                      Instantly sends a formatted newsletter to all active subscribers via Brevo REST API.
                    </p>
                  </div>
                </div>
              </div>

              {/* SUBSCRIBERS ROSTER & MANAGEMENT HUB */}
              <div className="space-y-4">
                
                {/* SEARCH, FILTER & BATCH ACTIONS BAR */}
                <div className="border-2 border-north-black bg-white p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  
                  {/* Search and Source Filter */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-north-gray" />
                      <input
                        type="text"
                        placeholder="Search subscribers by email or signup source..."
                        value={subscriberSearch}
                        onChange={(e) => setSubscriberSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-north-bg border border-north-black text-north-black text-xs font-body focus:outline-none focus:ring-2 focus:ring-north-lime"
                      />
                    </div>

                    {/* Source Filter Dropdown */}
                    <select
                      value={subscriberSourceFilter}
                      onChange={(e) => setSubscriberSourceFilter(e.target.value)}
                      className="w-full sm:w-auto p-2.5 bg-north-bg border border-north-black text-xs font-heading font-bold uppercase cursor-pointer"
                    >
                      <option value="All">All Sources ({subscribers.length})</option>
                      <option value="Website">Website Form</option>
                      <option value="Article">Article Page</option>
                      <option value="Manual Admin">Manual Admin</option>
                    </select>
                  </div>

                  {/* Batch Actions */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={handleCopyAllEmails}
                      disabled={subscribers.length === 0}
                      className="btn-north bg-white text-north-black hover:bg-north-bg text-xs font-heading font-bold uppercase py-2.5 px-3.5 inline-flex items-center gap-1.5 border border-north-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      title="Copy all subscriber emails formatted for email campaigns"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy All ({subscribers.length})</span>
                    </button>

                    <button
                      onClick={handleExportCSV}
                      disabled={subscribers.length === 0}
                      className="btn-north bg-white text-north-black hover:bg-north-bg text-xs font-heading font-bold uppercase py-2.5 px-3.5 inline-flex items-center gap-1.5 border border-north-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      title="Export subscribers list as a CSV file"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>

                    {/* Hidden CSV File Input */}
                    <input
                      type="file"
                      ref={csvFileInputRef}
                      accept=".csv,text/csv"
                      onChange={handleImportCSV}
                      className="hidden"
                    />

                    {/* Import CSV Button */}
                    <button
                      onClick={() => csvFileInputRef.current?.click()}
                      className="btn-north bg-white text-north-black hover:bg-north-lime text-xs font-heading font-bold uppercase py-2.5 px-3.5 inline-flex items-center gap-1.5 border border-north-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      title="Upload a CSV file containing subscriber emails"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Import CSV</span>
                    </button>

                    <button
                      onClick={() => setIsAddSubscriberOpen(true)}
                      className="btn-north bg-north-black text-north-lime hover:bg-north-lime hover:text-north-black text-xs font-heading font-extrabold uppercase py-2.5 px-4 inline-flex items-center gap-1.5 border border-north-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Add Subscriber</span>
                    </button>
                  </div>
                </div>

                {/* SUBSCRIBERS TABLE */}
                <div className="border-2 border-north-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-north-black text-white text-xs font-heading font-bold uppercase tracking-wider">
                        <th className="p-4 w-12 text-center">#</th>
                        <th className="p-4">Subscriber Email</th>
                        <th className="p-4">Signup Channel</th>
                        <th className="p-4">Date Subscribed</th>
                        <th className="p-4">Delivery Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-north-dark-sand text-xs font-body">
                      {filteredSubscribers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-14 text-center text-north-gray font-heading font-bold uppercase text-xs">
                            <Users className="w-10 h-10 mx-auto mb-3 text-north-gray/40" />
                            <span>No subscribers found matching your search.</span>
                          </td>
                        </tr>
                      ) : (
                        filteredSubscribers.map((sub, idx) => (
                          <tr key={sub.id} className="hover:bg-north-bg/70 transition-colors">
                            <td className="p-4 font-mono text-north-gray text-center font-bold">
                              {String(idx + 1).padStart(2, '0')}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-north-black text-north-lime font-heading font-black text-xs flex items-center justify-center border border-north-black shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                  {sub.email.charAt(0).toUpperCase()}
                                </div>
                                <div className="space-y-0.5">
                                  <a
                                    href={`mailto:${sub.email}`}
                                    className="font-heading font-bold text-sm text-north-black hover:underline select-all block"
                                  >
                                    {sub.email}
                                  </a>
                                  <span className="text-[10px] text-north-gray font-mono">
                                    ID: {sub.id.slice(0, 8)}...
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="bg-white border border-north-black px-2.5 py-1 font-heading font-extrabold text-[10px] uppercase text-north-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] inline-block">
                                {sub.source}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-north-gray">
                              {new Date(sub.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-900 border border-green-400 px-2.5 py-1 font-heading font-extrabold text-[10px] uppercase rounded-full shadow-xs">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Active
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                
                                {/* 1-Click Copy Email */}
                                <button
                                  onClick={() => handleCopySubscriberEmail(sub.email, sub.id)}
                                  className="p-2 border border-north-black bg-white hover:bg-north-lime transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                  title="Copy Email Address"
                                >
                                  {copiedSubId === sub.id ? (
                                    <Check className="w-3.5 h-3.5 text-green-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                {/* Send Single Test Newsletter */}
                                <button
                                  onClick={() => handleSendSingleTestEmail(sub.email)}
                                  disabled={singleSubSendingId === sub.email}
                                  className="p-2 border border-north-black bg-white hover:bg-north-black hover:text-north-lime transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                  title="Send Test Newsletter to this email"
                                >
                                  {singleSubSendingId === sub.email ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Send className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                {/* Delete Subscriber with confirmation */}
                                {deleteSubConfirmId === sub.id ? (
                                  <div className="flex items-center space-x-1 border-2 border-red-600 p-1 bg-red-50">
                                    <button
                                      onClick={() => handleDeleteSubscriber(sub.id)}
                                      className="bg-red-600 text-white px-2 py-0.5 text-[10px] font-heading font-extrabold uppercase"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => setDeleteSubConfirmId(null)}
                                      className="bg-gray-200 text-black px-2 py-0.5 text-[10px] font-heading font-bold uppercase"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteSubConfirmId(sub.id)}
                                    className="p-2 border border-north-black bg-red-50 text-red-700 hover:bg-red-600 hover:text-white transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                    title="Delete Subscriber"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
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

                  {/* Cover Image Picker & File Uploader */}
                  <div className="space-y-2 pt-2 border-t border-north-dark-sand">
                    <div className="flex items-center justify-between">
                      <label className="font-heading font-bold text-xs uppercase text-north-black block">Cover Image URL *</label>
                      <span className="text-[10px] text-north-gray font-mono">Upload from PC or pick below</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                      <input
                        type="text"
                        required
                        placeholder="Paste image link, or upload file below..."
                        value={currentPost.image || ''}
                        onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.value })}
                        className="flex-1 p-2 bg-white border border-north-black text-xs font-mono"
                      />
                      
                      {/* Upload from PC Button */}
                      <label className="cursor-pointer px-3 py-2 bg-north-black text-white text-xs font-heading font-bold uppercase flex items-center space-x-1.5 hover:bg-north-lime hover:text-north-black border border-north-black transition-colors shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (uploadEv) => {
                                const result = uploadEv.target?.result as string;
                                if (result) {
                                  setCurrentPost({ ...currentPost, image: result });
                                  showNotify('Image uploaded successfully!');
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      {/* Random Stock Photo Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const stockImages = [
                            'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80',
                            'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&q=80',
                            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
                            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80',
                            'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=80',
                            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80'
                          ];
                          const randomImg = stockImages[Math.floor(Math.random() * stockImages.length)];
                          setCurrentPost({ ...currentPost, image: randomImg });
                          showNotify('Stock cover image selected!');
                        }}
                        className="px-3 py-2 bg-white text-north-black text-xs font-heading font-bold uppercase border border-north-black hover:bg-north-bg transition-colors shrink-0"
                      >
                        Free Stock
                      </button>

                      {currentPost.image && (
                        <div className="w-14 h-10 border border-north-black overflow-hidden bg-white shrink-0">
                          <img src={currentPost.image} alt="Cover Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[10px] font-heading font-bold uppercase text-north-gray mr-1">Presets:</span>
                      {presetImages.map((imgUrl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCurrentPost({ ...currentPost, image: imgUrl })}
                          className={`w-10 h-7 border overflow-hidden transition-transform ${
                            currentPost.image === imgUrl ? 'border-2 border-north-black ring-2 ring-north-lime scale-105' : 'border-gray-400 opacity-60 hover:opacity-100'
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
                <div className="pt-4 border-t-2 border-north-black flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center space-x-2 text-xs font-heading font-bold uppercase text-north-gray">
                      <ShieldCheck className="w-4 h-4 text-north-lime-dark" />
                      <span>Auto-saved locally</span>
                    </div>

                    <label className="flex items-center space-x-2 cursor-pointer bg-north-bg px-3 py-1.5 border border-north-black text-xs font-heading font-bold uppercase select-none">
                      <input
                        type="checkbox"
                        checked={notifySubscribersOnPublish}
                        onChange={(e) => setNotifySubscribersOnPublish(e.target.checked)}
                        className="accent-north-black w-4 h-4 cursor-pointer"
                      />
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-north-lime-dark" />
                        <span>Email {subscribers.length} subscriber(s)</span>
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
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
                      <span>{currentPost.status === 'published' ? 'Publish & Broadcast' : 'Save Draft'}</span>
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-heading font-bold text-xs uppercase block">Cover Image *</label>
                      <label className="cursor-pointer text-[10px] font-heading font-bold uppercase bg-north-black text-north-lime px-2 py-0.5 border border-north-black hover:bg-north-lime hover:text-north-black">
                        Upload PC Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (uploadEv) => {
                                const result = uploadEv.target?.result as string;
                                if (result) {
                                  setCurrentAsset({ ...currentAsset, image: result });
                                  showNotify('Asset image uploaded!');
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Paste image URL or click Upload PC Image above"
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

        {/* ADD MANUAL SUBSCRIBER MODAL */}
        {isAddSubscriberOpen && (
          <div className="fixed inset-0 z-50 bg-north-black/80 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
            <div className="border-2 border-north-black bg-white w-full max-w-md shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="border-b border-north-black p-5 bg-north-bg flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-lg uppercase flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-north-lime-dark" />
                  <span>Add Blog Subscriber</span>
                </h3>
                <button onClick={() => setIsAddSubscriberOpen(false)} className="btn-north bg-white text-black py-1 px-3">
                  Close
                </button>
              </div>
              <form onSubmit={handleAddSubscriber} className="p-6 space-y-4">
                <div>
                  <label className="font-heading font-bold text-xs uppercase block mb-1">Subscriber Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. creative.editor@gmail.com"
                    value={newSubEmail}
                    onChange={(e) => setNewSubEmail(e.target.value)}
                    className="w-full p-3 bg-north-bg border border-north-black text-xs font-mono focus:outline-none focus:ring-2 focus:ring-north-lime"
                  />
                </div>

                <div>
                  <label className="font-heading font-bold text-xs uppercase block mb-1">Subscription Channel / Source</label>
                  <input
                    type="text"
                    placeholder="e.g. Manual Admin, Client Lead, Event"
                    value={newSubSource}
                    onChange={(e) => setNewSubSource(e.target.value)}
                    className="w-full p-3 bg-north-bg border border-north-black text-xs"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-north-black">
                  <button
                    type="button"
                    onClick={() => setIsAddSubscriberOpen(false)}
                    className="btn-north bg-white text-black text-xs py-2.5 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-north bg-north-black text-north-lime hover:bg-north-lime hover:text-north-black text-xs font-heading font-extrabold uppercase py-2.5 px-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Save Subscriber
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PREVIEW NEWSLETTER EMAIL MODAL */}
        {previewNewsletterPost && (
          <div className="fixed inset-0 z-50 bg-north-black/85 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-sm">
            <div className="border-2 border-north-black bg-white w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
              <div className="border-b border-north-black p-4 sm:p-5 bg-north-bg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="bg-north-black text-north-lime font-heading font-extrabold text-[10px] uppercase px-2 py-0.5 border border-north-black">
                    EMAIL PREVIEW
                  </span>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg uppercase text-north-black">
                    Automated Subscriber Newsletter
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewNewsletterPost(null)}
                  className="p-1.5 border border-north-black bg-white hover:bg-north-black hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Email Content Frame */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-north-bg space-y-4">
                <div className="bg-white border-2 border-north-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                  <div
                    className="p-2"
                    dangerouslySetInnerHTML={{
                      __html: generateBlogEmailHTML(previewNewsletterPost)
                    }}
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 border-t-2 border-north-black bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-north-gray font-mono">
                  Delivering to {subscribers.length} subscriber(s)
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => openClientBroadcastMail(previewNewsletterPost)}
                    className="btn-north bg-white text-north-black hover:bg-north-bg text-xs font-heading font-bold uppercase py-2 px-4"
                  >
                    Open in Email Client (Gmail/BCC)
                  </button>
                  <button
                    type="button"
                    disabled={isBroadcasting}
                    onClick={async () => {
                      await handleManualBroadcastArticle(previewNewsletterPost);
                      setPreviewNewsletterPost(null);
                    }}
                    className="btn-north bg-north-lime text-north-black hover:bg-north-black hover:text-north-lime text-xs font-heading font-extrabold uppercase py-2 px-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {isBroadcasting ? 'Sending...' : 'Send Broadcast Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminAuthGuard>
  );
};
