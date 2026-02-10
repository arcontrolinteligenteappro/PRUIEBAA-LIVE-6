
import React from 'react';
import { BroadcastState, MobileDrawer, VideoSource, AudioChannel, BroadcastMacro, ReplayClip } from '../types';
import { LayoutMode } from '../hooks/useResponsive';
import { MonitorView } from './MonitorView';
import { SourceButton } from './SourceButton';
import { AudioMixer } from './AudioMixer';
import { GraphicsPanel } from './GraphicsPanel';
import { ReplayController } from './ReplayController';
import { MacroGrid } from './MacroGrid';
import { PerformanceOverlay } from './PerformanceOverlay';
import { SYSTEM_MACROS } from '../constants';
import { MobileGamerPanel } from './MobileGamerPanel';
import { Video, Mic, Layers, Activity, Save, Settings, Wifi, Circle, X, Menu, Zap, RefreshCw } from 'lucide-react';

interface MobileControlLayoutProps {
  state: BroadcastState;
  layoutMode: LayoutMode;
  onUpdateState: (updates: Partial<BroadcastState>) => void;
  onSourceSelect: (id: string) => void;
  onAudioUpdate: (channel: AudioChannel) => void;
  renderContextPanel: () => React.ReactNode;
  
  // Actions passed from App
  onTriggerMacro?: (macro: BroadcastMacro) => void;
  onPlayReplay?: (clip: ReplayClip) => void;
}

