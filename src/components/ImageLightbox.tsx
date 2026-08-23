import React from 'react';
import { X, ExternalLink, Play, Sparkles, Instagram, Youtube } from 'lucide-react';
import { ProjectItem } from '../data/siteData';

interface LightboxProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<LightboxProps> = ({ project, onClose }) => {
  if (!project) return null;

  const isYoutube = Boolean(project.youtubeId);
  const isInstagram = Boolean(project.instagramId);
  const isVideo = isYoutube || isInstagram;
  const redirectUrl = project.url || project.videoUrl || (project.youtubeId ? `https://www.youtube.com/watch?v=${project.youtubeId}` : (project.instagramId ? `https://www.instagram.com/reel/${project.instagramId}/` : undefined));

  return (
    <div
      className="fixed inset-0 z-50 bg-north-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`relative ${isInstagram ? 'max-w-2xl' : 'max-w-5xl'} w-full bg-white border-2 border-north-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[94vh]`}>
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-north-black text-white border-b-2 border-north-black shrink-0">
          <div className="flex items-center space-x-3">
            <span className="bg-north-lime text-north-black font-heading font-extrabold text-[11px] uppercase tracking-wider px-2.5 py-1 border border-north-black">
              {project.category}
            </span>
            <h3 className="font-heading text-base sm:text-lg font-bold uppercase truncate max-w-xs sm:max-w-md md:max-w-xl text-white">
              {project.title}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {redirectUrl && (
              <a
                href={redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Open on ${isInstagram ? 'Instagram' : 'YouTube'} (New Tab)`}
                className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-heading font-bold uppercase text-north-lime hover:text-white px-2.5 py-1 border border-north-lime/40 hover:border-north-lime transition-all"
              >
                {isInstagram ? <Instagram className="w-3.5 h-3.5" /> : <Youtube className="w-3.5 h-3.5" />}
                <span>Open Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={onClose}
              aria-label="Close preview"
              className="p-1.5 text-white hover:text-north-lime hover:bg-white/10 transition-colors rounded-sm"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Media Player / Image Area */}
        <div className={`bg-black flex items-center justify-center flex-1 overflow-hidden ${isInstagram ? 'min-h-[380px] sm:min-h-[480px] max-h-[58vh]' : 'min-h-[260px] sm:min-h-[420px] max-h-[65vh]'}`}>
          {isYoutube && project.youtubeId ? (
            <div className="w-full h-full relative aspect-video bg-black flex items-center justify-center">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={project.title}
                className="w-full h-full border-0 absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : isInstagram && project.instagramId ? (
            <div className="w-full h-full max-w-sm mx-auto flex items-center justify-center bg-white p-2">
              <iframe
                src={`https://www.instagram.com/reel/${project.instagramId}/embed/`}
                title={project.title}
                className="w-full h-full border-0 rounded-none min-h-[360px] sm:min-h-[460px]"
                allow="encrypted-media"
                scrolling="no"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="p-4 flex items-center justify-center w-full h-full">
              <img
                src={project.image}
                alt={project.title}
                className="max-h-[58vh] w-auto object-contain mx-auto"
              />
            </div>
          )}
        </div>

        {/* Modal Info Footer */}
        <div className="p-4 sm:p-5 bg-north-bg border-t-2 border-north-black space-y-3 overflow-y-auto shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-3 text-xs text-north-gray font-medium">
                <span>Client: <strong className="text-north-black">{project.client}</strong></span>
                <span>•</span>
                <span>Timeline: <strong className="text-north-black">{project.timeline}</strong></span>
                {isVideo && (
                  <>
                    <span>•</span>
                    <span className={`inline-flex items-center ${isInstagram ? 'text-pink-600' : 'text-red-600'} font-bold`}>
                      <Play className="w-3 h-3 mr-1 fill-current" /> {isInstagram ? 'Instagram Reel' : 'YouTube Video'}
                    </span>
                  </>
                )}
              </div>
              <p className="text-north-black text-sm leading-relaxed max-w-3xl">
                {project.description}
              </p>
              
              {project.focus && project.focus.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-heading font-bold uppercase text-north-gray mr-1">
                    Highlights:
                  </span>
                  {project.focus.map((f, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-north-black text-north-black text-[11px] font-heading font-semibold px-2 py-0.5"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              {redirectUrl && (
                <a
                  href={redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-north-black font-heading font-bold text-xs uppercase px-3.5 py-2 border-2 border-north-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-north-lime hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all inline-flex items-center space-x-1.5"
                >
                  {isInstagram ? <Instagram className="w-3.5 h-3.5 text-pink-600" /> : <Youtube className="w-3.5 h-3.5 text-red-600" />}
                  <span>{isInstagram ? 'Open on Instagram' : 'Watch on YouTube'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <button
                onClick={onClose}
                className="bg-north-black text-north-lime font-heading font-bold text-xs uppercase px-4 py-2 border-2 border-north-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-north-lime hover:text-north-black transition-all"
              >
                Close
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-north-dark-sand">
            {project.tags.map((t, idx) => (
              <span
                key={idx}
                className="bg-white text-north-black font-heading font-semibold text-[11px] px-2.5 py-0.5 border border-north-black"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
