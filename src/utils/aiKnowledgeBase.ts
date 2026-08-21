import {
  siteConfig,
  servicesData,
  toolsData,
  skillsData,
  philosophyData,
  workflowData,
  currentlyExploring,
  educationData,
  projectsData,
  blogsData,
  faqsData,
  pricingData,
  ServiceItem,
  ProjectItem,
  BlogPost,
  PricingPlan,
  FaqItem,
} from '../data/siteData';
import { getStoredBlogPosts, ExtendedBlogPost } from './blogStorage';
import { getStoredDigitalAssets, DigitalAsset } from './assetStorage';

export interface SiteStatistics {
  totalArticles: number;
  totalServices: number;
  totalProjects: number;
  totalTools: number;
  totalSkills: number;
  totalAssets: number;
  totalFaqs: number;
  totalPricingPlans: number;
  totalAssetDownloads: number;
  skillsByCategory: Record<string, string[]>;
  toolsByCategory: Record<string, string[]>;
  articlesByCategory: Record<string, number>;
  assetsByCategory: Record<string, number>;
}

export interface ComprehensiveSiteKnowledge {
  siteConfig: typeof siteConfig;
  statistics: SiteStatistics;
  articles: ExtendedBlogPost[];
  services: ServiceItem[];
  projects: ProjectItem[];
  tools: typeof toolsData;
  skills: typeof skillsData;
  philosophy: typeof philosophyData;
  workflow: typeof workflowData;
  exploring: string[];
  education: typeof educationData;
  assets: DigitalAsset[];
  faqs: FaqItem[];
  pricing: PricingPlan[];
  searchIndex: Array<{
    type: 'blog' | 'service' | 'project' | 'asset' | 'faq' | 'skill' | 'tool' | 'pricing' | 'profile';
    title: string;
    description: string;
    category?: string;
    path?: string;
    tags?: string[];
    content?: string;
    raw: any;
  }>;
}

/**
 * Compiles dynamic real-time knowledge base snapshot from both static definitions
 * and dynamic localStorage / Supabase stores.
 */
