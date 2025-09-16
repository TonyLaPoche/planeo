'use client';

import { useEffect, useState } from 'react';
import { useCookiePreferences } from './CookieBanner';

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
  const preferences = useCookiePreferences();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const loadAdSenseScript = () => {
      if (isScriptLoaded) return;

      // Charger le script AdSense
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5521069542439268';
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        setIsScriptLoaded(true);
        // Initialiser adsbygoogle
        window.adsbygoogle = window.adsbygoogle || [];
        
        // Configurer le consentement selon les préférences
        if (preferences.marketing) {
          // Publicités personnalisées autorisées
          console.log('AdSense: Publicités personnalisées activées');
        } else {
          // Publicités non personnalisées uniquement
          console.log('AdSense: Publicités non personnalisées uniquement');
        }
      };

      script.onerror = () => {
        console.error('Erreur lors du chargement du script AdSense');
      };

      document.head.appendChild(script);
    };

    // Vérifier les préférences au chargement et à chaque changement
    if (preferences.marketing) {
      loadAdSenseScript();
    } else {
      // Optionnel : désactiver les publicités si déjà chargées
      if (window.googletag && window.googletag.pubads) {
        window.googletag.cmd = window.googletag.cmd || [];
        window.googletag.cmd.push(() => {
          if (window.googletag?.pubads) {
            window.googletag.pubads().setRequestNonPersonalizedAds(1);
          }
        });
      }
    }
  }, [preferences.marketing, isScriptLoaded]);

  // Ne rien rendre - ce composant gère uniquement le chargement des scripts
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
  const preferences = useCookiePreferences();
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (preferences.marketing && window.adsbygoogle && !adLoaded) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      } catch (error) {
        console.error('Erreur lors du chargement de la publicité:', error);
      }
    }
  }, [preferences.marketing, slot, adLoaded]);

  // Ne pas afficher la publicité si les cookies marketing ne sont pas acceptés
  if (!preferences.marketing) {
    return null;
  }

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-5521069542439268"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
