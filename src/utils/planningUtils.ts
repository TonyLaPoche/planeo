import {
  User,
  Vacation,
  AppSettings,
  Shift,
  ShiftTemplate,
  AutoGenerationOptions,
  MonthlyReport
} from '@/types';
import { addDays, format, isWithinInterval, parseISO } from 'date-fns';

// Fonction pour calculer les heures requises pour un mois
export const calculateMonthlyQuota = (user: User, month: string): number => {
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr);
  const monthNum = parseInt(monthStr) - 1; // JavaScript months are 0-indexed

  // Nombre de semaines dans le mois (approximation)
  const lastDay = new Date(year, monthNum + 1, 0);
  const totalDays = lastDay.getDate();
  const numberOfWeeks = Math.ceil(totalDays / 7);

  return user.weeklyHoursQuota * numberOfWeeks;
};

// Fonction pour vérifier si une date est un congé
export const isVacationDay = (date: string, vacations: Vacation[], userId: string): boolean => {
  const targetDate = parseISO(date);
  return vacations.some(vacation => {
    if (vacation.userId !== userId) return false;
    const startDate = parseISO(vacation.startDate);
    const endDate = parseISO(vacation.endDate);
    return isWithinInterval(targetDate, { start: startDate, end: endDate });
  });
};

// Fonction pour vérifier si un jour est un jour de travail par défaut
export const isWorkingDay = (date: Date, workingDays: number[]): boolean => {
  const dayOfWeek = date.getDay(); // 0 = dimanche, 1 = lundi, etc.
  return workingDays.includes(dayOfWeek);
};

// Générer automatiquement les créneaux pour un mois
export const generateMonthlyShifts = (options: AutoGenerationOptions): Shift[] => {
  const { month, users, vacations, settings, templates } = options;
  const shifts: Shift[] = [];

  if (!settings.autoGenerateShifts) return shifts;

  // Créer la plage de dates pour le mois
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr);
  const monthNum = parseInt(monthStr) - 1;

  const firstDay = new Date(year, monthNum, 1);
  const lastDay = new Date(year, monthNum + 1, 0);

  // Pour chaque utilisateur actif
  users.filter(user => user.isActive).forEach(user => {
    // Trouver les templates pour cet utilisateur
    const userTemplates = templates.filter(template => template.userId === user.id);

    if (userTemplates.length === 0) return;

    // Générer les créneaux pour chaque jour du mois
    let currentDate = new Date(firstDay);
    while (currentDate <= lastDay) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const dayOfWeek = currentDate.getDay();

      // Vérifier si c'est un jour de travail et pas un congé
      if (isWorkingDay(currentDate, settings.workingDays) && !isVacationDay(dateStr, vacations, user.id)) {
        // Trouver le template pour ce jour de la semaine
        const template = userTemplates.find(t => t.dayOfWeek === dayOfWeek);

        if (template) {
          const shift: Shift = {
            id: `auto-${user.id}-${dateStr}`,
            userId: user.id,
            date: dateStr,
            startTime: template.startTime,
            endTime: template.endTime,
            breakDuration: template.breakDuration,
            notes: 'Créneau généré automatiquement',
            createdAt: new Date(),
          };
          shifts.push(shift);
        }
      }

      currentDate = addDays(currentDate, 1);
    }
  });

  return shifts;
};

// Calculer le progrès des quotas horaires
export const calculateQuotaProgress = (
  user: User,
  workedHours: number,
  month: string
): MonthlyReport['quotaProgress'] => {
  const requiredHours = calculateMonthlyQuota(user, month);
  const remainingHours = Math.max(0, requiredHours - workedHours);
  const percentage = requiredHours > 0 ? (workedHours / requiredHours) * 100 : 0;

  return {
    requiredHours,
    workedHours,
    remainingHours,
    percentage: Math.round(percentage * 100) / 100, // Arrondi à 2 décimales
  };
};

// Générer un template de créneau par défaut
export const createDefaultTemplate = (userId: string, settings: AppSettings): ShiftTemplate => {
  const [startHour, startMinute] = settings.businessHours.start.split(':');
  const [endHour, endMinute] = settings.businessHours.end.split(':');

  // Calculer la durée du créneau
  const startTime = parseInt(startHour) * 60 + parseInt(startMinute);
  const endTime = parseInt(endHour) * 60 + parseInt(endMinute);
  const totalMinutes = endTime - startTime - settings.defaultBreakDuration;
  const shiftDuration = Math.min(totalMinutes / 60, settings.defaultShiftDuration);

  const endTimeAdjusted = new Date();
  endTimeAdjusted.setHours(parseInt(startHour) + Math.floor(shiftDuration));
  endTimeAdjusted.setMinutes(parseInt(startMinute) + (shiftDuration % 1) * 60);

  return {
    userId,
    dayOfWeek: 1, // Lundi par défaut
    startTime: settings.businessHours.start,
    endTime: format(endTimeAdjusted, 'HH:mm'),
    breakDuration: settings.defaultBreakDuration,
  };
};

// Fonction pour obtenir les jours travaillés dans un mois
export const getWorkingDaysInMonth = (month: string, workingDays: number[]): Date[] => {
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr);
  const monthNum = parseInt(monthStr) - 1;

  const firstDay = new Date(year, monthNum, 1);
  const lastDay = new Date(year, monthNum + 1, 0);

  const workingDaysInMonth: Date[] = [];
  let currentDate = new Date(firstDay);

  while (currentDate <= lastDay) {
    if (isWorkingDay(currentDate, workingDays)) {
      workingDaysInMonth.push(new Date(currentDate));
    }
    currentDate = addDays(currentDate, 1);
  }

  return workingDaysInMonth;
};
