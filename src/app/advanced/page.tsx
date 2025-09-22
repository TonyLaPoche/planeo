'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, Calendar, Users, TrendingUp } from 'lucide-react';
import { userStorage, shopStorage } from '@/utils/storage';
import { User, Shop } from '@/types';
import { VacationManager } from '@/components/VacationManager';
import { QuotaTracker } from '@/components/QuotaTracker';
import { Footer } from '@/components/Footer';
import { ShopManager } from '@/components/ShopManager';
import { useTranslation } from '@/hooks/useTranslation';
import SEOHead from '@/components/SEOHead';

export default function AdvancedPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [activeTab, setActiveTab] = useState<'vacations' | 'quotas' | 'shops'>('vacations');
  const { t } = useTranslation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(userStorage.getAll());
    setShops(shopStorage.getAll());
  };

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

  const tabs = [
    {
      id: 'vacations' as const,
      label: t('advanced.tabs.holidays'),
      icon: Calendar,
      description: 'Gérer les congés et absences',
    },
    {
      id: 'quotas' as const,
      label: 'Quotas',
      icon: TrendingUp,
      description: 'Suivre les objectifs horaires',
    },
    {
      id: 'shops' as const,
      label: t('advanced.tabs.shops'),
      icon: Settings,
      description: 'Gestion des magasins',
    },
  ];

  return (
    <>
      <SEOHead page="advanced" />
      <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 p-2 -m-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t('advanced.title')}</h1>
                <p className="text-sm text-gray-600">Automatisation et suivi des plannings</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'vacations' && (
            <VacationManager users={users} />
          )}


          {activeTab === 'quotas' && (
            <QuotaTracker users={users} currentMonth={currentMonth} />
          )}

          {activeTab === 'shops' && (
            <ShopManager shops={shops} users={users} onShopsUpdate={loadData} />
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-900">
                Fonctionnalités avancées
              </h3>
              <div className="mt-2 text-sm text-blue-800">
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Congés :</strong> Déclarez les vacances, arrêts maladie et jours fériés</li>
                  <li><strong>Quotas :</strong> Suivez la progression des objectifs horaires mensuels</li>
                         <li><strong>Magasins :</strong> Créez et gérez vos magasins avec leurs équipes et contraintes</li>
                  <li><strong>Génération intelligente :</strong> Algorithme avancé respectant toutes les contraintes légales</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
    </>
  );
}
