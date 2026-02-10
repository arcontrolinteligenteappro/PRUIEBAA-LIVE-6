
import React from 'react';
import { SystemLogEntry } from '../types';
import { AlertTriangle, Info, CheckCircle, X, Terminal, Filter } from 'lucide-react';

interface SystemLogPanelProps {
  logs: SystemLogEntry[];
  onClose: () => void;
}

export const SystemLogPanel: React.FC<SystemLogPanelProps> = ({ logs, onClose }) => {
  
  const getIcon = (level: string) => {
      switch(level) {
          case 'CRITICAL': return <AlertTriangle size={14} className="text-red-500" />;
          case 'WARNING': return <AlertTriangle size={14} className="text-yellow-500" />;
          case 'SUCCESS': return <CheckCircle size={14} className="text-green-500" />;
          default: return <Info size={14} className="text-blue-500" />;
      }
  };

  const getRowStyle = (level: string) => {
      switch(level) {
          case 'CRITICAL': return 'bg-red-900/20 border-l-2 border-red-500';
          case 'WARNING': return 'bg-yellow-900/10 border-l-2 border-yellow-500';
          case 'SUCCESS': return 'bg-green-900/10 border-l-2 border-green-500';
          default: return 'border-l-2 border-gray-700';
      }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm animate-[fadeIn_0.2s]">
        <div className="w-full max-w-4xl h-[80vh] bg-[#0d0d0d] border border-gray-700 rounded-lg flex flex-col shadow-2xl">
            
            {/* HEADER */}
            <div className="h-12 border-b border-gray-800 bg-[#151515] flex items-center justify-between px-4 rounded-t-lg">
                <div className="flex items-center gap-3">
                    <Terminal size={18} className="text-gray-400" />
                    <h2 className="font-bold text-sm text-white uppercase tracking-wider">System Event Log</h2>
                    <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-gray-400">FAILSAFE ACTIVE</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-white"><Filter size={12}/> FILTER</button>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={18}/></button>
                </div>
            </div>

            {/* LOGS SCROLL AREA */}
            <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-1">
                {logs.length === 0 && (
                    <div className="text-center text-gray-600 mt-20">No events recorded. System nominal.</div>
                )}
                {logs.map(log => (
                    <div key={log.id} className={`p-2 rounded flex items-start gap-3 hover:bg-white/5 transition-colors ${getRowStyle(log.level)}`}>
                        <div className="mt-0.5">{getIcon(log.level)}</div>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <span className={`font-bold ${log.level === 'CRITICAL' ? 'text-red-400' : 'text-gray-300'}`}>{log.module}</span>
                                <span className="text-gray-600">{new Date(log.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div className="text-gray-400 mt-0.5">{log.message}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="h-12 border-t border-gray-800 bg-[#111] flex items-center justify-between px-4 rounded-b-lg">
                <div className="text-[10px] text-gray-500">Log persistence: 24h</div>
                <div className="flex gap-2">
                    <button className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded">CLEAR</button>
                    <button className="px-4 py-1.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded">EXPORT CSV</button>
                </div>
            </div>
        </div>
    </div>
  );
};