export const MobileControlLayout: React.FC<MobileControlLayoutProps> = ({ 
    state, layoutMode, onUpdateState, onSourceSelect, onAudioUpdate, renderContextPanel,
    onTriggerMacro, onPlayReplay
}) => {
  const isPortrait = layoutMode === 'MOBILE_PORTRAIT';

  // --- SPECIALIZED MOBILE GAMER MODE ---
  if (state.appMode === 'GAMING') {
      return (
          <MobileGamerPanel 
              state={state.streamerState}
              audioChannels={state.audioChannels}
              onUpdateState={(s) => onUpdateState({ streamerState: s })}
              onUpdateAudio={onAudioUpdate}
              onTriggerAlert={(t) => {
                  const newAlert = { id: Math.random().toString(), type: t, user: 'TestUser', timestamp: new Date(), isActive: true };
                  const updated = [...state.streamerState.alerts, newAlert];
                  onUpdateState({ streamerState: { ...state.streamerState, alerts: updated } });
                  setTimeout(() => {
                      const cleared = updated.map(a => a.id === newAlert.id ? { ...a, isActive: false } : a);
                      onUpdateState({ streamerState: { ...state.streamerState, alerts: cleared } });
                  }, 3000);
              }}
          />
      );
  }

  const toggleDrawer = (drawer: MobileDrawer) => {
      onUpdateState({ activeMobileDrawer: state.activeMobileDrawer === drawer ? 'NONE' : drawer });
  };

  const sourcesList = state.sourceOrder.map(id => state.sources[id]).filter(Boolean);

  // --- LAYOUT A: PORTRAIT ---
  const renderPortrait = () => (
    <div className="h-full w-full flex flex-col bg-black overflow-hidden relative">
        {/* Top Bar */}
        <div className="h-10 bg-[#0a0a0a] border-b border-gray-800 flex justify-between items-center px-4 shrink-0">
            <div className="flex items-center gap-2">
                <button onClick={() => onUpdateState({ streaming: !state.streaming })} className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${state.streaming ? 'bg-red-900/50 text-red-400 border-red-800' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                    <Circle size={8} fill={state.streaming ? "currentColor" : "none"} /> {state.streaming ? 'LIVE' : 'OFF'}
                </button>
            </div>
            <div className="text-[10px] font-mono text-gray-400">
                {state.systemStats.fps} FPS
            </div>
        </div>

        {/* PGM Monitor (Main) */}
        <div className="flex-1 relative bg-black">
            <MonitorView 
                label="PROGRAM"
                source={state.sources[state.programId]}
                type="PGM"
                showOverlays={true}
                overlaysData={state.overlays}
                sportsData={state.sportsState}
                // Mode Props
                isPodcastMode={state.appMode === 'PODCAST'}
                podcastState={state.podcastState}
                guests={state.guests}
                isGamingMode={state.appMode === 'GAMING'}
                streamerState={state.streamerState}
                allSources={sourcesList}
                sponsors={state.sponsors}
            />
            <PerformanceOverlay />
        </div>

        {/* Switcher Bar (Quick Access) */}
        <div className="h-20 bg-[#111] border-t border-gray-800 p-2 flex gap-2 overflow-x-auto">
            {sourcesList.map(src => (
                <div key={src.id} className="min-w-[80px]">
                    <SourceButton 
                        {...src}
                        label={src.name}
                        sourceType={src.type}
                        type={src.id === state.programId ? 'PGM' : 'PVW'}
                        isActive={src.id === state.programId}
                        onClick={() => onSourceSelect(src.id)}
                    />
                </div>
            ))}
        </div>

        {/* Action / Context Bar */}
        <div className="h-16 bg-[#1a1a1a] flex items-center justify-center gap-3 px-3 border-t border-gray-800">
            <button className="flex-1 h-10 bg-gray-800 rounded font-bold text-xs text-white border border-gray-600 active:scale-95 transition-transform">CUT</button>
            <button className="flex-1 h-10 bg-blue-600 rounded font-bold text-xs text-white shadow-lg active:scale-95 transition-transform">AUTO</button>
            <button onClick={() => toggleDrawer('MODE')} className="flex-[1.5] h-10 bg-[#222] border border-gray-700 rounded font-bold text-xs text-blue-400">
                {state.appMode} PANEL
            </button>
            {state.appMode === 'SPORTS' && (
                <button onClick={() => toggleDrawer('REPLAY')} className="w-12 h-10 bg-red-900/40 border border-red-700 rounded flex items-center justify-center text-red-400 active:scale-95">
                    <RefreshCw size={18} />
                </button>
            )}
        </div>

        {/* Bottom Dock */}
        <div className="h-16 bg-black border-t border-gray-800 flex justify-around items-center px-2 z-50">
            <DockBtn label="CAMS" icon={<Video size={20} />} active={state.activeMobileDrawer === 'CAMERAS'} onClick={() => toggleDrawer('CAMERAS')} />
            <DockBtn label="AUDIO" icon={<Mic size={20} />} active={state.activeMobileDrawer === 'AUDIO'} onClick={() => toggleDrawer('AUDIO')} />
            <DockBtn label="LAYERS" icon={<Layers size={20} />} active={state.activeMobileDrawer === 'OVERLAYS'} onClick={() => toggleDrawer('OVERLAYS')} />
            <DockBtn label="MACROS" icon={<Zap size={20} />} active={state.activeMobileDrawer === 'MACROS'} onClick={() => toggleDrawer('MACROS')} color="text-yellow-500" />
        </div>
    </div>
  );

  // --- LAYOUT B: LANDSCAPE ---
  const renderLandscape = () => (
    <div className="h-full w-full flex bg-black overflow-hidden relative">
        {/* Left: Monitors & Switcher */}
        <div className="flex-1 flex flex-col min-w-0">
            {/* Split Monitors */}
            <div className="flex-1 flex border-b border-gray-800">
                <div className="flex-1 relative border-r border-gray-800">
                    <MonitorView label="PREVIEW" source={state.sources[state.previewId]} type="PVW" className="border-0"/>
                </div>
                <div className="flex-1 relative">
                    <MonitorView 
                        label="PROGRAM" 
                        source={state.sources[state.programId]} 
                        type="PGM" 
                        showOverlays={true}
                        overlaysData={state.overlays}
                        sportsData={state.sportsState}
                        className="border-0"
                    />
                </div>
            </div>
            
            {/* Bottom Controls */}
            <div className="h-24 bg-[#111] flex p-2 gap-2">
                <div className="flex-1 flex gap-2 overflow-x-auto">
                    {sourcesList.map(src => (
                        <div key={src.id} className="min-w-[100px] h-full">
                            <SourceButton 
                                {...src}
                                label={src.name}
                                sourceType={src.type}
                                type={src.id === state.programId ? 'PGM' : src.id === state.previewId ? 'PVW' : 'PVW'} 
                                isActive={src.id === state.programId || src.id === state.previewId}
                                onClick={() => {
                                    onUpdateState({ previewId: src.id });
                                }}
                            />
                        </div>
                    ))}
                </div>
                <div className="w-32 flex flex-col gap-1">
                    <button onClick={() => { const p = state.programId; onUpdateState({ programId: state.previewId, previewId: p }); }} className="flex-1 bg-red-600 rounded font-black text-white text-sm shadow active:scale-95">CUT</button>
                    <button className="flex-1 bg-blue-600 rounded font-black text-white text-sm shadow active:scale-95">AUTO</button>
                </div>
            </div>
        </div>

        {/* Right Dock (Compact) */}
        <div className="w-16 bg-[#0a0a0a] border-l border-gray-800 flex flex-col items-center py-2 gap-2">
            <DockBtn label="AUDIO" icon={<Mic size={18}/>} active={state.activeMobileDrawer === 'AUDIO'} onClick={() => toggleDrawer('AUDIO')} />
            <DockBtn label="MODE" icon={<Activity size={18}/>} active={state.activeMobileDrawer === 'MODE'} onClick={() => toggleDrawer('MODE')} />
            <DockBtn label="GFX" icon={<Layers size={18}/>} active={state.activeMobileDrawer === 'OVERLAYS'} onClick={() => toggleDrawer('OVERLAYS')} />
            <div className="mt-auto">
                <DockBtn label="MACROS" icon={<Zap size={18}/>} active={state.activeMobileDrawer === 'MACROS'} onClick={() => toggleDrawer('MACROS')} color="text-yellow-500" />
            </div>
        </div>
        
        <PerformanceOverlay />
    </div>
  );

  return (
    <>
        {isPortrait ? renderPortrait() : renderLandscape()}

        {/* SHARED DRAWERS */}
        {state.activeMobileDrawer !== 'NONE' && (
            <div className="absolute inset-x-0 bottom-0 top-[40%] bg-[#1a1a1a] border-t border-gray-700 shadow-2xl z-[60] flex flex-col animate-[slideUp_0.2s]">
                <div className="flex justify-between items-center p-2 bg-[#222] border-b border-gray-800">
                    <span className="font-bold text-xs text-white uppercase ml-2">{state.activeMobileDrawer}</span>
                    <button onClick={() => toggleDrawer(state.activeMobileDrawer)} className="p-2 text-gray-400 hover:text-white"><X size={16}/></button>
                </div>
                <div className="flex-1 overflow-y-auto relative">
                    {state.activeMobileDrawer === 'CAMERAS' && (
                        <div className="p-4 grid grid-cols-2 gap-3">
                            {sourcesList.map(src => (
                                <SourceButton 
                                    key={src.id} 
                                    {...src} 
                                    label={src.name} 
                                    sourceType={src.type} 
                                    type={src.id === state.programId ? 'PGM' : 'PVW'} 
                                    isActive={src.id === state.programId} 
                                    onClick={() => onSourceSelect(src.id)} 
                                />
                            ))}
                        </div>
                    )}
                    {state.activeMobileDrawer === 'AUDIO' && (
                        <div className="h-full p-4 overflow-x-auto">
                            <div className="flex gap-4 h-full min-w-max">
                                <AudioMixer 
                                    channels={state.audioChannels} 
                                    masterLevel={state.masterLevel} 
                                    masterAudio={state.masterAudio} 
                                    djState={state.djState} 
                                    onChannelChange={onAudioUpdate} 
                                    onUpdateMaster={(m) => onUpdateState({ masterAudio: m })} 
                                    onUpdateDJ={(d) => onUpdateState({ djState: d })} 
                                />
                            </div>
                        </div>
                    )}
                    {state.activeMobileDrawer === 'MODE' && renderContextPanel()}
                    {state.activeMobileDrawer === 'OVERLAYS' && <GraphicsPanel state={state} onUpdateState={onUpdateState} />}
                    
                    {state.activeMobileDrawer === 'MACROS' && onTriggerMacro && (
                        <MacroGrid 
                            macros={SYSTEM_MACROS} 
                            onTrigger={onTriggerMacro}
                            executingId={state.macroExecuting}
                        />
                    )}

                    {state.activeMobileDrawer === 'REPLAY' && onPlayReplay && (
                        <ReplayController 
                            clips={state.replays}
                            speed={state.replaySpeed}
                            onSpeedChange={(s) => onUpdateState({ replaySpeed: s })}
                            onPlayClip={onPlayReplay}
                        />
                    )}
                </div>
            </div>
        )}
    </>
  );
};

const DockBtn = ({ label, icon, active, onClick, color }: any) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1 w-full h-14 rounded-lg transition-all ${active ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'} ${color || ''}`}
    >
        <div className={active ? 'scale-110 transition-transform' : ''}>{icon}</div>
        <span className="text-[8px] font-bold tracking-wide">{label}</span>
    </button>
);
