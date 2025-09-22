'use client';

import { useState, useEffect } from 'react';
import { User, Shift, StoreConfiguration, Shop, GenerationResult } from '@/types';
import { userStorage, shiftStorage, settingsStorage, dataExport, storeConfigStorage, shopStorage, currentShopStorage, migrationUtils } from '@/utils/storage';
import { generateMonthlyShifts } from '@/utils/planningUtils';
import { AdvancedPlanningEngine } from '@/utils/advancedPlanningEngine';
import { ShopPlanningEngine } from '@/utils/shopPlanningEngine';

export function usePlanning() {
  const [users, setUsers] = useState<User[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [shiftModal, setShiftModal] = useState<{ isOpen: boolean; shift: Shift | null }>({
    isOpen: false,
    shift: null
  });
  const [storeConfig, setStoreConfig] = useState<StoreConfiguration | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [currentShopId, setCurrentShopId] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier et effectuer la migration si nécessaire
    if (migrationUtils.needsMigration()) {
      console.log('🔄 Migration des données nécessaire...');
      migrationUtils.performMigration();
      console.log('✅ Migration terminée !');
    }

    loadData();
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setCurrentMonth(monthStr);
  }, []);

  const loadData = () => {
    setUsers(userStorage.getAll());
    setShifts(shiftStorage.getAll());

    // Charger les magasins
    const allShops = shopStorage.getAll();
    setShops(allShops);

    // Charger le magasin actuel
    let currentShop = currentShopStorage.get();
    if (!currentShop && allShops.length > 0) {
      // Sélectionner le premier magasin par défaut
      currentShop = allShops[0].id;
      currentShopStorage.set(currentShop);
    }
    setCurrentShopId(currentShop);
    
    // Charger la configuration magasin (legacy)
    let config = storeConfigStorage.get();
    if (!config) {
      // Créer une configuration par défaut
      const settings = settingsStorage.get();
      config = storeConfigStorage.createDefault(settings);
    }
    setStoreConfig(config);
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

  // Nouvelle fonction de génération avancée
  const generateAdvancedShifts = async (month: string = currentMonth): Promise<GenerationResult | null> => {
    try {
      if (!storeConfig) {
        alert('Configuration magasin manquante. Rechargez la page.');
        return null;
      }

      const activeUsers = users.filter(user => user.isActive);
      if (activeUsers.length === 0) {
        alert('Aucun utilisateur actif trouvé. Activez au moins un utilisateur dans la gestion des utilisateurs.');
        return null;
      }

      const vacations = dataExport.getVacations();
      const settings = settingsStorage.get();

      console.log('🚀 Génération avancée de planning...');

      const result = AdvancedPlanningEngine.generateOptimizedPlanning({
        month,
        users,
        vacations,
        settings,
        templates: dataExport.getShiftTemplates(),
        storeConfig,
        optimizationPriorities: {
          legalCompliance: 0.3,
          skillCoverage: 0.25,
          employeeSatisfaction: 0.2,
          costOptimization: 0.15,
          workloadBalance: 0.1
        },
        allowPartialSolutions: true,
        maxIterations: 50
      });

      // Filtrer les créneaux existants
      const existingShifts = shifts.filter(shift =>
        shift.date.startsWith(month) && !shift.notes?.includes('généré automatiquement')
      );

      const newShifts = result.shifts.filter(newShift => {
        return !existingShifts.some(existing =>
          existing.userId === newShift.userId &&
          existing.date === newShift.date &&
          existing.startTime === newShift.startTime
        );
      });

      if (newShifts.length > 0) {
        // Sauvegarder les nouveaux créneaux
        newShifts.forEach(shift => {
          shiftStorage.save(shift);
        });

        // Recharger les données
        loadData();

        alert(`✅ Génération avancée terminée !\n\n📊 Résultats :\n- ${newShifts.length} créneaux générés\n- Score global : ${result.score.total.toFixed(1)}/100\n- Conformité légale : ${result.score.legalCompliance.toFixed(1)}%\n- Couverture compétences : ${result.score.skillCoverage.toFixed(1)}%\n- Satisfaction employés : ${result.score.employeeSatisfaction.toFixed(1)}%\n\n${result.violations.length > 0 ? `⚠️ ${result.violations.length} alertes détectées` : '✅ Aucune violation détectée'}`);
        
        console.log('📊 Résultats détaillés :', result);
      } else {
        alert('ℹ️ Aucun nouveau créneau à générer. Tous les créneaux possibles existent déjà.');
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de la génération avancée:', error);
      alert('❌ Erreur lors de la génération automatique avancée.');
      return null;
    }
  };

  // Génération intelligente pour un magasin spécifique
  const generateShopPlanning = async (month: string = currentMonth): Promise<GenerationResult | null> => {
    try {
      if (!currentShopId) {
        alert('Aucun magasin sélectionné. Veuillez sélectionner un magasin.');
        return null;
      }

      const currentShop = shopStorage.getById(currentShopId);
      if (!currentShop) {
        alert('Magasin introuvable. Veuillez vérifier votre sélection.');
        return null;
      }

      const shopEmployees = shopStorage.getShopEmployees(currentShopId, users);
      if (shopEmployees.length === 0) {
        alert(`Aucun employé assigné au magasin "${currentShop.name}". Veuillez assigner des employés dans la gestion des magasins.`);
        return null;
      }

      const vacations = dataExport.getVacations();
      const settings = settingsStorage.get();

      console.log(`🏪 Génération planning pour "${currentShop.name}"...`);

      const result = ShopPlanningEngine.generateShopPlanning({
        month,
        shop: currentShop,
        users,
        vacations,
        settings,
        templates: dataExport.getShiftTemplates(),
        optimizationPriorities: {
          legalCompliance: 0.3,
          skillCoverage: 0.25,
          employeeSatisfaction: 0.2,
          costOptimization: 0.15,
          workloadBalance: 0.1
        },
        maxIterations: 50
      });

      // Filtrer les nouveaux créneaux pour éviter les doublons
      const existingShifts = shifts.filter(shift => shift.date.startsWith(month));
      const existingShiftKeys = new Set(
        existingShifts.map(s => `${s.userId}-${s.date}-${s.startTime}`)
      );

      const newShifts = result.shifts.filter(shift => 
        !existingShiftKeys.has(`${shift.userId}-${shift.date}-${shift.startTime}`)
      );

      // Sauvegarder les nouveaux créneaux
      newShifts.forEach(shift => shiftStorage.save(shift));

      // Recharger les données
      loadData();

      alert(`✅ Planning "${currentShop.name}" généré !

📊 Résultats :
- ${newShifts.length} créneaux générés
- ${shopEmployees.length} employés utilisés
- Score global : ${result.score.total.toFixed(1)}/100
- Conformité légale : ${result.score.legalCompliance.toFixed(1)}%
- Couverture compétences : ${result.score.skillCoverage.toFixed(1)}%
- Satisfaction employés : ${result.score.employeeSatisfaction.toFixed(1)}%

${result.violations.length > 0 ? `⚠️ ${result.violations.length} alertes détectées` : '✅ Aucune violation détectée'}`);

      console.log('📊 Résultats détaillés :', result);
      return result;
    } catch (error) {
      console.error('Erreur lors de la génération du planning magasin:', error);
      alert(`Erreur lors de la génération: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      return null;
    }
  };

  // Fonction pour changer de magasin
  const selectShop = (shopId: string) => {
    setCurrentShopId(shopId);
    currentShopStorage.set(shopId);
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
    storeConfig,
    shops,
    currentShopId,
    loadData,
    getShiftsForDate,
    getUserById,
    navigateMonth,
    generateAutoShifts,
    generateAdvancedShifts, // Ancienne fonction (sera supprimée)
    generateShopPlanning, // Nouvelle fonction pour magasins
    selectShop,
    openShiftModal,
    closeShiftModal,
  };
}
