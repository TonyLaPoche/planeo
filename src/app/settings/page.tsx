'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Download, Upload, Trash2, Sun, Moon } from 'lucide-react';
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

      const exportFileDefaultName = `planeo-backup-${new Date().toISOString().split('T')[0]}.json`;

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
              {/* Theme */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Thème de l&apos;application
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center text-gray-900 font-medium">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={settings.theme === 'light'}
                      onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' })}
                      className="mr-3"
                    />
                    <Sun className="h-4 w-4 mr-2 text-yellow-500" />
                    <span className="text-sm font-medium">Clair</span>
                  </label>
                  <label className="flex items-center text-gray-900 font-medium">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={settings.theme === 'dark'}
                      onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' })}
                      className="mr-3"
                    />
                    <Moon className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">Sombre</span>
                  </label>
                </div>
              </div>

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

          {/* Working Days */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Jours de travail</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 mb-4">
                Sélectionnez les jours de la semaine travaillés par défaut
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: 1, label: 'Lundi' },
                  { value: 2, label: 'Mardi' },
                  { value: 3, label: 'Mercredi' },
                  { value: 4, label: 'Jeudi' },
                  { value: 5, label: 'Vendredi' },
                  { value: 6, label: 'Samedi' },
                  { value: 0, label: 'Dimanche' },
                ].map((day) => (
                  <label key={day.value} className="flex items-center text-gray-900 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.workingDays.includes(day.value)}
                      onChange={(e) => {
                        const newWorkingDays = e.target.checked
                          ? [...settings.workingDays, day.value]
                          : settings.workingDays.filter(d => d !== day.value);
                        updateSettings({ workingDays: newWorkingDays });
                      }}
                      className="mr-3 w-4 h-4"
                    />
                    <span className="text-sm">{day.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Auto Generation Settings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Génération automatique</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="flex items-center text-gray-900 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoGenerateShifts}
                    onChange={(e) => updateSettings({ autoGenerateShifts: e.target.checked })}
                    className="mr-3 w-4 h-4"
                  />
                  <span className="text-sm font-semibold">
                    Activer la génération automatique des créneaux
                  </span>
                </label>
                <p className="text-xs text-gray-700 mt-1 ml-6 font-medium">
                  Génère automatiquement les créneaux horaires selon les templates et congés
                </p>
              </div>

              <div>
                <label htmlFor="weeklyHours" className="block text-sm font-semibold text-gray-900 mb-2">
                  Heures hebdomadaires par défaut
                </label>
                <input
                  type="number"
                  id="weeklyHours"
                  value={settings.defaultWeeklyHours}
                  onChange={(e) => updateSettings({ defaultWeeklyHours: parseInt(e.target.value) || 35 })}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="168"
                  step="0.5"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Nombre d&apos;heures travaillées par semaine (ex: 35 pour un temps plein)
                </p>
              </div>

              <div>
                <label htmlFor="shiftDuration" className="block text-sm font-semibold text-gray-900 mb-2">
                  Durée par défaut d&apos;un créneau (heures)
                </label>
                <input
                  type="number"
                  id="shiftDuration"
                  value={settings.defaultShiftDuration}
                  onChange={(e) => updateSettings({ defaultShiftDuration: parseFloat(e.target.value) || 8 })}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0.5"
                  max="24"
                  step="0.5"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Durée par défaut d&apos;un créneau de travail en heures
                </p>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Horaires d&apos;ouverture</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 mb-4 font-medium">
                Définissez les horaires d&apos;ouverture par défaut
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div>
                                  <label htmlFor="startTime" className="block text-sm font-semibold text-gray-900 mb-2">
                  Heure d&apos;ouverture
                </label>
                  <input
                    type="time"
                    id="startTime"
                    value={settings.businessHours.start}
                    onChange={(e) => updateSettings({
                      businessHours: { ...settings.businessHours, start: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-semibold text-gray-900 mb-2">
                    Heure de fermeture
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    value={settings.businessHours.end}
                    onChange={(e) => updateSettings({
                      businessHours: { ...settings.businessHours, end: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Default Break Duration */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Paramètres par défaut</h3>
            </div>
            <div className="p-6">
              <div className="max-w-xs">
                <label htmlFor="breakDuration" className="form-label">
                  Durée de pause par défaut (minutes)
                </label>
                <input
                  type="number"
                  id="breakDuration"
                  value={settings.defaultBreakDuration}
                  onChange={(e) => updateSettings({ defaultBreakDuration: parseInt(e.target.value) || 0 })}
                  min="0"
                  max="480"
                  className="form-input"
                  aria-describedby="break-default-help"
                />
                <p id="break-default-help" className="sr-only">Durée de pause par défaut en minutes pour les nouveaux créneaux</p>
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
                  <h4 className="font-medium text-gray-900 mb-2">Planéo</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    Application de gestion de planning horaires pour boutiques et commerces.
                  </p>
                  <p className="text-sm text-gray-700">
                    Version: 1.0.0<br />
                    PWA: Oui<br />
                    Stockage: Local Storage
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Fonctionnalités</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Gestion des utilisateurs</li>
                    <li>• Planning visuel par mois</li>
                    <li>• Calcul automatique des heures</li>
                    <li>• Export PDF</li>
                    <li>• Mode hors ligne</li>
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
