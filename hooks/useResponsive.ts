
import { useState, useEffect } from 'react';

export type LayoutMode = 'MOBILE_PORTRAIT' | 'MOBILE_LANDSCAPE' | 'TABLET_PORTRAIT' | 'TABLET_LANDSCAPE';

export const useResponsive = () => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('MOBILE_PORTRAIT');
  const [isMobile, setIsMobile] = useState(true);
  const [isPortrait, setIsPortrait] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const portrait = height > width;
      const mobile = width < 768; // Standard breakpoint for tablet

      setIsMobile(mobile);
      setIsPortrait(portrait);

      if (mobile) {
        setLayoutMode(portrait ? 'MOBILE_PORTRAIT' : 'MOBILE_LANDSCAPE');
      } else {
        setLayoutMode(portrait ? 'TABLET_PORTRAIT' : 'TABLET_LANDSCAPE');
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { layoutMode, isMobile, isPortrait };
};
