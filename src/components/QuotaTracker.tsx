'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Target, Clock, AlertTriangle } from 'lucide-react';
import { User as UserType, MonthlyReport } from '@/types';
import { calculateQuotaProgress } from '@/utils/planningUtils';
import { shiftStorage } from '@/utils/storage';

interface QuotaTrackerProps {
  users: UserType[];
  currentMonth: string;
}

export function QuotaTracker({ users, currentMonth }: QuotaTrackerProps) {
  const [reports, setReports] = useState<MonthlyReport[]>([]);

  const calculateReports = useCallback(() => {
    const shifts = shiftStorage.getAll();
    const monthShifts = shifts.filter(shift => shift.date.startsWith(currentMonth));

    const userReports: MonthlyReport[] = users.map(user => {
      const userShifts = monthShifts.filter(shift => shift.userId === user.id);
      const totalHours = userShifts.reduce((total, shift) => {
        const [startHour, startMinute] = shift.startTime.split(':').map(Number);
        const [endHour, endMinute] = shift.endTime.split(':').map(Number);
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;
        const duration = (endTime - startTime - shift.breakDuration) / 60;
        return total + Math.max(0, duration);
      }, 0);

      const quotaProgress = calculateQuotaProgress(user, totalHours, currentMonth);

      return {
        month: currentMonth,
        userId: user.id,
        totalHours: Math.round(totalHours * 100) / 100,
        totalDays: userShifts.length,
        averageHoursPerDay: userShifts.length > 0 ? Math.round((totalHours / userShifts.length) * 100) / 100 : 0,
        weeklyBreakdown: [], // Sera calculé plus tard si nécessaire
        quotaProgress,
      };
    });

    setReports(userReports);
  }, [users, currentMonth]);

  useEffect(() => {
    calculateReports();
  }, [calculateReports]);

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 100) return <Target className="h-5 w-5 text-green-600" />;
    if (percentage >= 80) return <TrendingUp className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 100) return 'Objectif atteint';
    if (percentage >= 80) return 'En bonne voie';
    return 'Sous l\'objectif';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Suivi des quotas horaires</h3>
        <p className="text-sm text-gray-600 mt-1">
          Progression des heures travaillées par rapport aux objectifs mensuels
        </p>
      </div>

      <div className="p-6">
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune donnée</h3>
            <p className="mt-1 text-sm text-gray-500">
              Les données de quotas apparaîtront une fois les utilisateurs et créneaux configurés.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => {
              const user = users.find(u => u.id === report.userId);
              if (!user) return null;

              return (
                <div key={report.userId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(report.quotaProgress.percentage)}
                      <span className={`text-sm font-medium ${getStatusColor(report.quotaProgress.percentage)}`}>
                        {getStatusText(report.quotaProgress.percentage)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{report.totalHours}h</p>
                      <p className="text-xs text-gray-600">Heures travaillées</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{report.quotaProgress.requiredHours}h</p>
                      <p className="text-xs text-gray-600">Objectif mensuel</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${report.quotaProgress.remainingHours > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        {Math.abs(report.quotaProgress.remainingHours)}h
                      </p>
                      <p className="text-xs text-gray-600">
                        {report.quotaProgress.remainingHours > 0 ? 'Restant' : 'Supplémentaire'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${getStatusColor(report.quotaProgress.percentage)}`}>
                        {report.quotaProgress.percentage}%
                      </p>
                      <p className="text-xs text-gray-600">Progression</p>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        report.quotaProgress.percentage >= 100
                          ? 'bg-green-500'
                          : report.quotaProgress.percentage >= 80
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(report.quotaProgress.percentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Quota hebdomadaire : {user.weeklyHoursQuota}h/semaine</span>
                    <span>Jours travaillés : {report.totalDays}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
