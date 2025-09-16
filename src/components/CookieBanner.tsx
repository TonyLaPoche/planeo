'use client';

import { useState, useEffect } from 'react';
import { X, Settings, Shield, BarChart3, Cookie } from 'lucide-react';
import Link from 'next/link';

// Hook pour gérer l'état des préférences cookies
export const useCookiePreferences = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    analytics: true, // Par défaut activé pour une meilleure UX
    functional: true,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('cookie-preferences');
    if (saved) {
      const parsed = JSON.parse(saved);
      setPreferences(parsed);
    }
  }, []);

  return preferences;
};

interface CookiePreferences {
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    analytics: false,
    functional: true, // Cookies fonctionnels toujours activés
    marketing: false,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const savedPreferences = localStorage.getItem('cookie-preferences');
    if (!savedPreferences) {
      // Afficher le banner après un court délai pour ne pas gêner l'utilisateur immédiatement
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    } else {
      // Charger les préférences sauvegardées
      const parsed = JSON.parse(savedPreferences);
      setPreferences(parsed);

    // Si analytics est accepté, on peut initialiser Vercel Analytics
    if (parsed.analytics) {
      initializeAnalytics();
    }
  }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-preferences', JSON.stringify(prefs));
    setPreferences(prefs);
    setIsVisible(false);

    if (prefs.analytics) {
      initializeAnalytics();
    }
  };

  const acceptAll = () => {
    const allAccepted = {
      analytics: true,
      functional: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const rejectAll = () => {
    const allRejected = {
      analytics: false,
      functional: true, // Cookies fonctionnels toujours nécessaires
      marketing: false,
    };
    savePreferences(allRejected);
  };

  const acceptCustom = () => {
    savePreferences(preferences);
  };

  const initializeAnalytics = () => {
    // Cette fonction sera appelée quand l'utilisateur accepte les cookies analytics
    // Vercel Analytics se chargera automatiquement via le composant <Analytics /> dans le layout
    console.log('Analytics activé selon les préférences utilisateur');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay pour mobile */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsVisible(false)} />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-4">
              <div className="flex items-center mb-3">
                <Cookie className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Préférences de cookies
                </h3>
              </div>

              {!showDetails ? (
                <div>
                  <p className="text-gray-600 text-sm mb-4">
                    Nous utilisons des cookies pour améliorer votre expérience sur Planneo.
                    Certains cookies sont nécessaires au fonctionnement du site, d&apos;autres nous aident
                    à analyser l&apos;usage pour améliorer nos services.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={acceptAll}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Accepter tout
                    </button>
                    <button
                      onClick={() => setShowDetails(true)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Personnaliser
                    </button>
                    <button
                      onClick={rejectAll}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Refuser tout
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 text-sm mb-4">
                    Personnalisez vos préférences de cookies :
                  </p>

                  {/* Cookie fonctionnel */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 text-gray-600 mr-2" />
                        <div>
                          <h4 className="font-medium text-gray-900">Cookies fonctionnels</h4>
                          <p className="text-xs text-gray-600">
                            Nécessaires au fonctionnement de l&apos;application
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.functional}
                          disabled={true}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-xs text-gray-500">Toujours actif</span>
                      </div>
                    </div>
                  </div>

                  {/* Cookie analytics */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BarChart3 className="h-4 w-4 text-blue-600 mr-2" />
                        <div>
                          <h4 className="font-medium text-gray-900">Cookies d&apos;analyse</h4>
                          <p className="text-xs text-gray-600">
                            Nous aident à améliorer Planneo (Vercel Analytics)
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          analytics: e.target.checked
                        }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Cookie marketing / AdSense */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-green-600 mr-2" />
                        <div>
                          <h4 className="font-medium text-gray-900">Cookies publicitaires</h4>
                          <p className="text-xs text-gray-600">
                            Pour afficher des publicités adaptées via Google AdSense
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          marketing: e.target.checked
                        }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <button
                      onClick={acceptCustom}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Sauvegarder mes choix
                    </button>
                    <button
                      onClick={acceptAll}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Accepter tout
                    </button>
                    <button
                      onClick={rejectAll}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Refuser tout
                    </button>
                  </div>

                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    ← Retour aux options simples
                  </button>
                </div>
              )}

              <div className="mt-3 text-xs text-gray-500">
                En continuant à utiliser Planneo, vous acceptez notre{' '}
                <Link href="/about" className="text-blue-600 hover:underline">
                  politique de confidentialité
                </Link>
                .
              </div>
            </div>

            {/* Bouton de fermeture (desktop seulement) */}
            <button
              onClick={() => setIsVisible(false)}
              className="hidden md:block text-gray-400 hover:text-gray-600 p-1"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
