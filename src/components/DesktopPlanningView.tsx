'use client';

import { useState } from 'react';
import { Edit, Trash2, X, Calendar, Clock, Plus } from 'lucide-react';
import { User, Shift } from '@/types';

interface DesktopPlanningViewProps {
  calendarDays: (string | null)[];
  getShiftsForDate: (date: string) => Shift[];
  getUserById: (userId: string) => User | undefined;
  onDateClick: (date: string) => void;
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
}

interface DayWithShifts {
  date: string;
  shifts: Shift[];
  dayOfWeek: number;
}

interface WeekGroup {
  weekKey: string;
  weekNumber: number;
  weekStart: string;
  days: DayWithShifts[];
}

export function DesktopPlanningView({
  calendarDays,
  getShiftsForDate,
  getUserById,
  onDateClick,
  onEditShift,
  onDeleteShift,
}: DesktopPlanningViewProps) {
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (shift: Shift) => {
    const user = getUserById(shift.userId);
    setSelectedShift(shift);
    setSelectedUser(user || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedShift(null);
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleEdit = () => {
    if (selectedShift) {
      onEditShift(selectedShift);
      closeModal();
    }
  };

  const handleDelete = () => {
    if (selectedShift && confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) {
      onDeleteShift(selectedShift.id);
      closeModal();
    }
  };

  // Grouper les shifts par jour (incluant les jours sans shifts)
  const shiftsByDay = calendarDays
    .filter(dateStr => dateStr !== null)
    .map(dateStr => ({
      date: dateStr!,
      shifts: getShiftsForDate(dateStr!),
      dayOfWeek: new Date(dateStr!).getDay(),
    }));

  // Fonction pour calculer le numéro de semaine
  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  // Grouper par semaines pour un meilleur affichage desktop
  const shiftsByWeek = shiftsByDay.reduce((weeks: WeekGroup[], day) => {
    const weekStart = new Date(day.date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Lundi de la semaine
    const weekKey = weekStart.toISOString().split('T')[0];
    const weekNumber = getWeekNumber(weekStart);

    const existingWeek = weeks.find(w => w.weekKey === weekKey);
    if (existingWeek) {
      existingWeek.days.push(day);
    } else {
      weeks.push({
        weekKey,
        weekNumber,
        weekStart: weekStart.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        days: [day]
      });
    }
    return weeks;
  }, []);

  return (
    <div className="space-y-8">
      {/* Affichage par semaine */}
      {shiftsByWeek.map((week) => (
        <div key={week.weekKey} className="space-y-4">
          {/* Header de la semaine */}
          <div className="bg-gray-100 px-6 py-3 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800">
              Semaine {week.weekNumber} - {week.weekStart}
            </h2>
          </div>

          {/* Grille des jours (3 colonnes sur desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {week.days.map(({ date, shifts }) => (
              <div key={date} className="bg-white rounded-lg shadow-sm border overflow-hidden h-auto flex flex-col">
                {/* Header du jour */}
                <div className="bg-blue-600 text-white px-4 py-3 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {new Date(date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </h3>
                    <span className="text-sm bg-blue-500 px-2 py-1 rounded-full">
                      {shifts.length} employé{shifts.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Liste des employés pour ce jour - avec scroll */}
                <div className="flex-1 overflow-y-auto">
                  {shifts.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                  {shifts.map((shift) => {
                    const user = getUserById(shift.userId);
                    if (!user) return null;

                    return (
                      <div
                        key={shift.id}
                        onClick={() => openModal(shift)}
                        className="px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div
                              className="w-6 h-6 rounded-full flex-shrink-0"
                              style={{ backgroundColor: user.color }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-lg font-semibold text-gray-900 truncate">
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-600">{user.role}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600 font-mono">
                                  {shift.startTime} - {shift.endTime}
                                </span>
                              </div>
                              {shift.breakDuration > 0 && (
                                <p className="text-xs text-orange-600 mt-1">
                                  Pause: {shift.breakDuration}min
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-gray-400 ml-4">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                    </div>
                  ) : (
                    /* Message quand aucun employé */
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <div className="text-2xl mb-2">👥</div>
                        <p className="text-sm">Aucun employé</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bouton pour ajouter un employé ce jour-là */}
                <div className="px-4 py-4 bg-gray-50 border-t flex-shrink-0">
                  <button
                    onClick={() => onDateClick(date)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Ajouter un employé</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Jours sans employés */}
      {shiftsByDay.length === 0 && (
        <div className="text-center py-16">
          <Calendar className="h-20 w-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-medium text-gray-900 mb-4">
            Aucun planning cette semaine
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            Commencez par ajouter des employés à votre planning
          </p>
          <button
            onClick={() => onDateClick(new Date().toISOString().split('T')[0])}
            className="bg-blue-600 text-white px-8 py-4 rounded-md hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Créer le premier créneau
          </button>
        </div>
      )}

      {/* Modal de détails du créneau */}
      {isModalOpen && selectedShift && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-6" style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)' // Safari support
        }} onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Détails du créneau
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-6">
              {/* Employé */}
              <div className="flex items-center space-x-4">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: selectedUser.color }}
                />
                <div>
                  <p className="font-semibold text-xl text-gray-900">{selectedUser.name}</p>
                  <p className="text-gray-600">{selectedUser.role}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center space-x-4">
                <Calendar className="h-6 w-6 text-gray-500" />
                <span className="text-gray-900 text-lg">
                  {new Date(selectedShift.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>

              {/* Horaires */}
              <div className="flex items-center space-x-4">
                <Clock className="h-6 w-6 text-gray-500" />
                <div>
                  <span className="font-mono text-xl text-gray-900">
                    {selectedShift.startTime} - {selectedShift.endTime}
                  </span>
                  {selectedShift.breakDuration > 0 && (
                    <p className="text-orange-600 mt-2 text-lg">
                      Pause: {selectedShift.breakDuration} minutes
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedShift.notes && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700 whitespace-pre-wrap text-lg">
                    {selectedShift.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-4 p-6 border-t border-gray-200">
              <button
                onClick={handleEdit}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-3 font-medium text-lg"
              >
                <Edit className="h-5 w-5" />
                <span>Modifier</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-3 font-medium text-lg"
              >
                <Trash2 className="h-5 w-5" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
