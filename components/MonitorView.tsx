
import React, { useState, useEffect } from 'react';
import { VideoSource, GraphicsOverlay, SocialComment, UniversalSportsState, CommercialLayout, PodcastState, RemoteGuest, StreamerState, Sponsor, Product } from '../types';
import { SportsGraphicsEngine } from './SportsGraphicsEngine'; 
import { PodcastLayoutEngine } from './PodcastLayoutEngine';
import { StreamLayoutEngine } from './StreamLayoutEngine';
import { SponsorOverlay } from './SponsorOverlay';
import { ProductOverlay } from './ProductOverlay';
import { MessageSquare, Target, ShoppingBag, TrendingUp, AlertOctagon } from 'lucide-react';

interface MonitorProps {
  label: string;
  source: VideoSource | undefined;
  type: 'PGM' | 'PVW';
  className?: string;
  showOverlays?: boolean;
  overlaysData?: GraphicsOverlay[];
  aspectRatio?: '16:9' | '9:16';
  activeSocial?: SocialComment;
  sportsData?: UniversalSportsState;
  commercialMode?: CommercialLayout;
  
  // Podcast Props
  isPodcastMode?: boolean;
  podcastState?: PodcastState;
  guests?: RemoteGuest[];

  // Streamer Props
  isGamingMode?: boolean;
  streamerState?: StreamerState;
  allSources?: VideoSource[]; 

  // Commerce Props
  activeProductId?: string | null;
  products?: Product[];
  flashSaleTime?: number | null;
  socialProofActive?: boolean;
  showShipping?: boolean;
  showBundle?: boolean;
  discountActive?: boolean;

  // General/Sponsor Props
  sponsors?: Sponsor[];
}

// Internal SafeImage Component for PGM Reliability
const SafeImage = ({ src, alt, className, isPGM }: { src: string, alt: string, className: string, isPGM: boolean }) => {
    const [error, setError] = useState(false);

    // Reset error state if src changes (attempt to recover)
    useEffect(() => {
        setError(false);
    }, [src]);

    if (error || !src) {
        return (
            <div className={`w-full h-full flex flex-col items-center justify-center ${isPGM ? 'bg-black' : 'bg-gray-900'} ${className}`}>
                {isPGM ? (
                    // PGM Fail-safe state: Clean Black or Technical Diff
                    <div className="flex flex-col items-center text-gray-500 animate-pulse">
                        <AlertOctagon size={48} className="text-red-900 mb-2" />
                        <span className="font-mono font-black text-2xl tracking-widest text-red-900">NO SIGNAL</span>
                        <span className="text-[10px] font-mono text-gray-700 mt-2">ERR_SRC_LOST</span>
                    </div>
                ) : (
                    // PVW state
                    <div className="text-gray-600 font-mono text-xs">SIGNAL LOST</div>
                )}
            </div>
        );
    }

    return (
        <img 
            src={src} 
            alt={alt} 
            className={className} 
            onError={() => {
                console.error(`[BroadcastEngine] Source Failed: ${src}`);
                setError(true);
            }}
        />
    );
};

