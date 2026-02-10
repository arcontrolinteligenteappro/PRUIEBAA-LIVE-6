
import React from 'react';
import { RemoteGuest, PodcastLayout } from '../types';
import { Mic, MicOff } from 'lucide-react';

interface PodcastLayoutEngineProps {
  layout: PodcastLayout;
  guests: RemoteGuest[];
  activeSpeakerId: string | null;
}

export const PodcastLayoutEngine: React.FC<PodcastLayoutEngineProps> = ({ layout, guests, activeSpeakerId }) => {
  const activeGuests = guests.filter(g => g.isOnStage);

  // RENDER: SOLO (Focus on one person, usually host or active speaker)
  if (layout === 'SOLO') {
      const focusGuest = activeGuests.find(g => g.id === activeSpeakerId) || activeGuests[0];
      if (!focusGuest) return <div className="flex items-center justify-center h-full text-gray-500">NO GUESTS ON STAGE</div>;
      
      return (
          <div className="w-full h-full relative bg-black">
              <img src={focusGuest.videoUrl} className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4 bg-black/70 px-4 py-2 rounded text-white font-bold text-xl">
                  {focusGuest.name}
              </div>
          </div>
      );
  }

  // RENDER: SPLIT (Two people side-by-side)
  if (layout === 'SPLIT') {
      return (
          <div className="w-full h-full flex bg-black">
              {activeGuests.slice(0, 2).map(guest => (
                  <div key={guest.id} className="flex-1 h-full relative border-r border-gray-900 last:border-0">
                      <img src={guest.videoUrl} className="w-full h-full object-cover" />
                      <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded text-white font-bold">
                          {guest.name}
                      </div>
                      {guest.mutedByHost && <div className="absolute top-4 right-4 bg-red-600 p-2 rounded-full"><MicOff size={16} color="white"/></div>}
                  </div>
              ))}
          </div>
      );
  }

  // RENDER: GRID (Dynamic grid for 3+)
  if (layout === 'GRID') {
      const count = activeGuests.length;
      let gridClass = 'grid-cols-2';
      if (count >= 5) gridClass = 'grid-cols-3';
      else if (count === 1) gridClass = 'grid-cols-1';

      return (
          <div className={`w-full h-full grid ${gridClass} gap-1 bg-black p-1`}>
              {activeGuests.map(guest => (
                  <div key={guest.id} className={`relative bg-gray-900 rounded overflow-hidden ${activeSpeakerId === guest.id ? 'ring-2 ring-green-500' : ''}`}>
                      <img src={guest.videoUrl} className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-white text-xs font-bold">
                          {guest.name}
                      </div>
                      {/* Audio Level Indicator */}
                      <div className="absolute bottom-2 right-2 h-3 w-1 bg-gray-600 rounded overflow-hidden">
                          <div className="bg-green-500 w-full absolute bottom-0 transition-all duration-100" style={{ height: `${guest.audioLevel * 100}%` }}></div>
                      </div>
                  </div>
              ))}
          </div>
      );
  }

  // RENDER: PIP (Picture in Picture)
  if (layout === 'PIP') {
      const mainGuest = activeGuests[0];
      const pipGuest = activeGuests[1];

      if (!mainGuest) return null;

      return (
          <div className="w-full h-full relative bg-black">
              {/* Full Screen Main */}
              <img src={mainGuest.videoUrl} className="w-full h-full object-cover" />
              
              {/* PiP Overlay */}
              {pipGuest && (
                  <div className="absolute bottom-8 right-8 w-1/4 aspect-video border-2 border-white shadow-2xl rounded overflow-hidden bg-black">
                      <img src={pipGuest.videoUrl} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 w-full bg-black/60 text-white text-[8px] font-bold px-2 py-0.5 text-center">
                          {pipGuest.name}
                      </div>
                  </div>
              )}
          </div>
      );
  }

  return null;
};
