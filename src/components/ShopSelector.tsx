'use client';

import { useState, useEffect } from 'react';
import { Store, ChevronDown, Check, Users, Clock } from 'lucide-react';
import { Shop, User } from '@/types';

interface ShopSelectorProps {
  shops: Shop[];
  users: User[];
  selectedShopId: string | null;
  onShopSelect: (shopId: string) => void;
  className?: string;
}

export function ShopSelector({ shops, users, selectedShopId, onShopSelect, className = '' }: ShopSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedShop = shops.find(shop => shop.id === selectedShopId);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.shop-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getShopStats = (shop: Shop) => {
    const assignedUsers = users.filter(u => shop.assignedEmployees.includes(u.id));
    const openDays = Object.values(shop.openingHours).filter(h => h.isOpen).length;
    
    return {
      employeeCount: assignedUsers.length,
      openDays,
      optimalStaff: shop.staffRequirements[0]?.optimalStaff || 0
    };
  };

  if (shops.length === 0) {
    return (
      <div className={`flex items-center px-3 py-2 bg-gray-100 rounded-lg text-gray-500 ${className}`}>
        <Store className="h-4 w-4 mr-2" />
        <span className="text-sm">Aucun magasin configuré</span>
      </div>
    );
  }

  return (
    <div className={`shop-selector relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <div className="flex items-center min-w-0 flex-1">
          <Store className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
          {selectedShop ? (
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 truncate">{selectedShop.name}</span>
                <div className="flex items-center space-x-3 text-xs text-gray-500 ml-3">
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {getShopStats(selectedShop).employeeCount}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {getShopStats(selectedShop).openDays}j
                  </span>
                </div>
              </div>
              {selectedShop.description && (
                <p className="text-sm text-gray-500 truncate mt-1">{selectedShop.description}</p>
              )}
            </div>
          ) : (
            <span className="text-gray-500">Sélectionnez un magasin...</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {shops.filter(shop => shop.isActive).map((shop) => {
            const stats = getShopStats(shop);
            const isSelected = shop.id === selectedShopId;
            
            return (
              <button
                key={shop.id}
                onClick={() => {
                  onShopSelect(shop.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                  isSelected ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <Store className={`h-4 w-4 mr-3 flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium truncate ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                          {shop.name}
                        </span>
                        {isSelected && (
                          <Check className="h-4 w-4 text-blue-600 ml-2 flex-shrink-0" />
                        )}
                      </div>
                      
                      {shop.description && (
                        <p className="text-sm text-gray-500 truncate mt-1">{shop.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {stats.employeeCount} employé(s)
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {stats.openDays} jour(s) d&apos;ouverture
                        </span>
                        <span className="text-gray-400">
                          {stats.optimalStaff} staff optimal
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
          
          {shops.filter(shop => shop.isActive).length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500">
              <Store className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm">Aucun magasin actif</p>
              <p className="text-xs text-gray-400 mt-1">Créez un magasin dans la gestion avancée</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Version compacte pour la barre d'outils
export function CompactShopSelector({ shops, selectedShopId, onShopSelect, className = '' }: Omit<ShopSelectorProps, 'users'>) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedShop = shops.find(shop => shop.id === selectedShopId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.compact-shop-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (shops.length === 0) return null;

  return (
    <div className={`compact-shop-selector relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <Store className="h-4 w-4 mr-2 text-gray-500" />
        <span className="truncate max-w-32">
          {selectedShop ? selectedShop.name : 'Magasin'}
        </span>
        <ChevronDown className={`h-4 w-4 ml-2 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-48">
          {shops.filter(shop => shop.isActive).map((shop) => (
            <button
              key={shop.id}
              onClick={() => {
                onShopSelect(shop.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                shop.id === selectedShopId ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
              }`}
            >
              <div className="flex items-center">
                <Store className={`h-4 w-4 mr-2 ${shop.id === selectedShopId ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="truncate">{shop.name}</span>
                {shop.id === selectedShopId && (
                  <Check className="h-4 w-4 ml-auto text-blue-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
