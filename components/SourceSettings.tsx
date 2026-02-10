import React, { useState } from 'react';
import { VideoSource } from '../types';
import { X, Sliders, Palette, Monitor, Move, Layers } from 'lucide-react';

interface SourceSettingsProps {
  source: VideoSource;
  onUpdate: (updatedSource: VideoSource) => void;
  onClose: () => void;
}

export const SourceSettings: React.FC<SourceSettingsProps> = ({ source, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'COLOR' | 'KEY' | 'PTZ'>('GENERAL');

  const updateSetting = (key: string, value: any) => {
    onUpdate({
        ...source,
        settings: {
            ...source.settings,
            [key]: value
        }
    });
  };

  const updateColor = (key: string, value: number) => {
      onUpdate({
          ...source,
          settings: {
              ...source.settings,
              colorCorrection: {
                  ...source.settings.colorCorrection,
                  [key]: value
              }
          }
      });
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] w-full max-w-2xl rounded-lg shadow-2xl border border-gray-700 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-[#252525]">
            <div className="flex items-center gap-2">
                <span className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">{source.type}</span>
                <h2 className="text-white font-bold text-lg">{source.name} Settings</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#111] p-1 gap-1">
            <button onClick={() => setActiveTab('GENERAL')} className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 rounded ${activeTab === 'GENERAL' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}><Sliders size={14}/> GENERAL</button>
            <button onClick={() => setActiveTab('COLOR')} className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 rounded ${activeTab === 'COLOR' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}><Palette size={14}/> COLOR</button>
            <button onClick={() => setActiveTab('KEY')} className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 rounded ${activeTab === 'KEY' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}><Layers size={14}/> COLOUR KEY</button>
            {source.type === 'PTZ' && <button onClick={() => setActiveTab('PTZ')} className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 rounded ${activeTab === 'PTZ' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}><Move size={14}/> PTZ</button>}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
            
            {activeTab === 'GENERAL' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">Source Name</label>
                        <input 
                            type="text" 
                            value={source.name} 
                            onChange={(e) => onUpdate({...source, name: e.target.value})}
                            className="w-full bg-black border border-gray-600 rounded p-2 text-white focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">Input Source URL / Device</label>
                        <input 
                            type="text" 
                            value={source.previewUrl} 
                            disabled
                            className="w-full bg-gray-900 border border-gray-800 rounded p-2 text-gray-500 font-mono text-xs"
                        />
                    </div>
                </div>
            )}

            {activeTab === 'COLOR' && (
                <div className="space-y-6">
                    {['brightness', 'contrast', 'saturation'].map(param => (
                        <div key={param}>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs font-bold text-gray-400 uppercase">{param}</label>
                                <span className="text-xs font-mono text-blue-400">{(source.settings.colorCorrection as any)[param]}</span>
                            </div>
                            <input 
                                type="range" min="-100" max="100" 
                                value={(source.settings.colorCorrection as any)[param]}
                                onChange={(e) => updateColor(param, parseInt(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                        </div>
                    ))}
                    <div className="h-20 bg-black rounded flex items-center justify-center border border-gray-700">
                        <span className="text-gray-500 text-xs">Histogram Preview (Simulation)</span>
                    </div>
                </div>
            )}

            {activeTab === 'KEY' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
                        <span className="font-bold text-sm text-white">Chroma Key Active</span>
                        <div 
                            onClick={() => updateSetting('chromaKeyEnabled', !source.settings.chromaKeyEnabled)}
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${source.settings.chromaKeyEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${source.settings.chromaKeyEnabled ? 'translate-x-6' : ''}`}></div>
                        </div>
                    </div>
                    {source.settings.chromaKeyEnabled && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Key Color</label>
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded border border-gray-600 bg-green-500 cursor-pointer"></div>
                                    <div className="w-8 h-8 rounded border border-gray-600 bg-blue-600 cursor-pointer"></div>
                                    <input 
                                        type="color" 
                                        value={source.settings.chromaColor}
                                        onChange={(e) => updateSetting('chromaColor', e.target.value)}
                                        className="h-8 w-full bg-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Virtual Background</label>
                                <select 
                                    className="w-full bg-black border border-gray-600 rounded p-2 text-white text-xs"
                                    onChange={(e) => updateSetting('virtualSet', e.target.value)}
                                    value={source.settings.virtualSet || ''}
                                >
                                    <option value="">None</option>
                                    <option value="set-news-1">News Room A</option>
                                    <option value="set-news-2">Sports Center</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'PTZ' && source.type === 'PTZ' && (
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-40 h-40 rounded-full border-2 border-gray-600 bg-[#111] shadow-inner flex items-center justify-center">
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-gray-500 font-bold text-xs">TILT UP</div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-gray-500 font-bold text-xs">TILT DOWN</div>
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs rotate-[-90deg]">PAN L</div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs rotate-[90deg]">PAN R</div>
                        <div className="w-16 h-16 bg-gray-700 rounded-full shadow-lg border border-gray-500 cursor-pointer active:bg-blue-600 transition-colors"></div>
                    </div>
                    <div className="w-full grid grid-cols-3 gap-2">
                        {source.settings.ptz?.presets.map((_, idx) => (
                            <button key={idx} className="bg-gray-800 hover:bg-gray-700 p-2 rounded text-xs font-bold text-white border border-gray-600">
                                PRESET {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
        </div>
        
        <div className="p-4 border-t border-gray-700 bg-[#252525] flex justify-end">
            <button onClick={onClose} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded">DONE</button>
        </div>
      </div>
    </div>
  );
};