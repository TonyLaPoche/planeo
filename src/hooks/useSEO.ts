import { useTranslation } from './useTranslation';

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
}

export function useSEO(page: 'home' | 'planning' | 'reports' | 'users' | 'advanced' | 'settings'): SEOData {
  const { t } = useTranslation();

  const baseTitleRaw = t(`seo.${page}.title`);
  const descriptionRaw = t(`seo.${page}.description`);
  const keywordsRaw = t(`seo.${page}.keywords`);

  // Ensure we get strings from translation
  const baseTitle = typeof baseTitleRaw === 'string' ? baseTitleRaw : `seo.${page}.title`;
  const description = typeof descriptionRaw === 'string' ? descriptionRaw : `seo.${page}.description`;
  const keywords = typeof keywordsRaw === 'string' ? keywordsRaw : `seo.${page}.keywords`;

  return {
    title: baseTitle,
    description,
    keywords,
    ogTitle: baseTitle,
    ogDescription: description,
    twitterTitle: baseTitle,
    twitterDescription: description,
  };
}
