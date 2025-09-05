'use client';

export function PlanningInstructions() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 sm:mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">💡</span>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-900 mb-1">
            Comment utiliser le planning
          </h4>
          <div className="text-xs text-blue-800 space-y-1">
            <p>• <strong>Tapez</strong> sur un jour pour ajouter un créneau</p>
            <p>• <strong>Les points bleus</strong> indiquent les jours avec créneaux</p>
            <p>• <strong>Les boutons</strong> modifient ou suppriment les créneaux</p>
            <p>• <strong>Navigation</strong> : flèches pour changer de mois</p>
          </div>
        </div>
      </div>
    </div>
  );
}
