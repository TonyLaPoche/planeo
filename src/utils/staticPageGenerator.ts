import fs from 'fs';
import path from 'path';

// Import des traductions
import frTranslations from '@/locales/fr.json';
import enTranslations from '@/locales/en.json';
import deTranslations from '@/locales/de.json';
import itTranslations from '@/locales/it.json';

const translations = {
  fr: frTranslations,
  en: enTranslations,
  de: deTranslations,
  it: itTranslations
};

// Fonction pour récupérer une traduction
function getTranslation(lang: keyof typeof translations, key: string): string | string[] {
  const keys = key.split('.');
  let value: unknown = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }

  return value as string | string[];
}

// Fonction pour générer le HTML statique d'une page
export function generateStaticPage(pageType: 'cgu' | 'privacy' | 'security', lang: keyof typeof translations = 'fr'): string {
  const t = (key: string) => getTranslation(lang, key);
  
  const baseUrl = 'https://planneo.ch';
  const pageTitle = t(`${pageType}.title`);
  const lastUpdated = t(`${pageType}.lastUpdated`);

  let content = '';

  if (pageType === 'cgu') {
    content = `
      <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
              <a href="/" class="flex items-center space-x-2">
                <div class="h-8 w-8 bg-blue-600 rounded"></div>
                <h1 class="text-2xl font-bold text-gray-900">Planneo</h1>
              </a>
              <a href="/" class="text-blue-600 hover:text-blue-800 font-medium">
                ← ${t('cgu.footer.backHome')}
              </a>
            </div>
          </div>
        </header>

        <!-- Content -->
        <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="space-y-8">
            <!-- Hero Section -->
            <div class="text-center bg-white rounded-lg shadow-sm p-8">
              <div class="h-16 w-16 bg-blue-600 rounded mx-auto mb-4"></div>
              <h1 class="text-3xl font-bold text-gray-900 mb-4">${pageTitle}</h1>
              <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                ${lastUpdated}
              </p>
            </div>

            <!-- Article 1 - Objet -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">${t('cgu.sections.object.title')}</h2>
              <div class="space-y-4">
                <p class="text-gray-700">
                  ${t('cgu.sections.object.description1')} 
                  <strong> ${t('cgu.sections.object.description2')}</strong>${t('cgu.sections.object.description3')}
                </p>
                <p class="text-gray-700">
                  ${t('cgu.sections.object.description4')}
                </p>
                <p class="text-gray-700">
                  ${t('cgu.sections.object.description5')}
                </p>
              </div>
            </div>

            <!-- Article 2 - Accès et utilisation -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">${t('cgu.sections.access.title')}</h2>
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900">${t('cgu.sections.access.freeAccess.title')}</h3>
                <p class="text-gray-700">
                  ${t('cgu.sections.access.freeAccess.description')}
                </p>

                <h3 class="text-lg font-medium text-gray-900">${t('cgu.sections.access.allowedUse.title')}</h3>
                <p class="text-gray-700 mb-2">${t('cgu.sections.access.allowedUse.description')}</p>
                <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  ${Array.isArray(t('cgu.sections.access.allowedUse.items')) ? 
                    (t('cgu.sections.access.allowedUse.items') as string[]).map(item => `<li>${item}</li>`).join('') : 
                    ''
                  }
                </ul>

                <h3 class="text-lg font-medium text-gray-900">${t('cgu.sections.access.forbiddenUse.title')}</h3>
                <p class="text-gray-700 mb-2">${t('cgu.sections.access.forbiddenUse.description')}</p>
                <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  ${Array.isArray(t('cgu.sections.access.forbiddenUse.items')) ? 
                    (t('cgu.sections.access.forbiddenUse.items') as string[]).map(item => `<li>${item}</li>`).join('') : 
                    ''
                  }
                </ul>
              </div>
            </div>

            <!-- Article 3 - Données et confidentialité -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">${t('cgu.sections.data.title')}</h2>
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900">${t('cgu.sections.data.localStorage.title')}</h3>
                <p class="text-gray-700">
                  ${t('cgu.sections.data.localStorage.description')}
                </p>

                <h3 class="text-lg font-medium text-gray-900">${t('cgu.sections.data.userResponsibility.title')}</h3>
                <p class="text-gray-700 mb-2">${t('cgu.sections.data.userResponsibility.description')}</p>
                <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  ${Array.isArray(t('cgu.sections.data.userResponsibility.items')) ? 
                    (t('cgu.sections.data.userResponsibility.items') as string[]).map(item => `<li>${item}</li>`).join('') : 
                    ''
                  }
                </ul>

                <h3 class="text-lg font-medium text-gray-900">${t('cgu.sections.data.export.title')}</h3>
                <p class="text-gray-700">
                  ${t('cgu.sections.data.export.description')}
                </p>
              </div>
            </div>

            <!-- Article 4 - Services tiers -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">${t('cgu.sections.thirdParty.title')}</h2>
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900">${t('cgu.sections.thirdParty.adsense.title')}</h3>
                <p class="text-gray-700">
                  ${t('cgu.sections.thirdParty.adsense.description')}
                </p>

                <h3 class="text-lg font-medium text-gray-900">${t('cgu.sections.thirdParty.analytics.title')}</h3>
                <p class="text-gray-700">
                  ${t('cgu.sections.thirdParty.analytics.description')}
                </p>

                <h3 class="text-lg font-medium text-gray-900">${t('cgu.sections.thirdParty.consent.title')}</h3>
                <p class="text-gray-700">
                  ${t('cgu.sections.thirdParty.consent.description')}
                </p>
              </div>
            </div>

            <!-- Article 5 - Responsabilités -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">${t('cgu.sections.responsibilities.title')}</h2>
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900">${t('cgu.sections.responsibilities.developer.title')}</h3>
                <p class="text-gray-700">
                  ${t('cgu.sections.responsibilities.developer.description')}
                </p>

                <h3 class="text-lg font-medium text-gray-900">${t('cgu.sections.responsibilities.limitation.title')}</h3>
                <p class="text-gray-700 mb-2">${t('cgu.sections.responsibilities.limitation.description')}</p>
                <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  ${Array.isArray(t('cgu.sections.responsibilities.limitation.items')) ? 
                    (t('cgu.sections.responsibilities.limitation.items') as string[]).map(item => `<li>${item}</li>`).join('') : 
                    ''
                  }
                </ul>

                <h3 class="text-lg font-medium text-gray-900">${t('cgu.sections.responsibilities.user.title')}</h3>
                <p class="text-gray-700">
                  ${t('cgu.sections.responsibilities.user.description')}
                </p>
              </div>
            </div>

            <!-- Article 6 - Propriété intellectuelle -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">${t('cgu.sections.intellectualProperty.title')}</h2>
              <div class="space-y-4">
                <p class="text-gray-700">
                  ${t('cgu.sections.intellectualProperty.description1')}
                </p>
                <p class="text-gray-700">
                  ${t('cgu.sections.intellectualProperty.description2')}
                </p>
                <p class="text-gray-700">
                  ${t('cgu.sections.intellectualProperty.description3')}
                </p>
              </div>
            </div>

            <!-- Article 7 - Évolution du service -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">${t('cgu.sections.evolution.title')}</h2>
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900">${t('cgu.sections.evolution.updates.title')}</h3>
                <p class="text-gray-700">
                  ${t('cgu.sections.evolution.updates.description')}
                </p>

                <h3 class="text-lg font-medium text-gray-900">${t('cgu.sections.evolution.cguEvolution.title')}</h3>
                <p class="text-gray-700">
                  ${t('cgu.sections.evolution.cguEvolution.description')}
                </p>

                <h3 class="text-lg font-medium text-gray-900">${t('cgu.sections.evolution.support.title')}</h3>
                <p class="text-gray-700">
                  ${t('cgu.sections.evolution.support.description')}
                </p>
              </div>
            </div>

            <!-- Article 8 - Droit applicable -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">${t('cgu.sections.law.title')}</h2>
              <div class="space-y-4">
                <p class="text-gray-700">
                  ${t('cgu.sections.law.description1')}
                </p>
                <p class="text-gray-700">
                  ${t('cgu.sections.law.description2')}
                </p>
              </div>
            </div>

            <!-- Contact -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center mb-4">
                <div class="h-6 w-6 bg-blue-600 rounded mr-2"></div>
                <h2 class="text-2xl font-semibold text-gray-900">${t('cgu.sections.contact.title')}</h2>
              </div>
              <div class="space-y-4">
                <p class="text-gray-700">
                  ${t('cgu.sections.contact.description')}
                </p>
                <div class="bg-blue-50 p-4 rounded-lg">
                  <p class="text-gray-700 mb-2">
                    <strong>${t('cgu.sections.contact.developer')}</strong><br/>
                    ${t('cgu.sections.contact.role')}
                  </p>
                  <a
                    href="mailto:contact@antoineterrade.com"
                    class="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    contact@antoineterrade.com
                  </a>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="text-center text-gray-500 text-sm">
              <p>${t('cgu.footer.copyright')}</p>
              <p class="mt-1">
                <a href="/" class="text-blue-600 hover:text-blue-800">
                  ${t('cgu.footer.backHome')}
                </a>
                • 
                <a href="/about" class="text-blue-600 hover:text-blue-800">
                  ${t('cgu.footer.about')}
                </a>
                • 
                <a href="/privacy" class="text-blue-600 hover:text-blue-800">
                  ${t('cgu.footer.privacy')}
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    `;
  }

  // Template HTML complet
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle} - Planneo</title>
  <meta name="description" content="${t(`${pageType}.metaDescription`)}">
  <link rel="canonical" href="${baseUrl}/${pageType}">
  
  <!-- Tailwind CSS CDN pour le rendu statique -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Open Graph -->
  <meta property="og:title" content="${pageTitle} - Planneo">
  <meta property="og:description" content="${t(`${pageType}.metaDescription`)}">
  <meta property="og:url" content="${baseUrl}/${pageType}">
  <meta property="og:type" content="website">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${pageTitle} - Planneo">
  <meta name="twitter:description" content="${t(`${pageType}.metaDescription`)}">
</head>
<body>
  ${content}
</body>
</html>`;
}

// Fonction pour générer toutes les pages statiques
export function generateAllStaticPages() {
  const pages = ['cgu', 'privacy', 'security'] as const;
  const languages = ['fr', 'en', 'de', 'it'] as const;
  
  const outputDir = path.join(process.cwd(), 'public', 'static-pages');
  
  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  pages.forEach(page => {
    languages.forEach(lang => {
      const html = generateStaticPage(page, lang);
      const filename = lang === 'fr' ? `${page}.html` : `${page}-${lang}.html`;
      const filepath = path.join(outputDir, filename);
      
      fs.writeFileSync(filepath, html, 'utf8');
      console.log(`✅ Generated: ${filename}`);
    });
  });
  
  console.log('🎉 All static pages generated successfully!');
}
