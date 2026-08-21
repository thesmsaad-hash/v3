import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FaqItem } from '../data/siteData';

interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ items, className = '' }) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="border border-north-black bg-white transition-colors duration-300"
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
            >
              <span className="font-heading font-bold text-lg md:text-xl uppercase text-north-black group-hover:text-north-lime-dark transition-colors pr-4">
                {item.question}
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-north-lime text-north-black' : 'bg-north-black text-white'}`}>
                {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
            </button>

            {isOpen && (
              <div className="px-6 pb-6 pt-2 border-t border-north-dark-sand">
                <p className="text-north-gray text-base leading-relaxed font-body">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
