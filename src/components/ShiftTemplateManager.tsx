'use client';

import { useState, useEffect } from 'react';
import { Clock, Plus, Edit, Trash2, User } from 'lucide-react';
import { ShiftTemplate, User as UserType, AppSettings } from '@/types';
import { dataExport } from '@/utils/storage';
import { createDefaultTemplate } from '@/utils/planningUtils';

interface ShiftTemplateManagerProps {
  users: UserType[];
  settings: AppSettings;
}

export function ShiftTemplateManager({ users, settings }: ShiftTemplateManagerProps) {
  const [templates, setTemplates] = useState<ShiftTemplate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ShiftTemplate | null>(null);
  const [formData, setFormData] = useState({
    userId: '',
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 60,
  });

  useEffect(() => {
    setTemplates(dataExport.getShiftTemplates());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const template: ShiftTemplate = {
      userId: formData.userId,
      dayOfWeek: formData.dayOfWeek,
      startTime: formData.startTime,
      endTime: formData.endTime,
      breakDuration: formData.breakDuration,
    };

    dataExport.saveShiftTemplate(template);
    setTemplates(dataExport.getShiftTemplates());
    setIsModalOpen(false);
    setEditingTemplate(null);
    resetForm();
  };

  const handleEdit = (template: ShiftTemplate) => {
    setEditingTemplate(template);
    setFormData({
      userId: template.userId,
      dayOfWeek: template.dayOfWeek,
      startTime: template.startTime,
      endTime: template.endTime,
      breakDuration: template.breakDuration,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (userId: string, dayOfWeek: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      dataExport.deleteShiftTemplate(userId, dayOfWeek);
      setTemplates(dataExport.getShiftTemplates());
    }
  };

  const handleCreateDefault = (userId: string) => {
    const defaultTemplate = createDefaultTemplate(userId, settings);
    setFormData({
      userId: defaultTemplate.userId,
      dayOfWeek: defaultTemplate.dayOfWeek,
      startTime: defaultTemplate.startTime,
      endTime: defaultTemplate.endTime,
      breakDuration: defaultTemplate.breakDuration,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00',
      breakDuration: 60,
    });
  };


  const getDayName = (dayOfWeek: number) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[dayOfWeek];
  };

  const getUserTemplates = (userId: string) => {
    return templates.filter(template => template.userId === userId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Templates de créneaux</h3>
        <button
          onClick={() => {
            setEditingTemplate(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="btn-primary text-sm"
          aria-label="Ajouter un nouveau template"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau template
        </button>
      </div>

      <div className="p-6">
        {templates.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun template</h3>
            <p className="mt-1 text-sm text-gray-500">
              Créez des templates pour générer automatiquement les créneaux horaires.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {users.map((user) => {
              const userTemplates = getUserTemplates(user.id);
              if (userTemplates.length === 0) return null;

              return (
                <div key={user.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      {user.name}
                    </h4>
                    <button
                      onClick={() => handleCreateDefault(user.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Ajouter un template
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userTemplates.map((template) => (
                      <div key={`${template.userId}-${template.dayOfWeek}`} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            {getDayName(template.dayOfWeek)}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(template)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                              aria-label="Modifier le template"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(template.userId, template.dayOfWeek)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                              aria-label="Supprimer le template"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Horaire : {template.startTime} - {template.endTime}</p>
                          <p>Pause : {template.breakDuration} minutes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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
                {editingTemplate ? 'Modifier le template' : 'Nouveau template'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="templateUserId" className="form-label">
                  Employé <span className="text-red-500">*</span>
                </label>
                <select
                  id="templateUserId"
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
                <label htmlFor="dayOfWeek" className="form-label">
                  Jour de la semaine <span className="text-red-500">*</span>
                </label>
                <select
                  id="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                  className="form-input"
                  required
                >
                  <option value={0}>Dimanche</option>
                  <option value={1}>Lundi</option>
                  <option value={2}>Mardi</option>
                  <option value={3}>Mercredi</option>
                  <option value={4}>Jeudi</option>
                  <option value={5}>Vendredi</option>
                  <option value={6}>Samedi</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="form-label">
                    Heure de début <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="form-label">
                    Heure de fin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="breakDuration" className="form-label">
                  Durée de la pause (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="breakDuration"
                  value={formData.breakDuration}
                  onChange={(e) => setFormData({ ...formData, breakDuration: parseInt(e.target.value) })}
                  className="form-input"
                  min="0"
                  max="480"
                  required
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTemplate(null);
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
                  aria-label={editingTemplate ? 'Enregistrer les modifications du template' : 'Créer le nouveau template'}
                >
                  {editingTemplate ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
