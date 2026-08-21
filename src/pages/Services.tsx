import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Film, Wand2, ShieldCheck, Zap } from 'lucide-react';
import { SEO } from '../components/SEO';
import { servicesData } from '../data/siteData';

export const Services: React.FC = () => {
  return (
    <div className="space-y-16 md:space-y-24 pb-12 bg-north-bg text-north-black">
      <SEO
        title="Services — Video Editing, VFX Compositing & Web Development"
        description="Professional post-production and digital services by SM SAAD: Video Editing, VFX & Compositing, Motion Graphics, Web Development, AI Workflows, Social Content, and Thumbnail Design."
        keywords="SM SAAD Services, Video Editing Services, VFX Compositing Services, Motion Graphics Services, Web Development Services, React Developer Services, WordPress Development"
        canonical="https://smsaad.online/services"
        breadcrumbs={[{ name: 'Services', url: '/services' }]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Professional Services by SM SAAD',
          itemListElement: servicesData.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'Service',
              name: s.title,
              description: s.description,
              url: `https://smsaad.online/services/${s.id}`,
            },
          })),
        }}
      />
      
      {/* HERO */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 md:pt-16">
        <div className="border border-north-black bg-white p-8 md:p-14 space-y-6">
          <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase tracking-widest px-3.5 py-1.5 border border-north-black inline-block">
            CREATIVE SERVICES
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight max-w-4xl leading-tight">
            What I Do
          </h1>
          <p className="text-north-gray font-body text-base sm:text-lg max-w-2xl">
            Creative post-production and content solutions built for modern brands and creators.
          </p>
        </div>
      </section>

      {/* SERVICES LIST (ALL 7 SERVICES) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="space-y-8">
          {servicesData.map((service) => (
            <div
              key={service.id}
              id={service.id}
              className="border border-north-black bg-white p-8 md:p-12 transition-all duration-300 hover:shadow-xl group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="font-heading font-bold text-4xl text-north-black group-hover:text-north-lime-dark transition-colors">
                      {service.number}
                    </span>
                    <Film className="w-8 h-8 text-north-black" />
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase">{service.title}</h2>
                </div>

                <div className="lg:col-span-8 space-y-6">
                  <p className="text-north-gray text-base leading-relaxed">{service.description}</p>
                  
                  {service.details && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-north-dark-sand">
                      {service.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm text-north-black">
                          <CheckCircle2 className="w-4 h-4 text-north-lime-dark shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4">
                    <Link
                      to={`/services/${service.id}`}
                      className="inline-flex items-center font-heading font-bold text-xs uppercase tracking-wider text-north-black hover:text-north-lime-dark group"
                    >
                      <span>VIEW SERVICE DETAILS</span>
                      <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY WORK WITH ME */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="border border-north-black bg-north-black text-white p-8 md:p-12 space-y-10">
          <div className="max-w-2xl">
            <span className="text-north-lime font-heading font-bold text-xs uppercase tracking-widest block mb-2">
              WHY WORK WITH ME
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase">
              Creative Post-Production Value
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-neutral-800 bg-neutral-900 p-6 space-y-3">
              <h3 className="font-heading text-lg font-bold uppercase text-white">Creative Thinking</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                I focus on visual storytelling rather than simply assembling footage clips.
              </p>
            </div>

            <div className="border border-neutral-800 bg-neutral-900 p-6 space-y-3">
              <h3 className="font-heading text-lg font-bold uppercase text-white">Post-Production Focus</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Editing, compositing, motion and finishing are treated as one complete creative process.
              </p>
            </div>

            <div className="border border-neutral-800 bg-neutral-900 p-6 space-y-3">
              <h3 className="font-heading text-lg font-bold uppercase text-white">Modern Workflow</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                I use current creative software and AI-assisted tools where they genuinely improve the workflow.
              </p>
            </div>

            <div className="border border-neutral-800 bg-neutral-900 p-6 space-y-3">
              <h3 className="font-heading text-lg font-bold uppercase text-white">Content-Minded</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                I understand that modern videos need to work across platforms and capture attention quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
