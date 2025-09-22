'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Download, Upload, Trash2 } from 'lucide-react';
import { settingsStorage, dataExport } from '@/utils/storage';
import { AppSettings } from '@/types';
import { Footer } from '@/components/Footer';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSettings(settingsStorage.get());
  }, []);

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      settingsStorage.save(settings);
      alert('Paramètres sauvegardés avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des paramètres.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    try {
      const data = dataExport.export();
      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      const exportFileDefaultName = `planneo-backup-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      alert('Données exportées avec succès !');
    } catch (error) {
      console.error('Erreur lors de l&apos;export:', error);
      alert('Erreur lors de l&apos;export des données.');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        dataExport.import(data);
        alert('Données importées avec succès ! Rechargez la page pour voir les changements.');
        window.location.reload();
      } catch (error) {
        console.error('Erreur lors de l&apos;import:', error);
        alert('Erreur lors de l&apos;import des données. Vérifiez le format du fichier.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible.')) {
      if (confirm('Dernière confirmation : toutes les données seront perdues. Continuer ?')) {
        dataExport.import({ users: [], shifts: [], plannings: [], settings: settingsStorage.get() });
        alert('Toutes les données ont été supprimées.');
        window.location.reload();
      }
    }
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    if (!settings) return;
    setSettings({ ...settings, ...updates });
  };

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-gray-900 hover:text-black font-medium"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary"
              aria-label="Enregistrer les paramètres"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Paramètres généraux</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Language */}
              <div>
                <label htmlFor="language" className="block text-sm font-semibold text-gray-900 mb-2">
                  Langue
                </label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value as 'fr' | 'en' })}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>





          {/* Data Management */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Gestion des données</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleExportData}
                  className="btn-primary"
                  aria-label="Télécharger toutes les données au format JSON"
                >
                  <Download className="h-4 w-4" />
                  <span>Exporter les données</span>
                </button>

                <label className="btn-primary cursor-pointer">
                  <Upload className="h-4 w-4" />
                  <span>Importer des données</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                    aria-label="Sélectionner un fichier JSON à importer"
                  />
                </label>

                <button
                  onClick={handleClearData}
                  className="btn-danger"
                  aria-label="Supprimer définitivement toutes les données"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Supprimer tout</span>
                </button>
              </div>

              <div className="text-sm text-gray-700">
                <p>• <strong>Exporter</strong> : Télécharge un fichier JSON avec toutes vos données</p>
                <p>• <strong>Importer</strong> : Charge des données depuis un fichier JSON exporté</p>
                <p>• <strong>Supprimer tout</strong> : Efface toutes les données (utilisateurs, créneaux, etc.)</p>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">À propos</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Planneo</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    Application de gestion de planning horaires pour boutiques et commerces.
                  </p>
                  <p className="text-sm text-gray-700 mb-4">
                    Version: 1.0.0<br />
                    PWA: Oui<br />
                    Stockage: Local Storage
                  </p>
                  <Link
                    href="/about"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 !text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    En savoir plus
                  </Link>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Fonctionnalités</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Gestion des utilisateurs</li>
                    <li>• Planning visuel par mois</li>
                    <li>• Calcul automatique des heures</li>
                    <li>• Export PDF</li>
                    <li>• Mode hors ligne</li>
                    <li>• Génération intelligente IA</li>
                    <li>• Gestion multi-magasins</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
