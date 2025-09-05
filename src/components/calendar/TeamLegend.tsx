'use client';

import { User as UserIcon } from 'lucide-react';
import { User, Shift } from '@/types';
import { calculateShiftDuration } from '@/utils/time';

interface TeamLegendProps {
  users: User[];
  shifts: Shift[];
}

export function TeamLegend({ users, shifts }: TeamLegendProps) {
  const getUserStats = (userId: string) => {
    const userShifts = shifts.filter(s => s.userId === userId);
    const totalHours = userShifts.reduce((total, shift) => {
      return total + calculateShiftDuration(shift);
    }, 0);

    return {
      shiftCount: userShifts.length,
      totalHours,
    };
  };

  const totalHours = shifts.reduce((total, shift) => total + calculateShiftDuration(shift), 0);
  const avgHours = shifts.length > 0 ? totalHours / shifts.length : 0;

  return (
    <div className="mt-4 sm:mt-6 bg-white rounded-lg shadow-sm border p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
        Équipe ({users.length} employé{users.length > 1 ? 's' : ''})
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {users.map((user) => {
          const stats = getUserStats(user.id);

          return (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-2"
              style={{ borderColor: user.color + '40' }}
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex-shrink-0 border-2 border-white shadow-sm"
                  style={{ backgroundColor: user.color }}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm sm:text-base text-gray-900 truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {stats.shiftCount} créneau{stats.shiftCount > 1 ? 'x' : ''} • {stats.totalHours.toFixed(1)}h
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-lg sm:text-xl font-bold text-blue-600">
              {users.length}
            </div>
            <div className="text-xs text-blue-800">Employés</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-lg sm:text-xl font-bold text-green-600">
              {shifts.length}
            </div>
            <div className="text-xs text-green-800">Créneaux</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-lg sm:text-xl font-bold text-purple-600">
              {totalHours.toFixed(1)}h
            </div>
            <div className="text-xs text-purple-800">Total heures</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-lg sm:text-xl font-bold text-orange-600">
              {avgHours.toFixed(1)}h
            </div>
            <div className="text-xs text-orange-800">Moyenne</div>
          </div>
        </div>
      </div>
    </div>
  );
}
