
import React from 'react';
import { AudioReferenceState, HiFiSource } from '../types';
import { Play, Pause, SkipBack, SkipForward, Disc, Wifi, HardDrive, Usb, Music, Sliders, Volume2, Lock, ShieldCheck, Zap } from 'lucide-react';

interface AudioReferenceEngineProps {
  state: AudioReferenceState;
  onUpdate: (newState: AudioReferenceState) => void;
}

export const AudioReferenceEngine: React.FC<AudioReferenceEngineProps> = ({ state, onUpdate }) => {
  
  const { currentTrack, connectedDAC, playbackState, settings } = state;

  // Helpers
  const formatSampleRate = (hz: number) => {
      if (hz >= 1000000) return `${(hz / 1000000).toFixed(1)} MHz`;
      return `${hz / 1000} kHz`;
  };

  const getFormatColor = (fmt: string) => {
      if (fmt === 'MQA') return 'text-purple-400';
      if (fmt === 'DSD') return 'text-blue-400';
      if (fmt === 'FLAC') return 'text-yellow-400';
      return 'text-gray-400';
  };

  const togglePlayback = () => {
      onUpdate({
          ...state,
          playbackState: playbackState === 'PLAYING' ? 'PAUSED' : 'PLAYING'
      });
  };

  const changeSource = (src: HiFiSource) => {
      onUpdate({ ...state, currentSource: src });
  };

  return (
    <div className="flex h-full bg-[#111] overflow-hidden text-gray-200 font-sans">
        
        {/* LEFT: SOURCE SELECTOR & LIBRARY */}
        <div className="w-64 bg-[#151515] border-r border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Music size={14}/> Audio Reference Engine
                </h2>
                <div className="flex items-center gap-2 mt-2 bg-[#222] p-2 rounded border border-gray-700">
                    <div className={`w-2 h-2 rounded-full ${connectedDAC?.connectionStatus === 'CONNECTED' ? 'bg-green-500 shadow-[0_0_8px_lime]' : 'bg-red-500'}`}></div>
                    <span className="text-[10px] font-mono font-bold text-white truncate">{connectedDAC?.name || 'NO DAC DETECTED'}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                <NavButton 
                    label="TIDAL" 
                    icon={<GlobeIcon />} 
                    active={state.currentSource === 'TIDAL'} 
                    onClick={() => changeSource('TIDAL')} 
                    extra="MQA / FLAC"
                />
                <NavButton 
                    label="QOBUZ" 
                    icon={<Disc size={16} />} 
                    active={state.currentSource === 'QOBUZ'} 
                    onClick={() => changeSource('QOBUZ')} 
                    extra="Hi-Res"
                />
                <NavButton 
                    label="DLNA / UPnP" 
                    icon={<Wifi size={16} />} 
                    active={state.currentSource === 'DLNA'} 
                    onClick={() => changeSource('DLNA')} 
                />
                <NavButton 
                    label="LOCAL STORAGE" 
                    icon={<HardDrive size={16} />} 
                    active={state.currentSource === 'LOCAL'} 
                    onClick={() => changeSource('LOCAL')} 
                />
                <NavButton 
                    label="USB OTG" 
                    icon={<Usb size={16} />} 
                    active={state.currentSource === 'SMB'} 
                    onClick={() => changeSource('SMB')} 
                />
            </div>
            
            {/* System Status Footer */}
            <div className="p-4 bg-black border-t border-gray-800 text-[10px] text-gray-500 font-mono">
                <div className="flex justify-between"><span>DRIVER:</span> <span className="text-white">UAPP INTERNAL</span></div>
                <div className="flex justify-between"><span>LATENCY:</span> <span className="text-white">4ms</span></div>
                <div className="mt-2 flex items-center gap-1 text-green-500 font-bold border-t border-gray-800 pt-2">
                    <ShieldCheck size={10} /> BIT-PERFECT LOCK
                </div>
            </div>
        </div>

        {/* CENTER: PLAYER & VISUALIZATION */}
        <div className="flex-1 flex flex-col relative">
            
            {/* Top Info Bar */}
            <div className="h-12 bg-[#0a0a0a] border-b border-gray-800 flex justify-between items-center px-6">
                <div className="flex items-center gap-4">
                     <div className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${settings.bypassAndroidAudio ? 'bg-purple-900/40 border-purple-600 text-purple-300' : 'bg-gray-800 border-gray-600 text-gray-500'}`}>
                         <Usb size={10}/> DIRECT USB
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${settings.bitPerfectMode ? 'bg-green-900/40 border-green-600 text-green-300' : 'bg-gray-800 border-gray-600 text-gray-500'}`}>
                         <ShieldCheck size={10}/> BIT-PERFECT
                     </div>
                </div>
                <div className="text-xs font-mono text-gray-400 bg-[#151515] px-2 py-1 rounded border border-gray-700">
                    {formatSampleRate(currentTrack?.sampleRate || 0)} / {currentTrack?.bitDepth} bit
                </div>
            </div>

            {/* Main Stage */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#111] to-[#050505] relative overflow-hidden">
                
                {/* Simulated Spectrum Analyzer Background */}
                <div className="absolute bottom-0 left-0 right-0 h-64 flex items-end justify-between px-4 opacity-20 pointer-events-none gap-1">
                    {[...Array(32)].map((_, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-sm animate-pulse" style={{ height: `${Math.random() * 80 + 10}%`, animationDuration: `${Math.random() * 0.5 + 0.2}s` }}></div>
                    ))}
                </div>

                <div className="z-10 flex flex-col items-center">
                    {/* Album Art */}
                    <div className="w-64 h-64 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-gray-700 overflow-hidden relative group">
                        <img src={currentTrack?.coverUrl} className="w-full h-full object-cover" />
                        {currentTrack?.isMQAStudio && (
                            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-white border border-gray-600 flex items-center gap-1">
                                <span className="text-blue-400">MQA</span> STUDIO
                            </div>
                        )}
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                            <button className="p-2 hover:bg-white/20 rounded-full"><SkipBack fill="white" size={24}/></button>
                            <button onClick={togglePlayback} className="p-4 bg-white text-black rounded-full hover:scale-105 transition-transform">
                                {playbackState === 'PLAYING' ? <Pause fill="black" size={32}/> : <Play fill="black" size={32}/>}
                            </button>
                            <button className="p-2 hover:bg-white/20 rounded-full"><SkipForward fill="white" size={24}/></button>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="mt-8 text-center">
                        <h1 className="text-3xl font-bold text-white tracking-tight">{currentTrack?.title}</h1>
                        <h2 className="text-xl text-gray-400 mt-2">{currentTrack?.artist}</h2>
                        <h3 className="text-sm text-gray-600 mt-1 uppercase tracking-widest">{currentTrack?.album}</h3>
                    </div>

                    {/* Format Badge */}
                    <div className="mt-6 flex items-center gap-3">
                         <div className={`text-4xl font-black italic tracking-tighter ${getFormatColor(currentTrack?.format || '')}`}>
                             {currentTrack?.format}
                         </div>
                         <div className="h-8 w-[1px] bg-gray-700"></div>
                         <div className="text-left">
                             <div className="text-xs font-bold text-gray-300">{formatSampleRate(currentTrack?.sampleRate || 0)}</div>
                             <div className="text-[10px] text-gray-500">{currentTrack?.bitDepth} BIT</div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Transport Bar */}
            <div className="h-24 bg-[#151515] border-t border-gray-800 px-8 flex items-center gap-8">
                {/* Time */}
                <span className="font-mono text-xs text-gray-400">01:45</span>
                <div className="flex-1 h-1 bg-gray-800 rounded-full relative group cursor-pointer">
                    <div className="absolute top-0 left-0 h-full bg-blue-500 w-[30%]"></div>
                    <div className="absolute top-1/2 left-[30%] -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg"></div>
                </div>
                <span className="font-mono text-xs text-gray-400">04:32</span>
            </div>
        </div>

        {/* RIGHT: HARDWARE CONTROL */}
        <div className="w-72 bg-[#0f0f0f] border-l border-gray-800 flex flex-col p-6">
             <h3 className="text-xs font-bold text-gray-500 uppercase mb-6 flex items-center gap-2"><Sliders size={14}/> Hardware Control</h3>
             
             {/* Volume Knob Simulation */}
             <div className="flex flex-col items-center mb-8">
                 <div className="relative w-32 h-32 rounded-full border-4 border-gray-800 bg-gray-900 flex items-center justify-center shadow-inner">
                     <div 
                        className="absolute w-full h-full rounded-full border-4 border-blue-500 border-t-transparent border-l-transparent transition-all"
                        style={{ transform: `rotate(${(state.volume / 100) * 270 - 135}deg)` }}
                     ></div>
                     <span className="text-3xl font-bold text-white font-mono">{state.volume}</span>
                 </div>
                 <div className="mt-4 flex items-center gap-2 text-gray-400">
                     <Volume2 size={16} />
                     <span className="text-xs font-bold">HARDWARE VOL</span>
                 </div>
                 <input 
                    type="range" min="0" max="100" value={state.volume} 
                    onChange={(e) => onUpdate({...state, volume: parseInt(e.target.value)})}
                    className="w-full mt-4 accent-blue-500"
                 />
             </div>

             {/* Settings */}
             <div className="space-y-4">
                 <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-gray-400">Bit-Perfect Mode</span>
                     <Toggle 
                        active={settings.bitPerfectMode} 
                        onClick={() => onUpdate({...state, settings: {...settings, bitPerfectMode: !settings.bitPerfectMode}})} 
                     />
                 </div>
                 <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-gray-400">Upsampling</span>
                     <Toggle 
                        active={settings.forceUpsampling} 
                        onClick={() => onUpdate({...state, settings: {...settings, forceUpsampling: !settings.forceUpsampling}})} 
                     />
                 </div>
                 <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-gray-400">Exclusive USB</span>
                     <Toggle 
                        active={settings.bypassAndroidAudio} 
                        onClick={() => onUpdate({...state, settings: {...settings, bypassAndroidAudio: !settings.bypassAndroidAudio}})} 
                     />
                 </div>
             </div>

             <div className="mt-auto p-3 bg-blue-900/20 border border-blue-800 rounded text-[10px] text-blue-200 leading-relaxed">
                 <strong className="block mb-1 text-blue-400 flex items-center gap-1"><Zap size={12}/> ENGINE ACTIVE</strong>
                 UAPP Driver Loaded. High-fidelity audio routed to master output. 
             </div>
        </div>
    </div>
  );
};

const NavButton = ({ label, icon, active, onClick, extra }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center justify-between p-3 rounded-md transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
        <div className="flex items-center gap-3">
            {icon}
            <span className="text-xs font-bold">{label}</span>
        </div>
        {extra && <span className="text-[9px] bg-black/20 px-1.5 py-0.5 rounded opacity-80">{extra}</span>}
    </button>
);

const GlobeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);

const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <div 
        onClick={onClick}
        className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${active ? 'bg-green-500' : 'bg-gray-700'}`}
    >
        <div className={`w-3 h-3 bg-white rounded-full transition-transform shadow ${active ? 'translate-x-4' : ''}`}></div>
    </div>
);
