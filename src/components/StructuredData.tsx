interface StructuredDataProps {
  type: 'WebPage' | 'ContactPage' | 'AboutPage' | 'FAQPage';
  title: string;
  description: string;
  url: string;
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
}

const StructuredData = ({ type, title, description, url, breadcrumbs }: StructuredDataProps) => {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
    "name": title,
    "description": description,
    "url": url,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Bliss Bouquet Kenya",
      "url": "https://blissbouquetkenya.com"
    },
    "provider": {
      "@type": "LocalBusiness",
      "name": "Bliss Bouquet Kenya",
      "url": "https://blissbouquetkenya.com",
      "telephone": "+254743491613",
      "email": "blissbouquet187@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Nairobi",
        "addressCountry": "KE"
      }
    }
  };

  // Add breadcrumbs if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    (baseSchema as any).breadcrumb = {
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(baseSchema)
      }}
    />
  );
};

export default StructuredData;
