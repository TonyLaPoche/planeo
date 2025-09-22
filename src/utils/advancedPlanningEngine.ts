import {
  User,
  Shift,
  Vacation,
  StoreConfiguration,
  AdvancedGenerationOptions,
  GenerationResult,
  PlanningScore,
  ConstraintViolation
} from '@/types';
import { LegalConstraintsEngine, OrganizationalConstraintsEngine } from './constraintsEngine';
import { addDays, format, parseISO, differenceInHours, isWithinInterval } from 'date-fns';

// ===== MOTEUR DE PLANIFICATION AUTOMATIQUE AVANCÉ =====

export class AdvancedPlanningEngine {

  /**
   * Génère un planning optimisé avec contraintes avancées
   */
  static generateOptimizedPlanning(options: AdvancedGenerationOptions): GenerationResult {
    console.log('🚀 Démarrage de la génération automatique avancée...');
    
    const {
      month,
      users,
      vacations,
      storeConfig,
      optimizationPriorities,
      maxIterations = 100
    } = options;

    // 1. Analyser les besoins et contraintes
    const requirements = this.analyzeRequirements(month, storeConfig);
    const availableUsers = users.filter(u => u.isActive);
    
    console.log(`📊 Analyse: ${requirements.totalSlots} créneaux à pourvoir, ${availableUsers.length} employés disponibles`);

    // 2. Générer une solution initiale
    let bestSolution = this.generateInitialSolution(
      requirements,
      availableUsers,
      vacations,
      storeConfig
    );

    let bestScore = this.evaluateSolution(bestSolution, availableUsers, storeConfig, optimizationPriorities);
    console.log(`💡 Solution initiale: score ${bestScore.total.toFixed(1)}/100`);

    // 3. Optimisation itérative
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      const candidate = this.improveSolution(
        bestSolution,
        availableUsers,
        vacations,
        storeConfig,
        optimizationPriorities
      );

      const candidateScore = this.evaluateSolution(candidate, availableUsers, storeConfig, optimizationPriorities);
      
      if (candidateScore.total > bestScore.total) {
        bestSolution = candidate;
        bestScore = candidateScore;
        console.log(`🔄 Amélioration itération ${iteration + 1}: score ${bestScore.total.toFixed(1)}/100`);
      }

      // Arrêt précoce si score excellent
      if (bestScore.total > 95) break;
    }

    // 4. Validation finale et génération du résultat
    const violations = this.validateFinalSolution(bestSolution, availableUsers, vacations, storeConfig);
    
    const result: GenerationResult = {
      shifts: bestSolution,
      score: bestScore,
      violations,
      statistics: this.generateStatistics(bestSolution, availableUsers)
    };

    console.log(`✅ Génération terminée: ${bestSolution.length} créneaux, score final ${bestScore.total.toFixed(1)}/100`);
    
