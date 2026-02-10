
import React, { useState } from 'react';
import { StreamerState, StreamScene, EngagementAlert, VideoSource, AudioChannel, StreamProfile } from '../types';
import { MonitorView } from './MonitorView';
import { ShieldAlert, Monitor, MessageSquare, Coffee, LogOut, Gamepad2, Video, Heart, DollarSign, Star, Activity, Users, Eye, EyeOff, Mic, MicOff, VolumeX, Volume2, Bot, Scissors, Play, Settings, RefreshCw, Layers, Lock, Plus, Globe, Folder, Disc } from 'lucide-react';
import { SourceButton } from './SourceButton';

interface StreamerControlPanelProps {
  state: StreamerState;
  sources: VideoSource[];
  audioChannels: AudioChannel[];
  onUpdate: (newState: StreamerState) => void;
  onTriggerAlert: (type: EngagementAlert['type']) => void;
  onUpdateAudio: (channel: AudioChannel) => void;
}

export const StreamerControlPanel: React.FC<StreamerControlPanelProps> = ({ state, sources, audioChannels, onUpdate, onTriggerAlert, onUpdateAudio }) => {
  const [activeRightTab, setActiveRightTab] = useState<'CHAT' | 'ALERTS'>('CHAT');

  // --- SAFE MODE HELPERS ---
  const toggleSafe = (key: keyof StreamerState['safeMode']) => {
      onUpdate({
          ...state,
          safeMode: { ...state.safeMode, [key]: !state.safeMode[key] }
      });
  };

  const SceneButton = ({ id, label, icon, color }: { id: StreamScene, label: string, icon: React.ReactNode, color: string }) => (
      <button 
        onClick={() => onUpdate({ ...state, activeScene: id })}
        className={`
            relative flex flex-col items-center justify-center h-24 rounded-xl border-2 transition-all active:scale-95 shadow-md group overflow-hidden
            ${state.activeScene === id ? `bg-${color}-900/60 border-${color}-500 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]` : 'bg-[#1a1a1a] border-gray-700 text-gray-400 hover:bg-[#252525]'}
        `}
      >
          {state.activeScene === id && <div className={`absolute top-2 right-2 w-3 h-3 rounded-full bg-${color}-500 shadow-[0_0_8px_currentColor] animate-pulse`}></div>}
          <div className={`mb-2 transform transition-transform ${state.activeScene === id ? 'scale-125' : 'group-hover:scale-110'}`}>{icon}</div>
          <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] font-sans text-gray-200">
        
        {/* A) BARRA SUPERIOR (Always Visible) */}
        <div className="h-12 bg-[#111] border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-red-900/20 px-3 py-1 rounded-full border border-red-900/50">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_red]"></span>
                    <span className="text-xs font-black text-red-100 tracking-wide">ON AIR</span>
                </div>
                <div className="flex gap-2">
                    {['TW', 'YT', 'TT', 'FB'].map(p => (
                        <div key={p} className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold ${p === 'TW' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-500'}`}>{p}</div>
                    ))}
                </div>
            </div>
            
            <div className="flex items-center gap-6 text-xs font-mono font-bold text-gray-400">
                <div className="flex items-center gap-1.5"><Activity size={14} className="text-blue-400"/> 6000 kbps</div>
                <div className="flex items-center gap-1.5"><Monitor size={14} className="text-green-400"/> 60 FPS</div>
                <div className="flex items-center gap-1.5"><Globe size={14} className="text-yellow-400"/> 24ms</div>
            </div>

            <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Logs"><Folder size={16}/></button>
                <button className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Settings"><Settings size={16}/></button>
                <button 
                    onClick={() => toggleSafe('blurScreen')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-black border transition-all ${state.safeMode.blurScreen ? 'bg-red-600 text-white border-red-500 animate-pulse' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                >
                    <ShieldAlert size={12} /> SAFE MODE
                </button>
            </div>
        </div>

        {/* MAIN WORKSPACE */}
        <div className="flex flex-1 overflow-hidden">
            
            {/* B) BLOQUE ESCENAS (Left) */}
            <div className="w-48 bg-[#151515] border-r border-gray-800 flex flex-col p-3 gap-3 overflow-y-auto">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 text-center">SCENES</h3>
                <SceneButton id="STARTING" label="Starting" icon={<Monitor size={24}/>} color="blue" />
                <SceneButton id="GAME" label="Game" icon={<Gamepad2 size={24}/>} color="purple" />
                <SceneButton id="CHATTING" label="Just Chatting" icon={<MessageSquare size={24}/>} color="green" />
                <SceneButton id="BREAK" label="Be Right Back" icon={<Coffee size={24}/>} color="yellow" />
                <SceneButton id="REPLAY" label="Replay / Clip" icon={<RefreshCw size={24}/>} color="orange" />
                <SceneButton id="ENDING" label="Ending" icon={<LogOut size={24}/>} color="red" />
            </div>

            {/* C) CENTRO: PREVIEW / PROGRAM + D) SOURCES */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0f0f0f]">
                {/* Monitors */}
                <div className="flex-1 p-2 flex gap-2 max-h-[55%]">
                    <div className="flex-1 flex flex-col bg-black border border-gray-800 rounded overflow-hidden relative">
                        <div className="absolute top-2 left-2 z-10 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold text-green-500">PREVIEW</div>
                        <MonitorView 
                            label="" 
                            source={sources.find(s => s.id === state.gameSourceId)} 
                            type="PVW" 
                            className="w-full h-full border-0"
                        />
                    </div>
                    <div className="flex-1 flex flex-col bg-black border-2 border-red-900 rounded overflow-hidden relative shadow-[0_0_30px_rgba(220,38,38,0.15)]">
                        <div className="absolute top-2 left-2 z-10 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold text-white animate-pulse">PROGRAM</div>
                        <MonitorView 
                            label="" 
                            source={sources.find(s => s.id === state.gameSourceId)} 
                            type="PGM"
                            isGamingMode={true}
                            streamerState={state}
                            allSources={sources}
                            className="w-full h-full border-0"
                        />
                    </div>
                </div>

                {/* Transition Bar */}
                <div className="h-14 bg-[#1a1a1a] border-y border-gray-800 flex items-center justify-center gap-6 px-4">
                    <TransButton label="CUT" color="red" />
                    <TransButton label="FADE" color="blue" />
                    <TransButton label="WIPE" color="yellow" />
                    <TransButton label="STINGER" color="purple" />
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-xs rounded shadow-lg hover:brightness-110 active:scale-95 transition-all">
                        AUTO TRANSITION
                    </button>
                </div>

                {/* D) SOURCES LIST */}
                <div className="flex-1 bg-[#151515] p-3 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-3 px-1">
                        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SOURCES</h3>
                        <div className="flex gap-2">
                            <button className="text-[10px] bg-gray-700 px-3 py-1.5 rounded text-gray-300 font-bold hover:bg-gray-600">PROPERTIES</button>
                            <button className="text-[10px] bg-blue-600 px-3 py-1.5 rounded text-white flex items-center gap-1 hover:bg-blue-500 font-bold"><Plus size={10} /> ADD SOURCE</button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-3 content-start">
                        {sources.slice(0, 8).map(src => (
                            <div key={src.id} className="aspect-video bg-[#222] rounded border border-gray-700 p-2 flex flex-col items-center justify-center gap-2 group hover:border-blue-500 cursor-pointer transition-colors relative">
                                <div className="text-gray-500 group-hover:text-blue-400"><Layers size={24}/></div>
                                <span className="text-xs font-bold text-gray-300 truncate w-full text-center">{src.name}</span>
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                                    <button className="p-1 bg-black/50 rounded text-white"><Eye size={10}/></button>
                                    <button className="p-1 bg-black/50 rounded text-white"><Lock size={10}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: CHAT + AUDIO */}
            <div className="w-80 bg-[#111] border-l border-gray-800 flex flex-col">
                
                {/* F) CHAT & ALERTS */}
                <div className="h-[55%] flex flex-col border-b border-gray-800">
                    <div className="flex h-10 bg-[#1a1a1a] border-b border-gray-800">
                        <button 
                            onClick={() => setActiveRightTab('CHAT')} 
                            className={`flex-1 text-[10px] font-bold transition-colors border-b-2 ${activeRightTab === 'CHAT' ? 'bg-[#111] text-white border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                        >
                            STREAM CHAT
                        </button>
                        <button 
                            onClick={() => setActiveRightTab('ALERTS')} 
                            className={`flex-1 text-[10px] font-bold transition-colors border-b-2 ${activeRightTab === 'ALERTS' ? 'bg-[#111] text-white border-purple-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                        >
                            ALERTS FEED
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden relative bg-[#0a0a0a]">
                        {activeRightTab === 'CHAT' && (
                            <div className="absolute inset-0 flex flex-col p-2">
                                <div className="flex-1 overflow-y-auto space-y-1 mb-2">
                                    <ChatMessage user="User1" text="PogChamp!" color="text-blue-400" />
                                    <ChatMessage user="Mod" text="Don't spam caps." color="text-green-400" isMod />
                                    <ChatMessage user="GamerX" text="What specs?" color="text-purple-400" />
                                </div>
                                <div className="flex gap-1 border-t border-gray-800 pt-2">
                                    <input className="flex-1 bg-[#222] border border-gray-700 rounded px-2 py-2 text-xs text-white placeholder-gray-600 focus:border-blue-500 outline-none" placeholder="Send message..." />
                                    <button className="bg-gray-800 px-3 rounded text-white text-xs font-bold hover:bg-gray-700">SEND</button>
                                </div>
                            </div>
                        )}
                        {activeRightTab === 'ALERTS' && (
                            <div className="p-3 space-y-2">
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <button onClick={() => onTriggerAlert('SUB')} className="py-3 bg-purple-900/30 border border-purple-600 rounded text-purple-200 text-xs font-bold hover:bg-purple-900/50">TEST SUB</button>
                                    <button onClick={() => onTriggerAlert('DONATION')} className="py-3 bg-green-900/30 border border-green-600 rounded text-green-200 text-xs font-bold hover:bg-green-900/50">TEST DONO</button>
                                </div>
                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Recent Events</div>
                                {state.alerts.slice(0,5).map(a => (
                                    <div key={a.id} className="flex items-center gap-2 p-2 bg-[#151515] rounded border border-gray-800">
                                        <Heart size={12} className="text-purple-500"/>
                                        <span className="text-xs text-gray-300 font-bold">{a.user}</span>
                                        <span className="text-[10px] text-gray-500 ml-auto uppercase">{a.type}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* E) AUDIO MIXER */}
                <div className="flex-1 flex flex-col p-3 bg-[#151515] overflow-hidden">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-3 flex items-center justify-between">
                        <span>AUDIO MIX</span>
                        <div className="flex gap-2">
                            <span className="text-[8px] bg-red-900/50 text-red-400 px-1 rounded border border-red-800">LIMITER</span>
                            <Settings size={12} className="cursor-pointer hover:text-white" />
                        </div>
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-3">
                        {audioChannels.slice(0, 5).map(ch => (
                            <div key={ch.id} className="group">
                                <div className="flex justify-between mb-1 items-center">
                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{ch.label}</span>
                                    <div className="flex gap-1">
                                        <button className={`w-4 h-4 flex items-center justify-center rounded text-[8px] font-bold border ${ch.isSolo ? 'bg-yellow-500 text-black border-yellow-600' : 'bg-[#222] text-gray-500 border-gray-600'}`}>S</button>
                                        <button onClick={() => onUpdateAudio({...ch, isMuted: !ch.isMuted})} className={`w-4 h-4 flex items-center justify-center rounded text-[8px] font-bold border ${ch.isMuted ? 'bg-red-600 text-white border-red-500' : 'bg-[#222] text-gray-500 border-gray-600'}`}>M</button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="range" min="0" max="1" step="0.01" 
                                        value={ch.level} 
                                        onChange={(e) => onUpdateAudio({...ch, level: parseFloat(e.target.value)})}
                                        className="flex-1 h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                    <div className="w-8 text-[9px] font-mono text-gray-500 text-right">{Math.round(ch.level * 100)}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

const TransButton = ({ label, color }: any) => (
    <button className={`px-5 py-2.5 rounded font-black text-xs text-gray-300 bg-[#222] border border-gray-700 shadow-sm active:scale-95 active:bg-black hover:border-${color}-500 hover:text-white transition-all`}>
        {label}
    </button>
);

const ChatMessage = ({ user, text, color, isMod }: any) => (
    <div className={`text-xs p-2 rounded mb-1 flex items-start gap-2 ${isMod ? 'bg-green-900/10 border border-green-900/30' : 'bg-[#151515]'}`}>
        {isMod && <ShieldAlert size={12} className="text-green-500 mt-0.5" />}
        <div>
            <span className={`font-bold ${color} mr-2`}>{user}:</span>
            <span className="text-gray-300 leading-snug">{text}</span>
        </div>
    </div>
);
