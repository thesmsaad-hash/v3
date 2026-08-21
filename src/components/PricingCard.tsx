import React from 'react';
import { Check } from 'lucide-react';
import { PricingPlan } from '../data/siteData';
import { Button } from './Button';

interface PricingCardProps {
  plan: PricingPlan;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  return (
    <div className={`border border-north-black p-8 flex flex-col justify-between relative transition-all duration-300 ${
      plan.popular ? 'bg-north-black text-white shadow-2xl scale-105 z-10' : 'bg-white text-north-black'
    }`}>
      {plan.popular && (
        <span className="absolute -top-4 right-8 bg-north-lime text-north-black font-heading font-bold text-xs uppercase tracking-widest px-4 py-1 border border-north-black">
          MOST POPULAR
        </span>
      )}

      <div>
        <div className="border-b border-current pb-6 mb-6">
          <h3 className={`font-heading text-2xl font-bold uppercase ${plan.popular ? 'text-north-lime' : 'text-north-black'}`}>
            {plan.name}
          </h3>
          <p className={`text-xs mt-2 ${plan.popular ? 'text-neutral-400' : 'text-north-gray'}`}>
            {plan.description}
          </p>
          <div className="mt-6 flex items-baseline">
            <span className="font-heading text-4xl md:text-5xl font-bold">{plan.price}</span>
            <span className={`text-xs ml-2 uppercase font-medium ${plan.popular ? 'text-neutral-400' : 'text-north-gray'}`}>
              / {plan.period}
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h4 className={`font-heading text-xs uppercase tracking-wider font-bold ${plan.popular ? 'text-north-lime' : 'text-north-black'}`}>
            What's Included:
          </h4>
          <ul className="space-y-3">
            {plan.features.map((feature: string, idx: number) => (
              <li key={idx} className="flex items-start text-sm">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0 ${
                  plan.popular ? 'bg-north-lime text-north-black' : 'bg-north-black text-north-lime'
                }`}>
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className={plan.popular ? 'text-neutral-200' : 'text-north-gray'}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button
        to="/contact"
        variant={plan.popular ? 'primary' : 'outline'}
        className={`w-full text-center ${plan.popular ? 'bg-north-lime text-north-black hover:bg-white' : ''}`}
      >
        {plan.ctaText}
      </Button>
    </div>
  );
};
