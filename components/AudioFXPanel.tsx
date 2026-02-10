
import React, { useState } from 'react';
import { AudioChannel } from '../types';
import { X, Mic, Sliders, Activity, Zap, Volume2, Shield } from 'lucide-react';

interface AudioFXPanelProps {
  channel: AudioChannel;
  onUpdate: (updatedChannel: AudioChannel) => void;
  onClose: () => void;
}

export const AudioFXPanel: React.FC<AudioFXPanelProps> = ({ channel, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'PREAMP' | 'EQ' | 'DYNAMICS'>('PREAMP');

  const updateProcessing = (key: string, value: any) => {
    onUpdate({
        ...channel,
        processing: {
            ...channel.processing,
            [key]: value
        }
    });
  };

  const updateCompressor = (key: string, value: number) => {
      onUpdate({
          ...channel,
          processing: {
              ...channel.processing,
              compressor: {
                  ...channel.processing.compressor,
                  [key]: value
              }
          }
      });
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] w-full max-w-3xl rounded-lg shadow-2xl border border-gray-700 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-[#252525]">
            <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">AUDIO DSP</span>
                <h2 className="text-white font-bold text-lg flex items-center gap-2"><Mic size={18} /> {channel.label}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
        </div>

        {/* Signal Chain Visualizer */}
        <div className="flex items-center justify-between p-4 bg-[#151515] border-b border-gray-800 text-[10px] font-bold text-gray-500">
             <div className="flex items-center gap-2">
                 <div className="px-2 py-1 bg-gray-800 rounded text-gray-300">INPUT</div>
                 <div className="w-4 h-0.5 bg-gray-700"></div>
                 <div className={`px-2 py-1 rounded ${activeTab === 'PREAMP' ? 'bg-blue-900 text-blue-300 border border-blue-700' : 'bg-gray-800'}`}>PREAMP</div>
                 <div className="w-4 h-0.5 bg-gray-700"></div>
                 <div className={`px-2 py-1 rounded ${activeTab === 'EQ' ? 'bg-blue-900 text-blue-300 border border-blue-700' : 'bg-gray-800'}`}>EQ</div>
                 <div className="w-4 h-0.5 bg-gray-700"></div>
                 <div className={`px-2 py-1 rounded ${activeTab === 'DYNAMICS' ? 'bg-blue-900 text-blue-300 border border-blue-700' : 'bg-gray-800'}`}>COMP/DE-ESS</div>
             </div>
             <div className="text-green-500 flex items-center gap-1"><Volume2 size={12}/> OUTPUT -1.0dB</div>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#111] p-1 gap-1">
            <button onClick={() => setActiveTab('PREAMP')} className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 rounded ${activeTab === 'PREAMP' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}><Sliders size={14}/> PREAMP & TOOLS</button>
            <button onClick={() => setActiveTab('EQ')} className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 rounded ${activeTab === 'EQ' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}><Activity size={14}/> 5-BAND EQ</button>
            <button onClick={() => setActiveTab('DYNAMICS')} className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 rounded ${activeTab === 'DYNAMICS' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}><Zap size={14}/> DYNAMICS</button>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 overflow-y-auto bg-[#222]">
            
            {activeTab === 'PREAMP' && (
                <div className="flex gap-8 justify-center">
                    <div className="flex flex-col items-center gap-2 bg-[#1a1a1a] p-4 rounded border border-gray-700 w-32">
                        <label className="text-xs font-bold text-gray-400">INPUT GAIN</label>
                        <div className="relative h-64 w-8 bg-gray-900 rounded-full border border-gray-800">
                             <input 
                                type="range" min="-60" max="20" 
                                value={channel.processing.gain}
                                onChange={(e) => updateProcessing('gain', parseInt(e.target.value))}
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                style={{ WebkitAppearance: 'slider-vertical' as any }}
                             />
                             <div className="absolute bottom-0 w-full bg-blue-500 rounded-b-full transition-all" style={{ height: `${((channel.processing.gain + 60) / 80) * 100}%` }}></div>
                        </div>
                        <span className="font-mono text-xl font-bold text-white">{channel.processing.gain} dB</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Mic Tools */}
                        <div className="bg-[#1a1a1a] p-4 rounded border border-gray-700 w-64 space-y-4">
                             <h4 className="text-xs font-bold text-white uppercase border-b border-gray-700 pb-2">Microphone Tools</h4>
                             
                             <div className="flex items-center justify-between">
                                 <span className="text-xs font-bold text-gray-400">MIC BOOST (+20dB)</span>
                                 <Toggle active={channel.processing.micBoost} onClick={() => updateProcessing('micBoost', !channel.processing.micBoost)} />
                             </div>
                             
                             <div className="flex items-center justify-between">
                                 <span className="text-xs font-bold text-gray-400">AGC (Auto Gain)</span>
                                 <Toggle active={channel.processing.agcEnabled} onClick={() => updateProcessing('agcEnabled', !channel.processing.agcEnabled)} />
                             </div>

                             <div className="flex items-center justify-between">
                                 <span className="text-xs font-bold text-gray-400">NOISE GATE</span>
                                 <Toggle active={channel.processing.gateEnabled} onClick={() => updateProcessing('gateEnabled', !channel.processing.gateEnabled)} />
                             </div>
                        </div>

                        <div className="bg-[#1a1a1a] p-4 rounded border border-gray-700 w-64">
                             <label className="text-xs font-bold text-gray-400 mb-2 block">DELAY (SYNC)</label>
                             <input 
                                type="range" min="0" max="500" 
                                value={channel.processing.delay}
                                onChange={(e) => updateProcessing('delay', parseInt(e.target.value))}
                                className="w-full accent-orange-500"
                             />
                             <div className="text-right font-mono text-white">{channel.processing.delay} ms</div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'EQ' && (
                <div className="flex justify-between gap-2 h-full">
                    <EQBand label="LOW CUT" freq="80-100 Hz" value={channel.processing.eq80Hz} onChange={(v) => updateProcessing('eq80Hz', v)} color="bg-red-500" />
                    <EQBand label="LOW-MID" freq="200-300 Hz" value={channel.processing.eq250Hz} onChange={(v) => updateProcessing('eq250Hz', v)} color="bg-orange-500" />
                    <EQBand label="MID" freq="500-800 Hz" value={channel.processing.eq600Hz} onChange={(v) => updateProcessing('eq600Hz', v)} color="bg-yellow-500" />
                    <EQBand label="HIGH-MID" freq="3-5 kHz" value={channel.processing.eq4kHz} onChange={(v) => updateProcessing('eq4kHz', v)} color="bg-green-500" />
                    <EQBand label="HIGH (AIR)" freq="10-12 kHz+" value={channel.processing.eq12kHz} onChange={(v) => updateProcessing('eq12kHz', v)} color="bg-blue-500" />
                </div>
            )}

            {activeTab === 'DYNAMICS' && (
                <div className="flex gap-6 h-full">
                    {/* Compressor */}
                    <div className="flex-1 bg-[#1a1a1a] p-4 rounded border border-gray-700 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white">COMPRESSOR</h3>
                            <Toggle active={channel.processing.compressor.enabled} onClick={() => updateCompressor('enabled', !channel.processing.compressor.enabled ? 1 : 0)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 flex-1">
                            <Knob label="THRESHOLD" value={channel.processing.compressor.threshold} min={-60} max={0} suffix="dB" onChange={(v) => updateCompressor('threshold', v)} />
                            <Knob label="RATIO" value={channel.processing.compressor.ratio} min={1} max={20} suffix=":1" step={0.1} onChange={(v) => updateCompressor('ratio', v)} />
                            <Knob label="ATTACK" value={channel.processing.compressor.attack} min={1} max={200} suffix="ms" onChange={(v) => updateCompressor('attack', v)} />
                            <Knob label="RELEASE" value={channel.processing.compressor.release} min={50} max={1000} suffix="ms" onChange={(v) => updateCompressor('release', v)} />
                        </div>
                    </div>

                    {/* De-Esser & Limiter */}
                    <div className="w-1/3 space-y-4">
                        <div className="bg-[#1a1a1a] p-4 rounded border border-gray-700">
                             <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-white text-sm">DE-ESSER</h3>
                                <Toggle active={channel.processing.deEsserEnabled} onClick={() => updateProcessing('deEsserEnabled', !channel.processing.deEsserEnabled)} />
                            </div>
                            <p className="text-[10px] text-gray-500">Reduces sibilance frequencies (4kHz-8kHz) automatically.</p>
                        </div>

                        <div className="bg-[#1a1a1a] p-4 rounded border border-gray-700 flex-1 flex flex-col items-center">
                             <div className="flex justify-between w-full items-center mb-2">
                                <h3 className="font-bold text-white text-sm">LIMITER</h3>
                                <div className={`w-2 h-2 rounded-full ${channel.processing.limiter.enabled ? 'bg-red-500' : 'bg-gray-600'}`}></div>
                            </div>
                            <Knob label="CEILING" value={channel.processing.limiter.ceiling} min={-6} max={0} suffix="dB" onChange={(v) => onUpdate({...channel, processing: {...channel.processing, limiter: {...channel.processing.limiter, ceiling: v}}})} />
                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <div 
        onClick={onClick}
        className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${active ? 'bg-green-500' : 'bg-gray-700'}`}
    >
        <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow ${active ? 'translate-x-5' : ''}`}></div>
    </div>
);

const EQBand = ({ label, freq, value, onChange, color }: any) => (
    <div className="flex-1 flex flex-col items-center bg-[#1a1a1a] rounded border border-gray-700 py-4">
        <span className="text-xs font-bold text-gray-300 mb-1">{label}</span>
        <span className="text-[9px] font-mono text-gray-500 mb-2">{freq}</span>
        <div className="relative flex-1 w-2 bg-gray-900 rounded-full border border-gray-800">
             <input 
                type="range" min="-15" max="15" 
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                style={{ WebkitAppearance: 'slider-vertical' as any }}
             />
             <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-600"></div>
             <div 
                className={`absolute w-full rounded-full transition-all ${color}`}
                style={{ 
                    height: `${Math.abs(value) / 30 * 100}%`,
                    top: value > 0 ? `calc(50% - ${Math.abs(value) / 30 * 100}%)` : '50%',
                    bottom: value < 0 ? `calc(50% - ${Math.abs(value) / 30 * 100}%)` : '50%'
                }}
             ></div>
        </div>
        <span className="font-mono font-bold text-white mt-2">{value > 0 ? '+' : ''}{value} dB</span>
    </div>
);

const Knob = ({ label, value, min, max, suffix, onChange, step = 1 }: any) => (
    <div className="flex flex-col items-center">
        <label className="text-[10px] font-bold text-gray-400 mb-1">{label}</label>
        <div className="relative w-16 h-16 rounded-full border-2 border-gray-600 bg-gray-800 flex items-center justify-center">
             <div 
                className="absolute w-full h-full rounded-full border-4 border-blue-500 border-t-transparent border-l-transparent"
                style={{ transform: `rotate(${(value - min) / (max - min) * 270 - 135}deg)`, transition: 'transform 0.1s' }}
             ></div>
             <input 
                type="range" min={min} max={max} step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer"
             />
             <span className="font-bold text-white text-xs pointer-events-none">{value}</span>
        </div>
        <span className="text-[9px] text-gray-500 mt-1">{suffix}</span>
    </div>
);
