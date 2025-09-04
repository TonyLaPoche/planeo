import { Shift, DailyHours, WeeklyHours, MonthlyReport } from '@/types';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Calcule la durée d'un shift en heures
 */
export const calculateShiftDuration = (shift: Shift): number => {
  const start = parseISO(`${shift.date}T${shift.startTime}`);
  const end = parseISO(`${shift.date}T${shift.endTime}`);
  const totalMinutes = differenceInMinutes(end, start) - shift.breakDuration;
  return Math.max(0, totalMinutes / 60); // Retourne au minimum 0
};

/**
 * Calcule les heures totales pour une journée
 */
export const calculateDailyHours = (shifts: Shift[], date: string, userId: string): DailyHours => {
  const dayShifts = shifts.filter(shift =>
    shift.date === date && shift.userId === userId
  );

  const totalHours = dayShifts.reduce((total, shift) =>
    total + calculateShiftDuration(shift), 0
  );

  return {
    date,
    userId,
    totalHours: Math.round(totalHours * 100) / 100, // Arrondi à 2 décimales
    shifts: dayShifts,
  };
};

/**
 * Calcule les heures hebdomadaires
 */
export const calculateWeeklyHours = (
  shifts: Shift[],
  weekStart: string,
  userId: string
): WeeklyHours => {
  const start = parseISO(weekStart);
  const end = endOfWeek(start, { weekStartsOn: 1 }); // Lundi comme début de semaine

  const days = eachDayOfInterval({ start, end });

  const dailyHours = days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return calculateDailyHours(shifts, dateStr, userId);
  });

  const totalHours = dailyHours.reduce((total, day) => total + day.totalHours, 0);

  return {
    weekStart,
    userId,
    totalHours: Math.round(totalHours * 100) / 100,
    dailyHours,
  };
};

/**
 * Génère un rapport mensuel complet
 */
export const generateMonthlyReport = (
  shifts: Shift[],
  month: string,
  userId: string
): MonthlyReport => {
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr);
  const monthNum = parseInt(monthStr) - 1; // JavaScript months are 0-indexed

  const monthStart = new Date(year, monthNum, 1);
  const monthEnd = new Date(year, monthNum + 1, 0);

  // Filtrer les shifts du mois
  const monthShifts = shifts.filter(shift => {
    const shiftDate = parseISO(shift.date);
    return isSameMonth(shiftDate, monthStart) && shift.userId === userId;
  });

  // Calculer les semaines
  const weeks: WeeklyHours[] = [];
  let currentWeek = startOfWeek(monthStart, { weekStartsOn: 1 });

  while (currentWeek <= monthEnd) {
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
    const weekStartStr = format(currentWeek, 'yyyy-MM-dd');

    weeks.push(calculateWeeklyHours(monthShifts, weekStartStr, userId));

    // Passer à la semaine suivante
    currentWeek = new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
  }

  const totalHours = weeks.reduce((total, week) => total + week.totalHours, 0);
  const totalDays = monthShifts.length;

  return {
    month,
    userId,
    totalHours: Math.round(totalHours * 100) / 100,
    totalDays,
    averageHoursPerDay: totalDays > 0 ? Math.round((totalHours / totalDays) * 100) / 100 : 0,
    weeklyBreakdown: weeks,
  };
};

/**
 * Formate une durée en heures et minutes
 */
export const formatDuration = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (wholeHours === 0) {
    return `${minutes}min`;
  } else if (minutes === 0) {
    return `${wholeHours}h`;
  } else {
    return `${wholeHours}h${minutes.toString().padStart(2, '0')}`;
  }
};

/**
 * Formate une date en français
 */
export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: fr });
};

/**
 * Génère les jours travaillés pour un mois
 */
export const getWorkingDaysInMonth = (month: string, workingDays: number[]): string[] => {
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr);
  const monthNum = parseInt(monthStr) - 1;

  const monthStart = new Date(year, monthNum, 1);
  const monthEnd = new Date(year, monthNum + 1, 0);

  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return days
    .filter(day => workingDays.includes(day.getDay()))
    .map(day => format(day, 'yyyy-MM-dd'));
};

/**
 * Valide un horaire (format HH:mm)
 */
export const isValidTime = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Compare deux horaires
 */
export const compareTimes = (time1: string, time2: string): number => {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);

  const total1 = h1 * 60 + m1;
  const total2 = h2 * 60 + m2;

  return total1 - total2;
};

/**
 * Génère une couleur aléatoire pour un utilisateur
 */
export const generateUserColor = (): string => {
  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
    '#6366f1', // indigo
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};
