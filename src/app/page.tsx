'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Users, FileText, Settings, BarChart3, Menu, X } from 'lucide-react';
import { userStorage, shiftStorage } from '@/utils/storage';
import { User } from '@/types';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [, setUsers] = useState<User[]>([]);
  const [totalShifts, setTotalShifts] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    // Charger les données côté client seulement
    const loadedUsers = userStorage.getAll();
    const loadedShifts = shiftStorage.getAll();
    const loadedActiveUsers = loadedUsers.filter(user => user.role === 'employee').length;

    setUsers(loadedUsers);
    setTotalShifts(loadedShifts.length);
    setActiveUsers(loadedActiveUsers);
    setIsLoaded(true);
  }, []);

    // Définir le mois actuel
    const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Mobile-First */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Planneo</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 lg:space-x-4">
              <Link
                href="/users"
                className="flex items-center space-x-1 px-2 lg:px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Users className="h-4 w-4" />
                <span className="hidden lg:inline">Utilisateurs</span>
              </Link>
              <Link
                href="/planning"
                className="flex items-center space-x-1 px-2 lg:px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden lg:inline">Planning</span>
              </Link>
              <Link
                href="/reports"
                className="flex items-center space-x-1 px-2 lg:px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden lg:inline">Rapports</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center space-x-1 px-2 lg:px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden lg:inline">Paramètres</span>
              </Link>
              <Link
                href="/advanced"
                className="flex items-center space-x-1 px-2 lg:px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden lg:inline">Avancé</span>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-2">
              <div className="px-2 space-y-1">
                <Link
                  href="/users"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  <span>Utilisateurs</span>
                </Link>
                <Link
                  href="/planning"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Planning</span>
                </Link>
                <Link
                  href="/reports"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Rapports</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>Paramètres</span>
                </Link>
                <Link
                  href="/advanced"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>Gestion avancée</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8 flex-grow">
        {/* Welcome Section - SEO Optimisée */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
            Générateur de Planning pour Boutiques - Planneo
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4">
            Logiciel gratuit de gestion de planning horaire pour commerces et boutiques.
            Créez facilement les horaires de votre équipe, calculez automatiquement les heures travaillées,
            exportez vos plannings en PDF professionnel.
          </p>

          {/* Section SEO - Mots-clés principaux */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Planning Commercial Simplifié</h2>
            <p className="text-sm text-gray-700 mb-3">
              Planneo est l&apos;outil idéal pour les boutiques et magasins qui veulent optimiser la gestion
              de leur personnel. Planning hebdomadaire, calcul automatique des heures, interface intuitive.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Générateur de planning</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Logiciel boutique</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Gestion horaire équipe</span>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">Planning commercial</span>
            </div>
          </div>
        </div>

        {/* Quick Stats - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <div className="flex items-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Employés actifs</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{isLoaded ? activeUsers : '...'}</p>
                </div>
              </div>
            </div>

          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <div className="flex items-center">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Créneaux ce mois</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{isLoaded ? totalShifts : '...'}</p>
                </div>
              </div>
            </div>

          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Mois en cours</p>
                <p className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 truncate">
                    {new Date(currentMonth + '-01').toLocaleDateString('fr-FR', {
                    month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

        {/* Quick Actions - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Link
              href="/users"
            className="bg-white hover:bg-blue-50 active:bg-blue-100 text-blue-800 border-2 border-blue-300 rounded-lg p-4 sm:p-6 text-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg"
            aria-label="Accéder à la gestion des utilisateurs"
          >
            <Users className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-2 sm:mb-3 lg:mb-4 text-blue-600" />
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1">Utilisateurs</h3>
            <p className="text-xs sm:text-sm opacity-90 hidden sm:block">Gérer les employés</p>
            </Link>

            <Link
              href="/planning"
            className="bg-white hover:bg-emerald-50 active:bg-emerald-100 text-emerald-800 border-2 border-emerald-300 rounded-lg p-4 sm:p-6 text-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50 shadow-lg"
            aria-label="Accéder à la gestion du planning"
          >
            <Calendar className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-2 sm:mb-3 lg:mb-4 text-emerald-600" />
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1">Planning</h3>
            <p className="text-xs sm:text-sm opacity-90 hidden sm:block">Créer les horaires</p>
            </Link>

            <Link
              href="/reports"
            className="bg-white hover:bg-orange-50 active:bg-orange-100 text-orange-800 border-2 border-orange-300 rounded-lg p-4 sm:p-6 text-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 shadow-lg"
            aria-label="Accéder aux rapports et exports"
          >
            <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-2 sm:mb-3 lg:mb-4 text-orange-600" />
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1">Rapports</h3>
            <p className="text-xs sm:text-sm opacity-90 hidden sm:block">Exports PDF</p>
            </Link>

            <Link
            href="/advanced"
            className="bg-white hover:bg-purple-50 active:bg-purple-100 text-purple-800 border-2 border-purple-300 rounded-lg p-4 sm:p-6 text-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg"
            aria-label="Accéder à la gestion avancée"
          >
            <Settings className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-2 sm:mb-3 lg:mb-4 text-purple-600" />
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1">Gestion avancée</h3>
            <p className="text-xs sm:text-sm opacity-90 hidden sm:block">Congés & Templates</p>
          </Link>
        </div>

        {/* Section SEO - Fonctionnalités détaillées */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Logiciel de Gestion de Planning pour Commerces
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Fonctionnalités Principales</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Génération automatique de planning horaire</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Calcul automatique des heures travaillées</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Gestion d&apos;équipe pour boutiques et magasins</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Export PDF professionnel du planning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Interface mobile-first optimisée</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Mode hors ligne fonctionnel</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Avantages pour les Boutiques</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">🎯</span>
                  <span>Économisez du temps sur la création de planning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">🎯</span>
                  <span>Évitez les erreurs de calcul d&apos;heures</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">🎯</span>
                  <span>Optimisez la gestion de votre personnel</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">🎯</span>
                  <span>Planning professionnel pour vos employés</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">🎯</span>
                  <span>Application gratuite et sans abonnement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">🎯</span>
                  <span>Accessible partout avec connexion internet</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              🔍 Mots-clés populaires pour trouver Planneo
            </h3>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Ces termes sont fréquemment recherchés par les boutiques et commerces
            </p>
            <div
              className="flex flex-wrap justify-center gap-3 text-sm"
              role="list"
              aria-label="Mots-clés populaires pour la recherche de générateurs de planning"
            >
              <button
                className="bg-white hover:bg-blue-100 focus:bg-blue-100 px-4 py-2 rounded-full border-2 border-blue-300 hover:border-blue-500 focus:border-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shadow-sm hover:shadow-md transform hover:scale-105"
                aria-label="Rechercher : générateur de planning pour boutique"
                onClick={() => {
                  window.open(`https://www.google.fr/search?q=générateur+de+planning+pour+boutique`, '_blank');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.open(`https://www.google.fr/search?q=générateur+de+planning+pour+boutique`, '_blank');
                  }
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-600 rounded-full shadow-sm"></span>
                  <span className="text-gray-800 font-medium">générateur planning boutique</span>
                </span>
              </button>

              <button
                className="bg-white hover:bg-green-100 focus:bg-green-100 px-4 py-2 rounded-full border-2 border-green-300 hover:border-green-500 focus:border-green-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 shadow-sm hover:shadow-md transform hover:scale-105"
                aria-label="Rechercher : logiciel de planning commercial"
                onClick={() => {
                  window.open(`https://www.google.fr/search?q=logiciel+de+planning+commercial`, '_blank');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.open(`https://www.google.fr/search?q=logiciel+de+planning+commercial`, '_blank');
                  }
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-600 rounded-full shadow-sm"></span>
                  <span className="text-gray-800 font-medium">logiciel planning commercial</span>
                </span>
              </button>

              <button
                className="bg-white hover:bg-purple-100 focus:bg-purple-100 px-4 py-2 rounded-full border-2 border-purple-300 hover:border-purple-500 focus:border-purple-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 shadow-sm hover:shadow-md transform hover:scale-105"
                aria-label="Rechercher : planning horaire pour magasin"
                onClick={() => {
                  window.open(`https://www.google.fr/search?q=planning+horaire+pour+magasin`, '_blank');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.open(`https://www.google.fr/search?q=planning+horaire+pour+magasin`, '_blank');
                  }
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-purple-600 rounded-full shadow-sm"></span>
                  <span className="text-gray-800 font-medium">planning horaire magasin</span>
                </span>
              </button>

              <button
                className="bg-white hover:bg-orange-100 focus:bg-orange-100 px-4 py-2 rounded-full border-2 border-orange-300 hover:border-orange-500 focus:border-orange-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 shadow-sm hover:shadow-md transform hover:scale-105"
                aria-label="Rechercher : gestion d&apos;équipe pour commerce"
                onClick={() => {
                  window.open(`https://www.google.fr/search?q=gestion+d+équipe+pour+commerce`, '_blank');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.open(`https://www.google.fr/search?q=gestion+d+équipe+pour+commerce`, '_blank');
                  }
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-600 rounded-full shadow-sm"></span>
                  <span className="text-gray-800 font-medium">gestion équipe commerce</span>
                </span>
              </button>

              <button
                className="bg-white hover:bg-red-100 focus:bg-red-100 px-4 py-2 rounded-full border-2 border-red-300 hover:border-red-500 focus:border-red-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 shadow-sm hover:shadow-md transform hover:scale-105"
                aria-label="Rechercher : logiciel de gestion du personnel"
                onClick={() => {
                  window.open(`https://www.google.fr/search?q=logiciel+de+gestion+du+personnel`, '_blank');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.open(`https://www.google.fr/search?q=logiciel+de+gestion+du+personnel`, '_blank');
                  }
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-600 rounded-full shadow-sm"></span>
                  <span className="text-gray-800 font-medium">logiciel gestion personnel</span>
                </span>
              </button>

              <button
                className="bg-white hover:bg-teal-100 focus:bg-teal-100 px-4 py-2 rounded-full border-2 border-teal-300 hover:border-teal-500 focus:border-teal-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 shadow-sm hover:shadow-md transform hover:scale-105"
                aria-label="Rechercher : planning hebdomadaire pour boutique"
                onClick={() => {
                  window.open(`https://www.google.fr/search?q=planning+hebdomadaire+pour+boutique`, '_blank');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.open(`https://www.google.fr/search?q=planning+hebdomadaire+pour+boutique`, '_blank');
                  }
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-teal-600 rounded-full shadow-sm"></span>
                  <span className="text-gray-800 font-medium">planning hebdomadaire boutique</span>
                </span>
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                💡 Cliquez sur un mot-clé pour voir les résultats de recherche actuels
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
