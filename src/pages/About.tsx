import React from 'react';
import { CheckCircle, Code, Compass, Film, GraduationCap, Sparkles, Wrench } from 'lucide-react';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { siteConfig, toolsData, philosophyData, educationData, skillsData, currentlyExploring } from '../data/siteData';

export const About: React.FC = () => {
  return (
    <div className="space-y-20 md:space-y-32 pb-10 bg-north-bg text-north-black">
      <SEO
        title="About SM SAAD — Video Editor, VFX Artist & Web Developer"
        description="Learn about SM SAAD's background as a Video Editor, VFX Compositing Artist, and Web Developer trained at Arena Animation, specializing in visual post-production and digital product development."
        keywords="About SM SAAD, SM SAAD Biography, Video Editing Professional, VFX Artist Arena Animation, Multidisciplinary Creator"
        canonical="https://smsaad.online/about"
      />
      
      {/* 1. HERO */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 md:pt-16">
        <div className="border border-north-black bg-white p-8 md:p-16 space-y-8">
          <div className="inline-flex items-center space-x-2 border border-north-black bg-north-bg px-3.5 py-1.5">
            <span className="w-2.5 h-2.5 bg-north-lime border border-north-black inline-block"></span>
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-north-black">
              ABOUT CREATIVE & TECHNICAL PROFILE
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight max-w-4xl leading-tight">
            A Creative Professional Who Creates & Builds
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 border-t border-north-dark-sand">
            <div className="md:col-span-7 space-y-4 text-north-gray text-base leading-relaxed">
              <p className="text-north-black font-semibold text-lg">
                {siteConfig.aboutText}
              </p>
              <p>
                {siteConfig.introText}
              </p>
            </div>
            
            <div className="md:col-span-5 border-l-0 md:border-l border-north-dark-sand md:pl-8 space-y-4">
              <h4 className="font-heading font-bold text-sm uppercase text-north-black">Multidisciplinary Work Spans:</h4>
              <ul className="space-y-2.5 text-sm text-north-black font-medium">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-north-lime-dark shrink-0" />
                  <span>Video Editing & Post Production</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-north-lime-dark shrink-0" />
                  <span>VFX & Compositing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-north-lime-dark shrink-0" />
                  <span>Motion Graphics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-north-lime-dark shrink-0" />
                  <span>Web Development (React, Next.js, WordPress)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-north-lime-dark shrink-0" />
                  <span>AI-assisted Creative Workflows & Automation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-north-lime-dark shrink-0" />
                  <span>Digital Content Creation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CREATIVE PHILOSOPHY */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="border border-north-black bg-north-black text-white p-8 md:p-12 space-y-8">
          <div className="max-w-2xl">
            <span className="text-north-lime font-heading font-bold text-xs uppercase tracking-widest block mb-2">
              CREATIVE PRINCIPLES
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase">
              Creativity Meets Technology
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {philosophyData.map((item, idx) => (
              <div key={idx} className="border border-neutral-800 bg-neutral-900 p-6 space-y-3">
                <h3 className="font-heading font-bold text-xl uppercase text-white">{item.title}</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CURRENTLY EXPLORING */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="border border-north-black bg-white p-8 md:p-12 space-y-8">
          <div className="flex items-center justify-between border-b border-north-black pb-6">
            <div>
              <span className="text-north-lime-dark font-heading font-bold text-xs uppercase tracking-widest block mb-1">
                CONTINUOUS EXPERIMENTATION
              </span>
              <h2 className="font-heading text-3xl font-bold uppercase">Currently Exploring</h2>
            </div>
            <Compass className="w-8 h-8 text-north-black hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {currentlyExploring.map((item, idx) => (
              <div key={idx} className="border border-north-black p-5 bg-north-bg space-y-2">
                <span className="font-heading font-bold text-xs text-north-lime-dark block">0{idx + 1}</span>
                <h4 className="font-heading font-bold text-sm uppercase text-north-black">{item}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EDUCATION & TRAINING */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="border border-north-black bg-white p-8 md:p-12 space-y-8">
          <div className="flex items-center justify-between border-b border-north-black pb-6">
            <div>
              <span className="text-north-lime-dark font-heading font-bold text-xs uppercase tracking-widest block mb-1">
                EDUCATION & TRAINING
              </span>
              <h2 className="font-heading text-3xl font-bold uppercase">Education & Training</h2>
            </div>
            <GraduationCap className="w-10 h-10 text-north-black hidden sm:block" />
          </div>

          <div className="space-y-6">
            {educationData.map((edu, idx) => (
              <div key={idx} className="border border-north-dark-sand p-6 bg-north-bg space-y-3">
                <h3 className="font-heading font-bold text-2xl uppercase text-north-black">{edu.institution}</h3>
                <div className="inline-block bg-north-lime text-north-black font-heading font-bold text-xs uppercase px-3 py-1 border border-north-black">
                  Focus: {edu.focus}
                </div>
                <p className="text-north-gray text-sm leading-relaxed mt-2">{edu.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SOFTWARE / TOOLS */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="border border-north-black bg-white p-8 md:p-12 space-y-8">
          <div>
            <span className="text-north-lime-dark font-heading font-bold text-xs uppercase tracking-widest block mb-1">
              POST-PRODUCTION & WEB STACK
            </span>
            <h2 className="font-heading text-3xl font-bold uppercase">Tools I Use</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolsData.map((tool, idx) => (
              <div key={idx} className="border border-north-black p-6 space-y-3 bg-north-bg">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-base uppercase text-north-black">{tool.name}</h4>
                  <span className="text-[10px] font-heading font-bold uppercase text-north-black px-2 py-0.5 border border-north-black bg-white">
                    {tool.category}
                  </span>
                </div>
                <p className="text-xs text-north-gray">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
