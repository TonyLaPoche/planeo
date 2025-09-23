'use client';

import Link from 'next/link';
import { Calendar, FileText, Shield, Mail, ExternalLink } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function CGUPage() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Planneo</h1>
            </Link>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← {t('cgu.footer.backHome')}
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">

          {/* Hero Section */}
          <div className="text-center bg-white rounded-lg shadow-sm p-8">
            <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('cgu.title')}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('cgu.lastUpdated')}
            </p>
          </div>

          {/* Article 1 - Objet */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('cgu.sections.object.title')}</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                {t('cgu.sections.object.description1')} 
                <strong> {t('cgu.sections.object.description2')}</strong>{t('cgu.sections.object.description3')}
              </p>
              <p className="text-gray-700">
                {t('cgu.sections.object.description4')}
              </p>
              <p className="text-gray-700">
                {t('cgu.sections.object.description5')}
              </p>
            </div>
          </div>

          {/* Article 2 - Accès et utilisation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('cgu.sections.access.title')}</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">{t('cgu.sections.access.freeAccess.title')}</h3>
              <p className="text-gray-700">
                {t('cgu.sections.access.freeAccess.description')}
              </p>

              <h3 className="text-lg font-medium text-gray-900">{t('cgu.sections.access.allowedUse.title')}</h3>
              <p className="text-gray-700 mb-2">{t('cgu.sections.access.allowedUse.description')}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                {Array.isArray(t('cgu.sections.access.allowedUse.items')) && 
                  (t('cgu.sections.access.allowedUse.items') as unknown as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h3 className="text-lg font-medium text-gray-900">{t('cgu.sections.access.forbiddenUse.title')}</h3>
              <p className="text-gray-700 mb-2">{t('cgu.sections.access.forbiddenUse.description')}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                {Array.isArray(t('cgu.sections.access.forbiddenUse.items')) && 
                  (t('cgu.sections.access.forbiddenUse.items') as unknown as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Article 3 - Données et confidentialité */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('cgu.sections.data.title')}</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">{t('cgu.sections.data.localStorage.title')}</h3>
              <p className="text-gray-700">
                {t('cgu.sections.data.localStorage.description')}
              </p>

              <h3 className="text-lg font-medium text-gray-900">{t('cgu.sections.data.userResponsibility.title')}</h3>
              <p className="text-gray-700 mb-2">{t('cgu.sections.data.userResponsibility.description')}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                {Array.isArray(t('cgu.sections.data.userResponsibility.items')) && 
                  (t('cgu.sections.data.userResponsibility.items') as unknown as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h3 className="text-lg font-medium text-gray-900">{t('cgu.sections.data.export.title')}</h3>
              <p className="text-gray-700">
                {t('cgu.sections.data.export.description')}
              </p>
            </div>
          </div>

          {/* Article 4 - Services tiers */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('cgu.sections.thirdParty.title')}</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">{t('cgu.sections.thirdParty.adsense.title')}</h3>
              <p className="text-gray-700">
                {t('cgu.sections.thirdParty.adsense.description')}
              </p>

              <h3 className="text-lg font-medium text-gray-900">{t('cgu.sections.thirdParty.analytics.title')}</h3>
              <p className="text-gray-700">
                {t('cgu.sections.thirdParty.analytics.description')}
              </p>

              <h3 className="text-lg font-medium text-gray-900">{t('cgu.sections.thirdParty.consent.title')}</h3>
              <p className="text-gray-700">
                {t('cgu.sections.thirdParty.consent.description')}
              </p>
            </div>
          </div>

          {/* Article 5 - Responsabilités */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('cgu.sections.responsibilities.title')}</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">{t('cgu.sections.responsibilities.developer.title')}</h3>
              <p className="text-gray-700">
                {t('cgu.sections.responsibilities.developer.description')}
              </p>

              <h3 className="text-lg font-medium text-gray-900">{t('cgu.sections.responsibilities.limitation.title')}</h3>
              <p className="text-gray-700 mb-2">{t('cgu.sections.responsibilities.limitation.description')}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                {Array.isArray(t('cgu.sections.responsibilities.limitation.items')) && 
                  (t('cgu.sections.responsibilities.limitation.items') as unknown as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h3 className="text-lg font-medium text-gray-900">{t('cgu.sections.responsibilities.user.title')}</h3>
              <p className="text-gray-700">
                {t('cgu.sections.responsibilities.user.description')}
              </p>
            </div>
          </div>

          {/* Article 6 - Propriété intellectuelle */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('cgu.sections.intellectualProperty.title')}</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                {t('cgu.sections.intellectualProperty.description1')}
              </p>
              <p className="text-gray-700">
                {t('cgu.sections.intellectualProperty.description2')}
              </p>
              <p className="text-gray-700">
                {t('cgu.sections.intellectualProperty.description3')}
              </p>
            </div>
          </div>

          {/* Article 7 - Évolution du service */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('cgu.sections.evolution.title')}</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">{t('cgu.sections.evolution.updates.title')}</h3>
              <p className="text-gray-700">
                {t('cgu.sections.evolution.updates.description')}
              </p>

              <h3 className="text-lg font-medium text-gray-900">{t('cgu.sections.evolution.cguEvolution.title')}</h3>
              <p className="text-gray-700">
                {t('cgu.sections.evolution.cguEvolution.description')}
              </p>

              <h3 className="text-lg font-medium text-gray-900">{t('cgu.sections.evolution.support.title')}</h3>
              <p className="text-gray-700">
                {t('cgu.sections.evolution.support.description')}
              </p>
            </div>
          </div>

          {/* Article 8 - Droit applicable */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('cgu.sections.law.title')}</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                {t('cgu.sections.law.description1')}
              </p>
              <p className="text-gray-700">
                {t('cgu.sections.law.description2')}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">{t('cgu.sections.contact.title')}</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                {t('cgu.sections.contact.description')}
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>{t('cgu.sections.contact.developer')}</strong><br/>
                  {t('cgu.sections.contact.role')}
                </p>
                <a
                  href="mailto:contact@antoineterrade.com"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  contact@antoineterrade.com
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm">
            <p>{t('cgu.footer.copyright')}</p>
            <p className="mt-1">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                {t('cgu.footer.backHome')}
              </Link>
              {' • '}
              <Link href="/about" className="text-blue-600 hover:text-blue-800">
                {t('cgu.footer.about')}
              </Link>
              {' • '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                {t('cgu.footer.privacy')}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}