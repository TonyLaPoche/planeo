'use client';

import { useEffect, useState } from 'react';
import { MobilePlanningView } from './MobilePlanningView';
import { DesktopPlanningView } from './DesktopPlanningView';
import { Shift, User } from '@/types';

interface ResponsiveCalendarProps {
  calendarDays: (string | null)[];
  getShiftsForDate: (date: string) => Shift[];
  getUserById: (userId: string) => User | undefined;
  onDateClick: (date: string) => void;
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
}

export function ResponsiveCalendar({
  calendarDays,
  getShiftsForDate,
  getUserById,
  onDateClick,
  onEditShift,
  onDeleteShift,
}: ResponsiveCalendarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (isMobile) {
    return (
      <MobilePlanningView
        calendarDays={calendarDays}
        getShiftsForDate={getShiftsForDate}
        getUserById={getUserById}
        onDateClick={onDateClick}
        onEditShift={onEditShift}
        onDeleteShift={onDeleteShift}
      />
    );
  }

  return (
    <DesktopPlanningView
      calendarDays={calendarDays}
      getShiftsForDate={getShiftsForDate}
      getUserById={getUserById}
      onDateClick={onDateClick}
      onEditShift={onEditShift}
      onDeleteShift={onDeleteShift}
    />
  );
}
