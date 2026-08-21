import React from 'react';
import { PricingCard } from '../components/PricingCard';
import { FaqAccordion } from '../components/FaqAccordion';
import { SEO } from '../components/SEO';
import { pricingData, faqsData, PricingPlan } from '../data/siteData';

export const Pricing: React.FC = () => {
  return (
    <div className="space-y-20 md:space-y-32 pb-10">
      <SEO
        title="Pricing & Packages — Video Editing, VFX & Web Development"
        description="Transparent rates and custom scopes for Video Editing, VFX Compositing, Motion Graphics, and Web Development services by SM SAAD."
        keywords="video editing rates, hire vfx artist cost, freelance web developer pricing, YouTube editor pricing, motion design quotes, SM SAAD pricing"
        canonical="https://smsaad.online/pricing"
        breadcrumbs={[{ name: 'Pricing & Packages', url: '/pricing' }]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Services & Pricing Plans',
          description: 'Pricing and packages for Video Editing, VFX Compositing, and Web Development by SM SAAD.',
          url: 'https://smsaad.online/pricing',
        }}
      />
      
      {/* HERO */}
      <section className="max-w-container mx-auto px-4 sm:px-6 pt-8 md:pt-16">
        <div className="border border-north-black bg-white p-8 md:p-16 space-y-6">
          <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase tracking-widest px-3.5 py-1.5 border border-north-black inline-block">
            TRANSPARENT RATES
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight max-w-4xl leading-tight">
            Simple, Transparent Pricing for Creative Digital Services
          </h1>
          <p className="text-north-gray font-body text-base sm:text-lg max-w-2xl">
            Choose a plan that fits your creative goals. Straightforward project pricing with zero hidden fees.
          </p>
        </div>
      </section>

      {/* PRICING GRID */}
      <section className="max-w-container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingData.map((plan: PricingPlan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-north-lime-dark font-heading font-bold text-xs uppercase tracking-widest block mb-2">
            PRICING QUESTIONS
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
