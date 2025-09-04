'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Users, FileText, Settings, BarChart3 } from 'lucide-react';
import { userStorage, shiftStorage, settingsStorage } from '@/utils/storage';
import { User, AppSettings } from '@/types';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>('');

  useEffect(() => {
    // Charger les données
    setUsers(userStorage.getAll());
    setSettings(settingsStorage.get());

    // Définir le mois actuel
    const now = new Date();
    setCurrentMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  }, []);

  const totalShifts = shiftStorage.getAll().length;
  const activeUsers = users.filter(user => user.role === 'employee').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Planning Local</h1>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/users"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <Users className="h-4 w-4" />
                <span>Utilisateurs</span>
              </Link>
              <Link
                href="/planning"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <Calendar className="h-4 w-4" />
                <span>Planning</span>
              </Link>
              <Link
                href="/reports"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Rapports</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bienvenue sur Planning Local
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Gérez facilement les horaires de votre équipe et exportez vos plannings en PDF.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Employés actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Créneaux ce mois</p>
                  <p className="text-2xl font-bold text-gray-900">{totalShifts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Mois en cours</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Date(currentMonth + '-01').toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/users"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-6 text-center transition-colors"
            >
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Gérer les utilisateurs</h3>
              <p className="text-sm opacity-90">Ajouter, modifier ou supprimer des employés</p>
            </Link>

            <Link
              href="/planning"
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-6 text-center transition-colors"
            >
              <Calendar className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Créer un planning</h3>
              <p className="text-sm opacity-90">Planifier les horaires de votre équipe</p>
            </Link>

            <Link
              href="/reports"
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-6 text-center transition-colors"
            >
              <BarChart3 className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Voir les rapports</h3>
              <p className="text-sm opacity-90">Consulter les statistiques et exports</p>
            </Link>

            <Link
              href="/settings"
              className="bg-gray-600 hover:bg-gray-700 text-white rounded-lg p-6 text-center transition-colors"
            >
              <Settings className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Paramètres</h3>
              <p className="text-sm opacity-90">Configurer l'application</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
