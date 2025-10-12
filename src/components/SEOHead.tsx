import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

const SEOHead = ({
  title,
  description,
  canonical,
  keywords,
  ogTitle,
  ogDescription,
  ogImage = "https://blissbouquetkenya.com/logo.png"
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update or create link tags
    const updateLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // Update meta tags
    if (description) {
      updateMetaTag('description', description);
    }
    
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Update canonical URL
    if (canonical) {
      updateLinkTag('canonical', canonical);
    }

    // Update Open Graph tags
    if (ogTitle) {
      updateMetaTag('og:title', ogTitle, true);
    }
    
    if (ogDescription) {
      updateMetaTag('og:description', ogDescription, true);
    }
    
    if (ogImage) {
      updateMetaTag('og:image', ogImage, true);
    }

    if (canonical) {
      updateMetaTag('og:url', canonical, true);
    }

    // Update Twitter tags
    if (ogTitle) {
      updateMetaTag('twitter:title', ogTitle);
    }
    
    if (ogDescription) {
      updateMetaTag('twitter:description', ogDescription);
    }
    
    if (ogImage) {
      updateMetaTag('twitter:image', ogImage);
    }

  }, [title, description, canonical, keywords, ogTitle, ogDescription, ogImage]);

  return null; // This component doesn't render anything
};

export default SEOHead;
