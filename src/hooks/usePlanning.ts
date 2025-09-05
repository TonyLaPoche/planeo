'use client';

import { useState, useEffect } from 'react';
import { User, Shift } from '@/types';
import { userStorage, shiftStorage, settingsStorage, dataExport } from '@/utils/storage';
import { generateMonthlyShifts } from '@/utils/planningUtils';

export function usePlanning() {
  const [users, setUsers] = useState<User[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [shiftModal, setShiftModal] = useState<{ isOpen: boolean; shift: Shift | null }>({
    isOpen: false,
    shift: null
  });

  useEffect(() => {
    loadData();
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setCurrentMonth(monthStr);
  }, []);

  const loadData = () => {
    setUsers(userStorage.getAll());
    setShifts(shiftStorage.getAll());
  };

  const getShiftsForDate = (date: string): Shift[] => {
    return shifts.filter(shift => shift.date === date);
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const openShiftModal = (shift: Shift) => {
    setShiftModal({ isOpen: true, shift });
  };

  const closeShiftModal = () => {
    setShiftModal({ isOpen: false, shift: null });
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

  const generateAutoShifts = async (month: string = currentMonth) => {
    try {
      const settings = settingsStorage.get();
      if (!settings?.autoGenerateShifts) {
        alert('La génération automatique n\'est pas activée. Allez dans Paramètres > Génération automatique pour l\'activer.');
        console.log('Génération automatique désactivée dans les paramètres');
        return;
      }

      const activeUsers = users.filter(user => user.isActive);
      if (activeUsers.length === 0) {
        alert('Aucun utilisateur actif trouvé. Activez au moins un utilisateur dans la gestion des utilisateurs.');
        console.log('Aucun utilisateur actif trouvé');
        return;
      }

      const vacations = dataExport.getVacations();
      const templates = dataExport.getShiftTemplates();

      if (templates.length === 0) {
        alert('Aucun template de créneau trouvé. Créez des templates dans Gestion avancée > Templates.');
        console.log('Aucun template de créneau trouvé');
        return;
      }

      // Vérifier que tous les utilisateurs actifs ont au moins un template
      const usersWithoutTemplates = activeUsers.filter(user =>
        !templates.some(template => template.userId === user.id)
      );

      if (usersWithoutTemplates.length > 0) {
        const names = usersWithoutTemplates.map(u => u.name).join(', ');
        alert(`Les utilisateurs suivants n'ont pas de template : ${names}. Créez des templates pour eux dans Gestion avancée > Templates.`);
        console.log('Utilisateurs sans template:', usersWithoutTemplates);
        return;
      }

      // Vérifier que tous les utilisateurs actifs ont un quota horaire défini
      const usersWithoutQuota = activeUsers.filter(user =>
        !user.weeklyHoursQuota || user.weeklyHoursQuota <= 0
      );

      if (usersWithoutQuota.length > 0) {
        const names = usersWithoutQuota.map(u => u.name).join(', ');
        alert(`Les utilisateurs suivants n'ont pas de quota horaire défini : ${names}. Définissez leurs quotas dans la gestion des utilisateurs.`);
        console.log('Utilisateurs sans quota:', usersWithoutQuota);
        return;
      }

      const autoShifts = generateMonthlyShifts({
        month,
        users,
        vacations,
        settings,
        templates,
      });

      // Filtrer les créneaux qui existent déjà pour éviter les doublons
      const existingShifts = shifts.filter(shift =>
        shift.date.startsWith(month) && !shift.notes?.includes('généré automatiquement')
      );

      const newShifts = autoShifts.filter(autoShift => {
        return !existingShifts.some(existing =>
          existing.userId === autoShift.userId &&
          existing.date === autoShift.date &&
          existing.startTime === autoShift.startTime
        );
      });

      if (newShifts.length > 0) {
        // Sauvegarder les nouveaux créneaux
        newShifts.forEach(shift => {
          shiftStorage.save(shift);
        });

        // Recharger les données
        loadData();

        alert(`✅ ${newShifts.length} créneaux générés automatiquement pour ${month}!`);
        console.log(`${newShifts.length} créneaux générés automatiquement pour ${month}`);
      } else {
        alert('ℹ️ Aucun nouveau créneau à générer. Tous les créneaux possibles existent déjà ou sont en congé.');
        console.log('Aucun nouveau créneau à générer');
      }
    } catch (error) {
      console.error('Erreur lors de la génération automatique:', error);
    }
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

  return {
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
    openShiftModal,
    closeShiftModal,
  };
}
