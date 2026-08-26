import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Bookmark,
  Volume2,
  VolumeX,
  AlignLeft,
  List,
  ChevronRight,
  Mail,
  Copy,
  CheckSquare,
  Compass,
  ArrowUp
} from 'lucide-react';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { getStoredBlogPosts, ExtendedBlogPost } from '../utils/blogStorage';
import { speechEngine } from '../utils/speechEngine';
import { addNewsletterSubscriber } from '../utils/subscriberStorage';
import { generatePostSchemaJsonLd } from '../utils/aiBlogWorkflow';

interface TableOfContentItem {
  id: string;
  text: string;
  level: number;
}

export const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<ExtendedBlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<ExtendedBlogPost[]>([]);
  const [prevPost, setPrevPost] = useState<ExtendedBlogPost | null>(null);
  const [nextPost, setNextPost] = useState<ExtendedBlogPost | null>(null);
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [readingTheme, setReadingTheme] = useState<'default' | 'warm' | 'dark'>('default');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(24);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);

  useEffect(() => {
    const allPosts = getStoredBlogPosts();
    const index = allPosts.findIndex((p) => p.id === id);
    if (index >= 0) {
      const current = allPosts[index];
      setPost(current);
      setRelatedPosts(allPosts.filter((p) => p.id !== id && p.status === 'published').slice(0, 3));
      setPrevPost(index > 0 ? allPosts[index - 1] : null);
      setNextPost(index < allPosts.length - 1 ? allPosts[index + 1] : null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      speechEngine.stop();
    };
  }, []);

  // Reading progress and active TOC highlight
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // Detect active heading
      const headings = document.querySelectorAll('h2[id], h3[id]');
      let currentActive = '';
      headings.forEach((h) => {
        const rect = h.getBoundingClientRect();
        if (rect.top <= 160) {
          currentActive = h.id;
        }
      });
      if (currentActive) {
        setActiveHeadingId(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parse Table of Contents from content
  const tableOfContents = useMemo<TableOfContentItem[]>(() => {
    if (!post?.content) return [];
    const lines = post.content.split('\n');
    const items: TableOfContentItem[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ')) {
        const text = trimmed.replace('## ', '');
        const slug = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        items.push({ id: slug, text, level: 2 });
      } else if (trimmed.startsWith('### ')) {
        const text = trimmed.replace('### ', '');
        const slug = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        items.push({ id: slug, text, level: 3 });
      }
    });

    return items;
  }, [post?.content]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLikeToggle = () => {
    if (!liked) {
      setLikeCount((prev) => prev + 1);
      setLiked(true);
    } else {
      setLikeCount((prev) => prev - 1);
      setLiked(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isSpeaking) {
      speechEngine.stop();
      setIsSpeaking(false);
    } else if (post) {
      const fullTextToRead = `${post.title}. ${post.excerpt}. ${post.content || ''}`;
      setIsSpeaking(true);
      speechEngine.speak(fullTextToRead, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: (err) => {
          console.warn('Speech playback error:', err);
          setIsSpeaking(false);
        },
        rate: 1.0,
        pitch: 1.0
      });
    }
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  const handleArticleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    await addNewsletterSubscriber(newsletterEmail, `Article: ${post?.title || 'Blog'}`);
    setNewsletterDone(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterDone(false), 6000);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const yOffset = -100;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center px-4 bg-north-bg text-north-black">
        <h2 className="font-heading text-3xl font-bold uppercase">Article Not Found</h2>
        <p className="text-north-gray text-sm">The article you are looking for does not exist or has been moved.</p>
        <Link to="/blogs" className="btn-north bg-north-black text-north-lime">
          Return to All Articles
        </Link>
      </div>
    );
  }

  // Word count & read time
  const wordCount = (post.content || post.excerpt).split(/\s+/).length;

  // Custom Formatted Content Renderer optimized for Vertical Easy Reading & AI Citations
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let codeLanguage = '';
    let blockIndex = 0;
    let inTable = false;
    let tableRows: string[][] = [];
    let isKeyTakeawaysSection = false;

    const flushTable = (keyIdx: number) => {
      if (tableRows.length > 0) {
        const header = tableRows[0];
        const body = tableRows.slice(1);
        elements.push(
          <div key={`table-${keyIdx}`} className="my-8 overflow-x-auto border-2 border-north-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <table className="w-full text-left border-collapse text-xs sm:text-sm font-body">
              <thead>
                <tr className="bg-north-black text-white font-heading font-extrabold uppercase tracking-wider">
                  {header.map((cell, cIdx) => (
                    <th key={cIdx} className="p-3.5 sm:p-4 border-r border-neutral-800 last:border-r-0">
                      {formatInlineText(cell.trim())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-north-black/20">
                {body.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-north-bg/60'}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3.5 sm:p-4 border-r border-north-black/10 last:border-r-0 font-medium">
                        {formatInlineText(cell.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      const trimmed = line.trim();

      // Check for Markdown Table Rows (| col | col |)
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        // Skip markdown separator line (| --- | --- |)
        if (/^\|[\s\-:]+\|/.test(trimmed) && trimmed.includes('-')) {
          continue;
        }
        const cells = trimmed
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim());
        tableRows.push(cells);
        inTable = true;
        continue;
      } else if (inTable) {
        flushTable(idx);
      }

      // Handle Markdown Code Blocks (```code```)
      if (trimmed.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = trimmed.replace('```', '') || 'code';
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          const codeString = codeBuffer.join('\n');
          const currentCodeIdx = blockIndex++;
          elements.push(
            <div key={`code-${idx}`} className="my-6 border-2 border-north-black bg-neutral-900 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-black border-b border-neutral-800 text-xs font-mono text-gray-400">
                <span className="uppercase text-north-lime font-bold">{codeLanguage}</span>
                <button
                  onClick={() => handleCopyCode(codeString, currentCodeIdx)}
                  className="hover:text-white flex items-center gap-1.5 text-[11px] transition-colors"
                >
                  {copiedCodeIdx === currentCodeIdx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed text-gray-200">
                <code>{codeString}</code>
              </pre>
            </div>
          );
          codeBuffer = [];
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      if (!trimmed) {
        continue;
      }

      // AI Summarization Deep-Links Block
      if (trimmed.toLowerCase().includes('summarize this article with') || trimmed.toLowerCase().includes('summarize this blog post with')) {
        const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://smsaad.online/blogs';
        elements.push(
          <div
            key={idx}
            className="my-6 p-4 sm:p-5 border-2 border-north-black bg-north-bg shadow-[4px_4px_0px_0px_rgba(200,255,0,1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-north-lime-dark" />
              <span className="font-heading font-extrabold text-xs uppercase text-north-black">
                Summarize with AI:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`https://chatgpt.com/?q=Summarize+the+following+article:+${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-white border border-north-black px-2.5 py-1 text-xs font-heading font-bold uppercase hover:bg-north-lime hover:text-black transition-colors"
              >
                ChatGPT
              </a>
              <a
                href={`https://www.perplexity.ai/search?q=Summarize+the+following+article:+${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-white border border-north-black px-2.5 py-1 text-xs font-heading font-bold uppercase hover:bg-north-lime hover:text-black transition-colors"
              >
                Perplexity
              </a>
              <a
                href="https://claude.ai"
                target="_blank"
                rel="noreferrer"
                className="bg-white border border-north-black px-2.5 py-1 text-xs font-heading font-bold uppercase hover:bg-north-lime hover:text-black transition-colors"
              >
                Claude
              </a>
              <a
                href="https://x.com/i/grok"
                target="_blank"
                rel="noreferrer"
                className="bg-white border border-north-black px-2.5 py-1 text-xs font-heading font-bold uppercase hover:bg-north-lime hover:text-black transition-colors"
              >
                Grok
              </a>
            </div>
          </div>
        );
        continue;
      }

      // Screenshot / Visual Suggestion Placeholder
      if (trimmed.startsWith('[Insert image:') || trimmed.startsWith('[Image:')) {
        const parts = trimmed.replace(/^\[(Insert image|Image):\s*/, '').replace(/\]$/, '').split('|');
        const desc = parts[0]?.trim() || 'Visual illustration';
        const alt = parts[1]?.replace(/Alt text:\s*"/, '').replace(/"$/, '').trim() || desc;
        elements.push(
          <div key={idx} className="my-8 p-5 border-2 border-dashed border-north-black bg-north-bg/60 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-heading font-extrabold uppercase text-north-gray">
              <span className="flex items-center gap-1.5 text-north-black">
                <Compass className="w-3.5 h-3.5 text-north-lime-dark" />
                <span>Visual Diagram / Screenshot Placement</span>
              </span>
              <span className="bg-north-lime text-black px-2 py-0.5 border border-north-black font-mono text-[10px]">
                ALT TEXT OPTIMIZED
              </span>
            </div>
            <p className="font-heading font-bold text-sm text-north-black uppercase">{desc}</p>
            <p className="text-xs text-north-gray font-mono italic">Alt: "{alt}"</p>
          </div>
        );
        continue;
      }

      // H1 Header (# Title)
      if (trimmed.startsWith('# ')) {
        const headingText = trimmed.replace('# ', '');
        const slug = headingText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        elements.push(
          <h1
            id={slug}
            key={idx}
            className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase text-north-black mt-10 mb-5 pb-3 border-b-2 border-north-lime inline-block leading-tight"
          >
            {headingText}
          </h1>
        );
        continue;
      }

      // H2 Header (## Section)
      if (trimmed.startsWith('## ')) {
        const headingText = trimmed.replace('## ', '');
        const slug = headingText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        isKeyTakeawaysSection = headingText.toLowerCase().includes('key takeaway');

        if (isKeyTakeawaysSection) {
          elements.push(
            <div key={idx} id={slug} className="mt-8 mb-4 pt-4 border-t-2 border-north-black/20">
              <div className="inline-flex items-center gap-2 bg-north-lime text-black font-heading font-black text-xs uppercase px-3 py-1 border-2 border-north-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>KEY TAKEAWAYS & EXECUTIVE SUMMARY</span>
              </div>
            </div>
          );
        } else {
          elements.push(
            <div key={idx} id={slug} className="pt-8 pb-3 scroll-mt-28">
              <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase text-north-black flex items-center gap-3 border-l-4 border-north-lime pl-4 leading-snug">
                <span>{headingText}</span>
              </h2>
            </div>
          );
        }
        continue;
      }

      // H3 Header (### Subsection)
      if (trimmed.startsWith('### ')) {
        const headingText = trimmed.replace('### ', '');
        const slug = headingText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        elements.push(
          <h3
            id={slug}
            key={idx}
            className="font-heading text-lg sm:text-xl font-bold uppercase text-north-black mt-6 mb-3 scroll-mt-28 flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-north-lime-dark inline-block shrink-0"></span>
            <span>{headingText}</span>
          </h3>
        );
        continue;
      }

      // Blockquote (> Quote)
      if (trimmed.startsWith('> ')) {
        const quoteText = trimmed.replace('> ', '').replace(/^"|"$/g, '');
        elements.push(
          <div
            key={idx}
            className="my-8 p-6 sm:p-8 border-2 border-north-black bg-north-lime/10 border-l-8 border-l-north-lime shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
          >
            <Quote className="w-10 h-10 text-north-lime-dark opacity-30 absolute top-3 right-3" />
            <p className="font-body text-base sm:text-lg italic font-semibold text-north-black leading-relaxed">
              "{quoteText}"
            </p>
          </div>
        );
        continue;
      }

      // Numbered List Items (1. Item)
      if (/^\d+\.\s/.test(trimmed)) {
        const numMatch = trimmed.match(/^(\d+)\.\s/);
        const itemNum = numMatch ? numMatch[1].padStart(2, '0') : '01';
        const itemText = trimmed.replace(/^\d+\.\s/, '');
        elements.push(
          <div key={idx} className="flex items-start space-x-3.5 my-3.5 bg-white p-4 border border-north-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 transition-transform">
            <span className="bg-north-black text-north-lime font-heading font-black text-xs px-2.5 py-1 border border-north-black shrink-0 tracking-wider">
              {itemNum}
            </span>
            <div className="font-body text-north-black font-medium text-sm sm:text-base leading-relaxed pt-0.5">
              {formatInlineText(itemText)}
            </div>
          </div>
        );
        continue;
      }

      // Bulleted List Items (- Item or * Item)
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.replace(/^[-*]\s/, '');
        if (isKeyTakeawaysSection) {
          elements.push(
            <div key={idx} className="flex items-start space-x-3 my-3 bg-north-lime/15 border-2 border-north-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <CheckSquare className="w-5 h-5 text-north-black shrink-0 mt-0.5" />
              <div className="font-body text-north-black text-sm sm:text-base font-semibold leading-relaxed">
                {formatInlineText(itemText)}
              </div>
            </div>
          );
        } else {
          elements.push(
            <div key={idx} className="flex items-start space-x-3 my-2.5 pl-1 sm:pl-3">
              <CheckCircle2 className="w-4 h-4 text-north-lime-dark shrink-0 mt-1" />
              <div className="font-body text-north-black text-sm sm:text-base leading-relaxed">
                {formatInlineText(itemText)}
              </div>
            </div>
          );
        }
        continue;
      }

      // Horizontal Rule (---)
      if (trimmed === '---') {
        elements.push(
          <div key={idx} className="my-10 flex items-center justify-center gap-3">
            <div className="flex-1 border-t-2 border-north-black/20"></div>
            <span className="text-north-lime-dark font-mono text-xs">◆ ◆ ◆</span>
            <div className="flex-1 border-t-2 border-north-black/20"></div>
          </div>
        );
        continue;
      }

      // Disclaimer / Editorial note check
      if (trimmed.startsWith('*Disclaimer:') || trimmed.startsWith('Disclaimer:')) {
        elements.push(
          <div key={idx} className="my-6 p-4 border border-north-black bg-neutral-100 text-xs font-body text-north-gray italic leading-relaxed">
            {trimmed}
          </div>
        );
        continue;
      }

      // Regular Paragraph with high readability
      elements.push(
        <p
          key={idx}
          className="font-body text-north-black text-base sm:text-lg leading-[1.8] tracking-normal my-5"
        >
          {formatInlineText(trimmed)}
        </p>
      );
    }

    if (inTable) {
      flushTable(lines.length);
    }

    return elements;
  };

  // Helper to format bold **text** and internal links in lines
  const formatInlineText = (text: string) => {
    // Handle Internal link placeholders like [Internal link: "anchor text" → target]
    let processed = text.replace(/\[Internal link:\s*"([^"]+)"\s*→\s*([^\]]+)\]/g, '[$1](/blogs)');

    const parts = processed.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-extrabold text-north-black bg-north-lime/25 px-1 border-b-2 border-north-black">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          const anchor = linkMatch[1];
          const href = linkMatch[2];
          return (
            <Link
              key={i}
              to={href.startsWith('http') ? href : href}
              className="text-north-black font-extrabold underline decoration-north-lime decoration-2 underline-offset-2 hover:bg-north-lime hover:no-underline px-0.5 transition-colors"
            >
              {anchor}
            </Link>
          );
        }
      }
      return part;
    });
  };

  // Dynamic JSON-LD Article + FAQ Schema
  const dynamicSchemas = useMemo(() => {
    if (!post) return undefined;
    return generatePostSchemaJsonLd(post).combinedSchemas;
  }, [post]);

  // Theme styling for article container
  const themeBgClass =
    readingTheme === 'warm'
      ? 'bg-[#fcfaf2]'
      : readingTheme === 'dark'
      ? 'bg-[#18181b] text-neutral-100'
      : 'bg-white';

  const themeTextClass = readingTheme === 'dark' ? 'text-neutral-100' : 'text-north-black';

  return (
    <div className="bg-north-bg text-north-black min-h-screen relative pb-24 selection:bg-north-lime selection:text-black">
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={`${post.category}, SM SAAD Article, Video Editing, VFX compositing, ${post.title}`}
        canonical={`https://smsaad.online/blogs/${post.id}`}
        ogImage={post.image?.startsWith('http') ? post.image : `https://smsaad.online${post.image}`}
        ogType="article"
        schema={dynamicSchemas}
      />

      {/* TOP SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-north-dark-sand/60 z-50">
        <div
          className="h-full bg-north-lime transition-all duration-150 ease-out border-r border-north-black"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* HERO HEADER & ARTICLE OVERVIEW */}
      <section className="max-w-[1300px] mx-auto px-4 sm:px-6 pt-6 md:pt-10">
        <div className="border-2 border-north-black bg-white p-6 sm:p-10 md:p-12 space-y-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          
          {/* Top Breadcrumbs & Utility Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-north-dark-sand pb-4">
            <Link
              to="/blogs"
              className="inline-flex items-center text-xs font-heading font-extrabold uppercase text-north-black hover:text-north-lime-dark transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span>Back to All Articles</span>
            </Link>

            <div className="flex items-center space-x-3">
              <span className="bg-north-lime text-north-black font-heading font-extrabold text-xs uppercase px-3 py-1 border border-north-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {post.category}
              </span>
              
              <button
                onClick={handleShare}
                className="bg-north-bg border border-north-black px-3.5 py-1 text-xs font-heading font-bold uppercase hover:bg-north-black hover:text-north-lime transition-all inline-flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Article Title */}
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight max-w-4xl text-north-black">
            {post.title}
          </h1>

          {/* Executive Overview Lead Excerpt Box */}
          <div className="border-l-4 border-north-lime bg-north-bg/80 p-5 border border-north-black/20 shadow-xs">
            <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-north-lime-dark block mb-1">
              EXECUTIVE OVERVIEW
            </span>
            <p className="text-north-black font-body text-base sm:text-xl leading-relaxed italic font-medium">
              "{post.excerpt}"
            </p>
          </div>

          {/* Metadata & Quick Reader Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-north-dark-sand">
            <div className="flex flex-wrap items-center gap-5 text-xs font-heading font-bold uppercase text-north-black">
              <div className="flex items-center space-x-2">
                <img
                  src="/assets/images/hero.jpg"
                  alt="SM SAAD"
                  className="w-7 h-7 rounded-full border border-north-black object-cover"
                />
                <span>By {post.author || 'SM SAAD'}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-north-gray">
                <Calendar className="w-3.5 h-3.5 text-north-lime-dark" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-north-gray">
                <Clock className="w-3.5 h-3.5 text-north-lime-dark" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-north-gray">
                <AlignLeft className="w-3.5 h-3.5 text-north-lime-dark" />
                <span>~{wordCount} words</span>
              </div>
            </div>

            {/* Neural Voice Reader Button */}
            <button
              onClick={handleVoiceToggle}
              className={`btn-north text-xs uppercase px-4 py-2 inline-flex items-center gap-2 border border-north-black transition-all ${
                isSpeaking
                  ? 'bg-north-lime text-north-black font-extrabold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-north-black text-white hover:bg-north-lime hover:text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Pause Voice</span>
                  <span className="flex items-center gap-0.5 ml-1">
                    <span className="w-1 h-3 bg-north-black animate-pulse"></span>
                    <span className="w-1 h-4 bg-north-black animate-pulse" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1 h-2 bg-north-black animate-pulse" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-north-lime" />
                  <span>Listen to Article</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ARTICLE COVER IMAGE */}
      {post.image && (
        <section className="max-w-[1300px] mx-auto px-4 sm:px-6 mt-8">
          <div className="border-2 border-north-black bg-north-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-h-[520px]">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover object-center max-h-[520px]"
            />
          </div>
        </section>
      )}

      {/* MAIN TWO-COLUMN VERTICAL READING LAYOUT */}
      <section className="max-w-[1300px] mx-auto px-4 sm:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* LEFT: MAIN VERTICAL READING CONTENT (Easy-to-Read Column) */}
          {/* ======================================================== */}
          <div className="lg:col-span-8 space-y-6">
            <div className={`border-2 border-north-black p-6 sm:p-10 md:p-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${themeBgClass} ${themeTextClass}`}>
              
              {/* READING COMFORT TOOLBAR */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-north-black/10 pb-4 mb-6 text-xs">
                <div className="flex items-center space-x-2 font-heading font-bold uppercase text-north-gray">
                  <BookOpen className="w-4 h-4 text-north-lime-dark" />
                  <span>Reading Mode</span>
                </div>

                {/* Font Size & Theme Toggles */}
                <div className="flex items-center space-x-3">
                  {/* Theme Switcher */}
                  <div className="flex items-center border border-north-black bg-white p-0.5 text-[10px] font-heading font-bold uppercase">
                    <button
                      onClick={() => setReadingTheme('default')}
                      className={`px-2 py-0.5 ${readingTheme === 'default' ? 'bg-north-black text-north-lime' : 'hover:bg-gray-100'}`}
                      title="Light Mode"
                    >
                      Light
                    </button>
                    <button
                      onClick={() => setReadingTheme('warm')}
                      className={`px-2 py-0.5 ${readingTheme === 'warm' ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-gray-100'}`}
                      title="Warm Paper Mode"
                    >
                      Paper
                    </button>
                  </div>

                  {/* Font Size */}
                  <div className="flex items-center space-x-1 font-heading font-bold text-xs">
                    <span className="text-north-gray mr-1 uppercase text-[10px]">Font:</span>
                    <button
                      onClick={() => setFontSize('sm')}
                      className={`px-2 py-0.5 border border-north-black text-xs ${fontSize === 'sm' ? 'bg-north-black text-north-lime' : 'bg-white text-north-black'}`}
                    >
                      A-
                    </button>
                    <button
                      onClick={() => setFontSize('md')}
                      className={`px-2 py-0.5 border border-north-black text-xs ${fontSize === 'md' ? 'bg-north-black text-north-lime' : 'bg-white text-north-black'}`}
                    >
                      A
                    </button>
                    <button
                      onClick={() => setFontSize('lg')}
                      className={`px-2 py-0.5 border border-north-black text-xs ${fontSize === 'lg' ? 'bg-north-black text-north-lime' : 'bg-white text-north-black'}`}
                    >
                      A+
                    </button>
                  </div>
                </div>
              </div>

              {/* VERTICAL ARTICLE BODY */}
              <article
                className={`prose max-w-none font-body leading-relaxed ${
                  fontSize === 'sm'
                    ? 'text-sm sm:text-base'
                    : fontSize === 'lg'
                    ? 'text-lg sm:text-xl leading-loose'
                    : 'text-base sm:text-lg leading-relaxed'
                }`}
              >
                {renderFormattedContent(post.content || post.excerpt)}
              </article>

              {/* ARTICLE FOOTER ACTIONS (Like / Share / Back to Top) */}
              <div className="pt-8 mt-10 border-t-2 border-north-black/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleLikeToggle}
                    className={`btn-north text-xs font-heading font-bold uppercase px-4 py-2.5 inline-flex items-center gap-2 border border-north-black transition-all ${
                      liked
                        ? 'bg-north-lime text-north-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-north-black hover:bg-north-bg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-north-black text-north-black' : ''}`} />
                    <span>{liked ? `Liked (${likeCount})` : `Helpful Article (${likeCount})`}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleShare}
                    className="btn-north bg-white text-north-black hover:bg-north-bg text-xs font-heading font-bold uppercase px-3.5 py-2.5 border border-north-black inline-flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Link Copied' : 'Share'}</span>
                  </button>

                  <button
                    onClick={scrollToTop}
                    className="btn-north bg-north-black text-white hover:bg-north-lime hover:text-black text-xs font-heading font-bold uppercase px-3 py-2.5 border border-north-black inline-flex items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    title="Back to Top"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* AUTHOR SHOWCASE CARD */}
            <div className="border-2 border-north-black bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center space-x-4">
                <img
                  src="/assets/images/hero.jpg"
                  alt="SM SAAD"
                  className="w-16 h-16 rounded-full border-2 border-north-black object-cover shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-black text-lg uppercase text-north-black">SM SAAD</h4>
                    <span className="bg-north-lime text-black text-[9px] font-heading font-extrabold uppercase px-1.5 py-0.5 border border-north-black">
                      AUTHOR
                    </span>
                  </div>
                  <p className="text-xs text-north-gray font-semibold">
                    Video Editor, VFX Compositing Artist & Web Developer
                  </p>
                  <p className="text-xs text-north-black/80 max-w-md">
                    Creating high-converting video edits, VFX breakdowns, and digital assets. Available for remote projects worldwide.
                  </p>
                </div>
              </div>

              <Link
                to="/contact"
                className="btn-north bg-north-black text-north-lime hover:bg-north-lime hover:text-north-black text-xs font-heading font-extrabold uppercase py-3 px-6 whitespace-nowrap shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                Work With Me →
              </Link>
            </div>

            {/* EMBEDDED ARTICLE NEWSLETTER SIGNUP */}
            <div className="border-2 border-north-black bg-north-black text-white p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(200,255,0,1)] space-y-4">
              <div className="flex items-center space-x-2">
                <span className="bg-north-lime text-black font-heading font-extrabold text-[10px] uppercase px-2.5 py-0.5 border border-white">
                  JOIN CREATOR NEWSLETTER
                </span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase text-white leading-tight">
                Get Weekly Video Editing & VFX Insights
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm max-w-xl">
                Subscribe to get new article breakdowns, free project files, preset overlays, and DaVinci Resolve & Premiere Pro techniques directly in your inbox.
              </p>

              {newsletterDone ? (
                <div className="bg-north-lime text-north-black p-4 font-heading font-bold text-xs uppercase flex items-center gap-2 border border-white">
                  <Check className="w-5 h-5 text-black" />
                  <span>Thank you for subscribing! You will receive future insights.</span>
                </div>
              ) : (
                <form onSubmit={handleArticleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full bg-white/10 border border-gray-600 text-white pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-north-lime"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-north bg-north-lime text-north-black hover:bg-white hover:text-north-black text-xs font-heading font-extrabold uppercase py-3 px-6 whitespace-nowrap"
                  >
                    Subscribe Free
                  </button>
                </form>
              )}
            </div>

            {/* PREVIOUS & NEXT ARTICLE NAVIGATION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {prevPost ? (
                <Link
                  to={`/blogs/${prevPost.id}`}
                  className="border-2 border-north-black bg-white p-5 space-y-2 hover:bg-north-lime/10 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group"
                >
                  <span className="text-[10px] font-heading font-bold uppercase text-north-gray flex items-center gap-1 group-hover:-translate-x-1 transition-transform">
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous Article
                  </span>
                  <h4 className="font-heading font-bold text-sm uppercase line-clamp-2 text-north-black">
                    {prevPost.title}
                  </h4>
                </Link>
              ) : <div />}

              {nextPost && (
                <Link
                  to={`/blogs/${nextPost.id}`}
                  className="border-2 border-north-black bg-white p-5 space-y-2 hover:bg-north-lime/10 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group text-right"
                >
                  <span className="text-[10px] font-heading font-bold uppercase text-north-gray flex items-center justify-end gap-1 group-hover:translate-x-1 transition-transform">
                    Next Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <h4 className="font-heading font-bold text-sm uppercase line-clamp-2 text-north-black">
                    {nextPost.title}
                  </h4>
                </Link>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT: STICKY EDITORIAL SIDEBAR (TOC + Widgets)          */}
          {/* ======================================================== */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* AUDIO PLAYER QUICK WIDGET */}
            <div className="border-2 border-north-black bg-north-black text-white p-5 shadow-[4px_4px_0px_0px_rgba(200,255,0,1)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-north-lime text-black font-heading font-extrabold text-[9px] uppercase px-2 py-0.5 border border-white">
                  AI VOICE NARRATOR
                </span>
                <span className="text-[10px] font-mono text-gray-400">
                  {post.readTime || '5 min'}
                </span>
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs uppercase text-white">
                  Listen to this Article
                </h4>
                <p className="text-[11px] text-gray-300 leading-tight">
                  High-fidelity browser neural voice reading.
                </p>
              </div>
              <button
                onClick={handleVoiceToggle}
                className={`btn-north text-xs uppercase w-full py-2.5 flex items-center justify-center gap-2 border border-white transition-all ${
                  isSpeaking
                    ? 'bg-north-lime text-black font-extrabold shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]'
                    : 'bg-white text-black hover:bg-north-lime hover:text-black font-bold shadow-[2px_2px_0px_0px_rgba(200,255,0,1)]'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Pause Reading</span>
                    <span className="flex items-center gap-0.5 ml-1">
                      <span className="w-1 h-3 bg-black animate-pulse"></span>
                      <span className="w-1 h-4 bg-black animate-pulse" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1 h-2 bg-black animate-pulse" style={{ animationDelay: '300ms' }}></span>
                    </span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-black" />
                    <span>Play Audio Article</span>
                  </>
                )}
              </button>
            </div>

            {/* TABLE OF CONTENTS WIDGET */}
            {tableOfContents.length > 0 && (
              <div className="border-2 border-north-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex items-center justify-between border-b border-north-black pb-3">
                  <div className="flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-north-lime-dark" />
                    <h3 className="font-heading font-extrabold text-xs uppercase text-north-black">
                      On This Page
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-north-gray">
                    {tableOfContents.length} Sections
                  </span>
                </div>

                <nav className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                  {tableOfContents.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToSection(item.id)}
                      className={`text-left w-full text-xs transition-all py-1.5 px-2 rounded block leading-snug cursor-pointer ${
                        activeHeadingId === item.id
                          ? 'bg-north-lime font-heading font-bold text-north-black border border-north-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                          : 'text-north-gray hover:text-north-black hover:bg-north-bg font-body'
                      } ${item.level === 3 ? 'pl-5 text-[11px]' : 'font-medium'}`}
                    >
                      <span className="line-clamp-1">{item.text}</span>
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* FREE ASSETS STORE PROMO */}
            <div className="border-2 border-north-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <span className="bg-north-lime text-black font-heading font-extrabold text-[10px] uppercase px-2.5 py-0.5 border border-north-black">
                FREE CREATOR ASSETS
              </span>
              <h3 className="font-heading text-lg font-black uppercase text-north-black">
                Overlays, LUTs & Project Files
              </h3>
              <p className="text-xs text-north-gray leading-relaxed">
                Download free sound effects, VFX overlays, motion graphic templates, and DaVinci Resolve macros created by SM SAAD.
              </p>
              <Link
                to="/assets"
                className="btn-north bg-north-black text-north-lime hover:bg-north-lime hover:text-black text-xs font-heading font-bold uppercase py-2.5 px-4 w-full text-center block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Browse Free Asset Store →
              </Link>
            </div>

            {/* AI SITE AGENT PROMO */}
            <div className="border-2 border-north-black bg-north-bg p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-north-lime-dark" />
                <span className="font-heading font-bold text-xs uppercase text-north-black">
                  AI Content Analyzer
                </span>
              </div>
              <p className="text-[11px] text-north-gray leading-tight">
                Ask our interactive AI Agent questions about this article or get customized video editing advice.
              </p>
              <Link
                to="/agent"
                className="text-xs font-heading font-extrabold uppercase text-north-black hover:text-north-lime-dark inline-flex items-center gap-1 pt-1"
              >
                <span>Launch AI Agent</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </aside>
        </div>
      </section>

      {/* RECOMMENDED RELATED ARTICLES */}
      {relatedPosts.length > 0 && (
        <section className="max-w-[1300px] mx-auto px-4 sm:px-6 mt-16">
          <div className="border-b-2 border-north-black pb-4 mb-8 flex items-center justify-between">
            <div>
              <span className="font-heading font-bold text-xs uppercase tracking-widest text-north-lime-dark block mb-1">
                MORE FROM SM SAAD
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase">Related Articles</h3>
            </div>

            <Link
              to="/blogs"
              className="font-heading font-bold text-xs uppercase text-north-black hover:text-north-lime-dark flex items-center gap-1"
            >
              <span>View All ({getStoredBlogPosts().length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <div
                key={rel.id}
                className="border-2 border-north-black bg-white p-5 space-y-4 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all group"
              >
                <div className="space-y-3">
                  <div className="aspect-[16/9] border border-north-black overflow-hidden bg-north-bg relative">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 bg-north-lime text-north-black font-heading font-bold text-[10px] uppercase px-2 py-0.5 border border-north-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      {rel.category}
                    </span>
                  </div>
                  <h4 className="font-heading font-extrabold text-base uppercase text-north-black group-hover:text-north-lime-dark transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-north-gray text-xs line-clamp-2 leading-relaxed">{rel.excerpt}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-north-dark-sand text-[11px] text-north-gray">
                  <span className="font-mono">{rel.readTime}</span>
                  <Link
                    to={`/blogs/${rel.id}`}
                    className="font-heading font-bold text-xs uppercase text-north-black hover:text-north-lime-dark inline-flex items-center group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
