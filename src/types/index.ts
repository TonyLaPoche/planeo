export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'employee' | 'manager';
  color: string; // Couleur pour l'affichage dans le planning
  weeklyHoursQuota: number; // Quota hebdomadaire en heures (ex: 35 pour 35h/semaine)
  contractType: 'full-time' | 'part-time' | 'freelance';
  isActive: boolean; // Si l'utilisateur est actif dans le planning
  createdAt: Date;
  updatedAt: Date;
}

export interface Shift {
  id: string;
  userId: string;
  date: string; // Format YYYY-MM-DD
  startTime: string; // Format HH:mm
  endTime: string; // Format HH:mm
  breakDuration: number; // Durée de la pause en minutes
  notes?: string;
  createdAt: Date;
}

export interface Planning {
  id: string;
  month: string; // Format YYYY-MM
  year: number;
  shifts: Shift[];
  totalHours: Record<string, number>; // userId -> total hours
  createdAt: Date;
  updatedAt: Date;
}

export interface Vacation {
  id: string;
  userId: string;
  startDate: string; // Format YYYY-MM-DD
  endDate: string; // Format YYYY-MM-DD
  type: 'vacation' | 'sick-leave' | 'personal-leave' | 'public-holiday';
  notes?: string;
  createdAt: Date;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'fr' | 'en';
  workingDays: number[]; // 0 = dimanche, 1 = lundi, etc.
  defaultBreakDuration: number; // minutes
  defaultWeeklyHours: number; // Heures par semaine par défaut (ex: 35)
  autoGenerateShifts: boolean; // Générer automatiquement les créneaux
  defaultShiftDuration: number; // Durée par défaut d'un créneau en heures
  businessHours: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
}

export interface PDFExportOptions {
  includeNotes: boolean;
  includeTotals: boolean;
  format: 'A4' | 'A3';
  orientation: 'portrait' | 'landscape';
}

// Types pour les calculs
export interface DailyHours {
  date: string;
  userId: string;
  totalHours: number;
  shifts: Shift[];
}

export interface WeeklyHours {
  weekStart: string;
  userId: string;
  totalHours: number;
  dailyHours: DailyHours[];
}

export interface MonthlyReport {
  month: string;
  userId: string;
  totalHours: number;
  totalDays: number;
  averageHoursPerDay: number;
  weeklyBreakdown: WeeklyHours[];
  quotaProgress: {
    requiredHours: number;
    workedHours: number;
    remainingHours: number;
    percentage: number;
  };
}

export interface ShiftTemplate {
  userId: string;
  dayOfWeek: number; // 0 = dimanche, 1 = lundi, etc.
  startTime: string;
  endTime: string;
  breakDuration: number;
}

export interface AutoGenerationOptions {
  month: string;
  users: User[];
  vacations: Vacation[];
  settings: AppSettings;
  templates: ShiftTemplate[];
}
