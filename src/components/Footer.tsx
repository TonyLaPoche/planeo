'use client';

import Link from 'next/link';
import { Coffee } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
          <Link
            href="/about"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
            aria-label="À propos de Planéo"
          >
            À propos
          </Link>

          {/* Buy Me a Coffee */}
          <a
            href="https://buymeacoffee.com/terradeanty"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full border border-amber-200 hover:border-amber-300 transition-all duration-200 group"
            aria-label="Soutenir le développement sur Buy Me a Coffee"
          >
            <Coffee className="h-4 w-4 text-amber-600 group-hover:text-amber-700" />
            <span className="text-amber-700 hover:text-amber-800 font-medium">Soutenir</span>
          </a>

          <p>
            ©2025{' '}
            <a
              href="https://antoineterrade.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
              aria-label="Visiter le site web d'Antoine Terrade"
            >
              Antoine Terrade
            </a>
            . Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
