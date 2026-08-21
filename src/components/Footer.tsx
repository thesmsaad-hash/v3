import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, Globe, Mail } from 'lucide-react';
import { navItems, siteConfig } from '../data/siteData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-north-black text-white border-t border-north-black mt-20">
      {/* Top Banner CTA */}
      <div className="border-b border-neutral-800 py-16 md:py-24 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <span className="inline-block bg-north-lime text-north-black text-xs font-heading font-bold uppercase tracking-widest px-3 py-1 mb-4">
              Get In Touch
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight max-w-3xl leading-none">
              Have a Project <span className="text-north-lime">in Mind?</span>
            </h2>
            <p className="text-neutral-400 text-sm md:text-base mt-4 max-w-xl">
              Whether you need a video edited, visual effects created, a website built or a creative idea explored, let's talk.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center bg-north-lime text-north-black font-heading font-bold uppercase text-base px-8 py-5 transition-all duration-300 hover:bg-white hover:scale-105 group"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </div>

      {/* Grid Links Section */}
      <div className="max-w-[1400px] mx-auto py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="font-heading text-3xl font-extrabold text-north-lime tracking-tighter">S.</span>
              <span className="font-heading text-xl font-bold uppercase tracking-wider">{siteConfig.name}</span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Video Editor, VFX Compositing Artist & Web Developer creating visual content and digital experiences.
            </p>
            <div className="space-y-2 pt-2 text-xs text-neutral-300">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-north-lime shrink-0" />
                <a href={`https://${siteConfig.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-north-lime font-bold">
                  {siteConfig.website}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Github className="w-4 h-4 text-north-lime shrink-0" />
                <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-north-lime font-bold">
                  github.com/thesmsaad-hash
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-heading font-bold uppercase tracking-widest text-north-lime text-xs mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-neutral-300 hover:text-north-lime text-xs font-heading font-bold uppercase tracking-wider transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Multidisciplinary Focus Column */}
          <div>
            <h4 className="font-heading font-bold uppercase tracking-widest text-north-lime text-xs mb-6">
              Core Disciplines
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li>Video Editing & Storytelling</li>
              <li>VFX & Multi-Pass Compositing</li>
              <li>Motion Graphics & Title Animations</li>
              <li>Web Development (React / Next.js)</li>
              <li>WordPress Custom Websites</li>
              <li>AI Creative Workflows & Automation</li>
              <li>Thumbnail & Social Content</li>
            </ul>
          </div>

          {/* Contact Direct Column */}
          <div>
            <h4 className="font-heading font-bold uppercase tracking-widest text-north-lime text-xs mb-6">
              Official Identity
            </h4>
            <div className="space-y-4 text-xs text-neutral-300">
              <p className="text-neutral-400">
                Official portfolio website for SM SAAD's creative and technical work.
              </p>
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-north-lime" />
                  <a href={`mailto:${siteConfig.email}`} className="hover:text-north-lime transition-colors">
                    {siteConfig.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Github className="w-4 h-4 text-north-lime" />
                  <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-north-lime transition-colors">
                    GitHub Profile
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500 font-body">
        <p>© 2026 {siteConfig.name}. All rights reserved. {siteConfig.website}</p>
      </div>
    </footer>
  );
};
