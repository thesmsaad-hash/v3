import React, { useEffect } from 'react';
import { siteConfig } from '../data/siteData';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  schema?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = 'https://smsaad.online/assets/images/hero.jpg',
  ogType = 'website',
  schema,
}) => {
  const defaultTitle = `${siteConfig.name} — Video Editor, VFX Artist & Web Developer | smsaad.online`;
  const pageTitle = title ? `${title} | ${siteConfig.name}` : defaultTitle;
  
  const defaultDescription = `${siteConfig.name} is a Video Editor, VFX Compositing Artist and Web Developer creating visual content, post-production, digital experiences, and free creator assets at smsaad.online.`;
  const pageDescription = description || defaultDescription;

  const defaultKeywords = "SM SAAD, SM SAAD Video Editor, SM SAAD VFX Artist, SM SAAD Web Developer, Video Editing, VFX Compositing, Motion Graphics, Web Development, React, WordPress, AI Content, Free VFX Overlays Download, Free Editing Presets, smsaad.online";
  const pageKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  const currentCanonical = canonical || `https://smsaad.online${window.location.pathname}`;

  useEffect(() => {
    // 1. Update Title
    document.title = pageTitle;

    // Helper function for meta tags
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

    // 2. Standard Meta Tags
    updateMeta('description', pageDescription);
    updateMeta('keywords', pageKeywords);
    updateMeta('author', siteConfig.name);
    updateMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 3. Open Graph Tags
    updateMeta('og:title', pageTitle, true);
    updateMeta('og:description', pageDescription, true);
    updateMeta('og:url', currentCanonical, true);
    updateMeta('og:type', ogType, true);
    updateMeta('og:image', ogImage, true);
    updateMeta('og:site_name', 'SM SAAD Official Portfolio', true);

    // 4. Twitter Card Tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', pageTitle);
    updateMeta('twitter:description', pageDescription);
    updateMeta('twitter:image', ogImage);

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentCanonical);

    // 6. JSON-LD Structured Data Schema
    let scriptTag = document.querySelector('#json-ld-schema') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('id', 'json-ld-schema');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    const personSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: siteConfig.name,
      url: 'https://smsaad.online',
      image: 'https://smsaad.online/assets/images/hero.jpg',
      jobTitle: siteConfig.role,
      description: siteConfig.introText,
      sameAs: [
        siteConfig.socials.github,
        siteConfig.socials.youtube,
        siteConfig.socials.instagram,
        siteConfig.socials.linkedin
      ],
      knowsAbout: [
        'Video Editing',
        'VFX Compositing',
        'Motion Graphics',
        'Web Development',
        'React',
        'Next.js',
        'WordPress',
        'AI-Assisted Workflows'
      ]
    };

    const finalSchema = schema ? [personSchema, schema] : personSchema;
    scriptTag.textContent = JSON.stringify(finalSchema);

  }, [pageTitle, pageDescription, pageKeywords, currentCanonical, ogImage, ogType, schema]);

  return null;
};
