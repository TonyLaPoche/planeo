'use client';

import { useState, useEffect } from 'react';
import { settingsStorage } from '@/utils/storage';

// Type flexible pour les traductions - permet n'importe quelle structure
type TranslationKeys = Record<string, unknown>;

// Fonction pour charger les traductions
const loadTranslations = async (language: string): Promise<TranslationKeys> => {
  try {
    const translations = await import(`@/locales/${language}.json`);
    return translations.default;
  } catch (error) {
    console.error(`Erreur lors du chargement des traductions pour ${language}:`, error);
    // Fallback vers le français
    const fallback = await import('@/locales/fr.json');
    return fallback.default;
  }
};

export function useTranslation() {
  const [translations, setTranslations] = useState<TranslationKeys | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');
  const [isLoading, setIsLoading] = useState(true);

  // Charger les traductions au montage et à chaque fois que le composant se monte
  useEffect(() => {
    const loadInitialTranslations = async () => {
      const settings = settingsStorage.get();
      const language = settings?.language || 'fr';
      
      setCurrentLanguage(language);
      const loadedTranslations = await loadTranslations(language);
      setTranslations(loadedTranslations);
      setIsLoading(false);
    };

    loadInitialTranslations();
  }, []); // Se déclenche à chaque montage du composant

  // Écouter les changements de langue dans le localStorage
  useEffect(() => {
    const handleStorageChange = async () => {
      const settings = settingsStorage.get();
      const language = settings?.language || 'fr';
      
      if (language !== currentLanguage) {
        setCurrentLanguage(language);
        const loadedTranslations = await loadTranslations(language);
        setTranslations(loadedTranslations);
      }
    };

    // Écouter les changements de localStorage (entre onglets)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentLanguage]);

  // Fonction pour changer de langue
  const changeLanguage = async (newLanguage: string) => {
    setIsLoading(true);
    const loadedTranslations = await loadTranslations(newLanguage);
    setTranslations(loadedTranslations);
    setCurrentLanguage(newLanguage);
    setIsLoading(false);
  };

  // Fonction pour obtenir une traduction avec support des clés imbriquées et des paramètres
  const t = (key: string, params?: Record<string, string | number>): string | string[] => {
    if (!translations) {
      return key;
    }
    
    const keys = key.split('.');
    let value: unknown = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Retourner la clé si la traduction n'existe pas
      }
    }
    
    // Retourner la valeur telle quelle (string ou array)
    if (typeof value === 'string') {
      // Remplacer les paramètres dans la chaîne de traduction
      if (params) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey] !== undefined ? String(params[paramKey]) : match;
        });
      }
      return value;
    }
    
    // Retourner les tableaux tels quels
    if (Array.isArray(value)) {
      return value as string[];
    }
    
    return key;
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    isLoading,
    languages: (translations?.languages as Record<string, string>) || {
      fr: 'Français',
      en: 'English',
      de: 'Deutsch',
      it: 'Italiano'
    }
  };
}
