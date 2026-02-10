
import React, { useState } from 'react';
import { StreamerState, StreamScene, EngagementAlert, AudioChannel } from '../types';
import { Gamepad2, Mic, MessageSquare, Volume2, ShieldAlert, Video, Radio, Bell, Users, Zap, Shield, EyeOff, Activity, Coffee, Play, Pause, RefreshCw, LogOut, CheckCircle, Ban, Pin, Disc } from 'lucide-react';

interface MobileGamerPanelProps {
  state: StreamerState;
  audioChannels: AudioChannel[];
  onUpdateState: (newState: StreamerState) => void;
  onUpdateAudio: (channel: AudioChannel) => void;
  onTriggerAlert: (type: EngagementAlert['type']) => void;
}

export const MobileGamerPanel: React.FC<MobileGamerPanelProps> = ({ 
    state, audioChannels, onUpdateState, onUpdateAudio, onTriggerAlert 
}) => {
  const [activeTab, setActiveTab] = useState<'LIVE' | 'CHAT' | 'AUDIO'>('LIVE');

  // Helpers
  const toggleSafe = (key: keyof StreamerState['safeMode']) => {
      onUpdateState({
          ...state,
          safeMode: { ...state.safeMode, [key]: !state.safeMode[key] }
      });
  };

  const SceneBtn = ({ id, label, color, icon }: any) => (
      <button 
        onClick={() => onUpdateState({ ...state, activeScene: id })}
        className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl transition-all active:scale-95 border-2 shadow-lg h-24 ${state.activeScene === id ? `bg-${color}-900/50 border-${color}-500 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]` : 'bg-[#1a1a1a] border-gray-800 text-gray-400'}`}
      >
          <div className={`mb-2 transform transition-transform ${state.activeScene === id ? 'scale-125' : ''}`}>{icon}</div>
          <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
      </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] text-white font-sans overflow-hidden">
        
        {/* TOP STATUS BAR */}
        <div className="h-14 bg-[#111] border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2 bg-red-900/20 px-3 py-1.5 rounded-full border border-red-900/50">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_red]"></span>
                <span className="text-xs font-black text-red-100 tracking-wide">ON AIR</span>
            </div>
            
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-gray-500 bg-black/40 px-2 py-1 rounded">
                    <Activity size={10} className="text-green-500"/> 6000
                </div>
                <button 
                    onClick={() => toggleSafe('blurScreen')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded font-bold text-[10px] border transition-all ${state.safeMode.blurScreen ? 'bg-white text-black border-white shadow-lg' : 'bg-gray-800 border-gray-600 text-gray-300'}`}
                >
                    <ShieldAlert size={12} /> SAFE
                </button>
            </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-hidden relative bg-[#050505]">
            
            {/* --- TAB: LIVE CONTROLS --- */}
            {activeTab === 'LIVE' && (
                <div className="h-full flex flex-col p-4 overflow-y-auto">
                    
                    {/* Primary Scenes */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <SceneBtn id="GAME" label="GAME" color="purple" icon={<Gamepad2 size={32}/>} />
                        <SceneBtn id="CHATTING" label="CHAT" color="green" icon={<MessageSquare size={32}/>} />
                    </div>
                    
                    {/* Secondary Scenes */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <SceneBtn id="STARTING" label="START" color="blue" icon={<Video size={20}/>} />
                        <SceneBtn id="BREAK" label="BREAK" color="yellow" icon={<Coffee size={20}/>} />
                        <SceneBtn id="ENDING" label="END" color="red" icon={<LogOut size={20}/>} />
                    </div>

                    {/* Transition / Action Bar */}
                    <div className="flex gap-2 mb-6 h-14">
                        <button className="flex-1 bg-gray-800 rounded-lg font-bold text-xs hover:bg-gray-700 active:scale-95 transition-transform border border-gray-600">CUT</button>
                        <button className="flex-1 bg-gray-800 rounded-lg font-bold text-xs hover:bg-gray-700 active:scale-95 transition-transform border border-gray-600">FADE</button>
                        <button className="flex-1 bg-blue-900/40 text-blue-200 border border-blue-600 rounded-lg font-bold text-xs active:scale-95 transition-transform flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(37,99,235,0.2)]">
                            <RefreshCw size={16} /> AUTO
                        </button>
                    </div>

                    {/* Streamer Safe Mode Panel */}
                    <div className="mt-auto bg-[#111] border border-red-900/30 rounded-xl p-4 shadow-inner">
                        <h3 className="text-[10px] font-bold text-red-500 uppercase mb-3 flex items-center gap-2"><Shield size={12}/> Panic Controls</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => toggleSafe('hideChat')}
                                className={`h-14 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors border ${state.safeMode.hideChat ? 'bg-orange-600 border-orange-500 text-white' : 'bg-black border-gray-700 text-gray-400'}`}
                            >
                                <MessageSquare size={18} className={state.safeMode.hideChat ? 'line-through' : ''}/> HIDE CHAT
                            </button>
                            <button 
                                onClick={() => toggleSafe('muteMic')}
                                className={`h-14 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors border ${state.safeMode.muteMic ? 'bg-red-600 border-red-500 text-white' : 'bg-black border-gray-700 text-gray-400'}`}
                            >
                                <Mic size={18} className={state.safeMode.muteMic ? 'line-through' : ''} /> MUTE MIC
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB: CHAT --- */}
            {activeTab === 'CHAT' && (
                <div className="h-full flex flex-col bg-[#1a1a1a]">
                    <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-end gap-3 pb-20">
                        {/* Mock Chat Feed */}
                        {[1,2,3,4,5,6,7].map(i => (
                            <div key={i} className="flex gap-3 bg-[#0f0f0f] p-3 rounded-lg border border-gray-800">
                                <div className="w-8 h-8 rounded-full bg-gray-700 shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-bold text-gray-300">User {i}</span>
                                        <span className="text-[10px] text-gray-600">12:0{i}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 truncate">This is a chat message content example.</p>
                                </div>
                                <div className="flex flex-col gap-1 justify-center">
                                    <button className="text-gray-500 hover:text-white p-1"><EyeOff size={16}/></button>
                                    <button className="text-red-500 hover:text-red-400 p-1"><Ban size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 bg-[#111] border-t border-gray-800 flex gap-2 fixed bottom-20 left-0 right-0 z-10">
                        <input className="flex-1 bg-[#222] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" placeholder="Send as Streamer..." />
                        <button className="bg-blue-600 text-white px-6 rounded-lg font-bold text-xs shadow-lg">SEND</button>
                    </div>
                </div>
            )}

            {/* --- TAB: AUDIO --- */}
            {activeTab === 'AUDIO' && (
                <div className="h-full p-6 overflow-y-auto flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-500 uppercase">Master Mix</h3>
                        <button 
                            onClick={() => onUpdateState({...state, smartBitrateActive: !state.smartBitrateActive})}
                            className={`text-[10px] font-bold border px-3 py-1.5 rounded transition-colors ${state.smartBitrateActive ? 'text-blue-300 border-blue-900 bg-blue-900/20' : 'text-gray-500 border-gray-700'}`}
                        >
                            AUTO DUCKING
                        </button>
                    </div>
                    
                    <div className="space-y-8">
                        {audioChannels.slice(0, 4).map(ch => (
                            <div key={ch.id} className="relative bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                                <div className="flex justify-between mb-4">
                                    <span className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        {ch.label.includes('MIC') ? <Mic size={14}/> : <Volume2 size={14}/>} {ch.label}
                                    </span>
                                    <button 
                                        onClick={() => onUpdateAudio({...ch, isMuted: !ch.isMuted})}
                                        className={`px-4 py-1 rounded text-[10px] font-bold transition-colors ${ch.isMuted ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                                    >
                                        {ch.isMuted ? 'MUTED' : 'ACTIVE'}
                                    </button>
                                </div>
                                <input 
                                    type="range" min="0" max="1" step="0.05" 
                                    value={ch.level} 
                                    onChange={(e) => onUpdateAudio({...ch, level: parseFloat(e.target.value)})}
                                    className="w-full h-4 bg-black rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => toggleSafe('muteMic')}
                            className={`py-6 rounded-xl font-bold flex flex-col items-center justify-center gap-2 border-2 transition-all active:scale-95 ${state.safeMode.muteMic ? 'bg-red-900/50 border-red-500 text-white shadow-lg' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
                        >
                            <Mic size={32} className={state.safeMode.muteMic ? 'line-through' : ''} />
                            MUTE MIC
                        </button>
                        <button 
                            onClick={() => toggleSafe('muteGame')}
                            className={`py-6 rounded-xl font-bold flex flex-col items-center justify-center gap-2 border-2 transition-all active:scale-95 ${state.safeMode.muteGame ? 'bg-red-900/50 border-red-500 text-white shadow-lg' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
                        >
                            <Volume2 size={32} />
                            MUTE GAME
                        </button>
                    </div>
                </div>
            )}

        </div>

        {/* BOTTOM NAV TABS (Swipe-style UI) */}
        <div className="h-24 bg-[#0a0a0a] border-t border-gray-800 flex shrink-0 pb-6 px-4 gap-4 items-center">
            <TabBtn active={activeTab === 'LIVE'} onClick={() => setActiveTab('LIVE')} icon={<Radio size={24}/>} label="LIVE" color="text-red-500" />
            <TabBtn active={activeTab === 'CHAT'} onClick={() => setActiveTab('CHAT')} icon={<MessageSquare size={24}/>} label="CHAT" color="text-blue-500" />
            <TabBtn active={activeTab === 'AUDIO'} onClick={() => setActiveTab('AUDIO')} icon={<Volume2 size={24}/>} label="AUDIO" color="text-yellow-500" />
        </div>
    </div>
  );
};

const TabBtn = ({ active, onClick, icon, label, color }: any) => (
    <button 
        onClick={onClick}
        className={`flex-1 flex flex-col items-center justify-center gap-1.5 h-16 rounded-xl transition-all ${active ? `bg-[#1a1a1a] ${color} border border-gray-700 shadow-md` : 'text-gray-600 hover:text-gray-400'}`}
    >
        <div className={`p-1 rounded-full ${active ? 'scale-110' : ''} transition-transform`}>{icon}</div>
        <span className="text-[10px] font-black tracking-widest">{label}</span>
    </button>
);
