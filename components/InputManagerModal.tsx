
import React, { useState, useEffect } from 'react';
import { DetectedInput, VideoSource } from '../types';
import { X, Camera, Mic, Globe, FolderOpen, RefreshCw, Plus, Monitor, CheckCircle, Smartphone } from 'lucide-react';
import { useBroadcastStore } from '../core/store';

export const InputManagerModal: React.FC = () => {
  const { toggleInputManager, scanDevices, detectedDevices, addSource } = useBroadcastStore();
  const [activeTab, setActiveTab] = useState<'HARDWARE' | 'IP' | 'MEDIA' | 'REMOTE'>('HARDWARE');
  const [customIp, setCustomIp] = useState('');
  const [ipType, setIpType] = useState('SRT');

  useEffect(() => {
      scanDevices();
  }, []);

  const handleAddDevice = (device: DetectedInput) => {
      const newSource: VideoSource = {
          id: `src-${Math.random().toString(36).substr(2, 5)}`,
          name: device.label,
          type: device.kind === 'videoinput' ? 'CAMERA' : 'AUDIO_ENGINE',
          previewUrl: 'https://picsum.photos/800/450?random=' + Math.random(), // Simulated feed
          tally: 'OFF',
          settings: { active: true, volume: 1, pan: 0, muted: false, delayMs: 0 },
          isLive: false, isPreview: false
      };
      addSource(newSource);
  };

  const handleAddIp = () => {
      if (!customIp) return;
      const newSource: VideoSource = {
          id: `src-ip-${Math.random().toString(36).substr(2, 5)}`,
          name: `${ipType} Stream`,
          type: ipType as any,
          previewUrl: 'https://picsum.photos/800/450?random=ip', 
          tally: 'OFF',
          settings: { active: true, volume: 1, pan: 0, muted: false, delayMs: 200 },
          isLive: false, isPreview: false,
          metadata: { ip: customIp }
      };
      addSource(newSource);
      setCustomIp('');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-8 backdrop-blur-md animate-[fadeIn_0.2s]">
        <div className="w-full max-w-5xl h-[80vh] bg-[#111] border border-gray-700 rounded-xl flex flex-col shadow-2xl overflow-hidden">
            
            {/* HEADER */}
            <div className="h-16 bg-[#1a1a1a] border-b border-gray-700 flex justify-between items-center px-6">
                <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                    <Plus size={24} className="text-blue-500" /> Input Manager
                </h2>
                <button onClick={() => toggleInputManager(false)} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* SIDEBAR */}
                <div className="w-64 bg-[#151515] border-r border-gray-700 p-2 flex flex-col gap-1">
                    <TabButton active={activeTab === 'HARDWARE'} onClick={() => setActiveTab('HARDWARE')} icon={<Camera size={18}/>} label="HARDWARE INPUTS" />
                    <TabButton active={activeTab === 'IP'} onClick={() => setActiveTab('IP')} icon={<Globe size={18}/>} label="IP STREAMS (SRT/NDI)" />
                    <TabButton active={activeTab === 'MEDIA'} onClick={() => setActiveTab('MEDIA')} icon={<FolderOpen size={18}/>} label="MEDIA FILES" />
                    <TabButton active={activeTab === 'REMOTE'} onClick={() => setActiveTab('REMOTE')} icon={<Smartphone size={18}/>} label="REMOTE GUEST" />
                </div>

                {/* CONTENT */}
                <div className="flex-1 bg-[#0d0d0d] p-8 overflow-y-auto">
                    
                    {/* --- HARDWARE SCANNER --- */}
                    {activeTab === 'HARDWARE' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Local Devices</h3>
                                    <p className="text-sm text-gray-500">USB Cameras, Capture Cards, Microphones</p>
                                </div>
                                <button onClick={() => scanDevices()} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs font-bold text-white flex items-center gap-2">
                                    <RefreshCw size={14} /> RESCAN
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {detectedDevices.map(dev => (
                                    <div key={dev.id} className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-700 flex items-center gap-4 hover:border-blue-500 transition-colors group">
                                        <div className="p-3 bg-black rounded-full text-gray-400 group-hover:text-blue-400">
                                            {dev.kind === 'videoinput' ? <Camera size={24}/> : <Mic size={24}/>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-white truncate">{dev.label}</div>
                                            <div className="text-xs text-gray-500 font-mono">{dev.kind}</div>
                                        </div>
                                        <button 
                                            onClick={() => handleAddDevice(dev)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ADD
                                        </button>
                                    </div>
                                ))}
                                {detectedDevices.length === 0 && (
                                    <div className="col-span-2 text-center py-10 text-gray-600">No devices detected. Check permissions.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- IP STREAMS --- */}
                    {activeTab === 'IP' && (
                        <div className="max-w-xl mx-auto">
                            <h3 className="text-lg font-bold text-white mb-6">Add Network Source</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">PROTOCOL</label>
                                    <div className="flex gap-2">
                                        {['SRT', 'RTMP', 'NDI', 'RTSP'].map(t => (
                                            <button 
                                                key={t} 
                                                onClick={() => setIpType(t)}
                                                className={`px-4 py-2 rounded text-xs font-bold border ${ipType === t ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">STREAM URL / IP</label>
                                    <input 
                                        value={customIp}
                                        onChange={(e) => setCustomIp(e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-3 text-white focus:border-blue-500 outline-none font-mono"
                                        placeholder="srt://192.168.1.50:9000"
                                    />
                                </div>
                                <button onClick={handleAddIp} className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow-lg mt-4">
                                    CONNECT SOURCE
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- MEDIA --- */}
                    {activeTab === 'MEDIA' && (
                        <div className="text-center text-gray-500 mt-20">
                            <FolderOpen size={48} className="mx-auto mb-4 opacity-50"/>
                            <p>Drag and drop video files here to ingest into DDR.</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
        {icon} {label}
    </button>
);
