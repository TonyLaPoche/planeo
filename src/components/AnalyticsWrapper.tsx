'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useCookiePreferences } from './CookieBanner';

export default function AnalyticsWrapper() {
  const preferences = useCookiePreferences();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Vérifier les préférences au chargement et à chaque changement
    if (preferences.analytics) {
      setShouldLoad(true);
    } else {
      setShouldLoad(false);
    }
  }, [preferences.analytics]);

  // Ne rien rendre si analytics n'est pas accepté
  if (!shouldLoad) {
    return null;
  }

  return <Analytics />;
}
