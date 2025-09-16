'use client';

import { AdSenseAd } from './AdSenseWrapper';

interface AdPlacementProps {
  position: 'sidebar' | 'footer' | 'header' | 'content';
  slot: string;
  className?: string;
}

export function AdPlacement({ position, slot, className = '' }: AdPlacementProps) {
  const getPositionStyles = () => {
    switch (position) {
      case 'sidebar':
        return 'hidden lg:block w-full max-w-[300px] mx-auto';
      case 'footer':
        return 'w-full max-w-4xl mx-auto my-6';
      case 'header':
        return 'w-full max-w-6xl mx-auto';
      case 'content':
        return 'w-full max-w-2xl mx-auto my-4';
      default:
        return 'w-full';
    }
  };

  const getAdFormat = () => {
    switch (position) {
      case 'sidebar':
        return 'rectangle'; // Format rectangle pour sidebar
      case 'footer':
      case 'header':
        return 'horizontal'; // Format horizontal pour header/footer
      case 'content':
        return 'rectangle'; // Format carré pour contenu
      default:
        return 'auto';
    }
  };

  return (
    <div className={`${getPositionStyles()} ${className}`}>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Publicité</p>
        <AdSenseAd
          slot={slot}
          format={getAdFormat()}
          style={{
            minHeight: position === 'sidebar' ? (slot === '2754648392' ? '300px' : '250px') : '90px',
            width: position === 'sidebar' ? (slot === '2754648392' ? '250px' : '300px') : '100%',
            maxWidth: position === 'footer' ? '728px' : 'none'
          }}
          className="block"
        />
        <div className="mt-2 pt-2 border-t border-gray-300">
          <p className="text-xs text-gray-400 leading-relaxed">
            Planneo reste gratuit grâce aux publicités.{' '}
            <a 
              href="https://buymeacoffee.com/terradeanty" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700 underline transition-colors"
            >
              Soutenez-nous ☕
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Composant pour sidebar gauche fixe
export function LeftSidebar() {
  return (
    <aside className="hidden lg:block fixed left-4 top-1/2 transform -translate-y-1/2 w-64 z-30" style={{ width: '256px', minWidth: '256px' }}>
      <AdPlacement 
        position="sidebar" 
        slot="2754648392" 
        className="shadow-lg w-full"
      />
    </aside>
  );
}

// Composant pour sidebar droite fixe
export function RightSidebar() {
  return (
    <aside className="hidden lg:block fixed right-4 top-1/2 transform -translate-y-1/2 w-64 z-30" style={{ width: '256px', minWidth: '256px' }}>
      <AdPlacement 
        position="sidebar" 
        slot="9545124314" 
        className="shadow-lg w-full"
      />
    </aside>
  );
}

// Composant combiné pour les deux sidebars
export function DesktopSidebar() {
  return (
    <>
      <LeftSidebar />
      <RightSidebar />
    </>
  );
}

// Composant pour publicité avant footer
export function PreFooterAd() {
  return (
    <section className="bg-white py-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdPlacement 
          position="footer" 
          slot="7631624456"
          className="shadow-sm"
        />
      </div>
    </section>
  );
}
