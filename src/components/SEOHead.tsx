'use client';

import Head from 'next/head';
import { useSEO } from '@/hooks/useSEO';

interface SEOHeadProps {
  page: 'home' | 'planning' | 'reports' | 'users' | 'advanced' | 'settings';
}

export default function SEOHead({ page }: SEOHeadProps) {
  const seo = useSEO(page);

  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seo.ogTitle} />
      <meta property="og:description" content={seo.ogDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://planneo.ch" />
      <meta property="og:site_name" content="Planneo" />
      <meta property="og:image" content="/og-image.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={seo.ogTitle} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.twitterTitle} />
      <meta name="twitter:description" content={seo.twitterDescription} />
      <meta name="twitter:image" content="/og-image.png" />
      <meta name="twitter:creator" content="@antoineterrade" />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href="https://planneo.ch" />
    </Head>
  );
}
