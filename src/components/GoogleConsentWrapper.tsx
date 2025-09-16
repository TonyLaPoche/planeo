'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export default function GoogleConsentWrapper() {
  const [consentLoaded, setConsentLoaded] = useState(false);

  useEffect(() => {
    // Initialiser gtag si pas déjà fait
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      };
    }

    // Configuration initiale du consentement (mode par défaut)
    window.gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'personalization_storage': 'denied',
      'functionality_storage': 'granted',
      'security_storage': 'granted'
    });

    // Écouter les changements de consentement de Google CMP
    const handleConsentUpdate = () => {
      // Cette fonction sera appelée quand l'utilisateur fait ses choix
      // Google CMP mettra automatiquement à jour les préférences
      setConsentLoaded(true);
      console.log('Google Consent Manager: Consentement mis à jour');
    };

    // Vérifier périodiquement si le consentement a été configuré
    const checkConsent = setInterval(() => {
      // Si Google CMP a été chargé et configuré
      if (window.gtag) {
        handleConsentUpdate();
        clearInterval(checkConsent);
      }
    }, 1000);

    // Nettoyage
    return () => {
      clearInterval(checkConsent);
    };
  }, []);

  // Ce composant ne rend rien, il gère juste le consentement
  return null;
}

// Hook pour vérifier le statut du consentement
export function useGoogleConsent() {
  const [hasAnalyticsConsent, setHasAnalyticsConsent] = useState(false);
  const [hasAdsConsent, setHasAdsConsent] = useState(false);

  useEffect(() => {
    // Fonction pour vérifier le consentement
    const checkConsentStatus = () => {
      // Cette logique sera étendue quand nous aurons plus d'infos sur l'API Google CMP
      // Pour l'instant, on assume que le consentement peut être accordé
      const analyticsConsent = localStorage.getItem('google-analytics-consent') === 'granted';
      const adsConsent = localStorage.getItem('google-ads-consent') === 'granted';
      
      setHasAnalyticsConsent(analyticsConsent);
      setHasAdsConsent(adsConsent);
    };

    checkConsentStatus();

    // Écouter les changements dans localStorage
    window.addEventListener('storage', checkConsentStatus);
    
    return () => {
      window.removeEventListener('storage', checkConsentStatus);
    };
  }, []);

  return { hasAnalyticsConsent, hasAdsConsent };
}
