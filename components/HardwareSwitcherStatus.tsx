
import React from 'react';
import { HardwareSwitcherState } from '../types';
import { Zap, Link, RefreshCw, AlertOctagon } from 'lucide-react';

interface HardwareSwitcherStatusProps {
  state: HardwareSwitcherState;
}

export const HardwareSwitcherStatus: React.FC<HardwareSwitcherStatusProps> = ({ state }) => {
  if (!state.isConnected) return null;

  return (
    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md border border-gray-700 rounded-lg p-2 flex items-center gap-4 shadow-xl animate-[slideDown_0.3s]">
        
        {/* Connection Status */}
        <div className="flex items-center gap-2 border-r border-gray-700 pr-4">
            <div className="bg-gray-800 p-1.5 rounded">
                {state.model === 'ATEM_MINI' && <div className="text-[9px] font-black text-white">ATEM</div>}
                {state.model === 'TRICASTER' && <div className="text-[9px] font-black text-blue-400">TC</div>}
            </div>
            <div className="flex flex-col">
                <span className="text-[8px] font-bold text-gray-500 uppercase">SYNC</span>
                <span className={`text-[10px] font-bold ${state.syncStatus === 'SYNCED' ? 'text-green-500' : 'text-red-500'}`}>{state.syncStatus}</span>
            </div>
        </div>

        {/* T-Bar Visualization */}
        <div className="flex items-center gap-2 w-32">
            <span className="text-[8px] font-bold text-gray-500">T-BAR</span>
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden relative">
                <div 
                    className="absolute h-full bg-blue-500 w-2 rounded-full transition-all duration-75"
                    style={{ left: `${state.physicalTBarPosition}%` }}
                ></div>
            </div>
        </div>

        {/* Bus Status */}
        <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
            <div className={`px-2 py-0.5 rounded text-[9px] font-black border ${state.activeBus === 'PGM' ? 'bg-red-900/50 border-red-600 text-red-200' : 'bg-gray-800 border-gray-600 text-gray-500'}`}>
                PGM
            </div>
            <div className={`px-2 py-0.5 rounded text-[9px] font-black border ${state.activeBus === 'PVW' ? 'bg-green-900/50 border-green-600 text-green-200' : 'bg-gray-800 border-gray-600 text-gray-500'}`}>
                PVW
            </div>
        </div>

    </div>
  );
};
