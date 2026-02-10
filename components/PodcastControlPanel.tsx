
import React, { useState } from 'react';
import { RemoteGuest, PodcastState, PodcastLayout, SoundboardItem, SocialComment, PodcastEpisode, ChapterMarker } from '../types';
import { Mic, MicOff, Layout, Grid, Square, PictureInPicture2, Monitor, Volume2, ShieldCheck, UserPlus, MessageSquare, Star, Copy, Save, Flag, FileText, Share2, UploadCloud, Radio, Users, ChevronLeft, Disc, Video, Music } from 'lucide-react';
import { AudioReferenceEngine } from './AudioReferenceEngine';
import { INITIAL_ARE_STATE } from '../constants';

interface PodcastControlPanelProps {
  guests: RemoteGuest[];
  state: PodcastState;
  socialFeed: SocialComment[];
  activeEpisode: PodcastEpisode | null;
  onUpdateState: (newState: PodcastState) => void;
  onUpdateGuest: (guestId: string, updates: Partial<RemoteGuest>) => void;
  onToggleSocial: (id: string) => void;
}

export const PodcastControlPanel: React.FC<PodcastControlPanelProps> = ({ 
    guests, state, socialFeed, activeEpisode, onUpdateState, onUpdateGuest, onToggleSocial 
}) => {
  const [activeTab, setActiveTab] = useState<'STUDIO' | 'GUESTS' | 'SCRIPT' | 'MARKERS' | 'EXPORT'>('STUDIO');
  const [showAudioEngine, setShowAudioEngine] = useState(false);

  // --- HELPERS ---
  const toggleLayout = (l: PodcastLayout) => onUpdateState({ ...state, activeLayout: l });
  
  const triggerSound = (id: string) => {
      const updated = state.soundboard.map(s => s.id === id ? { ...s, isPlaying: true } : s);
      onUpdateState({ ...state, soundboard: updated });
      setTimeout(() => {
          onUpdateState({ ...state, soundboard: state.soundboard.map(s => s.id === id ? { ...s, isPlaying: false } : s) });
      }, 500); 
  };

  const addMarker = (type: ChapterMarker['type']) => {
      console.log(`Added marker: ${type} at ${state.recordingDuration}s`);
  };

  const toggleRecordingMode = (mode: PodcastState['recordingMode']) => {
      onUpdateState({ ...state, recordingMode: mode });
  };

  // --- SUB-COMPONENTS ---

  const RecordingStatus = () => (
      <div className="flex items-center gap-4 bg-[#222] p-2 rounded-lg border border-gray-700">
          <div className="flex gap-1 bg-black p-1 rounded">
              {['LIVE', 'RECORD', 'HYBRID'].map((m) => (
                  <button 
                    key={m}
                    onClick={() => toggleRecordingMode(m as any)}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all ${state.recordingMode === m ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                      {m}
                  </button>
              ))}
          </div>
          <div className="h-6 w-px bg-gray-600"></div>
          <div className="flex-1 flex justify-between items-center px-2">
              <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider">MASTER TIME</span>
                  <span className={`font-mono text-xl font-black leading-none ${state.isMasterRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                      {new Date(state.recordingDuration * 1000).toISOString().substr(14, 5)}
                  </span>
              </div>
              <div className="flex gap-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${state.isMasterRecording ? 'bg-red-900/40 border-red-600 text-red-400' : 'bg-[#111] border-gray-700 text-gray-600'}`}>MASTER</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${state.isMasterRecording ? 'bg-blue-900/40 border-blue-600 text-blue-400' : 'bg-[#111] border-gray-700 text-gray-600'}`}>ISO x{guests.filter(g => g.isOnStage).length}</span>
              </div>
          </div>
      </div>
  );

  return (
    <div className="flex h-full bg-[#111] overflow-hidden text-gray-200 font-sans">
        
        {/* LEFT: LAYOUTS & SCENES */}
        <div className="w-24 bg-[#151515] border-r border-gray-800 flex flex-col p-2 gap-2">
            <button onClick={() => onUpdateState({ ...state, viewMode: 'MANAGER' })} className="mb-2 p-2 bg-[#222] hover:bg-[#333] rounded flex flex-col items-center gap-1 text-[9px] font-bold text-gray-400 border border-gray-700">
                <ChevronLeft size={16}/> BACK
            </button>
            <label className="text-[9px] font-bold text-gray-500 text-center uppercase mb-1">Scene</label>
            <LayoutBtn active={state.activeLayout === 'SOLO'} onClick={() => toggleLayout('SOLO')} icon={<Square size={20}/>} label="SOLO" />
            <LayoutBtn active={state.activeLayout === 'SPLIT'} onClick={() => toggleLayout('SPLIT')} icon={<Layout size={20}/>} label="SPLIT" />
            <LayoutBtn active={state.activeLayout === 'GRID'} onClick={() => toggleLayout('GRID')} icon={<Grid size={20}/>} label="GRID" />
            <LayoutBtn active={state.activeLayout === 'PIP'} onClick={() => toggleLayout('PIP')} icon={<PictureInPicture2 size={20}/>} label="PIP" />
            
            <div className="mt-auto">
                <button 
                    onClick={() => setShowAudioEngine(true)}
                    className="w-full flex flex-col items-center justify-center p-3 bg-purple-900/30 border border-purple-600 rounded-lg text-purple-300 font-bold text-[9px] hover:bg-purple-900/50 transition-colors"
                >
                    <Disc size={20} className="mb-1" />
                    PRO AUDIO
                </button>
            </div>
        </div>

        {/* CENTER: WORKSPACE */}
        <div className="flex-1 flex flex-col min-w-0">
            {/* Header / Tabs */}
            <div className="bg-[#1a1a1a] border-b border-gray-800">
                <div className="px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></span>
                        <h2 className="font-bold text-sm text-white truncate max-w-[300px]">{activeEpisode?.title || 'Untitled Session'}</h2>
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">S{activeEpisode?.season} E{activeEpisode?.episodeNumber} • {state.recordingMode} MODE</span>
                </div>
                <div className="flex h-10 px-2 gap-1">
                    <TabButton active={activeTab === 'STUDIO'} onClick={() => setActiveTab('STUDIO')} icon={<Mic size={14}/>} label="STUDIO" />
                    <TabButton active={activeTab === 'GUESTS'} onClick={() => setActiveTab('GUESTS')} icon={<Users size={14}/>} label="LOBBY" />
                    <TabButton active={activeTab === 'SCRIPT'} onClick={() => setActiveTab('SCRIPT')} icon={<FileText size={14}/>} label="SCRIPT" />
                    <TabButton active={activeTab === 'MARKERS'} onClick={() => setActiveTab('MARKERS')} icon={<Flag size={14}/>} label="CLIPS" />
                    <TabButton active={activeTab === 'EXPORT'} onClick={() => setActiveTab('EXPORT')} icon={<UploadCloud size={14}/>} label="EXPORT" />
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 overflow-y-auto bg-[#0f0f0f] p-4 relative">
                
                {/* 1. STUDIO (Main Production) */}
                {activeTab === 'STUDIO' && (
                    <div className="space-y-4 max-w-4xl mx-auto">
                        <RecordingStatus />
                        
                        {/* Active Guests Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {guests.filter(g => g.isOnStage).map(guest => (
                                <div key={guest.id} className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 flex flex-col gap-2 relative group">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-white text-xs truncate flex items-center gap-2">
                                            {guest.name}
                                            {guest.status === 'LIVE' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>}
                                        </span>
                                        <div className="flex gap-1">
                                            <button className="p-1.5 bg-gray-800 rounded hover:text-white text-gray-400" title="Mute Guest"><MicOff size={12}/></button>
                                            <button className="p-1.5 bg-gray-800 rounded hover:text-white text-gray-400" title="Hide Video"><Video size={12}/></button>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden w-full">
                                        <div className="h-full bg-green-500 transition-all" style={{ width: `${guest.audioLevel * 100}%` }}></div>
                                    </div>
                                    {guest.isIsoRecording && (
                                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-900/80 px-1.5 py-0.5 rounded border border-red-700">
                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                            <span className="text-[8px] font-bold text-red-200">ISO</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {guests.filter(g => g.isOnStage).length === 0 && (
                                <div className="col-span-2 text-center py-8 border-2 border-dashed border-gray-800 rounded-lg text-gray-600 text-xs">
                                    Stage is empty. Go to LOBBY to add guests.
                                </div>
                            )}
                        </div>

                        {/* Soundboard */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block flex justify-between">
                                <span>Soundboard</span>
                                <span className="text-gray-600">Auto-Duck: {state.autoDucking ? 'ON' : 'OFF'}</span>
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {state.soundboard.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => triggerSound(s.id)}
                                        className={`h-12 rounded font-bold text-[10px] text-white transition-all active:scale-95 border-b-4 flex flex-col items-center justify-center gap-1 ${s.isPlaying ? 'bg-white text-black border-gray-300' : `${s.color.replace('bg-', 'bg-').replace('600', '700')} border-${s.color.split('-')[1]}-900`}`}
                                    >
                                        <Music size={12} />
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. LOBBY (Guest Management) */}
                {activeTab === 'GUESTS' && (
                    <div className="h-full flex flex-col max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">Interview Lobby</h3>
                                <p className="text-xs text-gray-500">Manage remote guests and prepare them for broadcast.</p>
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold text-xs flex items-center gap-2 shadow-lg">
                                <UserPlus size={14} /> INVITE GUEST
                            </button>
                        </div>
                        
                        <div className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden flex flex-col">
                            <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 p-3 bg-[#222] border-b border-gray-700 text-[10px] font-bold text-gray-400 uppercase">
                                <span className="w-8"></span>
                                <span>Guest Name</span>
                                <span>Connection</span>
                                <span>Actions</span>
                            </div>
                            <div className="overflow-y-auto flex-1 p-2 space-y-2">
                                {guests.map(guest => (
                                    <div key={guest.id} className="bg-black/40 border border-gray-800 rounded p-3 grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center">
                                        <div className="relative w-10 h-10 rounded bg-gray-800 overflow-hidden">
                                            <img src={guest.videoUrl} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-white">{guest.name}</div>
                                            <div className="text-[10px] text-gray-500">{guest.email}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`px-2 py-0.5 rounded text-[10px] font-bold border ${guest.connectionQuality === 'GOOD' ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-yellow-900/20 text-yellow-400 border-yellow-800'}`}>
                                                {guest.connectionQuality}
                                            </div>
                                            {guest.status === 'LIVE' && <span className="text-[10px] text-red-500 font-bold animate-pulse">• LIVE</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 bg-gray-800 rounded text-gray-400 hover:text-white border border-gray-700" title="Lower Third"><FileText size={14}/></button>
                                            <button 
                                                onClick={() => onUpdateGuest(guest.id, { isOnStage: !guest.isOnStage })}
                                                className={`px-4 py-2 rounded text-xs font-bold transition-colors ${guest.isOnStage ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-green-600 text-white hover:bg-green-500'}`}
                                            >
                                                {guest.isOnStage ? 'REMOVE' : 'ADD TO STAGE'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. SCRIPT */}
                {activeTab === 'SCRIPT' && (
                    <div className="h-full flex flex-col max-w-3xl mx-auto">
                        <div className="flex justify-between items-center mb-2 bg-[#1a1a1a] p-2 rounded-t-lg border-x border-t border-gray-700">
                            <span className="text-xs font-bold text-gray-400 uppercase ml-2">Teleprompter</span>
                            <div className="flex gap-1">
                                <button className="text-[10px] bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700">A-</button>
                                <button className="text-[10px] bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700">A+</button>
                            </div>
                        </div>
                        <textarea 
                            className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-b-lg p-6 text-white text-xl leading-relaxed resize-none focus:outline-none focus:border-blue-500 font-serif"
                            value={activeEpisode?.script}
                            readOnly
                        ></textarea>
                    </div>
                )}

                {/* 4. MARKERS & CLIPS */}
                {activeTab === 'MARKERS' && (
                    <div className="h-full flex flex-col max-w-4xl mx-auto">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button onClick={() => addMarker('TOPIC')} className="h-24 bg-blue-900/30 border border-blue-600 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-blue-900/50 active:scale-95 transition-all">
                                <Flag size={24} className="text-blue-400" />
                                <span className="font-bold text-blue-200">NEW TOPIC</span>
                            </button>
                            <button onClick={() => addMarker('HIGHLIGHT')} className="h-24 bg-yellow-900/30 border border-yellow-600 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-yellow-900/50 active:scale-95 transition-all">
                                <Star size={24} className="text-yellow-400" />
                                <span className="font-bold text-yellow-200">HIGHLIGHT</span>
                            </button>
                        </div>
                        
                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Chapter List</h3>
                        <div className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-y-auto p-2">
                            {activeEpisode?.chapters.length === 0 ? (
                                <div className="text-center text-gray-600 text-xs mt-10">No markers added yet.</div>
                            ) : (
                                activeEpisode?.chapters.map(c => (
                                    <div key={c.id} className="flex justify-between items-center p-2 border-b border-gray-800">
                                        <span className="text-xs text-blue-400 font-mono">{new Date(c.timestamp * 1000).toISOString().substr(14, 5)}</span>
                                        <span className="text-sm font-bold text-white">{c.label}</span>
                                        <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-gray-400">{c.type}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* 5. EXPORT HUB */}
                {activeTab === 'EXPORT' && (
                    <div className="space-y-6 max-w-4xl mx-auto">
                        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Save size={20}/> Production Assets</h3>
                            
                            <div className="grid grid-cols-2 gap-6">
                                {/* Audio Exports */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Audio Masters</label>
                                    <ExportOption label="WAV Master (48kHz)" desc="Stereo Mixdown" ready />
                                    <ExportOption label="WAV ISO Tracks" desc="Individual Zips" ready={false} />
                                    <ExportOption label="MP3 Podcast" desc="Optimized for RSS" ready />
                                </div>

                                {/* Video Exports */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Video Masters</label>
                                    <ExportOption label="MP4 Landscape (1080p)" desc="YouTube Standard" ready />
                                    <ExportOption label="MP4 Vertical (9:16)" desc="Social Clips" ready />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2"><UploadCloud size={20}/> One-Click Publish</h3>
                                <p className="text-xs text-gray-500">Push directly to Spotify, Apple & YouTube via RSS.</p>
                            </div>
                            <button className="py-3 px-8 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full shadow-lg flex items-center gap-2">
                                <Share2 size={16} /> PUBLISH FEED
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>

        {/* PRO AUDIO OVERLAY */}
        {showAudioEngine && (
            <div className="absolute inset-0 z-[60] bg-black/95 flex flex-col animate-[fadeIn_0.2s]">
                <div className="h-12 bg-[#222] border-b border-gray-700 flex justify-between items-center px-4">
                    <span className="font-bold text-sm text-white">PRO AUDIO ENGINE</span>
                    <button onClick={() => setShowAudioEngine(false)} className="text-gray-400 hover:text-white text-xs font-bold">CLOSE</button>
                </div>
                <div className="flex-1 overflow-hidden">
                    <AudioReferenceEngine state={INITIAL_ARE_STATE} onUpdate={() => {}} />
                </div>
            </div>
        )}
    </div>
  );
};

const LayoutBtn = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
    >
        {icon}
        <span className="text-[9px] font-bold mt-1">{label}</span>
    </button>
);

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 text-[10px] font-bold transition-all rounded ${active ? 'bg-[#222] text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300 hover:bg-[#222]'}`}
    >
        {icon} {label}
    </button>
);

const ExportOption = ({ label, desc, ready }: any) => (
    <div className="flex items-center justify-between p-3 bg-black border border-gray-800 rounded group hover:border-gray-600 transition-colors">
        <div>
            <div className="font-bold text-xs text-gray-200">{label}</div>
            <div className="text-[10px] text-gray-500">{desc}</div>
        </div>
        <button 
            disabled={!ready}
            className={`text-[10px] px-3 py-1.5 rounded font-bold transition-colors ${ready ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
        >
            {ready ? 'DOWNLOAD' : 'PROCESSING'}
        </button>
    </div>
);
