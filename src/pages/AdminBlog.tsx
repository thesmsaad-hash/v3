import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Edit, Trash2, Eye, EyeOff, Search, RefreshCw, FileText, CheckCircle, Clock,
  ArrowLeft, ArrowUpRight, LayoutGrid, List, Sparkles, Image as ImageIcon
} from 'lucide-react';
import {
  getStoredBlogPosts,
  saveStoredBlogPost,
  deleteStoredBlogPost,
  resetStoredBlogPosts,
  ExtendedBlogPost
} from '../utils/blogStorage';

export const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<ExtendedBlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modal / Form state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [currentPost, setCurrentPost] = useState<Partial<ExtendedBlogPost>>({
    title: '',
    category: 'Video Editing',
    excerpt: '',
    content: '',
    readTime: '5 min read',
    image: '/assets/images/works1.jpg',
    author: 'SM SAAD',
    status: 'published',
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setPosts(getStoredBlogPosts());
  }, []);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateNew = () => {
    setCurrentPost({
      id: Date.now().toString(),
      title: '',
      category: 'Video Editing',
      excerpt: '',
      content: `# New Article Title\n\nWrite your blog post content here in Markdown or plain text...\n\n## Key Takeaways\n\n- Key point 1\n- Key point 2`,
      readTime: '4 min read',
      date: new Date().getFullYear().toString(),
      image: '/assets/images/works1.jpg',
      author: 'SM SAAD',
      status: 'published',
    });
    setActiveTab('write');
    setIsEditorOpen(true);
  };

  const handleEdit = (post: ExtendedBlogPost) => {
    setCurrentPost({ ...post });
    setActiveTab('write');
    setIsEditorOpen(true);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost.title || !currentPost.excerpt) {
      alert('Please provide a title and short excerpt.');
      return;
    }

    const postToSave: ExtendedBlogPost = {
      id: currentPost.id || Date.now().toString(),
      title: currentPost.title || 'Untitled Post',
      category: currentPost.category || 'General',
      excerpt: currentPost.excerpt || '',
      content: currentPost.content || '',
      date: currentPost.date || new Date().getFullYear().toString(),
      readTime: currentPost.readTime || '4 min read',
      image: currentPost.image || '/assets/images/works1.jpg',
      author: 'SM SAAD',
      status: currentPost.status || 'published',
    };

    const updated = saveStoredBlogPost(postToSave);
    setPosts(updated);
    setIsEditorOpen(false);
    showNotify(`Post "${postToSave.title}" saved successfully!`);
  };

  const handleToggleStatus = (post: ExtendedBlogPost) => {
    const newStatus: 'published' | 'draft' = post.status === 'published' ? 'draft' : 'published';
    const updatedPost: ExtendedBlogPost = { ...post, status: newStatus };
    const updated = saveStoredBlogPost(updatedPost);
    setPosts(updated);
    showNotify(`Post "${post.title}" is now ${newStatus.toUpperCase()}`);
  };

  const handleDelete = (id: string) => {
    const updated = deleteStoredBlogPost(id);
    setPosts(updated);
    setDeleteConfirmId(null);
    showNotify('Blog post deleted successfully.');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all blog posts to default demo articles?')) {
      const defaults = resetStoredBlogPosts();
      setPosts(defaults);
      showNotify('Restored default blog posts.');
    }
  };

  // Preset image options
  const presetImages = [
    '/assets/images/works1.jpg',
    '/assets/images/works2.jpg',
    '/assets/images/works3.jpg',
    '/assets/images/works4.jpg',
    '/assets/images/why.jpg',
    '/assets/images/about.jpg',
    '/assets/images/hero.jpg'
  ];

  // Filtering
  const categories = ['All', 'Video Editing', 'VFX & Compositing', 'Motion Graphics', 'Web Development', 'AI Technology', 'Workflow'];

  const filteredPosts = posts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  return (
    <div className="min-h-screen bg-north-bg text-north-black pb-20">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-north-black text-north-lime border border-north-black px-6 py-3 shadow-2xl font-heading text-xs uppercase font-bold flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* ADMIN HEADER BANNER */}
      <section className="border-b border-north-black bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 border border-north-black bg-north-lime px-3 py-1 mb-2">
                <span className="w-2 h-2 bg-north-black inline-block"></span>
                <span className="font-heading font-bold text-[11px] uppercase tracking-wider text-north-black">
                  ADMIN DASHBOARD
                </span>
              </div>
              <h1 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
                Post Blogs & Articles
              </h1>
              <p className="text-north-gray text-sm mt-1">
                Manage, publish, edit and format blog posts for <strong>smsaad.online</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/blogs" className="btn-north bg-white text-north-black hover:bg-north-bg inline-flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>View Public Blog</span>
              </Link>
              <button onClick={handleCreateNew} className="btn-north bg-north-black text-north-lime hover:bg-north-lime hover:text-north-black inline-flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                <span>+ Create New Post</span>
              </button>
            </div>
          </div>

          {/* STATS METRICS COUNTERS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-north-dark-sand">
            <div className="border border-north-black bg-north-bg p-4 flex flex-col justify-between">
              <span className="font-heading text-xs uppercase font-bold text-north-gray">Total Articles</span>
              <span className="font-heading text-3xl font-extrabold text-north-black mt-2">{posts.length}</span>
            </div>
            <div className="border border-north-black bg-white p-4 flex flex-col justify-between">
              <span className="font-heading text-xs uppercase font-bold text-north-lime-dark">Published</span>
              <span className="font-heading text-3xl font-extrabold text-north-black mt-2">{publishedCount}</span>
            </div>
            <div className="border border-north-black bg-white p-4 flex flex-col justify-between">
              <span className="font-heading text-xs uppercase font-bold text-amber-600">Drafts</span>
              <span className="font-heading text-3xl font-extrabold text-north-black mt-2">{draftCount}</span>
            </div>
            <div className="border border-north-black bg-north-black text-white p-4 flex flex-col justify-between">
              <span className="font-heading text-xs uppercase font-bold text-north-lime">Categories</span>
              <span className="font-heading text-3xl font-extrabold text-white mt-2">{categories.length - 1}</span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER & SEARCH BAR */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8">
        <div className="border border-north-black bg-white p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-north-gray" />
            <input
              type="text"
              placeholder="Search posts by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-north-bg border border-north-black text-north-black text-xs font-body focus:outline-none focus:ring-2 focus:ring-north-lime"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 bg-north-bg border border-north-black text-north-black text-xs font-heading font-bold uppercase focus:outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2.5 bg-north-bg border border-north-black text-north-black text-xs font-heading font-bold uppercase focus:outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-north-black bg-north-bg">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 ${viewMode === 'table' ? 'bg-north-black text-white' : 'text-north-black hover:bg-white'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-north-black text-white' : 'text-north-black hover:bg-white'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Reset Defaults */}
            <button
              onClick={handleResetDefaults}
              className="p-2.5 border border-north-black bg-white hover:bg-north-bg text-north-black text-xs font-heading font-bold uppercase inline-flex items-center"
              title="Reset Demo Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* POSTS LIST (TABLE OR GRID VIEW) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6">
        {filteredPosts.length === 0 ? (
          <div className="border border-north-black bg-white p-12 text-center space-y-4">
            <FileText className="w-12 h-12 text-north-gray mx-auto" />
            <h3 className="font-heading text-xl font-bold uppercase">No Articles Found</h3>
            <p className="text-north-gray text-xs">No posts match your search query or filters.</p>
            <button onClick={handleCreateNew} className="btn-north bg-north-black text-north-lime mt-2">
              + Create First Article
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* TABLE VIEW */
          <div className="border border-north-black bg-white overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-north-black bg-north-black text-white text-xs font-heading uppercase tracking-wider">
                  <th className="p-4">Cover</th>
                  <th className="p-4">Title & Excerpt</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Read Time</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-north-dark-sand font-body text-xs">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-north-bg/50 transition-colors">
                    <td className="p-4 w-20">
                      <img src={post.image} alt={post.title} className="w-14 h-10 object-cover border border-north-black" />
                    </td>
                    <td className="p-4 max-w-xs md:max-w-md">
                      <h4 className="font-heading font-bold text-sm uppercase text-north-black line-clamp-1">{post.title}</h4>
                      <p className="text-north-gray text-[11px] line-clamp-1 mt-0.5">{post.excerpt}</p>
                    </td>
                    <td className="p-4">
                      <span className="bg-north-bg text-north-black px-2.5 py-1 font-heading font-bold text-[10px] uppercase border border-north-black">
                        {post.category}
                      </span>
                    </td>
                    <td className="p-4">
                      {post.status === 'published' ? (
                        <span className="bg-north-lime text-north-black font-heading font-bold text-[10px] uppercase px-2.5 py-0.5 border border-north-black inline-flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 bg-north-black rounded-full"></span>
                          <span>PUBLISHED</span>
                        </span>
                      ) : (
                        <span className="bg-amber-200 text-amber-950 font-heading font-bold text-[10px] uppercase px-2.5 py-0.5 border border-amber-400 inline-flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                          <span>DRAFT</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-north-gray font-medium">{post.readTime}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/blogs/${post.id}`}
                          className="p-1.5 border border-north-black bg-white hover:bg-north-lime text-north-black"
                          title="View Live Post"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(post)}
                          className="p-1.5 border border-north-black bg-white hover:bg-north-bg text-north-black"
                          title={post.status === 'published' ? 'Unpublish to Draft' : 'Publish Article'}
                        >
                          {post.status === 'published' ? <EyeOff className="w-3.5 h-3.5 text-north-gray" /> : <Eye className="w-3.5 h-3.5 text-north-lime-dark" />}
                        </button>
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-1.5 border border-north-black bg-north-black text-white hover:bg-north-lime hover:text-north-black"
                          title="Edit Article"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(post.id)}
                          className="p-1.5 border border-north-black bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="border border-north-black bg-white p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative aspect-[16/9] border border-north-black overflow-hidden bg-north-bg">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-north-lime text-north-black text-[10px] font-heading font-bold uppercase px-2 py-0.5 border border-north-black">
                      {post.category}
                    </span>
                    <span className={`absolute top-2 right-2 text-[10px] font-heading font-bold uppercase px-2 py-0.5 border ${
                      post.status === 'published' ? 'bg-north-black text-white border-north-black' : 'bg-amber-300 text-black border-amber-500'
                    }`}>
                      {post.status}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg uppercase text-north-black line-clamp-2">{post.title}</h3>
                  <p className="text-north-gray text-xs line-clamp-2">{post.excerpt}</p>
                </div>

                <div className="pt-4 border-t border-north-dark-sand flex items-center justify-between">
                  <span className="text-[11px] text-north-gray font-medium">{post.readTime}</span>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(post)} className="p-1.5 border border-north-black bg-north-black text-white text-xs">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteConfirmId(post.id)} className="p-1.5 border border-north-black bg-red-100 text-red-600 text-xs">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CREATE / EDIT BLOG POST MODAL & EDITOR */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-north-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="border border-north-black bg-white w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-fadeIn">
            
            {/* Modal Header */}
            <div className="border-b border-north-black p-6 bg-north-bg flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase px-2.5 py-1 border border-north-black">
                  {currentPost.id ? 'EDIT POST' : 'NEW POST'}
                </span>
                <h3 className="font-heading font-bold text-xl uppercase truncate">
                  {currentPost.title || 'Untitled Article'}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('write')}
                  className={`px-4 py-1.5 font-heading text-xs font-bold uppercase border border-north-black ${
                    activeTab === 'write' ? 'bg-north-black text-north-lime' : 'bg-white text-north-black'
                  }`}
                >
                  Write Content
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-1.5 font-heading text-xs font-bold uppercase border border-north-black ${
                    activeTab === 'preview' ? 'bg-north-black text-north-lime' : 'bg-white text-north-black'
                  }`}
                >
                  Live Preview
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {activeTab === 'write' ? (
                <form id="post-editor-form" onSubmit={handleSavePost} className="space-y-6">
                  
                  {/* Title & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 space-y-2">
                      <label className="font-heading font-bold text-xs uppercase text-north-black block">
                        Article Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={currentPost.title || ''}
                        onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                        placeholder="e.g. 5 VFX Compositing Techniques Every Editor Should Master"
                        className="w-full p-3 bg-north-bg border border-north-black text-north-black font-heading font-bold text-base focus:outline-none focus:ring-2 focus:ring-north-lime"
                      />
                    </div>

                    <div className="md:col-span-4 space-y-2">
                      <label className="font-heading font-bold text-xs uppercase text-north-black block">
                        Category *
                      </label>
                      <select
                        value={currentPost.category || 'Video Editing'}
                        onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                        className="w-full p-3 bg-north-bg border border-north-black text-north-black text-xs font-heading font-bold uppercase focus:outline-none cursor-pointer"
                      >
                        <option value="Video Editing">Video Editing</option>
                        <option value="VFX & Compositing">VFX & Compositing</option>
                        <option value="Motion Graphics">Motion Graphics</option>
                        <option value="Web Development">Web Development</option>
                        <option value="AI Technology">AI Technology</option>
                        <option value="Workflow">Workflow</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                  </div>

                  {/* Read Time, Image & Status */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 space-y-2">
                      <label className="font-heading font-bold text-xs uppercase text-north-black block">
                        Read Time *
                      </label>
                      <input
                        type="text"
                        required
                        value={currentPost.readTime || '4 min read'}
                        onChange={(e) => setCurrentPost({ ...currentPost, readTime: e.target.value })}
                        placeholder="e.g. 5 min read"
                        className="w-full p-3 bg-north-bg border border-north-black text-north-black text-xs font-body focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-5 space-y-2">
                      <label className="font-heading font-bold text-xs uppercase text-north-black block">
                        Cover Image URL *
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          required
                          value={currentPost.image || ''}
                          onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.value })}
                          placeholder="/assets/images/works1.jpg"
                          className="w-full p-3 bg-north-bg border border-north-black text-north-black text-xs font-body focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-3 space-y-2">
                      <label className="font-heading font-bold text-xs uppercase text-north-black block">
                        Publishing Status
                      </label>
                      <select
                        value={currentPost.status || 'published'}
                        onChange={(e) => setCurrentPost({ ...currentPost, status: e.target.value as 'published' | 'draft' })}
                        className="w-full p-3 bg-north-bg border border-north-black text-north-black text-xs font-heading font-bold uppercase cursor-pointer"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  {/* Preset Image Selectors */}
                  <div className="space-y-2">
                    <span className="font-heading font-bold text-[10px] uppercase text-north-gray block">
                      Select Quick Preset Cover Image:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {presetImages.map((img) => (
                        <button
                          key={img}
                          type="button"
                          onClick={() => setCurrentPost({ ...currentPost, image: img })}
                          className={`w-14 h-10 border ${currentPost.image === img ? 'border-north-lime border-2 scale-105' : 'border-north-black opacity-60'} overflow-hidden`}
                        >
                          <img src={img} alt="Preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-2">
                    <label className="font-heading font-bold text-xs uppercase text-north-black block">
                      Short Excerpt / Card Summary *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={currentPost.excerpt || ''}
                      onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                      placeholder="Concise summary for blog card previews on the homepage and blog index..."
                      className="w-full p-3 bg-north-bg border border-north-black text-north-black text-xs font-body focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  {/* Article Full Content (Textarea / Markdown) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-heading font-bold text-xs uppercase text-north-black block">
                        Full Article Content (Markdown Supported) *
                      </label>
                      <div className="flex space-x-1 text-[10px] font-heading font-bold uppercase">
                        <button
                          type="button"
                          onClick={() => setCurrentPost({ ...currentPost, content: (currentPost.content || '') + '\n\n## Section Heading\n' })}
                          className="px-2 py-0.5 border border-north-black bg-north-bg hover:bg-north-lime"
                        >
                          + Heading
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentPost({ ...currentPost, content: (currentPost.content || '') + '\n\n**Bold Text**' })}
                          className="px-2 py-0.5 border border-north-black bg-north-bg hover:bg-north-lime"
                        >
                          + Bold
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentPost({ ...currentPost, content: (currentPost.content || '') + '\n\n> Quote text\n' })}
                          className="px-2 py-0.5 border border-north-black bg-north-bg hover:bg-north-lime"
                        >
                          + Quote
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={12}
                      required
                      value={currentPost.content || ''}
                      onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                      placeholder="Write your article content using markdown headings (#, ##), bullet points (-), bold text (**text**), and quotes (>)..."
                      className="w-full p-4 bg-north-bg border border-north-black text-north-black text-xs font-mono focus:outline-none leading-relaxed"
                    ></textarea>
                  </div>

                </form>
              ) : (
                /* LIVE PREVIEW TAB */
                <div className="space-y-8 border border-north-black bg-white p-8">
                  <div className="space-y-4 border-b border-north-black pb-6">
                    <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase px-3 py-1 border border-north-black">
                      {currentPost.category || 'Category'}
                    </span>
                    <h2 className="font-heading text-3xl sm:text-4xl font-bold uppercase">{currentPost.title || 'Untitled Post'}</h2>
                    <p className="text-north-gray text-sm italic">{currentPost.excerpt}</p>
                    <div className="flex items-center space-x-4 text-xs text-north-gray">
                      <span>By {currentPost.author || 'SM SAAD'}</span>
                      <span>•</span>
                      <span>{currentPost.readTime || '4 min read'}</span>
                    </div>
                  </div>

                  {currentPost.image && (
                    <img src={currentPost.image} alt={currentPost.title} className="w-full h-64 object-cover border border-north-black" />
                  )}

                  <div className="prose max-w-none text-north-black text-sm leading-relaxed whitespace-pre-line font-body">
                    {currentPost.content}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-north-black p-6 bg-north-bg flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="btn-north bg-white text-north-black hover:bg-north-bg"
              >
                Cancel
              </button>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={(e) => {
                    setCurrentPost({ ...currentPost, status: 'draft' });
                    handleSavePost(e);
                  }}
                  className="btn-north bg-white text-north-black border-north-black hover:bg-amber-100"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  form="post-editor-form"
                  className="btn-north bg-north-black text-north-lime hover:bg-north-lime hover:text-north-black"
                >
                  Publish Article
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-north-black/80 flex items-center justify-center p-4">
          <div className="border border-north-black bg-white p-8 max-w-md w-full space-y-6 text-center shadow-2xl animate-fadeIn">
            <Trash2 className="w-12 h-12 text-red-600 mx-auto" />
            <h3 className="font-heading text-2xl font-bold uppercase text-north-black">Delete Blog Article?</h3>
            <p className="text-north-gray text-xs">
              Are you sure you want to permanently delete this article? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center space-x-4 pt-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-north bg-white text-north-black"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="btn-north bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
