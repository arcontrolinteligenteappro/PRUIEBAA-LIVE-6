
import React from 'react';
import { UniversalSportsState } from '../types';
import { UniversalScorebug } from './UniversalScorebug';
import { BaseballGraphics } from './BaseballGraphics';
import { Activity, Target, Map, Flag, Users, Clock } from 'lucide-react';

interface SportsGraphicsEngineProps {
  data: UniversalSportsState;
}

export const SportsGraphicsEngine: React.FC<SportsGraphicsEngineProps> = ({ data }) => {
  const { activeGraphic, activeSport } = data;

  // --- AR LAYER (Rendered under everything but over video) ---
  const renderARLayer = () => {
      if (activeSport === 'FOOTBALL' && data.football) {
          // Simulated 1st Down Line
          return (
              <div className="absolute inset-0 pointer-events-none opacity-60">
                  {/* Scrimmage */}
                  <div className="absolute top-[40%] left-0 w-full h-1 bg-blue-600/80 shadow-[0_0_10px_blue] transform skew-x-[45deg]"></div>
                  {/* First Down */}
                  <div className="absolute top-[30%] left-0 w-full h-1.5 bg-yellow-500/90 shadow-[0_0_15px_yellow] transform skew-x-[45deg]"></div>
              </div>
          );
      }
      return null;
  };

  // --- CONTEXT GRAPHICS (Mid/Lower Layers) ---
  const renderContextLayer = () => {
      // Baseball specific heavy graphics
      if (activeSport === 'BASEBALL' && data.baseball) {
          if (activeGraphic === 'LOWER_THIRD_PLAYER') {
              return <BaseballGraphics type="DUE_UP" data={data.baseball} />;
          }
          if (activeGraphic === 'FULL_STATS') {
              return <BaseballGraphics type="PITCHER_STATS" data={data.baseball} />;
          }
      }

      // Soccer VAR Overlay
      if (activeSport === 'SOCCER' && data.soccer?.varStatus !== 'NONE') {
          const status = data.soccer?.varStatus;
          let color = 'bg-yellow-500';
          let text = 'VAR CHECKING';
          if (status === 'REVIEW') { color = 'bg-purple-600'; text = 'OFFICIAL REVIEW'; }
          if (status === 'DECISION_GOAL') { color = 'bg-green-600'; text = 'GOAL CONFIRMED'; }
          if (status === 'DECISION_NO_GOAL') { color = 'bg-red-600'; text = 'NO GOAL'; }

          return (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 animate-[slideDown_0.3s]">
                  <div className={`px-6 py-2 ${color} text-white font-black text-2xl tracking-widest rounded shadow-xl border-2 border-white`}>
                      {text}
                  </div>
                  <div className="bg-black/80 text-white text-center text-xs font-bold py-1 mt-1 rounded">POSSIBLE OFFSIDE</div>
              </div>
          );
      }

      return null;
  };

  // --- STATS OVERLAY (Sabermetrics / Telemetry) ---
  const renderStatsLayer = () => {
      // Motorsports Telemetry
      if (activeSport === 'MOTORSPORTS' && data.motorsports) {
          const t = data.motorsports.telemetry;
          return (
            <div className="absolute bottom-8 left-8 bg-[#111]/90 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-2xl animate-[slideRight_0.3s]">
              <div className="flex gap-6 items-end">
                  {/* Speed & Gear */}
                  <div className="flex flex-col items-center">
                      <div className="text-6xl font-black text-white italic tracking-tighter leading-none">{t.speed}</div>
                      <div className="text-xs font-bold text-gray-400">KPH</div>
                  </div>
                  <div className="bg-blue-600 text-white w-16 h-16 flex items-center justify-center text-4xl font-black rounded">
                      {t.gear}
                  </div>
                  
                  {/* Pedals */}
                  <div className="flex gap-2 h-16">
                      <div className="flex flex-col items-center">
                          <div className="w-4 flex-1 bg-gray-800 rounded relative overflow-hidden">
                              <div className="absolute bottom-0 w-full bg-green-500 transition-all" style={{ height: `${t.throttle}%` }}></div>
                          </div>
                          <span className="text-[9px] font-bold text-gray-400 mt-1">THR</span>
                      </div>
                      <div className="flex flex-col items-center">
                          <div className="w-4 flex-1 bg-gray-800 rounded relative overflow-hidden">
                              <div className="absolute bottom-0 w-full bg-red-500 transition-all" style={{ height: `${t.brake}%` }}></div>
                          </div>
                          <span className="text-[9px] font-bold text-gray-400 mt-1">BRK</span>
                      </div>
                  </div>

                  {/* G-Force */}
                  <div className="w-20 h-20 bg-black rounded-full border border-gray-600 relative flex items-center justify-center">
                      <div className="w-1 h-full bg-gray-800 absolute"></div>
                      <div className="h-1 w-full bg-gray-800 absolute"></div>
                      <div 
                        className="w-3 h-3 bg-yellow-500 rounded-full absolute shadow-[0_0_5px_yellow] transition-all duration-100"
                        style={{ transform: `translate(${t.gForce.x * 20}px, ${t.gForce.y * -20}px)` }}
                      ></div>
                      <span className="absolute bottom-1 text-[8px] text-gray-500">G-FORCE</span>
                  </div>
              </div>
          </div>
          );
      }

      // Basketball Shot Chart
      if (activeSport === 'BASKETBALL' && data.basketball && activeGraphic === 'FULL_STATS') {
          return (
            <div className="absolute top-20 right-20 w-64 h-64 bg-black/80 border border-gray-600 rounded-lg p-2 animate-[fadeIn_0.5s]">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><Target size={12}/> Shot Chart</div>
                <div className="relative w-full h-full border border-white/20 rounded-b-3xl">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 border border-orange-500 rounded-full"></div>
                    {data.basketball.shotChart.map((shot, i) => (
                        <div 
                            key={i} 
                            className={`absolute w-3 h-3 rounded-full border border-black ${shot.made ? 'bg-green-500' : 'bg-red-500'} shadow-sm`}
                            style={{ left: `${shot.x}%`, top: `${shot.y}%` }}
                        ></div>
                    ))}
                </div>
            </div>
          );
      }

      // Soccer Momentum
      if (activeSport === 'SOCCER' && data.soccer && activeGraphic === 'FULL_STATS') {
          return (
            <div className="absolute bottom-8 right-8 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-gray-600 animate-[slideUp_0.5s]">
                <div className="text-xs font-bold text-gray-400 mb-2 uppercase flex items-center gap-2"><Activity size={14}/> Match Momentum</div>
                <div className="flex items-end gap-1 h-24">
                    {data.soccer.momentum.map((val, i) => (
                        <div key={i} className="w-4 bg-gray-700 rounded-t-sm relative group">
                            <div 
                                className={`absolute bottom-0 w-full rounded-t-sm transition-all duration-1000 ${val > 50 ? 'bg-blue-500' : 'bg-red-500'}`}
                                style={{ height: `${Math.abs(val - 50) * 2}%` }}
                            ></div>
                        </div>
                    ))}
                </div>
            </div>
          );
      }

      return null;
  };

  // --- SCOREBUG CORE (Persistent) ---
  const renderScorebug = () => {
      // Don't show scorebug if full screen stats are up, unless specifically needed
      if (activeGraphic === 'FULL_STATS' && activeSport !== 'MOTORSPORTS') return null;
      if (activeGraphic === 'SCOREBUG' || activeGraphic === 'NONE' || activeGraphic === 'LOWER_THIRD_PLAYER') {
          return <UniversalScorebug data={data} />;
      }
      return null;
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Layer 1: AR */}
        {renderARLayer()}
        
        {/* Layer 2: Core Graphics */}
        {renderScorebug()}
        
        {/* Layer 3: Context */}
        {renderContextLayer()}
        
        {/* Layer 4: Deep Data */}
        {renderStatsLayer()}
    </div>
  );
};
