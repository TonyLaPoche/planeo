'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { shiftStorage } from '@/utils/storage';
import { Shift } from '@/types';
import { usePlanning } from '@/hooks/usePlanning';
import { ResponsiveCalendar } from '@/components/ResponsiveCalendar';
import { TeamLegend } from '@/components/calendar/TeamLegend';
import { PlanningInstructions } from '@/components/calendar/PlanningInstructions';
import { ShiftDetailsModal } from '@/components/ShiftDetailsModal';
import { formatDuration, calculateShiftDuration } from '@/utils/time';
import { Footer } from '@/components/Footer';

export default function PlanningPage() {
  const {
    users,
    shifts,
    currentMonth,
    calendarDays,
    shiftModal,
    loadData,
    getShiftsForDate,
    getUserById,
    navigateMonth,
    generateAutoShifts,
    closeShiftModal,
  } = usePlanning();

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [formData, setFormData] = useState({
    userId: '',
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 60,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId || !selectedDate) return;

    const shiftData: Shift = {
      id: editingShift?.id || crypto.randomUUID(),
      userId: formData.userId,
      date: selectedDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      breakDuration: formData.breakDuration,
      notes: formData.notes.trim() || undefined,
      createdAt: editingShift?.createdAt || new Date(),
    };

    shiftStorage.save(shiftData);
    loadData();
    closeModal();
  };

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift);
    setSelectedDate(shift.date);
    setFormData({
      userId: shift.userId,
      startTime: shift.startTime,
      endTime: shift.endTime,
      breakDuration: shift.breakDuration,
      notes: shift.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (shiftId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) {
      shiftStorage.delete(shiftId);
      loadData();
    }
  };

  const openModal = (date?: string) => {
    if (date) setSelectedDate(date);
    setEditingShift(null);
    setFormData({
      userId: users[0]?.id || '',
      startTime: '09:00',
      endTime: '17:00',
      breakDuration: 60,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingShift(null);
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Mobile-First */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row */}
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 p-2 -m-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                Planning {new Date(currentMonth + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => generateAutoShifts()}
                className="btn-secondary text-sm sm:text-base"
                aria-label="Générer automatiquement les créneaux du mois"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Auto-générer</span>
              </button>
              <button
                onClick={() => openModal()}
                className="btn-primary text-sm sm:text-base"
                aria-label="Ajouter un nouveau créneau horaire"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Ajouter</span>
              </button>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-center pb-3 sm:pb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="mx-4 text-base sm:text-lg font-semibold text-gray-900 text-center">
              {new Date(currentMonth + '-01').toLocaleDateString('fr-FR', {
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Mois suivant"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <PlanningInstructions />
        <TeamLegend users={users} shifts={shifts} />
        <ResponsiveCalendar
          calendarDays={calendarDays}
          getShiftsForDate={getShiftsForDate}
          getUserById={getUserById}
          onDateClick={openModal}
          onEditShift={handleEdit}
          onDeleteShift={handleDelete}
        />

      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)' // Safari support
        }} onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingShift ? 'Modifier le créneau' : 'Ajouter un créneau'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label htmlFor="userId" className="form-label">
                  Employé <span className="text-red-500">*</span>
                </label>
                <select
                  id="userId"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="form-input"
                  required
                  aria-describedby="user-help"
                >
                  <option value="">Sélectionner un employé</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <p id="user-help" className="sr-only">Sélectionnez l&apos;employé pour qui créer le créneau horaire</p>
              </div>

              <div>
                <label htmlFor="date" className="form-label">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="form-input"
                  required
                  aria-describedby="date-help"
                />
                <p id="date-help" className="sr-only">Sélectionnez la date du créneau horaire</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="form-label">
                    Heure de début <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="form-input"
                    required
                    aria-describedby="start-help"
                  />
                  <p id="start-help" className="sr-only">Heure de début du créneau de travail</p>
                </div>
                <div>
                  <label htmlFor="endTime" className="form-label">
                    Heure de fin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="form-input"
                    required
                    aria-describedby="end-help"
                  />
                  <p id="end-help" className="sr-only">Heure de fin du créneau de travail</p>
                </div>
              </div>

              <div>
                <label htmlFor="breakDuration" className="form-label">
                  Pause (minutes)
                </label>
                <input
                  type="number"
                  id="breakDuration"
                  value={formData.breakDuration}
                  onChange={(e) => setFormData({ ...formData, breakDuration: parseInt(e.target.value) || 0 })}
                  className="form-input"
                  min="0"
                  max="480"
                  aria-describedby="break-help"
                />
                <p id="break-help" className="sr-only">Durée de la pause en minutes (sera déduite du temps total)</p>
              </div>

              <div>
                <label htmlFor="notes" className="form-label">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="form-input"
                  placeholder="Notes optionnelles..."
                  aria-describedby="notes-help"
                />
                <p id="notes-help" className="sr-only">Informations supplémentaires sur ce créneau horaire</p>
              </div>

              {formData.startTime && formData.endTime && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 text-sm text-blue-800">
                    <span className="text-lg">⏱️</span>
                    <span className="font-medium">
                      Durée estimée: {formatDuration(
                        calculateShiftDuration({
                          id: '',
                          userId: '',
                          date: selectedDate,
                          startTime: formData.startTime,
                          endTime: formData.endTime,
                          breakDuration: formData.breakDuration,
                          createdAt: new Date(),
                        })
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary w-full sm:w-auto"
                  aria-label="Annuler et fermer le formulaire"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto"
                  aria-label={editingShift ? 'Enregistrer les modifications du créneau' : 'Ajouter le nouveau créneau'}
                >
                  {editingShift ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shift Details Modal */}
      <ShiftDetailsModal
        isOpen={shiftModal.isOpen}
        shift={shiftModal.shift}
        user={shiftModal.shift ? getUserById(shiftModal.shift.userId) || null : null}
        onClose={closeShiftModal}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
