import React from 'react';
import { ArrowUpRight, Eye } from 'lucide-react';
import { ProjectItem } from '../data/siteData';

interface ProjectCardProps {
  project: ProjectItem;
  onPreview?: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPreview }) => {
  return (
    <div className="border border-north-black bg-white group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Image Container with Hover Zoom & Action Overlay */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 border-b border-north-black">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-north-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          {onPreview && (
            <button
              onClick={() => onPreview(project)}
              className="bg-white text-north-black font-heading font-bold text-xs uppercase px-4 py-3 flex items-center space-x-2 border border-north-black hover:bg-north-lime transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
          )}
        </div>
        <span className="absolute top-4 left-4 bg-north-lime text-north-black font-heading font-bold text-xs uppercase tracking-wider px-3 py-1 border border-north-black">
          {project.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-north-gray font-medium mb-2">
            <span>Client: <strong className="text-north-black">{project.client}</strong></span>
            <span>Timeline: <strong className="text-north-black">{project.timeline}</strong></span>
          </div>
          <h3 className="font-heading text-xl md:text-2xl font-bold uppercase text-north-black group-hover:text-north-lime-dark transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-north-gray text-sm mt-2 line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Tags & Action */}
        <div className="pt-4 border-t border-north-dark-sand flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="bg-north-bg text-north-black text-xs px-2.5 py-1 border border-north-dark-sand font-medium">
                #{tag}
              </span>
            ))}
          </div>
          <div className="w-8 h-8 rounded-full border border-north-black flex items-center justify-center bg-north-black text-north-lime group-hover:bg-north-lime group-hover:text-north-black transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
