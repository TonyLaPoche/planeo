'use client';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-600">
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
