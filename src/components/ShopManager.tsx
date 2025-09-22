'use client';

import { useState } from 'react';
import { Store, Plus, Edit, Trash2, Users, Clock, Settings as SettingsIcon, Check, X } from 'lucide-react';
import { Shop, User } from '@/types';
import { shopStorage } from '@/utils/storage';

interface ShopManagerProps {
  shops: Shop[];
  users: User[];
  onShopsUpdate: () => void;
}

export function ShopManager({ shops, users, onShopsUpdate }: ShopManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'hours' | 'staff' | 'requirements'>('info');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    assignedEmployees: [] as string[],
    openingHours: {
      monday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
      tuesday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
      wednesday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
      thursday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
      friday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
      saturday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
      sunday: { isOpen: false, openTime: '10:00', closeTime: '19:00' },
    },
    staffRequirements: [
      {
        timeSlot: '09:00-18:00',
        minStaff: 1,
        optimalStaff: 3,
        requiredSkills: [] as string[],
        preferredSkills: [] as string[]
      }
    ],
    constraints: {
      maxSimultaneousBreaks: 1,
      minStaffDuringBreaks: 2,
      prioritySkills: ['manager'] as string[]
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      assignedEmployees: [],
      openingHours: {
        monday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
        tuesday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
        wednesday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
        thursday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
        friday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
        saturday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
        sunday: { isOpen: false, openTime: '10:00', closeTime: '19:00' },
      },
      staffRequirements: [
        {
          timeSlot: '09:00-18:00',
          minStaff: 1,
          optimalStaff: 3,
          requiredSkills: [],
          preferredSkills: []
        }
      ],
      constraints: {
        maxSimultaneousBreaks: 1,
        minStaffDuringBreaks: 2,
        prioritySkills: ['manager']
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    const shopData: Shop = {
      id: editingShop?.id || `shop-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      openingHours: formData.openingHours,
      assignedEmployees: formData.assignedEmployees,
      staffRequirements: formData.staffRequirements,
      constraints: formData.constraints,
      isActive: editingShop?.isActive ?? true,
      createdAt: editingShop?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    shopStorage.save(shopData);
    onShopsUpdate();
    closeModal();
  };

  const handleEdit = (shop: Shop) => {
    setEditingShop(shop);
    setFormData({
      name: shop.name,
      description: shop.description || '',
      assignedEmployees: shop.assignedEmployees,
      openingHours: {
        monday: shop.openingHours.monday || { isOpen: true, openTime: '10:00', closeTime: '19:00' },
        tuesday: shop.openingHours.tuesday || { isOpen: true, openTime: '10:00', closeTime: '19:00' },
        wednesday: shop.openingHours.wednesday || { isOpen: true, openTime: '10:00', closeTime: '19:00' },
        thursday: shop.openingHours.thursday || { isOpen: true, openTime: '10:00', closeTime: '19:00' },
        friday: shop.openingHours.friday || { isOpen: true, openTime: '10:00', closeTime: '19:00' },
        saturday: shop.openingHours.saturday || { isOpen: true, openTime: '10:00', closeTime: '19:00' },
        sunday: shop.openingHours.sunday || { isOpen: false, openTime: '10:00', closeTime: '19:00' },
      },
      staffRequirements: shop.staffRequirements.map(req => ({
        ...req,
        requiredSkills: req.requiredSkills || [],
        preferredSkills: req.preferredSkills || []
      })),
      constraints: shop.constraints
    });
    setIsModalOpen(true);
  };

  const handleDelete = (shopId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce magasin ?')) {
      shopStorage.delete(shopId);
      onShopsUpdate();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingShop(null);
    resetForm();
    setActiveTab('info');
  };

  const updateOpeningHours = (day: string, field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      openingHours: {
        ...formData.openingHours,
        [day]: {
          ...formData.openingHours[day as keyof typeof formData.openingHours],
          [field]: value
        }
      }
    });
  };

  const toggleEmployeeAssignment = (userId: string) => {
    const isAssigned = formData.assignedEmployees.includes(userId);
    if (isAssigned) {
      setFormData({
        ...formData,
        assignedEmployees: formData.assignedEmployees.filter(id => id !== userId)
      });
    } else {
      setFormData({
        ...formData,
        assignedEmployees: [...formData.assignedEmployees, userId]
      });
    }
  };

  const updateStaffRequirement = (index: number, field: string, value: unknown) => {
    const updatedRequirements = [...formData.staffRequirements];
    updatedRequirements[index] = {
      ...updatedRequirements[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      staffRequirements: updatedRequirements
    });
  };

  const dayNames = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche'
  };

  const tabs = [
    { id: 'info' as const, label: 'Informations', icon: Store },
    { id: 'hours' as const, label: 'Horaires', icon: Clock },
    { id: 'staff' as const, label: 'Équipe', icon: Users },
    { id: 'requirements' as const, label: 'Besoins', icon: SettingsIcon }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Store className="h-5 w-5 mr-2 text-blue-600" />
              Gestion des Magasins
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Créez et gérez vos magasins avec leurs équipes et horaires.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingShop(null);
              resetForm();
              setIsModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau magasin
          </button>
        </div>
      </div>

      <div className="p-6">
        {shops.length === 0 ? (
          <div className="text-center py-8">
            <Store className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun magasin</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par créer votre premier magasin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => {
              const assignedUsers = users.filter(u => shop.assignedEmployees.includes(u.id));
              return (
                <div key={shop.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <Store className="h-4 w-4 mr-2 text-blue-600" />
                      {shop.name}
                    </h4>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(shop)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(shop.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {shop.description && (
                    <p className="text-sm text-gray-600 mb-3">{shop.description}</p>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{assignedUsers.length} employé(s)</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {Object.values(shop.openingHours).filter(h => h.isOpen).length} jour(s) d&apos;ouverture
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      <span>{shop.staffRequirements[0]?.optimalStaff || 0} employé(s) optimal</span>
                    </div>
                  </div>

                  {assignedUsers.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Équipe assignée :</p>
                      <div className="flex flex-wrap gap-1">
                        {assignedUsers.slice(0, 3).map(user => (
                          <span key={user.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {user.name}
                          </span>
                        ))}
                        {assignedUsers.length > 3 && (
                          <span className="text-xs text-gray-500">+{assignedUsers.length - 3} autres</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal avec scroll corrigé */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header fixe */}
            <div className="px-6 py-4 border-b flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingShop ? `Modifier ${editingShop.name}` : 'Nouveau magasin'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation par onglets fixe */}
            <div className="px-6 pt-4 flex-shrink-0">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              {/* Contenu scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Onglet Informations */}
                {activeTab === 'info' && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="shopName" className="form-label">
                        Nom du magasin <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="shopName"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="form-input"
                        placeholder="Mon Super Magasin"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="shopDescription" className="form-label">
                        Description
                      </label>
                      <textarea
                        id="shopDescription"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="form-input"
                        rows={3}
                        placeholder="Description du magasin..."
                      />
                    </div>
                  </div>
                )}

                {/* Onglet Horaires */}
                {activeTab === 'hours' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Horaires d&apos;ouverture</h4>
                    {Object.entries(dayNames).map(([day, label]) => {
                      const dayConfig = formData.openingHours[day as keyof typeof formData.openingHours];
                      return (
                        <div key={day} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-24">
                            <label className="text-sm font-medium text-gray-700">{label}</label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={dayConfig.isOpen}
                              onChange={(e) => updateOpeningHours(day, 'isOpen', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">Ouvert</span>
                          </div>

                          {dayConfig.isOpen && (
                            <>
                              <div className="flex items-center space-x-2">
                                <label className="text-sm text-gray-600">De :</label>
                                <input
                                  type="time"
                                  value={dayConfig.openTime}
                                  onChange={(e) => updateOpeningHours(day, 'openTime', e.target.value)}
                                  className="form-input w-24"
                                />
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <label className="text-sm text-gray-600">À :</label>
                                <input
                                  type="time"
                                  value={dayConfig.closeTime}
                                  onChange={(e) => updateOpeningHours(day, 'closeTime', e.target.value)}
                                  className="form-input w-24"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Onglet Équipe */}
                {activeTab === 'staff' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Assigner les employés</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {users.map(user => {
                        const isAssigned = formData.assignedEmployees.includes(user.id);
                        return (
                          <div 
                            key={user.id} 
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              isAssigned 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => toggleEmployeeAssignment(user.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  isAssigned 
                                    ? 'border-blue-500 bg-blue-500' 
                                    : 'border-gray-300'
                                }`}>
                                  {isAssigned && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{user.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {user.role === 'manager' ? 'Manager' : 'Employé'} • {user.weeklyHoursQuota}h/semaine
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {formData.assignedEmployees.length === 0 && (
                      <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                        ⚠️ Aucun employé assigné. Sélectionnez au moins un employé pour ce magasin.
                      </p>
                    )}
                  </div>
                )}

                {/* Onglet Besoins */}
                {activeTab === 'requirements' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Besoins en personnel</h4>
                      {formData.staffRequirements.map((req, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="form-label">Horaire</label>
                              <input
                                type="text"
                                value={req.timeSlot}
                                onChange={(e) => updateStaffRequirement(index, 'timeSlot', e.target.value)}
                                placeholder="09:00-17:00"
                                className="form-input"
                              />
                            </div>

                            <div>
                              <label className="form-label">Personnel minimum</label>
                              <input
                                type="number"
                                min="1"
                                value={req.minStaff}
                                onChange={(e) => updateStaffRequirement(index, 'minStaff', parseInt(e.target.value))}
                                className="form-input"
                              />
                            </div>

                            <div>
                              <label className="form-label">Personnel optimal</label>
                              <input
                                type="number"
                                min="1"
                                value={req.optimalStaff}
                                onChange={(e) => updateStaffRequirement(index, 'optimalStaff', parseInt(e.target.value))}
                                className="form-input"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Contraintes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="form-label">Max pauses simultanées</label>
                          <input
                            type="number"
                            min="1"
                            value={formData.constraints.maxSimultaneousBreaks}
                            onChange={(e) => setFormData({
                              ...formData,
                              constraints: {
                                ...formData.constraints,
                                maxSimultaneousBreaks: parseInt(e.target.value)
                              }
                            })}
                            className="form-input"
                          />
                        </div>

                        <div>
                          <label className="form-label">Staff min pendant pauses</label>
                          <input
                            type="number"
                            min="1"
                            value={formData.constraints.minStaffDuringBreaks}
                            onChange={(e) => setFormData({
                              ...formData,
                              constraints: {
                                ...formData.constraints,
                                minStaffDuringBreaks: parseInt(e.target.value)
                              }
                            })}
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer fixe */}
              <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!formData.name.trim() || formData.assignedEmployees.length === 0}
                >
                  {editingShop ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
