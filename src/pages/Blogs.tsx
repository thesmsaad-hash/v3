import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Calendar,
  Clock,
  Settings,
  Search,
  LayoutGrid,
  List,
  Share2,
  Check,
  Sparkles,
  BookOpen,
  Mail,
  X,
  TrendingUp,
  ArrowRight,
  User
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { getStoredBlogPosts, syncBlogPostsFromSupabase, ExtendedBlogPost } from '../utils/blogStorage';

export const Blogs: React.FC = () => {
  const [posts, setPosts] = useState<ExtendedBlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'readTime'>('newest');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    const all = getStoredBlogPosts();
    setPosts(all.filter((p) => p.status === 'published'));

    // Sync from Supabase for latest data
    syncBlogPostsFromSupabase().then((remote) => {
      if (remote) setPosts(remote.filter((p) => p.status === 'published'));
    });
  }, []);

  // Compute categories dynamically with post counts
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    map.set('All', posts.length);
    posts.forEach((p) => {
      if (p.category) {
        map.set(p.category, (map.get(p.category) || 0) + 1);
      }
    });
    return Array.from(map.entries());
  }, [posts]);

  // Featured post (latest/first post by default)
  const featuredPost = useMemo(() => {
    if (posts.length === 0) return null;
    return posts[0];
  }, [posts]);

  // Filter & Sort posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === 'readTime') {
      const getMinutes = (rt: string) => parseInt(rt) || 5;
      result.sort((a, b) => getMinutes(a.readTime) - getMinutes(b.readTime));
    }

    return result;
  }, [posts, searchQuery, selectedCategory, sortBy]);

  const handleShare = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/blogs/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setNewsletterSubmitted(true);
      setEmailInput('');
      setTimeout(() => setNewsletterSubmitted(false), 5000);
    }
  };

  // Total reading time calculation
  const totalReadMinutes = useMemo(() => {
    return posts.reduce((acc, p) => acc + (parseInt(p.readTime) || 5), 0);
  }, [posts]);

  return (
    <div className="space-y-12 md:space-y-16 pb-20 bg-north-bg text-north-black min-h-screen">
      <SEO
        title="Articles & Technical Insights — Video Editing, VFX & Web Development"
        description="Explore in-depth technical guides on video editing pacing, VFX compositing, sound design, motion graphics, and AI-assisted workflows by SM SAAD."
        keywords="video editing tutorials, VFX compositing breakdown, DaVinci Resolve color grading guide, Premiere Pro workflow, motion design articles, AI creator tools"
        canonical="https://smsaad.online/blogs"
        breadcrumbs={[{ name: 'Articles & Blogs', url: '/blogs' }]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'SM SAAD Technical Creative Blog',
          description: 'Insights and tutorials on post-production, VFX compositing, and modern web applications.',
          url: 'https://smsaad.online/blogs',
          author: {
            '@type': 'Person',
            name: 'SM SAAD',
            url: 'https://smsaad.online',
          },
        }}
      />

      {/* HERO SECTION */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 md:pt-12">
        <div className="border border-north-black bg-white p-6 sm:p-10 md:p-12 space-y-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-north-dark-sand pb-4">
            <div className="flex items-center space-x-2">
              <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase tracking-widest px-3 py-1 border border-north-black inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                POST-PRODUCTION & CREATOR INSIGHTS
              </span>
            </div>

            {/* Admin Quick Action Button */}
            <Link
              to="/admin/blogs"
              className="btn-north bg-north-black text-north-lime hover:bg-north-lime hover:text-north-black text-xs inline-flex items-center w-fit"
            >
              <Settings className="w-4 h-4 mr-2" />
              <span>Admin Blog Dashboard</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-heading text-4xl sm:text-6xl font-extrabold uppercase tracking-tight leading-tight">
                Creative Blog <span className="text-north-lime-dark">&</span> Insights
              </h1>
              <p className="text-north-gray font-body text-base sm:text-lg max-w-2xl leading-relaxed">
                In-depth articles covering video editing workflows, VFX compositing techniques, motion graphics design, and cutting-edge AI tools for creators.
              </p>
            </div>

            {/* QUICK STATS PILLS */}
            <div className="lg:col-span-4 flex flex-wrap lg:flex-col gap-3 justify-start lg:justify-end">
              <div className="bg-north-bg border border-north-black p-3.5 flex items-center justify-between flex-1 min-w-[160px]">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-north-lime-dark" />
                  <span className="text-xs font-heading font-bold uppercase">Total Articles</span>
                </div>
                <span className="font-heading font-bold text-lg">{posts.length}</span>
              </div>

              <div className="bg-north-bg border border-north-black p-3.5 flex items-center justify-between flex-1 min-w-[160px]">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-north-lime-dark" />
                  <span className="text-xs font-heading font-bold uppercase">Est. Read Time</span>
                </div>
                <span className="font-heading font-bold text-lg">~{totalReadMinutes} min</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SPOTLIGHT ARTICLE (When no active search query) */}
      {featuredPost && !searchQuery && selectedCategory === 'All' && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="border border-north-black bg-white group overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Image side */}
              <div className="lg:col-span-7 relative overflow-hidden bg-north-black min-h-[300px] lg:min-h-[420px] border-b lg:border-b-0 lg:border-r border-north-black">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-north-black text-north-lime font-heading font-bold text-xs uppercase px-3 py-1 border border-north-black flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> FEATURED ARTICLE
                  </span>
                  <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase px-3 py-1 border border-north-black">
                    {featuredPost.category}
                  </span>
                </div>
              </div>

              {/* Details side */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-xs font-medium text-north-gray">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase text-north-black group-hover:text-north-lime-dark transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-north-gray text-sm sm:text-base leading-relaxed line-clamp-4">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-north-dark-sand flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/assets/images/hero.jpg"
                      alt="SM SAAD"
                      className="w-10 h-10 rounded-full border border-north-black object-cover"
                    />
                    <div>
                      <p className="font-heading font-bold text-xs uppercase">{featuredPost.author || 'SM SAAD'}</p>
                      <p className="text-[11px] text-north-gray">Editor & Creator</p>
                    </div>
                  </div>

                  <Link
                    to={`/blogs/${featuredPost.id}`}
                    className="btn-north bg-north-black text-north-lime hover:bg-north-lime hover:text-north-black text-xs inline-flex items-center group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FILTER, SEARCH & CONTROLS BAR */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="border border-north-black bg-white p-4 sm:p-6 space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {/* Top Row: Search & View Modes */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-north-gray" />
              <input
                type="text"
                placeholder="Search articles by title, keyword, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-north-bg border border-north-black pl-10 pr-10 py-2.5 text-sm font-body text-north-black placeholder:text-north-gray focus:outline-none focus:ring-2 focus:ring-north-lime"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-north-gray hover:text-north-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right Controls: Sort & Layout Toggle */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2 text-xs font-heading font-bold uppercase">
                <span className="hidden sm:inline text-north-gray">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-north-bg border border-north-black px-3 py-2 text-xs font-heading font-bold uppercase text-north-black focus:outline-none focus:ring-2 focus:ring-north-lime cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="readTime">Quickest Reads</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center border border-north-black bg-north-bg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  className={`p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-north-black text-north-lime'
                      : 'text-north-black hover:bg-white'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  title="List View"
                  className={`p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-north-black text-north-lime'
                      : 'text-north-black hover:bg-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none border-t border-north-dark-sand">
            {categories.map(([cat, count]) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`font-heading font-bold text-xs uppercase px-3.5 py-1.5 border border-north-black transition-all whitespace-nowrap flex items-center space-x-2 ${
                    isActive
                      ? 'bg-north-black text-north-lime shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-north-black hover:bg-north-bg'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-north-lime text-north-black' : 'bg-north-bg text-north-gray'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ARTICLES LISTING / GRID */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {filteredPosts.length === 0 ? (
          <div className="border border-north-black bg-white p-12 text-center space-y-4">
            <h3 className="font-heading text-2xl font-bold uppercase">No Articles Found</h3>
            <p className="text-north-gray text-sm max-w-md mx-auto">
              We couldn't find any articles matching your search criteria or category filter. Try clearing your search term.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="btn-north bg-north-black text-north-lime text-xs inline-flex items-center"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredPosts.map((blog) => (
                <motion.article
                  key={blog.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="border border-north-black bg-white flex flex-col justify-between group overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="space-y-4">
                    {/* Cover Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 border-b border-north-black">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 bg-north-lime text-north-black font-heading font-bold text-[11px] uppercase px-2.5 py-1 border border-north-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {blog.category}
                      </span>
                      {/* Share Button */}
                      <button
                        onClick={(e) => handleShare(e, blog.id)}
                        title="Copy article link"
                        className="absolute top-3 right-3 bg-white text-north-black p-1.5 border border-north-black hover:bg-north-lime transition-colors"
                      >
                        {copiedId === blog.id ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center space-x-4 text-xs text-north-gray font-medium">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-north-lime-dark" />
                          {blog.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-north-lime-dark" />
                          {blog.readTime}
                        </span>
                      </div>
                      <h3 className="font-heading text-xl font-bold uppercase text-north-black group-hover:text-north-lime-dark transition-colors line-clamp-2 leading-snug">
                        {blog.title}
                      </h3>
                      <p className="text-north-gray text-sm line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-north-dark-sand mt-4 flex items-center justify-between">
                    <Link
                      to={`/blogs/${blog.id}`}
                      className="font-heading font-bold text-xs uppercase tracking-wider text-north-black hover:text-north-lime-dark inline-flex items-center group-hover:translate-x-1 transition-transform"
                    >
                      <span>READ ARTICLE</span>
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Link>

                    {copiedId === blog.id && (
                      <span className="text-[10px] text-green-600 font-bold uppercase">Copied!</span>
                    )}
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* LIST / MAGAZINE VIEW */
          <motion.div layout className="space-y-6">
            <AnimatePresence>
              {filteredPosts.map((blog) => (
                <motion.article
                  key={blog.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="border border-north-black bg-white group overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all p-4 sm:p-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    {/* Image */}
                    <div className="sm:col-span-4 relative aspect-[16/10] overflow-hidden bg-neutral-100 border border-north-black">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 bg-north-lime text-north-black font-heading font-bold text-[10px] uppercase px-2 py-0.5 border border-north-black">
                        {blog.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="sm:col-span-8 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4 text-xs text-north-gray font-medium">
                          <span className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1 text-north-lime-dark" />
                            {blog.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1 text-north-lime-dark" />
                            {blog.readTime}
                          </span>
                          <span className="flex items-center text-north-black font-bold">
                            <User className="w-3.5 h-3.5 mr-1 text-north-lime-dark" />
                            {blog.author || 'SM SAAD'}
                          </span>
                        </div>

                        <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase text-north-black group-hover:text-north-lime-dark transition-colors">
                          {blog.title}
                        </h3>

                        <p className="text-north-gray text-sm line-clamp-2 leading-relaxed">
                          {blog.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-north-dark-sand mt-2">
                        <Link
                          to={`/blogs/${blog.id}`}
                          className="font-heading font-bold text-xs uppercase tracking-wider text-north-black hover:text-north-lime-dark inline-flex items-center group-hover:translate-x-1 transition-transform"
                        >
                          <span>READ ARTICLE</span>
                          <ArrowUpRight className="w-4 h-4 ml-1" />
                        </Link>

                        <button
                          onClick={(e) => handleShare(e, blog.id)}
                          title="Copy article link"
                          className="text-xs font-heading font-bold uppercase text-north-gray hover:text-north-black inline-flex items-center gap-1"
                        >
                          {copiedId === blog.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-green-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Share</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* CREATOR NEWSLETTER / INSIGHTS BANNER */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6">
        <div className="border border-north-black bg-north-black text-white p-8 md:p-12 shadow-[6px_6px_0px_0px_rgba(200,255,0,1)] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase tracking-widest px-3 py-1 border border-north-black inline-block">
                STAY AHEAD OF THE CURVE
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase text-white leading-tight">
                Subscribe to Post-Production & VFX Insights
              </h2>
              <p className="text-gray-300 text-sm sm:text-base max-w-xl">
                Get monthly deep-dives on Premiere Pro workflows, After Effects VFX secrets, AI visual tools, and high-converting video editing tips straight to your inbox.
              </p>
            </div>

            <div className="lg:col-span-5">
              {newsletterSubmitted ? (
                <div className="bg-north-lime text-north-black p-6 border border-white text-center space-y-2 font-heading font-bold uppercase">
                  <Check className="w-8 h-8 mx-auto" />
                  <p className="text-base">Thank you for subscribing!</p>
                  <p className="text-xs text-north-black/80">You're now on the exclusive creator insights list.</p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-white/10 border border-gray-600 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-north-lime focus:ring-1 focus:ring-north-lime placeholder:text-gray-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-north bg-north-lime text-north-black hover:bg-white hover:text-north-black text-xs uppercase whitespace-nowrap font-heading font-bold py-3 px-6"
                  >
                    Subscribe Free
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
