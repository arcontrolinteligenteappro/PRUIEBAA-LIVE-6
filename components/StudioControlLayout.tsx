
import React, { useState } from 'react';
import { BroadcastState, NavTab, VideoSource, AudioChannel, ReplayClip } from '../types';
import { LayoutMode } from '../hooks/useResponsive';
import { TopBar } from './TopBar';
import { MonitorView } from './MonitorView';
import { StudioSourceGrid } from './StudioSourceGrid';
import { StudioRightPanel } from './StudioRightPanel';
import { AudioMixer } from './AudioMixer';
import { AudioMasterSection } from './AudioMasterSection';
import { FaderControl } from './FaderControl';
import { ReplayController } from './ReplayController';
import { PerformanceOverlay } from './PerformanceOverlay';
import { Monitor, Music, Layers, Image, PlaySquare, Maximize2, Grid, RefreshCw, Plus, Plane } from 'lucide-react';
import { useBroadcastStore } from '../core/store';
import { InputManagerModal } from './InputManagerModal';
import { DroneControlPanel } from './DroneControlPanel';
import { HardwareSwitcherStatus } from './HardwareSwitcherStatus';

interface StudioControlLayoutProps {
  state: BroadcastState;
  layoutMode: LayoutMode;
  time: Date;
  onUpdateState: (updates: Partial<BroadcastState>) => void;
  onSourcePreview: (id: string) => void;
  onSourceProgram: (id: string) => void;
  onAudioUpdate: (channel: AudioChannel) => void;
  renderContextPanel: () => React.ReactNode;
  toggleSocialOnAir: (id: string) => void;
  onPlayReplay: (clip: ReplayClip) => void;
}

