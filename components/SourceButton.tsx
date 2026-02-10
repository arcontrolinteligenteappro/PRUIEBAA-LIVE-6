
import React from 'react';
import { Settings, Play, Image, Video, Monitor, Globe, Mic, Plane, Battery, Signal, Wifi, Thermometer, AlertCircle } from 'lucide-react';
import { VideoSource } from '../types';

interface SourceButtonProps extends Omit<VideoSource, 'type'> {
  label: string;
  isActive: boolean;
  type: 'PGM' | 'PVW';
  sourceType?: string;
  onClick: () => void;
  onSettings?: () => void;
}

export const SourceButton: React.FC<SourceButtonProps> = ({ label, isActive, type, sourceType, health, onClick, onSettings }) => {
  const activeColor = type === 'PGM' ? 'bg-red-600 border-red-400' : 'bg-green-600 border-green-400';
  const inactiveColor = 'bg-broadcast-surface border-gray-700 hover:bg-gray-700';

  const getIcon = () => {
      switch(sourceType) {
          case 'MEDIA': return <Video size={12} className="text-blue-400" />;
          case 'PTZ': return <Monitor size={12} className="text-purple-400" />;
          case 'NDI': return <Globe size={12} className="text-green-400" />;
          case 'REMOTE': return <Mic size={12} className="text-orange-400" />;
          case 'DRONE': return <Plane size={12} className="text-yellow-400" />;
          default: return null;
      }
  };

  const getBatteryColor = (level?: number) => {
      if (!level) return 'text-gray-500';
      if (level < 20) return 'text-red-500 animate-pulse';
      if (level < 50) return 'text-yellow-500';
      return 'text-green-500';
  };

  return (
    <div className="relative group w-full aspect-video">
        <button
        onClick={onClick}
        className={`
            w-full h-full rounded-md border-b-4 transition-all duration-75 active:scale-95
            flex flex-col items-center justify-center gap-1 p-1 relative overflow-hidden
            ${isActive ? activeColor : inactiveColor}
            ${isActive ? 'text-white' : 'text-gray-400'}
        `}
        >
        <div className="w-full h-full bg-black/20 rounded-sm flex items-center justify-center relative overflow-hidden">
            {/* Tiny preview thumbnail simulation */}
            <div className={`w-3/4 h-3/4 rounded-sm ${isActive ? 'bg-white/20' : 'bg-white/5'}`}></div>
            
            {/* Source Type Icon */}
            <div className="absolute top-1 left-1 bg-black/60 rounded p-0.5">{getIcon()}</div>

            {/* CRITICAL MONITORING OVERLAYS */}
            {health && (
                <div className="absolute top-0 right-0 p-1 flex flex-col items-end gap-0.5 pointer-events-none">
                    {health.batteryLevel !== undefined && (
                        <div className={`flex items-center gap-0.5 text-[8px] bg-black/60 rounded px-1 ${getBatteryColor(health.batteryLevel)}`}>
                            <Battery size={8} /> {health.batteryLevel}%
                        </div>
                    )}
                    {health.signalStrength !== undefined && (
                        <div className="flex items-center gap-0.5 text-[8px] bg-black/60 rounded px-1 text-white">
                            <Wifi size={8} className={health.signalStrength < 50 ? 'text-red-500' : 'text-white'} /> {health.signalStrength}%
                        </div>
                    )}
                    {health.temperature && health.temperature > 60 && (
                        <div className="flex items-center gap-0.5 text-[8px] bg-red-900/80 rounded px-1 text-red-200 animate-pulse">
                            <Thermometer size={8} /> {health.temperature}°C
                        </div>
                    )}
                </div>
            )}
            
            {/* ISO RECORD INDICATOR */}
            <div className="absolute bottom-1 left-1 text-[8px] font-bold bg-black/60 px-1 rounded text-gray-400">
                1080p60
            </div>
        </div>
        
        <div className="w-full flex justify-between items-end px-1">
             <span className="font-mono text-xs font-bold truncate max-w-[80%]">{label}</span>
        </div>
        
        {/* LED Status Indicator */}
        <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${isActive ? 'bg-white shadow-[0_0_5px_white]' : 'bg-black/50'}`}></div>
        </button>

        {/* Settings Gear - Only visible on hover */}
        <button 
            onClick={(e) => { e.stopPropagation(); onSettings && onSettings(); }}
            className="absolute bottom-6 right-2 p-1 bg-black/50 text-gray-400 hover:text-white rounded hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
            <Settings size={12} />
        </button>
    </div>
  );
};
