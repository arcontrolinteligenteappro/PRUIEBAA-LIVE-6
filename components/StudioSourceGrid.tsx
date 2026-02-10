
import React from 'react';
import { VideoSource } from '../types';
import { SourceButton } from './SourceButton';
import { Plus } from 'lucide-react';

interface StudioSourceGridProps {
  sources: VideoSource[];
  previewId: string;
  programId: string;
  onSelectPreview: (id: string) => void;
  onSelectProgram: (id: string) => void;
  onSettings: (id: string) => void;
}

export const StudioSourceGrid: React.FC<StudioSourceGridProps> = ({ 
    sources, previewId, programId, onSelectPreview, onSelectProgram, onSettings 
}) => {
  return (
    <div className="flex flex-col h-full bg-[#151515] p-2">
        <div className="flex justify-between items-center mb-2 px-1">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase">SOURCES</h3>
            <button className="text-[10px] bg-blue-600 px-2 py-1 rounded text-white flex items-center gap-1 hover:bg-blue-500">
                <Plus size={10} /> ADD
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2 content-start">
            {sources.map(src => (
                <div key={src.id} className="relative group">
                    <SourceButton 
                        {...src} 
                        label={src.name} 
                        sourceType={src.type}
                        type={src.id === programId ? 'PGM' : 'PVW'} 
                        isActive={src.id === programId || src.id === previewId} 
                        onClick={() => onSelectPreview(src.id)}
                        onSettings={() => onSettings(src.id)}
                    />
                    {/* Quick Cut Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                        <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded pointer-events-auto cursor-pointer" onClick={(e) => { e.stopPropagation(); onSelectProgram(src.id); }}>CUT</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
