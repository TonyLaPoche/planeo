'use client';

import Link from 'next/link';
import { Calendar, User, Mail, ExternalLink, Shield, Code, Coffee, Heart, CheckCircle, Star } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function AboutPage() {
  const { t: tRaw } = useTranslation();
  
  // Helper function to ensure we get a string from translation
  const t = (key: string, params?: Record<string, string | number>): string => {
    const result = tRaw(key, params);
    return typeof result === 'string' ? result : key;
  };
  
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
              ← {t('about.footer.backHome')}
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">

          {/* Hero Section */}
          <div className="text-center bg-white rounded-lg shadow-sm p-8">
            <Calendar className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('about.title')}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>

          {/* Hero Content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('about.sections.hero.title')}</h2>
            <p className="text-gray-700 mb-6">{t('about.sections.hero.description')}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {Array.isArray(t('about.sections.hero.features')) && 
                (t('about.sections.hero.features') as unknown as string[]).map((feature: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Developer Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('about.sections.developer.title')}</h2>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-16 w-16 text-blue-600" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('about.sections.developer.name')}</h3>
                <p className="text-lg text-blue-600 mb-2">{t('about.sections.developer.role')}</p>
                <p className="text-gray-600 mb-4">{t('about.sections.developer.experience')}</p>
                <p className="text-gray-700 mb-4">{t('about.sections.developer.bio')}</p>
                
                <div className="space-y-2">
                  <div>
                    <strong className="text-gray-900">{t('about.sections.developer.specialization')}</strong>
                  </div>
                  <div>
                    <strong className="text-gray-900">Mission :</strong> <span className="text-gray-700">{t('about.sections.developer.mission')}</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Vision :</strong> <span className="text-gray-700">{t('about.sections.developer.vision')}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Valeurs :</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {Array.isArray(t('about.sections.developer.values')) && 
                      (t('about.sections.developer.values') as unknown as string[]).map((value: string, index: number) => (
                        <li key={index}>{value}</li>
                      ))}
                  </ul>
                </div>
                
                <div className="mt-4">
                  <a
                    href={`mailto:${t('about.sections.developer.contact')}`}
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{t('about.sections.developer.contact')}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {t('about.sections.story.title')}
            </h2>
            
            <div className="space-y-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-red-800 mb-2">{t('about.sections.story.problem.title')}</h3>
                <p className="text-red-700">{t('about.sections.story.problem.description')}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800 mb-2">{t('about.sections.story.solution.title')}</h3>
                <p className="text-green-700">{t('about.sections.story.solution.description')}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">{t('about.sections.story.mission.title')}</h3>
                <p className="text-blue-700">{t('about.sections.story.mission.description')}</p>
              </div>
            </div>
          </div>

          {/* Economic Model */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('about.sections.economicModel.title')}</h2>
            <p className="text-gray-700 mb-6">{t('about.sections.economicModel.description')}</p>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('about.sections.economicModel.funding.adsense.title')}</h3>
                <p className="text-gray-700 mb-2">{t('about.sections.economicModel.funding.adsense.description')}</p>
                <span className="inline-block bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded">
                  {t('about.sections.economicModel.funding.adsense.status')}
                </span>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('about.sections.economicModel.funding.donations.title')}</h3>
                <p className="text-gray-700 mb-2">{t('about.sections.economicModel.funding.donations.description')}</p>
                <a
                  href="https://buymeacoffee.com/antoineterrade"
                    target="_blank"
                    rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Coffee className="h-4 w-4" />
                  <span>{t('about.sections.economicModel.funding.donations.link')}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('about.sections.economicModel.funding.enterprise.title')}</h3>
                <p className="text-gray-700">{t('about.sections.economicModel.funding.enterprise.description')}</p>
              </div>
            </div>
            
            <div className="mt-6 bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-800 mb-3">{t('about.sections.economicModel.commitment.title')}</h3>
              <p className="text-green-700 mb-3">{t('about.sections.economicModel.commitment.description')}</p>
              <ul className="list-disc list-inside text-green-700 space-y-1">
                {(() => {
                  const promises = tRaw('about.sections.economicModel.commitment.promises');
                  if (Array.isArray(promises)) {
                    return promises.map((promise: string, index: number) => (
                      <li key={index}>{promise}</li>
                    ));
                  } else {
                    // Fallback si la traduction ne fonctionne pas
                    return [
                      "Planneo restera toujours gratuit et fonctionnel",
                      "Aucune fonctionnalité de base ne sera payante", 
                      "Aucune donnée ne sera vendue ou partagée",
                      "Transparence totale sur le financement et l'évolution",
                      "Écoute active des retours utilisateurs pour améliorer l'outil",
                      "Respect de votre vie privée et de vos données",
                      "Développement continu dans la mesure de mes capacités"
                    ].map((promise: string, index: number) => (
                      <li key={index}>{promise}</li>
                    ));
                  }
                })()}
              </ul>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('about.sections.features.title')}</h2>
            <p className="text-gray-700 mb-6">{t('about.sections.features.description')}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {(() => {
                const features = tRaw('about.sections.features.list');
                if (Array.isArray(features)) {
                  return features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ));
                }
                return null;
              })()}
            </div>
                  </div>

          {/* Technology Stack */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('about.sections.technology.title')}</h2>
            <p className="text-gray-700 mb-6">{t('about.sections.technology.description')}</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-3">{t('about.sections.technology.stack.frontend.title')}</h3>
                <div className="space-y-1">
                  {(() => {
                    const technologies = tRaw('about.sections.technology.stack.frontend.technologies');
                    if (Array.isArray(technologies)) {
                      return technologies.map((tech: string, index: number) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mr-1 mb-1">
                          {tech}
                        </span>
                      ));
                    } else {
                      // Fallback si la traduction ne fonctionne pas
                      return ["React", "Next.js", "TypeScript", "Tailwind CSS"].map((tech: string, index: number) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mr-1 mb-1">
                          {tech}
                        </span>
                      ));
                    }
                  })()}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-3">{t('about.sections.technology.stack.backend.title')}</h3>
                <div className="space-y-1">
                  {(() => {
                    const technologies = tRaw('about.sections.technology.stack.backend.technologies');
                    if (Array.isArray(technologies)) {
                      return technologies.map((tech: string, index: number) => (
                        <span key={index} className="inline-block bg-green-100 text-green-800 text-sm px-2 py-1 rounded mr-1 mb-1">
                          {tech}
                        </span>
                      ));
                    } else {
                      // Fallback si la traduction ne fonctionne pas
                      return ["Vercel", "Serverless Functions", "Edge Computing"].map((tech: string, index: number) => (
                        <span key={index} className="inline-block bg-green-100 text-green-800 text-sm px-2 py-1 rounded mr-1 mb-1">
                          {tech}
                        </span>
                      ));
                    }
                  })()}
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium text-red-800 mb-3">{t('about.sections.technology.stack.security.title')}</h3>
                <div className="space-y-1">
                  {(() => {
                    const technologies = tRaw('about.sections.technology.stack.security.technologies');
                    if (Array.isArray(technologies)) {
                      return technologies.map((tech: string, index: number) => (
                        <span key={index} className="inline-block bg-red-100 text-red-800 text-sm px-2 py-1 rounded mr-1 mb-1">
                          {tech}
                        </span>
                      ));
                    } else {
                      // Fallback si la traduction ne fonctionne pas
                      return ["HTTPS/TLS", "CSP", "Local Storage", "GDPR Compliant"].map((tech: string, index: number) => (
                        <span key={index} className="inline-block bg-red-100 text-red-800 text-sm px-2 py-1 rounded mr-1 mb-1">
                          {tech}
                        </span>
                      ));
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Roadmap */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('about.sections.roadmap.title')}</h2>
            <p className="text-gray-700 mb-6">{t('about.sections.roadmap.description')}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {(() => {
                const upcoming = tRaw('about.sections.roadmap.upcoming');
                if (Array.isArray(upcoming)) {
                  return upcoming.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Code className="h-5 w-5 text-blue-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ));
                } else {
                  // Fallback si la traduction ne fonctionne pas
                  return [
                    "Intégration Google AdSense",
                    "Thèmes personnalisables", 
                    "Notifications push",
                    "Synchronisation multi-appareils",
                    "Rapports et statistiques",
                    "API pour intégrations tierces"
                  ].map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Code className="h-5 w-5 text-blue-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ));
                }
              })()}
            </div>
            </div>

          {/* Commitment */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('about.sections.economicModel.commitment.title')}</h2>
            <p className="text-gray-700 mb-6">{t('about.sections.economicModel.commitment.description')}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {(() => {
                const promises = tRaw('about.sections.economicModel.commitment.promises');
                if (Array.isArray(promises)) {
                  return promises.map((promise: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{promise}</span>
                    </div>
                  ));
                } else {
                  // Fallback si la traduction ne fonctionne pas
                  return [
                    "Planneo restera toujours gratuit et fonctionnel",
                    "Aucune fonctionnalité de base ne sera payante", 
                    "Aucune donnée ne sera vendue ou partagée",
                    "Transparence totale sur le financement et l'évolution",
                    "Écoute active des retours utilisateurs pour améliorer l'outil",
                    "Respect de votre vie privée et de vos données",
                    "Développement continu dans la mesure de mes capacités"
                  ].map((promise: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{promise}</span>
                    </div>
                  ));
                }
              })()}
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('about.sections.support.title')}</h2>
            <p className="text-gray-700 mb-6">{t('about.sections.support.description')}</p>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">{t('about.sections.support.channels.email.title')}</h3>
                <p className="text-blue-700 mb-2">{t('about.sections.support.channels.email.description')}</p>
                <p className="text-sm text-blue-600">{t('about.sections.support.channels.email.responseTime')}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">{t('about.sections.support.channels.feedback.title')}</h3>
                <p className="text-green-700">{t('about.sections.support.channels.feedback.description')}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm">
            <p>{t('about.footer.copyright')}</p>
            <p className="mt-1">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                {t('about.footer.backHome')}
              </Link>
              {' • '}
              <Link href="/cgu" className="text-blue-600 hover:text-blue-800">
                {t('about.footer.cgu')}
              </Link>
              {' • '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                {t('about.footer.privacy')}
              </Link>
              {' • '}
              <Link href="/security" className="text-blue-600 hover:text-blue-800">
                {t('about.footer.security')}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}