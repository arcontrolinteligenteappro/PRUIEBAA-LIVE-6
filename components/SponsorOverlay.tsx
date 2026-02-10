
import React from 'react';
import { Sponsor } from '../types';
import { QrCode } from 'lucide-react';

interface SponsorOverlayProps {
  sponsors: Sponsor[];
}

export const SponsorOverlay: React.FC<SponsorOverlayProps> = ({ sponsors }) => {
  const activeSponsors = sponsors.filter(s => s.isActive);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {activeSponsors.map(sponsor => {
        
        // --- TYPE: LOGO CORNER (Watermark) ---
        if (sponsor.type === 'LOGO_CORNER') {
            return (
                <div key={sponsor.id} className="absolute top-8 right-8 animate-[fadeIn_0.5s]">
                    <div className="bg-white/90 p-2 rounded-lg shadow-xl border border-white/50 backdrop-blur-sm">
                        <img src={sponsor.logoUrl} className="w-16 h-16 object-contain" alt={sponsor.name} />
                    </div>
                </div>
            );
        }

        // --- TYPE: BANNER BOTTOM (Lower Third Ad) ---
        if (sponsor.type === 'BANNER_BOTTOM') {
            return (
                <div key={sponsor.id} className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl animate-[slideUp_0.5s]">
                    <div className="bg-[#111]/95 border-t-4 border-yellow-500 rounded-lg shadow-2xl overflow-hidden flex h-24">
                        <div className="w-32 bg-white flex items-center justify-center p-2">
                            <img src={sponsor.logoUrl} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-center">
                            <div className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-1">Presented By</div>
                            <div className="text-white font-black text-2xl italic tracking-tight">{sponsor.data?.text || sponsor.name}</div>
                            {sponsor.data?.subtext && <div className="text-gray-400 text-sm">{sponsor.data.subtext}</div>}
                        </div>
                        <div className="w-4 bg-yellow-500/20 skew-x-[-15deg] mr-2"></div>
                        <div className="w-2 bg-yellow-500/20 skew-x-[-15deg] mr-4"></div>
                    </div>
                </div>
            );
        }

        // --- TYPE: FULLSCREEN (Slate) ---
        if (sponsor.type === 'FULLSCREEN') {
            return (
                <div key={sponsor.id} className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black z-50 flex flex-col items-center justify-center animate-[fadeIn_0.3s]">
                    <div className="text-white text-xl font-bold uppercase tracking-[0.5em] mb-8 opacity-70">Commercial Break</div>
                    <div className="bg-white p-12 rounded-3xl shadow-[0_0_100px_rgba(255,255,255,0.2)]">
                        <img src={sponsor.logoUrl} className="w-64 h-64 object-contain" />
                    </div>
                    <div className="mt-8 text-center">
                        <h1 className="text-5xl font-black text-white">{sponsor.name}</h1>
                        <p className="text-blue-300 mt-2 text-xl">{sponsor.data?.text || 'Official Partner'}</p>
                    </div>
                </div>
            );
        }

        // --- TYPE: TICKER (Scrolling Text) ---
        if (sponsor.type === 'TICKER') {
            return (
                <div key={sponsor.id} className="absolute bottom-0 w-full h-10 bg-blue-900/95 border-t border-blue-500 flex items-center z-40">
                    <div className="bg-blue-800 h-full px-4 flex items-center font-black text-white italic z-10 shadow-xl">
                        {sponsor.name}
                    </div>
                    <div className="overflow-hidden flex-1 relative h-full flex items-center">
                        <div className="whitespace-nowrap animate-[ticker_15s_linear_infinite] text-white font-mono text-sm font-bold flex gap-8">
                            <span>{sponsor.data?.text || 'BREAKING NEWS'}</span>
                            <span className="text-blue-400">•</span>
                            <span>{sponsor.data?.text || 'BREAKING NEWS'}</span>
                            <span className="text-blue-400">•</span>
                            <span>{sponsor.data?.text || 'BREAKING NEWS'}</span>
                        </div>
                    </div>
                </div>
            );
        }

        // --- TYPE: QR CODE (Call to Action) ---
        if (sponsor.type === 'QR') {
            return (
                <div key={sponsor.id} className="absolute top-20 left-8 animate-[slideRight_0.5s]">
                    <div className="bg-white p-3 rounded-xl shadow-2xl border-4 border-green-500">
                        <QrCode size={120} className="text-black"/>
                        <div className="text-center font-bold text-xs mt-2 text-black uppercase">Scan Now</div>
                    </div>
                </div>
            );
        }

        return null;
      })}
    </div>
  );
};
