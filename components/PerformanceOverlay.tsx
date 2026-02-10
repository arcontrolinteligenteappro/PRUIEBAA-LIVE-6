
import React, { useEffect, useState } from 'react';
import { useBroadcastStore } from '../core/store';
import { Activity, Cpu, HardDrive, Wifi, AlertTriangle, Zap, Layers } from 'lucide-react';

export const PerformanceOverlay: React.FC = () => {
  const { output } = useBroadcastStore();
  const [metrics, setMetrics] = useState({
    fps: 60,
    bitrate: 0,
    cpu: 0,
    memory: 0,
    dropped: 0,
    gpu: 0
  });

  useEffect(() => {
    let lastTime = performance.now();
    let frames = 0;
    let animationFrameId: number;

    const loop = () => {
      const now = performance.now();
      frames++;
      if (now - lastTime >= 1000) {
        // In a real Android app, these would come from Bridge/JSI
        // Here we simulate the hardware load of a broadcast engine
        setMetrics(prev => ({
          ...prev,
          fps: frames,
          cpu: Math.floor(Math.random() * 15) + 15, // Simulating modest load
          gpu: Math.floor(Math.random() * 20) + 30, // Simulating encoding load
          memory: Math.floor(Math.random() * 5) + 45,
          bitrate: output.isStreaming ? Math.floor(Math.random() * 400) + 5800 : 0,
          dropped: output.stats.dropped
        }));
        frames = 0;
        lastTime = now;
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [output.isStreaming]);

  if (!output.isStreaming && !output.isRecording) return null;

  const MetricItem = ({ icon, label, value, unit, warningThreshold, criticalThreshold, invert = false }: any) => {
      let color = 'text-gray-400';
      const numVal = typeof value === 'number' ? value : 0;
      
      let isWarning = numVal > warningThreshold;
      let isCritical = numVal > criticalThreshold;

      if (invert) {
          isWarning = numVal < warningThreshold;
          isCritical = numVal < criticalThreshold;
      }

      if (isCritical) color = 'text-red-500 animate-pulse';
      else if (isWarning) color = 'text-yellow-500';
      else color = 'text-green-500';

      return (
          <div className="flex items-center gap-1.5 min-w-[80px]">
              <div className={color}>{icon}</div>
              <div className="flex flex-col leading-none">
                  <span className={`text-[10px] font-black ${color}`}>{value}</span>
                  <span className="text-[8px] font-bold text-gray-600">{unit}</span>
              </div>
          </div>
      );
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-gray-800 h-8 flex justify-between items-center px-4 z-[100] select-none pointer-events-none">
        <div className="flex gap-4">
            <MetricItem 
                icon={<Activity size={12}/>} 
                value={metrics.fps} unit="FPS" 
                warningThreshold={55} criticalThreshold={30} invert 
            />
            <MetricItem 
                icon={<Wifi size={12}/>} 
                value={(metrics.bitrate / 1000).toFixed(1)} unit="MBPS" 
                warningThreshold={4} criticalThreshold={2} invert
            />
            {metrics.dropped > 0 && (
                <div className="flex items-center gap-1 text-red-500 bg-red-900/20 px-2 rounded animate-pulse">
                    <AlertTriangle size={12} />
                    <span className="text-[9px] font-black">DROP {metrics.dropped}</span>
                </div>
            )}
        </div>

        <div className="flex items-center gap-2 opacity-50">
            <div className="h-1 w-16 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-[pulse_2s_infinite]" style={{ width: '100%' }}></div>
            </div>
            <span className="text-[8px] font-mono text-gray-500">ENCODING ACTIVE</span>
        </div>

        <div className="flex gap-4 justify-end">
            <MetricItem icon={<Cpu size={12}/>} value={metrics.cpu} unit="CPU %" warningThreshold={70} criticalThreshold={90} />
            <MetricItem icon={<Layers size={12}/>} value={metrics.gpu} unit="GPU %" warningThreshold={80} criticalThreshold={95} />
            <MetricItem icon={<HardDrive size={12}/>} value={metrics.memory} unit="RAM %" warningThreshold={80} criticalThreshold={90} />
        </div>
    </div>
  );
};
