import Link from 'next/link';
import { Calendar, Shield, Database, Lock, Users, FileText, Mail, Github, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Planéo</h1>
            </Link>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Retour à l'accueil
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">À propos de Planéo</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Application de gestion de planning horaires pensée pour les boutiques et commerces.
              Simple, efficace et respectueuse de votre vie privée.
            </p>
          </div>

          {/* Comment ça fonctionne */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Database className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Comment ça fonctionne ?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">💾 Stockage local uniquement</h3>
                <p className="text-gray-600 mb-4">
                  Toutes vos données (utilisateurs, plannings, paramètres) sont stockées
                  directement sur votre appareil. Aucun serveur externe n'est utilisé.
                </p>

                <h3 className="text-lg font-medium text-gray-900 mb-2">🔒 Pas d'authentification</h3>
                <p className="text-gray-600">
                  Pas besoin de créer un compte ou de se connecter. L'application fonctionne
                  immédiatement après l'installation.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">📱 Application PWA</h3>
                <p className="text-gray-600 mb-4">
                  Progressive Web App installable sur mobile et desktop.
                  Fonctionne hors ligne une fois installée.
                </p>

                <h3 className="text-lg font-medium text-gray-900 mb-2">⚡ Performance optimale</h3>
                <p className="text-gray-600">
                  Interface rapide et fluide grâce aux technologies web modernes.
                  Aucun temps de chargement lié à internet.
                </p>
              </div>
            </div>
          </div>

          {/* Avantages de l'approche locale */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Pourquoi cette approche ?</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Lock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-2">Confidentialité totale</h3>
                <p className="text-sm text-gray-600">
                  Vos données restent sur votre appareil. Aucun risque de fuite ou d'accès non autorisé.
                </p>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-2">Indépendance</h3>
                <p className="text-sm text-gray-600">
                  Fonctionne sans internet une fois installée. Pas de dépendance à un service tiers.
                </p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-2">Simplicité</h3>
                <p className="text-sm text-gray-600">
                  Pas de comptes à créer, pas de mots de passe à gérer. Juste installer et utiliser.
                </p>
              </div>
            </div>
          </div>

          {/* RGPD */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Protection des données (RGPD)</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">✅ Conformité RGPD</h3>
                <p className="text-green-800">
                  Planéo est 100% conforme au RGPD car aucune donnée personnelle n'est collectée,
                  stockée ou transmise à des serveurs externes.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Données stockées localement :</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Noms des employés</li>
                    <li>• Horaires de travail</li>
                    <li>• Paramètres de l'application</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Aucune donnée collectée :</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Pas d'adresse IP</li>
                    <li>• Pas d'identifiant unique</li>
                    <li>• Pas de cookies de suivi</li>
                    <li>• Pas d'analyse d'usage</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* CGU */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Conditions Générales d'Utilisation</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">1. Objet</h3>
                <p className="text-gray-600">
                  Planéo est une application de gestion de planning horaires destinée à un usage personnel
                  et professionnel individuel.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">2. Licence d'utilisation</h3>
                <p className="text-gray-600">
                  Cette application est sous licence propriétaire. L'utilisation personnelle est autorisée,
                  mais toute utilisation commerciale est strictement interdite sans accord préalable.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">3. Responsabilités</h3>
                <p className="text-gray-600">
                  L'utilisateur est seul responsable des données qu'il saisit dans l'application.
                  Nous recommandons de sauvegarder régulièrement vos données importantes.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">4. Support technique</h3>
                <p className="text-gray-600">
                  Le support est fourni sur base du meilleur effort. Pour toute question technique,
                  contactez le développeur via les coordonnées ci-dessous.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Contact et Support</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Développeur</h3>
                <p className="text-gray-600 mb-2">
                  Antoine Terrade<br/>
                  Créateur de Planéo
                </p>

                <div className="space-y-2">
                  <a
                    href="mailto:antoine.terrada@gmail.com"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    antoine.terrada@gmail.com
                  </a>

                  <a
                    href="https://github.com/TonyLaPoche/planeo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-gray-800"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    Code source sur GitHub
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Support</h3>
                <p className="text-gray-600 mb-2">
                  Pour toute question concernant l'application, les fonctionnalités,
                  ou pour signaler un problème :
                </p>
                <p className="text-sm text-gray-500">
                  Réponse généralement sous 24-48h
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 Antoine Terrade. Tous droits réservés.</p>
            <p className="mt-1">
              <Link href="https://antoine.terrada@gmail.com" className="text-blue-600 hover:text-blue-800">
                antoine.terrada@gmail.com
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}