export const getLiveSiteKnowledge = (): ComprehensiveSiteKnowledge => {
  // 1. Fetch real-time articles
  const liveArticles: ExtendedBlogPost[] = getStoredBlogPosts().filter(
    (p) => p.status !== 'draft'
  );

  // Fallback to static blogs if empty
  const articles = liveArticles.length > 0 ? liveArticles : blogsData.map(b => ({
    ...b,
    status: 'published' as const,
    content: b.excerpt
  }));

  // 2. Fetch real-time assets
  const liveAssets: DigitalAsset[] = getStoredDigitalAssets();

  // 3. Compute detailed statistics
  const skillsByCategory: Record<string, string[]> = {};
  skillsData.forEach((s) => {
    if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
    skillsByCategory[s.category].push(s.name);
  });

  const toolsByCategory: Record<string, string[]> = {};
  toolsData.forEach((t) => {
    if (!toolsByCategory[t.category]) toolsByCategory[t.category] = [];
    toolsByCategory[t.category].push(t.name);
  });

  const articlesByCategory: Record<string, number> = {};
  articles.forEach((a) => {
    const cat = a.category || 'General';
    articlesByCategory[cat] = (articlesByCategory[cat] || 0) + 1;
  });

  const assetsByCategory: Record<string, number> = {};
  let totalDownloads = 0;
  liveAssets.forEach((asset) => {
    const cat = asset.category || 'Other';
    assetsByCategory[cat] = (assetsByCategory[cat] || 0) + 1;
    totalDownloads += asset.downloadCount || 0;
  });

  const statistics: SiteStatistics = {
    totalArticles: articles.length,
    totalServices: servicesData.length,
    totalProjects: projectsData.length,
    totalTools: toolsData.length,
    totalSkills: skillsData.length,
    totalAssets: liveAssets.length,
    totalFaqs: faqsData.length,
    totalPricingPlans: pricingData.length,
    totalAssetDownloads: totalDownloads,
    skillsByCategory,
    toolsByCategory,
    articlesByCategory,
    assetsByCategory,
  };

  // 4. Construct high-speed searchable unified index
  const searchIndex: ComprehensiveSiteKnowledge['searchIndex'] = [
    // Profile
    {
      type: 'profile',
      title: `${siteConfig.name} - ${siteConfig.role}`,
      description: `${siteConfig.introText} ${siteConfig.aboutText}`,
      category: 'Profile',
      path: '/about',
      tags: ['bio', 'about', 'sm saad', 'creator', 'video editor', 'vfx', 'developer', 'contact'],
      content: `${siteConfig.heroHeading} ${siteConfig.heroSubhead} Email: ${siteConfig.email} Website: ${siteConfig.website}`,
      raw: siteConfig,
    },
    // Articles & Blogs
    ...articles.map((a) => ({
      type: 'blog' as const,
      title: a.title,
      description: a.excerpt,
      category: a.category,
      path: `/blogs/${a.id}`,
      tags: [a.category.toLowerCase(), 'blog', 'article', 'post', 'read', 'guide', 'tutorial', ...a.title.toLowerCase().split(' ')],
      content: `${a.title}\nCategory: ${a.category}\nRead Time: ${a.readTime}\nAuthor: ${a.author}\nDate: ${a.date}\n\n${a.content || a.excerpt}`,
      raw: a,
    })),
    // Services
    ...servicesData.map((s) => ({
      type: 'service' as const,
      title: `${s.number}. ${s.title}`,
      description: s.description,
      category: 'Services',
      path: `/services/${s.id}`,
      tags: [s.title.toLowerCase(), 'service', 'hire', 'offering', 'freelance', 'work', ...(s.details || []).map(d => d.toLowerCase())],
      content: `${s.title}: ${s.description}. Deliverables: ${(s.details || []).join(', ')}`,
      raw: s,
    })),
    // Projects
    ...projectsData.map((p) => ({
      type: 'project' as const,
      title: p.title,
      description: p.description,
      category: p.category,
      path: '/works',
      tags: [p.title.toLowerCase(), 'project', 'work', 'case study', ...(p.tags || []).map(t => t.toLowerCase()), ...(p.focus || []).map(f => f.toLowerCase())],
      content: `${p.title} (${p.category}) - Client: ${p.client}, Status: ${p.timeline}. Description: ${p.description}. Focus areas: ${(p.focus || []).join(', ')}. Tech: ${(p.tags || []).join(', ')}`,
      raw: p,
    })),
    // Assets
    ...liveAssets.map((asset) => ({
      type: 'asset' as const,
      title: asset.title,
      description: asset.description,
      category: asset.category,
      path: '/assets',
      tags: [asset.title.toLowerCase(), 'asset', 'download', 'free', 'preset', 'overlay', 'template', asset.category.toLowerCase(), asset.fileFormat.toLowerCase(), asset.compatibility.toLowerCase()],
      content: `${asset.title} - Format: ${asset.fileFormat}, Size: ${asset.fileSize}, Compatibility: ${asset.compatibility}, Downloads: ${asset.downloadCount}. Description: ${asset.description}`,
      raw: asset,
    })),
    // FAQs
    ...faqsData.map((f) => ({
      type: 'faq' as const,
      title: f.question,
      description: f.answer,
      category: f.category || 'FAQ',
      path: '/faqs',
      tags: ['faq', 'question', 'answer', (f.category || '').toLowerCase()],
      content: `Q: ${f.question}\nA: ${f.answer}`,
      raw: f,
    })),
    // Pricing
    ...pricingData.map((pr) => ({
      type: 'pricing' as const,
      title: `${pr.name} Plan`,
      description: pr.description,
      category: 'Pricing',
      path: '/pricing',
      tags: ['pricing', 'rate', 'cost', 'quote', 'package', pr.name.toLowerCase()],
      content: `Plan: ${pr.name} (${pr.price} / ${pr.period}) - ${pr.description}. Includes: ${pr.features.join(', ')}`,
      raw: pr,
    })),
  ];

  return {
    siteConfig,
    statistics,
    articles,
    services: servicesData,
    projects: projectsData,
    tools: toolsData,
    skills: skillsData,
    philosophy: philosophyData,
    workflow: workflowData,
    exploring: currentlyExploring,
    education: educationData,
    assets: liveAssets,
    faqs: faqsData,
    pricing: pricingData,
    searchIndex,
  };
};
