

import React from 'react';
import { AppMode, OperationMode } from '../types';
import { Layout, Trophy, Mic, ShoppingBag, Radio, Box, Sliders, Gamepad2 } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: AppMode;
  opMode: OperationMode;
  onSelectMode: (mode: AppMode) => void;
  onToggleOpMode: (mode: OperationMode) => void;
  onClose: () => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, opMode, onSelectMode, onToggleOpMode, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-8 animate-[fadeIn_0.3s]">
        <div className="max-w-6xl w-full">
            <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">SELECT WORKFLOW ENGINE</h1>
            <p className="text-gray-500 mb-8">Choose the specialized interface for your production type.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <ModeCard 
                    title="GENERAL" 
                    icon={<Layout size={32}/>} 
                    description="Standard switcher with Mix, Audio, DSK, and PTZ control."
                    isActive={currentMode === 'GENERAL'}
                    onClick={() => onSelectMode('GENERAL')}
                    color="blue"
                />
                <ModeCard 
                    title="SPORTS" 
                    icon={<Trophy size={32}/>} 
                    description="Scorebugs, Stats, Instant Replay, and Game Logic."
                    isActive={currentMode === 'SPORTS'}
                    onClick={() => onSelectMode('SPORTS')}
                    color="yellow"
                />
                <ModeCard 
                    title="PODCAST" 
                    icon={<Mic size={32}/>} 
                    description="Remote guests, Grid layouts, Lower thirds, Social chat."
                    isActive={currentMode === 'PODCAST'}
                    onClick={() => onSelectMode('PODCAST')}
                    color="purple"
                />
                <ModeCard 
                    title="GAMING" 
                    icon={<Gamepad2 size={32}/>} 
                    description="Scenes, Alerts, Face Cam, Privacy Mode."
                    isActive={currentMode === 'GAMING'}
                    onClick={() => onSelectMode('GAMING')}
                    color="pink"
                />
                <ModeCard 
                    title="SHOPPING" 
                    icon={<ShoppingBag size={32}/>} 
                    description="Product overlays, Inventory, QR Codes, Sales alerts."
                    isActive={currentMode === 'SHOPPING'}
                    onClick={() => onSelectMode('SHOPPING')}
                    color="green"
                />
            </div>

            <div className="bg-[#111] p-6 rounded-xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Sliders size={20} /> OPERATION STYLE</h3>
                    <p className="text-sm text-gray-500">How do you want to switch?</p>
                </div>
                <div className="flex bg-black p-1 rounded-lg border border-gray-700">
                    <button 
                        onClick={() => onToggleOpMode('STUDIO')}
                        className={`px-6 py-3 rounded-md font-bold text-sm transition-all flex items-center gap-2 ${opMode === 'STUDIO' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <Box size={16} /> STUDIO MODE (PVW/PGM)
                    </button>
                    <button 
                        onClick={() => onToggleOpMode('SINGLE')}
                        className={`px-6 py-3 rounded-md font-bold text-sm transition-all flex items-center gap-2 ${opMode === 'SINGLE' ? 'bg-red-900 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <Radio size={16} /> SINGLE OPERATOR (CUT)
                    </button>
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <button 
                    onClick={onClose}
                    className="px-12 py-4 bg-white text-black font-black text-lg rounded-full hover:scale-105 transition-transform"
                >
                    ENTER STUDIO
                </button>
            </div>
        </div>
    </div>
  );
};

const ModeCard = ({ title, icon, description, isActive, onClick, color }: any) => {
    const borderColor = isActive ? `border-${color}-500` : 'border-gray-800';
    const bgColor = isActive ? `bg-${color}-900/20` : 'bg-[#1a1a1a]';
    const textColor = isActive ? 'text-white' : 'text-gray-400';

    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-start text-left p-6 rounded-xl border-2 transition-all hover:scale-[1.02] ${borderColor} ${bgColor} h-64`}
        >
            <div className={`mb-4 p-3 rounded-lg ${isActive ? 'bg-white text-black' : 'bg-black text-gray-500'}`}>
                {icon}
            </div>
            <h2 className={`text-2xl font-black mb-2 ${textColor}`}>{title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            {isActive && <div className={`mt-auto text-xs font-bold uppercase tracking-widest text-${color}-500`}>Active</div>}
        </button>
    );
};
