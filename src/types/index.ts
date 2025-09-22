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

  // ===== NOUVELLES PROPRIÉTÉS POUR LA PLANIFICATION AUTOMATIQUE =====
  
  // Contraintes légales personnalisées
  maxDailyHours?: number; // Ex: 8h max/jour (défaut: 10h légal)
  minRestBetweenShifts?: number; // Ex: 11h minimum (défaut: 11h légal)
  maxConsecutiveDays?: number; // Ex: 6 jours max (défaut: 6 jours)
  
  // Compétences et qualifications
  skills?: string[]; // Ex: ['caisse', 'stock', 'manager', 'cuisine']
  certifications?: string[]; // Ex: ['HACCP', 'Permis cariste']
  
  // Disponibilités avancées
  availability?: {
    [key: string]: { // 'monday', 'tuesday', etc.
      available: boolean;
      preferredStart?: string; // Heure préférée de début
      preferredEnd?: string; // Heure préférée de fin
      unavailableSlots?: { // Créneaux indisponibles
        start: string;
        end: string;
      }[];
    };
  };
  
  // Jours travaillés (0=dimanche, 1=lundi, ..., 6=samedi)
  workingDays?: number[];
  
  // Préférences personnelles
  preferences?: {
    preferredShifts?: ('morning' | 'afternoon' | 'evening')[]; // Créneaux préférés
    preferredDaysOff?: number[]; // Jours préférés de repos (0=dim, 1=lun...)
    fixedDaysOff?: number[]; // Jours de congé fixes (prioritaires pour temps partiel)
    maxWeeklyHours?: number; // Limite personnelle (peut être < quota)
  };
  
  // Informations RH
  hourlyRate?: number; // Taux horaire pour calculs de coût
  seniority?: number; // Ancienneté en mois
  priority?: number; // Priorité pour l'attribution (1-5)
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
  language: 'fr' | 'en' | 'de' | 'it';
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
  storeConfig?: StoreConfiguration; // Nouvelle configuration magasin
}

// ===== NOUVEAUX TYPES POUR LA PLANIFICATION AUTOMATIQUE =====

export interface Shop {
  id: string;
  name: string;
  description?: string;
  
  // Horaires d'ouverture par jour
  openingHours: {
    [key: string]: { // 'monday', 'tuesday', etc.
      isOpen: boolean;
      openTime: string; // HH:mm
      closeTime: string; // HH:mm
      lunchBreak?: {
        start: string; // HH:mm
        end: string; // HH:mm
      };
    };
  };
  
  // Équipe assignée à ce magasin
  assignedEmployees: string[]; // Array des User IDs
  
  // Besoins en personnel par créneau
  staffRequirements: {
    timeSlot: string; // Ex: "09:00-12:00"
    minStaff: number; // Minimum de personnes
    optimalStaff: number; // Nombre optimal
    requiredSkills?: string[]; // Compétences obligatoires
    preferredSkills?: string[]; // Compétences préférées
  }[];
  
  // Contraintes spécifiques à ce magasin
  constraints: {
    maxSimultaneousBreaks: number; // Max de personnes en pause simultanément
    minStaffDuringBreaks: number; // Staff minimum pendant les pauses
    prioritySkills: string[]; // Compétences prioritaires (ex: manager)
  };
  
  // Périodes spéciales pour ce magasin
  specialPeriods?: {
    name: string; // Ex: "Soldes", "Inventaire"
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    staffMultiplier: number; // Multiplicateur du besoin (ex: 1.5 = +50%)
    additionalSkills?: string[]; // Compétences supplémentaires requises
  }[];
  
  isActive: boolean; // Si le magasin est actif
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreConfiguration {
  id: string;
  name: string; // Nom du magasin/organisation
  
  // Horaires d'ouverture détaillés (remplace businessHours simple)
  openingHours: {
    [key: string]: { // 'monday', 'tuesday', etc.
      isOpen: boolean;
      openTime: string; // HH:mm
      closeTime: string; // HH:mm
      lunchBreak?: {
        start: string; // HH:mm
        end: string; // HH:mm
      };
    };
  };
  
  // Besoins en personnel par créneau
  staffRequirements: {
    timeSlot: string; // Ex: "09:00-12:00"
    minStaff: number; // Minimum de personnes
    optimalStaff: number; // Nombre optimal
    requiredSkills?: string[]; // Compétences obligatoires
    preferredSkills?: string[]; // Compétences préférées
  }[];
  
  // Contraintes spécifiques
  constraints: {
    maxSimultaneousBreaks: number; // Max de personnes en pause simultanément
    minStaffDuringBreaks: number; // Staff minimum pendant les pauses
    prioritySkills: string[]; // Compétences prioritaires (ex: manager)
  };
  
  // Périodes spéciales
  specialPeriods?: {
    name: string; // Ex: "Soldes", "Inventaire"
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    staffMultiplier: number; // Multiplicateur du besoin (ex: 1.5 = +50%)
    additionalSkills?: string[]; // Compétences supplémentaires requises
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}

// Types pour l'algorithme de planification avancé
export interface ConstraintViolation {
  type: 'legal' | 'organizational' | 'preference';
  severity: 'error' | 'warning' | 'info';
  message: string;
  userId?: string;
  shiftId?: string;
  date?: string;
}

export interface PlanningScore {
  total: number; // Score global (0-100)
  legalCompliance: number; // Conformité légale (0-100)
  skillCoverage: number; // Couverture des compétences (0-100)
  employeeSatisfaction: number; // Satisfaction employés (0-100)
  costOptimization: number; // Optimisation des coûts (0-100)
  workloadBalance: number; // Équilibrage de la charge (0-100)
}

export interface GenerationResult {
  shifts: Shift[];
  score: PlanningScore;
  violations: ConstraintViolation[];
  statistics: {
    totalHours: number;
    totalCost?: number;
    employeesUsed: number;
    skillsCovered: string[];
  };
}

export interface AdvancedGenerationOptions extends AutoGenerationOptions {
  storeConfig: StoreConfiguration;
  optimizationPriorities: {
    legalCompliance: number; // Poids (0-1)
    skillCoverage: number;
    employeeSatisfaction: number;
    costOptimization: number;
    workloadBalance: number;
  };
  allowPartialSolutions: boolean; // Accepter des solutions partielles
  maxIterations?: number; // Limite d'itérations pour l'optimisation
}

export interface ShopPlanningOptions {
  month: string;
  shop: Shop; // Magasin sélectionné
  users: User[]; // Tous les utilisateurs (sera filtré par shop.assignedEmployees)
  vacations: Vacation[];
  settings: AppSettings;
  templates: ShiftTemplate[];
  optimizationPriorities: {
    legalCompliance: number;
    skillCoverage: number;
    employeeSatisfaction: number;
    costOptimization: number;
    workloadBalance: number;
  };
  maxIterations?: number;
}