    return result;
  }

  // ===== ANALYSE DES BESOINS =====

  private static analyzeRequirements(month: string, storeConfig: StoreConfiguration) {
    const [year, monthNum] = month.split('-').map(Number);
    const firstDay = new Date(year, monthNum - 1, 1);
    const lastDay = new Date(year, monthNum, 0);
    
    const requirements: {
      date: string;
      dayOfWeek: number;
      timeSlots: Array<{
        start: string;
        end: string;
        minStaff: number;
        optimalStaff: number;
        requiredSkills: string[];
        preferredSkills: string[];
      }>;
    }[] = [];

    let totalSlots = 0;

    // Pour chaque jour du mois
    let currentDate = new Date(firstDay);
    while (currentDate <= lastDay) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const dayOfWeek = currentDate.getDay();
      const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek];
      
      const dayConfig = storeConfig.openingHours[dayName];
      
      if (dayConfig?.isOpen) {
        const dayRequirements = {
          date: dateStr,
          dayOfWeek,
          timeSlots: storeConfig.staffRequirements.map(req => ({
            start: req.timeSlot.split('-')[0],
            end: req.timeSlot.split('-')[1],
            minStaff: req.minStaff,
            optimalStaff: req.optimalStaff,
            requiredSkills: req.requiredSkills || [],
            preferredSkills: req.preferredSkills || []
          }))
        };
        
        requirements.push(dayRequirements);
        totalSlots += dayRequirements.timeSlots.reduce((sum, slot) => sum + slot.optimalStaff, 0);
      }
      
      currentDate = addDays(currentDate, 1);
    }

    return { requirements, totalSlots };
  }

  // ===== GÉNÉRATION SOLUTION INITIALE =====

  private static generateInitialSolution(
    requirements: ReturnType<typeof AdvancedPlanningEngine.analyzeRequirements>,
    users: User[],
    vacations: Vacation[],
    storeConfig: StoreConfiguration
  ): Shift[] {
    const shifts: Shift[] = [];

    for (const dayReq of requirements.requirements) {
      for (const timeSlot of dayReq.timeSlots) {
        // Trouver les utilisateurs disponibles pour ce créneau
        const availableUsers = this.findAvailableUsers(
          users,
          dayReq.date,
          timeSlot.start,
          timeSlot.end,
          vacations,
          shifts
        );

        // Trier par priorité et compétences
        const sortedUsers = this.sortUsersByPriority(
          availableUsers,
          timeSlot.requiredSkills,
          timeSlot.preferredSkills
        );

        // Assigner le nombre optimal d'employés
        const assignedCount = Math.min(timeSlot.optimalStaff, sortedUsers.length);
        
        for (let i = 0; i < assignedCount; i++) {
          const user = sortedUsers[i];
          const shift: Shift = {
            id: `auto-${user.id}-${dayReq.date}-${timeSlot.start}`,
            userId: user.id,
            date: dayReq.date,
            startTime: timeSlot.start,
            endTime: timeSlot.end,
            breakDuration: this.calculateBreakDuration(timeSlot.start, timeSlot.end),
            notes: 'Généré automatiquement (avancé)',
            createdAt: new Date()
          };
          
          shifts.push(shift);
        }
      }
    }

    return shifts;
  }

  // ===== AMÉLIORATION DE SOLUTION =====

  private static improveSolution(
    currentShifts: Shift[],
    users: User[],
    vacations: Vacation[],
    storeConfig: StoreConfiguration,
    _priorities: AdvancedGenerationOptions['optimizationPriorities']
  ): Shift[] {
    const improvedShifts = [...currentShifts];
    
    // Stratégies d'amélioration
    const strategies = [
      () => this.rebalanceWorkload(improvedShifts, users),
      () => this.optimizeSkillCoverage(improvedShifts, users, storeConfig),
      () => this.respectUserPreferences(improvedShifts, users),
      () => this.minimizeCosts(improvedShifts, users)
    ];

    // Appliquer une stratégie aléatoire
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    return strategy();
  }

  // ===== STRATÉGIES D'OPTIMISATION =====

  private static rebalanceWorkload(shifts: Shift[], users: User[]): Shift[] {
    // Calculer la charge de travail actuelle
    const workload = this.calculateUserWorkload(shifts, users);
    
    // Identifier les déséquilibres
    const overworkedUsers = workload.filter(w => w.weeklyHours > w.user.weeklyHoursQuota);
    const underworkedUsers = workload.filter(w => w.weeklyHours < w.user.weeklyHoursQuota * 0.8);

    if (overworkedUsers.length > 0 && underworkedUsers.length > 0) {
      // Réassigner quelques créneaux
      const rebalanced = [...shifts];
      
      for (const overworked of overworkedUsers.slice(0, 2)) {
        const userShifts = rebalanced.filter(s => s.userId === overworked.user.id);
        const shiftToReassign = userShifts[Math.floor(Math.random() * userShifts.length)];
        
        const availableUser = underworkedUsers.find(u => 
          this.canUserTakeShift(u.user, shiftToReassign, rebalanced)
        );
        
        if (availableUser && shiftToReassign) {
          const index = rebalanced.findIndex(s => s.id === shiftToReassign.id);
          if (index !== -1) {
            rebalanced[index] = {
              ...shiftToReassign,
              userId: availableUser.user.id,
              id: `auto-${availableUser.user.id}-${shiftToReassign.date}-${shiftToReassign.startTime}`
            };
          }
        }
      }
      
      return rebalanced;
    }
    
    return shifts;
  }

  private static optimizeSkillCoverage(shifts: Shift[], users: User[], _storeConfig: StoreConfiguration): Shift[] {
    // Identifier les créneaux avec mauvaise couverture de compétences
    const optimized = [...shifts];
    
    for (const requirement of _storeConfig.staffRequirements) {
      if (!requirement.requiredSkills?.length) continue;
      
      const [startTime, endTime] = requirement.timeSlot.split('-');
      const relevantShifts = optimized.filter(s => 
        s.startTime <= startTime && s.endTime >= endTime
      );
      
      for (const requiredSkill of requirement.requiredSkills) {
        const hasSkill = relevantShifts.some(shift => {
          const user = users.find(u => u.id === shift.userId);
          return user?.skills?.includes(requiredSkill);
        });
        
        if (!hasSkill) {
          // Trouver un utilisateur avec cette compétence et réassigner
          const skilledUser = users.find(u => u.skills?.includes(requiredSkill) && u.isActive);
          if (skilledUser && relevantShifts.length > 0) {
            const shiftToReplace = relevantShifts[0];
            const index = optimized.findIndex(s => s.id === shiftToReplace.id);
            if (index !== -1) {
              optimized[index] = {
                ...shiftToReplace,
                userId: skilledUser.id,
                id: `auto-${skilledUser.id}-${shiftToReplace.date}-${shiftToReplace.startTime}`
              };
            }
          }
        }
      }
    }
    
    return optimized;
  }

  private static respectUserPreferences(shifts: Shift[], users: User[]): Shift[] {
    // Améliorer le respect des préférences utilisateur
    const improved = [...shifts];
    
    for (const user of users) {
      if (!user.preferences) continue;
      
      const userShifts = improved.filter(s => s.userId === user.id);
      
      // Vérifier les créneaux préférés
      if (user.preferences.preferredShifts?.length) {
        for (const shift of userShifts) {
          const shiftType = this.getShiftType(shift.startTime);
          if (!user.preferences.preferredShifts.includes(shiftType)) {
            // Essayer de trouver un autre utilisateur qui préfère ce type de créneau
            const preferringUser = users.find(u => 
              u.id !== user.id && 
              u.preferences?.preferredShifts?.includes(shiftType) &&
              this.canUserTakeShift(u, shift, improved)
            );
            
            if (preferringUser) {
              const index = improved.findIndex(s => s.id === shift.id);
              if (index !== -1) {
                improved[index] = {
                  ...shift,
                  userId: preferringUser.id,
                  id: `auto-${preferringUser.id}-${shift.date}-${shift.startTime}`
                };
              }
            }
          }
        }
      }
    }
    
    return improved;
  }

  private static minimizeCosts(shifts: Shift[], users: User[]): Shift[] {
    // Optimiser les coûts en privilégiant les employés moins chers
    const optimized = [...shifts];
    
    // Trier les utilisateurs par coût horaire
    const usersByCost = users
      .filter(u => u.hourlyRate)
      .sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
    
    if (usersByCost.length < 2) return shifts;
    
    // Réassigner quelques créneaux aux employés moins chers
    for (let i = 0; i < Math.min(5, optimized.length); i++) {
      const shift = optimized[i];
      const currentUser = users.find(u => u.id === shift.userId);
      const cheaperUser = usersByCost.find(u => 
        u.id !== shift.userId &&
        (u.hourlyRate || 0) < (currentUser?.hourlyRate || 0) &&
        this.canUserTakeShift(u, shift, optimized)
      );
      
      if (cheaperUser) {
        optimized[i] = {
          ...shift,
          userId: cheaperUser.id,
          id: `auto-${cheaperUser.id}-${shift.date}-${shift.startTime}`
        };
      }
    }
    
    return optimized;
  }

  // ===== ÉVALUATION ET SCORING =====

  private static evaluateSolution(
    shifts: Shift[],
    users: User[],
    storeConfig: StoreConfiguration,
    priorities: AdvancedGenerationOptions['optimizationPriorities']
  ): PlanningScore {
    const legalCompliance = this.calculateLegalCompliance(shifts, users);
    const skillCoverage = this.calculateSkillCoverage(shifts, users, storeConfig);
    const employeeSatisfaction = this.calculateEmployeeSatisfaction(shifts, users);
    const costOptimization = this.calculateCostOptimization(shifts, users);
    const workloadBalance = this.calculateWorkloadBalance(shifts, users);

    const total = 
      legalCompliance * priorities.legalCompliance +
      skillCoverage * priorities.skillCoverage +
      employeeSatisfaction * priorities.employeeSatisfaction +
      costOptimization * priorities.costOptimization +
      workloadBalance * priorities.workloadBalance;

    return {
      total,
      legalCompliance,
      skillCoverage,
      employeeSatisfaction,
      costOptimization,
      workloadBalance
    };
  }

  // ===== MÉTHODES UTILITAIRES =====

  private static findAvailableUsers(
    users: User[],
    date: string,
    startTime: string,
    endTime: string,
    vacations: Vacation[],
    existingShifts: Shift[]
  ): User[] {
    return users.filter(user => {
      // Vérifier si en congé
      const isOnVacation = vacations.some(vacation => {
        const vacStart = parseISO(vacation.startDate);
        const vacEnd = parseISO(vacation.endDate);
        const shiftDate = parseISO(date);
        return vacation.userId === user.id && 
               isWithinInterval(shiftDate, { start: vacStart, end: vacEnd });
      });

      if (isOnVacation) return false;

      // Vérifier disponibilité
      const dayOfWeek = parseISO(date).getDay();
      const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek];
      const availability = user.availability?.[dayName];
      
      if (availability && !availability.available) return false;

      // Vérifier conflits avec créneaux existants
      const hasConflict = existingShifts.some(shift => 
        shift.userId === user.id && 
        shift.date === date && 
        this.timesOverlap(shift.startTime, shift.endTime, startTime, endTime)
      );

      return !hasConflict;
    });
  }

  private static sortUsersByPriority(
    users: User[],
    requiredSkills: string[],
    preferredSkills: string[]
  ): User[] {
    return users.sort((a, b) => {
      // Priorité 1: Compétences requises
      const aHasRequired = requiredSkills.every(skill => a.skills?.includes(skill));
      const bHasRequired = requiredSkills.every(skill => b.skills?.includes(skill));
      if (aHasRequired !== bHasRequired) return bHasRequired ? 1 : -1;

      // Priorité 2: Compétences préférées
      const aPreferredCount = preferredSkills.filter(skill => a.skills?.includes(skill)).length;
      const bPreferredCount = preferredSkills.filter(skill => b.skills?.includes(skill)).length;
      if (aPreferredCount !== bPreferredCount) return bPreferredCount - aPreferredCount;

      // Priorité 3: Priorité utilisateur
      const aPriority = a.priority || 3;
      const bPriority = b.priority || 3;
      if (aPriority !== bPriority) return bPriority - aPriority;

      // Priorité 4: Ancienneté
      const aSeniority = a.seniority || 0;
      const bSeniority = b.seniority || 0;
      return bSeniority - aSeniority;
    });
  }

  private static calculateBreakDuration(startTime: string, endTime: string): number {
    const start = parseISO(`2000-01-01T${startTime}`);
    const end = parseISO(`2000-01-01T${endTime}`);
    const hours = differenceInHours(end, start);
    
    // 1h de pause pour plus de 6h de travail, 0 sinon
    return hours > 6 ? 60 : 0;
  }

  private static calculateUserWorkload(shifts: Shift[], users: User[]) {
    return users.map(user => {
      const userShifts = shifts.filter(s => s.userId === user.id);
      const weeklyHours = userShifts.reduce((total, shift) => {
        const start = parseISO(`${shift.date}T${shift.startTime}`);
        const end = parseISO(`${shift.date}T${shift.endTime}`);
        return total + differenceInHours(end, start) - (shift.breakDuration / 60);
      }, 0);
      
      return { user, weeklyHours, shiftsCount: userShifts.length };
    });
  }

  private static canUserTakeShift(user: User, shift: Shift, allShifts: Shift[]): boolean {
    // Vérifications basiques de disponibilité
    const userShifts = allShifts.filter(s => s.userId === user.id && s.id !== shift.id);
    
    // Pas de conflit horaire le même jour
    const sameDay = userShifts.filter(s => s.date === shift.date);
    const hasConflict = sameDay.some(s => 
      this.timesOverlap(s.startTime, s.endTime, shift.startTime, shift.endTime)
    );
    
    return !hasConflict;
  }

  private static getShiftType(startTime: string): 'morning' | 'afternoon' | 'evening' {
    const hour = parseInt(startTime.split(':')[0]);
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  private static timesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
    const s1 = parseISO(`2000-01-01T${start1}`);
    const e1 = parseISO(`2000-01-01T${end1}`);
    const s2 = parseISO(`2000-01-01T${start2}`);
    const e2 = parseISO(`2000-01-01T${end2}`);
    
    return s1 < e2 && s2 < e1;
  }

  // ===== MÉTHODES DE CALCUL DES SCORES =====

  private static calculateLegalCompliance(shifts: Shift[], users: User[]): number {
    const violations = LegalConstraintsEngine.validatePlanning(shifts, users, []);
    const errorCount = violations.filter(v => v.severity === 'error').length;
    
    // Score inversement proportionnel au nombre d'erreurs
    return Math.max(0, 100 - (errorCount * 10));
  }

  private static calculateSkillCoverage(shifts: Shift[], users: User[], storeConfig: StoreConfiguration): number {
    let totalRequiredSkills = 0;
    let coveredSkills = 0;

    for (const requirement of storeConfig.staffRequirements) {
      if (!requirement.requiredSkills?.length) continue;
      
      const [startTime, endTime] = requirement.timeSlot.split('-');
      const relevantShifts = shifts.filter(s => 
        s.startTime <= startTime && s.endTime >= endTime
      );
      
      for (const requiredSkill of requirement.requiredSkills) {
        totalRequiredSkills++;
        
        const hasSkill = relevantShifts.some(shift => {
          const user = users.find(u => u.id === shift.userId);
          return user?.skills?.includes(requiredSkill);
        });
        
        if (hasSkill) coveredSkills++;
      }
    }

    return totalRequiredSkills > 0 ? (coveredSkills / totalRequiredSkills) * 100 : 100;
  }

  private static calculateEmployeeSatisfaction(shifts: Shift[], users: User[]): number {
    let totalPreferences = 0;
    let satisfiedPreferences = 0;

    for (const user of users) {
      const userShifts = shifts.filter(s => s.userId === user.id);
      
      if (user.preferences?.preferredShifts?.length) {
        for (const shift of userShifts) {
          totalPreferences++;
          const shiftType = this.getShiftType(shift.startTime);
          if (user.preferences.preferredShifts.includes(shiftType)) {
            satisfiedPreferences++;
          }
        }
      }
    }

    return totalPreferences > 0 ? (satisfiedPreferences / totalPreferences) * 100 : 100;
  }

  private static calculateCostOptimization(shifts: Shift[], users: User[]): number {
    const usersWithRates = users.filter(u => u.hourlyRate);
    if (usersWithRates.length === 0) return 100;

    const avgRate = usersWithRates.reduce((sum, u) => sum + (u.hourlyRate || 0), 0) / usersWithRates.length;
    
    let totalCost = 0;
    let totalHours = 0;

    for (const shift of shifts) {
      const user = users.find(u => u.id === shift.userId);
      if (user?.hourlyRate) {
        const hours = differenceInHours(
          parseISO(`${shift.date}T${shift.endTime}`),
          parseISO(`${shift.date}T${shift.startTime}`)
        ) - (shift.breakDuration / 60);
        
        totalCost += hours * user.hourlyRate;
        totalHours += hours;
      }
    }

    const actualAvgRate = totalHours > 0 ? totalCost / totalHours : avgRate;
    
    // Score basé sur l'écart par rapport au taux moyen
    return Math.max(0, 100 - Math.abs(actualAvgRate - avgRate) / avgRate * 100);
  }

  private static calculateWorkloadBalance(shifts: Shift[], users: User[]): number {
    const workload = this.calculateUserWorkload(shifts, users);
    const activeUsers = workload.filter(w => w.shiftsCount > 0);
    
    if (activeUsers.length === 0) return 100;

    const avgHours = activeUsers.reduce((sum, w) => sum + w.weeklyHours, 0) / activeUsers.length;
    const variance = activeUsers.reduce((sum, w) => sum + Math.pow(w.weeklyHours - avgHours, 2), 0) / activeUsers.length;
    const stdDev = Math.sqrt(variance);
    
    // Score inversement proportionnel à l'écart-type
    return Math.max(0, 100 - (stdDev / avgHours) * 100);
  }

  private static validateFinalSolution(
    shifts: Shift[],
    users: User[],
    vacations: Vacation[],
    storeConfig: StoreConfiguration
  ): ConstraintViolation[] {
    const legalViolations = LegalConstraintsEngine.validatePlanning(shifts, users, vacations);
    const orgViolations = OrganizationalConstraintsEngine.validateOrganizational(shifts, users, storeConfig);
    
    return [...legalViolations, ...orgViolations];
  }

  private static generateStatistics(shifts: Shift[], users: User[]) {
    const totalHours = shifts.reduce((total, shift) => {
      const hours = differenceInHours(
        parseISO(`${shift.date}T${shift.endTime}`),
        parseISO(`${shift.date}T${shift.startTime}`)
      ) - (shift.breakDuration / 60);
      return total + hours;
    }, 0);

    const totalCost = shifts.reduce((total, shift) => {
      const user = users.find(u => u.id === shift.userId);
      if (user?.hourlyRate) {
        const hours = differenceInHours(
          parseISO(`${shift.date}T${shift.endTime}`),
          parseISO(`${shift.date}T${shift.startTime}`)
        ) - (shift.breakDuration / 60);
        return total + (hours * user.hourlyRate);
      }
      return total;
    }, 0);

    const employeesUsed = new Set(shifts.map(s => s.userId)).size;
    const skillsCovered = new Set(
      shifts.flatMap(shift => {
        const user = users.find(u => u.id === shift.userId);
        return user?.skills || [];
      })
    );

    return {
      totalHours,
      totalCost: totalCost > 0 ? totalCost : undefined,
      employeesUsed,
      skillsCovered: Array.from(skillsCovered)
    };
  }
}
