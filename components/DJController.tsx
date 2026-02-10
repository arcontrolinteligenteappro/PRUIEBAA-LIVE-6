
import React, { useState } from 'react';
import { DJState, DJDeckState, DJTrack } from '../types';
import { Disc, Play, Pause, RotateCw, Music, Sliders, Repeat, Folder, Search, Zap, Volume2, Mic, Activity } from 'lucide-react';

interface DJControllerProps {
  state: DJState;
  onUpdate: (newState: DJState) => void;
  onClose: () => void;
}

export const DJController: React.FC<DJControllerProps> = ({ state, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'DECK' | 'LIBRARY'>('DECK');

  const updateDeck = (deckId: 'A' | 'B', updates: Partial<DJDeckState>) => {
      if (deckId === 'A') onUpdate({ ...state, deckA: { ...state.deckA, ...updates } });
      else onUpdate({ ...state, deckB: { ...state.deckB, ...updates } });
  };

  const loadTrack = (track: DJTrack, deckId: 'A' | 'B') => {
      updateDeck(deckId, { track, isPlaying: false, pitch: 0 });
  };

  // --- SUB-COMPONENT: DECK ---
  const Deck = ({ deck, color }: { deck: DJDeckState, color: string }) => (
      <div className={`flex-1 bg-[#1a1a1a] rounded-xl border-2 ${color === 'blue' ? 'border-blue-900' : 'border-red-900'} flex flex-col overflow-hidden`}>
          {/* Header / Track Info */}
          <div className="p-4 bg-black/40 border-b border-gray-800 flex justify-between items-start">
              <div>
                  <h3 className="text-white font-black text-lg truncate max-w-[150px]">{deck.track?.title || 'No Track'}</h3>
                  <p className="text-xs text-gray-400">{deck.track?.artist || 'Load a track'}</p>
              </div>
              <div className="text-right">
                  <div className="font-mono text-xl font-bold text-white">
                      {deck.track ? Math.round(deck.track.bpm * (1 + deck.pitch/100)) : 0} <span className="text-[10px] text-gray-500">BPM</span>
                  </div>
                  <div className={`text-[10px] font-bold px-1 rounded ${deck.track ? 'bg-gray-700 text-white' : 'hidden'}`}>{deck.track?.key}</div>
              </div>
          </div>

          {/* Waveform / Platter */}
          <div className="flex-1 relative flex items-center justify-center bg-[#111]">
              <div className={`w-40 h-40 rounded-full border-8 ${color === 'blue' ? 'border-blue-600' : 'border-red-600'} flex items-center justify-center relative shadow-[0_0_30px_rgba(0,0,0,0.5)] ${deck.isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                  <div className="w-32 h-32 bg-black rounded-full overflow-hidden relative">
                      {deck.track && <img src={deck.track.coverUrl} className="w-full h-full object-cover opacity-60" />}
                      <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                  </div>
                  {/* Marker */}
                  <div className="absolute top-0 w-2 h-4 bg-white"></div>
              </div>
          </div>

          {/* Controls */}
          <div className="p-4 bg-[#222] border-t border-gray-800">
              <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={() => updateDeck(deck.id, { isPlaying: !deck.isPlaying })}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${deck.isPlaying ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-400'}`}
                  >
                      {deck.isPlaying ? <Pause size={32} fill="currentColor"/> : <Play size={32} fill="currentColor"/>}
                  </button>
                  
                  <div className="flex flex-col items-center gap-1">
                      <button className="w-12 h-12 bg-gray-800 rounded border border-gray-600 flex items-center justify-center text-white active:bg-gray-600">CUE</button>
                      <button onClick={() => updateDeck(deck.id, { isLooping: !deck.isLooping })} className={`w-12 h-8 rounded border border-gray-600 text-xs font-bold ${deck.isLooping ? 'bg-yellow-600 text-black' : 'bg-gray-800 text-gray-400'}`}>LOOP</button>
                  </div>

                  {/* Pitch Slider */}
                  <div className="h-32 w-10 bg-black rounded border border-gray-700 relative flex justify-center py-2">
                      <input 
                        type="range" min="-10" max="10" step="0.1" 
                        value={deck.pitch}
                        onChange={(e) => updateDeck(deck.id, { pitch: parseFloat(e.target.value) })}
                        className="h-full w-full opacity-0 cursor-pointer z-10 absolute top-0"
                        style={{ WebkitAppearance: 'slider-vertical' as any }}
                      />
                      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white"></div>
                      <div 
                        className="absolute w-8 h-4 bg-gray-400 rounded shadow border border-gray-600 pointer-events-none"
                        style={{ top: `calc(50% - ${(deck.pitch / 10) * 45}%)` }} // Simple visualization logic
                      ></div>
                  </div>
              </div>
          </div>
      </div>
  );

  return (
    <div className="fixed inset-0 bg-black/95 z-[60] flex flex-col animate-[slideUp_0.3s]">
        
        {/* TOP BAR */}
        <div className="h-14 border-b border-gray-800 bg-[#111] flex justify-between items-center px-6">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Disc size={24} className="text-purple-500 animate-spin-slow" />
                    <h2 className="text-xl font-black text-white italic tracking-tighter">AR DJ ENGINE</h2>
                </div>
                <div className="h-6 w-[1px] bg-gray-700"></div>
                <div className="flex gap-2">
                    <button onClick={() => onUpdate({...state, syncEnabled: !state.syncEnabled})} className={`px-3 py-1 rounded text-xs font-bold border ${state.syncEnabled ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>SYNC</button>
                    <button onClick={() => onUpdate({...state, automixEnabled: !state.automixEnabled})} className={`px-3 py-1 rounded text-xs font-bold border ${state.automixEnabled ? 'bg-green-600 text-white border-green-500' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>AUTOMIX</button>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Master</span>
                    <input 
                        type="range" min="0" max="100" value={state.masterVolume}
                        onChange={(e) => onUpdate({...state, masterVolume: parseInt(e.target.value)})}
                        className="w-24 accent-purple-500"
                    />
                </div>
                <button onClick={onClose} className="bg-gray-800 hover:bg-white hover:text-black px-4 py-2 rounded text-xs font-bold transition-colors">CLOSE</button>
            </div>
        </div>

        {/* DECKS AREA */}
        <div className="flex-1 flex gap-4 p-4 overflow-hidden relative">
            
            {/* DECK A */}
            <Deck deck={state.deckA} color="blue" />

            {/* MIXER CENTER */}
            <div className="w-48 bg-[#151515] rounded-xl border border-gray-800 flex flex-col p-4">
                {/* FX Unit */}
                <div className="mb-4 grid grid-cols-2 gap-2">
                    {['FILTER', 'ECHO', 'REVERB', 'FLANGER'].map(fx => (
                        <button key={fx} className="bg-[#222] border border-gray-700 text-[9px] font-bold text-gray-400 py-2 rounded hover:text-white hover:border-purple-500 transition-colors">
                            {fx}
                        </button>
                    ))}
                </div>

                {/* Library Toggle */}
                <button 
                    onClick={() => setActiveTab(activeTab === 'DECK' ? 'LIBRARY' : 'DECK')}
                    className={`w-full py-3 mb-4 rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors ${activeTab === 'LIBRARY' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
                >
                    <Folder size={14}/> LIBRARY
                </button>

                {/* Crossfader */}
                <div className="mt-auto">
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                        <span>A</span>
                        <span>B</span>
                    </div>
                    <input 
                        type="range" min="-1" max="1" step="0.01" 
                        value={state.crossfader}
                        onChange={(e) => onUpdate({...state, crossfader: parseFloat(e.target.value)})}
                        className="w-full h-8 bg-black rounded appearance-none cursor-pointer border border-gray-700"
                    />
                </div>
            </div>

            {/* DECK B */}
            <Deck deck={state.deckB} color="red" />

            {/* LIBRARY OVERLAY */}
            {activeTab === 'LIBRARY' && (
                <div className="absolute inset-0 bg-[#0d0d0d]/95 z-20 flex flex-col p-8 animate-[fadeIn_0.2s]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-white">TRACK BROWSER</h2>
                        <div className="flex gap-2">
                            <input className="bg-[#222] border border-gray-700 rounded px-4 py-2 text-white text-sm w-64" placeholder="Search tracks..." />
                            <button onClick={() => setActiveTab('DECK')} className="bg-gray-800 px-4 py-2 rounded text-white text-xs font-bold">CLOSE</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 overflow-y-auto">
                        {state.library.map(track => (
                            <div key={track.id} className="flex items-center gap-4 bg-[#1a1a1a] p-3 rounded border border-gray-800 hover:border-gray-600 transition-colors">
                                <img src={track.coverUrl} className="w-12 h-12 rounded" />
                                <div className="flex-1">
                                    <div className="font-bold text-white">{track.title}</div>
                                    <div className="text-xs text-gray-500">{track.artist}</div>
                                </div>
                                <div className="font-mono text-sm text-gray-400">{track.bpm} BPM</div>
                                <div className="font-mono text-sm text-gray-400 bg-[#222] px-2 py-1 rounded">{track.key}</div>
                                <div className="flex gap-2">
                                    <button onClick={() => { loadTrack(track, 'A'); setActiveTab('DECK'); }} className="bg-blue-900/50 text-blue-300 border border-blue-700 px-3 py-1 rounded text-xs font-bold hover:bg-blue-900">LOAD A</button>
                                    <button onClick={() => { loadTrack(track, 'B'); setActiveTab('DECK'); }} className="bg-red-900/50 text-red-300 border border-red-700 px-3 py-1 rounded text-xs font-bold hover:bg-red-900">LOAD B</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* BOTTOM: INTEGRATION CONTROLS */}
        <div className="h-16 bg-[#111] border-t border-gray-800 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
                <div className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <Activity size={14} /> Stream Integration
                </div>
                <button 
                    onClick={() => onUpdate({...state, duckingEnabled: !state.duckingEnabled})}
                    className={`px-3 py-1 rounded text-[10px] font-bold border flex items-center gap-2 transition-colors ${state.duckingEnabled ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' : 'bg-gray-800 text-gray-500 border-gray-700'}`}
                >
                    <Mic size={12} /> AUTO DUCKING
                </button>
            </div>
            <div className="text-xs text-gray-500 font-mono">
                DJ MASTER OUTPUT -> CH 5 (MUSIC)
            </div>
        </div>
    </div>
  );
};
