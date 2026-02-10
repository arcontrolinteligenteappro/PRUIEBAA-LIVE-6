
import React from 'react';
import { MasterAudioState } from '../types';
import { Volume2, Sliders, Activity, Headphones, Mic, Monitor } from 'lucide-react';

interface AudioMasterSectionProps {
  state: MasterAudioState;
  onUpdate: (newState: MasterAudioState) => void;
}

export const AudioMasterSection: React.FC<AudioMasterSectionProps> = ({ state, onUpdate }) => {
  
  const togglePro = () => onUpdate({ ...state, proModeEnabled: !state.proModeEnabled });

  // Helper for EQ sliders
  const EQSlider = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
      <div className="flex flex-col items-center h-full">
          <div className="relative w-8 flex-1 bg-[#222] rounded-full border border-gray-700 overflow-hidden">
              <input 
                  type="range" min="-12" max="12" value={value} 
                  onChange={(e) => onChange(parseInt(e.target.value))}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                  style={{ WebkitAppearance: 'slider-vertical' as any }}
              />
              {/* Fill */}
              <div 
                  className="absolute w-full bg-blue-500 rounded-b-full transition-all"
                  style={{ 
                      height: `${Math.abs(value)/12 * 50}%`,
                      bottom: value < 0 ? '50%' : undefined,
                      top: value > 0 ? 'auto' : '50%',
                      marginTop: value > 0 ? `-${Math.abs(value)/12 * 50}%` : 0
                  }}
              ></div>
              <div className="absolute top-1/2 w-full h-[1px] bg-gray-500"></div>
          </div>
          <span className="text-[9px] font-bold text-gray-400 mt-2">{label}</span>
      </div>
  );

  return (
    <div className={`flex flex-col border-l border-gray-800 bg-[#151515] transition-all duration-300 ${state.proModeEnabled ? 'w-80' : 'w-24'}`}>
        
        {/* HEADER */}
        <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-[#1a1a1a]">
            <h3 className="text-xs font-bold text-gray-400 uppercase">MASTER OUT</h3>
            <button 
                onClick={togglePro}
                className={`text-[9px] font-black px-2 py-1 rounded border transition-colors ${state.proModeEnabled ? 'bg-purple-900 text-purple-200 border-purple-600 shadow-[0_0_10px_purple]' : 'bg-gray-800 text-gray-500 border-gray-600'}`}
            >
                PRO
            </button>
        </div>

        {/* BASIC VIEW */}
        <div className="flex-1 p-4 flex flex-col items-center">
            {/* Master Fader */}
            <div className="relative w-12 flex-1 bg-black rounded-lg border border-gray-700 shadow-inner flex justify-center py-4 mb-4">
                <input 
                    type="range" min="0" max="100" value={state.masterVolume}
                    onChange={(e) => onUpdate({...state, masterVolume: parseInt(e.target.value)})}
                    className="h-full w-full opacity-0 cursor-pointer z-20 absolute top-0 left-0"
                    style={{ WebkitAppearance: 'slider-vertical' as any }}
                />
                {/* Meter L/R */}
                <div className="flex gap-1 h-full items-end w-4">
                    <div className="w-1.5 bg-gray-800 rounded-full overflow-hidden h-full relative">
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all" style={{ height: `${state.masterVolume * 0.9}%` }}></div>
                    </div>
                    <div className="w-1.5 bg-gray-800 rounded-full overflow-hidden h-full relative">
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all" style={{ height: `${state.masterVolume * 0.85}%` }}></div>
                    </div>
                </div>
                {/* Handle */}
                <div 
                    className="absolute w-10 h-6 bg-gradient-to-b from-gray-600 to-gray-800 border-t border-gray-500 rounded shadow-xl flex items-center justify-center pointer-events-none z-10"
                    style={{ bottom: `calc(${state.masterVolume}% - 12px)` }}
                >
                    <div className="w-6 h-[2px] bg-white opacity-50"></div>
                </div>
            </div>
            
            <span className="text-xl font-black text-white font-mono mb-6">{state.masterVolume}%</span>

            {/* PRO PANEL CONTENT (Only if Expanded) */}
            {state.proModeEnabled && (
                <div className="w-full space-y-6 animate-[fadeIn_0.3s]">
                    
                    {/* Dynamics */}
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => onUpdate({...state, limiterEnabled: !state.limiterEnabled})}
                            className={`p-2 rounded text-[10px] font-bold border ${state.limiterEnabled ? 'bg-red-900/50 border-red-600 text-red-200' : 'bg-[#222] border-gray-700 text-gray-500'}`}
                        >
                            LIMITER
                        </button>
                        <button 
                            onClick={() => onUpdate({...state, compressorEnabled: !state.compressorEnabled})}
                            className={`p-2 rounded text-[10px] font-bold border ${state.compressorEnabled ? 'bg-yellow-900/50 border-yellow-600 text-yellow-200' : 'bg-[#222] border-gray-700 text-gray-500'}`}
                        >
                            COMPRESSOR
                        </button>
                    </div>

                    {/* Output EQ */}
                    <div className="bg-[#111] p-3 rounded border border-gray-800">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-gray-500">MASTER EQ</span>
                            <button onClick={() => onUpdate({...state, eqLow:0, eqLowMid:0, eqHighMid:0, eqHigh:0})} className="text-[9px] text-blue-400 hover:text-white">RESET</button>
                        </div>
                        <div className="flex justify-between h-32 gap-1">
                            <EQSlider label="LOW" value={state.eqLow} onChange={(v) => onUpdate({...state, eqLow: v})} />
                            <EQSlider label="LO-MID" value={state.eqLowMid} onChange={(v) => onUpdate({...state, eqLowMid: v})} />
                            <EQSlider label="HI-MID" value={state.eqHighMid} onChange={(v) => onUpdate({...state, eqHighMid: v})} />
                            <EQSlider label="HIGH" value={state.eqHigh} onChange={(v) => onUpdate({...state, eqHigh: v})} />
                        </div>
                    </div>

                    {/* Width / Balance */}
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-[9px] font-bold text-gray-500 mb-1">
                                <span>WIDTH</span>
                                <span>{state.stereoWidth}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="200" value={state.stereoWidth}
                                onChange={(e) => onUpdate({...state, stereoWidth: parseInt(e.target.value)})}
                                className="w-full accent-blue-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between text-[9px] font-bold text-gray-500 mb-1">
                                <span>BALANCE</span>
                                <span>{state.balance}</span>
                            </div>
                            <input 
                                type="range" min="-50" max="50" value={state.balance}
                                onChange={(e) => onUpdate({...state, balance: parseInt(e.target.value)})}
                                className="w-full accent-green-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Presets */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <button className="bg-[#222] hover:bg-gray-700 text-[9px] py-2 rounded text-gray-300 font-bold border border-gray-700 flex items-center justify-center gap-1"><Mic size={10}/> VOICE</button>
                        <button className="bg-[#222] hover:bg-gray-700 text-[9px] py-2 rounded text-gray-300 font-bold border border-gray-700 flex items-center justify-center gap-1"><Headphones size={10}/> MUSIC</button>
                        <button className="bg-[#222] hover:bg-gray-700 text-[9px] py-2 rounded text-gray-300 font-bold border border-gray-700 flex items-center justify-center gap-1"><Monitor size={10}/> GAME</button>
                    </div>

                </div>
            )}
        </div>
    </div>
  );
};
