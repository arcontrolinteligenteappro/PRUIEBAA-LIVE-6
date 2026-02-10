
import React from 'react';
import { AppMode, BroadcastMacro } from '../types';
import { Play, Zap, RefreshCw, Repeat, Video } from 'lucide-react';

interface RightPanelProps {
  mode: AppMode;
  macros: BroadcastMacro[];
  onTrigger: (macro: BroadcastMacro) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ mode, macros, onTrigger }) => {
  return (
    <div className="h-full bg-[#151515] border-l border-gray-800 flex flex-col overflow-hidden">
        {/* Common Quick Actions */}
        <div className="p-4 grid grid-cols-2 gap-2 border-b border-gray-800">
            <ActionButton label="AUTO" color="bg-blue-600" />
            <ActionButton label="CUT" color="bg-red-600" />
            <ActionButton label="FTB" color="bg-black border border-gray-600" />
            <ActionButton label="DSK" color="bg-gray-700" />
        </div>

        {/* Macros List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase">Macros</h3>
            {macros.map(m => (
                <button 
                    key={m.id}
                    onClick={() => onTrigger(m)}
                    className={`h-12 w-full rounded flex items-center justify-center gap-2 font-bold text-xs text-white transition-all active:scale-95 ${m.color}`}
                >
                    <Zap size={14} /> {m.label}
                </button>
            ))}
        </div>

        {/* Media / Stingers */}
        <div className="p-4 border-t border-gray-800">
             <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Stingers</h3>
             <div className="grid grid-cols-3 gap-2">
                 <StingerButton label="INTRO" />
                 <StingerButton label="WIPE 1" />
                 <StingerButton label="OUTRO" />
             </div>
        </div>
    </div>
  );
};

const ActionButton = ({ label, color }: any) => (
    <button className={`h-12 rounded font-black text-white hover:brightness-110 active:scale-95 transition-all ${color}`}>
        {label}
    </button>
);

const StingerButton = ({ label }: any) => (
    <button className="h-10 bg-[#222] border border-gray-700 rounded text-[10px] font-bold text-gray-300 hover:bg-gray-700 hover:text-white flex flex-col items-center justify-center">
        <Play size={10} /> {label}
    </button>
);
