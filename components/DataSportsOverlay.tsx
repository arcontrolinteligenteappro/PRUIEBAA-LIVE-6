
import React from 'react';
import { UniversalSportsState } from '../types';
import { Activity, Gauge, Map, Target, Shield, Zap } from 'lucide-react';

interface DataSportsOverlayProps {
  data: UniversalSportsState;
}

export const DataSportsOverlay: React.FC<DataSportsOverlayProps> = ({ data }) => {
  if (!data.showDataLayer) return null;

  // SOCCER: HEATMAP & MOMENTUM
  if (data.activeSport === 'SOCCER' && data.soccer) {
      return (
          <div className="absolute inset-0 pointer-events-none p-8 flex items-end justify-center">
              {/* Momentum Bar */}
              <div className="bg-black/80 backdrop-blur-md p-4 rounded-xl border border-gray-600 animate-[slideUp_0.5s]">
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
              
              {/* Heatmap (Simulated Overlay) */}
              <div className="absolute inset-0 opacity-30 mix-blend-screen" 
                   style={{
                       background: `radial-gradient(circle at 30% 40%, rgba(255,0,0,0.5) 0%, transparent 40%),
                                    radial-gradient(circle at 70% 60%, rgba(0,0,255,0.5) 0%, transparent 40%)`
                   }}>
              </div>
          </div>
      );
  }

  // MOTORSPORTS: TELEMETRY
  if (data.activeSport === 'MOTORSPORTS' && data.motorsports) {
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

  // BASKETBALL: SHOT CHART
  if (data.activeSport === 'BASKETBALL' && data.basketball) {
      return (
          <div className="absolute top-20 right-20 w-64 h-64 bg-black/80 border border-gray-600 rounded-lg p-2 animate-[fadeIn_0.5s]">
              <div className="text-[10px] font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><Target size={12}/> Shot Chart</div>
              <div className="relative w-full h-full border border-white/20 rounded-b-3xl">
                  {/* Hoop Simulation */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 border border-orange-500 rounded-full"></div>
                  {/* Shots */}
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

  // FOOTBALL: VIRTUAL LINES (AR)
  if (data.activeSport === 'FOOTBALL' && data.football) {
      return (
          <div className="absolute inset-0 pointer-events-none opacity-60">
              {/* Scrimmage */}
              <div className="absolute top-[40%] left-0 w-full h-1 bg-blue-600/80 shadow-[0_0_10px_blue] transform skew-x-[45deg]"></div>
              {/* First Down */}
              <div className="absolute top-[30%] left-0 w-full h-1.5 bg-yellow-500/90 shadow-[0_0_15px_yellow] transform skew-x-[45deg]"></div>
              
              {/* Drive Summary */}
              <div className="absolute bottom-20 left-20 bg-black/80 border-l-4 border-yellow-500 p-4 rounded-r-lg animate-[slideRight_0.5s]">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-1">Current Drive</div>
                  <div className="text-white font-black text-xl">8 PLAYS, 64 YARDS</div>
                  <div className="text-yellow-400 font-mono text-sm">3:42 TOP</div>
              </div>
          </div>
      );
  }

  // COMBAT: STRIKE STATS
  if ((data.activeSport === 'BOXING' || data.activeSport === 'MMA') && data.combat) {
      return (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-[400px] bg-black/80 border-t-2 border-red-600 rounded-lg p-4 animate-[slideUp_0.3s]">
              <div className="flex justify-between items-center mb-2">
                  <div className="text-blue-500 font-black text-xl">{data.combat.strikes.home}</div>
                  <div className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2"><Zap size={12}/> Significant Strikes</div>
                  <div className="text-red-500 font-black text-xl">{data.combat.strikes.guest}</div>
              </div>
              <div className="flex h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="bg-blue-600 transition-all duration-500" style={{ width: `${(data.combat.strikes.home / (data.combat.strikes.home + data.combat.strikes.guest)) * 100}%` }}></div>
                  <div className="bg-red-600 flex-1 transition-all duration-500"></div>
              </div>
          </div>
      );
  }

  // VOLLEYBALL: ATTACK ZONES
  if (data.activeSport === 'VOLLEYBALL' && data.volleyball) {
      return (
          <div className="absolute top-20 right-20 w-48 bg-black/80 border border-gray-600 rounded-lg p-3 animate-[fadeIn_0.5s]">
              <div className="text-[10px] font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><Target size={12}/> Attack Zones</div>
              <div className="grid grid-cols-3 gap-1 aspect-[2/3]">
                  {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white/10 flex items-center justify-center text-[10px] text-gray-500 hover:bg-green-500/50 transition-colors cursor-default">
                          {Math.floor(Math.random() * 30)}%
                      </div>
                  ))}
              </div>
          </div>
      );
  }

  return null;
};
