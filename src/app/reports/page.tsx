'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Calendar, Users, Clock, FileText, BarChart3 } from 'lucide-react';
import { userStorage, shiftStorage } from '@/utils/storage';
import { User, Shift, PDFExportOptions } from '@/types';
import { generateMonthlyReport, formatDuration, formatDate } from '@/utils/time';
import { generatePlanningPDF, generateSimpleReportPDF } from '@/utils/pdfExport';

export default function ReportsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadData();
    const now = new Date();
    setSelectedMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  }, []);

  const loadData = () => {
    setUsers(userStorage.getAll());
    setShifts(shiftStorage.getAll());
  };

  const getMonthlyReports = () => {
    return users.map(user => ({
      user,
      report: generateMonthlyReport(shifts, selectedMonth, user.id),
    })).filter(item => item.report.totalHours > 0);
  };

  const handleExportPDF = async (type: 'detailed' | 'simple') => {
    if (!selectedMonth || isExporting) return;

    setIsExporting(true);
    try {
      const options: PDFExportOptions = {
        includeNotes: type === 'detailed',
        includeTotals: true,
        format: 'A4',
        orientation: type === 'detailed' ? 'portrait' : 'portrait',
      };

      const data = {
        month: selectedMonth,
        users,
        shifts,
        options,
      };

      if (type === 'detailed') {
        await generatePlanningPDF(data);
      } else {
        generateSimpleReportPDF(data);
      }
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      alert('Une erreur est survenue lors de l\'export du PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const monthlyReports = getMonthlyReports();
  const totalHours = monthlyReports.reduce((total, item) => total + item.report.totalHours, 0);
  const totalDays = monthlyReports.reduce((total, item) => total + item.report.totalDays, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Rapports et Exports</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Month Selector */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionner le mois
                </label>
                <input
                  type="month"
                  id="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="form-input max-w-xs"
                  aria-describedby="month-help"
                />
                <p id="month-help" className="sr-only">Sélectionnez le mois pour lequel générer les rapports</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleExportPDF('simple')}
                  disabled={isExporting || monthlyReports.length === 0}
                  className="btn-primary"
                  aria-label="Générer et télécharger un rapport PDF simple"
                >
                  <Download className="h-4 w-4" />
                  <span>Rapport simple</span>
                </button>
                <button
                  onClick={() => handleExportPDF('detailed')}
                  disabled={isExporting || monthlyReports.length === 0}
                  className="btn-primary"
                  aria-label="Générer et télécharger un rapport PDF détaillé"
                >
                  <Download className="h-4 w-4" />
                  <span>Rapport détaillé</span>
                </button>
              </div>
            </div>
          </div>

          {/* Global Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Employés actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{monthlyReports.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total jours</p>
                  <p className="text-2xl font-bold text-gray-900">{totalDays}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total heures</p>
                  <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}h</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Moyenne/employé</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {monthlyReports.length > 0 ? (totalHours / monthlyReports.length).toFixed(1) : 0}h
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Reports */}
          {monthlyReports.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  Rapport détaillé du mois de {new Date(selectedMonth + '-01').toLocaleDateString('fr-FR', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employé
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jours travaillés
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total heures
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Moyenne/jour
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Créneaux
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {monthlyReports.map(({ user, report }) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3"
                              style={{ backgroundColor: user.color }}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              {user.email && (
                                <div className="text-sm text-gray-500">{user.email}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.totalDays}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.totalHours.toFixed(1)}h
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.averageHoursPerDay.toFixed(1)}h
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {shifts.filter(s => s.userId === user.id).length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Total général
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {totalDays}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {totalHours.toFixed(1)}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {monthlyReports.length > 0 ? (totalHours / monthlyReports.length).toFixed(1) : 0}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {shifts.length}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun créneau trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Il n'y a pas de créneaux planifiés pour ce mois.
              </p>
              <div className="mt-6">
                <Link
                  href="/planning"
                  className="btn-primary"
                  aria-label="Accéder à la page de gestion du planning"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Aller au planning
                </Link>
              </div>
            </div>
          )}

          {/* Export Options Info */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Options d'export</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Rapport simple</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Tableau récapitulatif des heures</li>
                  <li>• Totaux par employé</li>
                  <li>• Format A4 portrait</li>
                  <li>• Idéal pour archivage</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Rapport détaillé</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Détail de tous les créneaux</li>
                  <li>• Ventilation hebdomadaire</li>
                  <li>• Notes et commentaires</li>
                  <li>• Format A4 portrait</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