export const MonitorView: React.FC<MonitorProps> = ({ 
  label, source, type, className, showOverlays, overlaysData, aspectRatio = '16:9', activeSocial, sportsData, commercialMode = 'OFF',
  isPodcastMode, podcastState, guests,
  isGamingMode, streamerState, allSources,
  activeProductId, products, flashSaleTime, socialProofActive, showShipping, showBundle, discountActive,
  sponsors
}) => {
  const borderColor = type === 'PGM' ? 'border-broadcast-accent' : 'border-broadcast-preview';
  const textColor = type === 'PGM' ? 'text-broadcast-accent' : 'text-broadcast-preview';

  // Commerce Logic
  const activeProduct = products?.find(p => p.id === activeProductId);

  return (
    <div className={`flex flex-col h-full bg-black relative rounded-sm overflow-hidden border-2 transition-all duration-300 ${borderColor} ${className}`}>
      {/* Tally Light / Label Overlay */}
      <div className="absolute top-2 left-2 z-10 bg-black/70 px-3 py-1 rounded backdrop-blur-sm flex items-center gap-2 pointer-events-none">
        <div className={`w-3 h-3 rounded-full ${type === 'PGM' ? 'bg-red-600 animate-pulse' : 'bg-green-600'}`}></div>
        <span className={`font-bold font-mono text-sm ${textColor}`}>{label}</span>
      </div>
      
      {/* Source Name Overlay */}
      <div className="absolute bottom-2 right-2 z-10 bg-black/60 px-2 py-1 rounded text-xs text-white font-mono pointer-events-none">
        {isPodcastMode ? 'PODCAST ENGINE' : isGamingMode ? 'STREAM ENGINE' : (source?.name || 'NO SIGNAL')}
      </div>

      {/* Video Content Container */}
      <div className="flex-1 bg-gray-900 relative w-full h-full overflow-hidden flex items-center justify-center">
        
        {/* MODE SPECIFIC RENDERERS */}
        {isPodcastMode && podcastState && guests ? (
             <PodcastLayoutEngine 
                layout={podcastState.activeLayout} 
                guests={guests} 
                activeSpeakerId={podcastState.activeSpeakerId} 
             />
        ) : isGamingMode && streamerState && allSources ? (
             <StreamLayoutEngine 
                scene={streamerState.activeScene}
                gameSource={allSources.find(s => s.id === streamerState.gameSourceId)}
                faceCamSource={allSources.find(s => s.id === streamerState.faceCamId)}
                alerts={streamerState.alerts}
                privacyMode={streamerState.privacyMode}
             />
        ) : (
            /* STANDARD BROADCAST MODE */
            type === 'PGM' && commercialMode === 'SIDE_BY_SIDE' ? (
                <div className="w-full h-full flex bg-[#111]">
                    {/* Game Feed (Shrunk) */}
                    <div className="w-[40%] h-full flex items-center justify-center bg-black relative border-r-2 border-yellow-500">
                        {source && (
                            <SafeImage 
                                src={source.previewUrl} 
                                alt={source.name} 
                                className="w-full h-auto object-cover" 
                                isPGM={true}
                            />
                        )}
                        <div className="absolute top-2 right-2 bg-black/80 text-white text-[10px] px-2 rounded">GAME AUDIO: 20%</div>
                    </div>
                    {/* Commercial Feed */}
                    <div className="flex-1 h-full relative">
                        <img src="https://picsum.photos/800/600?random=ad" className="w-full h-full object-cover" />
                        <div className="absolute bottom-4 left-4 bg-yellow-500 text-black font-black px-4 py-2 text-xl shadow-lg">
                            ADVERTISEMENT
                        </div>
                    </div>
                </div>
            ) : (
                // Standard Full Screen Layout
                <div className={`relative overflow-hidden transition-all duration-300 ${aspectRatio === '9:16' ? 'aspect-[9/16] h-full bg-black border-x border-gray-800' : 'w-full h-full'}`}>
                    
                    <SafeImage 
                        src={source?.previewUrl || ''} 
                        alt={source?.name || 'No Source'} 
                        className={`w-full h-full object-cover ${aspectRatio === '9:16' ? 'scale-[1.77]' : ''}`} 
                        isPGM={type === 'PGM'}
                    />
                    
                    {/* GRAPHICS LAYER (Integrated SGDVE) */}
                    {showOverlays && sportsData && !isPodcastMode && !isGamingMode && (
                        <SportsGraphicsEngine data={sportsData} />
                    )}

                    {/* SPONSOR LAYER (Always on top if active) */}
                    {showOverlays && sponsors && <SponsorOverlay sponsors={sponsors} />}

                    {/* COMMERCE: PRODUCT OVERLAY (Sales Mode) */}
                    {showOverlays && activeProduct && (
                        <ProductOverlay 
                            product={activeProduct} 
                            flashSaleTime={flashSaleTime || null}
                            showShipping={showShipping}
                            showBundle={showBundle}
                            discountActive={discountActive}
                        />
                    )}

                    {/* COMMERCE: SOCIAL PROOF TOAST */}
                    {showOverlays && socialProofActive && (
                        <div className="absolute top-20 right-8 bg-white/90 backdrop-blur text-black px-4 py-2 rounded-full shadow-xl animate-[slideLeft_0.5s] flex items-center gap-2 border-2 border-green-500 z-50">
                            <div className="bg-green-500 p-1 rounded-full text-white"><TrendingUp size={12}/></div>
                            <div className="text-xs font-bold">Maria S. just bought 2 items!</div>
                        </div>
                    )}

                    {/* LEGACY / SOCIAL COMMENT OVERLAY */}
                    {showOverlays && activeSocial && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[80%] max-w-2xl bg-[#1e1e1e]/95 text-white p-4 rounded-xl shadow-2xl backdrop-blur-md animate-[slideUp_0.5s_ease-out] border border-gray-700">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xs shadow-inner">{activeSocial.avatar}</div>
                                <div>
                                    <div className="font-bold text-sm text-gray-100 flex items-center gap-2">
                                        {activeSocial.user}
                                        <span className="text-[9px] bg-gray-700 px-1.5 rounded uppercase">{activeSocial.platform}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-lg font-medium leading-tight">{activeSocial.message}</p>
                        </div>
                    )}

                    {/* Safety Areas */}
                    <div className="absolute inset-0 border border-white/20 m-8 pointer-events-none opacity-50"></div>
                    <div className="absolute inset-0 border border-white/10 m-16 pointer-events-none opacity-30"></div>
                </div>
            )
        )}

      </div>
    </div>
  );
};
