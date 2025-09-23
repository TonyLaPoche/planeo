import Link from 'next/link';
import { Calendar, Shield, Database, Lock, Mail, ExternalLink, Eye, EyeOff, Download } from 'lucide-react';

export default function PrivacyPage() {
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
              ← Retour à l&apos;accueil
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Politique de Confidentialité</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dernière mise à jour : 15 janvier 2025
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Notre engagement envers votre vie privée</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Chez Planneo, nous prenons votre vie privée très au sérieux. Cette politique de confidentialité 
                explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez 
                notre application de gestion de planning.
              </p>
              <p className="text-gray-700">
                <strong>Point important :</strong> Planneo fonctionne entièrement en local sur votre appareil. 
                Vos données de planning ne quittent jamais votre navigateur.
              </p>
            </div>
          </div>

          {/* Collecte de données */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Quelles données collectons-nous ?</h2>
            <div className="space-y-6">
              
              {/* Données de planning */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-lg font-medium text-green-900 mb-3 flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Données de planning (stockage local uniquement)
                </h3>
                <p className="text-green-800 mb-2">
                  Ces données sont stockées exclusivement sur votre appareil et ne sont jamais transmises :
                </p>
                <ul className="text-sm text-green-700 space-y-1 ml-4">
                  <li>• Noms des employés</li>
                  <li>• Horaires de travail et créneaux</li>
                  <li>• Paramètres de l&apos;application</li>
                  <li>• Notes et commentaires</li>
                  <li>• Configuration des magasins</li>
                </ul>
              </div>

              {/* Données techniques */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium text-blue-900 mb-3 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Données techniques (avec votre consentement)
                </h3>
                <p className="text-blue-800 mb-2">
                  Ces données ne sont collectées qu&apos;avec votre consentement explicite :
                </p>
                <ul className="text-sm text-blue-700 space-y-1 ml-4">
                  <li>• Pages consultées (anonymisées)</li>
                  <li>• Temps de session (anonyme)</li>
                  <li>• Type d&apos;appareil et navigateur</li>
                  <li>• Source de trafic</li>
                  <li>• Erreurs techniques (anonymisées)</li>
                </ul>
              </div>

              {/* Aucune donnée personnelle */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="text-lg font-medium text-purple-900 mb-3 flex items-center">
                  <EyeOff className="h-5 w-5 mr-2" />
                  Ce que nous ne collectons PAS
                </h3>
                <ul className="text-sm text-purple-700 space-y-1 ml-4">
                  <li>• Adresses email personnelles</li>
                  <li>• Numéros de téléphone</li>
                  <li>• Adresses IP (sauf pour la sécurité)</li>
                  <li>• Données de géolocalisation</li>
                  <li>• Informations de paiement</li>
                  <li>• Données biométriques</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Utilisation des données */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Comment utilisons-nous vos données ?</h2>
            <div className="space-y-4">
              
              <h3 className="text-lg font-medium text-gray-900">2.1 Données de planning</h3>
              <p className="text-gray-700">
                Vos données de planning sont utilisées uniquement pour faire fonctionner l&apos;application 
                sur votre appareil. Elles ne sont jamais transmises à nos serveurs.
              </p>

              <h3 className="text-lg font-medium text-gray-900">2.2 Données techniques (si acceptées)</h3>
              <p className="text-gray-700 mb-2">Nous utilisons ces données pour :</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Améliorer les performances de l&apos;application</li>
                <li>Identifier et corriger les bugs</li>
                <li>Comprendre l&apos;utilisation des fonctionnalités</li>
                <li>Optimiser l&apos;expérience utilisateur</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900">2.3 Publicités</h3>
              <p className="text-gray-700">
                Google AdSense peut afficher des publicités contextuelles basées sur le contenu de la page, 
                mais sans accès à vos données de planning personnelles.
              </p>
            </div>
          </div>

          {/* Partage des données */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Partage de vos données</h2>
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="text-lg font-medium text-red-900 mb-2">🚫 Nous ne vendons JAMAIS vos données</h3>
                <p className="text-red-800">
                  Vos données de planning ne sont jamais vendues, louées ou partagées avec des tiers 
                  à des fins commerciales.
                </p>
              </div>

              <h3 className="text-lg font-medium text-gray-900">3.1 Services tiers utilisés</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900">Google AdSense</h4>
                  <p className="text-sm text-gray-600">
                    Affiche des publicités contextuelles. Aucune donnée personnelle n&apos;est transmise.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900">Vercel Analytics</h4>
                  <p className="text-sm text-gray-600">
                    Mesure l&apos;utilisation de l&apos;application avec des données anonymisées.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-900">3.2 Obligations légales</h3>
              <p className="text-gray-700">
                Nous ne partagerons vos données qu&apos;en cas d&apos;obligation légale ou de demande 
                des autorités compétentes, dans le strict respect de la loi.
              </p>
            </div>
          </div>

          {/* Sécurité */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Sécurité de vos données</h2>
            <div className="space-y-4">
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-lg font-medium text-green-900 mb-3 flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Stockage local sécurisé
                </h3>
                <p className="text-green-800 mb-2">
                  Vos données sont protégées par :
                </p>
                <ul className="text-sm text-green-700 space-y-1 ml-4">
                  <li>• Chiffrement HTTPS pour toutes les communications</li>
                  <li>• Stockage local uniquement (localStorage)</li>
                  <li>• Aucune transmission vers nos serveurs</li>
                  <li>• Mises à jour de sécurité régulières</li>
                </ul>
              </div>

              <h3 className="text-lg font-medium text-gray-900">4.1 Mesures de sécurité techniques</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Certificats SSL/TLS pour le chiffrement</li>
                <li>Hébergement sécurisé sur Vercel</li>
                <li>Mises à jour régulières des dépendances</li>
                <li>Audits de sécurité périodiques</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900">4.2 Responsabilité de l&apos;utilisateur</h3>
              <p className="text-gray-700">
                Vous êtes responsable de la sécurité de votre appareil et de la sauvegarde 
                de vos données. Nous recommandons de :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Exporter régulièrement vos données</li>
                <li>Maintenir votre navigateur à jour</li>
                <li>Utiliser un antivirus à jour</li>
                <li>Ne pas partager votre appareil</li>
              </ul>
            </div>
          </div>

          {/* Droits RGPD */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Vos droits (RGPD)</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Conformément au Règlement Général sur la Protection des Données (RGPD), 
                vous disposez des droits suivants :
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">📋 Droit d&apos;accès</h3>
                  <p className="text-sm text-blue-800">
                    Consultez toutes vos données via l&apos;export JSON intégré à l&apos;application.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">✏️ Droit de rectification</h3>
                  <p className="text-sm text-green-800">
                    Modifiez vos données directement dans l&apos;application à tout moment.
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-medium text-red-900 mb-2">🗑️ Droit à l&apos;effacement</h3>
                  <p className="text-sm text-red-800">
                    Supprimez toutes vos données via les paramètres de l&apos;application.
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900 mb-2">📤 Droit à la portabilité</h3>
                  <p className="text-sm text-purple-800">
                    Exportez vos données au format JSON pour les utiliser ailleurs.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-medium text-yellow-900 mb-2">⚠️ Important</h3>
                <p className="text-yellow-800 text-sm">
                  Comme vos données sont stockées localement, la plupart de ces droits s&apos;exercent 
                  directement via l&apos;application. Pour les données techniques (analytics), 
                  contactez-nous à contact@antoineterrade.com.
                </p>
              </div>
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies et technologies similaires</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Planneo utilise des cookies uniquement pour améliorer votre expérience et 
                respecter vos choix de consentement.
              </p>

              <h3 className="text-lg font-medium text-gray-900">6.1 Types de cookies utilisés</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900">Cookies essentiels</h4>
                  <p className="text-sm text-gray-600">
                    Nécessaires au fonctionnement de l&apos;application (préférences de langue, 
                    paramètres de consentement).
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900">Cookies d&apos;analytics (optionnels)</h4>
                  <p className="text-sm text-gray-600">
                    Mesurent l&apos;utilisation de l&apos;application (Vercel Analytics).
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900">Cookies publicitaires (optionnels)</h4>
                  <p className="text-sm text-gray-600">
                    Affichent des publicités contextuelles (Google AdSense).
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-900">6.2 Gestion de vos préférences</h3>
              <p className="text-gray-700">
                Vous pouvez modifier vos préférences de cookies à tout moment via notre 
                bannière de consentement ou en nous contactant.
              </p>
            </div>
          </div>

          {/* Conservation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Durée de conservation</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">7.1 Données de planning</h3>
              <p className="text-gray-700">
                Vos données de planning sont conservées indéfiniment sur votre appareil 
                jusqu&apos;à ce que vous les supprimiez manuellement.
              </p>

              <h3 className="text-lg font-medium text-gray-900">7.2 Données techniques</h3>
              <p className="text-gray-700">
                Les données d&apos;analytics sont conservées pendant 24 mois maximum, 
                puis supprimées automatiquement.
              </p>

              <h3 className="text-lg font-medium text-gray-900">7.3 Cookies</h3>
              <p className="text-gray-700">
                Les cookies expirent automatiquement selon leur type (session, 30 jours, 1 an).
              </p>
            </div>
          </div>

          {/* Modifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Modifications de cette politique</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Nous pouvons modifier cette politique de confidentialité pour refléter 
                les changements dans nos pratiques ou pour d&apos;autres raisons opérationnelles, 
                légales ou réglementaires.
              </p>
              <p className="text-gray-700">
                Les modifications importantes seront notifiées via l&apos;application 
                ou par email si vous nous avez fourni votre adresse.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Contact et questions</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                Pour toute question concernant cette politique de confidentialité ou 
                l&apos;utilisation de vos données :
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Antoine Terrade</strong><br/>
                  Développeur de Planneo<br/>
                  Responsable du traitement des données
                </p>
                <a
                  href="mailto:contact@antoineterrade.com"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  contact@antoineterrade.com
                </a>
              </div>
              <p className="text-sm text-gray-600">
                Réponse généralement sous 24-48h
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 Antoine Terrade. Tous droits réservés.</p>
            <p className="mt-1">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Retour à l&apos;accueil
              </Link>
              {' • '}
              <Link href="/about" className="text-blue-600 hover:text-blue-800">
                À propos
              </Link>
              {' • '}
              <Link href="/cgu" className="text-blue-600 hover:text-blue-800">
                CGU
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
