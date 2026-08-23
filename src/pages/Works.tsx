import React, { useState } from 'react';
import { ProjectCard } from '../components/ProjectCard';
import { ImageLightbox } from '../components/ImageLightbox';
import { FaqAccordion } from '../components/FaqAccordion';
import { SEO } from '../components/SEO';
import { projectsData, faqsData, ProjectItem } from '../data/siteData';

export const Works: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const categories = ['All', 'Video Editing', 'VFX & Motion', 'Web Application', 'Experimental'];

  const filteredProjects = activeCategory === 'All'
    ? projectsData
    : projectsData.filter((p) =>
        p.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()))
      );

  return (
    <div className="space-y-16 md:space-y-24 pb-12 bg-north-bg text-north-black">
      <SEO
        title="Recent Works & Video Projects — SM SAAD"
        description="Explore recent works by SM SAAD, including video editing, VFX compositing, motion graphics, and web applications like Synapto."
        keywords="SM SAAD Recent Works, Video Editing Showcase, VFX Compositing, Motion Graphics, Synapto Knowledge Management, YouTube video editing, React web applications"
        canonical="https://smsaad.online/works"
        breadcrumbs={[{ name: 'Projects & Works', url: '/works' }]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: 'SM SAAD Recent Works & Projects Portfolio',
          author: {
            '@type': 'Person',
            name: 'SM SAAD',
            url: 'https://smsaad.online',
          },
          description: 'A portfolio showcase of video editing, VFX compositing, motion graphics, and web application projects.',
        }}
      />
      
      {/* HERO */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 md:pt-16">
        <div className="border border-north-black bg-white p-8 md:p-14 space-y-6">
          <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase tracking-widest px-3.5 py-1.5 border border-north-black inline-block">
            RECENT WORKS & SHOWCASE
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight max-w-4xl leading-tight">
            Recent Works & Projects
          </h1>
          <p className="text-north-gray font-body text-base sm:text-lg max-w-2xl">
            A selection of video editing, VFX compositing, and modern digital web applications. Watch directly inline or preview in theater mode.
          </p>
        </div>
      </section>

      {/* PORTFOLIO GRID & CATEGORY FILTER */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-10 pb-4 border-b border-north-black">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-heading font-bold text-xs uppercase tracking-wider px-5 py-3 border border-north-black transition-all ${
                activeCategory === cat
                  ? 'bg-north-black text-north-lime shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-north-black hover:bg-north-lime'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onPreview={(p) => setSelectedProject(p)}
            />
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-north-lime-dark font-heading font-bold text-xs uppercase tracking-widest block mb-2">
            PROJECT INQUIRIES
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase">
            Frequently Asked Questions
          </h2>
        </div>

        <FaqAccordion items={faqsData} className="max-w-4xl mx-auto" />
      </section>

      {/* Lightbox Modal */}
      <ImageLightbox
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

    </div>
  );
};
