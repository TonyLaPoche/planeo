import { User, Shift, Planning, AppSettings, Vacation, ShiftTemplate, StoreConfiguration, Shop } from '@/types';

const STORAGE_KEYS = {
  USERS: 'planning_users',
  SHIFTS: 'planning_shifts',
  PLANNINGS: 'planning_plannings',
  SETTINGS: 'planning_settings',
  CURRENT_PLANNING: 'planning_current',
  VACATIONS: 'planning_vacations',
  SHIFT_TEMPLATES: 'planning_shift_templates',
  STORE_CONFIG: 'planning_store_config', // Nouvelle clé pour la configuration magasin
  SHOPS: 'planning_shops', // Nouvelle clé pour les magasins
  CURRENT_SHOP: 'planning_current_shop', // Magasin actuellement sélectionné
  DATA_VERSION: 'planning_data_version', // Version des données pour migration
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
      defaultWeeklyHours: 35,
      autoGenerateShifts: false,
      defaultShiftDuration: 8,
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

  // Gestion des congés
  getVacations: (): Vacation[] => {
    return storage.get<Vacation[]>(STORAGE_KEYS.VACATIONS) || [];
  },

  addVacation: (vacation: Vacation): void => {
    const vacations = dataExport.getVacations();
    vacations.push(vacation);
    storage.set(STORAGE_KEYS.VACATIONS, vacations);
  },

  updateVacation: (id: string, updates: Partial<Vacation>): void => {
    const vacations = dataExport.getVacations();
    const index = vacations.findIndex(v => v.id === id);
    if (index !== -1) {
      vacations[index] = { ...vacations[index], ...updates };
      storage.set(STORAGE_KEYS.VACATIONS, vacations);
    }
  },

  deleteVacation: (id: string): void => {
    const vacations = dataExport.getVacations();
    const filtered = vacations.filter(v => v.id !== id);
    storage.set(STORAGE_KEYS.VACATIONS, filtered);
  },

  // Gestion des templates de créneaux
  getShiftTemplates: (): ShiftTemplate[] => {
    return storage.get<ShiftTemplate[]>(STORAGE_KEYS.SHIFT_TEMPLATES) || [];
  },

  saveShiftTemplate: (template: ShiftTemplate): void => {
    const templates = dataExport.getShiftTemplates();
    const existingIndex = templates.findIndex(t => t.userId === template.userId && t.dayOfWeek === template.dayOfWeek);

    if (existingIndex !== -1) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }

    storage.set(STORAGE_KEYS.SHIFT_TEMPLATES, templates);
  },

  deleteShiftTemplate: (userId: string, dayOfWeek: number): void => {
    const templates = dataExport.getShiftTemplates();
    const filtered = templates.filter(t => !(t.userId === userId && t.dayOfWeek === dayOfWeek));
    storage.set(STORAGE_KEYS.SHIFT_TEMPLATES, filtered);
  },

  import: (data: Record<string, unknown>) => {
    if (data.users) storage.set(STORAGE_KEYS.USERS, data.users);
    if (data.shifts) storage.set(STORAGE_KEYS.SHIFTS, data.shifts);
    if (data.plannings) storage.set(STORAGE_KEYS.PLANNINGS, data.plannings);
    if (data.settings) storage.set(STORAGE_KEYS.SETTINGS, data.settings);
    if (data.vacations) storage.set(STORAGE_KEYS.VACATIONS, data.vacations);
    if (data.shiftTemplates) storage.set(STORAGE_KEYS.SHIFT_TEMPLATES, data.shiftTemplates);
    if (data.storeConfig) storage.set(STORAGE_KEYS.STORE_CONFIG, data.storeConfig);
    if (data.shops) storage.set(STORAGE_KEYS.SHOPS, data.shops);
    
    // Mettre à jour la version des données
    storage.set(STORAGE_KEYS.DATA_VERSION, '3.0.0');
  },
};

// ===== GESTION DE LA CONFIGURATION MAGASIN =====

