'use client';

import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { settingsStorage } from '@/utils/storage';
import { ChevronDown, Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, languages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languageOptions = [
    { code: 'fr', name: languages.fr, flag: '🇫🇷' },
    { code: 'en', name: languages.en, flag: '🇬🇧' },
    { code: 'de', name: languages.de, flag: '🇩🇪' },
    { code: 'it', name: languages.it, flag: '🇮🇹' },
  ];

  const currentLanguageOption = languageOptions.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = async (languageCode: string) => {
    // Récupérer les paramètres actuels
    const currentSettings = settingsStorage.get();
    if (!currentSettings) return;
    
    // Mettre à jour les paramètres avec la nouvelle langue
    const updatedSettings = { 
      ...currentSettings, 
      language: languageCode as 'fr' | 'en' | 'de' | 'it' 
    };
    
    // Sauvegarder dans le localStorage
    settingsStorage.save(updatedSettings);
    
    // Changer la langue dans le hook de traduction
    await changeLanguage(languageCode);
    
    setIsOpen(false);
    // Recharger la page pour appliquer la nouvelle langue
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        aria-label="Sélectionner la langue"
      >
        <Globe className="h-4 w-4" />
        <span className="text-lg">{currentLanguageOption?.flag}</span>
        <span className="hidden lg:inline">{currentLanguageOption?.name}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          {/* Overlay pour fermer le menu */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu déroulant */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  onClick={() => handleLanguageChange(option.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    currentLanguage === option.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{option.flag}</span>
                  <span>{option.name}</span>
                  {currentLanguage === option.code && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
