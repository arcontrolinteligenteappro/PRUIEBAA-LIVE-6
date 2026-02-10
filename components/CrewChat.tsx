import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ProductionRole } from '../types';
import { Send, X } from 'lucide-react';

interface CrewChatProps {
  messages: ChatMessage[];
  currentUser: string;
  onSend: (text: string) => void;
  onClose: () => void;
}

export const CrewChat: React.FC<CrewChatProps> = ({ messages, currentUser, onSend, onClose }) => {
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <div className="fixed bottom-20 right-4 w-80 h-96 bg-[#1a1a1a] border border-gray-700 shadow-2xl rounded-lg flex flex-col z-50 animate-[slideUp_0.2s_ease-out]">
        <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-3">
            <span className="font-bold text-xs text-gray-300">CREW COMMS</span>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={14} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === currentUser ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className={`text-[10px] font-bold ${msg.sender === currentUser ? 'text-blue-400' : 'text-orange-400'}`}>{msg.sender}</span>
                        <span className="text-[8px] text-gray-600">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className={`px-3 py-2 rounded text-xs max-w-[85%] ${msg.sender === currentUser ? 'bg-blue-900/30 text-blue-100 border border-blue-800' : 'bg-gray-800 text-gray-200 border border-gray-700'}`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            <div ref={endRef}></div>
        </div>

        <form onSubmit={handleSend} className="p-2 border-t border-gray-700 flex gap-2">
            <input 
                className="flex-1 bg-black border border-gray-700 rounded px-2 text-xs text-white focus:outline-none focus:border-blue-500" 
                placeholder="Type message..." 
                value={text}
                onChange={e => setText(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded"><Send size={14} /></button>
        </form>
    </div>
  );
};