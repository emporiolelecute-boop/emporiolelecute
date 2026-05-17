import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useSEOConfig } from '@/hooks/useStoreSettings';

interface DynamicSEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SITE_ORIGIN = 'https://emporiolelecute.com.br';

const buildCanonical = (pathname: string) => {
  // Strip trailing slash (except root) to enforce single preferred URL — no query/hash
  const clean = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;
  return `${SITE_ORIGIN}${clean}`;
};

const DynamicSEO = ({ title, description, image, url, type = 'website' }: DynamicSEOProps) => {
  const { data: seoConfig, isLoading } = useSEOConfig();
  const location = useLocation();

  if (isLoading || !seoConfig) {
    return null;
  }

  const pageTitle = title || seoConfig.site_title;
  const pageDescription = description || seoConfig.site_description;
  const pageImage = image || seoConfig.og_image;
  const pageUrl = url || buildCanonical(location.pathname);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={seoConfig.site_keywords} />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Empório LeleCute" />
      
      {seoConfig.facebook_app_id && (
        <meta property="fb:app_id" content={seoConfig.facebook_app_id} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      {seoConfig.twitter_handle && (
        <meta name="twitter:site" content={seoConfig.twitter_handle} />
      )}

      {/* Search Console Verification */}
      {seoConfig.google_verification && (
        <meta name="google-site-verification" content={seoConfig.google_verification} />
      )}
      {seoConfig.bing_verification && (
        <meta name="msvalidate.01" content={seoConfig.bing_verification} />
      )}
    </Helmet>
  );
};

export default DynamicSEO;
