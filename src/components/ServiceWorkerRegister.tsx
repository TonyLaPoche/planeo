'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Vérifier si nous sommes dans le navigateur et en production
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      // Fonction pour enregistrer le service worker
      const registerServiceWorker = async () => {
        try {
          // Enregistrer le service worker
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          });

          // Vérifier s'il y a un service worker enregistré avec un autre nom et le désenregistrer
          const existingRegistrations = await navigator.serviceWorker.getRegistrations();
          for (const reg of existingRegistrations) {
            if (reg.scope.includes('service-worker.js')) {
              await reg.unregister();
            }
          }

          // Écouter les mises à jour
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Nouvelle version disponible
                  // Vous pouvez afficher une notification à l'utilisateur ici
                }
              });
            }
          });

        } catch {
          // Erreur silencieuse en production
        }
      };

      // Attendre que la page soit chargée avant d'enregistrer
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', registerServiceWorker);
      } else {
        registerServiceWorker();
      }
    } else {
      // Service Worker non supporté - silencieux
    }
  }, []);

  return null; // Ce composant ne rend rien visuellement
}
