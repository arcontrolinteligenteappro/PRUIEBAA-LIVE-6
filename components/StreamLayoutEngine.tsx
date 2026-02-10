
import React from 'react';
import { StreamScene, EngagementAlert, VideoSource, StreamerSafeMode } from '../types';
import { ShieldAlert, MessageSquare, Gamepad2, Coffee, Video, Radio, VolumeX, RefreshCw, LogOut } from 'lucide-react';

interface StreamLayoutEngineProps {
  scene: StreamScene;
  gameSource?: VideoSource;
  faceCamSource?: VideoSource;
  alerts: EngagementAlert[];
  privacyMode: boolean; // Legacy
  safeMode?: StreamerSafeMode; // New Granular
}

export const StreamLayoutEngine: React.FC<StreamLayoutEngineProps> = ({ 
    scene, gameSource, faceCamSource, alerts, privacyMode, safeMode 
}) => {
  
  // Consolidate safe mode flags
  const isBlurred = privacyMode || safeMode?.blurScreen;
  const isChatHidden = safeMode?.hideChat;
  const isGameMuted = safeMode?.muteGame;
  const isOverlayHidden = safeMode?.hideOverlay;

  // --- HELPERS FOR SOURCES ---
  const renderGame = () => {
      if (!gameSource) return <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-600"><Gamepad2 size={64}/> NO GAME SOURCE</div>;
      
      return (
          <div className="w-full h-full relative">
              <img src={gameSource.previewUrl} className="w-full h-full object-cover" />
              {isGameMuted && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
                      <VolumeX size={12}/> GAME MUTED
                  </div>
              )}
          </div>
      );
  };

  const renderFaceCam = (className: string) => {
      if (!faceCamSource) return null;
      return (
          <div className={`${className} bg-black overflow-hidden border-2 border-purple-500 shadow-xl relative group`}>
              <img src={faceCamSource.previewUrl} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 bg-purple-600 px-2 py-0.5 text-[8px] font-bold text-white">LIVE</div>
              {safeMode?.muteMic && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-red-500 animate-pulse">
                      <VolumeX size={32}/>
                  </div>
              )}
          </div>
      );
  };

  // --- PRIVACY LAYER ---
  const PrivacyOverlay = () => {
      if (!isBlurred) return null;
      return (
          <div className="absolute inset-0 z-50 backdrop-blur-3xl bg-black/80 flex flex-col items-center justify-center animate-[fadeIn_0.2s]">
              <ShieldAlert size={80} className="text-red-500 mb-4 animate-pulse" />
              <h2 className="text-5xl font-black text-white tracking-tighter">SAFE MODE</h2>
              <p className="text-gray-400 mt-2 font-mono text-lg">Video feed hidden for privacy.</p>
          </div>
      );
  };

  // --- ALERT BOX LAYER ---
  const AlertLayer = () => {
      const activeAlert = alerts.find(a => a.isActive);
      if (!activeAlert || isOverlayHidden) return null;

      return (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 animate-[bounce_0.5s]">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-1 rounded-xl shadow-[0_0_50px_rgba(147,51,234,0.5)]">
                  <div className="bg-[#111] rounded-lg p-6 flex flex-col items-center min-w-[300px]">
                      <div className="text-6xl mb-2">🎉</div>
                      <div className="text-2xl font-black text-white uppercase italic">{activeAlert.type} ALERT!</div>
                      <div className="text-lg text-purple-300 font-bold mt-1">{activeAlert.user}</div>
                      {activeAlert.message && <div className="text-sm text-gray-400 mt-2 text-center">"{activeAlert.message}"</div>}
                      {activeAlert.amount && <div className="text-xl font-mono font-black text-green-400 mt-2">{activeAlert.amount}</div>}
                  </div>
              </div>
          </div>
      );
  };

  // --- CENSOR BEEP OVERLAY ---
  const CensorOverlay = () => {
      if (!safeMode?.censorBeep) return null;
      return (
          <div className="absolute inset-0 z-[60] bg-white mix-blend-difference flex items-center justify-center">
              <div className="text-black font-black text-9xl">🤬</div>
          </div>
      );
  };

  // --- SCENE RENDERING ---

  if (scene === 'STARTING') {
      return (
          <div className="w-full h-full bg-gradient-to-br from-purple-900 to-black flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <h1 className="text-6xl font-black text-white italic tracking-tighter z-10 animate-pulse">STARTING SOON</h1>
              <div className="mt-8 flex gap-4 text-purple-300 z-10 font-mono">
                  <div className="flex items-center gap-2"><Radio size={16}/> LIVE IN 5:00</div>
              </div>
              <PrivacyOverlay />
          </div>
      );
  }

  if (scene === 'ENDING') {
      return (
          <div className="w-full h-full bg-black flex flex-col items-center justify-center relative">
              <LogOut size={64} className="text-gray-600 mb-4"/>
              <h1 className="text-6xl font-black text-white italic tracking-tighter mb-4">THANKS FOR WATCHING</h1>
              <div className="flex gap-4">
                  <span className="text-gray-500 font-bold">@MyChannel</span>
                  <span className="text-gray-500 font-bold">discord.gg/stream</span>
              </div>
              <PrivacyOverlay />
          </div>
      );
  }

  if (scene === 'BREAK') {
      return (
          <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center relative">
              <Coffee size={80} className="text-yellow-500 mb-6 animate-bounce" />
              <h1 className="text-5xl font-black text-white">BE RIGHT BACK</h1>
              <p className="text-gray-400 mt-2">Don't go anywhere!</p>
              <PrivacyOverlay /> 
          </div>
      );
  }

  if (scene === 'REPLAY') {
      return (
          <div className="w-full h-full bg-black flex items-center justify-center relative">
              {renderGame()}
              <div className="absolute top-8 left-8 flex items-center gap-2 bg-red-600 text-white px-4 py-2 font-black text-xl italic tracking-widest border-2 border-white shadow-lg animate-pulse">
                  <RefreshCw size={24} className="animate-spin-slow" /> INSTANT REPLAY
              </div>
              <PrivacyOverlay />
          </div>
      );
  }

  if (scene === 'CHATTING') {
      return (
          <div className="w-full h-full bg-[#1a1a1a] flex relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-transparent"></div>
              
              {/* Camera Area (Large) */}
              <div className="w-[70%] h-full relative p-8 flex items-center">
                  <div className="w-full aspect-video shadow-2xl border-4 border-gray-800 rounded-lg overflow-hidden bg-black relative">
                      {faceCamSource ? <img src={faceCamSource.previewUrl} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-500"><Video size={48}/> NO CAM</div>}
                      {safeMode?.muteMic && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-red-500">
                              <VolumeX size={48}/>
                          </div>
                      )}
                  </div>
              </div>

              {/* Chat Area (Right Side) */}
              {!isChatHidden && (
                  <div className="w-[30%] h-full bg-black/50 border-l border-white/10 p-4 flex flex-col">
                      <div className="flex items-center gap-2 text-white font-bold mb-4 border-b border-gray-700 pb-2">
                          <MessageSquare size={18} /> STREAM CHAT
                      </div>
                      <div className="flex-1 overflow-hidden relative">
                          {/* Simulated Chat Messages */}
                          <div className="absolute bottom-0 w-full flex flex-col gap-2">
                              <div className="text-sm"><span className="font-bold text-blue-400">User1:</span> PogChamp!</div>
                              <div className="text-sm"><span className="font-bold text-green-400">Mod:</span> Welcome to the stream</div>
                              <div className="text-sm"><span className="font-bold text-purple-400">Sub24:</span> Lets goooo</div>
                          </div>
                      </div>
                  </div>
              )}

              <AlertLayer />
              <PrivacyOverlay />
              <CensorOverlay />
          </div>
      );
  }

  // DEFAULT: GAME SCENE
  return (
      <div className="w-full h-full bg-black relative overflow-hidden">
          {/* Layer 0: Game Feed */}
          {renderGame()}

          {/* Layer 1: Face Cam PiP */}
          {renderFaceCam("absolute bottom-4 right-4 w-64 aspect-video shadow-2xl")}

          {/* Layer 2: Overlays (Top Bar) */}
          {!isOverlayHidden && (
              <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between px-6 text-white font-bold font-mono text-sm">
                  <div className="flex gap-6">
                      <span className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> LIVE</span>
                      <span className="text-purple-400">LATEST SUB: GamerX</span>
                      <span className="text-green-400">DONATION: $10.00</span>
                  </div>
              </div>
          )}

          <AlertLayer />
          <PrivacyOverlay />
          <CensorOverlay />
      </div>
  );
};
