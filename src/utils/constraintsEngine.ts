import { User, Shift, Vacation, ConstraintViolation, StoreConfiguration } from '@/types';
import { addDays, differenceInHours, parseISO, format, isWithinInterval } from 'date-fns';

// ===== MOTEUR DE CONTRAINTES LÉGALES =====

export class LegalConstraintsEngine {
  
  /**
   * Vérifie toutes les contraintes légales pour un planning
   */
  static validatePlanning(
    shifts: Shift[], 
    users: User[], 
    vacations: Vacation[]
  ): ConstraintViolation[] {
    const violations: ConstraintViolation[] = [];

    for (const user of users) {
      const userShifts = shifts.filter(s => s.userId === user.id);
      
      // Vérifier les contraintes pour cet utilisateur
      violations.push(...this.checkDailyHours(user, userShifts));
      violations.push(...this.checkRestBetweenShifts(user, userShifts));
      violations.push(...this.checkWeeklyRest(user, userShifts));
      violations.push(...this.checkConsecutiveDays(user, userShifts));
      violations.push(...this.checkVacationConflicts(user, userShifts, vacations));
      violations.push(...this.checkBreakDuration(user, userShifts));
    }

    return violations;
  }

  /**
   * Vérifie la durée maximale quotidienne (10h légal)
   */
  private static checkDailyHours(user: User, shifts: Shift[]): ConstraintViolation[] {
    const violations: ConstraintViolation[] = [];
    const maxDaily = user.maxDailyHours || 10; // 10h par défaut (légal français)

    // Grouper par date
    const shiftsByDate = shifts.reduce((acc, shift) => {
      if (!acc[shift.date]) acc[shift.date] = [];
      acc[shift.date].push(shift);
      return acc;
    }, {} as Record<string, Shift[]>);

    for (const [date, dayShifts] of Object.entries(shiftsByDate)) {
      const totalHours = dayShifts.reduce((total, shift) => {
        const start = parseISO(`${shift.date}T${shift.startTime}`);
        const end = parseISO(`${shift.date}T${shift.endTime}`);
        const hours = differenceInHours(end, start) - (shift.breakDuration / 60);
        return total + hours;
      }, 0);

      if (totalHours > maxDaily) {
        violations.push({
          type: 'legal',
          severity: 'error',
          message: `Durée quotidienne dépassée pour ${user.name} le ${format(parseISO(date), 'dd/MM/yyyy')} : ${totalHours}h (max: ${maxDaily}h)`,
          userId: user.id,
          date
        });
      }
    }

    return violations;
  }

  /**
   * Vérifie le repos minimum entre services (11h légal)
   */
  private static checkRestBetweenShifts(user: User, shifts: Shift[]): ConstraintViolation[] {
    const violations: ConstraintViolation[] = [];
    const minRest = user.minRestBetweenShifts || 11; // 11h par défaut

    const sortedShifts = shifts.sort((a, b) => 
      new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime()
    );

    for (let i = 1; i < sortedShifts.length; i++) {
      const prevShift = sortedShifts[i - 1];
      const currentShift = sortedShifts[i];

      const prevEnd = parseISO(`${prevShift.date}T${prevShift.endTime}`);
      const currentStart = parseISO(`${currentShift.date}T${currentShift.startTime}`);
      
      const restHours = differenceInHours(currentStart, prevEnd);

      if (restHours < minRest) {
        violations.push({
          type: 'legal',
          severity: 'error',
          message: `Repos insuffisant pour ${user.name} entre le ${format(prevEnd, 'dd/MM HH:mm')} et le ${format(currentStart, 'dd/MM HH:mm')} : ${restHours}h (min: ${minRest}h)`,
          userId: user.id,
          shiftId: currentShift.id,
          date: currentShift.date
        });
      }
    }

    return violations;
  }

  /**
   * Vérifie le repos hebdomadaire (35h consécutives)
   */
  private static checkWeeklyRest(user: User, shifts: Shift[]): ConstraintViolation[] {
    const violations: ConstraintViolation[] = [];
    
    // Grouper par semaine
    const shiftsByWeek = this.groupShiftsByWeek(shifts);

    for (const [weekStart, weekShifts] of Object.entries(shiftsByWeek)) {
      const hasWeeklyRest = this.checkWeeklyRestPeriod(weekShifts);
      
      if (!hasWeeklyRest) {
        violations.push({
          type: 'legal',
          severity: 'error',
          message: `Repos hebdomadaire insuffisant pour ${user.name} semaine du ${format(parseISO(weekStart), 'dd/MM/yyyy')} (35h consécutives requises)`,
          userId: user.id,
          date: weekStart
        });
      }
    }

    return violations;
  }

