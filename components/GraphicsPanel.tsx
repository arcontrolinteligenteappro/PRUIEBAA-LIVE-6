
import React from 'react';
import { Sponsor, BroadcastState, SceneLayout } from '../types';
import { Layout, Type, Image, DollarSign, Play, Eye, EyeOff, Grid, Maximize, CreditCard, Monitor, Square, Layers } from 'lucide-react';

interface GraphicsPanelProps {
  state: BroadcastState;
  onUpdateState: (updates: Partial<BroadcastState>) => void;
}

export const GraphicsPanel: React.FC<GraphicsPanelProps> = ({ state, onUpdateState }) => {
  
  // --- SPONSOR ACTIONS ---
  const toggleSponsor = (id: string) => {
      const updated = state.sponsors.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s);
      onUpdateState({ sponsors: updated });
  };

  const getSponsorColor = (s: Sponsor) => {
      if (!s.isActive) return 'bg-[#222] text-gray-400 border-gray-700 hover:bg-[#333]';
      if (s.tier === 'GOLD') return 'bg-yellow-900/60 text-yellow-200 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]';
      if (s.tier === 'SILVER') return 'bg-gray-700 text-white border-gray-400';
      return 'bg-orange-900/50 text-orange-200 border-orange-500';
  };

  // --- LAYOUT ACTIONS ---
  const setLayout = (layout: SceneLayout) => onUpdateState({ activeLayout: layout });

  return (
    <div className="flex h-full bg-[#111] overflow-hidden">
        
        {/* LEFT: LAYOUTS & SCENES */}
        <div className="w-64 bg-[#151515] border-r border-gray-800 flex flex-col p-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Layout size={14}/> Layout Templates</h3>
            
            <div className="grid grid-cols-2 gap-2">
                <LayoutBtn 
                    active={state.activeLayout === 'FULL'} 
                    onClick={() => setLayout('FULL')} 
                    icon={<Square size={20}/>} 
                    label="1 CAM FULL" 
                />
                <LayoutBtn 
                    active={state.activeLayout === 'SPLIT'} 
                    onClick={() => setLayout('SPLIT')} 
                    icon={<Layout size={20}/>} 
                    label="2 CAM SPLIT" 
                />
                <LayoutBtn 
                    active={state.activeLayout === 'PIP'} 
                    onClick={() => setLayout('PIP')} 
                    icon={<Maximize size={20}/>} 
                    label="PIP" 
                />
                <LayoutBtn 
                    active={state.activeLayout === 'GRID'} 
                    onClick={() => setLayout('GRID')} 
                    icon={<Grid size={20}/>} 
                    label="GRID 4" 
                />
                <LayoutBtn 
                    active={state.activeLayout === 'GAME_CAM'} 
                    onClick={() => setLayout('GAME_CAM')} 
                    icon={<Monitor size={20}/>} 
                    label="GAME + CAM" 
                />
                <LayoutBtn 
                    active={state.activeLayout === 'SIDE_PANEL'} 
                    onClick={() => setLayout('SIDE_PANEL')} 
                    icon={<Layers size={20}/>} 
                    label="SIDE INFO" 
                />
            </div>

            <div className="mt-8">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Type size={14}/> Quick Overlays</h3>
                <div className="space-y-2">
                    <OverlayToggle label="LOWER THIRD 1" active={false} />
                    <OverlayToggle label="TICKER NEWS" active={true} />
                    <OverlayToggle label="SOCIAL BUBBLE" active={false} />
                </div>
            </div>
        </div>

        {/* CENTER: SPONSOR MANAGER */}
        <div className="flex-1 flex flex-col p-6 bg-[#0f0f0f]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <CreditCard className="text-green-500" /> SPONSOR MANAGER
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manage commercial partners and ad inventory.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded font-bold text-xs border border-gray-600">EDIT LIST</button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold text-xs shadow-lg flex items-center gap-2"><Play size={12}/> AUTO ROTATE</button>
                </div>
            </div>

            {/* Sponsor Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto">
                {state.sponsors.map(sponsor => (
                    <button 
                        key={sponsor.id}
                        onClick={() => toggleSponsor(sponsor.id)}
                        className={`
                            relative h-40 rounded-xl border-2 flex flex-col items-center justify-center gap-2 overflow-hidden transition-all active:scale-95 group
                            ${getSponsorColor(sponsor)}
                        `}
                    >
                        {sponsor.isActive && (
                            <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded animate-pulse shadow-md">
                                ON AIR
                            </div>
                        )}
                        
                        <div className="bg-white p-2 rounded shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                            <img src={sponsor.logoUrl} className="w-16 h-16 object-contain" />
                        </div>
                        
                        <div className="text-center mt-2">
                            <div className="font-bold text-sm tracking-wide">{sponsor.name}</div>
                            <div className="text-[9px] uppercase font-mono opacity-70 border px-1 rounded inline-block mt-1">{sponsor.type.replace('_', ' ')}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* RIGHT: MEDIA ASSETS */}
        <div className="w-64 bg-[#151515] border-l border-gray-800 flex flex-col p-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Image size={14}/> Media Assets</h3>
            <div className="grid grid-cols-2 gap-2">
                {[1,2,3,4,5,6].map(i => (
                    <button key={i} className="aspect-video bg-black rounded border border-gray-700 relative hover:border-gray-500 group">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-600 group-hover:text-gray-400">
                            IMG {i}
                        </div>
                    </button>
                ))}
            </div>
            <button className="w-full mt-4 py-2 border border-dashed border-gray-600 rounded text-gray-500 hover:text-white hover:border-gray-400 font-bold text-xs">
                + UPLOAD ASSET
            </button>
        </div>

    </div>
  );
};

const LayoutBtn = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all border-2 ${active ? 'bg-blue-900/40 border-blue-500 text-white shadow-lg' : 'bg-[#222] border-transparent text-gray-400 hover:bg-[#333] hover:text-gray-200'}`}
    >
        {icon}
        <span className="text-[9px] font-bold mt-2 tracking-wider">{label}</span>
    </button>
);

const OverlayToggle = ({ label, active }: any) => (
    <button className={`w-full flex items-center justify-between p-3 rounded border transition-all ${active ? 'bg-green-900/30 border-green-600 text-green-100' : 'bg-[#222] border-gray-700 text-gray-400'}`}>
        <span className="text-xs font-bold">{label}</span>
        {active ? <Eye size={14} /> : <EyeOff size={14} />}
    </button>
);
