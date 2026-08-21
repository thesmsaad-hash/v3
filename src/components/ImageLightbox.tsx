import React from 'react';
import { X } from 'lucide-react';
import { ProjectItem } from '../data/siteData';

interface LightboxProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<LightboxProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 bg-north-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fadeIn">
      <div className="relative max-w-4xl w-full bg-white border border-north-black overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 bg-north-black text-white border-b border-north-black">
          <div>
            <span className="text-north-lime font-heading font-bold text-xs uppercase tracking-widest block">
              {project.category}
            </span>
            <h3 className="font-heading text-xl font-bold uppercase">{project.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white hover:text-north-lime focus:outline-none transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto bg-neutral-900 flex items-center justify-center p-2">
          <img
            src={project.image}
            alt={project.title}
            className="max-h-[65vh] w-auto object-contain mx-auto"
          />
        </div>

        <div className="p-6 bg-north-bg border-t border-north-black flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-north-gray text-sm">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tags.map((t, idx) => (
                <span key={idx} className="bg-north-lime text-north-black font-heading font-bold text-xs px-2.5 py-0.5 border border-north-black">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-north-black text-north-lime font-heading font-bold text-xs uppercase px-6 py-3 border border-north-black hover:bg-north-lime hover:text-north-black transition-colors shrink-0"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