  /**
   * Vérifie le nombre de jours consécutifs (6 jours max)
   */
  private static checkConsecutiveDays(user: User, shifts: Shift[]): ConstraintViolation[] {
    const violations: ConstraintViolation[] = [];
    const maxConsecutive = user.maxConsecutiveDays || 6;

    const workDays = [...new Set(shifts.map(s => s.date))].sort();
    let consecutiveCount = 1;
    let consecutiveStart = workDays[0];

    for (let i = 1; i < workDays.length; i++) {
      const prevDate = parseISO(workDays[i - 1]);
      const currentDate = parseISO(workDays[i]);
      
      // Si les jours sont consécutifs
      if (differenceInHours(currentDate, prevDate) === 24) {
        consecutiveCount++;
        
        if (consecutiveCount > maxConsecutive) {
          violations.push({
            type: 'legal',
            severity: 'error',
            message: `Trop de jours consécutifs pour ${user.name} : ${consecutiveCount} jours depuis le ${format(parseISO(consecutiveStart), 'dd/MM/yyyy')} (max: ${maxConsecutive})`,
            userId: user.id,
            date: workDays[i]
          });
        }
      } else {
        // Reset du compteur
        consecutiveCount = 1;
        consecutiveStart = workDays[i];
      }
    }

    return violations;
  }

  /**
   * Vérifie les conflits avec les congés
   */
  private static checkVacationConflicts(user: User, shifts: Shift[], vacations: Vacation[]): ConstraintViolation[] {
    const violations: ConstraintViolation[] = [];
    const userVacations = vacations.filter(v => v.userId === user.id);

    for (const shift of shifts) {
      const shiftDate = parseISO(shift.date);
      
      for (const vacation of userVacations) {
        const vacationStart = parseISO(vacation.startDate);
        const vacationEnd = parseISO(vacation.endDate);
        
        if (isWithinInterval(shiftDate, { start: vacationStart, end: vacationEnd })) {
          violations.push({
            type: 'legal',
            severity: 'error',
            message: `Conflit congé pour ${user.name} le ${format(shiftDate, 'dd/MM/yyyy')} : ${vacation.type}`,
            userId: user.id,
            shiftId: shift.id,
            date: shift.date
          });
        }
      }
    }

    return violations;
  }

  /**
   * Vérifie la durée de pause (minimum 1h pour > 6h de travail)
   */
  private static checkBreakDuration(user: User, shifts: Shift[]): ConstraintViolation[] {
    const violations: ConstraintViolation[] = [];

    for (const shift of shifts) {
      const start = parseISO(`${shift.date}T${shift.startTime}`);
      const end = parseISO(`${shift.date}T${shift.endTime}`);
      const workHours = differenceInHours(end, start);
      
      // Si plus de 6h de travail, pause minimum de 60 minutes
      if (workHours > 6 && shift.breakDuration < 60) {
        violations.push({
          type: 'legal',
          severity: 'error',
          message: `Pause insuffisante pour ${user.name} le ${format(parseISO(shift.date), 'dd/MM/yyyy')} : ${shift.breakDuration}min (min: 60min pour ${workHours}h de travail)`,
          userId: user.id,
          shiftId: shift.id,
          date: shift.date
        });
      }
    }

    return violations;
  }

  // ===== MÉTHODES UTILITAIRES =====

  private static groupShiftsByWeek(shifts: Shift[]): Record<string, Shift[]> {
    return shifts.reduce((acc, shift) => {
      const shiftDate = parseISO(shift.date);
      const weekStart = format(addDays(shiftDate, -shiftDate.getDay()), 'yyyy-MM-dd');
      
      if (!acc[weekStart]) acc[weekStart] = [];
      acc[weekStart].push(shift);
      
      return acc;
    }, {} as Record<string, Shift[]>);
  }

  private static checkWeeklyRestPeriod(weekShifts: Shift[]): boolean {
    // Simplification : vérifier qu'il y a au moins 1 jour sans travail dans la semaine
    const workDays = new Set(weekShifts.map(s => parseISO(s.date).getDay()));
    return workDays.size < 7; // Au moins un jour de la semaine sans travail
  }
}

// ===== MOTEUR DE CONTRAINTES ORGANISATIONNELLES =====

export class OrganizationalConstraintsEngine {
  
  /**
   * Vérifie les contraintes organisationnelles
   */
  static validateOrganizational(
    shifts: Shift[],
    users: User[],
    storeConfig: StoreConfiguration
  ): ConstraintViolation[] {
    const violations: ConstraintViolation[] = [];

    violations.push(...this.checkStaffCoverage(shifts, users, storeConfig));
    violations.push(...this.checkSkillRequirements(shifts, users, storeConfig));
    violations.push(...this.checkBreakConstraints(shifts, users, storeConfig));

    return violations;
  }

