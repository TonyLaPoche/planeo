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
        return 'vertical'; // Format vertical pour sidebar
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
            minHeight: position === 'sidebar' ? '250px' : '90px',
            width: '100%'
          }}
        />
      </div>
    </div>
  );
}

// Composant pour sidebar fixe (visible sur toutes les pages desktop)
export function DesktopSidebar() {
  return (
    <aside className="hidden lg:block fixed right-4 top-1/2 transform -translate-y-1/2 w-64 z-30">
      <div className="space-y-6">
        {/* Publicité principale sidebar */}
        <AdPlacement 
          position="sidebar" 
          slot="SLOT_SIDEBAR_1" 
          className="shadow-lg"
        />
        
        {/* Deuxième publicité sidebar (optionnelle) */}
        <AdPlacement 
          position="sidebar" 
          slot="SLOT_SIDEBAR_2" 
          className="shadow-lg"
        />
      </div>
    </aside>
  );
}

// Composant pour publicité avant footer
export function PreFooterAd() {
  return (
    <section className="bg-white py-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdPlacement 
          position="footer" 
          slot="SLOT_FOOTER_1"
          className="shadow-sm"
        />
      </div>
    </section>
  );
}
