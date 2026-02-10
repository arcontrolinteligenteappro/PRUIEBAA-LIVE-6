
import React, { useEffect, useState } from 'react';
import { useBroadcastStore } from './core/store';
import { useResponsive } from './hooks/useResponsive';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { StudioControlLayout } from './components/StudioControlLayout';
import { MobileControlLayout } from './components/MobileControlLayout';
import { ModeSelector } from './components/ModeSelector';
import { CommercePanel } from './components/CommercePanel';
import { SportsControlPanel } from './components/SportsControlPanel';
import { PodcastControlPanel } from './components/PodcastControlPanel';
import { PodcastManager } from './components/PodcastManager';
import { StreamerControlPanel } from './components/StreamerControlPanel';
import { RightPanel } from './components/RightPanel';
import { SystemLogPanel } from './components/SystemLogPanel';
import { InputManagerModal } from './components/InputManagerModal';
import { analyzeState } from './services/geminiService';
import { Loader2, Bot, AlertOctagon } from 'lucide-react';
import { SplashScreen } from './boot/SplashScreen';
import { useSplashViewModel } from './boot/useSplashViewModel';
import { BootState } from './boot/bootState';


const App: React.FC = () => {
  const { bootState, startBootSequence } = useSplashViewModel();
  const [showApp, setShowApp] = useState(false);

  const state = useBroadcastStore();
  const { layoutMode, isMobile } = useResponsive();
  useKeyboardShortcuts(); // Init Shortcuts

  const [showModeSelector, setShowModeSelector] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Hide the pre-React splash once the main app component mounts
    const preSplash = document.getElementById('pre-splash');
    if (preSplash) {
      preSplash.style.display = 'none';
    }
    startBootSequence();
  }, []);

  // Master Clock Tick & Failsafe Monitor (1Hz)
  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentTime(new Date());
        if (state.flashSaleTimeRemaining !== null) state.tickFlashSale();

        // --- FAILSAFE MONITOR SIMULATION ---
        const cpuLoad = Math.random() * 100;
        const droppedFrames = Math.random() > 0.9 ? 5 : 0;
        
        // 1. CPU Overload Warning
        if (cpuLoad > 90) {
            state.addSystemLog('CRITICAL', 'CORE', `CPU Load Critical: ${Math.round(cpuLoad)}%`);
        } else if (cpuLoad > 70) {
            state.addSystemLog('WARNING', 'CORE', `CPU Load High: ${Math.round(cpuLoad)}%`);
        }

        // 2. Stream Drops
        if (state.output.isStreaming && droppedFrames > 0) {
            state.addSystemLog('WARNING', 'STREAM', `Dropped ${droppedFrames} frames. Check Network.`);
        }

        // 3. Audio Peak Warning
        if (state.masterAudio.masterVolume > 95) {
             state.addSystemLog('WARNING', 'AUDIO', 'Master Output Peaking > -1dBTP');
        }

    }, 2000); // Check every 2s
    return () => clearInterval(timer);
  }, [state.output.isStreaming, state.masterAudio.masterVolume]);

  // AI Director Analysis
  const handleAIAnalyze = async () => {
      setIsAnalyzing(true);
      const result = await analyzeState(state);
      setAiAnalysis(result);
      setIsAnalyzing(false);
      // Auto-hide suggestion after 15s
      setTimeout(() => setAiAnalysis(null), 15000);
  };

  // Context Panel Router (Strategy Pattern)
  const renderContextPanel = () => {
      switch (state.appMode) {
          case 'SHOPPING':
              return (
                  <CommercePanel 
                      products={state.products}
                      revenue={state.revenue}
                      destinations={state.destinations}
                      activeProductId={state.activeProductId}
                      flashSaleTimeRemaining={state.flashSaleTimeRemaining}
                      onToggleProduct={state.toggleProduct}
                      onTriggerAd={() => {}}
                      onStartFlashSale={state.startFlashSale}
                      onNextProduct={state.nextProduct}
                      onSimulatePurchase={state.simulatePurchase}
                      onUpdateProduct={state.updateProduct}
                      onToggleMusic={() => {}}
                      onPlayDemo={() => {}}
                      onToggleShipping={state.toggleShipping}
                      onToggleBundle={state.toggleBundle}
                      onApplyDiscount={state.applyDiscount}
                      onPinMessage={() => {}}
                  />
              );
          case 'SPORTS':
              return (
                  <SportsControlPanel 
                      state={state.sportsState}
                      opMode={state.opMode}
                      commercialMode={state.commercialMode}
                      onUpdate={(s) => useBroadcastStore.setState({ sportsState: s })}
                      onTriggerEvent={(type, desc) => console.log(`[SPORTS LOG] ${type}: ${desc}`)}
                      onToggleCommercial={(m) => useBroadcastStore.setState({ commercialMode: m })}
                  />
              );
          case 'PODCAST':
              if (state.podcastState.viewMode === 'MANAGER') {
                  return (
                      <PodcastManager 
                          series={state.podcastSeries}
                          episodes={state.podcastEpisodes}
                          onSelectEpisode={(id) => useBroadcastStore.setState({ 
                              podcastState: { ...state.podcastState, activeEpisodeId: id, viewMode: 'STUDIO' } 
                          })}
                      />
                  );
              }
              const activeEp = state.podcastEpisodes.find(ep => ep.id === state.podcastState.activeEpisodeId);
              return (
                  <PodcastControlPanel 
                      guests={state.guests}
                      state={state.podcastState}
                      socialFeed={state.socialFeed}
                      activeEpisode={activeEp || state.podcastEpisodes[0]}
                      onUpdateState={(s) => useBroadcastStore.setState({ podcastState: s })}
                      onUpdateGuest={(id, u) => {
                          const updated = state.guests.map(g => g.id === id ? { ...g, ...u } : g);
                          useBroadcastStore.setState({ guests: updated });
                      }}
                      onToggleSocial={(id) => {}}
                  />
              );
          case 'GAMING':
              return (
                  <StreamerControlPanel 
                      state={state.streamerState}
                      sources={Object.values(state.sources)}
                      audioChannels={state.audioChannels}
                      onUpdate={(s) => useBroadcastStore.setState({ streamerState: s })}
                      onTriggerAlert={() => {}}
                      onUpdateAudio={(ch) => state.updateAudioChannel(ch)}
                  />
              );
          default:
              return (
                  <RightPanel 
                      mode={state.appMode}
                      macros={state.macros || []} 
                      onTrigger={(m) => state.triggerMacro(m)}
                  />
              );
      }
  };

  if (!showApp) {
      return <SplashScreen bootState={bootState} onBootComplete={() => setShowApp(true)} />;
  }

  return (
    <div className="h-screen w-screen bg-[#0d0d0d] text-white overflow-hidden font-sans select-none relative animate-fadeIn">
        
        {/* MODAL: Mode Selector (Config) */}
        {showModeSelector && (
            <ModeSelector 
                currentMode={state.appMode}
                opMode={state.opMode}
                onSelectMode={(m) => { state.setMode(m); setShowModeSelector(false); }}
                onToggleOpMode={(m) => state.setLayout(m)}
                onClose={() => setShowModeSelector(false)}
            />
        )}

        {/* MODAL: Input Manager */}
        {state.ui.showInputManager && <InputManagerModal />}

        {/* MODAL: Logs */}
        {showLogs && (
            <SystemLogPanel logs={state.systemLogs} onClose={() => setShowLogs(false)} />
        )}

        {/* AI HEADS-UP DISPLAY (HUD) */}
        {aiAnalysis && (
            <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-xl shadow-2xl border-2 flex items-center gap-4 animate-[slideDown_0.5s] backdrop-blur-md ${aiAnalysis.status === 'SAFE' ? 'bg-green-900/90 border-green-500' : 'bg-red-900/90 border-red-500'}`}>
                <div className="bg-white/20 p-3 rounded-full flex items-center justify-center">
                    <Bot size={24} className="text-white" />
                </div>
                <div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">AI DIRECTOR SUGGESTION</div>
                    <div className="text-xl font-bold leading-none">{aiAnalysis.suggestedAction}</div>
                    <div className="text-xs font-mono opacity-80 mt-1.5 flex items-center gap-2">
                        <span className="bg-black/30 px-1.5 py-0.5 rounded">{aiAnalysis.technicalReasoning}</span>
                    </div>
                </div>
                <button onClick={() => setAiAnalysis(null)} className="absolute top-2 right-2 text-white/50 hover:text-white">✕</button>
            </div>
        )}

        {/* LOADING INDICATOR */}
        {isAnalyzing && (
            <div className="fixed top-14 right-4 z-[60] bg-blue-600 text-white px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2 shadow-lg animate-pulse border border-blue-400">
                <Loader2 size={12} className="animate-spin" /> ANALYZING STATE...
            </div>
        )}

        {/* CRITICAL ALERT TOAST (Latest) */}
        {state.systemLogs.length > 0 && state.systemLogs[0].level === 'CRITICAL' && (
             <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[90] bg-red-600 text-white px-6 py-2 rounded-full shadow-2xl animate-pulse flex items-center gap-2 font-bold cursor-pointer hover:bg-red-700" onClick={() => setShowLogs(true)}>
                 <AlertOctagon size={16} /> SYSTEM ALERT: {state.systemLogs[0].message}
             </div>
        )}

        {/* MAIN LAYOUT ENGINE */}
        {isMobile ? (
            <MobileControlLayout 
                state={state}
                layoutMode={layoutMode}
                onUpdateState={(u) => useBroadcastStore.setState(u)}
                onSourceSelect={(id) => {
                    // Mobile Touch Logic
                    if (state.opMode === 'SINGLE') {
                        useBroadcastStore.getState().setProgram(id);
                    } else {
                        useBroadcastStore.getState().setPreview(id);
                    }
                }}
                onAudioUpdate={(ch) => state.updateAudioChannel(ch)}
                renderContextPanel={renderContextPanel}
                onTriggerMacro={(m) => state.triggerMacro(m)}
                onPlayReplay={(clip) => console.log('Playing replay:', clip)}
            />
        ) : (
            <StudioControlLayout 
                state={state}
                layoutMode={layoutMode}
                time={currentTime}
                onUpdateState={(u) => useBroadcastStore.setState(u)}
                onSourcePreview={state.setPreview}
                onSourceProgram={state.setProgram}
                onAudioUpdate={(ch) => state.updateAudioChannel(ch)}
                renderContextPanel={renderContextPanel}
                toggleSocialOnAir={(id) => {}}
                onPlayReplay={(clip) => console.log('Playing replay:', clip)}
            />
        )}

        {/* GLOBAL FLOATING ACTIONS */}
        <div className="fixed bottom-4 right-4 z-[50] flex flex-col gap-2">
            <button 
                onClick={handleAIAnalyze} 
                className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-full shadow-xl transition-transform hover:scale-110 border-2 border-purple-400"
                title="Ask AI Director"
            >
                <Bot size={20} />
            </button>
            <button 
                onClick={() => setShowLogs(!showLogs)} 
                className={`p-3 rounded-full shadow-lg transition-all border ${state.systemLogs.find(l => l.level === 'CRITICAL') ? 'bg-red-600 border-red-400 animate-pulse text-white' : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-white hover:text-black'}`}
                title="System Logs"
            >
                <AlertOctagon size={20} />
            </button>
            <button 
                onClick={() => setShowModeSelector(true)} 
                className="bg-gray-800 hover:bg-white hover:text-black text-gray-300 p-3 rounded-full shadow-lg transition-all border border-gray-600"
                title="System Config"
            >
                <Loader2 size={20} className={isAnalyzing ? "animate-spin" : ""} />
            </button>
        </div>

    </div>
  );
};

export default App;