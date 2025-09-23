import Link from 'next/link';
import { Calendar, FileText, Shield, Mail, ExternalLink } from 'lucide-react';

export default function CGUPage() {
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
            <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Conditions Générales d&apos;Utilisation</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dernière mise à jour : 15 janvier 2025
            </p>
          </div>

          {/* Article 1 - Objet */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Objet et champ d&apos;application</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;utilisation de l&apos;application 
                <strong> Planneo</strong>, un logiciel de gestion de planning horaire développé par Antoine Terrade.
              </p>
              <p className="text-gray-700">
                Planneo est une application web progressive (PWA) destinée à la gestion des plannings d&apos;équipe 
                pour les boutiques, commerces et entreprises de petite et moyenne taille.
              </p>
              <p className="text-gray-700">
                L&apos;utilisation de l&apos;application implique l&apos;acceptation pleine et entière des présentes CGU.
              </p>
            </div>
          </div>

          {/* Article 2 - Accès et utilisation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Accès et utilisation de l&apos;application</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">2.1 Accès gratuit</h3>
              <p className="text-gray-700">
                Planneo est accessible gratuitement sans inscription préalable. L&apos;application fonctionne 
                directement dans le navigateur web et peut être installée comme application native sur 
                mobile et desktop.
              </p>

              <h3 className="text-lg font-medium text-gray-900">2.2 Utilisation autorisée</h3>
              <p className="text-gray-700 mb-2">L&apos;utilisateur s&apos;engage à utiliser Planneo :</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Conformément aux présentes CGU</li>
                <li>Dans le respect des lois et réglementations en vigueur</li>
                <li>De manière loyale et de bonne foi</li>
                <li>Exclusivement pour la gestion de plannings professionnels</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900">2.3 Utilisation interdite</h3>
              <p className="text-gray-700 mb-2">Il est strictement interdit :</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>D&apos;utiliser l&apos;application à des fins illégales ou non autorisées</li>
                <li>De tenter de contourner les mesures de sécurité</li>
                <li>De reproduire, distribuer ou modifier le code source sans autorisation</li>
                <li>D&apos;utiliser l&apos;application pour nuire à des tiers</li>
                <li>De collecter des données d&apos;autres utilisateurs</li>
              </ul>
            </div>
          </div>

          {/* Article 3 - Données et confidentialité */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Données et confidentialité</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">3.1 Stockage local des données</h3>
              <p className="text-gray-700">
                Toutes les données saisies dans Planneo (noms d&apos;employés, plannings, paramètres) 
                sont stockées exclusivement sur l&apos;appareil de l&apos;utilisateur via le localStorage 
                du navigateur. Aucune donnée n&apos;est transmise vers nos serveurs.
              </p>

              <h3 className="text-lg font-medium text-gray-900">3.2 Responsabilité de l&apos;utilisateur</h3>
              <p className="text-gray-700 mb-2">L&apos;utilisateur est seul responsable :</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>De la sauvegarde de ses données</li>
                <li>De la sécurité de son appareil</li>
                <li>Du respect de la confidentialité des données de ses employés</li>
                <li>De la conformité au RGPD pour les données personnelles</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900">3.3 Export et portabilité</h3>
              <p className="text-gray-700">
                L&apos;utilisateur peut exporter ses données à tout moment via la fonction d&apos;export 
                intégrée à l&apos;application. Les données sont exportées au format JSON.
              </p>
            </div>
          </div>

          {/* Article 4 - Services tiers */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Services tiers et publicités</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">4.1 Google AdSense</h3>
              <p className="text-gray-700">
                Planneo est financé par des publicités Google AdSense. Ces publicités sont affichées 
                de manière non intrusive et respectent vos choix de consentement via notre système 
                de gestion des cookies.
              </p>

              <h3 className="text-lg font-medium text-gray-900">4.2 Analytics</h3>
              <p className="text-gray-700">
                Nous utilisons Vercel Analytics pour mesurer l&apos;utilisation de l&apos;application. 
                Ces données sont anonymisées et ne permettent pas d&apos;identifier les utilisateurs.
              </p>

              <h3 className="text-lg font-medium text-gray-900">4.3 Consentement</h3>
              <p className="text-gray-700">
                L&apos;activation des services tiers (publicités, analytics) nécessite votre 
                consentement explicite via notre bannière de cookies. Vous pouvez modifier 
                vos préférences à tout moment.
              </p>
            </div>
          </div>

          {/* Article 5 - Responsabilités */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Responsabilités et limitations</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">5.1 Responsabilité du développeur</h3>
              <p className="text-gray-700">
                Antoine Terrade s&apos;efforce de maintenir Planneo fonctionnel et sécurisé, mais ne peut 
                garantir une disponibilité à 100%. L&apos;application est fournie &quot;en l&apos;état&quot; 
                sans garantie de performance.
              </p>

              <h3 className="text-lg font-medium text-gray-900">5.2 Limitation de responsabilité</h3>
              <p className="text-gray-700 mb-2">En aucun cas, Antoine Terrade ne pourra être tenu responsable :</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>De la perte de données due à un dysfonctionnement de l&apos;appareil utilisateur</li>
                <li>Des dommages indirects ou consécutifs à l&apos;utilisation de l&apos;application</li>
                <li>De l&apos;interruption temporaire du service</li>
                <li>Des erreurs de planning dues à une mauvaise utilisation</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900">5.3 Responsabilité de l&apos;utilisateur</h3>
              <p className="text-gray-700">
                L&apos;utilisateur est seul responsable de l&apos;utilisation qu&apos;il fait de Planneo 
                et des conséquences qui en découlent. Il s&apos;engage à utiliser l&apos;application 
                de manière conforme à sa finalité.
              </p>
            </div>
          </div>

          {/* Article 6 - Propriété intellectuelle */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Propriété intellectuelle</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Planneo, son code source, son design, ses fonctionnalités et tous les éléments 
                qui le composent sont la propriété exclusive d&apos;Antoine Terrade.
              </p>
              <p className="text-gray-700">
                L&apos;utilisateur ne peut pas reproduire, distribuer, modifier ou créer des œuvres 
                dérivées basées sur Planneo sans autorisation écrite préalable.
              </p>
              <p className="text-gray-700">
                Les données saisies par l&apos;utilisateur restent sa propriété exclusive.
              </p>
            </div>
          </div>

          {/* Article 7 - Évolution du service */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Évolution et maintenance</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">7.1 Mises à jour</h3>
              <p className="text-gray-700">
                Planneo peut être mis à jour régulièrement pour améliorer les fonctionnalités, 
                corriger les bugs ou améliorer la sécurité. Les mises à jour sont automatiques 
                et gratuites.
              </p>

              <h3 className="text-lg font-medium text-gray-900">7.2 Évolution des CGU</h3>
              <p className="text-gray-700">
                Les présentes CGU peuvent être modifiées à tout moment. Les modifications 
                importantes seront notifiées aux utilisateurs via l&apos;application ou par email.
              </p>

              <h3 className="text-lg font-medium text-gray-900">7.3 Support technique</h3>
              <p className="text-gray-700">
                Le support technique est fourni sur base du meilleur effort via l&apos;adresse 
                email contact@antoineterrade.com. Aucun délai de réponse n&apos;est garanti.
              </p>
            </div>
          </div>

          {/* Article 8 - Droit applicable */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Droit applicable et juridiction</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Les présentes CGU sont régies par le droit français. En cas de litige, 
                les tribunaux français seront seuls compétents.
              </p>
              <p className="text-gray-700">
                En cas de différend, les parties s&apos;efforceront de trouver une solution 
                amiable avant tout recours judiciaire.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Contact</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                Pour toute question concernant ces Conditions Générales d&apos;Utilisation :
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Antoine Terrade</strong><br/>
                  Développeur de Planneo
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
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                Politique de confidentialité
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
