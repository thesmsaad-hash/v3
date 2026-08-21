import React from 'react';
import { PricingCard } from '../components/PricingCard';
import { FaqAccordion } from '../components/FaqAccordion';
import { pricingData, faqsData, PricingPlan } from '../data/siteData';

export const Pricing: React.FC = () => {
  return (
    <div className="space-y-20 md:space-y-32 pb-10">
      
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
