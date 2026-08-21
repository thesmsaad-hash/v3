import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Download, ArrowUpRight, CheckCircle2, Clock, Sparkles, ExternalLink } from 'lucide-react';
import { ExtendedBlogPost } from '../../utils/blogStorage';
import { DigitalAsset } from '../../utils/assetStorage';
import { ServiceItem, ProjectItem, PricingPlan } from '../../data/siteData';

interface ChatCardsProps {
  articles?: ExtendedBlogPost[];
  assets?: DigitalAsset[];
  services?: ServiceItem[];
  projects?: ProjectItem[];
  pricing?: PricingPlan[];
  onSelectPrompt?: (prompt: string) => void;
}

export const ChatCards: React.FC<ChatCardsProps> = ({
  articles,
  assets,
  services,
  projects,
  pricing,
  onSelectPrompt
}) => {
  if (!articles?.length && !assets?.length && !services?.length && !projects?.length && !pricing?.length) {
    return null;
  }

  return (
    <div className="mt-3 space-y-2.5 pt-2 border-t border-north-black/10">
      {/* Blog / Article Cards */}
      {articles && articles.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-wider font-heading font-bold text-north-gray flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-north-black" />
            Referenced Articles ({articles.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {articles.slice(0, 2).map((post) => (
              <div
                key={post.id}
                className="bg-white border border-north-black/20 p-2.5 rounded hover:border-north-black transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-north-gray mb-1">
                    <span className="bg-north-dark-sand/60 px-1.5 py-0.5 rounded text-north-black font-semibold">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-xs text-north-black line-clamp-2 group-hover:text-north-green-dark transition-colors">
                    {post.title}
                  </h4>
                </div>

                <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-north-dark-sand/40">
                  <button
                    type="button"
                    onClick={() => onSelectPrompt?.(`Summarize the article "${post.title}"`)}
                    className="text-[10px] text-north-gray hover:text-north-black font-medium underline cursor-pointer"
                  >
                    Analyze Takeaways
                  </button>
                  <Link
                    to={`/blogs/${post.id}`}
                    className="inline-flex items-center gap-0.5 text-[11px] font-heading font-bold text-north-black bg-north-lime/80 px-2 py-0.5 rounded hover:bg-north-lime transition-colors"
                  >
                    Read <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Free Digital Assets Cards */}
      {assets && assets.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-wider font-heading font-bold text-north-gray flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-north-black" />
            Matching Creative Assets ({assets.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {assets.slice(0, 2).map((asset) => (
              <div
                key={asset.id}
                className="bg-white border border-north-black/20 p-2.5 rounded hover:border-north-black transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-north-gray mb-1">
                    <span className="bg-north-lime/60 px-1.5 py-0.5 rounded text-north-black font-semibold">
                      {asset.category}
                    </span>
                    <span className="text-[10px] font-bold text-north-black">
                      {asset.fileSize}
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-xs text-north-black line-clamp-2">
                    {asset.title}
                  </h4>
                  <p className="text-[11px] text-north-gray line-clamp-1 mt-1 font-body">
                    {asset.compatibility}
                  </p>
                </div>

                <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-north-dark-sand/40">
                  <span className="text-[10px] font-mono text-north-gray">
                    {asset.downloadCount.toLocaleString()} dl
                  </span>
                  <Link
                    to="/assets"
                    className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-white bg-north-black px-2 py-0.5 rounded hover:bg-north-lime hover:text-north-black transition-colors"
                  >
                    Get Free <Download className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Cards */}
      {services && services.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-wider font-heading font-bold text-north-gray flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-north-black" />
            Relevant Services
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {services.slice(0, 2).map((srv) => (
              <div
                key={srv.id}
                className="bg-white border border-north-black/20 p-2.5 rounded hover:border-north-black transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="text-[10px] font-mono font-bold text-north-lime-dark">
                    SERVICE {srv.number}
                  </div>
                  <h4 className="font-heading font-bold text-xs text-north-black mt-0.5">
                    {srv.title}
                  </h4>
                  <p className="text-[11px] text-north-gray line-clamp-2 mt-1">
                    {srv.description}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-north-dark-sand/40 flex justify-end">
                  <Link
                    to={`/services/${srv.id}`}
                    className="text-[11px] font-heading font-bold text-north-black hover:text-north-green-dark inline-flex items-center gap-1"
                  >
                    View Scope <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Cards */}
      {projects && projects.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-wider font-heading font-bold text-north-gray flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-north-black" />
            Case Study Project
          </div>
          {projects.slice(0, 1).map((proj) => (
            <div
              key={proj.id}
              className="bg-white border border-north-black/20 p-3 rounded hover:border-north-black transition-all flex items-center justify-between shadow-sm"
            >
              <div>
                <span className="text-[10px] bg-north-dark-sand px-1.5 py-0.5 rounded font-mono font-semibold text-north-black">
                  {proj.category}
                </span>
                <h4 className="font-heading font-extrabold text-sm text-north-black mt-1">
                  {proj.title}
                </h4>
                <p className="text-xs text-north-gray line-clamp-1 max-w-[280px]">
                  {proj.description}
                </p>
              </div>
              <Link
                to="/works"
                className="btn-north text-xs px-3 py-1.5 shrink-0"
              >
                Explore
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
