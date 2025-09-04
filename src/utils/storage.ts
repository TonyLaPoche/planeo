import { User, Shift, Planning, AppSettings } from '@/types';

const STORAGE_KEYS = {
  USERS: 'planning_users',
  SHIFTS: 'planning_shifts',
  PLANNINGS: 'planning_plannings',
  SETTINGS: 'planning_settings',
  CURRENT_PLANNING: 'planning_current',
} as const;

// Utilitaires génériques pour localStorage
const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Erreur lors de la lecture de ${key}:`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Erreur lors de la suppression de ${key}:`, error);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Erreur lors du nettoyage du stockage:', error);
    }
  },
};

// Fonctions spécifiques pour chaque type de données
export const userStorage = {
  getAll: (): User[] => {
    const users = storage.get<User[]>(STORAGE_KEYS.USERS);
    return users || [];
  },

  getById: (id: string): User | null => {
    const users = userStorage.getAll();
    return users.find(user => user.id === id) || null;
  },

  save: (user: User): void => {
    const users = userStorage.getAll();
    const existingIndex = users.findIndex(u => u.id === user.id);

    if (existingIndex >= 0) {
      users[existingIndex] = { ...user, updatedAt: new Date() };
    } else {
      users.push(user);
    }

    storage.set(STORAGE_KEYS.USERS, users);
  },

  delete: (id: string): void => {
    const users = userStorage.getAll();
    const filteredUsers = users.filter(user => user.id !== id);
    storage.set(STORAGE_KEYS.USERS, filteredUsers);
  },
};

export const shiftStorage = {
  getAll: (): Shift[] => {
    const shifts = storage.get<Shift[]>(STORAGE_KEYS.SHIFTS);
    return shifts || [];
  },

  getByDateRange: (startDate: string, endDate: string): Shift[] => {
    const shifts = shiftStorage.getAll();
    return shifts.filter(shift =>
      shift.date >= startDate && shift.date <= endDate
    );
  },

  getByUserId: (userId: string): Shift[] => {
    const shifts = shiftStorage.getAll();
    return shifts.filter(shift => shift.userId === userId);
  },

  save: (shift: Shift): void => {
    const shifts = shiftStorage.getAll();
    const existingIndex = shifts.findIndex(s => s.id === shift.id);

    if (existingIndex >= 0) {
      shifts[existingIndex] = shift;
    } else {
      shifts.push(shift);
    }

    storage.set(STORAGE_KEYS.SHIFTS, shifts);
  },

  delete: (id: string): void => {
    const shifts = shiftStorage.getAll();
    const filteredShifts = shifts.filter(shift => shift.id !== id);
    storage.set(STORAGE_KEYS.SHIFTS, filteredShifts);
  },

  deleteByUserId: (userId: string): void => {
    const shifts = shiftStorage.getAll();
    const filteredShifts = shifts.filter(shift => shift.userId !== userId);
    storage.set(STORAGE_KEYS.SHIFTS, filteredShifts);
  },
};

export const planningStorage = {
  getAll: (): Planning[] => {
    const plannings = storage.get<Planning[]>(STORAGE_KEYS.PLANNINGS);
    return plannings || [];
  },

  getById: (id: string): Planning | null => {
    const plannings = planningStorage.getAll();
    return plannings.find(planning => planning.id === id) || null;
  },

  getByMonth: (month: string): Planning | null => {
    const plannings = planningStorage.getAll();
    return plannings.find(planning => planning.month === month) || null;
  },

  save: (planning: Planning): void => {
    const plannings = planningStorage.getAll();
    const existingIndex = plannings.findIndex(p => p.id === planning.id);

    if (existingIndex >= 0) {
      plannings[existingIndex] = { ...planning, updatedAt: new Date() };
    } else {
      plannings.push(planning);
    }

    storage.set(STORAGE_KEYS.PLANNINGS, plannings);
  },

  delete: (id: string): void => {
    const plannings = planningStorage.getAll();
    const filteredPlannings = plannings.filter(planning => planning.id !== id);
    storage.set(STORAGE_KEYS.PLANNINGS, filteredPlannings);
  },
};

export const settingsStorage = {
  get: (): AppSettings => {
    const settings = storage.get<AppSettings>(STORAGE_KEYS.SETTINGS);
    return settings || {
      theme: 'light',
      language: 'fr',
      workingDays: [1, 2, 3, 4, 5, 6], // Lundi à Samedi
      defaultBreakDuration: 60, // 1 heure
      businessHours: {
        start: '09:00',
        end: '18:00',
      },
    };
  },

  save: (settings: AppSettings): void => {
    storage.set(STORAGE_KEYS.SETTINGS, settings);
  },
};

export const currentPlanningStorage = {
  get: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.CURRENT_PLANNING);
  },

  set: (planningId: string): void => {
    storage.set(STORAGE_KEYS.CURRENT_PLANNING, planningId);
  },

  clear: (): void => {
    storage.remove(STORAGE_KEYS.CURRENT_PLANNING);
  },
};

// Fonction d'export/import pour sauvegarde
export const dataExport = {
  export: () => {
    return {
      users: userStorage.getAll(),
      shifts: shiftStorage.getAll(),
      plannings: planningStorage.getAll(),
      settings: settingsStorage.get(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
  },

  import: (data: any) => {
    if (data.users) storage.set(STORAGE_KEYS.USERS, data.users);
    if (data.shifts) storage.set(STORAGE_KEYS.SHIFTS, data.shifts);
    if (data.plannings) storage.set(STORAGE_KEYS.PLANNINGS, data.plannings);
    if (data.settings) storage.set(STORAGE_KEYS.SETTINGS, data.settings);
  },
};
