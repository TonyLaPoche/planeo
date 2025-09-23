'use client';

import Link from 'next/link';
import { Calendar, Shield, Mail, ExternalLink, Lock, Eye, Database, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function SecurityPage() {
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
              ← {t('security.footer.backHome')}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('security.title')}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
              {t('security.subtitle')}
            </p>
            <p className="text-sm text-gray-500">
              {t('security.lastUpdated')}
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('security.sections.introduction.title')}</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                {t('security.sections.introduction.description1')}
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>{t('security.sections.introduction.description2')}</strong><br/>
                  {t('security.sections.introduction.description3')}
                </p>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('security.sections.dataProtection.title')}</h2>
            <div className="space-y-6">
              
              {/* Local Storage */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{t('security.sections.dataProtection.localStorage.title')}</h3>
                <p className="text-gray-700 mb-3">{t('security.sections.dataProtection.localStorage.description')}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {Array.isArray(t('security.sections.dataProtection.localStorage.features')) && 
                    (t('security.sections.dataProtection.localStorage.features') as unknown as string[]).map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                </ul>
              </div>

              {/* Encryption */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{t('security.sections.dataProtection.encryption.title')}</h3>
                <p className="text-gray-700 mb-3">{t('security.sections.dataProtection.encryption.description')}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {Array.isArray(t('security.sections.dataProtection.encryption.features')) && 
                    (t('security.sections.dataProtection.encryption.features') as unknown as string[]).map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                </ul>
              </div>

              {/* No Tracking */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-3">{t('security.sections.dataProtection.noTracking.title')}</h3>
                <p className="text-blue-700 mb-3">{t('security.sections.dataProtection.noTracking.description')}</p>
                <ul className="list-disc list-inside text-blue-700 space-y-1 ml-4">
                  {Array.isArray(t('security.sections.dataProtection.noTracking.features')) && 
                    (t('security.sections.dataProtection.noTracking.features') as unknown as string[]).map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          {/* GDPR Compliance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('security.sections.gdprCompliance.title')}</h2>
            <p className="text-gray-700 mb-6">{t('security.sections.gdprCompliance.description')}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">{t('security.sections.gdprCompliance.principles.lawfulness.title')}</h3>
                <p className="text-green-700 text-sm">{t('security.sections.gdprCompliance.principles.lawfulness.description')}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">{t('security.sections.gdprCompliance.principles.transparency.title')}</h3>
                <p className="text-green-700 text-sm">{t('security.sections.gdprCompliance.principles.transparency.description')}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">{t('security.sections.gdprCompliance.principles.minimization.title')}</h3>
                <p className="text-green-700 text-sm">{t('security.sections.gdprCompliance.principles.minimization.description')}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">{t('security.sections.gdprCompliance.principles.accuracy.title')}</h3>
                <p className="text-green-700 text-sm">{t('security.sections.gdprCompliance.principles.accuracy.description')}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">{t('security.sections.gdprCompliance.principles.storage.title')}</h3>
                <p className="text-green-700 text-sm">{t('security.sections.gdprCompliance.principles.storage.description')}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">{t('security.sections.gdprCompliance.principles.security.title')}</h3>
                <p className="text-green-700 text-sm">{t('security.sections.gdprCompliance.principles.security.description')}</p>
              </div>
            </div>
          </div>

          {/* Technical Security */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('security.sections.technicalSecurity.title')}</h2>
            <div className="space-y-6">
              
              {/* Infrastructure */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{t('security.sections.technicalSecurity.infrastructure.title')}</h3>
                <p className="text-gray-700 mb-3">{t('security.sections.technicalSecurity.infrastructure.description')}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {Array.isArray(t('security.sections.technicalSecurity.infrastructure.features')) && 
                    (t('security.sections.technicalSecurity.infrastructure.features') as unknown as string[]).map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                </ul>
              </div>

              {/* Code Security */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{t('security.sections.technicalSecurity.codeSecurity.title')}</h3>
                <p className="text-gray-700 mb-3">{t('security.sections.technicalSecurity.codeSecurity.description')}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {Array.isArray(t('security.sections.technicalSecurity.codeSecurity.features')) && 
                    (t('security.sections.technicalSecurity.codeSecurity.features') as unknown as string[]).map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                </ul>
              </div>

              {/* Browser Security */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{t('security.sections.technicalSecurity.browserSecurity.title')}</h3>
                <p className="text-gray-700 mb-3">{t('security.sections.technicalSecurity.browserSecurity.description')}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {Array.isArray(t('security.sections.technicalSecurity.browserSecurity.features')) && 
                    (t('security.sections.technicalSecurity.browserSecurity.features') as unknown as string[]).map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          {/* User Responsibility */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('security.sections.userResponsibility.title')}</h2>
            <p className="text-gray-700 mb-6">{t('security.sections.userResponsibility.description')}</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-3">{t('security.sections.userResponsibility.recommendations.device.title')}</h3>
                <ul className="list-disc list-inside text-yellow-700 space-y-1 text-sm">
                  {Array.isArray(t('security.sections.userResponsibility.recommendations.device.items')) && 
                    (t('security.sections.userResponsibility.recommendations.device.items') as unknown as string[]).map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-3">{t('security.sections.userResponsibility.recommendations.data.title')}</h3>
                <ul className="list-disc list-inside text-yellow-700 space-y-1 text-sm">
                  {Array.isArray(t('security.sections.userResponsibility.recommendations.data.items')) && 
                    (t('security.sections.userResponsibility.recommendations.data.items') as unknown as string[]).map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-3">{t('security.sections.userResponsibility.recommendations.access.title')}</h3>
                <ul className="list-disc list-inside text-yellow-700 space-y-1 text-sm">
                  {Array.isArray(t('security.sections.userResponsibility.recommendations.access.items')) && 
                    (t('security.sections.userResponsibility.recommendations.access.items') as unknown as string[]).map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Incident Response */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('security.sections.incidentResponse.title')}</h2>
            <p className="text-gray-700 mb-6">{t('security.sections.incidentResponse.description')}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium text-red-800 mb-2">{t('security.sections.incidentResponse.procedures.detection.title')}</h3>
                <p className="text-red-700 text-sm">{t('security.sections.incidentResponse.procedures.detection.description')}</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium text-red-800 mb-2">{t('security.sections.incidentResponse.procedures.response.title')}</h3>
                <p className="text-red-700 text-sm">{t('security.sections.incidentResponse.procedures.response.description')}</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium text-red-800 mb-2">{t('security.sections.incidentResponse.procedures.notification.title')}</h3>
                <p className="text-red-700 text-sm">{t('security.sections.incidentResponse.procedures.notification.description')}</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium text-red-800 mb-2">{t('security.sections.incidentResponse.procedures.recovery.title')}</h3>
                <p className="text-red-700 text-sm">{t('security.sections.incidentResponse.procedures.recovery.description')}</p>
              </div>
            </div>
          </div>

          {/* Audit */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('security.sections.audit.title')}</h2>
            <p className="text-gray-700 mb-6">{t('security.sections.audit.description')}</p>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">{t('security.sections.audit.audits.code.title')}</h3>
                <p className="text-blue-700 text-sm">{t('security.sections.audit.audits.code.description')}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">{t('security.sections.audit.audits.infrastructure.title')}</h3>
                <p className="text-blue-700 text-sm">{t('security.sections.audit.audits.infrastructure.description')}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">{t('security.sections.audit.audits.compliance.title')}</h3>
                <p className="text-blue-700 text-sm">{t('security.sections.audit.audits.compliance.description')}</p>
              </div>
            </div>
          </div>

          {/* Commitment */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('security.sections.commitment.title')}</h2>
            <p className="text-gray-700 mb-6">{t('security.sections.commitment.description')}</p>
            
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              {Array.isArray(t('security.sections.commitment.commitments')) && 
                (t('security.sections.commitment.commitments') as unknown as string[]).map((commitment: string, index: number) => (
                  <li key={index}>{commitment}</li>
                ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">{t('security.sections.contact.title')}</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">{t('security.sections.contact.description')}</p>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>{t('security.sections.contact.developer')}</strong><br/>
                  {t('security.sections.contact.role')}
                </p>
                <a
                  href="mailto:contact@antoineterrade.com"
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  {t('security.sections.contact.email')}
                </a>
                <p className="text-sm text-red-600 mt-2">{t('security.sections.contact.responseTime')}</p>
                <p className="text-sm text-red-600 mt-2">{t('security.sections.contact.disclosure')}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm">
            <p>{t('security.footer.copyright')}</p>
            <p className="mt-1">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                {t('security.footer.backHome')}
              </Link>
              {' • '}
              <Link href="/about" className="text-blue-600 hover:text-blue-800">
                {t('security.footer.about')}
              </Link>
              {' • '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                {t('security.footer.privacy')}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}