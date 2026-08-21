import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Tag,
  User,
  Sparkles,
  Check,
  BookOpen,
  ArrowRight,
  Quote,
  CheckCircle2,
  Type,
  ListOrdered,
  ThumbsUp,
  Bookmark
} from 'lucide-react';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { getStoredBlogPosts, ExtendedBlogPost } from '../utils/blogStorage';

export const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<ExtendedBlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<ExtendedBlogPost[]>([]);
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const allPosts = getStoredBlogPosts();
    const found = allPosts.find((p) => p.id === id);
    if (found) {
      setPost(found);
      setRelatedPosts(allPosts.filter((p) => p.id !== id && p.status === 'published').slice(0, 3));
    }
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center px-4 bg-north-bg text-north-black">
        <h2 className="font-heading text-3xl font-bold uppercase">Article Not Found</h2>
        <p className="text-north-gray text-sm">The article you are looking for does not exist or has been moved.</p>
        <Link to="/blogs" className="btn-north bg-north-black text-north-lime">
          Return to All Blogs
        </Link>
      </div>
    );
  }

  // Custom Markdown Content Renderer
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return;
      }

      // H1 Header (# Title)
      if (trimmed.startsWith('# ')) {
        const headingText = trimmed.replace('# ', '');
        elements.push(
          <h1
            key={idx}
            className="font-heading text-2xl sm:text-4xl font-extrabold uppercase text-north-black mt-8 mb-4 pb-2 border-b-2 border-north-lime inline-block"
          >
            {headingText}
          </h1>
        );
      }
      // H2 Header (## Section)
      else if (trimmed.startsWith('## ')) {
        const headingText = trimmed.replace('## ', '');
        elements.push(
          <h2
            key={idx}
            className="font-heading text-xl sm:text-2xl font-bold uppercase text-north-black mt-8 mb-4 flex items-center gap-2 border-l-4 border-north-lime pl-3"
          >
            {headingText}
          </h2>
        );
      }
      // H3 Header (### Subsection)
      else if (trimmed.startsWith('### ')) {
        const headingText = trimmed.replace('### ', '');
        elements.push(
          <h3 key={idx} className="font-heading text-lg font-bold uppercase text-north-black mt-6 mb-3">
            {headingText}
          </h3>
        );
      }
      // Blockquote (> Quote)
      else if (trimmed.startsWith('> ')) {
        const quoteText = trimmed.replace('> ', '').replace(/^"|"$/g, '');
        elements.push(
          <div
            key={idx}
            className="my-6 p-6 border-2 border-north-black bg-north-bg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
          >
            <Quote className="w-8 h-8 text-north-lime-dark opacity-30 absolute top-3 right-3" />
            <p className="font-body text-base sm:text-lg italic font-medium text-north-black leading-relaxed">
              "{quoteText}"
            </p>
          </div>
        );
      }
      // Numbered List Items (1. Item)
      else if (/^\d+\.\s/.test(trimmed)) {
        const itemText = trimmed.replace(/^\d+\.\s/, '');
        elements.push(
          <div key={idx} className="flex items-start space-x-3 my-2 bg-white p-3 border border-north-black">
            <span className="bg-north-lime text-north-black font-heading font-bold text-xs px-2 py-0.5 border border-north-black shrink-0">
              ✓
            </span>
            <div className="font-body text-north-black font-medium leading-relaxed">
              {formatInlineText(itemText)}
            </div>
          </div>
        );
      }
      // Bulleted List Items (- Item or * Item)
      else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.replace(/^[-*]\s/, '');
        elements.push(
          <div key={idx} className="flex items-start space-x-3 my-2 pl-2">
            <CheckCircle2 className="w-4 h-4 text-north-lime-dark shrink-0 mt-1" />
            <div className="font-body text-north-black leading-relaxed">
              {formatInlineText(itemText)}
            </div>
          </div>
        );
      }
      // Horizontal Rule (---)
      else if (trimmed === '---') {
        elements.push(<hr key={idx} className="my-8 border-t-2 border-north-black" />);
      }
      // Regular Paragraph
      else {
        elements.push(
          <p key={idx} className="font-body leading-relaxed text-north-black my-4">
            {formatInlineText(trimmed)}
          </p>
        );
      }
    });

    return elements;
  };

  // Helper to format bold **text** in lines
  const formatInlineText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-north-black bg-north-lime/30 px-1 border-b border-north-black">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author || 'SM SAAD',
      url: 'https://smsaad.online'
    },
    publisher: {
      '@type': 'Person',
      name: 'SM SAAD',
      url: 'https://smsaad.online'
    },
    datePublished: post.date,
    image: `https://smsaad.online${post.image}`
  };

  // Font size classes
  const fontSizeClass =
    fontSize === 'sm' ? 'text-sm md:text-base' : fontSize === 'lg' ? 'text-lg md:text-xl' : 'text-base md:text-lg';

  return (
    <div className="bg-north-bg text-north-black min-h-screen relative pb-24">
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={`${post.category}, SM SAAD Article, ${post.title}`}
        canonical={`https://smsaad.online/blogs/${post.id}`}
        ogImage={`https://smsaad.online${post.image}`}
        ogType="article"
        schema={blogSchema}
      />

      {/* READING PROGRESS BAR AT TOP */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-north-dark-sand z-50">
        <div
          className="h-full bg-north-lime-dark transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* HEADER HERO BANNER */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 md:pt-12">
        <div className="border border-north-black bg-white p-6 sm:p-10 md:p-14 space-y-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          {/* Top Breadcrumb & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-north-dark-sand pb-4">
            <Link
              to="/blogs"
              className="inline-flex items-center text-xs font-heading font-bold uppercase text-north-black hover:text-north-lime-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to All Articles</span>
            </Link>

            <div className="flex items-center space-x-3">
              <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase px-3 py-1 border border-north-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {post.category}
              </span>
              <button
                onClick={handleShare}
                className="bg-north-bg border border-north-black px-3 py-1 text-xs font-heading font-bold uppercase hover:bg-north-black hover:text-north-lime transition-all inline-flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight max-w-4xl leading-tight">
            {post.title}
          </h1>

          {/* Subheading / Excerpt */}
          <p className="text-north-gray font-body text-base sm:text-xl leading-relaxed max-w-3xl border-l-4 border-north-lime pl-4 italic">
            "{post.excerpt}"
          </p>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-heading font-bold uppercase text-north-black pt-4 border-t border-north-dark-sand">
            <div className="flex items-center space-x-2">
              <img
                src="/assets/images/hero.jpg"
                alt="SM SAAD"
                className="w-7 h-7 rounded-full border border-north-black object-cover"
              />
              <span>By {post.author || 'SM SAAD'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-north-lime-dark" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-north-lime-dark" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE COVER IMAGE */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-8">
        <div className="border border-north-black bg-north-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto max-h-[520px] object-cover"
          />
        </div>
      </section>

      {/* ARTICLE CONTENT BODY WITH ENHANCED TYPOGRAPHY */}
      <section className="max-w-[1000px] mx-auto px-4 sm:px-6 mt-8">
        <div className="border border-north-black bg-white p-6 sm:p-10 md:p-14 space-y-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          
          {/* READING CONTROLS TOOLBAR */}
          <div className="flex items-center justify-between border-b border-north-dark-sand pb-4 bg-north-bg p-4 border border-north-black">
            <div className="flex items-center space-x-2 text-xs font-heading font-bold uppercase">
              <BookOpen className="w-4 h-4 text-north-lime-dark" />
              <span>ARTICLE READING CONTROLS</span>
            </div>

            {/* Font Size Adjuster Buttons */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-heading font-bold uppercase text-north-gray mr-1">Font Size:</span>
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 text-xs font-bold border border-north-black transition-colors ${
                  fontSize === 'sm' ? 'bg-north-black text-north-lime' : 'bg-white text-north-black'
                }`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('md')}
                className={`px-2 py-0.5 text-xs font-bold border border-north-black transition-colors ${
                  fontSize === 'md' ? 'bg-north-black text-north-lime' : 'bg-white text-north-black'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 text-xs font-bold border border-north-black transition-colors ${
                  fontSize === 'lg' ? 'bg-north-black text-north-lime' : 'bg-white text-north-black'
                }`}
              >
                A+
              </button>
            </div>
          </div>

          {/* Formatted Article Body */}
          <article className={`space-y-4 ${fontSizeClass}`}>
            {renderFormattedContent(post.content || post.excerpt)}
          </article>

          {/* READER FEEDBACK & QUICK SHARE */}
          <div className="pt-8 border-t border-north-black flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setLiked(!liked)}
                className={`btn-north text-xs inline-flex items-center transition-all ${
                  liked
                    ? 'bg-north-lime text-north-black border-north-black'
                    : 'bg-white text-north-black border-north-black hover:bg-north-bg'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 mr-1.5 ${liked ? 'fill-north-black' : ''}`} />
                <span>{liked ? 'Article Helpful!' : 'Was this helpful?'}</span>
              </button>
            </div>

            <button
              onClick={handleShare}
              className="btn-north bg-north-black text-north-lime hover:bg-north-lime hover:text-north-black text-xs inline-flex items-center w-fit"
            >
              {copied ? <Check className="w-4 h-4 mr-2 text-green-400" /> : <Share2 className="w-4 h-4 mr-2" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Share Article'}</span>
            </button>
          </div>

          {/* AUTHOR PROFILE CARD */}
          <div className="border border-north-black bg-north-bg p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center space-x-4">
              <img
                src="/assets/images/hero.jpg"
                alt="SM SAAD"
                className="w-16 h-16 rounded-full border-2 border-north-black object-cover shrink-0"
              />
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-lg uppercase text-north-black">SM SAAD</h4>
                <p className="text-xs text-north-gray font-medium">
                  Video Editor, VFX Compositing Artist & Web Developer
                </p>
                <p className="text-xs text-north-gray">
                  Creating visual content, VFX motion graphics, and web applications.
                </p>
              </div>
            </div>

            <Button to="/contact">Work With Me</Button>
          </div>
        </div>
      </section>

      {/* RELATED ARTICLES */}
      {relatedPosts.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-16">
          <div className="border-b border-north-black pb-4 mb-8 flex items-center justify-between">
            <div>
              <span className="font-heading font-bold text-xs uppercase tracking-widest text-north-lime-dark block mb-1">
                RECOMMENDED READS
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase">Related Articles</h3>
            </div>

            <Link
              to="/blogs"
              className="font-heading font-bold text-xs uppercase text-north-black hover:text-north-lime-dark flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <div
                key={rel.id}
                className="border border-north-black bg-white p-6 space-y-4 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group"
              >
                <div className="space-y-3">
                  <div className="aspect-[16/9] border border-north-black overflow-hidden bg-north-bg relative">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 bg-north-lime text-north-black font-heading font-bold text-[10px] uppercase px-2 py-0.5 border border-north-black">
                      {rel.category}
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-base uppercase text-north-black group-hover:text-north-lime-dark transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-north-gray text-xs line-clamp-2">{rel.excerpt}</p>
                </div>

                <Link
                  to={`/blogs/${rel.id}`}
                  className="font-heading font-bold text-xs uppercase text-north-black hover:text-north-lime-dark inline-flex items-center group-hover:translate-x-1 transition-transform pt-2 border-t border-north-dark-sand"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
