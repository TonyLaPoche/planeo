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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        (window.adsbygoogle as unknown[]).push({});
      } catch (error) {
        console.error('Erreur lors du chargement de la publicité:', error);
      }
    }
  }, [mounted, slot]);

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
    <div className={className} style={{ minWidth: '300px', minHeight: '250px', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block', 
          width: '100%',
          height: '100%',
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
