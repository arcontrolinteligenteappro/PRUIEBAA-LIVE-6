import React, { useRef, useEffect, useState } from 'react';

interface FaderControlProps {
  value: number; // 0 to 100
  onChange: (val: number) => void;
  onCommit: () => void; // Called when fader reaches end
}

export const FaderControl: React.FC<FaderControlProps> = ({ value, onChange, onCommit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateValue(e.clientY);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateValue(e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    // Snap to closest end
    if (value > 90) onChange(100);
    if (value < 10) onChange(0);
    
    // In a real switcher, completing the throw swaps PGM/PVW and resets fader logic.
    // For this UI, we just let the parent handle logic.
    if (value >= 99 || value <= 1) {
        onCommit();
    }
  };

  const updateValue = (clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Invert Y because T-bar usually goes down to transition? 
    // Actually typically T-bar at top is 0, bottom is 100.
    const relativeY = clientY - rect.top;
    let percentage = (relativeY / rect.height) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    onChange(percentage);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center py-2 w-16 bg-broadcast-panel rounded-lg border border-gray-800">
        <span className="text-[10px] text-gray-500 font-mono mb-2">AUTO</span>
      <div 
        ref={containerRef}
        className="relative w-4 h-64 bg-black rounded-full overflow-hidden t-bar-track cursor-pointer touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Fill Indicator */}
        <div 
            className="absolute top-0 left-0 w-full bg-broadcast-accent/30"
            style={{ height: `${value}%` }}
        ></div>

        {/* Handle */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 w-10 h-6 bg-gray-300 rounded shadow-lg border-b-4 border-gray-500 flex items-center justify-center z-10 cursor-grab active:cursor-grabbing"
          style={{ top: `calc(${value}% - 12px)` }}
        >
          <div className="w-8 h-1 bg-gray-400 rounded-full"></div>
        </div>
      </div>
      <span className="text-[10px] text-gray-500 font-mono mt-2">{Math.round(value)}%</span>
    </div>
  );
};