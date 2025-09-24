'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    googletag?: {
      cmd: unknown[];
      pubads: () => {
        setRequestNonPersonalizedAds: (value: number) => void;
      };
    };
  }
}

export default function AdSenseWrapper() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Le script AdSense est déjà chargé dans layout.tsx
    // On initialise juste adsbygoogle ici
    if (!isScriptLoaded && typeof window !== 'undefined') {
      setIsScriptLoaded(true);
      window.adsbygoogle = window.adsbygoogle || [];
      console.log('AdSense: Initialisé - Google CMP gère le consentement');
    }
  }, [isScriptLoaded]);

  // Ne rien rendre - ce composant gère uniquement l'initialisation
  return null;
}

// Composant pour afficher une publicité
interface AdSenseAdProps {
  slot: string;
  style?: React.CSSProperties;
  className?: string;
  format?: string;
}

export function AdSenseAd({ slot, style, className, format = "auto" }: AdSenseAdProps) {
  const [mounted, setMounted] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined' && window.adsbygoogle && !adLoaded) {
      // Attendre un peu pour que le DOM soit complètement rendu
      const timer = setTimeout(() => {
        try {
          // Vérifier que le conteneur a une largeur avant de charger la pub
          const adElement = document.querySelector(`[data-ad-slot="${slot}"]`);
          if (adElement && adElement.getBoundingClientRect().width > 0) {
            (window.adsbygoogle as unknown[]).push({});
            setAdLoaded(true);
          } else {
            console.log('AdSense: Conteneur pas encore dimensionné, retry dans 100ms');
            // Retry après 100ms
            setTimeout(() => {
              if (adElement && adElement.getBoundingClientRect().width > 0) {
                (window.adsbygoogle as unknown[]).push({});
                setAdLoaded(true);
              }
            }, 100);
          }
        } catch (error) {
          console.error('Erreur lors du chargement de la publicité:', error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [mounted, slot, adLoaded]);

  // Ne pas rendre pendant l'hydratation
  if (!mounted) {
    return (
      <div className={className} style={style}>
        <div style={{ display: 'block', background: '#f5f5f5', minHeight: '250px', ...style }}>
          <p style={{ textAlign: 'center', paddingTop: '100px', color: '#666' }}>
            Chargement de la publicité...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={className} 
      style={{ 
        minWidth: '300px', 
        minHeight: '250px', 
        width: '100%',
        ...style 
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block', 
          width: '100%',
          minWidth: '300px',
          minHeight: '250px',
          ...style 
        }}
        data-ad-client="ca-pub-5521069542439268"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
