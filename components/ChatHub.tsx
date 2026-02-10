
import React, { useState } from 'react';
import { ChatMessage, EngagementAlert } from '../types';
import { MessageSquare, Pin, Trash2, Ban, Eye, Star, Heart, DollarSign, Send, Filter } from 'lucide-react';
import { useBroadcastStore } from '../core/store';

export const ChatHub: React.FC = () => {
  const { chatMessages, sendChatMessage, pinChatMessage, deleteChatMessage } = useBroadcastStore();
  const [filter, setFilter] = useState<'ALL' | 'MENTIONS' | 'ALERTS'>('ALL');
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      const newMsg: ChatMessage = {
          id: Math.random().toString(36).substr(2,9),
          sender: 'Director',
          role: 'DIRECTOR',
          platform: 'TWITCH',
          text: input,
          timestamp: new Date(),
          color: '#FF4444'
      };
      sendChatMessage(newMsg);
      setInput('');
  };

  const getPlatformIcon = (p: string) => {
      switch(p) {
          case 'TWITCH': return <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center text-[8px] font-bold text-white">Tw</div>;
          case 'YOUTUBE': return <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-[8px] font-bold text-white">YT</div>;
          default: return <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-[8px] font-bold text-white">FB</div>;
      }
  };

  const filteredMessages = chatMessages.filter(m => !m.isDeleted); // Filter logic can be expanded

  return (
    <div className="flex flex-col h-full bg-[#111] border-l border-gray-800">
        
        {/* Header */}
        <div className="h-10 bg-[#1a1a1a] border-b border-gray-800 flex justify-between items-center px-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                <MessageSquare size={14} /> CHAT HUB
            </div>
            <div className="flex bg-black rounded p-0.5">
                <button onClick={() => setFilter('ALL')} className={`px-2 py-0.5 text-[9px] font-bold rounded ${filter === 'ALL' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>ALL</button>
                <button onClick={() => setFilter('ALERTS')} className={`px-2 py-0.5 text-[9px] font-bold rounded ${filter === 'ALERTS' ? 'bg-red-900 text-red-200' : 'text-gray-500'}`}>ALERTS</button>
            </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredMessages.map(msg => (
                <div key={msg.id} className={`group relative p-2 rounded text-xs border ${msg.isPinned ? 'bg-blue-900/20 border-blue-500' : 'bg-transparent border-transparent hover:bg-[#1a1a1a] hover:border-gray-800'}`}>
                    
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                        {getPlatformIcon(msg.platform)}
                        <span className="font-bold" style={{ color: msg.color || '#ccc' }}>{msg.sender}</span>
                        {msg.role && <span className="text-[8px] bg-gray-700 px-1 rounded text-gray-300">{msg.role}</span>}
                        <span className="text-[9px] text-gray-600 ml-auto">{msg.timestamp.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                    
                    {/* Body */}
                    <p className="text-gray-300 leading-snug pl-6">{msg.text}</p>

                    {/* Quick Actions (Hover) */}
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-[#1a1a1a] p-1 rounded shadow-sm">
                        <button onClick={() => pinChatMessage(msg.id)} title="Show On Screen" className={`p-1 hover:bg-gray-700 rounded ${msg.isPinned ? 'text-blue-400' : 'text-gray-400'}`}><Star size={12} fill={msg.isPinned ? "currentColor" : "none"}/></button>
                        <button onClick={() => deleteChatMessage(msg.id)} title="Delete" className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400"><Trash2 size={12}/></button>
                        <button title="Ban User" className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400"><Ban size={12}/></button>
                    </div>
                </div>
            ))}
        </div>

        {/* Simulated Alerts Queue (Mini) */}
        <div className="bg-[#1a1a1a] border-t border-gray-800 p-2">
            <h4 className="text-[9px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><Heart size={10}/> Pending Alerts</h4>
            <div className="flex gap-2 overflow-x-auto">
                <button className="flex items-center gap-2 bg-purple-900/30 border border-purple-600 rounded px-2 py-1 min-w-max hover:bg-purple-900/50">
                    <Star size={10} className="text-yellow-400"/>
                    <div className="flex flex-col text-left">
                        <span className="text-[9px] font-bold text-white">New Sub</span>
                        <span className="text-[8px] text-purple-300">GamerTag123</span>
                    </div>
                </button>
                <button className="flex items-center gap-2 bg-green-900/30 border border-green-600 rounded px-2 py-1 min-w-max hover:bg-green-900/50">
                    <DollarSign size={10} className="text-green-400"/>
                    <div className="flex flex-col text-left">
                        <span className="text-[9px] font-bold text-white">$50.00</span>
                        <span className="text-[8px] text-green-300">SuperFan</span>
                    </div>
                </button>
            </div>
        </div>

        {/* Composer */}
        <form onSubmit={handleSend} className="p-2 border-t border-gray-800 bg-[#0d0d0d]">
            <div className="flex gap-2">
                <input 
                    className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded px-2 py-2 text-xs text-white focus:border-blue-500 outline-none"
                    placeholder="Send message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded">
                    <Send size={14} />
                </button>
            </div>
        </form>
    </div>
  );
};
