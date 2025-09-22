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

  const baseTitle = t(`seo.${page}.title`);
  const description = t(`seo.${page}.description`);
  const keywords = t(`seo.${page}.keywords`);

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
