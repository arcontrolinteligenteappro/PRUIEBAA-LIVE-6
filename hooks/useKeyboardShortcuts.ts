
import { useEffect } from 'react';
import { useBroadcastStore } from '../core/store';

export const useKeyboardShortcuts = () => {
  const { 
    cut, auto, setPreview, setProgram, 
    toggleRecord, toggleStream, sourceOrder,
    addSystemLog 
  } = useBroadcastStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Ignore if user is typing in an input or textarea
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
        }

        // --- TRANSPORT ---
        if (e.code === 'Space') {
            e.preventDefault(); // Prevent scrolling
            cut();
        }
        if (e.code === 'Enter') {
            e.preventDefault();
            auto();
        }

        // --- SYSTEM ---
        if (e.ctrlKey && e.code === 'KeyR') {
            e.preventDefault();
            toggleRecord();
            addSystemLog('INFO', 'HOTKEY', 'Recording Toggled via Ctrl+R');
        }
        if (e.ctrlKey && e.code === 'KeyS') {
            e.preventDefault();
            toggleStream();
            addSystemLog('INFO', 'HOTKEY', 'Streaming Toggled via Ctrl+S');
        }

        // --- SOURCE SELECTION (1-8) for PREVIEW ---
        // Top row numbers
        if (e.code.startsWith('Digit') && !e.ctrlKey && !e.shiftKey) {
            const num = parseInt(e.key);
            if (num >= 1 && num <= 8) {
                const sourceId = sourceOrder[num - 1];
                if (sourceId) setPreview(sourceId);
            }
        }

        // --- SOURCE SELECTION (F1-F8) for PROGRAM (HOT CUT) ---
        if (e.code.startsWith('F') && !e.ctrlKey) {
            const num = parseInt(e.code.replace('F', ''));
            if (num >= 1 && num <= 8) {
                e.preventDefault(); // Prevent browser help etc
                const sourceId = sourceOrder[num - 1];
                if (sourceId) setProgram(sourceId);
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cut, auto, setPreview, setProgram, toggleRecord, toggleStream, sourceOrder]);
};
