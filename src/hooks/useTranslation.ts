'use client';

import { useState, useEffect } from 'react';
import { settingsStorage } from '@/utils/storage';

// Types pour les traductions
type TranslationKeys = {
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    back: string;
    loading: string;
    error: string;
    success: string;
    confirm: string;
    yes: string;
    no: string;
  };
  navigation: {
    home: string;
    users: string;
    planning: string;
    reports: string;
    settings: string;
    advanced: string;
    about: string;
  };
  home: {
    title: string;
    subtitle: string;
    description: string;
    activeEmployees: string;
    shiftsThisMonth: string;
    currentMonth: string;
    quickAccess: string;
    manageEmployees: string;
    createSchedules: string;
    pdfExports: string;
    holidaysAndStores: string;
    configuration: string;
  };
  settings: {
    title: string;
    generalSettings: string;
    language: string;
    dataManagement: string;
    exportData: string;
    importData: string;
    clearAllData: string;
    about: string;
    learnMore: string;
    version: string;
    pwa: string;
    storage: string;
    features: string;
    userManagement: string;
    visualPlanning: string;
    automaticCalculation: string;
    pdfExport: string;
    offlineMode: string;
    aiGeneration: string;
    multiStoreManagement: string;
  };
  languages: {
    fr: string;
    en: string;
    de: string;
    it: string;
  };
};

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
  const t = (key: string, params?: Record<string, any>): string => {
    if (!translations) return key;
    
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Retourner la clé si la traduction n'existe pas
      }
    }
    
    if (typeof value !== 'string') return key;
    
    // Remplacer les paramètres dans la chaîne de traduction
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }
    
    return value;
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    isLoading,
    languages: translations?.languages || {
      fr: 'Français',
      en: 'English',
      de: 'Deutsch',
      it: 'Italiano'
    }
  };
}
