'use client';

import Link from 'next/link';
import { Calendar, Shield, Mail, ExternalLink, Lock, Eye, Database, Users } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function PrivacyPage() {
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
              ← {t('privacy.footer.backHome')}
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">

          {/* Hero Section */}
          <div className="text-center bg-white rounded-lg shadow-sm p-8">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('privacy.title')}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
              {t('privacy.subtitle')}
            </p>
            <p className="text-sm text-gray-500">
              {t('privacy.lastUpdated')}
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('privacy.sections.introduction.title')}</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                {t('privacy.sections.introduction.description1')}
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>{t('privacy.sections.introduction.description2')}</strong><br/>
                  {t('privacy.sections.introduction.description3')}
                </p>
              </div>
            </div>
          </div>

          {/* Data Collection */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('privacy.sections.dataCollection.title')}</h2>
            <div className="space-y-6">
              
              {/* Planning Data */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{t('privacy.sections.dataCollection.planningData.title')}</h3>
                <p className="text-gray-700 mb-3">{t('privacy.sections.dataCollection.planningData.description')}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {Array.isArray(t('privacy.sections.dataCollection.planningData.items')) && 
                    (t('privacy.sections.dataCollection.planningData.items') as unknown as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Technical Data */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{t('privacy.sections.dataCollection.technicalData.title')}</h3>
                <p className="text-gray-700 mb-3">{t('privacy.sections.dataCollection.technicalData.description')}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {Array.isArray(t('privacy.sections.dataCollection.technicalData.items')) && 
                    (t('privacy.sections.dataCollection.technicalData.items') as unknown as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* What we don't collect */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-red-800 mb-3">{t('privacy.sections.dataCollection.noPersonalData.title')}</h3>
                <ul className="list-disc list-inside text-red-700 space-y-1 ml-4">
                  {Array.isArray(t('privacy.sections.dataCollection.noPersonalData.items')) && 
                    (t('privacy.sections.dataCollection.noPersonalData.items') as unknown as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Data Usage */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('privacy.sections.dataUsage.title')}</h2>
            <div className="space-y-4">
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('privacy.sections.dataUsage.planningData.title')}</h3>
                <p className="text-gray-700">{t('privacy.sections.dataUsage.planningData.description')}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('privacy.sections.dataUsage.technicalData.title')}</h3>
                <p className="text-gray-700 mb-2">{t('privacy.sections.dataUsage.technicalData.description')}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {Array.isArray(t('privacy.sections.dataUsage.technicalData.items')) && 
                    (t('privacy.sections.dataUsage.technicalData.items') as unknown as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('privacy.sections.dataUsage.advertising.title')}</h3>
                <p className="text-gray-700">{t('privacy.sections.dataUsage.advertising.description')}</p>
              </div>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('privacy.sections.dataSharing.title')}</h2>
            <div className="space-y-4">
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800 mb-2">{t('privacy.sections.dataSharing.neverSell.title')}</h3>
                <p className="text-green-700">{t('privacy.sections.dataSharing.neverSell.description')}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{t('privacy.sections.dataSharing.thirdPartyServices.title')}</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-800">{t('privacy.sections.dataSharing.thirdPartyServices.adsense.title')}</h4>
                    <p className="text-gray-600 text-sm">{t('privacy.sections.dataSharing.thirdPartyServices.adsense.description')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{t('privacy.sections.dataSharing.thirdPartyServices.analytics.title')}</h4>
                    <p className="text-gray-600 text-sm">{t('privacy.sections.dataSharing.thirdPartyServices.analytics.description')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('privacy.sections.dataSharing.legalObligations.title')}</h3>
                <p className="text-gray-700">{t('privacy.sections.dataSharing.legalObligations.description')}</p>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('privacy.sections.security.title')}</h2>
            <div className="space-y-4">
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('privacy.sections.security.localStorage.title')}</h3>
                <p className="text-gray-700 mb-2">{t('privacy.sections.security.localStorage.description')}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {Array.isArray(t('privacy.sections.security.localStorage.items')) && 
                    (t('privacy.sections.security.localStorage.items') as unknown as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('privacy.sections.security.technicalMeasures.title')}</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {Array.isArray(t('privacy.sections.security.technicalMeasures.items')) && 
                    (t('privacy.sections.security.technicalMeasures.items') as unknown as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('privacy.sections.security.userResponsibility.title')}</h3>
                <p className="text-gray-700 mb-2">{t('privacy.sections.security.userResponsibility.description')}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {Array.isArray(t('privacy.sections.security.userResponsibility.items')) && 
                    (t('privacy.sections.security.userResponsibility.items') as unknown as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* GDPR Rights */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('privacy.sections.gdprRights.title')}</h2>
            <p className="text-gray-700 mb-4">{t('privacy.sections.gdprRights.description')}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">{t('privacy.sections.gdprRights.rights.access.title')}</h3>
                <p className="text-blue-700 text-sm">{t('privacy.sections.gdprRights.rights.access.description')}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">{t('privacy.sections.gdprRights.rights.rectification.title')}</h3>
                <p className="text-blue-700 text-sm">{t('privacy.sections.gdprRights.rights.rectification.description')}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">{t('privacy.sections.gdprRights.rights.erasure.title')}</h3>
                <p className="text-blue-700 text-sm">{t('privacy.sections.gdprRights.rights.erasure.description')}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">{t('privacy.sections.gdprRights.rights.portability.title')}</h3>
                <p className="text-blue-700 text-sm">{t('privacy.sections.gdprRights.rights.portability.description')}</p>
              </div>
            </div>

            <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">{t('privacy.sections.gdprRights.important.title')}</h3>
              <p className="text-yellow-700 text-sm">{t('privacy.sections.gdprRights.important.description')}</p>
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('privacy.sections.cookies.title')}</h2>
            <p className="text-gray-700 mb-4">{t('privacy.sections.cookies.description')}</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('privacy.sections.cookies.types.essential.title')}</h3>
                <p className="text-gray-700">{t('privacy.sections.cookies.types.essential.description')}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('privacy.sections.cookies.types.analytics.title')}</h3>
                <p className="text-gray-700">{t('privacy.sections.cookies.types.analytics.description')}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('privacy.sections.cookies.types.advertising.title')}</h3>
                <p className="text-gray-700">{t('privacy.sections.cookies.types.advertising.description')}</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('privacy.sections.cookies.management.title')}</h3>
              <p className="text-gray-700">{t('privacy.sections.cookies.management.description')}</p>
            </div>
          </div>

          {/* Data Retention */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('privacy.sections.dataRetention.title')}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('privacy.sections.dataRetention.planningData.title')}</h3>
                <p className="text-gray-700">{t('privacy.sections.dataRetention.planningData.description')}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('privacy.sections.dataRetention.technicalData.title')}</h3>
                <p className="text-gray-700">{t('privacy.sections.dataRetention.technicalData.description')}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('privacy.sections.dataRetention.cookies.title')}</h3>
                <p className="text-gray-700">{t('privacy.sections.dataRetention.cookies.description')}</p>
              </div>
            </div>
          </div>

          {/* Policy Changes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('privacy.sections.policyChanges.title')}</h2>
            <div className="space-y-4">
              <p className="text-gray-700">{t('privacy.sections.policyChanges.description1')}</p>
              <p className="text-gray-700">{t('privacy.sections.policyChanges.description2')}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">{t('privacy.sections.contact.title')}</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">{t('privacy.sections.contact.description')}</p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>{t('privacy.sections.contact.developer')}</strong><br/>
                  {t('privacy.sections.contact.role')}<br/>
                  <span className="text-sm text-gray-600">{t('privacy.sections.contact.responsibility')}</span>
                </p>
                <a
                  href="mailto:contact@antoineterrade.com"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  contact@antoineterrade.com
                </a>
                <p className="text-sm text-gray-600 mt-2">{t('privacy.sections.contact.responseTime')}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm">
            <p>{t('privacy.footer.copyright')}</p>
            <p className="mt-1">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                {t('privacy.footer.backHome')}
              </Link>
              {' • '}
              <Link href="/about" className="text-blue-600 hover:text-blue-800">
                {t('privacy.footer.about')}
              </Link>
              {' • '}
              <Link href="/cgu" className="text-blue-600 hover:text-blue-800">
                {t('privacy.footer.cgu')}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}