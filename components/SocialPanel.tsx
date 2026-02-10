import React from 'react';
import { SocialComment } from '../types';
import { MessageCircle, Star, Trash2, CheckCircle } from 'lucide-react';

interface SocialPanelProps {
  feed: SocialComment[];
  onToggleOnAir: (id: string) => void;
}

export const SocialPanel: React.FC<SocialPanelProps> = ({ feed, onToggleOnAir }) => {
  return (
    <div className="flex h-full bg-[#151515] overflow-hidden">
        {/* Feed Column */}
        <div className="flex-1 flex flex-col border-r border-gray-700">
            <div className="p-2 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><MessageCircle size={14} /> Social Feed Aggregator</h3>
                <span className="text-[10px] text-green-400 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> CONNECTED</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {feed.map(comment => (
                    <div key={comment.id} className={`p-3 rounded border flex gap-3 ${comment.isOnAir ? 'bg-blue-900/20 border-blue-500' : 'bg-[#222] border-gray-700'}`}>
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold text-white text-xs">
                            {comment.avatar}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-xs text-gray-300">{comment.user}</span>
                                <span className="text-[9px] uppercase font-bold text-gray-500">{comment.platform}</span>
                            </div>
                            <p className="text-xs text-gray-400 leading-snug">{comment.message}</p>
                        </div>
                        <div className="flex flex-col gap-1 justify-center">
                            <button 
                                onClick={() => onToggleOnAir(comment.id)}
                                className={`p-2 rounded hover:bg-gray-700 ${comment.isOnAir ? 'text-blue-400' : 'text-gray-500'}`}
                                title="Show on Stream"
                            >
                                <Star size={14} fill={comment.isOnAir ? "currentColor" : "none"} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Analytics / Settings Column (Placeholder) */}
        <div className="w-48 bg-[#1a1a1a] p-4 flex flex-col gap-4">
            <div>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Polls</h4>
                <div className="bg-[#222] border border-gray-700 rounded p-2 text-center text-xs text-gray-400">
                    No active polls
                </div>
            </div>
            <div>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Word Cloud</h4>
                <div className="flex flex-wrap gap-1">
                    <span className="text-xs text-gray-300 bg-gray-800 px-1 rounded">amazing</span>
                    <span className="text-xs text-gray-300 bg-gray-800 px-1 rounded">love it</span>
                    <span className="text-xs text-gray-300 bg-gray-800 px-1 rounded">price?</span>
                </div>
            </div>
        </div>
    </div>
  );
};