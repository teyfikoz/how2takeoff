interface StructuredDataProps {
  data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "How2TakeOff",
    "url": "https://how2takeoff.com",
    "logo": "https://how2takeoff.com/generated-icon.png",
    "description": "Aviation business insights from marketing, CRM & revenue management experience. Explore industry secrets and boost your career knowledge!",
    "sameAs": [
      "https://how2takeoff.com"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "url": "https://how2takeoff.com/about"
    }
  };

  return <StructuredData data={schema} />;
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "How2TakeOff",
    "url": "https://how2takeoff.com",
    "description": "Aviation business insights from marketing, CRM & revenue management experience.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://how2takeoff.com/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return <StructuredData data={schema} />;
}

export function ArticleSchema({ 
  title, 
  description, 
  datePublished, 
  dateModified,
  author = "How2TakeOff Team"
}: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "How2TakeOff",
      "logo": {
        "@type": "ImageObject",
        "url": "https://how2takeoff.com/generated-icon.png"
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished
  };

  return <StructuredData data={schema} />;
}
