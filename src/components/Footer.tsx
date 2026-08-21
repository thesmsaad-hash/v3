import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Github,
  Globe,
  Mail,
  ArrowUp,
  Sparkles,
  Check,
  Copy,
  Youtube,
  Linkedin,
  Instagram,
  ShieldCheck,
  Zap,
  Terminal,
  Bot
} from 'lucide-react';
import { navItems, siteConfig } from '../data/siteData';

export const Footer: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(siteConfig.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-north-black text-white border-t border-north-black mt-20 relative overflow-hidden">
      {/* ── 1. INFINITE LIVE MARQUEE STRIP ── */}
      <div className="border-b border-neutral-800 bg-neutral-950 py-3 overflow-hidden select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 font-heading font-extrabold text-xs uppercase tracking-widest text-neutral-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-north-lime animate-ping"></span>
            <span className="text-white">AVAILABLE FOR FREELANCE & STUDIO WORK</span>
          </span>
          <span className="text-north-lime">✦</span>
          <span>VIDEO EDITING & POST-PRODUCTION</span>
          <span className="text-north-lime">✦</span>
          <span>VFX & MULTI-PASS COMPOSITING</span>
          <span className="text-north-lime">✦</span>
          <span>REACT & NEXT.JS WEB DEVELOPMENT</span>
          <span className="text-north-lime">✦</span>
          <span className="text-white">FREE 4K CREATOR ASSET PACKS</span>
          <span className="text-north-lime">✦</span>
          <span>AI CREATIVE WORKFLOWS</span>
          <span className="text-north-lime">✦</span>
          {/* Duplicate for smooth seamless loop */}
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-north-lime animate-ping"></span>
            <span className="text-white">AVAILABLE FOR FREELANCE & STUDIO WORK</span>
          </span>
          <span className="text-north-lime">✦</span>
          <span>VIDEO EDITING & POST-PRODUCTION</span>
          <span className="text-north-lime">✦</span>
          <span>VFX & MULTI-PASS COMPOSITING</span>
          <span className="text-north-lime">✦</span>
          <span>REACT & NEXT.JS WEB DEVELOPMENT</span>
          <span className="text-north-lime">✦</span>
          <span className="text-white">FREE 4K CREATOR ASSET PACKS</span>
          <span className="text-north-lime">✦</span>
          <span>AI CREATIVE WORKFLOWS</span>
          <span className="text-north-lime">✦</span>
        </div>
      </div>

      {/* ── 2. BIG HERO CTA BANNER ── */}
      <div className="border-b border-neutral-800 py-16 md:py-24 px-6 relative">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 bg-north-lime text-north-black text-xs font-heading font-extrabold uppercase tracking-widest px-3.5 py-1">
                <Sparkles className="w-3.5 h-3.5" /> Let's Collaborate
              </span>
              <span className="text-xs font-mono text-neutral-400 border border-neutral-800 px-2.5 py-1 bg-neutral-900">
                🟢 Live Status: Ready for new projects
              </span>
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight max-w-3xl leading-none text-white">
              Have a Project <span className="text-north-lime">in Mind?</span>
            </h2>
            
            <p className="text-neutral-400 text-sm md:text-base max-w-2xl font-body leading-relaxed">
              Whether you need high-impact video editing, visual effects compositing, custom web development, or creative workflow automation — let's build something exceptional together.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-north-lime text-north-black font-heading font-black uppercase text-sm sm:text-base px-8 py-5 transition-all duration-300 hover:bg-white hover:scale-105 group shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>

            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center border border-neutral-700 bg-neutral-900/80 text-white font-heading font-bold uppercase text-xs sm:text-sm px-6 py-5 hover:border-north-lime hover:text-north-lime transition-all cursor-pointer"
              title="Copy Email Address"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-400" />
                  <span>Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2 opacity-60" />
                  <span>{siteConfig.email}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. FOUR-COLUMN DETAILED FOOTER NAVIGATION ── */}
      <div className="max-w-[1400px] mx-auto py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Brand & Profile Identity (Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-north-lime text-north-black flex items-center justify-center font-heading font-black text-xl">
                S.
              </div>
              <div>
                <span className="font-heading text-lg font-extrabold uppercase tracking-wider block text-white">
                  {siteConfig.name}
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">
                  Video Editor • VFX Artist • Web Developer
                </span>
              </div>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed font-body">
              {siteConfig.introText}
            </p>

            {/* Quick Live Local Clock */}
            <div className="bg-neutral-900 border border-neutral-800 p-3 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">Local Time:</span>
              <span className="text-north-lime font-bold">{currentTime || 'UTC+5:30'}</span>
            </div>
          </div>

          {/* Column 2: Navigation & Exploration Hub (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading font-extrabold uppercase tracking-widest text-north-lime text-xs pb-2 border-b border-neutral-800 flex items-center justify-between">
              <span>Navigation</span>
              <span className="text-[10px] text-neutral-500 font-mono">08 PAGES</span>
            </h4>
            <ul className="grid grid-cols-2 gap-y-2.5 text-xs font-heading font-bold uppercase tracking-wider">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-neutral-300 hover:text-north-lime transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/agent"
                  className="text-north-lime hover:text-white transition-colors inline-flex items-center gap-1 font-extrabold"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Agent Hub</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-neutral-500 hover:text-neutral-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>Admin Hub</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Core Disciplines & Scope (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading font-extrabold uppercase tracking-widest text-north-lime text-xs pb-2 border-b border-neutral-800 flex items-center justify-between">
              <span>Core Services</span>
              <span className="text-[10px] text-neutral-500 font-mono">DELIVERABLES</span>
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-body">
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="text-north-lime">✔</span> YouTube & Short-Form Video Editing
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="text-north-lime">✔</span> Green Screen & VFX Compositing
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="text-north-lime">✔</span> Motion Design & Title Animations
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="text-north-lime">✔</span> React, Next.js & Web Applications
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="text-north-lime">✔</span> DaVinci Resolve Color Grading
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="text-north-lime">✔</span> 100% Free Creator Toolkits & Assets
              </li>
            </ul>
          </div>

          {/* Column 4: Official Connect & Socials (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-heading font-extrabold uppercase tracking-widest text-north-lime text-xs pb-2 border-b border-neutral-800">
              Connect
            </h4>
            <div className="space-y-2 text-xs font-heading font-bold uppercase tracking-wider">
              <a
                href={siteConfig.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-north-lime transition-colors p-2 bg-neutral-900 border border-neutral-800 hover:border-north-lime"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-50" />
              </a>

              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-north-lime transition-colors p-2 bg-neutral-900 border border-neutral-800 hover:border-north-lime"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-50" />
              </a>

              <a
                href={siteConfig.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-north-lime transition-colors p-2 bg-neutral-900 border border-neutral-800 hover:border-north-lime"
              >
                <Youtube className="w-4 h-4" />
                <span>YouTube</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-50" />
              </a>

              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-north-lime transition-colors p-2 bg-neutral-900 border border-neutral-800 hover:border-north-lime"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-50" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ── 4. BOTTOM COPYRIGHT & BACK TO TOP BAR ── */}
      <div className="border-t border-neutral-800 bg-neutral-950 py-6 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div>
            <p>
              © {new Date().getFullYear()} <strong className="text-neutral-300">{siteConfig.name}</strong>. All rights reserved. •{' '}
              <a href={`https://${siteConfig.website}`} className="hover:text-north-lime underline">
                {siteConfig.website}
              </a>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] text-neutral-400">
              Built with React • TypeScript • Vite • Tailwind
            </span>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-north-lime bg-neutral-900 px-3 py-1.5 border border-neutral-800 hover:border-north-lime transition-all cursor-pointer font-heading font-bold text-[11px] uppercase tracking-wider"
              aria-label="Back to Top"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
