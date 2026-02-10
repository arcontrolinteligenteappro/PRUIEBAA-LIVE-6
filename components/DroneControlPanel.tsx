
import React from 'react';
import { DroneState } from '../types';
import { Battery, Signal, Wifi, Camera, Video, AlertTriangle, ArrowUp, Navigation, Target, Activity } from 'lucide-react';

interface DroneControlPanelProps {
  state: DroneState;
  onUpdate: (updates: Partial<DroneState>) => void;
}

export const DroneControlPanel: React.FC<DroneControlPanelProps> = ({ state, onUpdate }) => {
  
  // --- VISUALIZERS ---
  const StickVisualizer = ({ x, y, label }: { x: number, y: number, label: string }) => (
      <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-full border-2 border-gray-600 bg-[#111] relative shadow-inner">
              {/* Crosshair */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-800"></div>
              <div className="absolute left-1/2 top-0 h-full w-[1px] bg-gray-800"></div>
              
              {/* Stick Puck */}
              <div 
                  className="absolute w-6 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] border-2 border-white transition-transform duration-75"
                  style={{
                      left: `calc(50% - 12px + ${x * 40}px)`,
                      top: `calc(50% - 12px + ${y * 40}px)`
                  }}
              ></div>
          </div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
      </div>
  );

  const GimbalIndicator = ({ pitch }: { pitch: number }) => (
      <div className="w-8 h-32 bg-[#222] rounded border border-gray-700 relative overflow-hidden flex justify-center">
          {/* Tick Marks */}
          <div className="absolute inset-0 flex flex-col justify-between py-2 opacity-30">
              {[...Array(9)].map((_, i) => <div key={i} className="w-full h-[1px] bg-gray-500"></div>)}
          </div>
          
          {/* Indicator */}
          <div 
            className="absolute w-full h-1 bg-yellow-500 shadow-[0_0_5px_yellow] transition-all duration-100"
            style={{ top: `${((pitch + 90) / 110) * 100}%` }} // Map -90..20 to 0..100
          ></div>
          <span className="absolute bottom-1 text-[8px] font-mono text-white">{Math.round(pitch)}°</span>
      </div>
  );

  return (
    <div className="flex h-full bg-[#0d0d0d] font-sans text-gray-200 overflow-hidden">
        
        {/* LEFT: TELEMETRY & STATUS */}
        <div className="w-64 bg-[#151515] border-r border-gray-800 flex flex-col p-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Navigation size={18} className="text-blue-500" />
                    <div>
                        <h3 className="text-xs font-black text-white">{state.model}</h3>
                        <span className={`text-[9px] font-bold ${state.connected ? 'text-green-500' : 'text-red-500'}`}>
                            {state.connected ? 'CONNECTED' : 'DISCONNECTED'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Vital Stats */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center bg-[#222] p-2 rounded">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1"><Battery size={12}/> BATTERY</span>
                    <span className={`text-xs font-mono font-bold ${state.battery < 20 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>{state.battery}%</span>
                </div>
                <div className="flex justify-between items-center bg-[#222] p-2 rounded">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1"><Signal size={12}/> SIGNAL</span>
                    <span className="text-xs font-mono font-bold text-white">{state.signalStrength}%</span>
                </div>
                <div className="flex justify-between items-center bg-[#222] p-2 rounded">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1"><ArrowUp size={12}/> ALTITUDE</span>
                    <span className="text-xs font-mono font-bold text-blue-300">{state.altitude}m</span>
                </div>
                <div className="flex justify-between items-center bg-[#222] p-2 rounded">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1"><Activity size={12}/> SPEED</span>
                    <span className="text-xs font-mono font-bold text-white">{state.speed} m/s</span>
                </div>
            </div>

            {/* Camera Settings */}
            <div className="space-y-2 border-t border-gray-800 pt-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Camera Settings</label>
                <div className="grid grid-cols-2 gap-2">
                    <button className="bg-[#222] border border-gray-700 rounded p-1 text-[10px] font-mono hover:bg-gray-700">ISO {state.iso}</button>
                    <button className="bg-[#222] border border-gray-700 rounded p-1 text-[10px] font-mono hover:bg-gray-700">{state.shutter}</button>
                    <button className="bg-[#222] border border-gray-700 rounded p-1 text-[10px] font-mono hover:bg-gray-700">4K 60</button>
                    <button className="bg-[#222] border border-gray-700 rounded p-1 text-[10px] font-mono hover:bg-gray-700">ND 16</button>
                </div>
            </div>
        </div>

        {/* CENTER: VIRTUAL CONTROLLER & FEEDBACK */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#111] relative">
            <div className="flex gap-16 items-center">
                <StickVisualizer x={state.stickInput.leftX} y={state.stickInput.leftY} label="GIMBAL / YAW" />
                
                {/* Center HUD */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-4">
                        <GimbalIndicator pitch={state.gimbalPitch} />
                        <div className="w-32 h-32 border-2 border-white/20 rounded-full flex items-center justify-center relative">
                            {/* Artificial Horizon Mockup */}
                            <div className="w-full h-[1px] bg-blue-500 absolute"></div>
                            <div className="h-4 w-4 border border-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse">
                            <AlertTriangle size={14} /> EMERGENCY BRAKE
                        </button>
                    </div>
                </div>

                <StickVisualizer x={state.stickInput.rightX} y={state.stickInput.rightY} label="PITCH / ROLL" />
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-8 flex gap-4">
                <button className="bg-[#222] border border-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded font-bold text-xs flex items-center gap-2">
                    <Target size={16}/> RETURN TO HOME
                </button>
                <button 
                    className={`px-6 py-3 rounded font-bold text-xs flex items-center gap-2 border ${state.recording ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-[#222] border-gray-600 text-gray-300'}`}
                    onClick={() => onUpdate({ recording: !state.recording })}
                >
                    <Video size={16}/> {state.recording ? 'REC ACTIVE' : 'START REC'}
                </button>
            </div>
        </div>

        {/* RIGHT: PRESETS */}
        <div className="w-48 bg-[#151515] border-l border-gray-800 p-4 flex flex-col">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Camera size={14}/> Gimbal Presets</h3>
            <div className="space-y-2">
                <button onClick={() => onUpdate({ gimbalPitch: 0 })} className="w-full bg-[#222] hover:bg-gray-700 p-3 rounded border border-gray-700 text-left text-xs font-bold text-white">HORIZON (0°)</button>
                <button onClick={() => onUpdate({ gimbalPitch: -45 })} className="w-full bg-[#222] hover:bg-gray-700 p-3 rounded border border-gray-700 text-left text-xs font-bold text-white">45° DOWN</button>
                <button onClick={() => onUpdate({ gimbalPitch: -90 })} className="w-full bg-[#222] hover:bg-gray-700 p-3 rounded border border-gray-700 text-left text-xs font-bold text-white">TOP DOWN (-90°)</button>
                <button onClick={() => onUpdate({ gimbalPitch: 15 })} className="w-full bg-[#222] hover:bg-gray-700 p-3 rounded border border-gray-700 text-left text-xs font-bold text-white">LOOK UP (+15°)</button>
            </div>
        </div>

    </div>
  );
};
