import {
  User,
  Shift,
  Vacation,
  Shop,
  ShopPlanningOptions,
  GenerationResult,
  PlanningScore,
  ConstraintViolation
} from '@/types';
import { LegalConstraintsEngine, OrganizationalConstraintsEngine } from './constraintsEngine';
import { addDays, format, parseISO, differenceInHours, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';

// ===== MOTEUR DE PLANIFICATION PAR MAGASIN =====

export class ShopPlanningEngine {

  /**
   * Génère un planning optimisé pour un magasin spécifique
   */
  static generateShopPlanning(options: ShopPlanningOptions): GenerationResult {
    console.log(`🏪 Génération planning pour "${options.shop.name}"...`);
    
    const {
      month,
      shop,
      users,
      vacations,
      optimizationPriorities,
      maxIterations = 100
    } = options;

    // 1. Filtrer les employés assignés à ce magasin
    const shopEmployees = users.filter(user => 
      shop.assignedEmployees.includes(user.id) && user.isActive
    );

    if (shopEmployees.length === 0) {
      throw new Error(`Aucun employé assigné au magasin "${shop.name}"`);
    }

    console.log(`👥 ${shopEmployees.length} employés assignés au magasin`);

    // 2. Analyser les besoins du magasin
    const requirements = this.analyzeShopRequirements(month, shop);
    
    console.log(`📊 Analyse: ${requirements.totalSlots} créneaux à pourvoir`);

    // 3. Générer une solution initiale
    let bestSolution = this.generateInitialSolution(
      requirements,
      shopEmployees,
      vacations,
      shop
    );

    let bestScore = this.evaluateSolution(bestSolution, shopEmployees, shop, optimizationPriorities);
    console.log(`💡 Solution initiale: score ${bestScore.total.toFixed(1)}/100`);

    // 4. Optimisation itérative
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      const candidate = this.improveSolution(
        bestSolution,
        shopEmployees,
        vacations,
        shop,
        optimizationPriorities
      );

      const candidateScore = this.evaluateSolution(candidate, shopEmployees, shop, optimizationPriorities);
      
      if (candidateScore.total > bestScore.total) {
        bestSolution = candidate;
        bestScore = candidateScore;
        console.log(`🔄 Amélioration itération ${iteration + 1}: score ${bestScore.total.toFixed(1)}/100`);
      }

      // Arrêt précoce si score excellent
      if (bestScore.total > 95) break;
    }

    // 5. Validation finale
    const violations = this.validateFinalSolution(bestSolution, shopEmployees, vacations, shop);
    
    const result: GenerationResult = {
      shifts: bestSolution,
      score: bestScore,
      violations,
      statistics: this.generateStatistics(bestSolution, shopEmployees)
    };

    console.log(`✅ Planning "${shop.name}" généré: ${bestSolution.length} créneaux, score ${bestScore.total.toFixed(1)}/100`);
    
    return result;
  }

  // ===== ANALYSE DES BESOINS DU MAGASIN =====

  private static analyzeShopRequirements(month: string, shop: Shop) {
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
      
      const dayConfig = shop.openingHours[dayName];
      
      if (dayConfig?.isOpen) {
        // CORRECTION: Utiliser les vraies heures d'ouverture du magasin
        const actualOpenTime = dayConfig.openTime;
        const actualCloseTime = dayConfig.closeTime;
        
        const dayRequirements = {
          date: dateStr,
          dayOfWeek,
          timeSlots: [{
            start: actualOpenTime,
            end: actualCloseTime,
            minStaff: shop.staffRequirements[0]?.minStaff || 1,
            optimalStaff: shop.staffRequirements[0]?.optimalStaff || 3,
            requiredSkills: shop.staffRequirements[0]?.requiredSkills || [],
            preferredSkills: shop.staffRequirements[0]?.preferredSkills || []
          }]
        };
        
        requirements.push(dayRequirements);
        totalSlots += dayRequirements.timeSlots.reduce((sum, slot) => sum + slot.optimalStaff, 0);
      }
      
      currentDate = addDays(currentDate, 1);
    }

    return { requirements, totalSlots };
  }

  // ===== GÉNÉRATION SOLUTION INITIALE AVEC QUOTAS PRÉCIS =====

  private static generateInitialSolution(
    requirements: ReturnType<typeof ShopPlanningEngine.analyzeShopRequirements>,
    employees: User[],
    vacations: Vacation[],
    shop: Shop
  ): Shift[] {
    const shifts: Shift[] = [];
    
    console.log(`👥 Génération planning pour ${employees.length} employés`);

    // Calculer les créneaux optimaux pour chaque employé
    const employeeSchedules = this.calculateOptimalSchedules(employees, requirements.requirements, shop);
    
    // Assigner les créneaux jour par jour en respectant les quotas
    for (const dayReq of requirements.requirements) {
      const dayOfWeek = dayReq.dayOfWeek;
      
      // Trouver les employés qui travaillent ce jour
      const availableEmployees = employees.filter(emp => {
        const workingDays = emp.workingDays || [1, 2, 3, 4, 5, 6];
        const isWorkingDay = workingDays.includes(dayOfWeek);
        const isOnVacation = this.isEmployeeOnVacation(emp.id, dayReq.date, vacations);
        const hasFixedDayOff = emp.preferences?.fixedDaysOff?.includes(dayOfWeek);
        
        return isWorkingDay && !isOnVacation && !hasFixedDayOff;
      });
      
      if (availableEmployees.length === 0) {
        console.warn(`⚠️ Aucun employé disponible le ${dayReq.date}`);
        continue;
      }
      
      // Assigner les créneaux selon les horaires calculés
      const dayAssignments = this.assignDayShifts(
        dayReq,
        availableEmployees,
        employeeSchedules,
        shifts,
        shop
      );
      
      shifts.push(...dayAssignments);
    }

    console.log(`✅ ${shifts.length} créneaux générés`);
    return shifts;
  }

  // ===== CALCUL DES HORAIRES OPTIMAUX PAR EMPLOYÉ =====
  
  private static calculateOptimalSchedules(
    employees: User[], 
    requirements: Array<{ date: string; dayOfWeek: number; timeSlots: Array<{ start: string; end: string; minStaff: number; optimalStaff: number }> }>,
    shop: Shop
  ): Map<string, { dailyHours: number; preferredStart: string; preferredEnd: string }> {
    const schedules = new Map();
    
    for (const employee of employees) {
      const workingDays = employee.workingDays || [1, 2, 3, 4, 5, 6];
      const weeklyQuota = employee.weeklyHoursQuota || 35;
      const dailyHours = weeklyQuota / workingDays.length;
      
      // Calculer les heures de début/fin idéales pour cet employé
      const { preferredStart, preferredEnd } = this.calculatePreferredHours(
        employee, 
        dailyHours, 
        shop, 
        employees.indexOf(employee)
      );
      
      schedules.set(employee.id, {
        dailyHours: Math.round(dailyHours * 10) / 10, // Arrondi à 0.1h près
        preferredStart,
        preferredEnd
      });
      
      console.log(`📋 ${employee.name}: ${dailyHours.toFixed(1)}h/jour, ${preferredStart}-${preferredEnd}`);
    }
    
    return schedules;
  }
  
  // ===== CALCUL DES HEURES PRÉFÉRÉES =====
  
  private static calculatePreferredHours(
    employee: User, 
    dailyHours: number, 
    shop: Shop, 
    employeeIndex: number
  ): { preferredStart: string; preferredEnd: string } {
    const shopOpen = shop.openingHours.monday?.openTime || '10:00';
    const shopClose = shop.openingHours.monday?.closeTime || '19:00';
    
    // Heures de travail + pause (1h si >= 6h, selon le droit du travail français)
    const totalHours = dailyHours + (dailyHours >= 6 ? 1 : 0);
    
    // Décaler les horaires selon l'employé pour assurer la couverture
    const startOffsetMinutes = employeeIndex * 60; // Décalage de 1h par employé
    
    const baseStartTime = parseISO(`2000-01-01T${shopOpen}`);
    const adjustedStartTime = new Date(baseStartTime.getTime() + startOffsetMinutes * 60 * 1000);
    
    const preferredStart = format(adjustedStartTime, 'HH:mm');
    const endTime = new Date(adjustedStartTime.getTime() + totalHours * 60 * 60 * 1000);
    const preferredEnd = format(endTime, 'HH:mm');
    
    // S'assurer qu'on ne dépasse pas les heures de fermeture
    const shopCloseTime = parseISO(`2000-01-01T${shopClose}`);
    if (endTime > shopCloseTime) {
      const adjustedEndTime = shopCloseTime;
      const adjustedStartTime2 = new Date(adjustedEndTime.getTime() - totalHours * 60 * 60 * 1000);
      
      return {
        preferredStart: format(adjustedStartTime2, 'HH:mm'),
        preferredEnd: format(adjustedEndTime, 'HH:mm')
      };
    }
    
    return { preferredStart, preferredEnd };
  }

  // ===== ASSIGNATION INTELLIGENTE DES EMPLOYÉS =====
  
  private static assignEmployeesIntelligently(
    date: string,
    timeSlot: { start: string; end: string; minStaff: number; optimalStaff: number },
    fullTimeEmployees: User[],
    partTimeEmployees: User[],
    partTimeOnFixedDayOff: User[],
    existingShifts: Shift[],
    vacations: Vacation[],
    totalHours: number
  ): Array<{employee: User, startTime: string, endTime: string, reason: string}> {
    const assignments: Array<{employee: User, startTime: string, endTime: string, reason: string}> = [];
    
    // 1. Toujours assigner quelqu'un pour ouvrir et fermer
    const openingEmployee = this.findBestEmployeeForOpening(
      fullTimeEmployees, 
      partTimeEmployees.filter(emp => !partTimeOnFixedDayOff.includes(emp)),
      date,
      existingShifts,
      vacations
    );
    
    const closingEmployee = this.findBestEmployeeForClosing(
      fullTimeEmployees,
      partTimeEmployees.filter(emp => !partTimeOnFixedDayOff.includes(emp)),
      date,
      existingShifts,
      vacations,
      openingEmployee
    );

    // 2. Créer des créneaux flexibles (6-8h) au lieu de créneaux complets
    if (totalHours <= 8) {
      // Créneau court : une seule personne peut gérer
      const bestEmployee = openingEmployee || closingEmployee;
      if (bestEmployee) {
        assignments.push({
          employee: bestEmployee,
          startTime: timeSlot.start,
          endTime: timeSlot.end,
          reason: 'créneau court'
        });
      }
    } else {
      // Créneau long : diviser en plusieurs parties
      const midTime = this.calculateMidTime(timeSlot.start, timeSlot.end);
      
      // Matin : ouverture
      if (openingEmployee) {
        assignments.push({
          employee: openingEmployee,
          startTime: timeSlot.start,
          endTime: midTime,
          reason: 'ouverture'
        });
      }
      
      // Après-midi/soir : fermeture
      if (closingEmployee && closingEmployee.id !== openingEmployee?.id) {
        assignments.push({
          employee: closingEmployee,
          startTime: midTime,
          endTime: timeSlot.end,
          reason: 'fermeture'
        });
      }
      
      // Ajouter une personne supplémentaire si nécessaire et disponible
      const additionalEmployee = this.findAdditionalEmployee(
        fullTimeEmployees,
        partTimeEmployees.filter(emp => !partTimeOnFixedDayOff.includes(emp)),
        date,
        existingShifts,
        vacations,
        [openingEmployee, closingEmployee].filter(Boolean) as User[]
      );
      
      if (additionalEmployee && assignments.length < timeSlot.optimalStaff) {
        const flexStart = this.addHoursToTime(timeSlot.start, 2); // Décalé de 2h
        const flexEnd = this.subtractHoursFromTime(timeSlot.end, 2); // Finit 2h avant
        
        assignments.push({
          employee: additionalEmployee,
          startTime: flexStart,
          endTime: flexEnd,
          reason: 'renfort'
        });
      }
    }
    
    return assignments.filter(a => this.canEmployeeWork(a.employee, date, a.startTime, a.endTime, existingShifts));
  }

  // ===== AMÉLIORATION DE SOLUTION =====

  private static improveSolution(
    currentShifts: Shift[],
    employees: User[],
    vacations: Vacation[],
    shop: Shop,
    _priorities: ShopPlanningOptions['optimizationPriorities']
  ): Shift[] {
    const improvedShifts = [...currentShifts];
    
    // Stratégies d'amélioration spécifiques aux magasins
    const strategies = [
      () => this.ensureAllEmployeesScheduled(improvedShifts, employees, shop),
      () => this.rebalanceWorkload(improvedShifts, employees),
      () => this.optimizeSkillCoverage(improvedShifts, employees, shop),
      () => this.respectEmployeePreferences(improvedShifts, employees)
    ];

    // Appliquer une stratégie aléatoire
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    return strategy();
  }

  // ===== STRATÉGIES D'OPTIMISATION SPÉCIFIQUES =====

  private static ensureAllEmployeesScheduled(shifts: Shift[], employees: User[], shop: Shop): Shift[] {
    const improved = [...shifts];
    const employeeShiftCounts = new Map<string, number>();
    
    // Compter les créneaux par employé
    employees.forEach(emp => employeeShiftCounts.set(emp.id, 0));
    improved.forEach(shift => {
      const count = employeeShiftCounts.get(shift.userId) || 0;
      employeeShiftCounts.set(shift.userId, count + 1);
    });

    // Identifier les employés sous-utilisés
    const underutilizedEmployees = employees.filter(emp => 
      (employeeShiftCounts.get(emp.id) || 0) < 5 // Moins de 5 créneaux dans le mois
    );

    if (underutilizedEmployees.length > 0) {
      console.log(`📈 Ajout de créneaux pour ${underutilizedEmployees.length} employés sous-utilisés`);
      
      // Trouver des créneaux où on peut ajouter ces employés
      const datesInMonth = [...new Set(improved.map(s => s.date))];
      
      for (const employee of underutilizedEmployees) {
        for (const date of datesInMonth.slice(0, 3)) { // Limiter à 3 dates pour éviter la surcharge
          const dayShifts = improved.filter(s => s.date === date);
          if (dayShifts.length > 0) {
            const firstShift = dayShifts[0];
            
            // Vérifier si l'employé peut prendre ce créneau
            if (!dayShifts.some(s => s.userId === employee.id)) {
              const newShift: Shift = {
                id: `additional-${employee.id}-${date}-${firstShift.startTime}`,
                userId: employee.id,
                date: date,
                startTime: firstShift.startTime,
                endTime: firstShift.endTime,
                breakDuration: firstShift.breakDuration,
                notes: `Ajouté pour équilibrage - ${shop.name}`,
                createdAt: new Date()
              };
              
              improved.push(newShift);
              break; // Un seul créneau supplémentaire par employé par itération
            }
          }
        }
      }
    }

    return improved;
  }

  private static rebalanceWorkload(shifts: Shift[], employees: User[]): Shift[] {
    // Calculer la charge de travail actuelle
    const workload = this.calculateEmployeeWorkload(shifts, employees);
    
    // Identifier les déséquilibres
    const overworkedEmployees = workload.filter(w => w.weeklyHours > w.employee.weeklyHoursQuota);
    const underworkedEmployees = workload.filter(w => w.weeklyHours < w.employee.weeklyHoursQuota * 0.8);

    if (overworkedEmployees.length > 0 && underworkedEmployees.length > 0) {
      const rebalanced = [...shifts];
      
      for (const overworked of overworkedEmployees.slice(0, 1)) { // Un seul à la fois
        const employeeShifts = rebalanced.filter(s => s.userId === overworked.employee.id);
        const shiftToReassign = employeeShifts[Math.floor(Math.random() * employeeShifts.length)];
        
        const availableEmployee = underworkedEmployees.find(u => 
          this.canEmployeeTakeShift(u.employee, shiftToReassign, rebalanced)
        );
        
        if (availableEmployee && shiftToReassign) {
          const index = rebalanced.findIndex(s => s.id === shiftToReassign.id);
          if (index !== -1) {
            rebalanced[index] = {
              ...shiftToReassign,
              userId: availableEmployee.employee.id,
              id: `rebalanced-${availableEmployee.employee.id}-${shiftToReassign.date}-${shiftToReassign.startTime}`
            };
          }
        }
      }
      
      return rebalanced;
    }
    
    return shifts;
  }

  private static optimizeSkillCoverage(shifts: Shift[], employees: User[], shop: Shop): Shift[] {
    const optimized = [...shifts];
    
    for (const requirement of shop.staffRequirements) {
      if (!requirement.requiredSkills?.length) continue;
      
      const [startTime, endTime] = requirement.timeSlot.split('-');
      const relevantShifts = optimized.filter(s => 
        s.startTime <= startTime && s.endTime >= endTime
      );
      
      for (const requiredSkill of requirement.requiredSkills) {
        const hasSkill = relevantShifts.some(shift => {
          const employee = employees.find(u => u.id === shift.userId);
          return employee?.skills?.includes(requiredSkill);
        });
        
        if (!hasSkill) {
          // Trouver un employé avec cette compétence
          const skilledEmployee = employees.find(u => 
            u.skills?.includes(requiredSkill) && 
            shop.assignedEmployees.includes(u.id)
          );
          
          if (skilledEmployee && relevantShifts.length > 0) {
            const shiftToReplace = relevantShifts[0];
            const index = optimized.findIndex(s => s.id === shiftToReplace.id);
            if (index !== -1) {
              optimized[index] = {
                ...shiftToReplace,
                userId: skilledEmployee.id,
                id: `skilled-${skilledEmployee.id}-${shiftToReplace.date}-${shiftToReplace.startTime}`
              };
            }
          }
        }
      }
    }
    
    return optimized;
  }

  private static respectEmployeePreferences(shifts: Shift[], employees: User[]): Shift[] {
    const improved = [...shifts];
    
    for (const employee of employees) {
      if (!employee.preferences) continue;
      
      const employeeShifts = improved.filter(s => s.userId === employee.id);
      
      if (employee.preferences.preferredShifts?.length) {
        for (const shift of employeeShifts.slice(0, 2)) { // Limiter à 2 pour éviter trop de changements
          const shiftType = this.getShiftType(shift.startTime);
          if (!employee.preferences.preferredShifts.includes(shiftType)) {
            // Essayer de trouver un autre employé qui préfère ce type de créneau
            const preferringEmployee = employees.find(u => 
              u.id !== employee.id && 
              u.preferences?.preferredShifts?.includes(shiftType) &&
              this.canEmployeeTakeShift(u, shift, improved)
            );
            
            if (preferringEmployee) {
              const index = improved.findIndex(s => s.id === shift.id);
              if (index !== -1) {
                improved[index] = {
                  ...shift,
                  userId: preferringEmployee.id,
                  id: `preferred-${preferringEmployee.id}-${shift.date}-${shift.startTime}`
                };
              }
            }
          }
        }
      }
    }
    
    return improved;
  }

  // ===== ASSIGNATION DES CRÉNEAUX QUOTIDIENS =====
  
  private static assignDayShifts(
    dayReq: { date: string; dayOfWeek: number; timeSlots: Array<{ start: string; end: string; minStaff: number; optimalStaff: number }> },
    availableEmployees: User[],
    employeeSchedules: Map<string, { dailyHours: number; preferredStart: string; preferredEnd: string }>,
    existingShifts: Shift[],
    shop: Shop
  ): Shift[] {
    const dayShifts: Shift[] = [];
    
    for (const employee of availableEmployees) {
      const schedule = employeeSchedules.get(employee.id);
      if (!schedule) continue;
      
      // Vérifier si l'employé a déjà atteint son quota cette semaine
      const weeklyHours = this.getEmployeeWeeklyHours(employee.id, dayReq.date, existingShifts);
      const weeklyQuota = employee.weeklyHoursQuota || 35;
      
      if (weeklyHours >= weeklyQuota) {
        console.log(`⚠️ ${employee.name} a déjà atteint son quota hebdomadaire (${weeklyHours.toFixed(1)}h/${weeklyQuota}h)`);
        continue;
      }
      
      // Créer le créneau selon l'horaire calculé
      const shift: Shift = {
        id: `shop-${shop.id}-${employee.id}-${dayReq.date}-${schedule.preferredStart}`,
        userId: employee.id,
        date: dayReq.date,
        startTime: schedule.preferredStart,
        endTime: schedule.preferredEnd,
        breakDuration: this.calculateBreakDuration(schedule.preferredStart, schedule.preferredEnd),
        notes: `Généré pour ${shop.name} (${schedule.dailyHours}h/jour)`,
        createdAt: new Date()
      };
      
      dayShifts.push(shift);
      console.log(`✅ ${employee.name}: ${schedule.preferredStart}-${schedule.preferredEnd} (${schedule.dailyHours}h)`);
    }
    
    return dayShifts;
  }
  
  // ===== CALCUL DES HEURES HEBDOMADAIRES =====
  
  private static getEmployeeWeeklyHours(employeeId: string, currentDate: string, shifts: Shift[]): number {
    const currentDateObj = parseISO(currentDate);
    const weekStart = startOfWeek(currentDateObj, { weekStartsOn: 1 }); // Lundi
    const weekEnd = endOfWeek(currentDateObj, { weekStartsOn: 1 }); // Dimanche
    
    return shifts
      .filter(shift => {
        if (shift.userId !== employeeId) return false;
        const shiftDate = parseISO(shift.date);
        return isWithinInterval(shiftDate, { start: weekStart, end: weekEnd });
      })
      .reduce((total, shift) => {
        const hours = differenceInHours(
          parseISO(`${shift.date}T${shift.endTime}`),
          parseISO(`${shift.date}T${shift.startTime}`)
        ) - (shift.breakDuration / 60);
        return total + hours;
      }, 0);
  }
  
  // ===== VÉRIFICATION CONGÉS =====
  
  private static isEmployeeOnVacation(employeeId: string, date: string, vacations: Vacation[]): boolean {
    const shiftDate = parseISO(date);
    return vacations.some(vacation => {
      if (vacation.userId !== employeeId) return false;
      const vacStart = parseISO(vacation.startDate);
      const vacEnd = parseISO(vacation.endDate);
      return isWithinInterval(shiftDate, { start: vacStart, end: vacEnd });
    });
  }

  // ===== NOUVELLES MÉTHODES UTILITAIRES =====

  private static findBestEmployeeForOpening(
    fullTimeEmployees: User[],
    availablePartTime: User[],
    date: string,
    existingShifts: Shift[],
    vacations: Vacation[]
  ): User | null {
    // Priorité aux temps plein qui ont le moins d'heures ce mois-ci
    const candidates = [...fullTimeEmployees, ...availablePartTime]
      .filter(emp => this.isEmployeeAvailable(emp, date, vacations, existingShifts))
      .sort((a, b) => {
        const aHours = this.getEmployeeMonthlyHours(a.id, existingShifts);
        const bHours = this.getEmployeeMonthlyHours(b.id, existingShifts);
        return aHours - bHours; // Celui avec le moins d'heures en premier
      });
    
    return candidates[0] || null;
  }

  private static findBestEmployeeForClosing(
    fullTimeEmployees: User[],
    availablePartTime: User[],
    date: string,
    existingShifts: Shift[],
    vacations: Vacation[],
    excludeEmployee?: User | null
  ): User | null {
    const candidates = [...fullTimeEmployees, ...availablePartTime]
      .filter(emp => 
        emp.id !== excludeEmployee?.id &&
        this.isEmployeeAvailable(emp, date, vacations, existingShifts)
      )
      .sort((a, b) => {
        const aHours = this.getEmployeeMonthlyHours(a.id, existingShifts);
        const bHours = this.getEmployeeMonthlyHours(b.id, existingShifts);
        return aHours - bHours;
      });
    
    return candidates[0] || null;
  }

  private static findAdditionalEmployee(
    fullTimeEmployees: User[],
    availablePartTime: User[],
    date: string,
    existingShifts: Shift[],
    vacations: Vacation[],
    excludeEmployees: User[]
  ): User | null {
    const excludeIds = excludeEmployees.map(emp => emp.id);
    const candidates = [...fullTimeEmployees, ...availablePartTime]
      .filter(emp => 
        !excludeIds.includes(emp.id) &&
        this.isEmployeeAvailable(emp, date, vacations, existingShifts)
      )
      .sort((a, b) => {
        const aHours = this.getEmployeeMonthlyHours(a.id, existingShifts);
        const bHours = this.getEmployeeMonthlyHours(b.id, existingShifts);
        return aHours - bHours;
      });
    
    return candidates[0] || null;
  }

  private static calculateMidTime(startTime: string, endTime: string): string {
    const start = parseISO(`2000-01-01T${startTime}`);
    const end = parseISO(`2000-01-01T${endTime}`);
    const midMinutes = (start.getTime() + end.getTime()) / 2;
    const midDate = new Date(midMinutes);
    return format(midDate, 'HH:mm');
  }

  private static addHoursToTime(time: string, hours: number): string {
    const date = parseISO(`2000-01-01T${time}`);
    const newDate = new Date(date.getTime() + hours * 60 * 60 * 1000);
    return format(newDate, 'HH:mm');
  }

  private static subtractHoursFromTime(time: string, hours: number): string {
    const date = parseISO(`2000-01-01T${time}`);
    const newDate = new Date(date.getTime() - hours * 60 * 60 * 1000);
    return format(newDate, 'HH:mm');
  }

  private static isEmployeeAvailable(
    employee: User,
    date: string,
    vacations: Vacation[],
    existingShifts: Shift[]
  ): boolean {
    // Vérifier congés
    const isOnVacation = vacations.some(vacation => {
      const vacStart = parseISO(vacation.startDate);
      const vacEnd = parseISO(vacation.endDate);
      const shiftDate = parseISO(date);
      return vacation.userId === employee.id && 
             isWithinInterval(shiftDate, { start: vacStart, end: vacEnd });
    });
    
    if (isOnVacation) return false;

    // Vérifier si déjà assigné ce jour
    const hasShiftThisDay = existingShifts.some(shift => 
      shift.userId === employee.id && shift.date === date
    );
    
    return !hasShiftThisDay;
  }

  private static getEmployeeMonthlyHours(employeeId: string, shifts: Shift[]): number {
    return shifts
      .filter(s => s.userId === employeeId)
      .reduce((total, shift) => {
        const hours = differenceInHours(
          parseISO(`${shift.date}T${shift.endTime}`),
          parseISO(`${shift.date}T${shift.startTime}`)
        ) - (shift.breakDuration / 60);
        return total + hours;
      }, 0);
  }

  private static canEmployeeWork(
    employee: User,
    date: string,
    startTime: string,
    endTime: string,
    existingShifts: Shift[]
  ): boolean {
    const shiftHours = differenceInHours(
      parseISO(`${date}T${endTime}`),
      parseISO(`${date}T${startTime}`)
    );
    
    const currentMonthlyHours = this.getEmployeeMonthlyHours(employee.id, existingShifts);
    const monthlyQuota = employee.weeklyHoursQuota * 4.33;
    
    // Vérifier si ajouter ce créneau dépasserait le quota (+5h tolérance)
    return (currentMonthlyHours + shiftHours) <= (monthlyQuota + 5);
  }

  // ===== MÉTHODES UTILITAIRES =====

  private static findAvailableEmployees(
    employees: User[],
    date: string,
    startTime: string,
    endTime: string,
    vacations: Vacation[],
    existingShifts: Shift[]
  ): User[] {
    return employees.filter(employee => {
      // Vérifier si en congé
      const isOnVacation = vacations.some(vacation => {
        const vacStart = parseISO(vacation.startDate);
        const vacEnd = parseISO(vacation.endDate);
        const shiftDate = parseISO(date);
        return vacation.userId === employee.id && 
               isWithinInterval(shiftDate, { start: vacStart, end: vacEnd });
      });

      if (isOnVacation) return false;

      // Vérifier disponibilité
      const dayOfWeek = parseISO(date).getDay();
      const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek];
      const availability = employee.availability?.[dayName];
      
      if (availability && !availability.available) return false;

      // Vérifier conflits avec créneaux existants
      const hasConflict = existingShifts.some(shift => 
        shift.userId === employee.id && 
        shift.date === date && 
        this.timesOverlap(shift.startTime, shift.endTime, startTime, endTime)
      );

      return !hasConflict;
    });
  }

  private static sortEmployeesByPriority(
    employees: User[],
    requiredSkills: string[],
    preferredSkills: string[]
  ): User[] {
    return employees.sort((a, b) => {
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

      return 0;
    });
  }

  private static calculateBreakDuration(startTime: string, endTime: string): number {
    const start = parseISO(`2000-01-01T${startTime}`);
    const end = parseISO(`2000-01-01T${endTime}`);
    const hours = differenceInHours(end, start);
    
    // Pause obligatoire de 1h si le créneau fait 7h ou plus (6h de travail + 1h de pause)
    return hours >= 7 ? 60 : 0;
  }

  private static calculateEmployeeWorkload(shifts: Shift[], employees: User[]) {
    return employees.map(employee => {
      const employeeShifts = shifts.filter(s => s.userId === employee.id);
      const weeklyHours = employeeShifts.reduce((total, shift) => {
        const start = parseISO(`${shift.date}T${shift.startTime}`);
        const end = parseISO(`${shift.date}T${shift.endTime}`);
        return total + differenceInHours(end, start) - (shift.breakDuration / 60);
      }, 0);
      
      return { employee, weeklyHours, shiftsCount: employeeShifts.length };
    });
  }

  private static canEmployeeTakeShift(employee: User, shift: Shift, allShifts: Shift[]): boolean {
    const employeeShifts = allShifts.filter(s => s.userId === employee.id && s.id !== shift.id);
    
    // Pas de conflit horaire le même jour
    const sameDay = employeeShifts.filter(s => s.date === shift.date);
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

  // ===== ÉVALUATION ET SCORING =====

  private static evaluateSolution(
    shifts: Shift[],
    employees: User[],
    shop: Shop,
    priorities: ShopPlanningOptions['optimizationPriorities']
  ): PlanningScore {
    const legalCompliance = this.calculateLegalCompliance(shifts, employees);
    const skillCoverage = this.calculateSkillCoverage(shifts, employees, shop);
    const employeeSatisfaction = this.calculateEmployeeSatisfaction(shifts, employees);
    const costOptimization = this.calculateCostOptimization(shifts, employees);
    const workloadBalance = this.calculateWorkloadBalance(shifts, employees);

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

  private static calculateLegalCompliance(shifts: Shift[], employees: User[]): number {
    const violations = LegalConstraintsEngine.validatePlanning(shifts, employees, []);
    const errorCount = violations.filter(v => v.severity === 'error').length;
    return Math.max(0, 100 - (errorCount * 10));
  }

  private static calculateSkillCoverage(shifts: Shift[], employees: User[], shop: Shop): number {
    let totalRequiredSkills = 0;
    let coveredSkills = 0;

    for (const requirement of shop.staffRequirements) {
      if (!requirement.requiredSkills?.length) continue;
      
      const [startTime, endTime] = requirement.timeSlot.split('-');
      const relevantShifts = shifts.filter(s => 
        s.startTime <= startTime && s.endTime >= endTime
      );
      
      for (const requiredSkill of requirement.requiredSkills) {
        totalRequiredSkills++;
        
        const hasSkill = relevantShifts.some(shift => {
          const employee = employees.find(u => u.id === shift.userId);
          return employee?.skills?.includes(requiredSkill);
        });
        
        if (hasSkill) coveredSkills++;
      }
    }

    return totalRequiredSkills > 0 ? (coveredSkills / totalRequiredSkills) * 100 : 100;
  }

  private static calculateEmployeeSatisfaction(shifts: Shift[], employees: User[]): number {
    let totalPreferences = 0;
    let satisfiedPreferences = 0;

    for (const employee of employees) {
      const employeeShifts = shifts.filter(s => s.userId === employee.id);
      
      if (employee.preferences?.preferredShifts?.length) {
        for (const shift of employeeShifts) {
          totalPreferences++;
          const shiftType = this.getShiftType(shift.startTime);
          if (employee.preferences.preferredShifts.includes(shiftType)) {
            satisfiedPreferences++;
          }
        }
      }
    }

    return totalPreferences > 0 ? (satisfiedPreferences / totalPreferences) * 100 : 100;
  }

  private static calculateCostOptimization(shifts: Shift[], employees: User[]): number {
    const employeesWithRates = employees.filter(u => u.hourlyRate);
    if (employeesWithRates.length === 0) return 100;

    const avgRate = employeesWithRates.reduce((sum, u) => sum + (u.hourlyRate || 0), 0) / employeesWithRates.length;
    
    let totalCost = 0;
    let totalHours = 0;

    for (const shift of shifts) {
      const employee = employees.find(u => u.id === shift.userId);
      if (employee?.hourlyRate) {
        const hours = differenceInHours(
          parseISO(`${shift.date}T${shift.endTime}`),
          parseISO(`${shift.date}T${shift.startTime}`)
        ) - (shift.breakDuration / 60);
        
        totalCost += hours * employee.hourlyRate;
        totalHours += hours;
      }
    }

    const actualAvgRate = totalHours > 0 ? totalCost / totalHours : avgRate;
    return Math.max(0, 100 - Math.abs(actualAvgRate - avgRate) / avgRate * 100);
  }

  private static calculateWorkloadBalance(shifts: Shift[], employees: User[]): number {
    const workload = this.calculateEmployeeWorkload(shifts, employees);
    const activeEmployees = workload.filter(w => w.shiftsCount > 0);
    
    if (activeEmployees.length === 0) return 100;

    const avgHours = activeEmployees.reduce((sum, w) => sum + w.weeklyHours, 0) / activeEmployees.length;
    const variance = activeEmployees.reduce((sum, w) => sum + Math.pow(w.weeklyHours - avgHours, 2), 0) / activeEmployees.length;
    const stdDev = Math.sqrt(variance);
    
    return Math.max(0, 100 - (stdDev / avgHours) * 100);
  }

  private static validateFinalSolution(
    shifts: Shift[],
    employees: User[],
    vacations: Vacation[],
    shop: Shop
  ): ConstraintViolation[] {
    const legalViolations = LegalConstraintsEngine.validatePlanning(shifts, employees, vacations);
    
    // Convertir Shop en StoreConfiguration pour la validation organisationnelle
    const storeConfig = {
      id: shop.id,
      name: shop.name,
      openingHours: shop.openingHours,
      staffRequirements: shop.staffRequirements,
      constraints: shop.constraints,
      createdAt: shop.createdAt,
      updatedAt: shop.updatedAt
    };
    
    const orgViolations = OrganizationalConstraintsEngine.validateOrganizational(shifts, employees, storeConfig);
    
    return [...legalViolations, ...orgViolations];
  }

  private static generateStatistics(shifts: Shift[], employees: User[]) {
    const totalHours = shifts.reduce((total, shift) => {
      const hours = differenceInHours(
        parseISO(`${shift.date}T${shift.endTime}`),
        parseISO(`${shift.date}T${shift.startTime}`)
      ) - (shift.breakDuration / 60);
      return total + hours;
    }, 0);

    const totalCost = shifts.reduce((total, shift) => {
      const employee = employees.find(u => u.id === shift.userId);
      if (employee?.hourlyRate) {
        const hours = differenceInHours(
          parseISO(`${shift.date}T${shift.endTime}`),
          parseISO(`${shift.date}T${shift.startTime}`)
        ) - (shift.breakDuration / 60);
        return total + (hours * employee.hourlyRate);
      }
      return total;
    }, 0);

    const employeesUsed = new Set(shifts.map(s => s.userId)).size;
    const skillsCovered = new Set(
      shifts.flatMap(shift => {
        const employee = employees.find(u => u.id === shift.userId);
        return employee?.skills || [];
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
