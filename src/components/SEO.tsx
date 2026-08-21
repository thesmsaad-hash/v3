import React, { useEffect } from 'react';
import { siteConfig } from '../data/siteData';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  breadcrumbs?: BreadcrumbItem[];
  schema?: object | object[];
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = 'https://smsaad.online/assets/images/hero.jpg',
  ogType = 'website',
  breadcrumbs,
  schema,
}) => {
  const defaultTitle = `${siteConfig.name} — Video Editor, VFX Compositor & Web Developer`;
  const pageTitle = title ? `${title} | ${siteConfig.name}` : defaultTitle;

  const defaultDescription = `${siteConfig.name} is a professional Video Editor, VFX Compositing Artist, and Modern Web Developer. Providing high-impact post-production, motion graphics, React/Next.js development, and 100% free downloadable creator assets at smsaad.online.`;
  const pageDescription = description || defaultDescription;

  const defaultKeywords =
    'SM SAAD, SM SAAD portfolio, Video Editor for hire, VFX Compositor, VFX Compositing, DaVinci Resolve colorist, Premiere Pro video editor, After Effects motion graphics, React developer, Next.js portfolio, freelance video editor, free VFX overlays download, free film grain 4K, video editing presets, creator digital assets, smsaad.online';
  const pageKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const currentCanonical = canonical || `https://smsaad.online${pathname}`;

  useEffect(() => {
    // 1. Update Title
    document.title = pageTitle;

    // Meta tag updater
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. High-Rank Standard SEO Meta Tags
    updateMeta('description', pageDescription);
    updateMeta('keywords', pageKeywords);
    updateMeta('author', `${siteConfig.name} — ${siteConfig.website}`);
    updateMeta('publisher', 'https://smsaad.online');
    updateMeta(
      'robots',
      'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    );
    updateMeta('googlebot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMeta('bingbot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMeta('rating', 'General');
    updateMeta('distribution', 'Global');
    updateMeta('revisit-after', '3 days');

    // 3. Open Graph (Facebook, LinkedIn, Discord)
    updateMeta('og:title', pageTitle, true);
    updateMeta('og:description', pageDescription, true);
    updateMeta('og:url', currentCanonical, true);
    updateMeta('og:type', ogType, true);
    updateMeta('og:image', ogImage, true);
    updateMeta('og:image:secure_url', ogImage, true);
    updateMeta('og:image:width', '1200', true);
    updateMeta('og:image:height', '630', true);
    updateMeta('og:image:alt', `${pageTitle} — SM SAAD Portfolio`, true);
    updateMeta('og:site_name', 'SM SAAD — Official Portfolio & Creative Hub', true);
    updateMeta('og:locale', 'en_US', true);

    // 4. Twitter Card Tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:site', '@thesmsaad');
    updateMeta('twitter:creator', '@thesmsaad');
    updateMeta('twitter:title', pageTitle);
    updateMeta('twitter:description', pageDescription);
    updateMeta('twitter:image', ogImage);
    updateMeta('twitter:image:alt', `${pageTitle} — SM SAAD`);

    // 5. Canonical Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentCanonical);

    // 6. JSON-LD Structured Data Schema Generation
    let scriptTag = document.querySelector('#json-ld-schema') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('id', 'json-ld-schema');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    const schemasToInject: object[] = [];

    // Base Person / Creator Schema
    const personSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: siteConfig.name,
      alternateName: 'SM SAAD Portfolio',
      url: 'https://smsaad.online',
      image: 'https://smsaad.online/assets/images/hero.jpg',
      jobTitle: siteConfig.role,
      description: siteConfig.introText,
      email: siteConfig.email,
      sameAs: [
        siteConfig.socials.github,
        siteConfig.socials.youtube,
        siteConfig.socials.instagram,
        siteConfig.socials.linkedin,
      ],
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'Arena Animation',
      },
      knowsAbout: [
        'Video Editing',
        'VFX Compositing',
        'Motion Graphics',
        'Web Development',
        'DaVinci Resolve',
        'Adobe Premiere Pro',
        'Adobe After Effects',
        'React',
        'Next.js',
        'TypeScript',
        'WordPress',
        'AI Content Automation',
      ],
    };
    schemasToInject.push(personSchema);

    // WebSite Schema
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'SM SAAD — Video Editor & Developer Portfolio',
      url: 'https://smsaad.online',
      description: pageDescription,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://smsaad.online/blogs?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    };
    schemasToInject.push(websiteSchema);

    // Breadcrumbs Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://smsaad.online',
          },
          ...breadcrumbs.map((b, idx) => ({
            '@type': 'ListItem',
            position: idx + 2,
            name: b.name,
            item: b.url.startsWith('http') ? b.url : `https://smsaad.online${b.url}`,
          })),
        ],
      };
      schemasToInject.push(breadcrumbSchema);
    }

    // Custom Page-Specific Schemas
    if (schema) {
      if (Array.isArray(schema)) {
        schemasToInject.push(...schema);
      } else {
        schemasToInject.push(schema);
      }
    }

    scriptTag.textContent = JSON.stringify(schemasToInject);
  }, [pageTitle, pageDescription, pageKeywords, currentCanonical, ogImage, ogType, breadcrumbs, schema]);

  return null;
};
