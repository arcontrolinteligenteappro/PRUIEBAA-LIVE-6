
import React from 'react';
import { AudioRouting } from '../types';
import { ArrowDownRight, Headphones, Radio, Mic, Volume2 } from 'lucide-react';

interface AudioRoutingMatrixProps {
  routing: AudioRouting[];
  onToggleRoute: (inputId: string, outputId: string) => void;
}

export const AudioRoutingMatrix: React.FC<AudioRoutingMatrixProps> = ({ routing, onToggleRoute }) => {
  const inputs = [
      { id: 'MIC1', label: 'MIC 1' },
      { id: 'MIC2', label: 'MIC 2' },
      { id: 'GAME', label: 'GAME' },
      { id: 'MUSIC', label: 'MUSIC' },
      { id: 'SFX', label: 'SFX' },
      { id: 'CHAT', label: 'CHAT' },
  ];

  const outputs = [
      { id: 'MASTER', label: 'MASTER STREAM' },
      { id: 'MONITOR', label: 'MONITOR (HP)' },
      { id: 'REC', label: 'LOCAL REC' },
      { id: 'AUX', label: 'AUX OUT' },
  ];

  const isRouted = (inId: string, outId: string) => {
      // In a real implementation, we'd check the prop. For UI mock, we assume basic routing.
      if (outId === 'MASTER') return true; 
      if (outId === 'MONITOR' && inId !== 'MIC1') return true; // Default mix minus
      return false; 
  };

  return (
    <div className="p-6 bg-[#1a1a1a] rounded-lg border border-gray-700 shadow-xl overflow-x-auto">
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2"><ArrowDownRight size={14} /> Audio Routing Matrix</h3>
        
        <table className="w-full text-left border-collapse">
            <thead>
                <tr>
                    <th className="p-2 border-b border-r border-gray-700 bg-[#222] text-[10px] text-gray-500">SOURCE \ DEST</th>
                    {outputs.map(out => (
                        <th key={out.id} className="p-2 border-b border-gray-700 bg-[#222] text-center min-w-[80px]">
                            <div className="flex flex-col items-center gap-1">
                                {out.id === 'MASTER' && <Radio size={14} className="text-red-500"/>}
                                {out.id === 'MONITOR' && <Headphones size={14} className="text-blue-500"/>}
                                <span className="text-[9px] font-bold text-gray-300">{out.label}</span>
                            </div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {inputs.map(inp => (
                    <tr key={inp.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-2 border-r border-gray-700 font-bold text-xs text-gray-300 flex items-center gap-2 bg-[#222]">
                            {inp.id.includes('MIC') ? <Mic size={12}/> : <Volume2 size={12}/>}
                            {inp.label}
                        </td>
                        {outputs.map(out => (
                            <td key={out.id} className="p-2 text-center border-b border-gray-800">
                                <button 
                                    onClick={() => onToggleRoute(inp.id, out.id)}
                                    className={`w-6 h-6 rounded flex items-center justify-center transition-all ${isRouted(inp.id, out.id) ? 'bg-green-500 text-black shadow-[0_0_10px_lime]' : 'bg-gray-800 text-gray-600'}`}
                                >
                                    <div className="w-2 h-2 bg-current rounded-full"></div>
                                </button>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};
