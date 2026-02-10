
import React, { useEffect, useState, useMemo } from 'react';
import { BootState, BootPhase } from './bootState';

interface SplashScreenProps {
  bootState: BootState;
  onBootComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ bootState, onBootComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (bootState.type === 'Ready') {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 300); // Short delay before starting fade
            const navigateTimer = setTimeout(onBootComplete, 800); // Must be > fade duration
            return () => {
                clearTimeout(timer);
                clearTimeout(navigateTimer);
            };
        }
    }, [bootState, onBootComplete]);

    const progress = bootState.type === 'Loading' ? bootState.progress : 1;
    const phaseMessage = bootState.type === 'Loading' ? bootState.phase : "READY";

    return (
        <div className={`fixed inset-0 bg-[#0A0A0B] flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <ScanlineEffect />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#00202B_0%,_black_60%)] opacity-50"></div>

            <div className="flex flex-col items-center justify-center flex-1 z-10">
                <LogoAndGlow />
            </div>

            <div className="w-full max-w-sm p-8 z-10">
                <BootStatus progress={progress} message={phaseMessage} />
            </div>
            
            <div className="absolute bottom-6 text-center text-white/30 text-[10px] tracking-[1px] z-10">
                <p>Desarrollado por ChrisRey91</p>
                <p>www.arcontrolinteligente.com</p>
            </div>
        </div>
    );
};

const LogoAndGlow: React.FC = () => (
    <div className="relative flex flex-col items-center justify-center">
        <div className="absolute w-40 h-40 bg-[radial-gradient(circle_at_center,_#00E5FF40_0%,_#BF55EC10_50%,_transparent_70%)] animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
        <h1 className="text-white/80 text-7xl font-black tracking-[-8px] z-10">AR</h1>
        <p className="mt-4 text-white/60 text-xs font-bold tracking-[4px]">AR CONTROL LIVE STUDIO</p>
    </div>
);

const BootStatus: React.FC<{ progress: number; message: string }> = React.memo(({ progress, message }) => (
    <div className="w-full flex flex-col items-center">
        <p className="h-4 text-white/70 text-[10px] font-bold tracking-[2px] mb-3 transition-all duration-300">
            {message}
        </p>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
                className="h-full bg-gradient-to-r from-[#00E5FF] to-[#BF55EC] transition-all duration-300 ease-linear"
                style={{ width: `${progress * 100}%` }}
            ></div>
        </div>
        <p className="mt-1 text-white/50 text-[10px]">{(progress * 100).toFixed(0)}%</p>
    </div>
));

const ScanlineEffect: React.FC = () => (
    <div className="absolute inset-0 pointer-events-none z-0" style={{
        background: `linear-gradient(rgba(0,0,0,0.15) 50%, rgba(0,0,0,0) 50%)`,
        backgroundSize: '100% 4px',
        animation: 'scanline 8s linear infinite',
    }}>
        <style>
            {`
                @keyframes scanline {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 -20px; }
                }
            `}
        </style>
    </div>
);
