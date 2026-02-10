
import React from 'react';
import { UniversalSportsState } from '../types';
import { Scorebug as BaseballBug } from './Scorebug';
import { Clock, Flag, Shield, Activity } from 'lucide-react';

interface UniversalScorebugProps {
  data: UniversalSportsState;
}

export const UniversalScorebug: React.FC<UniversalScorebugProps> = ({ data }) => {
  const { activeSport, home, guest, clock, periodName } = data;

  const fmtTime = (min: number, sec: number) => 
    `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;

  // BASEBALL DELEGATION
  if ((activeSport === 'BASEBALL' || activeSport === 'SOFTBOL') && data.baseball) {
    const baseballData = {
        ...data.baseball,
        scoreHome: home.score,
        scoreGuest: guest.score
    };
    return <BaseballBug data={baseballData} />;
  }

  // MOTORSPORTS: VERTICAL LEADERBOARD (F1 Style)
  if (activeSport === 'MOTORSPORTS' && data.motorsports) {
      return (
          <div className="absolute top-10 left-10 flex flex-col gap-1 w-64 animate-[slideRight_0.5s]">
              {/* Header */}
              <div className="bg-black text-white px-3 py-2 font-black italic border-l-4 border-red-600 flex justify-between items-center">
                  <span>LAP {data.motorsports.laps.current}/{data.motorsports.laps.total}</span>
                  <div className={`w-3 h-3 rounded-full ${data.motorsports.flagStatus === 'GREEN' ? 'bg-green-500' : data.motorsports.flagStatus === 'YELLOW' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></div>
              </div>
              
              {/* Drivers */}
              <div className="flex flex-col gap-[2px]">
                  {data.motorsports.leaderboard.map((driver) => (
                      <div key={driver.position} className="flex bg-[#111]/90 text-white h-8 overflow-hidden items-center group">
                          <div className="w-8 flex justify-center items-center font-bold text-sm bg-black/50 text-gray-400">{driver.position}</div>
                          <div className="w-1 h-full" style={{ backgroundColor: driver.team === 'Red Bull' ? '#1e41ff' : driver.team === 'Ferrari' ? '#ff2800' : driver.team === 'Mercedes' ? '#00d2be' : '#006f62' }}></div>
                          <div className="flex-1 px-2 font-bold text-sm uppercase tracking-tighter">{driver.name}</div>
                          <div className="px-2 font-mono text-xs text-yellow-400 bg-black/40 h-full flex items-center min-w-[60px] justify-end">
                              {driver.gap}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      );
  }

  // TYPE A: SOCCER (Linear Bar)
  if (activeSport === 'SOCCER' || activeSport === 'FUTSAL') {
      return (
          <div className="absolute top-8 left-16 flex items-center shadow-2xl rounded-lg overflow-hidden border border-gray-700 animate-[slideDown_0.5s]">
              {/* Home */}
              <div className="bg-white text-black px-4 py-2 font-black text-xl flex items-center gap-2">
                  <span className="text-sm font-bold opacity-60">HOME</span>
                  <div className="w-6 h-6 rounded-full border border-gray-300" style={{backgroundColor: home.color}}></div>
                  <span>{home.shortName}</span>
              </div>
              <div className="bg-[#111] text-white px-4 py-2 font-black text-2xl border-r border-gray-800">
                  {home.score}
              </div>

              {/* Clock & Period */}
              <div className="bg-[#1a1a1a] px-3 py-1 flex flex-col items-center justify-center min-w-[80px]">
                  <span className="font-mono font-bold text-yellow-400 text-lg leading-none">
                      {fmtTime(clock.minutes, clock.seconds)}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase leading-none mt-1">{periodName}</span>
                  {data.possession !== 'NEUTRAL' && (
                       <div className={`mt-1 w-full h-1 rounded-full ${data.possession === 'HOME' ? 'bg-gradient-to-r from-transparent to-white' : 'bg-gradient-to-l from-transparent to-white'}`}></div>
                  )}
              </div>

              {/* Guest */}
              <div className="bg-[#111] text-white px-4 py-2 font-black text-2xl border-l border-gray-800">
                  {guest.score}
              </div>
              <div className="bg-white text-black px-4 py-2 font-black text-xl flex items-center gap-2">
                  <span>{guest.shortName}</span>
                  <div className="w-6 h-6 rounded-full border border-gray-300" style={{backgroundColor: guest.color}}></div>
                  <span className="text-sm font-bold opacity-60">AWAY</span>
              </div>
          </div>
      );
  }

  // TYPE B: BASKETBALL / FOOTBALL (Box Style)
  if (activeSport === 'BASKETBALL' || activeSport === 'FOOTBALL' || activeSport === 'VOLLEYBALL') {
      return (
          <div className="absolute bottom-12 right-12 flex flex-col items-end animate-[slideLeft_0.5s]">
              <div className="flex bg-[#0f0f0f] border-2 border-orange-600 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  {/* Home */}
                  <div className="flex flex-col items-center justify-center w-20 bg-black p-2 border-r border-gray-800 relative">
                      {data.football?.possession === 'HOME' && <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>}
                      {data.volleyball?.serve === 'HOME' && <div className="absolute top-1 right-1 text-yellow-500 text-[8px]">SERVE</div>}
                      <div className="text-3xl font-black text-white">{home.score}</div>
                      <div className="text-xs font-bold text-gray-400">{home.shortName}</div>
                      <div className="flex gap-1 mt-1">
                          {[...Array(Math.min(5, home.timeouts || 0))].map((_,i) => <div key={i} className="w-2 h-1 bg-yellow-500 rounded-sm"></div>)}
                      </div>
                  </div>

                  {/* Clock Center */}
                  <div className="flex flex-col items-center justify-center w-24 bg-[#1a1a1a] px-2 relative">
                      <span className="text-xs font-bold text-gray-500">{activeSport === 'VOLLEYBALL' ? `SET ${data.volleyball?.set}` : `Q${data.football?.quarter || data.period}`}</span>
                      <span className={`font-mono font-black text-2xl ${clock.isRunning ? 'text-green-400' : 'text-red-400'}`}>
                          {clock.minutes}:{clock.seconds.toString().padStart(2, '0')}
                      </span>
                      {activeSport === 'BASKETBALL' && (
                           <div className="text-[10px] font-bold text-orange-500 mt-1">SHOT: {data.basketball?.shotClock}</div>
                      )}
                      {activeSport === 'FOOTBALL' && (
                           <div className="text-[10px] font-bold text-yellow-500 mt-1">{data.football?.down} & {data.football?.distance}</div>
                      )}
                  </div>

                  {/* Guest */}
                  <div className="flex flex-col items-center justify-center w-20 bg-black p-2 border-l border-gray-800 relative">
                      {data.football?.possession === 'GUEST' && <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>}
                      {data.volleyball?.serve === 'GUEST' && <div className="absolute top-1 left-1 text-yellow-500 text-[8px]">SERVE</div>}
                      <div className="text-3xl font-black text-white">{guest.score}</div>
                      <div className="text-xs font-bold text-gray-400">{guest.shortName}</div>
                      <div className="flex gap-1 mt-1">
                          {[...Array(Math.min(5, guest.timeouts || 0))].map((_,i) => <div key={i} className="w-2 h-1 bg-yellow-500 rounded-sm"></div>)}
                      </div>
                  </div>
              </div>
              
              {/* Volleyball Sets Overlay */}
              {activeSport === 'VOLLEYBALL' && (
                  <div className="bg-black/80 text-white text-[10px] px-2 py-1 mt-1 rounded font-bold border border-gray-700">
                      SETS: {data.volleyball?.setsWonHome} - {data.volleyball?.setsWonGuest}
                  </div>
              )}
          </div>
      );
  }

  // TYPE D: COMBAT / TAEKWONDO (Round Focus)
  if (activeSport === 'BOXING' || activeSport === 'MMA' || activeSport === 'TAEKWONDO') {
      return (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-[fadeIn_0.5s] w-full max-w-3xl px-10">
              <div className="flex items-end justify-between">
                  {/* Fighter 1 */}
                  <div className="flex flex-col items-start">
                      <div className="flex items-end gap-2 bg-gradient-to-r from-blue-900 to-transparent p-2 rounded-l-lg pl-4 border-l-4 border-blue-600">
                          <span className="text-3xl font-black text-white uppercase drop-shadow-md">{home.name}</span>
                          <span className="text-4xl font-black text-white mb-[-4px]">{home.score}</span>
                      </div>
                  </div>

                  {/* Clock */}
                  <div className="bg-[#111] border-2 border-yellow-500 rounded-t-xl px-6 py-2 flex flex-col items-center min-w-[140px] shadow-2xl relative z-10">
                      <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest">ROUND {data.combat?.round}</span>
                      <span className={`font-mono font-black text-5xl ${clock.minutes === 0 && clock.seconds < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                          {clock.minutes}:{clock.seconds.toString().padStart(2, '0')}
                      </span>
                  </div>

                  {/* Fighter 2 */}
                  <div className="flex flex-col items-end">
                      <div className="flex items-end gap-2 bg-gradient-to-l from-red-900 to-transparent p-2 rounded-r-lg pr-4 border-r-4 border-red-600">
                          <span className="text-4xl font-black text-white mb-[-4px]">{guest.score}</span>
                          <span className="text-3xl font-black text-white uppercase drop-shadow-md">{guest.name}</span>
                      </div>
                  </div>
              </div>
              <div className="w-full h-2 bg-gradient-to-r from-blue-600 via-yellow-500 to-red-600 opacity-50"></div>
          </div>
      );
  }

  return null;
};
