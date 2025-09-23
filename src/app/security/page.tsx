import Link from 'next/link';
import { Calendar, Shield, Lock, Database, Eye, EyeOff, CheckCircle, AlertTriangle, Download, Mail, ExternalLink } from 'lucide-react';

export default function SecurityPage() {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sécurité & Confidentialité</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Votre sécurité et votre vie privée sont nos priorités absolues
            </p>
          </div>

          {/* Principes de sécurité */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nos principes de sécurité</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <Lock className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-medium text-green-900 mb-2">Chiffrement total</h3>
                <p className="text-sm text-green-800">
                  Toutes les communications sont chiffrées en HTTPS/TLS
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Database className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-medium text-blue-900 mb-2">Stockage local</h3>
                <p className="text-sm text-blue-800">
                  Vos données restent sur votre appareil uniquement
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <EyeOff className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-medium text-purple-900 mb-2">Aucun tracking</h3>
                <p className="text-sm text-purple-800">
                  Pas de suivi de votre navigation ou de vos données
                </p>
              </div>
            </div>
          </div>

          {/* Protection des données */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🛡️ Protection de vos données</h2>
            <div className="space-y-6">
              
              {/* Stockage local */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-lg font-medium text-green-900 mb-3 flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Stockage local exclusif
                </h3>
                <p className="text-green-800 mb-3">
                  <strong>Vos données ne quittent jamais votre appareil.</strong> Elles sont stockées 
                  dans le localStorage de votre navigateur, accessible uniquement par vous.
                </p>
                <ul className="text-sm text-green-700 space-y-1 ml-4">
                  <li>• Aucune transmission vers nos serveurs</li>
                  <li>• Aucune synchronisation cloud</li>
                  <li>• Aucune base de données externe</li>
                  <li>• Contrôle total de vos données</li>
                </ul>
              </div>

              {/* Chiffrement */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium text-blue-900 mb-3 flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Chiffrement et sécurité
                </h3>
                <p className="text-blue-800 mb-3">
                  Toutes les communications entre votre navigateur et nos serveurs sont chiffrées 
                  avec les standards les plus élevés de l&apos;industrie.
                </p>
                <ul className="text-sm text-blue-700 space-y-1 ml-4">
                  <li>• Chiffrement TLS 1.3 (HTTPS)</li>
                  <li>• Certificats SSL valides</li>
                  <li>• Hébergement sécurisé (Vercel)</li>
                  <li>• Mises à jour de sécurité automatiques</li>
                </ul>
              </div>

              {/* Aucun tracking */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="text-lg font-medium text-purple-900 mb-3 flex items-center">
                  <EyeOff className="h-5 w-5 mr-2" />
                  Aucun tracking ou surveillance
                </h3>
                <p className="text-purple-800 mb-3">
                  Nous ne surveillons pas votre utilisation de l&apos;application. 
                  Votre vie privée est respectée à 100%.
                </p>
                <ul className="text-sm text-purple-700 space-y-1 ml-4">
                  <li>• Pas de cookies de tracking</li>
                  <li>• Pas d&apos;analytics intrusives</li>
                  <li>• Pas de collecte de données personnelles</li>
                  <li>• Pas de profilage utilisateur</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Conformité RGPD */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">📋 Conformité RGPD totale</h2>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-lg font-medium text-green-900 mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  ✅ Conformité RGPD garantie
                </h3>
                <p className="text-green-800">
                  Planneo est entièrement conforme au Règlement Général sur la Protection des Données (RGPD). 
                  Vos données de planning restent exclusivement sur votre appareil.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Vos droits respectés :</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Droit d&apos;accès à vos données</li>
                    <li>• Droit de rectification</li>
                    <li>• Droit à l&apos;effacement</li>
                    <li>• Droit à la portabilité</li>
                    <li>• Droit d&apos;opposition</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Nos engagements :</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Consentement explicite requis</li>
                    <li>• Transparence totale</li>
                    <li>• Minimisation des données</li>
                    <li>• Sécurité par design</li>
                    <li>• Responsabilité et traçabilité</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Services avec consentement */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔧 Services avec consentement</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Certains services tiers sont utilisés pour améliorer l&apos;expérience utilisateur, 
                mais uniquement avec votre consentement explicite via notre bannière de cookies.
              </p>

              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="text-lg font-medium text-yellow-900 mb-2">📊 Vercel Analytics (optionnel)</h3>
                  <p className="text-yellow-800 text-sm mb-2">
                    Mesure l&apos;utilisation de l&apos;application avec des données anonymisées :
                  </p>
                  <ul className="text-sm text-yellow-700 space-y-1 ml-4">
                    <li>• Pages consultées (anonymes)</li>
                    <li>• Temps de session (anonyme)</li>
                    <li>• Erreurs techniques (anonymisées)</li>
                    <li>• Type d&apos;appareil/navigateur</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-medium text-orange-900 mb-2">💰 Google AdSense (optionnel)</h3>
                  <p className="text-orange-800 text-sm mb-2">
                    Affiche des publicités contextuelles pour financer le développement :
                  </p>
                  <ul className="text-sm text-orange-700 space-y-1 ml-4">
                    <li>• Publicités non intrusives</li>
                    <li>• Respect de vos choix de consentement</li>
                    <li>• Aucune collecte de données personnelles</li>
                    <li>• Financement du projet gratuit</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium text-blue-900 mb-2">🎛️ Contrôle total</h3>
                <p className="text-blue-800 text-sm">
                  Vous pouvez activer/désactiver ces services à tout moment via notre bannière 
                  de consentement ou en nous contactant. Vos données de planning ne sont jamais 
                  affectées par ces services.
                </p>
              </div>
            </div>
          </div>

          {/* Sécurité technique */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔒 Sécurité technique</h2>
            <div className="space-y-4">
              
              <h3 className="text-lg font-medium text-gray-900">Infrastructure sécurisée</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900">Hébergement</h4>
                  <p className="text-sm text-gray-600">Vercel (sécurité de niveau entreprise)</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900">Certificats SSL</h4>
                  <p className="text-sm text-gray-600">Renouvelés automatiquement</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900">Mises à jour</h4>
                  <p className="text-sm text-gray-600">Automatiques et régulières</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900">Monitoring</h4>
                  <p className="text-sm text-gray-600">Surveillance 24/7</p>
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-900">Bonnes pratiques de développement</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Code source audité régulièrement</li>
                <li>Dépendances mises à jour automatiquement</li>
                <li>Tests de sécurité automatisés</li>
                <li>Principe du moindre privilège</li>
                <li>Sécurité par design (Privacy by Design)</li>
              </ul>
            </div>
          </div>

          {/* Sauvegarde et récupération */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">💾 Sauvegarde et récupération</h2>
            <div className="space-y-4">
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-lg font-medium text-green-900 mb-3 flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Export de vos données
                </h3>
                <p className="text-green-800 mb-3">
                  Vous pouvez exporter toutes vos données à tout moment via l&apos;interface 
                  de l&apos;application (Paramètres → Export des données).
                </p>
                <ul className="text-sm text-green-700 space-y-1 ml-4">
                  <li>• Format JSON lisible</li>
                  <li>• Toutes vos données incluses</li>
                  <li>• Compatible avec d&apos;autres outils</li>
                  <li>• Aucune perte d&apos;information</li>
                </ul>
              </div>

              <h3 className="text-lg font-medium text-gray-900">Recommandations de sauvegarde</h3>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Important
                </h4>
                <p className="text-yellow-800 text-sm mb-2">
                  Comme vos données sont stockées localement, nous vous recommandons de :
                </p>
                <ul className="text-sm text-yellow-700 space-y-1 ml-4">
                  <li>• Exporter régulièrement vos données</li>
                  <li>• Sauvegarder le fichier JSON exporté</li>
                  <li>• Tester la restauration périodiquement</li>
                  <li>• Garder plusieurs copies de sauvegarde</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Transparence */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔍 Transparence totale</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Nous croyons en la transparence totale. Voici tout ce que vous devez savoir 
                sur la sécurité de Planneo :
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Ce que nous faisons :</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Stockage local uniquement</li>
                    <li>• Chiffrement HTTPS</li>
                    <li>• Mises à jour de sécurité</li>
                    <li>• Code source audité</li>
                    <li>• Respect du RGPD</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Ce que nous ne faisons PAS :</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Collecte de données personnelles</li>
                    <li>• Tracking de navigation</li>
                    <li>• Vente de données</li>
                    <li>• Profilage utilisateur</li>
                    <li>• Surveillance cachée</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contact sécurité */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Contact sécurité</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                Pour toute question concernant la sécurité de Planneo ou pour signaler 
                une vulnérabilité :
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Antoine Terrade</strong><br/>
                  Développeur de Planneo<br/>
                  Responsable sécurité
                </p>
                <a
                  href="mailto:contact@antoineterrade.com?subject=Question sécurité Planneo"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  contact@antoineterrade.com
                </a>
              </div>
              <p className="text-sm text-gray-600">
                Nous prenons la sécurité très au sérieux. Toute vulnérabilité signalée 
                sera traitée en priorité.
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
              {' • '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                Confidentialité
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
