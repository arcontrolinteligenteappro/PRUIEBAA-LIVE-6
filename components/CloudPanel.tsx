import React from 'react';
import { RemoteGuest, StreamDestination, FieldUnit } from '../types';
import { Users, Wifi, Globe, Battery, Signal, Share2, Plus, Copy } from 'lucide-react';

interface CloudPanelProps {
  guests: RemoteGuest[];
  destinations: StreamDestination[];
  units: FieldUnit[];
}

export const CloudPanel: React.FC<CloudPanelProps> = ({ guests, destinations, units }) => {
  return (
    <div className="flex h-full bg-[#151515] overflow-x-auto p-4 gap-4">
      
      {/* REMOTE GUESTS PANEL */}
      <div className="min-w-[300px] flex flex-col bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase text-blue-400 flex items-center gap-2"><Users size={14} /> Remote Guests</h3>
            <button className="text-[10px] bg-blue-600 px-2 py-1 rounded text-white flex items-center gap-1 hover:bg-blue-500"><Plus size={10} /> INVITE</button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
            {guests.map(guest => (
                <div key={guest.id} className="bg-black/40 rounded p-2 border border-gray-800 flex gap-2 items-center">
                    <div className="relative w-16 h-12 bg-black rounded overflow-hidden">
                        <img src={guest.videoUrl} className="w-full h-full object-cover opacity-70" alt="" />
                        <div className={`absolute bottom-0 left-0 right-0 h-1 ${guest.status === 'LIVE' ? 'bg-red-600' : 'bg-green-500'}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-gray-200 truncate">{guest.name}</div>
                        <div className="text-[10px] text-gray-500 flex items-center gap-2">
                            <span className={guest.connectionQuality === 'GOOD' ? 'text-green-500' : 'text-yellow-500'}>{guest.connectionQuality}</span>
                            <span>•</span>
                            <span className="truncate">{guest.email}</span>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-gray-700 rounded text-gray-400"><Copy size={14}/></button>
                </div>
            ))}
        </div>
      </div>

      {/* DISTRIBUTION PANEL */}
      <div className="min-w-[300px] flex flex-col bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase text-purple-400 flex items-center gap-2"><Globe size={14} /> Multi-Stream</h3>
            <span className="text-[10px] text-gray-400">3 ACTIVE</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
            {destinations.map(dest => (
                <div key={dest.id} className="bg-black/40 rounded p-3 border border-gray-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${dest.status === 'LIVE' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
                        <div>
                            <div className="font-bold text-sm text-gray-200">{dest.platform}</div>
                            <div className="text-[10px] text-gray-500">{dest.name}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-mono text-lg font-bold text-white">{dest.viewers.toLocaleString()}</div>
                        <div className="text-[9px] uppercase text-gray-500">Viewers</div>
                    </div>
                </div>
            ))}
        </div>
        <div className="p-2 border-t border-gray-800">
            <button className="w-full py-2 bg-gray-800 text-xs font-bold text-gray-400 rounded hover:bg-gray-700 border border-gray-600 border-dashed flex items-center justify-center gap-2">
                <Plus size={12}/> ADD DESTINATION
            </button>
        </div>
      </div>

      {/* FIELD UNITS (LiveU Style) */}
      <div className="min-w-[300px] flex flex-col bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase text-orange-400 flex items-center gap-2"><Wifi size={14} /> Field Units (LRT™)</h3>
            <span className="text-[10px] bg-green-900/40 text-green-400 px-1 rounded border border-green-800">SERVER OK</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
            {units.map(unit => (
                <div key={unit.id} className="bg-black/40 rounded p-2 border border-gray-800">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{unit.name}</span>
                            <span className="text-[10px] bg-gray-700 px-1 rounded text-gray-300">{unit.model}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Battery size={10} className={unit.battery < 20 ? 'text-red-500' : 'text-green-500'} /> {unit.battery}%
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-gray-900 rounded p-1">
                            <div className="text-[9px] text-gray-500">DELAY</div>
                            <div className="text-xs font-mono font-bold text-blue-400">{unit.latencyMs}ms</div>
                        </div>
                        <div className="bg-gray-900 rounded p-1">
                            <div className="text-[9px] text-gray-500">BITRATE</div>
                            <div className="text-xs font-mono font-bold text-green-400">{unit.bitrateMb} Mb</div>
                        </div>
                        <div className="bg-gray-900 rounded p-1">
                            <div className="text-[9px] text-gray-500">SIGNAL</div>
                            <div className="text-xs font-mono font-bold text-white flex justify-center items-center gap-1">
                                <Signal size={10} /> OK
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};