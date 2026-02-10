
import React from 'react';
import { SystemStats } from '../types';
import { Wifi, Save, Globe, Cpu, Zap, Settings, Bot } from 'lucide-react';

interface TopBarProps {
  stats: SystemStats;
  recording: boolean;
  streaming: boolean;
  time: Date;
  onOpenConfig: () => void;
  onToggleRec: () => void;
  onToggleStream: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ stats, recording, streaming, time, onOpenConfig, onToggleRec, onToggleStream }) => {
  return (
    <header className="h-12 bg-[#0a0a0a] border-b border-gray-800 flex items-center justify-between px-6 select-none shrink-0 shadow-md relative z-50">
        
        {/* LEFT: Project & Status */}
        <div className="flex items-center gap-6">
            <h1 className="text-sm font-black tracking-widest text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-xs shadow-lg">AR</div>
                <span>ARCLS <span className="text-gray-500 font-mono text-[10px]">LIVE</span></span>
            </h1>
            <div className="h-6 w-[1px] bg-gray-700"></div>
            <div className="flex gap-2">
                <button 
                    onClick={onToggleRec}
                    className={`px-3 py-1 rounded text-xs font-bold border flex items-center gap-2 hover:brightness-110 shadow-sm transition-all ${recording ? 'bg-red-900/30 text-red-400 border-red-900 shadow-[0_0_10px_rgba(220,38,38,0.2)]' : 'bg-[#151515] text-gray-500 border-gray-700 hover:text-gray-300'}`}
                >
                    <Save size={12} className={recording ? 'animate-pulse' : ''} /> REC
                </button>
                <button 
                    onClick={onToggleStream}
                    className={`px-3 py-1 rounded text-xs font-bold border flex items-center gap-2 hover:brightness-110 shadow-sm transition-all ${streaming ? 'bg-green-900/30 text-green-400 border-green-900 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-[#151515] text-gray-500 border-gray-700 hover:text-gray-300'}`}
                >
                    <Globe size={12} className={streaming ? 'animate-pulse' : ''} /> STREAM
                </button>
            </div>
        </div>

        {/* CENTER: Clock */}
        <div className="flex items-center gap-3 bg-[#111] px-4 py-1 rounded-full border border-gray-800 shadow-inner">
            <span className="font-mono text-xl font-bold text-white tracking-wide">{time.toLocaleTimeString()}</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Local</span>
        </div>

        {/* RIGHT: System Health */}
        <div className="flex items-center gap-6 text-xs font-mono font-bold text-gray-400">
            <div className="flex items-center gap-1.5 text-green-500 bg-green-900/10 px-2 py-1 rounded">
                <Wifi size={12} /> {stats.network}
            </div>
            <div className="flex items-center gap-4 hidden md:flex">
                <div className="flex items-center gap-1"><Cpu size={12} /> {stats.cpu}%</div>
                <div className="flex items-center gap-1"><Zap size={12} /> {stats.ram}%</div>
                <div className="flex items-center gap-1 text-blue-400"><ActivityIcon /> {stats.fps} FPS</div>
            </div>
            <div className="h-6 w-[1px] bg-gray-700 hidden md:block"></div>
            <button 
                onClick={onOpenConfig} 
                className="flex items-center gap-2 px-3 py-1.5 bg-[#222] hover:bg-[#333] border border-gray-700 rounded text-gray-300 transition-colors"
            >
                <Settings size={14} />
                <span className="hidden md:inline">CONFIG</span>
            </button>
        </div>
    </header>
  );
};

const ActivityIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);
