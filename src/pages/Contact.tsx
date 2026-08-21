import React from 'react';
import { Github, Globe, Mail, MessageSquare } from 'lucide-react';
import { ContactForm } from '../components/ContactForm';
import { FaqAccordion } from '../components/FaqAccordion';
import { SEO } from '../components/SEO';
import { siteConfig, faqsData } from '../data/siteData';

export const Contact: React.FC = () => {
  return (
    <div className="space-y-16 md:space-y-24 pb-12 bg-north-bg text-north-black">
      <SEO
        title="Contact SM SAAD — Start a Video, VFX or Web Project"
        description="Have a video editing, VFX compositing, or web development project in mind? Contact SM SAAD directly on smsaad.online or send a project inquiry."
        keywords="Contact SM SAAD, Hire Video Editor, Hire VFX Compositing Artist, Hire Web Developer, Start a Video Project"
        canonical="https://smsaad.online/contact"
      />
      
      {/* HERO */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 md:pt-16">
        <div className="border border-north-black bg-white p-8 md:p-14 space-y-6">
          <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase tracking-widest px-3.5 py-1.5 border border-north-black inline-block">
            START A PROJECT
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight max-w-4xl leading-tight">
            Let's Create Something Great.
          </h1>
          <p className="text-north-gray font-body text-base sm:text-lg max-w-2xl">
            Have a project, video idea or creative challenge? Let's talk.
          </p>
        </div>
      </section>

      {/* CONTACT INFO + FORM */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Official Details Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-north-black bg-white p-6 space-y-3">
              <div className="w-10 h-10 bg-north-lime text-north-black rounded-full flex items-center justify-center border border-north-black">
                <Globe className="w-5 h-5" />
              </div>
              <span className="font-heading text-xs uppercase font-bold text-north-gray tracking-wider block">WEBSITE</span>
              <a href={`https://${siteConfig.website}`} target="_blank" rel="noopener noreferrer" className="font-heading text-lg font-bold text-north-black hover:text-north-lime-dark block">
                {siteConfig.website}
              </a>
            </div>

            <div className="border border-north-black bg-white p-6 space-y-3">
              <div className="w-10 h-10 bg-north-lime text-north-black rounded-full flex items-center justify-center border border-north-black">
                <Mail className="w-5 h-5" />
              </div>
              <span className="font-heading text-xs uppercase font-bold text-north-gray tracking-wider block">EMAIL INQUIRIES</span>
              <a href={`mailto:${siteConfig.email}`} className="font-heading text-lg font-bold text-north-black hover:text-north-lime-dark block">
                {siteConfig.email}
              </a>
            </div>

            <div className="border border-north-black bg-white p-6 space-y-3">
              <div className="w-10 h-10 bg-north-lime text-north-black rounded-full flex items-center justify-center border border-north-black">
                <Github className="w-5 h-5" />
              </div>
              <span className="font-heading text-xs uppercase font-bold text-north-gray tracking-wider block">GITHUB REPOSITORIES</span>
              <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer" className="font-heading text-lg font-bold text-north-black hover:text-north-lime-dark block truncate">
                github.com/thesmsaad-hash
              </a>
            </div>

            <div className="border border-north-black bg-north-black text-white p-6 space-y-3">
              <span className="font-heading text-xs uppercase font-bold text-north-lime tracking-wider block">WORKFLOW NOTICE</span>
              <p className="text-neutral-300 text-xs leading-relaxed">
                Direct project inquiries are managed through this form or official email ({siteConfig.email}). All client proposals receive a response within 24 hours.
              </p>
            </div>
          </div>

          {/* Project Inquiry Form Column */}
          <div className="lg:col-span-8">
            <ContactForm />
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-north-lime-dark font-heading font-bold text-xs uppercase tracking-widest block mb-2">
            HAVE QUESTIONS?
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase">
            Frequently Asked Questions
          </h2>
        </div>

        <FaqAccordion items={faqsData} className="max-w-4xl mx-auto" />
      </section>

    </div>
  );
};
