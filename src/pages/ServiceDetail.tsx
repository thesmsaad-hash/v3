import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle, Film, Wrench } from 'lucide-react';
import { Button } from '../components/Button';
import { servicesData, projectsData, toolsData } from '../data/siteData';

export const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const service = servicesData.find((s) => s.id === id) || servicesData[0];
  const featuredProject = projectsData[0];

  return (
    <div className="space-y-16 md:space-y-24 pb-12 bg-north-bg text-north-black">
      
      {/* HERO */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 md:pt-16">
        <div className="border border-north-black bg-white p-8 md:p-14 space-y-6">
          <div className="flex items-center space-x-3">
            <span className="bg-north-lime text-north-black font-heading font-bold text-xs uppercase tracking-widest px-3.5 py-1.5 border border-north-black">
              SERVICE DETAILS ({service.number})
            </span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight max-w-4xl leading-tight">
            {service.title}
          </h1>
          <p className="text-north-gray font-body text-base sm:text-lg max-w-2xl leading-relaxed">
            {service.description}
          </p>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border border-north-black bg-white p-8 md:p-12">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-north-lime-dark font-heading font-bold text-xs uppercase tracking-widest block">
              SERVICE SCOPE
            </span>
            <h2 className="font-heading text-3xl font-bold uppercase">
              What's Included in {service.title}
            </h2>
            <p className="text-north-gray text-sm leading-relaxed">
              Polished visual execution designed to elevate engagement, production value, and narrative impact.
            </p>
            
            <div className="space-y-3 pt-4 border-t border-north-dark-sand">
              {service.details?.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-sm text-north-black font-medium">
                  <CheckCircle className="w-4 h-4 text-north-lime-dark shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button to="/contact">Start a Project</Button>
            </div>
          </div>

          {/* FEATURED WORK PLACEHOLDER CARD */}
          <div className="lg:col-span-6 border border-north-black bg-north-bg p-6 flex flex-col justify-between space-y-6">
            <div>
              <span className="bg-north-black text-north-lime font-heading font-bold text-xs uppercase px-3 py-1 mb-4 inline-block">
                FEATURED WORK
              </span>
              <h3 className="font-heading text-2xl font-bold uppercase">{featuredProject.title}</h3>
              <div className="flex items-center space-x-6 text-xs text-north-gray mt-2 mb-4">
                <span>Category: <strong>{featuredProject.category}</strong></span>
              </div>
              <img
                src={featuredProject.image}
                alt={featuredProject.title}
                className="w-full h-60 object-cover border border-north-black my-4"
              />
              <p className="text-north-gray text-sm">{featuredProject.description}</p>
            </div>

            <Link to="/works" className="font-heading font-bold text-xs uppercase tracking-wider text-north-black hover:text-north-lime-dark inline-flex items-center">
              <span>EXPLORE PORTFOLIO</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

        </div>
      </section>

      {/* SOFTWARE USED */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="border border-north-black bg-north-black text-white p-8 md:p-12 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-north-lime font-heading font-bold text-xs uppercase tracking-widest block mb-1">
                SOFTWARE STACK
              </span>
              <h2 className="font-heading text-3xl font-bold uppercase">Tools Used For This Service</h2>
            </div>
            <Wrench className="w-8 h-8 text-north-lime hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolsData.slice(0, 3).map((tool, idx) => (
              <div key={idx} className="border border-neutral-800 bg-neutral-900 p-6 space-y-2">
                <h4 className="font-heading font-bold text-base uppercase text-white">{tool.name}</h4>
                <p className="text-xs text-neutral-400">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
