
import React from 'react';
import { AudioChannel } from '../types';
import { Mic, Music, Radio, Settings2 } from 'lucide-react';

interface ChannelStripProps {
  channel: AudioChannel;
  onChange: (updated: AudioChannel) => void;
  onEdit?: (channelId: string) => void;
}

export const AudioChannelStrip: React.FC<ChannelStripProps> = ({ channel, onChange, onEdit }) => {
  
  const updateLevel = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...channel, level: parseFloat(e.target.value) });
  };

  const toggleMute = () => onChange({ ...channel, isMuted: !channel.isMuted });
  const toggleSolo = () => onChange({ ...channel, isSolo: !channel.isSolo });
  const togglePfl = () => onChange({ ...channel, isPfl: !channel.isPfl });
  const toggleComp = () => onChange({ ...channel, processing: { ...channel.processing, compressor: { ...channel.processing.compressor, enabled: !channel.processing.compressor.enabled } } });

  const getIcon = () => {
    if (channel.label.includes('CAM')) return <Mic size={14} />;
    if (channel.label.includes('GFX') || channel.label.includes('REPLAY')) return <Music size={14} />;
    return <Radio size={14} />;
  };

  return (
    <div className="flex flex-col items-center h-full min-w-[90px] bg-[#222] border-r border-black py-2 select-none group shadow-inner">
      
      {/* Dynamics Section */}
      <div className="flex flex-col gap-1 w-full px-2 mb-2">
         <button 
            onClick={toggleComp}
            className={`text-[9px] font-bold rounded py-0.5 border ${channel.processing.compressor.enabled ? 'bg-yellow-600 text-black border-yellow-500' : 'bg-[#111] text-gray-500 border-gray-700'}`}
         >
            COMP
         </button>
         <div className={`text-[9px] font-bold rounded py-0.5 text-center border ${channel.processing.gateEnabled ? 'bg-green-900 text-green-400 border-green-800' : 'bg-[#111] text-gray-500 border-gray-700'}`}>
            GATE
         </div>
      </div>

      {/* EQ Thumbnails (Visual Feedback of 5-band state) */}
      <div 
        className="flex gap-0.5 mb-2 bg-[#111] p-1 rounded border border-gray-800 cursor-pointer hover:border-gray-500"
        onClick={() => onEdit && onEdit(channel.id)}
        title="Open Audio DSP"
      >
          {['eq80Hz', 'eq250Hz', 'eq600Hz', 'eq4kHz', 'eq12kHz'].map((band, i) => {
              const val = (channel.processing as any)[band];
              return (
                <div key={i} className="w-1.5 h-6 bg-gray-700 rounded-sm overflow-hidden relative">
                    <div 
                        className="absolute w-full bg-blue-400" 
                        style={{ 
                            height: `${Math.abs(val) / 30 * 100}%`,
                            bottom: val < 0 ? '50%' : undefined,
                            top: val > 0 ? 'auto' : '50%',
                            marginTop: val > 0 ? `-${Math.abs(val)/30*100}%` : 0
                        }}
                    ></div>
                    <div className="absolute top-1/2 w-full h-[1px] bg-black/50"></div>
                </div>
              );
          })}
      </div>

      {/* FX Edit Button */}
      <button 
        onClick={() => onEdit && onEdit(channel.id)}
        className="mb-2 p-1 text-gray-500 hover:text-white rounded hover:bg-gray-700"
      >
          <Settings2 size={12} />
      </button>

      {/* Pan Pot */}
      <div className="relative w-8 h-8 rounded-full border border-gray-600 bg-[#1a1a1a] flex items-center justify-center mb-2 shadow-lg">
          <div 
            className="w-0.5 h-3 bg-white origin-bottom transform translate-y-[-2px]"
            style={{ transform: `rotate(${channel.processing.pan * 45}deg) translateY(-2px)` }}
          ></div>
      </div>

      {/* Logic Buttons */}
      <div className="flex flex-col gap-1 w-full px-2 mb-2">
        <button onClick={toggleSolo} className={`py-1 text-[9px] font-bold rounded border ${channel.isSolo ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>SOLO</button>
        <button onClick={togglePfl} className={`py-1 text-[9px] font-bold rounded border ${channel.isPfl ? 'bg-blue-500 text-white border-blue-400' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>PFL</button>
      </div>

      {/* Fader Track */}
      <div className="relative flex-1 w-full flex justify-center py-2 bg-[#151515] mx-1 rounded-sm border-x border-gray-800 shadow-inner">
        {/* Meter */}
        <div className="absolute left-3 top-2 bottom-2 w-1.5 bg-black rounded-full overflow-hidden border border-gray-800">
            <div 
                className="absolute bottom-0 left-0 w-full transition-all duration-75"
                style={{ 
                    height: `${channel.isMuted ? 0 : (channel.level * 100) + (Math.random() * 5)}%`,
                    background: 'linear-gradient(to top, #22c55e, #eab308 80%, #ef4444)'
                }}
            ></div>
        </div>

        {/* Fader Handle */}
        <div className="h-full w-8 relative">
            <input 
                type="range" 
                min="0" 
                max="1.1" 
                step="0.01"
                value={channel.level}
                onChange={updateLevel}
                className="absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer z-20"
                style={{ WebkitAppearance: 'slider-vertical' as any }}
            />
            
            <div 
                className="absolute left-1/2 -translate-x-1/2 w-8 h-12 bg-gradient-to-b from-[#444] to-[#222] rounded shadow-[0_4px_6px_rgba(0,0,0,0.5)] border border-black z-10 pointer-events-none flex items-center justify-center"
                style={{ bottom: `calc(${(channel.level / 1.1) * 100}% - 24px)` }}
            >
                <div className="w-full h-[2px] bg-white opacity-80 shadow-[0_0_2px_white]"></div>
            </div>
        </div>
      </div>

      {/* Bottom Mute & Label */}
      <div className="w-full px-2 mt-2 flex flex-col gap-1">
         <button 
            onClick={toggleMute}
            className={`w-full py-2 text-[10px] font-bold rounded border shadow-sm transition-all active:scale-95 ${channel.isMuted ? 'bg-red-600 text-white border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-[#333] text-gray-300 border-gray-600'}`}
         >
            {channel.isMuted ? 'MUTED' : 'ON'}
         </button>
         
         <div className="bg-black/60 rounded px-1 py-1 flex items-center justify-center gap-1 mt-1 border border-gray-800">
             {getIcon()}
             <span className="text-[10px] font-mono text-gray-300 truncate max-w-[50px]">{channel.label}</span>
         </div>
      </div>

    </div>
  );
};
