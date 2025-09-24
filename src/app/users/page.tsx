'use client';

import { useState, useEffect } from 'react';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, User, Mail, Phone } from 'lucide-react';
import { userStorage, shiftStorage } from '@/utils/storage';
import { User as UserType } from '@/types';
import { generateUserColor } from '@/utils/time';
import { Footer } from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import SEOHead from '@/components/SEOHead';

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const { t: tRaw } = useTranslation();
  
  // Helper function to ensure we get a string from translation
  const t = (key: string, params?: Record<string, string | number>): string => {
    const result = tRaw(key, params);
    return typeof result === 'string' ? result : key;
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'employee' as 'employee' | 'manager',
    weeklyHoursQuota: 35,
    contractType: 'full-time' as UserType['contractType'],
    workingDays: [1, 2, 3, 4, 5, 6] as number[] // Lundi à Samedi par défaut
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(userStorage.getAll());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    const userData: UserType = {
      id: editingUser?.id || crypto.randomUUID(),
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      role: formData.role,
      color: editingUser?.color || generateUserColor(),
      weeklyHoursQuota: formData.weeklyHoursQuota,
      contractType: formData.contractType,
      workingDays: formData.workingDays,
      isActive: editingUser?.isActive ?? true,
      createdAt: editingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    userStorage.save(userData);
    loadUsers();
    closeModal();
  };

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email || '',
      phone: user.phone || '',
      role: user.role,
      weeklyHoursQuota: user.weeklyHoursQuota || 35,
      contractType: user.contractType || 'full-time',
      workingDays: user.workingDays || [1, 2, 3, 4, 5, 6],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (userId: string) => {
    if (confirm(t('users.deleteConfirm'))) {
      // Supprimer les shifts de l'utilisateur
      shiftStorage.deleteByUserId(userId);
      // Supprimer l'utilisateur
      userStorage.delete(userId);
      loadUsers();
    }
  };

  const openModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'employee',
      weeklyHoursQuota: 35,
      contractType: 'full-time',
      workingDays: [1, 2, 3, 4, 5, 6],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const getUserShiftsCount = (userId: string) => {
    return shiftStorage.getByUserId(userId).length;
  };

  return (
    <>
      <SEOHead page="users" />
      <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Mobile-First */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 p-2 -m-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{t('users.title')}</h1>
            </div>
            <button
              onClick={openModal}
              className="btn-primary text-sm sm:text-base"
              aria-label={t('users.addUser')}
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>{t('users.addUser')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Users Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 capitalize">{user.role}</p>
                  </div>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    aria-label={t('users.editUser')}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    aria-label={t('users.deleteUser')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {user.email && (
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>{getUserShiftsCount(user.id)} créneau{getUserShiftsCount(user.id) > 1 ? 'x' : ''}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

          {users.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <User className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">Aucun utilisateur</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 px-4">
                Commencez par ajouter votre premier employé.
              </p>
              <div className="mt-4 sm:mt-6">
                <button
                  onClick={openModal}
                  className="btn-primary text-sm"
                  aria-label={t('users.addUser')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Ajouter un utilisateur</span>
                  <span className="sm:hidden">Ajouter</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal Mobile-First */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center p-4 z-50" style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)' // Safari support
        }} onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {editingUser ? t('users.editUser') : t('users.addUser')}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 text-gray-400 hover:text-gray-600 sm:hidden"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div>
                <label htmlFor="name" className="form-label">
                  {t('users.name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder={t('users.name')}
                  required
                  autoFocus
                  aria-describedby="name-help"
                />
                <p id="name-help" className="sr-only">Champ obligatoire pour identifier l&apos;employé</p>
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  {t('users.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  placeholder="email@exemple.com"
                  aria-describedby="email-help"
                />
                <p id="email-help" className="sr-only">Adresse email de l&apos;employé (optionnel)</p>
              </div>

              <div>
                <label htmlFor="phone" className="form-label">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                  placeholder="06 12 34 56 78"
                  aria-describedby="phone-help"
                />
                <p id="phone-help" className="sr-only">Numéro de téléphone de l&apos;employé (optionnel)</p>
              </div>

              <div>
                <label htmlFor="role" className="form-label">
                  {t('users.role')}
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'employee' | 'manager' })}
                  className="form-input"
                  aria-describedby="role-help"
                >
                  <option value="employee">Employé</option>
                  <option value="manager">Manager</option>
                </select>
                <p id="role-help" className="sr-only">Sélectionnez le rôle de l&apos;employé dans l&apos;entreprise</p>
              </div>

              <div>
                <label htmlFor="contractType" className="form-label">
                  Type de contrat <span className="text-red-500">*</span>
                </label>
                <select
                  id="contractType"
                  value={formData.contractType}
                  onChange={(e) => setFormData({ ...formData, contractType: e.target.value as UserType['contractType'] })}
                  className="form-input"
                  required
                  aria-describedby="contract-help"
                >
                  <option value="full-time">Temps plein</option>
                  <option value="part-time">Temps partiel</option>
                  <option value="freelance">Freelance</option>
                </select>
                <p id="contract-help" className="sr-only">Sélectionnez le type de contrat de l&apos;employé</p>
              </div>

              <div>
                <label htmlFor="weeklyHours" className="form-label">
                  Quota hebdomadaire (heures) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="weeklyHours"
                  value={formData.weeklyHoursQuota}
                  onChange={(e) => setFormData({ ...formData, weeklyHoursQuota: parseFloat(e.target.value) || 35 })}
                  className="form-input"
                  min="1"
                  max="168"
                  step="0.5"
                  required
                  aria-describedby="hours-help"
                />
                <p id="hours-help" className="sr-only">Nombre d&apos;heures travaillées par semaine (ex: 35 pour un temps plein)</p>
              </div>

              <div>
                <label className="form-label">
                  Jours travaillés <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {[
                    { value: 1, label: 'Lun' },
                    { value: 2, label: 'Mar' },
                    { value: 3, label: 'Mer' },
                    { value: 4, label: 'Jeu' },
                    { value: 5, label: 'Ven' },
                    { value: 6, label: 'Sam' }
                  ].map((day) => (
                    <label key={day.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.workingDays.includes(day.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              workingDays: [...formData.workingDays, day.value].sort()
                            });
                          } else {
                            setFormData({
                              ...formData,
                              workingDays: formData.workingDays.filter(d => d !== day.value)
                            });
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{day.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Sélectionnez les jours où l&apos;employé travaille habituellement
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {formData.workingDays.length > 0 ? 
                    `${(formData.weeklyHoursQuota / formData.workingDays.length).toFixed(1)}h/jour en moyenne` :
                    'Sélectionnez au moins un jour'
                  }
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary w-full sm:w-auto"
                  aria-label={t('users.cancel')}
                >
                  {t('users.cancel')}
                </button>
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto"
                  aria-label={editingUser ? 'Enregistrer les modifications' : 'Ajouter le nouvel employé'}
                >
                  {editingUser ? t('users.editUser') : t('users.addUser')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
    </>
  );
}
