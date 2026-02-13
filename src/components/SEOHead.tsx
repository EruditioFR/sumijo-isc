import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://www.sumijo-isc.com';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'event';
  jsonLd?: object | object[];
  noIndex?: boolean;
}

const SEOHead = ({
  title,
  description,
  keywords,
  path = '',
  image = '/og-image.jpg',
  type = 'website',
  jsonLd,
  noIndex = false,
}: SEOHeadProps) => {
  // Ensure consistent trailing slash for canonical URLs
  const normalizedPath = path === '' ? '/' : path;
  const canonicalUrl = `${BASE_URL}${normalizedPath}`;
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  // Generate hreflang links for all supported languages
  const hreflangLinks = [
    { lang: 'fr', url: `${BASE_URL}${path}` },
    { lang: 'en', url: `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}lang=en` },
    { lang: 'ko', url: `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}lang=kr` },
    { lang: 'zh', url: `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}lang=zh` },
    { lang: 'x-default', url: `${BASE_URL}${path}` },
  ];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="SUMI JO International Singing Competition" />
      <link rel="canonical" href={canonicalUrl} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:locale:alternate" content="ko_KR" />
      <meta property="og:locale:alternate" content="zh_CN" />
      <meta property="og:site_name" content="SUMI JO International Singing Competition" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Hreflang Links for Multilingual SEO */}
      {hreflangLinks.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(
            Array.isArray(jsonLd)
              ? { '@context': 'https://schema.org', '@graph': jsonLd }
              : { '@context': 'https://schema.org', ...jsonLd }
          )}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
