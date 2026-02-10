
import React, { useState } from 'react';
import { AudioChannel, MasterAudioState, DJState } from '../types';
import { AudioChannelStrip } from './AudioChannelStrip';
import { AudioMasterSection } from './AudioMasterSection';
import { DJController } from './DJController';
import { Disc, Repeat, ArrowLeftRight } from 'lucide-react';

interface AudioMixerProps {
  channels: AudioChannel[];
  masterLevel: number;
  masterAudio: MasterAudioState;
  djState: DJState;
  onChannelChange: (updated: AudioChannel) => void;
  onEditChannel?: (channelId: string) => void;
  onUpdateMaster: (newState: MasterAudioState) => void;
  onUpdateDJ: (newState: DJState) => void;
}

export const AudioMixer: React.FC<AudioMixerProps> = ({ 
    channels, masterLevel, masterAudio, djState, onChannelChange, onEditChannel, onUpdateMaster, onUpdateDJ 
}) => {
  const [showDJ, setShowDJ] = useState(false);

  return (
    <div className="flex h-full bg-[#1a1a1a] overflow-hidden relative">
      
      {/* INPUTS SCROLL AREA */}
      <div className="flex-1 overflow-x-auto scrollbar-thin flex">
          {/* Quick Tools Header (Optional floating or fixed) */}
          <div className="min-w-[60px] bg-[#111] border-r border-gray-800 flex flex-col items-center py-4 gap-4">
              <button 
                onClick={() => setShowDJ(true)}
                className="w-10 h-10 rounded-full bg-purple-900/50 border border-purple-500 text-purple-300 flex items-center justify-center hover:bg-purple-800 hover:text-white transition-all shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                title="DJ Mode"
              >
                  <Disc size={20} className={djState.deckA.isPlaying || djState.deckB.isPlaying ? 'animate-spin-slow' : ''} />
              </button>
              
              <button 
                onClick={() => onUpdateMaster({ ...masterAudio, audioFollowScene: !masterAudio.audioFollowScene })}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${masterAudio.audioFollowScene ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_10px_blue]' : 'bg-[#222] text-gray-500 border-gray-700'}`}
                title="Audio Follow Video"
              >
                  <Repeat size={18} />
              </button>

              <button className="w-10 h-10 rounded-full bg-[#222] border border-gray-700 text-gray-500 flex items-center justify-center hover:text-white">
                  <ArrowLeftRight size={18} />
              </button>
          </div>

          {/* Input Channels */}
          {channels.map((ch) => (
            <AudioChannelStrip 
                key={ch.id} 
                channel={ch} 
                onChange={onChannelChange} 
                onEdit={onEditChannel}
            />
          ))}
      </div>

      {/* MASTER SECTION (Fixed Right) */}
      <AudioMasterSection state={masterAudio} onUpdate={onUpdateMaster} />

      {/* DJ OVERLAY */}
      {showDJ && (
          <DJController state={djState} onUpdate={onUpdateDJ} onClose={() => setShowDJ(false)} />
      )}
    </div>
  );
};
