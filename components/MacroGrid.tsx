import React from 'react';
import { BroadcastMacro } from '../types';
import { Play, Zap, AlertTriangle } from 'lucide-react';

interface MacroGridProps {
  macros: BroadcastMacro[];
  onTrigger: (macro: BroadcastMacro) => void;
  executingId: string | null;
}

export const MacroGrid: React.FC<MacroGridProps> = ({ macros, onTrigger, executingId }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2 h-full overflow-y-auto">
      {macros.map(macro => {
        const isExec = executingId === macro.id;
        return (
          <button
            key={macro.id}
            onClick={() => onTrigger(macro)}
            disabled={isExec}
            className={`
              relative h-20 rounded-lg border-2 flex flex-col items-center justify-center gap-1 overflow-hidden transition-all active:scale-95
              ${isExec ? 'border-white bg-white/20 animate-pulse' : 'border-transparent ' + macro.color}
              ${isExec ? 'text-white' : 'text-white/90 hover:text-white hover:brightness-110'}
            `}
          >
            {/* Status Indicator */}
            {isExec && <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>}
            
            <div className="flex items-center gap-2">
                {macro.type === 'SCENE' && <Play size={16} fill="currentColor" />}
                {macro.type === 'EMERGENCY' && <AlertTriangle size={16} />}
                {macro.type === 'GFX' && <Zap size={16} />}
                <span className="font-black font-mono text-sm tracking-wide">{macro.label}</span>
            </div>
            <span className="text-[9px] uppercase opacity-70 font-mono">{macro.type} MACRO</span>
            
            {/* Progress Bar (Simulated) */}
            {isExec && (
                <div className="absolute bottom-0 left-0 h-1 bg-green-400 animate-[width_2s_linear]" style={{ width: '100%' }}></div>
            )}
          </button>
        );
      })}
    </div>
  );
};