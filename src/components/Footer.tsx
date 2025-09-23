'use client';

import Link from 'next/link';
import { Coffee } from 'lucide-react';
import { PreFooterAd } from './AdPlacement';
import { useTranslation } from '@/hooks/useTranslation';

export function Footer() {
  const { t } = useTranslation();

  return (
    <>
      {/* Publicité avant footer */}
      <PreFooterAd />
      
      {/* Footer principal */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4 text-sm text-gray-600">
            {/* Liens principaux */}
            <div className="flex flex-wrap justify-center items-center gap-4">
              <Link
                href="/about"
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                aria-label={t('footer.aboutAriaLabel')}
              >
                {t('footer.about')}
              </Link>
              
              <Link
                href="/cgu"
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                aria-label={t('footer.cguAriaLabel')}
              >
                {t('footer.cgu')}
              </Link>
              
              <Link
                href="/privacy"
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                aria-label={t('footer.privacyAriaLabel')}
              >
                {t('footer.privacy')}
              </Link>
              
              <Link
                href="/security"
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                aria-label={t('footer.securityAriaLabel')}
              >
                {t('footer.security')}
              </Link>
            </div>

            {/* Buy Me a Coffee */}
            <div className="flex items-center space-x-4">
              <a
                href="https://buymeacoffee.com/terradeanty"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full border border-amber-200 hover:border-amber-300 transition-all duration-200 group"
                aria-label={t('footer.supportAriaLabel')}
              >
                <Coffee className="h-4 w-4 text-amber-600 group-hover:text-amber-700" />
                <span className="text-amber-700 hover:text-amber-800 font-medium">{t('footer.support')}</span>
              </a>
            </div>

            {/* Copyright */}
            <p className="text-center">
              {t('footer.copyright')}{' '}
              <a
                href="https://antoineterrade.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                aria-label={t('footer.authorAriaLabel')}
              >
                {t('footer.author')}
              </a>
              . {t('footer.rights')}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
