
import React from 'react';
import { ReplayClip } from '../types';
import { Play, Pause, Rewind, FastForward, Save, Scissors, Share2 } from 'lucide-react';

interface ReplayControllerProps {
  clips: ReplayClip[];
  speed: number;
  onSpeedChange: (speed: number) => void;
  onPlayClip: (clip: ReplayClip) => void;
  orientation?: 'vertical' | 'responsive';
}

export const ReplayController: React.FC<ReplayControllerProps> = ({ 
    clips, speed, onSpeedChange, onPlayClip, orientation = 'responsive' 
}) => {
  const containerClass = orientation === 'vertical' 
      ? 'flex-col' 
      : 'flex-col md:flex-row';

  const listClass = orientation === 'vertical'
      ? 'h-1/2 border-b border-gray-700'
      : 'md:w-1/3 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-gray-700';

  return (
    <div className={`h-full flex ${containerClass} bg-[#1a1a1a] text-white`}>
      {/* Clip List */}
      <div className={`${listClass} overflow-y-auto`}>
         <div className="p-2 bg-gray-900 font-bold text-xs uppercase tracking-wider sticky top-0 flex justify-between items-center z-10">
             <span>Stored Events</span>
             <span className="text-[9px] bg-red-900/50 text-red-400 px-1 rounded border border-red-800">ISO REC ACTIVE</span>
         </div>
         <div className="flex flex-col gap-1 p-2">
            {clips.map(clip => (
                <div key={clip.id} className="group relative">
                    <button onClick={() => onPlayClip(clip)} className="w-full flex items-center gap-2 p-2 bg-gray-800 hover:bg-gray-700 rounded text-left border border-gray-700 active:bg-blue-900/30">
                        <img src={clip.thumbnail} className="w-16 h-9 object-cover rounded bg-black" alt="" />
                        <div className="min-w-0">
                            <div className="font-bold text-sm text-yellow-400 truncate">{clip.tags.join(', ')}</div>
                            <div className="text-xs text-gray-400 font-mono truncate">{clip.camera} • {clip.durationSec}s</div>
                        </div>
                    </button>
                    <button className="absolute right-2 top-2 p-1.5 bg-blue-600 rounded text-white opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow-lg hidden md:block" title="Export Clip to Social">
                        <Share2 size={12} />
                    </button>
                </div>
            ))}
         </div>
      </div>

      {/* Transport Controls */}
      <div className="flex-1 flex flex-col p-4">
         <div className="flex-1 bg-black rounded border border-gray-700 mb-4 relative flex items-center justify-center overflow-hidden min-h-[150px]">
            <span className="text-gray-600 font-mono">REPLAY PREVIEW</span>
            {/* Speed Overlay */}
            <div className="absolute top-2 right-2 text-xl font-black text-yellow-500 font-mono">{Math.round(speed * 100)}%</div>
            {/* Scrubber Line (Simulated) */}
            <div className="absolute bottom-0 h-1 w-full bg-gray-800">
                <div className="h-full bg-red-500 w-1/3"></div>
            </div>
         </div>

         {/* Jog/Shuttle Strip */}
         <div className="flex items-center gap-4 justify-center bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 flex-wrap">
             <div className="flex flex-col gap-1 w-full md:w-auto items-center">
                 <label className="text-[10px] font-bold text-gray-400 text-center">SPEED</label>
                 <input 
                    type="range" min="0" max="1" step="0.1" 
                    value={speed} onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                    className="w-full md:w-32 accent-yellow-500"
                 />
             </div>
             
             <div className="hidden md:block h-8 w-[1px] bg-gray-600"></div>

             <div className="flex gap-4">
                <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 active:scale-95 transition-transform"><Rewind fill="currentColor" size={16} /></button>
                <button className="p-4 bg-red-600 rounded-full hover:bg-red-500 active:scale-95 shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-transform"><Play fill="currentColor" size={20} /></button>
                <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 active:scale-95 transition-transform"><FastForward fill="currentColor" size={16} /></button>
             </div>

             <div className="hidden md:block h-8 w-[1px] bg-gray-600"></div>

             <div className="flex gap-2 w-full md:w-auto justify-center">
                <button className="flex flex-col items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 p-2 hover:bg-gray-700 rounded">
                    <Scissors size={16} />
                </button>
                <button className="flex flex-col items-center gap-1 text-xs font-bold text-green-400 hover:text-green-300 p-2 hover:bg-gray-700 rounded">
                    <Save size={16} />
                </button>
             </div>
         </div>
      </div>
    </div>
  );
};
