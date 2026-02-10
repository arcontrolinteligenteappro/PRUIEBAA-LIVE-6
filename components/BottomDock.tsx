
import React from 'react';
import { NavTab } from '../types';
import { Home, MonitorPlay, Layers, Mic, Settings } from 'lucide-react';

interface BottomDockProps {
  activeTab: NavTab;
  onSelect: (tab: NavTab) => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({ activeTab, onSelect }) => {
  const tabs: { id: NavTab; icon: React.ReactNode; label: string }[] = [
    { id: 'HOME', icon: <Home size={18} />, label: 'HOME' },
    { id: 'LIVE', icon: <MonitorPlay size={18} />, label: 'LIVE' },
    { id: 'GRAPHICS', icon: <Layers size={18} />, label: 'GFX' },
    { id: 'AUDIO', icon: <Mic size={18} />, label: 'AUDIO' },
    { id: 'SYSTEM', icon: <Settings size={18} />, label: 'SYSTEM' },
  ];

  return (
    <div className="h-16 bg-[#0a0a0a] border-t border-gray-800 flex items-center justify-between px-2 shrink-0">
        {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
                <button
                    key={tab.id}
                    onClick={() => onSelect(tab.id)}
                    className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-all ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-white/10' : ''}`}>
                        {tab.icon}
                    </div>
                    <span className="text-[9px] font-bold tracking-widest">{tab.label}</span>
                    {isActive && <div className="w-1 h-1 bg-white rounded-full mt-0.5"></div>}
                </button>
            );
        })}
    </div>
  );
};
