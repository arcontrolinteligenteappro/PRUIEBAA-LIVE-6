
import React from 'react';
import { AudioEngineState, OperationMode, AudioDriverMode, USBSampleRate, LatencyMode } from '../types';
import { Settings, Mic, Speaker, Activity, ShieldCheck, AlertTriangle, Zap, Volume2, Usb, Cpu, Bluetooth, Monitor } from 'lucide-react';

interface AudioDeviceManagerProps {
  state: AudioEngineState;
  opMode: OperationMode;
  onUpdate: (newState: AudioEngineState) => void;
}

export const AudioDeviceManager: React.FC<AudioDeviceManagerProps> = ({ state, opMode, onUpdate }) => {
  const { activeDevice, driverMode, dsp, outputDevices } = state;

  const updateDSP = (key: string, val: any) => {
      onUpdate({ ...state, dsp: { ...state.dsp, [key]: val } });
  };

  const DriverBadge = ({ mode }: { mode: AudioDriverMode }) => {
      let color = 'bg-gray-700 text-gray-300';
      if (mode === 'DIRECT_USB_ACCESS') color = 'bg-purple-900/60 text-purple-300 border border-purple-600';
      if (mode === 'AAUDIO_PRO') color = 'bg-blue-900/60 text-blue-300 border border-blue-600';
      return <div className={`px-2 py-1 rounded text-[10px] font-bold ${color}`}>{mode.replace(/_/g, ' ')}</div>;
  };

  return (
    <div className="flex h-full bg-[#111] overflow-hidden font-sans">
        
        {/* LEFT: ENGINE CORE */}
        <div className="w-72 bg-[#151515] border-r border-gray-800 flex flex-col p-4 overflow-y-auto">
             <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Settings size={14}/> Audio Engine</h3>
             
             {/* Device Info */}
             <div className="bg-[#222] p-3 rounded border border-gray-700 mb-6">
                 <div className="flex justify-between items-start mb-2">
                     <span className="font-bold text-sm text-white">{activeDevice?.name || 'Internal Audio'}</span>
                     <Usb size={14} className="text-blue-400" />
                 </div>
                 <DriverBadge mode={driverMode} />
             </div>

             {/* Latency Mode Selector */}
             <div className="mb-6">
                 <label className="text-[10px] font-bold text-gray-500 mb-2 block">LATENCY PROFILE</label>
                 <div className="grid grid-cols-2 gap-2">
                     {['ULTRA_LOW', 'BALANCED', 'STABLE', 'SAFE'].map(mode => (
                         <button 
                            key={mode}
                            onClick={() => updateDSP('latencyMode', mode)}
                            className={`p-2 rounded text-[10px] font-bold border transition-all ${dsp.latencyMode === mode ? 'bg-green-900/40 text-green-300 border-green-600' : 'bg-[#222] text-gray-400 border-gray-700'}`}
                         >
                             {mode.replace('_', ' ')}
                         </button>
                     ))}
                 </div>
             </div>

             {/* Buffer Size & Sample Rate */}
             <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-bold text-gray-500 mb-1 block">SAMPLE RATE LOCK</label>
                    <div className="flex gap-1">
                        {[44100, 48000, 96000].map(r => (
                            <button key={r} onClick={() => onUpdate({...state, sampleRate: r as USBSampleRate})} className={`flex-1 py-1 rounded text-[10px] font-bold border ${state.sampleRate === r ? 'bg-blue-600 text-white border-blue-500' : 'bg-[#222] text-gray-400 border-gray-700'}`}>{r/1000}k</button>
                        ))}
                    </div>
                 </div>
                 <div className="bg-[#222] p-2 rounded border border-gray-700">
                    <label className="text-[10px] font-bold text-gray-500 mb-2 block flex justify-between">
                        <span>BUFFER SIZE</span>
                        <span className="text-blue-400">{state.bufferSizeFrames} spls</span>
                    </label>
                    <input 
                        type="range" min="64" max="1024" step="64" 
                        value={state.bufferSizeFrames} 
                        onChange={(e) => onUpdate({...state, bufferSizeFrames: parseInt(e.target.value)})} 
                        className="w-full accent-blue-500 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-[9px] text-right text-gray-500 font-mono mt-1">
                        Est. Latency: {(state.bufferSizeFrames / state.sampleRate * 1000).toFixed(1)}ms
                    </div>
                 </div>
             </div>
        </div>

        {/* CENTER: OUTPUT DEVICES */}
        <div className="flex-1 bg-[#0f0f0f] p-8 overflow-y-auto">
             <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Speaker size={14}/> Output Routing</h3>
             
             <div className="grid grid-cols-1 gap-3 max-w-2xl">
                 {outputDevices.map(dev => (
                     <div key={dev.id} className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 flex items-center gap-4">
                         <div className="p-3 bg-black rounded-full text-gray-400">
                             {dev.type === 'BLUETOOTH' && <Bluetooth size={20} />}
                             {dev.type === 'HEADPHONES' && <Settings size={20} />}
                             {dev.type === 'PHONE' && <Volume2 size={20} />}
                             {dev.type === 'HDMI' && <Monitor size={20} />}
                         </div>
                         <div className="flex-1">
                             <div className="flex items-center gap-2">
                                 <h4 className="font-bold text-white text-sm">{dev.name}</h4>
                                 {dev.latencyWarning && <span className="text-[9px] bg-yellow-900/50 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-700 flex items-center gap-1"><AlertTriangle size={8}/> LATENCY</span>}
                             </div>
                             <p className="text-[10px] text-gray-500 mt-0.5">{dev.type}</p>
                         </div>
                         <div className="flex gap-2">
                             <button className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-colors ${dev.isMasterOutput ? 'bg-red-600 text-white border-red-500' : 'bg-[#222] text-gray-400 border-gray-600'}`}>
                                 MASTER
                             </button>
                             <button className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-colors ${dev.isMonitorOnly ? 'bg-blue-600 text-white border-blue-500' : 'bg-[#222] text-gray-400 border-gray-600'}`}>
                                 MONITOR
                             </button>
                         </div>
                     </div>
                 ))}
             </div>
        </div>

        {/* RIGHT: DIAGNOSTICS */}
        <div className="w-64 bg-[#151515] border-l border-gray-800 p-4 flex flex-col">
             <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Activity size={14}/> Engine Stats</h3>
             
             <div className="space-y-4">
                 <div className="bg-[#222] p-3 rounded border border-gray-700">
                     <span className="text-[10px] text-gray-400">CPU LOAD</span>
                     <div className="w-full bg-black h-1.5 rounded-full mt-1 overflow-hidden">
                         <div className={`h-full ${state.cpuLoad > 80 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${state.cpuLoad}%` }}></div>
                     </div>
                     <span className="text-[9px] font-bold text-white">{state.cpuLoad}%</span>
                 </div>
                 
                 <div className="bg-[#222] p-3 rounded border border-gray-700">
                     <span className="text-[10px] text-gray-400">USB STATUS</span>
                     <div className="text-xs font-bold text-green-400 mt-1 flex items-center gap-1"><ShieldCheck size={12}/> BIT PERFECT</div>
                 </div>

                 <div className="mt-auto p-4 bg-blue-900/10 border border-blue-800 rounded-lg">
                     <h4 className="text-blue-400 font-bold text-xs mb-1">PRO TIP</h4>
                     <p className="text-[10px] text-blue-200 leading-relaxed">
                         Use "Direct USB Access" for lowest latency when using external interfaces like Scarlett or GoXLR.
                     </p>
                 </div>
             </div>
        </div>
    </div>
  );
};
