
import React, { useState } from 'react';
import { MasterAudioState, SocialComment, ChatMessage, BroadcastMacro } from '../types';
import { AudioMasterSection } from './AudioMasterSection';
import { MessageSquare, Users, Zap, List } from 'lucide-react';
import { ChatHub } from './ChatHub';

interface StudioRightPanelProps {
  masterAudio: MasterAudioState;
  onUpdateMaster: (state: MasterAudioState) => void;
  socialFeed: SocialComment[];
  onToggleSocial: (id: string) => void;
  crewChat: ChatMessage[];
  macros: BroadcastMacro[];
  onTriggerMacro: (m: BroadcastMacro) => void;
}

export const StudioRightPanel: React.FC<StudioRightPanelProps> = ({ 
    masterAudio, onUpdateMaster, socialFeed, onToggleSocial, crewChat, macros, onTriggerMacro 
}) => {
  const [activeTab, setActiveTab] = useState<'CHAT' | 'MACROS'>('CHAT');

  return (
    <div className="flex flex-col h-full bg-[#111] border-l border-gray-800">
        
        {/* TOP: AUDIO MASTER (Fixed) */}
        <div className="border-b border-gray-800">
            <AudioMasterSection state={masterAudio} onUpdate={onUpdateMaster} />
        </div>

        {/* BOTTOM: TABS */}
        <div className="flex-1 flex flex-col min-h-0">
            <div className="flex h-10 border-b border-gray-800 bg-[#151515]">
                <TabBtn active={activeTab === 'CHAT'} onClick={() => setActiveTab('CHAT')} icon={<MessageSquare size={14}/>} />
                <TabBtn active={activeTab === 'MACROS'} onClick={() => setActiveTab('MACROS')} icon={<Zap size={14}/>} />
            </div>

            <div className="flex-1 overflow-hidden relative">
                
                {/* CHAT HUB (UNIFIED) */}
                {activeTab === 'CHAT' && (
                    <ChatHub />
                )}

                {/* MACROS */}
                {activeTab === 'MACROS' && (
                    <div className="grid grid-cols-1 gap-2 p-2 overflow-y-auto">
                        {macros.map(m => (
                            <button 
                                key={m.id} 
                                onClick={() => onTriggerMacro(m)}
                                className={`h-10 rounded font-bold text-xs text-white flex items-center justify-center gap-2 ${m.color} active:scale-95 transition-transform`}
                            >
                                <Zap size={12}/> {m.label}
                            </button>
                        ))}
                    </div>
                )}

            </div>
        </div>
    </div>
  );
};

const TabBtn = ({ active, onClick, icon }: any) => (
    <button 
        onClick={onClick}
        className={`flex-1 flex items-center justify-center transition-colors ${active ? 'bg-[#111] text-white border-t-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
    >
        {icon}
    </button>
);
