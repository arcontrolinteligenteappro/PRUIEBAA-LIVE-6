
import React from 'react';
import { BaseballGameState, GfxTemplate } from '../types';
import { Users, Target, Activity, TrendingUp } from 'lucide-react';

interface BaseballGraphicsProps {
  type: GfxTemplate;
  data: BaseballGameState;
}

export const BaseballGraphics: React.FC<BaseballGraphicsProps> = ({ type, data }) => {
  
  // INNING SUMMARY
  if (type === 'INNING_SUMMARY' && data.inningSummary) {
      return (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.5s]">
              <div className="bg-[#111] border-2 border-gray-600 w-[600px] shadow-2xl overflow-hidden rounded-xl">
                  <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-4 border-b border-gray-600 flex justify-between items-center">
                      <h2 className="text-3xl font-black italic text-white tracking-tighter">MID {data.inning}TH</h2>
                      <div className="bg-black/40 px-3 py-1 rounded text-sm font-bold text-gray-300">INNING SUMMARY</div>
                  </div>
                  <div className="grid grid-cols-4 divide-x divide-gray-700 bg-[#1a1a1a]">
                      <StatBox label="RUNS" value={data.inningSummary.runs} />
                      <StatBox label="HITS" value={data.inningSummary.hits} />
                      <StatBox label="ERRORS" value={data.inningSummary.errors} />
                      <StatBox label="LOB" value={data.inningSummary.lob} />
                  </div>
                  <div className="p-2 bg-black flex justify-center">
                      <img src="https://picsum.photos/200/50?random=sponsor" className="h-8 opacity-70" alt="Sponsor" />
                  </div>
              </div>
          </div>
      );
  }

  // DUE UP
  if (type === 'DUE_UP') {
      return (
          <div className="absolute right-10 top-20 w-80 bg-[#111]/90 border border-gray-600 shadow-2xl rounded-lg overflow-hidden animate-[slideLeft_0.5s_ease-out]">
             <div className="bg-red-900 p-2 flex items-center gap-2 border-b border-red-700">
                 <Users size={18} className="text-white" />
                 <span className="font-black text-white italic tracking-wider">DUE UP</span>
             </div>
             <div className="flex flex-col divide-y divide-gray-800">
                 {data.onDeck.map((batter, idx) => (
                     <div key={batter.id} className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors">
                         <img src={batter.photoUrl} className="w-10 h-10 rounded-full bg-gray-600 border border-gray-500 object-cover" />
                         <div className="flex-1">
                             <div className="flex justify-between items-center">
                                 <span className="font-bold text-white text-sm">{batter.name}</span>
                                 <span className="text-[10px] bg-gray-700 px-1.5 rounded text-gray-300">{batter.position}</span>
                             </div>
                             <div className="text-xs text-yellow-500 font-mono mt-0.5">AVG {batter.avg} • {batter.hr} HR</div>
                         </div>
                     </div>
                 ))}
             </div>
          </div>
      );
  }

  // PITCHER STATS / BULLPEN ENTRY
  if (type === 'PITCHER_STATS') {
      return (
          <div className="absolute bottom-10 left-10 w-[500px] bg-[#1a1a1a] border-l-4 border-blue-500 shadow-2xl rounded-r-lg overflow-hidden animate-[slideRight_0.5s_ease-out]">
              <div className="flex h-40">
                  <div className="w-32 bg-gray-800 relative">
                      <img src={data.pitcher.photoUrl} className="w-full h-full object-cover mix-blend-overlay" />
                      <div className="absolute bottom-0 w-full bg-black/70 text-center text-white font-black text-4xl p-2">{data.pitcher.number}</div>
                  </div>
                  <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                          <div>
                              <div className="text-xs font-bold text-gray-400">ON THE MOUND</div>
                              <div className="text-2xl font-black text-white">{data.pitcher.name}</div>
                          </div>
                          <div className="text-right">
                              <div className="text-3xl font-mono font-bold text-blue-400">{data.pitcher.era}</div>
                              <div className="text-[10px] text-gray-500">ERA</div>
                          </div>
                      </div>
                      
                      <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>REPERTOIRE</span>
                          </div>
                          {data.pitcher.pitches?.map((pitch, i) => (
                              <div key={i} className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-gray-300 w-20">{pitch}</span>
                                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                      <div className="h-full bg-blue-500" style={{ width: `${85 - (i * 15)}%` }}></div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return null;
};

const StatBox = ({ label, value }: { label: string, value: number }) => (
    <div className="flex flex-col items-center justify-center p-4">
        <span className="text-4xl font-black text-white">{value}</span>
        <span className="text-xs font-bold text-gray-500 tracking-wider">{label}</span>
    </div>
);
