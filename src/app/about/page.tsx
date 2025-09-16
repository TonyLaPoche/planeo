import Link from 'next/link';
import { Calendar, Shield, Database, Lock, Users, FileText, Mail, Github, ExternalLink, Download, Coffee } from 'lucide-react';

export default function AboutPage() {
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
            <Calendar className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">À propos de Planneo</h1>
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
                  directement sur votre appareil. Aucun serveur externe n&apos;est utilisé.
                </p>

                <h3 className="text-lg font-medium text-gray-900 mb-2">🔒 Pas d&apos;authentification</h3>
                <p className="text-gray-600">
                  Pas besoin de créer un compte ou de se connecter. L&apos;application fonctionne
                  immédiatement après l&apos;installation.
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
                  Vos données restent sur votre appareil. Aucun risque de fuite ou d&apos;accès non autorisé.
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

          {/* Installation PWA */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Download className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Installation de l&apos;application</h2>
            </div>

            <div className="mb-4">
              <p className="text-gray-600">
                Planneo peut être installé sur votre appareil comme une application native.
                L&apos;installation permet d&apos;accéder à l&apos;app hors ligne et offre une expérience utilisateur optimale.
              </p>
            </div>

            {/* Instructions par plateforme */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* Android/Chrome */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold text-sm">A</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Android / Chrome</h3>
                </div>

                <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm">
                  <li>Ouvrez Planneo dans Chrome</li>
                  <li>Appuyez sur les trois points ⋮ en haut à droite</li>
                  <li>Sélectionnez &quot;Ajouter à l&apos;écran d&apos;accueil&quot;</li>
                  <li>Confirmez l&apos;installation</li>
                </ol>

                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-800 text-sm">
                    💡 <strong>Conseil :</strong> L&apos;app apparaîtra sur votre écran d&apos;accueil comme une application native.
                  </p>
                </div>
              </div>

              {/* iOS/Safari */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold text-sm">i</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">iOS / Safari</h3>
                </div>

                <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm">
                  <li>Ouvrez Planneo dans Safari</li>
                  <li>Appuyez sur l&apos;icône de partage ↗️</li>
                  <li>Faites défiler et sélectionnez &quot;Sur l&apos;écran d&apos;accueil&quot;</li>
                  <li>Appuyez sur &quot;Ajouter&quot;</li>
                </ol>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    💡 <strong>Remarque :</strong> Safari peut demander confirmation pour l&apos;installation PWA.
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-bold text-sm">💻</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Ordinateur (Chrome/Edge)</h3>
              </div>

              <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm mb-4">
                <li>Ouvrez Planneo dans votre navigateur</li>
                <li>Cliquez sur l&apos;icône d&apos;installation dans la barre d&apos;adresse</li>
                <li>Ou cliquez sur les trois points ⋮ → &quot;Installer Planneo&quot;</li>
                <li>L&apos;app s&apos;ajoutera à votre bureau comme un raccourci</li>
              </ol>

              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-purple-800 text-sm">
                  🎯 <strong>Avantages :</strong> Fonctionne hors ligne, s&apos;ouvre comme une vraie application,
                  apparaît dans la barre des tâches.
                </p>
              </div>
            </div>

            {/* Fonctionnalités hors ligne */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">🚀 Après l&apos;installation :</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• ✅ Accès rapide depuis l&apos;écran d&apos;accueil</li>
                <li>• ✅ Fonctionnement hors ligne complet</li>
                <li>• ✅ Synchronisation automatique des données</li>
                <li>• ✅ Interface optimisée pour l&apos;appareil</li>
                <li>• ✅ Notifications push (si activées)</li>
              </ul>
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
                <h3 className="font-medium text-green-900 mb-2">✅ Conformité RGPD totale</h3>
                <p className="text-green-800">
                  Planneo est entièrement conforme au RGPD. Vos données de planning restent exclusivement 
                  sur votre appareil. Nous utilisons des services tiers uniquement avec votre consentement 
                  explicite via notre système de gestion des cookies.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">📊 Services avec consentement</h3>
                <p className="text-blue-800 text-sm mb-2">
                  Les services suivants ne sont activés qu&apos;avec votre consentement explicite :
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Vercel Analytics :</strong> Statistiques anonymes d&apos;utilisation</li>
                  <li>• <strong>Google AdSense :</strong> Publicités contextuelles (financement du projet)</li>
                  <li>• <strong>Vous contrôlez tout :</strong> Acceptation/refus granulaire via notre banner</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-medium text-orange-900 mb-2">🎯 Publicités et financement</h3>
                <p className="text-orange-800 text-sm">
                  Pour maintenir Planneo gratuit, nous affichons des publicités Google AdSense. 
                  Ces publicités respectent vos choix de consentement et permettent de financer 
                  le développement et la maintenance de l&apos;application.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Données stockées localement :</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Noms des employés</li>
                    <li>• Horaires de travail</li>
                    <li>• Paramètres de l&apos;application</li>
                    <li>• Préférences de consentement</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Données Analytics (si acceptées) :</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Pages consultées (anonymes)</li>
                    <li>• Temps de session (anonyme)</li>
                    <li>• Source de trafic</li>
                    <li>• Type d&apos;appareil/navigateur</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🔒 Vos droits RGPD</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Vous disposez d&apos;un contrôle total sur vos données :
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Consentement révocable :</strong> Modifiez vos préférences à tout moment</li>
                  <li>• <strong>Données locales :</strong> Supprimables via les paramètres du navigateur</li>
                  <li>• <strong>Transparence totale :</strong> Aucune donnée cachée ou collecte secrète</li>
                  <li>• <strong>Contact direct :</strong> contact@antoineterrade.com pour toute question</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Modèle économique et services */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-purple-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Modèle économique et services</h2>
            </div>

            <div className="space-y-6">
              {/* Version gratuite */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <span className="text-green-600 mr-2">🆓</span>
                  Version gratuite actuelle
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-900 mb-2">✅ Avantages :</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Toutes les fonctionnalités disponibles</li>
                      <li>• Stockage local sécurisé</li>
                      <li>• Pas de limite d&apos;utilisation</li>
                      <li>• Mises à jour gratuites</li>
                      <li>• Support communautaire</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-900 mb-2">⚠️ Contraintes :</h4>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• Publicités Google AdSense</li>
                      <li>• Pas de synchronisation entre appareils</li>
                      <li>• Pas de sauvegarde cloud</li>
                      <li>• Support standard</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Version entreprise */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <span className="text-blue-600 mr-2">🏢</span>
                  Version entreprise sur devis
                </h3>
                
                <div className="bg-white p-4 rounded-lg mb-4">
                  <p className="text-gray-700 mb-3">
                    Pour les entreprises ayant des besoins spécifiques, nous proposons une 
                    <strong> application dédiée personnalisée</strong> sans publicité avec des fonctionnalités avancées.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">🎯 Fonctionnalités premium :</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Zéro publicité</strong></li>
                      <li>• Synchronisation multi-appareils</li>
                      <li>• Sauvegarde cloud sécurisée</li>
                      <li>• Gestion multi-magasins</li>
                      <li>• Rapports avancés personnalisés</li>
                      <li>• Intégrations tierces (paie, RH)</li>
                      <li>• Support prioritaire dédié</li>
                      <li>• Formation et accompagnement</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-900 mb-2">💰 Tarification estimative :</h4>
                    <div className="text-sm text-purple-800 space-y-2">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <p><strong>Développement initial :</strong></p>
                        <p>2 500€ - 5 000€ HT</p>
                        <p className="text-xs">(selon personnalisations)</p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <p><strong>Maintenance annuelle :</strong></p>
                        <p>500€ - 1 000€ HT/an</p>
                        <p className="text-xs">(mises à jour + support)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">📞 Intéressé par une version entreprise ?</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Contactez-nous pour discuter de vos besoins spécifiques et obtenir un devis personnalisé.
                  </p>
                  <a
                    href="mailto:contact@antoineterrade.com?subject=Devis Planneo Entreprise&body=Bonjour,%0A%0AJe suis intéressé(e) par une version entreprise de Planneo.%0A%0AMon entreprise :%0ANombre d'employés :%0ABesoins spécifiques :%0A%0AMerci pour votre retour."
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 !text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{ color: '#ffffff' }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="text-white">Demander un devis</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* CGU */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Conditions Générales d&apos;Utilisation</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">1. Objet</h3>
                <p className="text-gray-600">
                  Planneo est une application de gestion de planning horaires destinée à un usage personnel
                  et professionnel individuel.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">2. Licence d&apos;utilisation</h3>
                <p className="text-gray-600">
                  Cette application est sous licence propriétaire. L&apos;utilisation personnelle est autorisée,
                  mais toute utilisation commerciale est strictement interdite sans accord préalable.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">3. Responsabilités</h3>
                <p className="text-gray-600">
                  L&apos;utilisateur est seul responsable des données qu&apos;il saisit dans l&apos;application.
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

          {/* Soutien et Dons */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg shadow-sm p-6 border border-amber-200">
            <div className="flex items-center mb-4">
              <Coffee className="h-6 w-6 text-amber-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Soutenir le développement</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-amber-100">
                <h3 className="text-lg font-medium text-gray-900 mb-2">☕ Planneo est 100% gratuit</h3>
                <p className="text-gray-700 mb-3">
                  Cette application est développée avec passion et proposée gratuitement à tous les commerçants
                  et boutiques qui en ont besoin. Votre soutien permet de maintenir et améliorer continuellement l&apos;outil.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://buymeacoffee.com/terradeanty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Coffee className="h-5 w-5" />
                    <span>M&apos;offrir un café</span>
                  </a>

                  <div className="text-sm text-gray-600">
                    <p className="mb-1"><strong>Montant suggéré :</strong> 3-5€</p>
                    <p>Chaque don, même petit, fait une différence ! 🙏</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-amber-100 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-900 mb-2">🎯 Votre soutien permet :</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Nouvelles fonctionnalités</li>
                    <li>• Améliorations de l&apos;interface</li>
                    <li>• Support technique continu</li>
                    <li>• Maintenance et sécurité</li>
                  </ul>
                </div>

                <div className="bg-green-100 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">💚 Avantages pour vous :</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Accès à toutes les fonctionnalités</li>
                    <li>• Mises à jour gratuites</li>
                    <li>• Support prioritaire</li>
                    <li>• Fonctionnalités avancées</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Merci pour votre soutien ! Chaque contribution aide à améliorer Planneo pour tous les commerçants. 🌟
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
                  Créateur de Planneo
                </p>

                <div className="space-y-2">
                  <a
                    href="mailto:contact@antoineterrade.com"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    contact@antoineterrade.com
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
                  Pour toute question concernant l&apos;application, les fonctionnalités,
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
              <Link href="mailto:contact@antoineterrade.com" className="text-blue-600 hover:text-blue-800">
                contact@antoineterrade.com
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}