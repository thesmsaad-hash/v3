import React from 'react';
import { FaqAccordion } from '../components/FaqAccordion';
import { faqsData } from '../data/siteData';

export const Faqs: React.FC = () => {
  return (
    <div className="space-y-20 md:space-y-32 pb-10">
      
      {/* HERO */}
      <section className="max-w-container mx-auto px-4 sm:px-6 pt-8 md:pt-16">
        <div className="border border-north-black bg-white p-8 md:p-16 space-y-6">
          <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase tracking-widest px-3.5 py-1.5 border border-north-black inline-block">
            HELP CENTER
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight max-w-4xl leading-tight">
            Everything You Need to Know Before Getting Started
          </h1>
          <p className="text-north-gray font-body text-base sm:text-lg max-w-2xl">
            Clear answers to common questions about my project workflow, design process, development stack, and pricing models.
          </p>
        </div>
      </section>

      {/* ACCORDION */}
      <section className="max-w-container mx-auto px-4 sm:px-6">
        <FaqAccordion items={faqsData} className="max-w-4xl mx-auto" />
      </section>

    </div>
  );
};