export const StudioControlLayout: React.FC<StudioControlLayoutProps> = ({ 
    state, layoutMode, time, onUpdateState, onSourcePreview, onSourceProgram, onAudioUpdate, renderContextPanel, toggleSocialOnAir, onPlayReplay 
}) => {
  const [leftTab, setLeftTab] = useState<'SCENES' | 'MEDIA' | 'GFX' | 'REPLAY' | 'DRONE'>('SCENES');
  const isPortrait = layoutMode === 'TABLET_PORTRAIT';
  const { toggleInputManager, updateDrone } = useBroadcastStore();

  const performTransition = () => {
      const pvw = state.previewId;
      onUpdateState({ previewId: state.programId, programId: pvw, transitionProgress: 0 });
  };

  const sourcesList = state.sourceOrder.map(id => state.sources[id]).filter(Boolean);

  // --- LAYOUT C: TABLET PORTRAIT ---
  const renderTabletPortrait = () => (
      <div className="h-full flex flex-col bg-[#0d0d0d] relative">
          <HardwareSwitcherStatus state={state.hardwareSwitcher} />
          
          {/* Top Monitors (Stacked Vertically) */}
          <div className="h-[40%] flex flex-col">
              <div className="flex-1 bg-black border-b border-gray-800 relative">
                  <div className="absolute top-2 left-2 z-10 bg-green-700 text-white text-[10px] font-bold px-2 py-0.5 rounded">PVW</div>
                  <MonitorView label="" source={state.sources[state.previewId]} type="PVW" className="border-0 w-full h-full"/>
              </div>
              <div className="flex-1 bg-black border-b border-gray-800 relative">
                  <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">PGM</div>
                  <MonitorView label="" source={state.sources[state.programId]} type="PGM" className="border-0 w-full h-full" showOverlays={true} overlaysData={state.overlays} sportsData={state.sportsState} commercialMode={state.commercialMode} />
              </div>
          </div>

          {/* Middle: MultiView / Grid */}
          <div className="h-[20%] bg-[#151515] p-2 overflow-y-auto">
              <StudioSourceGrid 
                  sources={sourcesList} 
                  previewId={state.previewId} 
                  programId={state.programId} 
                  onSelectPreview={onSourcePreview} 
                  onSelectProgram={onSourceProgram} 
                  onSettings={(id) => onUpdateState({ editingSourceId: id })} 
              />
          </div>

          {/* Bottom: Context Panel */}
          <div className="flex-1 bg-[#111] border-t border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 z-10 p-2">
                  <button onClick={() => onUpdateState({ activeNavTab: 'AUDIO' })} className="bg-gray-800 p-2 rounded text-white"><Music size={16}/></button>
              </div>
              {renderContextPanel()}
          </div>
          <PerformanceOverlay />
      </div>
  );

  // --- LAYOUT D: TABLET LANDSCAPE (Broadcast Standard) ---
  const renderTabletLandscape = () => (
      <div className="flex-1 flex overflow-hidden relative">
          <HardwareSwitcherStatus state={state.hardwareSwitcher} />

          {/* LEFT: SOURCES & ASSETS */}
          <div className="w-[20%] min-w-[250px] bg-[#151515] border-r border-gray-800 flex flex-col">
              <div className="flex h-10 border-b border-gray-800 overflow-x-auto">
                  <TabBtn label="SCENES" active={leftTab === 'SCENES'} onClick={() => setLeftTab('SCENES')} icon={<Monitor size={14}/>} />
                  <TabBtn label="REPLAY" active={leftTab === 'REPLAY'} onClick={() => setLeftTab('REPLAY')} icon={<RefreshCw size={14}/>} />
                  <TabBtn label="DRONE" active={leftTab === 'DRONE'} onClick={() => setLeftTab('DRONE')} icon={<Plane size={14}/>} />
                  <TabBtn label="GFX" active={leftTab === 'GFX'} onClick={() => setLeftTab('GFX')} icon={<Layers size={14}/>} />
              </div>
              <div className="flex-1 relative overflow-hidden flex flex-col">
                  {leftTab === 'SCENES' && (
                      <>
                        <StudioSourceGrid 
                            sources={sourcesList}
                            previewId={state.previewId}
                            programId={state.programId}
                            onSelectPreview={onSourcePreview}
                            onSelectProgram={onSourceProgram}
                            onSettings={(id) => onUpdateState({ editingSourceId: id })}
                        />
                        <button 
                            onClick={() => toggleInputManager(true)} 
                            className="m-2 py-3 bg-gray-800 hover:bg-gray-700 border border-dashed border-gray-600 rounded text-xs font-bold text-gray-400 flex items-center justify-center gap-2"
                        >
                            <Plus size={14} /> ADD SOURCE
                        </button>
                      </>
                  )}
                  {leftTab === 'REPLAY' && (
                      <ReplayController 
                          clips={state.replays}
                          speed={state.replaySpeed}
                          onSpeedChange={(s) => onUpdateState({ replaySpeed: s })}
                          onPlayClip={onPlayReplay}
                          orientation="vertical"
                      />
                  )}
                  {leftTab === 'DRONE' && (
                      <DroneControlPanel 
                          state={state.droneState}
                          onUpdate={(u) => updateDrone(u)}
                      />
                  )}
                  {leftTab === 'GFX' && (
                      <div className="p-4 text-center text-gray-500 text-xs mt-10">GFX LIBRARY PLACEHOLDER</div>
                  )}
              </div>
          </div>

          {/* CENTER: MONITORS & WORKSPACE */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#111]">
              {/* Monitors */}
              <div className="h-[50%] p-2 flex gap-2 border-b border-gray-800">
                  <div className="flex-1 flex flex-col bg-black rounded border border-gray-700 relative">
                      <div className="absolute top-2 left-2 z-10 bg-green-700 text-white text-[10px] font-bold px-2 py-0.5 rounded">PREVIEW</div>
                      <MonitorView 
                          label="" 
                          source={state.sources[state.previewId]} 
                          type="PVW" 
                          className="border-0 w-full h-full"
                      />
                  </div>
                  
                  {/* T-Bar */}
                  <div className="w-16 flex flex-col items-center gap-2 py-2">
                      <button onClick={performTransition} className="w-full bg-white text-black font-black text-xs py-3 rounded hover:bg-gray-200 active:scale-95">CUT</button>
                      <button className="w-full bg-blue-600 text-white font-black text-xs py-3 rounded hover:bg-blue-500 active:scale-95">AUTO</button>
                      <div className="flex-1 w-full">
                          <FaderControl value={state.transitionProgress} onChange={(v) => onUpdateState({ transitionProgress: v })} onCommit={performTransition} />
                      </div>
                  </div>

                  <div className="flex-1 flex flex-col bg-black rounded border-2 border-red-800 relative shadow-[0_0_20px_rgba(150,0,0,0.2)]">
                      <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">PROGRAM</div>
                      <MonitorView 
                          label="" 
                          source={state.sources[state.programId]} 
                          type="PGM" 
                          showOverlays={true}
                          overlaysData={state.overlays}
                          sportsData={state.sportsState}
                          commercialMode={state.commercialMode}
                          activeSocial={state.socialFeed.find(s => s.isOnAir)}
                          isPodcastMode={state.appMode === 'PODCAST'}
                          podcastState={state.podcastState}
                          guests={state.guests}
                          isGamingMode={state.appMode === 'GAMING'}
                          streamerState={state.streamerState}
                          allSources={sourcesList}
                          sponsors={state.sponsors}
                          className="border-0 w-full h-full"
                      />
                  </div>
              </div>

              {/* Context Panel */}
              <div className="flex-1 bg-[#151515] overflow-hidden flex flex-col relative pb-8">
                  <div className="h-8 bg-[#1a1a1a] border-b border-gray-800 flex items-center px-4">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{state.appMode} CONTROL</span>
                  </div>
                  <div className="flex-1 overflow-y-auto relative">
                      {renderContextPanel()}
                  </div>
                  <PerformanceOverlay />
              </div>
          </div>

          {/* RIGHT: AUDIO PRO */}
          <div className="w-[20%] min-w-[280px] bg-[#111] border-l border-gray-800 flex flex-col">
              <AudioMasterSection state={state.masterAudio} onUpdate={(m) => onUpdateState({ masterAudio: m })} />
              <div className="flex-1 overflow-hidden relative border-t border-gray-800">
                  <AudioMixer 
                      channels={state.audioChannels} 
                      masterLevel={state.masterLevel}
                      masterAudio={state.masterAudio}
                      djState={state.djState}
                      onChannelChange={onAudioUpdate} 
                      onEditChannel={(id) => onUpdateState({ editingAudioId: id })}
                      onUpdateMaster={(nm) => onUpdateState({ masterAudio: nm })}
                      onUpdateDJ={(ndj) => onUpdateState({ djState: ndj })}
                  />
              </div>
          </div>
      </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0d0d0d] overflow-hidden text-gray-200">
        <TopBar 
            stats={state.systemStats} 
            recording={state.recording} 
            streaming={state.streaming} 
            time={time} 
            onOpenConfig={() => {}} 
            onToggleRec={() => onUpdateState({ recording: !state.recording })}
            onToggleStream={() => onUpdateState({ streaming: !state.streaming })}
        />
        {isPortrait ? renderTabletPortrait() : renderTabletLandscape()}
        
        {/* Input Manager Modal */}
        {state.ui.showInputManager && <InputManagerModal />}
    </div>
  );
};

const TabBtn = ({ label, active, onClick, icon }: any) => (
    <button 
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 text-[10px] font-bold transition-colors min-w-[60px] ${active ? 'bg-[#151515] text-white border-t-2 border-blue-500' : 'bg-[#0f0f0f] text-gray-500 hover:text-gray-300'}`}
    >
        {icon} {label}
    </button>
);
