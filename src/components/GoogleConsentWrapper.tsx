'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export default function GoogleConsentWrapper() {
  useEffect(() => {
    // Initialiser gtag pour Google Analytics/AdSense si pas déjà fait
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      };
    }

    // Configuration initiale du consentement (mode par défaut)
    // Google CMP gérera automatiquement les mises à jour selon les choix utilisateur
    window.gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'personalization_storage': 'denied',
      'functionality_storage': 'granted',
      'security_storage': 'granted'
    });

    console.log('Google Consent Mode initialisé - CMP prendra le relais');
  }, []);

  // Ce composant ne rend rien, il initialise juste le mode consentement
  return null;
}
