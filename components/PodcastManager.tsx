
import React from 'react';
import { PodcastSeries, PodcastEpisode } from '../types';
import { Play, Calendar, Mic, Plus, Edit3, Settings, MoreHorizontal, Layers } from 'lucide-react';

interface PodcastManagerProps {
  series: PodcastSeries[];
  episodes: PodcastEpisode[];
  onSelectEpisode: (episodeId: string) => void;
}

export const PodcastManager: React.FC<PodcastManagerProps> = ({ series, episodes, onSelectEpisode }) => {
  const activeSeries = series[0]; // Simplification for demo
  const activeEpisodes = episodes.filter(ep => ep.seriesId === activeSeries.id);

  return (
    <div className="flex h-full bg-[#0d0d0d] text-gray-200 font-sans">
        
        {/* LEFT: SERIES LIST (CMS Style) */}
        <div className="w-72 border-r border-gray-800 flex flex-col bg-[#111]">
            <div className="p-5 border-b border-gray-800">
                <h1 className="text-sm font-black text-gray-500 tracking-widest uppercase mb-4 flex items-center gap-2"><Layers size={14}/> MY SHOWS</h1>
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all">
                    <Plus size={14} /> CREATE NEW PODCAST
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {series.map(s => (
                    <div key={s.id} className={`p-3 rounded-xl border-2 flex gap-3 cursor-pointer transition-all group ${s.id === activeSeries.id ? 'bg-[#1a1a1a] border-blue-600 shadow-md' : 'bg-transparent border-transparent hover:bg-[#1a1a1a] hover:border-gray-700'}`}>
                        <div className="relative">
                            <img src={s.coverUrl} className="w-16 h-16 rounded-lg object-cover shadow-sm" />
                            {s.id === activeSeries.id && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full"></div>}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h3 className="font-bold text-sm text-white truncate">{s.title}</h3>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">{s.language} • {s.totalEpisodes} EPS</p>
                        </div>
                        <button className="text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal size={16}/></button>
                    </div>
                ))}
            </div>
        </div>

        {/* CENTER: EPISODE DASHBOARD */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0f0f0f]">
            
            {/* Header / Context */}
            <div className="h-64 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-b border-gray-800 p-8 flex items-end gap-8 relative">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                    <img src={activeSeries.coverUrl} className="w-full h-full object-cover blur-3xl scale-110" />
                </div>
                
                <img src={activeSeries.coverUrl} className="w-48 h-48 rounded-xl shadow-2xl z-10 border-4 border-[#222]" />
                
                <div className="flex-1 z-10 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Series</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{activeSeries.language}</span>
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tight mb-4">{activeSeries.title}</h2>
                    <p className="text-gray-400 max-w-2xl text-sm leading-relaxed mb-6 line-clamp-2">The daily show about everything tech, broadcast, and future media workflows hosted by {activeSeries.host}. Manage your episodes, plan content, and go live directly from here.</p>
                    
                    <div className="flex gap-4">
                        <Stat label="SEASONS" value="2" />
                        <div className="w-px bg-gray-700"></div>
                        <Stat label="EPISODES" value={activeSeries.totalEpisodes.toString()} />
                        <div className="w-px bg-gray-700"></div>
                        <Stat label="LISTENERS" value="12.5K" />
                        <div className="w-px bg-gray-700"></div>
                        <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                            <Settings size={14} /> SETTINGS
                        </button>
                    </div>
                </div>
            </div>

            {/* Episode List */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Layers size={20} className="text-gray-500"/> Episodes</h3>
                    <button className="bg-white hover:bg-gray-200 text-black px-5 py-2.5 rounded-full font-black text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
                        <Plus size={14} /> NEW EPISODE
                    </button>
                </div>

                <div className="grid gap-4">
                    {activeEpisodes.map(ep => (
                        <div key={ep.id} className="bg-[#151515] border border-gray-800 rounded-xl p-4 flex items-center gap-6 hover:border-gray-600 transition-all group hover:bg-[#1a1a1a]">
                            <div className="flex flex-col items-center justify-center w-16 h-16 bg-[#222] rounded-lg text-gray-500 font-mono border border-gray-700 group-hover:border-gray-500">
                                <span className="text-[10px] font-bold">S{ep.season}</span>
                                <span className="text-2xl font-black text-white">E{ep.episodeNumber}</span>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-bold text-white text-lg truncate">{ep.title}</h4>
                                    <StatusBadge status={ep.status} />
                                </div>
                                <p className="text-sm text-gray-500 truncate">{ep.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 font-mono">
                                    <span className="flex items-center gap-1"><Calendar size={12}/> {ep.recordedDate ? ep.recordedDate.toLocaleDateString() : 'Not Recorded'}</span>
                                    <span className="flex items-center gap-1"><Mic size={12}/> {ep.guests.length > 0 ? ep.guests.join(', ') : 'Solo'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {ep.status === 'DRAFT' && (
                                    <button 
                                        onClick={() => onSelectEpisode(ep.id)}
                                        className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                                    >
                                        <Play size={14} fill="currentColor" /> OPEN STUDIO
                                    </button>
                                )}
                                {ep.status === 'PUBLISHED' && (
                                    <button className="bg-gray-800 text-gray-400 px-4 py-2 rounded-lg text-xs font-bold border border-gray-700 hover:text-white">
                                        ANALYTICS
                                    </button>
                                )}
                                <button className="p-2 text-gray-500 hover:text-white bg-transparent hover:bg-gray-800 rounded transition-colors"><Edit3 size={18}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

const Stat = ({ label, value }: any) => (
    <div>
        <div className="text-2xl font-black text-white leading-none">{value}</div>
        <div className="text-[9px] font-bold text-gray-600 tracking-widest mt-1">{label}</div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    let color = 'bg-gray-800 text-gray-500 border-gray-700';
    if (status === 'DRAFT') color = 'bg-yellow-900/30 text-yellow-400 border-yellow-800';
    if (status === 'PUBLISHED') color = 'bg-green-900/30 text-green-400 border-green-800';
    return <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase border ${color}`}>{status}</span>;
};
