import React, { useState } from 'react';
import { ArrowUpRight, Eye, Play, ExternalLink, X, RotateCcw, Instagram, Youtube } from 'lucide-react';
import { ProjectItem } from '../data/siteData';

interface ProjectCardProps {
  project: ProjectItem;
  onPreview?: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPreview }) => {
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const isYoutube = Boolean(project.youtubeId);
  const isInstagram = Boolean(project.instagramId);
  const isPlayable = isYoutube || isInstagram;
  const redirectUrl = project.url || project.videoUrl || (project.youtubeId ? `https://www.youtube.com/watch?v=${project.youtubeId}` : (project.instagramId ? `https://www.instagram.com/reel/${project.instagramId}/` : undefined));

  return (
    <div className="border border-north-black bg-white group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl relative">
      {/* Media / Thumbnail Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900 border-b border-north-black">
        {isPlayable && isPlayingInline ? (
          <div className="w-full h-full relative bg-black flex items-center justify-center">
            {isYoutube && project.youtubeId && (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={project.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
            {isInstagram && project.instagramId && (
              <iframe
                src={`https://www.instagram.com/reel/${project.instagramId}/embed/`}
                title={project.title}
                className="w-full h-full border-0 bg-white"
                allow="encrypted-media"
                scrolling="no"
                allowFullScreen
              />
            )}
            {/* Inline player close button */}
            <button
              onClick={() => setIsPlayingInline(false)}
              className="absolute top-2 right-2 bg-north-black/90 text-white hover:text-north-lime border border-white/20 px-2 py-1 text-[11px] font-heading font-bold uppercase flex items-center space-x-1 shadow-lg transition-colors z-10"
              title="Close Player"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              <span>Reset</span>
            </button>
          </div>
        ) : (
          <>
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />

            {/* Play Badge Center Overlay (if video or reel) */}
            {isPlayable && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-200">
                <div className="w-14 h-14 rounded-full bg-north-black/85 text-north-lime border-2 border-north-black flex items-center justify-center shadow-lg transform transition-transform duration-300">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </div>
            )}

            {/* Hover Action Overlay */}
            <div className="absolute inset-0 bg-north-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2.5 p-4">
              {isPlayable ? (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlayingInline(true)}
                      className="bg-north-lime text-north-black font-heading font-extrabold text-xs uppercase px-4 py-2.5 flex items-center space-x-1.5 border border-north-black hover:bg-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      title="Play inline in this card"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play Here</span>
                    </button>

                    {onPreview && (
                      <button
                        onClick={() => onPreview(project)}
                        className="bg-white text-north-black font-heading font-bold text-xs uppercase px-3.5 py-2.5 flex items-center space-x-1.5 border border-north-black hover:bg-north-lime transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        title="Open expanded player"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Theater</span>
                      </button>
                    )}
                  </div>

                  {redirectUrl && (
                    <a
                      href={redirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-north-black text-white font-heading font-semibold text-[11px] uppercase tracking-wider px-3 py-1.5 border border-white/30 hover:border-north-lime hover:text-north-lime flex items-center space-x-1.5 transition-all"
                      title={`Open in ${isInstagram ? 'Instagram' : 'YouTube'} (New Tab)`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isInstagram ? <Instagram className="w-3.5 h-3.5 text-pink-400" /> : <Youtube className="w-3.5 h-3.5 text-red-500" />}
                      <span>{isInstagram ? 'Open on Instagram' : 'Watch on YouTube'}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  )}
                </>
              ) : (
                onPreview && (
                  <button
                    onClick={() => onPreview(project)}
                    className="bg-white text-north-black font-heading font-bold text-xs uppercase px-5 py-3 flex items-center space-x-2 border border-north-black hover:bg-north-lime transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview Project</span>
                  </button>
                )
              )}
            </div>

            {/* Category Tag */}
            <span className="absolute top-3 left-3 bg-north-lime text-north-black font-heading font-extrabold text-[10px] sm:text-xs uppercase tracking-wider px-2.5 py-1 border border-north-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {project.category}
            </span>

            {/* Media Label indicator (top right) */}
            {isYoutube && (
              <span className="absolute top-3 right-3 bg-north-black text-white font-heading font-bold text-[10px] uppercase px-2 py-0.5 border border-north-black flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse"></span>
                <span>YOUTUBE</span>
              </span>
            )}
            {isInstagram && (
              <span className="absolute top-3 right-3 bg-north-black text-white font-heading font-bold text-[10px] uppercase px-2 py-0.5 border border-north-black flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 inline-block animate-pulse"></span>
                <span>REEL</span>
              </span>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-north-gray font-medium mb-2">
            <span>Client: <strong className="text-north-black">{project.client}</strong></span>
            <span>Timeline: <strong className="text-north-black">{project.timeline}</strong></span>
          </div>
          <h3
            onClick={() => {
              if (onPreview) onPreview(project);
              else if (isPlayable) setIsPlayingInline(true);
            }}
            className="font-heading text-lg md:text-xl font-bold uppercase text-north-black group-hover:text-north-lime-dark transition-colors line-clamp-2 cursor-pointer"
          >
            {project.title}
          </h3>
          <p className="text-north-gray text-sm mt-2 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tags & Action Row */}
        <div className="pt-4 border-t border-north-dark-sand flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="bg-north-bg text-north-black text-[11px] px-2 py-0.5 border border-north-dark-sand font-medium">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {redirectUrl && (
              <a
                href={redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Open on ${isInstagram ? 'Instagram' : 'YouTube'} (New Tab)`}
                className="w-8 h-8 rounded-none border border-north-black flex items-center justify-center bg-white text-north-black hover:bg-north-lime transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {isInstagram ? <Instagram className="w-3.5 h-3.5" /> : (isYoutube ? <Youtube className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />)}
              </a>
            )}
            <button
              onClick={() => {
                if (isPlayable) {
                  if (onPreview) onPreview(project);
                  else setIsPlayingInline(true);
                } else if (onPreview) {
                  onPreview(project);
                }
              }}
              title={isPlayable ? "Play media" : "View project"}
              className="w-8 h-8 rounded-none border border-north-black flex items-center justify-center bg-north-black text-north-lime group-hover:bg-north-lime group-hover:text-north-black transition-colors"
            >
              {isPlayable ? <Play className="w-3.5 h-3.5 fill-current" /> : <ArrowUpRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
