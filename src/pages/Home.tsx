import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  CheckCircle,
  Code,
  Compass,
  Film,
  Layers,
  Sparkles,
  Video,
  Wand2,
  ArrowRight,
  Calendar,
  Clock,
  ExternalLink,
  Eye,
  Star,
  Cpu,
  Laptop,
  MessageSquare
} from 'lucide-react';
import { Button } from '../components/Button';
import { ProjectCard } from '../components/ProjectCard';
import { FaqAccordion } from '../components/FaqAccordion';
import { ImageLightbox } from '../components/ImageLightbox';
import { SEO } from '../components/SEO';
import { AnimatedSection } from '../components/AnimatedSection';
import { StaggerContainer, StaggerItem } from '../components/AnimatedStagger';
import { getStoredBlogPosts } from '../utils/blogStorage';
import {
  siteConfig,
  servicesData,
  toolsData,
  skillsData,
  philosophyData,
  workflowData,
  currentlyExploring,
  projectsData,
  faqsData,
  ProjectItem
} from '../data/siteData';

export const Home: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [projectCategory, setProjectCategory] = useState<string>('All');
  const [toolCategory, setToolCategory] = useState<string>('All');

  // Load published blog posts for Home page teaser
  const recentBlogs = useMemo(() => {
    return getStoredBlogPosts().filter((p) => p.status === 'published').slice(0, 3);
  }, []);

  const marqueeItems = [
    "VIDEO EDITING",
    "VFX COMPOSITING",
    "WEB DEVELOPMENT",
    "MOTION GRAPHICS",
    "AI CREATIVE TECH"
  ];

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (projectCategory === 'All') return projectsData;
    return projectsData.filter((p) =>
      p.category.toLowerCase().includes(projectCategory.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(projectCategory.toLowerCase()))
    );
  }, [projectCategory]);

  // Filter tools by category
  const toolCategories = ['All', 'Creative Tools', 'Web Technologies', 'AI & Development'];
  const filteredTools = useMemo(() => {
    if (toolCategory === 'All') return toolsData;
    return toolsData.filter((t) => t.category === toolCategory);
  }, [toolCategory]);

  return (
    <div className="bg-north-bg text-north-black overflow-hidden">
      <SEO
        title="Video Editor, VFX Compositor & Web Developer"
        description="SM SAAD is a multidisciplinary Video Editor, VFX Compositing Artist, and Full-Stack Web Developer delivering narrative post-production, motion graphics, React applications, and free creator toolkits."
        keywords="SM SAAD, Video Editor, VFX Compositor, Motion Graphics Artist, Freelance Web Developer, DaVinci Resolve color grading, Premiere Pro video editing, After Effects VFX, React portfolio, free VFX assets, smsaad.online"
        canonical="https://smsaad.online/"
        breadcrumbs={[]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'SM SAAD — Creative Video & Web Development Studio',
          image: 'https://smsaad.online/assets/images/hero.jpg',
          url: 'https://smsaad.online',
          priceRange: '$$',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'Online / Remote Global',
          },
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '00:00',
            closes: '23:59',
          },
        }}
      />

      {/* 1. ULTRA-PREMIUM HERO SECTION */}
      <section className="border-b border-north-black bg-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto border-x border-north-black">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[680px]">
            
            {/* LEFT COLUMN: Main Heading, Subhead, Badges & Actions */}
            <div className="lg:col-span-6 p-6 sm:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-north-black flex flex-col justify-between space-y-8 bg-white">
              
              <div className="space-y-6">
                {/* Live Availability & Quick Meta Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center space-x-2 border border-north-black bg-north-lime px-3.5 py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <span className="w-2.5 h-2.5 bg-north-black rounded-full animate-ping inline-block"></span>
                    <span className="font-heading font-extrabold text-[11px] uppercase tracking-widest text-north-black">
                      AVAILABLE FOR NEW PROJECTS
                    </span>
                  </div>

                  <span className="bg-north-bg border border-north-black font-heading font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 text-north-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    FAST RESPONSE (&lt; 2 HRS)
                  </span>

                  <span className="bg-north-black text-north-lime font-heading font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 border border-north-black">
                    GLOBAL / REMOTE
                  </span>
                </div>

                {/* Primary Hero Heading */}
                <div className="space-y-3 pt-2">
                  <motion.h1
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-north-black leading-[0.98]"
                  >
                    I CREATE. <br />
                    <span className="bg-north-lime px-2 py-0.5 border border-north-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">I EDIT.</span> <br />
                    I BUILD.
                  </motion.h1>

                  {/* Professional Role Title Badge */}
                  <div className="pt-2">
                    <span className="inline-block bg-north-black text-north-lime font-heading font-extrabold text-xs sm:text-sm uppercase tracking-widest px-4 py-2 border border-north-black shadow-[4px_4px_0px_0px_rgba(200,255,0,1)]">
                      {siteConfig.role}
                    </span>
                  </div>
                </div>

                {/* Description Subhead */}
                <p className="text-north-gray font-body text-base sm:text-lg leading-relaxed max-w-2xl font-medium">
                  {siteConfig.heroSubhead}
                </p>

                {/* Quick Service Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {[
                    { title: "Video Editing", desc: "Short & Long Form" },
                    { title: "VFX & Compositing", desc: "Keying & Cleanups" },
                    { title: "Web Apps", desc: "React & WordPress" },
                    { title: "AI Workflows", desc: "Automations & Tools" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-north-bg border border-north-black p-2.5 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <p className="font-heading font-extrabold text-xs uppercase text-north-black">{item.title}</p>
                      <p className="text-[10px] text-north-gray font-medium">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs & Action Bar */}
              <div className="space-y-6 pt-6 border-t border-north-black mt-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <Button to="/works" className="shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] transition-all">
                    View Portfolio Projects
                  </Button>
                  <Button to="/contact" variant="outline" className="shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                    Get Free Project Quote
                  </Button>
                  <Link to="/assets" className="font-heading font-bold text-xs uppercase text-north-black hover:text-north-lime-dark underline decoration-2 underline-offset-4 ml-2">
                    Free Assets →
                  </Link>
                </div>

                {/* Tagline */}
                <div className="text-xs font-heading font-bold uppercase tracking-widest text-north-black flex items-center space-x-2 pt-2 border-t border-north-dark-sand">
                  <Film className="w-4 h-4 text-north-lime-dark shrink-0" />
                  <span>{siteConfig.tagline}</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SIDE-BY-SIDE VERTICAL PORTRAIT IMAGE & STACKED CARDS */}
            <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-12 bg-north-bg border-t lg:border-t-0 border-north-black">
              
              {/* Left Sub-Column: Vertical Portrait Hero Image */}
              <div className="md:col-span-7 border-b md:border-b-0 md:border-r border-north-black p-4 sm:p-6 bg-white flex flex-col justify-between">
                <div className="relative w-full h-full min-h-[440px] sm:min-h-[480px] border-2 border-north-black overflow-hidden bg-north-black group shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <img
                    src="/assets/images/hero.jpg"
                    alt={siteConfig.name}
                    className="w-full h-full object-cover object-center opacity-95 transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between flex-wrap gap-2 z-10">
                    <span className="bg-north-lime text-north-black font-heading font-extrabold text-[10px] uppercase px-2.5 py-1 border border-north-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      CREATIVE PRO
                    </span>
                    <span className="bg-north-black text-white font-heading font-extrabold text-[10px] uppercase px-2 py-0.5 border border-north-black">
                      smsaad.online
                    </span>
                  </div>

                  {/* Bottom Title Overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-north-black via-north-black/60 to-transparent p-4 sm:p-5 pt-8 z-10">
                    <div className="space-y-1">
                      <span className="bg-north-lime text-north-black font-heading font-bold text-[10px] uppercase px-2 py-0.5 border border-north-black inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        SM SAAD PORTFOLIO
                      </span>
                      <h3 className="font-heading font-extrabold text-base sm:text-lg text-white uppercase leading-tight">
                        Video Editor & VFX Artist
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sub-Column: 3 Stacked Cards Filling the Space */}
              <div className="md:col-span-5 flex flex-col justify-between bg-north-bg">
                
                {/* Card 1: PRIMARY CREATIVE IDENTITY (Lime Green) */}
                <div className="bg-north-lime p-5 border-b border-north-black flex flex-col justify-between flex-1 min-h-[160px] shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-extrabold text-[10px] uppercase tracking-widest text-north-black">
                      CORE SPECIALTY
                    </span>
                    <Video className="w-5 h-5 text-north-black" />
                  </div>
                  <div className="mt-3">
                    <h3 className="font-heading font-black text-lg uppercase text-north-black leading-tight">
                      Video Editing & VFX Compositing
                    </h3>
                    <p className="text-[11px] text-north-black/80 font-medium mt-1">
                      Premiere Pro, After Effects & DaVinci Resolve.
                    </p>
                  </div>
                </div>

                {/* Card 2: SECONDARY TECHNICAL STACK (Black) */}
                <div className="bg-north-black text-white p-5 border-b border-north-black flex flex-col justify-between flex-1 min-h-[190px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-extrabold text-[10px] uppercase tracking-widest text-north-lime block">
                      WEB & AI STACK
                    </span>
                    <Code className="w-4 h-4 text-north-lime" />
                  </div>
                  <ul className="space-y-1.5 text-xs text-neutral-200 font-medium">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-north-lime mr-2 border border-black"></span>React & Next.js
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-north-lime mr-2 border border-black"></span>WordPress & PHP
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-north-lime mr-2 border border-black"></span>AI Workflows
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-north-lime mr-2 border border-black"></span>Digital Content
                    </li>
                  </ul>
                </div>

                {/* Card 3: QUICK METRICS COUNTER */}
                <div className="bg-white p-5 flex flex-col justify-between min-h-[130px]">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-north-black p-2 bg-north-bg text-center">
                      <span className="font-heading font-black text-lg text-north-black">50+</span>
                      <span className="block text-[9px] font-heading font-bold uppercase text-north-gray">Projects</span>
                    </div>
                    <div className="border border-north-black p-2 bg-north-bg text-center">
                      <span className="font-heading font-black text-lg text-north-black">100%</span>
                      <span className="block text-[9px] font-heading font-bold uppercase text-north-gray">Quality</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-north-dark-sand mt-2 flex items-center justify-between text-[11px] font-heading font-bold uppercase text-north-lime-dark">
                    <span>smsaad.online</span>
                    <ArrowRight className="w-3.5 h-3.5 text-north-black" />
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. INFINITE MARQUEE TICKER BANNER */}
      <section className="border-b border-north-black bg-north-black text-white py-6 md:py-7 overflow-hidden shadow-md">
        <div className="flex items-center space-x-16 md:space-x-20 animate-marquee">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="shrink-0 flex items-center space-x-8">
              <span className="font-heading text-lg md:text-2xl font-bold uppercase tracking-widest text-white">
                {item}
              </span>
              <span className="w-3 h-3 bg-north-lime border border-north-black inline-block"></span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ABOUT / INTRO SECTION */}
      <section className="border-b border-north-black py-16 md:py-24 bg-north-bg">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="border border-north-black bg-white p-8 md:p-14 space-y-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="inline-flex items-center space-x-2 border border-north-black bg-north-lime px-3.5 py-1">
              <span className="w-2 h-2 bg-north-black rounded-full inline-block"></span>
              <span className="font-heading font-bold text-[11px] uppercase tracking-wider text-north-black">
                ABOUT SM SAAD
              </span>
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase leading-tight max-w-4xl">
              I'm SM SAAD — a Video Editor, VFX Compositing Artist & Web Developer.
            </h2>

            <p className="text-north-gray font-body text-base md:text-xl leading-relaxed max-w-3xl border-l-4 border-north-lime pl-4">
              {siteConfig.introText}
            </p>

            <div>
              <p className="text-north-black font-medium text-base max-w-3xl leading-relaxed">
                {siteConfig.aboutText}
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Button to="/about" className="shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                Explore Full Profile
              </Button>
              <Button to="/resume" variant="outline" className="shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                View Skills & Background
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION ("What I Do") */}
      <section className="border-b border-north-black py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-north-black pb-6">
            <div className="space-y-2">
              <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase tracking-widest px-3 py-1 border border-north-black inline-block">
                WHAT I DO
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
                Creative, Visual & Digital Solutions
              </h2>
              <p className="text-north-gray text-base max-w-xl">
                End-to-end post-production, compositing, motion graphics, and web application solutions.
              </p>
            </div>
            <Link
              to="/services"
              className="mt-4 md:mt-0 font-heading font-bold text-xs uppercase tracking-wider text-north-black hover:text-north-lime-dark inline-flex items-center"
            >
              <span>EXPLORE ALL SERVICES</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((service) => (
              <StaggerItem key={service.id} className="h-full">
                <div className="border border-north-black bg-white p-8 space-y-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between h-full group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-north-dark-sand pb-4">
                      <span className="font-heading font-extrabold text-3xl text-north-black">
                        {service.number}
                      </span>
                      <span className="bg-north-lime p-2 border border-north-black text-north-black">
                        <Film className="w-5 h-5" />
                      </span>
                    </div>
                    <h3 className="font-heading text-2xl font-bold uppercase text-north-black group-hover:text-north-lime-dark transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-north-gray text-sm leading-relaxed">{service.description}</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-north-dark-sand mt-4">
                    {service.details?.slice(0, 4).map((detail, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-north-black">
                        <CheckCircle className="w-3.5 h-3.5 text-north-lime-dark shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 5. RECENT PROJECTS & INTERACTIVE SHOWCASE */}
      <section className="border-b border-north-black py-16 md:py-24 bg-north-bg">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-north-black pb-6 gap-4">
            <div className="space-y-2">
              <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase tracking-widest px-3 py-1 border border-north-black inline-block">
                PORTFOLIO & PROJECTS
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
                Featured Work & Creations
              </h2>
              <p className="text-north-gray text-base max-w-xl">
                Explore a selection of recent video edits, VFX compositions, and motion design projects.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {['All', 'Video Editing', 'VFX & Motion'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setProjectCategory(cat)}
                  className={`font-heading font-bold text-xs uppercase px-3.5 py-1.5 border border-north-black transition-all ${
                    projectCategory === cat
                      ? 'bg-north-black text-north-lime shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-north-black hover:bg-north-bg'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* PROJECT CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPreview={(proj: ProjectItem) => setSelectedProject(proj)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. SOFTWARE & TOOLS WITH TAB SELECTOR */}
      <section className="border-b border-north-black py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-north-black pb-6 gap-4">
            <div className="space-y-2">
              <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase tracking-widest px-3 py-1 border border-north-black inline-block">
                SOFTWARE & TECHNOLOGIES
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase">Tools & Tech Stack</h2>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {toolCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setToolCategory(cat)}
                  className={`font-heading font-bold text-xs uppercase px-3.5 py-1.5 border border-north-black transition-all ${
                    toolCategory === cat
                      ? 'bg-north-black text-north-lime shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-north-bg text-north-black hover:bg-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, idx) => (
              <StaggerItem key={idx}>
                <div className="border border-north-black bg-white p-6 space-y-3 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="bg-north-bg text-north-black font-heading font-bold text-[10px] uppercase px-2 py-0.5 border border-north-black inline-block">
                      {tool.category}
                    </span>
                    <h4 className="font-heading font-extrabold text-xl uppercase text-north-black">{tool.name}</h4>
                    <p className="text-north-gray text-xs leading-relaxed">{tool.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 7. LATEST BLOG ARTICLES TEASER SECTION */}
      {recentBlogs.length > 0 && (
        <section className="border-b border-north-black py-16 md:py-24 bg-north-bg">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-north-black pb-6">
              <div className="space-y-2">
                <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase tracking-widest px-3 py-1 border border-north-black inline-block">
                  CREATOR INSIGHTS
                </span>
                <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase">
                  Latest Articles & Tips
                </h2>
                <p className="text-north-gray text-base max-w-xl">
                  Read post-production, VFX, motion graphics, and AI creative workflow insights.
                </p>
              </div>

              <Link
                to="/blogs"
                className="mt-4 md:mt-0 font-heading font-bold text-xs uppercase tracking-wider text-north-black hover:text-north-lime-dark inline-flex items-center"
              >
                <span>VIEW ALL ARTICLES</span>
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="border border-north-black bg-white flex flex-col justify-between group overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="space-y-4">
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 border-b border-north-black">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 bg-north-lime text-north-black font-heading font-bold text-[11px] uppercase px-2.5 py-1 border border-north-black">
                        {blog.category}
                      </span>
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

                      <h3 className="font-heading text-xl font-bold uppercase text-north-black group-hover:text-north-lime-dark transition-colors line-clamp-2">
                        {blog.title}
                      </h3>

                      <p className="text-north-gray text-sm line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-north-dark-sand mt-4">
                    <Link
                      to={`/blogs/${blog.id}`}
                      className="font-heading font-bold text-xs uppercase tracking-wider text-north-black hover:text-north-lime-dark inline-flex items-center group-hover:translate-x-1 transition-transform"
                    >
                      <span>READ ARTICLE</span>
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. CREATIVE PHILOSOPHY */}
      <section className="border-b border-north-black py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="border border-north-black bg-white p-8 md:p-12 space-y-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase tracking-widest px-3 py-1 border border-north-black inline-block mb-2">
                CREATIVE PRINCIPLES
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase">
                Creativity Meets Technology
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {philosophyData.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-north-black p-6 bg-north-bg space-y-3 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <h3 className="font-heading font-bold text-xl uppercase text-north-black">{item.title}</h3>
                  <p className="text-north-gray text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. WORKFLOW SECTION */}
      <section className="border-b border-north-black py-16 md:py-24 bg-north-black text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-12">
          <div className="space-y-2">
            <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase tracking-widest px-3 py-1 border border-north-black inline-block">
              PROCESS
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-extrabold uppercase text-white">How I Work</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {workflowData.map((wf) => (
              <div
                key={wf.step}
                className="border border-neutral-800 bg-neutral-900 p-6 space-y-4 hover:border-north-lime transition-all"
              >
                <span className="font-heading font-extrabold text-3xl text-north-lime block">{wf.step}</span>
                <h3 className="font-heading font-bold text-lg uppercase text-white">{wf.title}</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">{wf.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CALL TO ACTION BANNER */}
      <section className="border-b border-north-black py-16 md:py-20 bg-north-lime text-north-black">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="space-y-3">
              <span className="bg-north-black text-north-lime font-heading font-bold text-xs uppercase tracking-widest px-3 py-1 border border-north-black inline-block">
                LET'S BUILD SOMETHING GREAT
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase text-north-black">
                Have a Video or Web Project in Mind?
              </h2>
              <p className="text-north-black/80 font-body text-base max-w-2xl font-medium">
                Whether you need high-impact video editing, VFX compositing, or a modern web application, let's talk.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button to="/contact" className="bg-north-black text-north-lime hover:bg-white hover:text-north-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Get In Touch Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ SECTION */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-16">
          <div className="max-w-3xl mx-auto text-center space-y-2">
            <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase tracking-widest px-3 py-1 border border-north-black inline-block">
              QUESTIONS & ANSWERS
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase">
              Frequently Asked Questions
            </h2>
          </div>

          <FaqAccordion items={faqsData} className="max-w-4xl mx-auto" />
        </div>
      </section>

      {/* Lightbox Modal */}
      <ImageLightbox
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};
