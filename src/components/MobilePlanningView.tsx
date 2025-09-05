'use client';

import { useState } from 'react';
import { Edit, Trash2, X, Calendar, Clock } from 'lucide-react';
import { User, Shift } from '@/types';

interface MobilePlanningViewProps {
  calendarDays: (string | null)[];
  getShiftsForDate: (date: string) => Shift[];
  getUserById: (userId: string) => User | undefined;
  onDateClick: (date: string) => void;
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
}

export function MobilePlanningView({
  calendarDays,
  getShiftsForDate,
  getUserById,
  onDateClick,
  onEditShift,
  onDeleteShift,
}: MobilePlanningViewProps) {
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

  // Grouper les shifts par jour
  const shiftsByDay = calendarDays
    .filter(dateStr => dateStr !== null)
    .map(dateStr => ({
      date: dateStr!,
      shifts: getShiftsForDate(dateStr!),
    }))
    .filter(day => day.shifts.length > 0);

  return (
    <div className="space-y-4">
      {/* Liste des jours avec leurs employés */}
      {shiftsByDay.map(({ date, shifts }) => (
        <div key={date} className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Header du jour */}
          <div className="bg-blue-600 text-white px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {new Date(date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </h3>
              <span className="text-sm bg-blue-500 px-2 py-1 rounded-full">
                {shifts.length} employé{shifts.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Liste des employés pour ce jour */}
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
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: user.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
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
                    <div className="text-gray-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bouton pour ajouter un employé ce jour-là */}
          <div className="px-4 py-3 bg-gray-50 border-t">
            <button
              onClick={() => onDateClick(date)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              + Ajouter un employé
            </button>
          </div>
        </div>
      ))}

      {/* Jours sans employés */}
      {shiftsByDay.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun planning ce mois-ci
          </h3>
          <p className="text-gray-600 mb-6">
            Commencez par ajouter des employés à votre planning
          </p>
          <button
            onClick={() => onDateClick(new Date().toISOString().split('T')[0])}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Créer le premier créneau
          </button>
        </div>
      )}

      {/* Modal de détails du créneau */}
      {isModalOpen && selectedShift && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)' // Safari support
        }} onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Détails du créneau
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Contenu */}
            <div className="p-4 space-y-4">
              {/* Employé */}
              <div className="flex items-center space-x-3">
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: selectedUser.color }}
                />
                <div>
                  <p className="font-semibold text-gray-900">{selectedUser.name}</p>
                  <p className="text-sm text-gray-600">{selectedUser.role}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-gray-900">
                  {new Date(selectedShift.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>

              {/* Horaires */}
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <span className="font-mono text-gray-900">
                    {selectedShift.startTime} - {selectedShift.endTime}
                  </span>
                  {selectedShift.breakDuration > 0 && (
                    <p className="text-sm text-orange-600 mt-1">
                      Pause: {selectedShift.breakDuration} minutes
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedShift.notes && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedShift.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={handleEdit}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Modifier</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