  /**
   * Vérifie la couverture minimale en personnel
   */
  private static checkStaffCoverage(
    shifts: Shift[],
    users: User[],
    storeConfig: StoreConfiguration
  ): ConstraintViolation[] {
    const violations: ConstraintViolation[] = [];

    // Grouper les shifts par date et heure
    const shiftsByDateHour = this.groupShiftsByDateHour(shifts);

    for (const requirement of storeConfig.staffRequirements) {
      const [startTime, endTime] = requirement.timeSlot.split('-');
      
      for (const [dateHour, hourShifts] of Object.entries(shiftsByDateHour)) {
        const [date, hour] = dateHour.split('T');
        
        if (hour >= startTime && hour < endTime) {
          if (hourShifts.length < requirement.minStaff) {
            violations.push({
              type: 'organizational',
              severity: 'warning',
              message: `Personnel insuffisant le ${format(parseISO(date), 'dd/MM/yyyy')} à ${hour} : ${hourShifts.length} (min: ${requirement.minStaff})`,
              date
            });
          }
        }
      }
    }

    return violations;
  }

  /**
   * Vérifie les compétences requises
   */
  private static checkSkillRequirements(
    shifts: Shift[],
    users: User[],
    storeConfig: StoreConfiguration
  ): ConstraintViolation[] {
    const violations: ConstraintViolation[] = [];

    for (const requirement of storeConfig.staffRequirements) {
      if (!requirement.requiredSkills?.length) continue;

      const [startTime, endTime] = requirement.timeSlot.split('-');
      const shiftsByDateHour = this.groupShiftsByDateHour(shifts);

      for (const [dateHour, hourShifts] of Object.entries(shiftsByDateHour)) {
        const [date, hour] = dateHour.split('T');
        
        if (hour >= startTime && hour < endTime) {
          const staffSkills = hourShifts.map(shift => {
            const user = users.find(u => u.id === shift.userId);
            return user?.skills || [];
          }).flat();

          for (const requiredSkill of requirement.requiredSkills) {
            if (!staffSkills.includes(requiredSkill)) {
              violations.push({
                type: 'organizational',
                severity: 'error',
                message: `Compétence manquante "${requiredSkill}" le ${format(parseISO(date), 'dd/MM/yyyy')} à ${hour}`,
                date
              });
            }
          }
        }
      }
    }

    return violations;
  }

  /**
   * Vérifie les contraintes de pause
   */
  private static checkBreakConstraints(
    shifts: Shift[],
    users: User[],
    storeConfig: StoreConfiguration
  ): ConstraintViolation[] {
    const violations: ConstraintViolation[] = [];

    // Simuler les pauses (simplification : pause au milieu du service)
    const breaksByDateHour = this.simulateBreaks(shifts);

    for (const [dateHour, breaksCount] of Object.entries(breaksByDateHour)) {
      const [date, hour] = dateHour.split('T');
      
      if (breaksCount > storeConfig.constraints.maxSimultaneousBreaks) {
        violations.push({
          type: 'organizational',
          severity: 'warning',
          message: `Trop de pauses simultanées le ${format(parseISO(date), 'dd/MM/yyyy')} à ${hour} : ${breaksCount} (max: ${storeConfig.constraints.maxSimultaneousBreaks})`,
          date
        });
      }
    }

    return violations;
  }

  // ===== MÉTHODES UTILITAIRES =====

  private static groupShiftsByDateHour(shifts: Shift[]): Record<string, Shift[]> {
    const result: Record<string, Shift[]> = {};
    
    for (const shift of shifts) {
      const startHour = parseInt(shift.startTime.split(':')[0]);
      const endHour = parseInt(shift.endTime.split(':')[0]);
      
      for (let hour = startHour; hour < endHour; hour++) {
        const key = `${shift.date}T${hour.toString().padStart(2, '0')}`;
        if (!result[key]) result[key] = [];
        result[key].push(shift);
      }
    }
    
    return result;
  }

  private static simulateBreaks(shifts: Shift[]): Record<string, number> {
    const breaks: Record<string, number> = {};
    
    for (const shift of shifts) {
      if (shift.breakDuration > 0) {
        // Simplification : pause au milieu du service
        const startHour = parseInt(shift.startTime.split(':')[0]);
        const endHour = parseInt(shift.endTime.split(':')[0]);
        const midHour = Math.floor((startHour + endHour) / 2);
        
        const key = `${shift.date}T${midHour.toString().padStart(2, '0')}`;
        breaks[key] = (breaks[key] || 0) + 1;
      }
    }
    
    return breaks;
  }
}
