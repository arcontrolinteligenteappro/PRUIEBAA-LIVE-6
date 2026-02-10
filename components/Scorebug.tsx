
import React, { useEffect, useState } from 'react';
import { BaseballGameState } from '../types';
import { Zap, Activity } from 'lucide-react';

interface ScorebugProps {
  data: BaseballGameState;
  className?: string;
}

export const Scorebug: React.FC<ScorebugProps> = ({ data, className }) => {
  const [pitchViz, setPitchViz] = useState<null | { type: string, speed: number }>(null);
  
  // Alert logic: High pressure moment
  const isHighPressure = (data.outs === 2 && data.bases.some(b => b)) || data.strikes === 2;
  const isBasesLoaded = data.bases.every(b => b);

  // Simulate Pitch Tracking showing up temporarily
  useEffect(() => {
    if (data.lastPitch) {
        setPitchViz(data.lastPitch);
        const timer = setTimeout(() => setPitchViz(null), 3000);
        return () => clearTimeout(timer);
    }
  }, [data.lastPitch]);

  return (
    <div className={`absolute top-8 left-16 flex flex-col items-start ${className}`}>
        
        {/* Main Score Bar */}
        <div className={`flex bg-[#0f0f0f] text-white rounded-lg shadow-2xl overflow-hidden border-t-2 ${isHighPressure ? 'border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'border-gray-600'}`}>
            
            {/* Team Away */}
            <div className="flex items-center bg-blue-900 px-4 py-2 border-r border-gray-800 w-24 justify-center relative">
                 <span className="font-black text-2xl tracking-tighter">LAD</span>
                 {data.isTop && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-yellow-400 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent"></div>}
            </div>
            <div className="flex items-center bg-white text-black px-3 py-2 font-black text-3xl w-16 justify-center">
                {data.scoreGuest}
            </div>

            {/* Inning / Outs Status */}
            <div className="flex flex-col items-center justify-center px-4 bg-black min-w-[100px] border-x border-gray-800 relative">
                <span className="text-xs font-bold text-gray-400 mb-1">{data.isTop ? 'TOP' : 'BOT'} {data.inning}</span>
                
                {/* Bases Diamond */}
                <div className="relative w-8 h-8 rotate-45 border border-gray-700 bg-gray-900 mb-1 scale-75">
                    <div className={`absolute top-0 right-0 w-1/2 h-1/2 border-r border-t border-gray-600 ${data.bases[0] ? 'bg-yellow-500 shadow-[0_0_5px_yellow]' : ''}`}></div> {/* 1st */}
                    <div className={`absolute top-0 left-0 w-1/2 h-1/2 border-l border-t border-gray-600 ${data.bases[1] ? 'bg-yellow-500 shadow-[0_0_5px_yellow]' : ''}`}></div> {/* 2nd */}
                    <div className={`absolute bottom-0 left-0 w-1/2 h-1/2 border-l border-b border-gray-600 ${data.bases[2] ? 'bg-yellow-500 shadow-[0_0_5px_yellow]' : ''}`}></div> {/* 3rd */}
                </div>
                
                {/* Outs Dots */}
                <div className="flex gap-1 absolute bottom-1">
                    <div className={`w-2 h-2 rounded-full ${data.outs >= 1 ? 'bg-red-500' : 'bg-gray-800'}`}></div>
                    <div className={`w-2 h-2 rounded-full ${data.outs >= 2 ? 'bg-red-500' : 'bg-gray-800'}`}></div>
                </div>
            </div>

            {/* Team Home */}
            <div className="flex items-center bg-white text-black px-3 py-2 font-black text-3xl w-16 justify-center">
                {data.scoreHome}
            </div>
            <div className="flex items-center bg-red-900 px-4 py-2 border-l border-gray-800 w-24 justify-center relative">
                 <span className="font-black text-2xl tracking-tighter">NYY</span>
                 {!data.isTop && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-0 h-0 border-r-[6px] border-r-yellow-400 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent"></div>}
            </div>

            {/* Count */}
            <div className="flex flex-col justify-center items-center px-3 bg-[#1a1a1a] min-w-[70px]">
                <div className="font-mono font-black text-2xl leading-none text-yellow-400">{data.balls}-{data.strikes}</div>
                <div className="text-[9px] font-bold text-gray-500">COUNT</div>
            </div>

            {/* Pitch Count / Speed */}
            <div className="flex flex-col justify-center items-center px-2 bg-[#222] min-w-[60px] border-l border-gray-700">
                <span className="font-mono font-bold text-lg text-white">96</span>
                <span className="text-[8px] text-gray-400">PITCHES</span>
            </div>
        </div>

        {/* Lower Third Context (Batter/Pitcher) */}
        <div className="flex gap-2 mt-1 animate-[slideDown_0.3s_ease-out]">
            {/* Pitcher Context */}
            <div className="bg-black/90 text-white text-xs px-2 py-1 rounded flex items-center gap-2 border border-gray-700">
                 <span className="font-bold text-gray-400">P: {data.pitcher.number}</span>
                 <span className="font-bold">{data.pitcher.name}</span>
                 <span className="text-gray-400 font-mono">({data.pitcher.so} SO)</span>
            </div>
            
            {/* Batter Context */}
            <div className="bg-black/90 text-white text-xs px-2 py-1 rounded flex items-center gap-2 border border-gray-700">
                 <span className="font-bold text-gray-400">AB: {data.batter.number}</span>
                 <span className="font-bold text-yellow-400">{data.batter.name}</span>
                 <span className="text-gray-400 font-mono">{data.batter.avg} AVG</span>
                 <span className="text-gray-400 font-mono">{data.batter.hr} HR</span>
            </div>
        </div>

        {/* Pitch Tracking Popup */}
        {pitchViz && (
            <div className="absolute -right-32 top-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-1.5 rounded shadow-lg animate-[fadeIn_0.2s_ease-out] flex items-center gap-2 border border-blue-400">
                <Activity size={14} className="animate-pulse" />
                <div>
                    <div className="font-black text-lg leading-none italic">{pitchViz.speed} <span className="text-xs not-italic font-normal opacity-80">MPH</span></div>
                    <div className="text-[9px] uppercase font-bold tracking-wider opacity-90">{pitchViz.type}</div>
                </div>
            </div>
        )}
    </div>
  );
};
