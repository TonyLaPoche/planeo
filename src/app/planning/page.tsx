'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { userStorage, shiftStorage, planningStorage } from '@/utils/storage';
import { User, Shift, Planning } from '@/types';
import { formatDate, formatDuration, calculateShiftDuration } from '@/utils/time';

export default function PlanningPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>('');
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

  useEffect(() => {
    loadData();
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setCurrentMonth(monthStr);
    setSelectedDate(now.toISOString().split('T')[0]);
  }, []);

  const loadData = () => {
    setUsers(userStorage.getAll());
    setShifts(shiftStorage.getAll());
  };

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

  const getShiftsForDate = (date: string) => {
    return shifts.filter(shift => shift.date === date);
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const [year, month] = currentMonth.split('-').map(Number);
    let newMonth = month;
    let newYear = year;

    if (direction === 'prev') {
      newMonth = month - 1;
      if (newMonth < 1) {
        newMonth = 12;
        newYear = year - 1;
      }
    } else {
      newMonth = month + 1;
      if (newMonth > 12) {
        newMonth = 1;
        newYear = year + 1;
      }
    }

    setCurrentMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const generateCalendarDays = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = dimanche

    const days = [];

    // Jours vides du début
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push(dateStr);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

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
              <h1 className="text-2xl font-bold text-gray-900">Planning</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-lg font-semibold text-gray-900">
                  {new Date(currentMonth + '-01').toLocaleDateString('fr-FR', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={() => openModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter un créneau</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Calendar Grid */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Days of week header */}
            <div className="grid grid-cols-7 bg-gray-50 border-b">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
                <div key={day} className="px-4 py-3 text-center text-sm font-medium text-gray-500 border-r last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((dateStr, index) => (
                <div
                  key={index}
                  className={`min-h-[120px] border-r border-b last:border-r-0 p-2 ${
                    dateStr ? 'hover:bg-gray-50 cursor-pointer' : ''
                  }`}
                  onClick={() => dateStr && openModal(dateStr)}
                >
                  {dateStr && (
                    <>
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {new Date(dateStr).getDate()}
                      </div>
                      <div className="space-y-1">
                        {getShiftsForDate(dateStr).map((shift) => {
                          const user = getUserById(shift.userId);
                          return (
                            <div
                              key={shift.id}
                              className="text-xs p-1 rounded flex items-center justify-between"
                              style={{ backgroundColor: user?.color + '20', borderLeft: `3px solid ${user?.color}` }}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate" style={{ color: user?.color }}>
                                  {user?.name}
                                </div>
                                <div className="text-gray-600">
                                  {shift.startTime}-{shift.endTime}
                                </div>
                              </div>
                              <div className="flex space-x-1 ml-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(shift);
                                  }}
                                  className="p-0.5 text-gray-400 hover:text-blue-600"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(shift.id);
                                  }}
                                  className="p-0.5 text-gray-400 hover:text-red-600"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Légende</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: user.color }}
                  />
                  <span className="text-sm text-gray-700">{user.name}</span>
                  <span className="text-xs text-gray-500">
                    ({shifts.filter(s => s.userId === user.id).length} créneaux)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingShift ? 'Modifier le créneau' : 'Ajouter un créneau'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                  Employé *
                </label>
                <select
                  id="userId"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un employé</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de début *
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de fin *
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="breakDuration" className="block text-sm font-medium text-gray-700 mb-1">
                  Pause (minutes)
                </label>
                <input
                  type="number"
                  id="breakDuration"
                  value={formData.breakDuration}
                  onChange={(e) => setFormData({ ...formData, breakDuration: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="480"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Notes optionnelles..."
                />
              </div>

              {formData.startTime && formData.endTime && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="flex items-center space-x-2 text-sm text-blue-700">
                    <Clock className="h-4 w-4" />
                    <span>
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

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  {editingShift ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