export const storeConfigStorage = {
  get: (): StoreConfiguration | null => {
    return storage.get<StoreConfiguration>(STORAGE_KEYS.STORE_CONFIG);
  },

  save: (config: StoreConfiguration): void => {
    storage.set(STORAGE_KEYS.STORE_CONFIG, {
      ...config,
      updatedAt: new Date()
    });
  },

  // Créer une configuration par défaut basée sur les settings existants
  createDefault: (settings: AppSettings): StoreConfiguration => {
    const defaultConfig: StoreConfiguration = {
      id: `store-${Date.now()}`,
      name: 'Mon Magasin',
      openingHours: {
        monday: { isOpen: true, openTime: settings.businessHours.start, closeTime: settings.businessHours.end },
        tuesday: { isOpen: true, openTime: settings.businessHours.start, closeTime: settings.businessHours.end },
        wednesday: { isOpen: true, openTime: settings.businessHours.start, closeTime: settings.businessHours.end },
        thursday: { isOpen: true, openTime: settings.businessHours.start, closeTime: settings.businessHours.end },
        friday: { isOpen: true, openTime: settings.businessHours.start, closeTime: settings.businessHours.end },
        saturday: { isOpen: settings.workingDays.includes(6), openTime: settings.businessHours.start, closeTime: settings.businessHours.end },
        sunday: { isOpen: settings.workingDays.includes(0), openTime: settings.businessHours.start, closeTime: settings.businessHours.end },
      },
      staffRequirements: [
        {
          timeSlot: `${settings.businessHours.start}-${settings.businessHours.end}`,
          minStaff: 1,
          optimalStaff: 2,
        }
      ],
      constraints: {
        maxSimultaneousBreaks: 1,
        minStaffDuringBreaks: 1,
        prioritySkills: ['manager']
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    storeConfigStorage.save(defaultConfig);
    return defaultConfig;
  },

  delete: (): void => {
    storage.remove(STORAGE_KEYS.STORE_CONFIG);
  }
};

// ===== GESTION DES MAGASINS =====

export const shopStorage = {
  getAll: (): Shop[] => {
    return storage.get<Shop[]>(STORAGE_KEYS.SHOPS) || [];
  },

  getById: (id: string): Shop | null => {
    const shops = shopStorage.getAll();
    return shops.find(shop => shop.id === id) || null;
  },

  save: (shop: Shop): void => {
    const shops = shopStorage.getAll();
    const existingIndex = shops.findIndex(s => s.id === shop.id);

    if (existingIndex >= 0) {
      shops[existingIndex] = { ...shop, updatedAt: new Date() };
    } else {
      shops.push(shop);
    }

    storage.set(STORAGE_KEYS.SHOPS, shops);
  },

  delete: (id: string): void => {
    const shops = shopStorage.getAll();
    const filteredShops = shops.filter(shop => shop.id !== id);
    storage.set(STORAGE_KEYS.SHOPS, filteredShops);
  },

  // Créer un magasin par défaut
  createDefault: (settings: AppSettings): Shop => {
    const defaultShop: Shop = {
      id: `shop-${Date.now()}`,
      name: 'Magasin Principal',
      description: 'Magasin principal de l\'entreprise',
      openingHours: {
        monday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
        tuesday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
        wednesday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
        thursday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
        friday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
        saturday: { isOpen: settings.workingDays.includes(6), openTime: '10:00', closeTime: '19:00' },
        sunday: { isOpen: settings.workingDays.includes(0), openTime: '10:00', closeTime: '19:00' },
      },
      assignedEmployees: [], // Sera peuplé par la migration
      staffRequirements: [
        {
          timeSlot: '10:00-19:00',
          minStaff: 1,
          optimalStaff: 3, // Par défaut 3 employés pour couvrir tous les employés
        }
      ],
      constraints: {
        maxSimultaneousBreaks: 1,
        minStaffDuringBreaks: 2,
        prioritySkills: ['manager']
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    shopStorage.save(defaultShop);
    return defaultShop;
  },

  // Assigner un employé à un magasin
  assignEmployee: (shopId: string, userId: string): void => {
    const shop = shopStorage.getById(shopId);
    if (shop && !shop.assignedEmployees.includes(userId)) {
      shop.assignedEmployees.push(userId);
      shopStorage.save(shop);
    }
  },

  // Désassigner un employé d'un magasin
  unassignEmployee: (shopId: string, userId: string): void => {
    const shop = shopStorage.getById(shopId);
    if (shop) {
      shop.assignedEmployees = shop.assignedEmployees.filter(id => id !== userId);
      shopStorage.save(shop);
    }
  },

  // Obtenir les employés d'un magasin
  getShopEmployees: (shopId: string, allUsers: User[]): User[] => {
    const shop = shopStorage.getById(shopId);
    if (!shop) return [];
    
    return allUsers.filter(user => shop.assignedEmployees.includes(user.id));
  }
};

// ===== GESTION DU MAGASIN ACTUEL =====

export const currentShopStorage = {
  get: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.CURRENT_SHOP);
  },

  set: (shopId: string): void => {
    storage.set(STORAGE_KEYS.CURRENT_SHOP, shopId);
  },

  clear: (): void => {
    storage.remove(STORAGE_KEYS.CURRENT_SHOP);
  }
};

// ===== GESTION DE LA MIGRATION DES DONNÉES =====

export const migrationUtils = {
  getCurrentVersion: (): string => {
    return storage.get<string>(STORAGE_KEYS.DATA_VERSION) || '1.0.0';
  },

  setVersion: (version: string): void => {
    storage.set(STORAGE_KEYS.DATA_VERSION, version);
  },

  // Migration des utilisateurs vers le nouveau format
  migrateUsersToV2: (): void => {
    const users = userStorage.getAll();
    const migratedUsers = users.map(user => ({
      ...user,
      // Ajouter les valeurs par défaut pour les nouvelles propriétés
      maxDailyHours: user.maxDailyHours || 10,
      minRestBetweenShifts: user.minRestBetweenShifts || 11,
      maxConsecutiveDays: user.maxConsecutiveDays || 6,
      skills: user.skills || [],
      certifications: user.certifications || [],
      availability: user.availability || {},
      preferences: user.preferences || {},
      seniority: user.seniority || 0,
      priority: user.priority || 3
    }));

    // Sauvegarder les utilisateurs migrés
    storage.set(STORAGE_KEYS.USERS, migratedUsers);
  },

  // Vérifier si une migration est nécessaire
  needsMigration: (): boolean => {
    const currentVersion = migrationUtils.getCurrentVersion();
    return currentVersion !== '3.0.0';
  },

  // Migration vers v3.0.0 (système multi-magasins)
  migrateToV3: (): void => {
    console.log('🔄 Migration vers le système multi-magasins v3.0.0...');
    
    // Ne plus créer automatiquement de magasin par défaut
    // L'utilisateur devra créer ses magasins manuellement dans Advanced > Magasins
    console.log('✅ Migration terminée - Créez vos magasins dans Advanced > Magasins');
  },

  // Effectuer toutes les migrations nécessaires
  performMigration: (): void => {
    const currentVersion = migrationUtils.getCurrentVersion();
    
    if (currentVersion === '1.0.0') {
      console.log('🔄 Migration des données vers v2.0.0...');
      
      // Migrer les utilisateurs
      migrationUtils.migrateUsersToV2();
      
      // Créer une configuration de magasin par défaut
      const settings = settingsStorage.get();
      storeConfigStorage.createDefault(settings);
      
      // Migrer vers v3.0.0
      migrationUtils.migrateToV3();
      
      // Mettre à jour la version
      migrationUtils.setVersion('3.0.0');
      
      console.log('✅ Migration terminée avec succès !');
    } else if (currentVersion === '2.0.0') {
      console.log('🔄 Migration v2.0.0 → v3.0.0...');
      
      // Migrer vers v3.0.0
      migrationUtils.migrateToV3();
      
      // Mettre à jour la version
      migrationUtils.setVersion('3.0.0');
      
      console.log('✅ Migration v3.0.0 terminée !');
    }
  }
};
