'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, User } from 'lucide-react';
import { Vacation, User as UserType } from '@/types';
import { dataExport } from '@/utils/storage';
import { format } from 'date-fns';

interface VacationManagerProps {
  users: UserType[];
}

export function VacationManager({ users }: VacationManagerProps) {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVacation, setEditingVacation] = useState<Vacation | null>(null);
  const [formData, setFormData] = useState({
    userId: '',
    startDate: '',
    endDate: '',
    type: 'vacation' as Vacation['type'],
    notes: '',
  });

  useEffect(() => {
    setVacations(dataExport.getVacations());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const vacation: Vacation = {
      id: editingVacation?.id || `vacation-${Date.now()}`,
      userId: formData.userId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      type: formData.type,
      notes: formData.notes,
      createdAt: editingVacation?.createdAt || new Date(),
    };

    if (editingVacation) {
      dataExport.updateVacation(vacation.id, vacation);
    } else {
      dataExport.addVacation(vacation);
    }

    setVacations(dataExport.getVacations());
    setIsModalOpen(false);
    setEditingVacation(null);
    resetForm();
  };

  const handleEdit = (vacation: Vacation) => {
    setEditingVacation(vacation);
    setFormData({
      userId: vacation.userId,
      startDate: vacation.startDate,
      endDate: vacation.endDate,
      type: vacation.type,
      notes: vacation.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce congé ?')) {
      dataExport.deleteVacation(id);
      setVacations(dataExport.getVacations());
    }
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      startDate: '',
      endDate: '',
      type: 'vacation',
      notes: '',
    });
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Utilisateur inconnu';
  };

  const getTypeLabel = (type: Vacation['type']) => {
    const labels = {
      'vacation': 'Vacances',
      'sick-leave': 'Maladie',
      'personal-leave': 'Congé personnel',
      'public-holiday': 'Jour férié',
    };
    return labels[type];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Gestion des congés</h3>
        <button
          onClick={() => {
            setEditingVacation(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="btn-primary text-sm"
          aria-label="Ajouter un nouveau congé"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un congé
        </button>
      </div>

      <div className="p-6">
        {vacations.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun congé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par ajouter un congé pour vos employés.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {vacations.map((vacation) => (
              <div key={vacation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <User className="h-8 w-8 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {getUserName(vacation.userId)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {getTypeLabel(vacation.type)} • {format(new Date(vacation.startDate), 'dd/MM/yyyy')} - {format(new Date(vacation.endDate), 'dd/MM/yyyy')}
                    </p>
                    {vacation.notes && (
                      <p className="text-sm text-gray-500 mt-1">{vacation.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(vacation)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    aria-label="Modifier le congé"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(vacation.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    aria-label="Supprimer le congé"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)' // Safari support
        }} onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingVacation ? 'Modifier le congé' : 'Ajouter un congé'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="userId" className="form-label">
                  Employé <span className="text-red-500">*</span>
                </label>
                <select
                  id="userId"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="form-input"
                  required
                >
                  <option value="">Sélectionner un employé</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="type" className="form-label">
                  Type de congé <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Vacation['type'] })}
                  className="form-input"
                  required
                >
                  <option value="vacation">Vacances</option>
                  <option value="sick-leave">Maladie</option>
                  <option value="personal-leave">Congé personnel</option>
                  <option value="public-holiday">Jour férié</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="form-label">
                    Date de début <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="form-label">
                    Date de fin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="form-label">
                  Notes (optionnel)
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="form-input"
                  rows={3}
                  placeholder="Ajouter des notes sur ce congé..."
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingVacation(null);
                    resetForm();
                  }}
                  className="btn-secondary w-full sm:w-auto"
                  aria-label="Annuler et fermer le formulaire"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto"
                  aria-label={editingVacation ? 'Enregistrer les modifications du congé' : 'Ajouter le nouveau congé'}
                >
                  {editingVacation ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
