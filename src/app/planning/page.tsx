'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Bot, Trash2 } from 'lucide-react';
import { shiftStorage } from '@/utils/storage';
import { Shift } from '@/types';
import { usePlanning } from '@/hooks/usePlanning';
import { ResponsiveCalendar } from '@/components/ResponsiveCalendar';
import { TeamLegend } from '@/components/calendar/TeamLegend';
import { PlanningInstructions } from '@/components/calendar/PlanningInstructions';
import { ShiftDetailsModal } from '@/components/ShiftDetailsModal';
import { formatDuration, calculateShiftDuration } from '@/utils/time';
import { Footer } from '@/components/Footer';
import { CompactShopSelector } from '@/components/ShopSelector';
import { useTranslation } from '@/hooks/useTranslation';
import SEOHead from '@/components/SEOHead';

export default function PlanningPage() {
  const {
    users,
    shifts,
    currentMonth,
    calendarDays,
    shiftModal,
    shops,
    currentShopId,
    loadData,
    getShiftsForDate,
    getUserById,
    navigateMonth,
    generateShopPlanning,
    selectShop,
    closeShiftModal,
  } = usePlanning();
  
  const { t } = useTranslation();

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

  const handleClearCurrentMonth = () => {
    if (confirm(t('planning.clearMonthConfirm'))) {
      // Supprimer tous les shifts du mois en cours
      const monthKey = currentMonth; // currentMonth est déjà au format 'YYYY-MM'
      const allShifts = shiftStorage.getAll();
      const shiftsToDelete = allShifts.filter(shift => shift.date.startsWith(monthKey));
      
      shiftsToDelete.forEach(shift => {
        shiftStorage.delete(shift.id);
      });
      
      // Recharger les données
      loadData();
      
      // Formater le nom du mois pour l'affichage
      const [year, month] = currentMonth.split('-');
      const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                         'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      const monthName = `${monthNames[parseInt(month) - 1]} ${year}`;
      
      alert(t('planning.clearMonthSuccess', { count: shiftsToDelete.length, month: monthName }));
    }
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
    if (confirm(t('planning.deleteShiftConfirm'))) {
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
    <>
      <SEOHead page="planning" />
      <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Mobile-First */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row */}
          <div className="flex items-center justify-between py-3 sm:py-4 gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 p-2 -m-2 flex-shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 truncate">
                {t('planning.monthPlanning', { month: new Date(currentMonth + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) })}
              </h1>
            </div>
            
            {/* Actions compactes */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Sélecteur de magasin - plus compact */}
              <CompactShopSelector
                shops={shops}
                selectedShopId={currentShopId}
                onShopSelect={selectShop}
                className="max-w-[120px] sm:max-w-none"
              />

              {/* Boutons d'actions - plus compacts */}
              <button
                onClick={() => generateShopPlanning()}
                className="btn-primary text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2"
                disabled={!currentShopId}
                aria-label={t('planning.intelligentGeneration')}
                title={t('planning.intelligentGeneration')}
              >
                <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden lg:inline ml-1">IA</span>
              </button>

              <button
                onClick={handleClearCurrentMonth}
                className="btn-danger text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2"
                aria-label={t('planning.clearMonth')}
                title={t('planning.clearMonth')}
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden lg:inline ml-1">Clear</span>
              </button>

              <button
                onClick={() => openModal()}
                className="btn-secondary text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2"
                aria-label={t('planning.addShift')}
                title={t('planning.addShift')}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden lg:inline ml-1">Add</span>
              </button>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-center pb-3 sm:pb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              aria-label={t('planning.previousMonth')}
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
              aria-label={t('planning.nextMonth')}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <PlanningInstructions />
        
        {/* Notification système multi-magasins */}
        {!currentShopId && shops.length === 0 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Bot className="h-6 w-6 text-amber-600 mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-amber-900 mb-2">{t('planning.noShopConfigured')}</h3>
                <div className="text-sm text-amber-800 space-y-2">
                  <p>
                    {t('planning.noShopConfiguredDescription')}
                  </p>
                  <p>
                    <strong>{t('planning.stepsToFollow')}</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Allez dans <Link href="/advanced" className="underline hover:text-amber-900 font-medium">Gestion avancée</Link></li>
                    <li>Cliquez sur l&apos;onglet <strong>&quot;Magasins&quot;</strong></li>
                    <li>Créez votre premier magasin avec ses horaires et contraintes</li>
                    <li>Assignez des employés à ce magasin</li>
                    <li>Revenez ici pour générer votre planning</li>
                  </ol>
                  <div className="mt-4">
                    <Link 
                      href="/advanced" 
                      className="inline-flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 transition-colors"
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      {t('planning.goToAdvanced')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Message quand des magasins existent mais aucun n'est sélectionné */}
        {!currentShopId && shops.length > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Bot className="h-5 w-5 text-blue-600 mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-900">{t('planning.selectShop')}</h3>
                <div className="mt-1 text-sm text-blue-800">
                  <p>
                    {t('planning.selectShopDescription', { 
                      count: shops.length, 
                      plural: shops.length > 1 ? 's' : '' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentShopId && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Bot className="h-5 w-5 text-blue-600 mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-900">Planification Intelligente Active</h3>
                <div className="mt-1 text-sm text-blue-800">
                  <p>
                    La génération prend en compte les compétences, disponibilités, contraintes légales et optimise automatiquement votre planning pour {shops.find(s => s.id === currentShopId)?.name}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
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
                {editingShift ? t('planning.addShiftModal.editTitle') : t('planning.addShiftModal.title')}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label htmlFor="userId" className="form-label">
                  {t('planning.addShiftModal.employee')} <span className="text-red-500">*</span>
                </label>
                <select
                  id="userId"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="form-input"
                  required
                  aria-describedby="user-help"
                >
                  <option value="">{t('planning.addShiftModal.selectEmployee')}</option>
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
                  {t('planning.addShiftModal.date')} <span className="text-red-500">*</span>
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
                    {t('planning.addShiftModal.startTime')} <span className="text-red-500">*</span>
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
                    {t('planning.addShiftModal.endTime')} <span className="text-red-500">*</span>
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
                  {t('planning.addShiftModal.breakDuration')}
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
                  {t('planning.addShiftModal.notes')}
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="form-input"
                  placeholder={t('planning.addShiftModal.notesPlaceholder')}
                  aria-describedby="notes-help"
                />
                <p id="notes-help" className="sr-only">Informations supplémentaires sur ce créneau horaire</p>
              </div>

              {formData.startTime && formData.endTime && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 text-sm text-blue-800">
                    <span className="text-lg">⏱️</span>
                    <span className="font-medium">
                      {t('planning.addShiftModal.estimatedDuration')} {formatDuration(
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
                  {t('planning.addShiftModal.cancel')}
                </button>
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto"
                  aria-label={editingShift ? 'Enregistrer les modifications du créneau' : 'Ajouter le nouveau créneau'}
                >
                  {editingShift ? t('planning.addShiftModal.edit') : t('planning.addShiftModal.add')}
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
    </>
  );
}
