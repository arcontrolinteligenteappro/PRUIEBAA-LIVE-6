
import { useState, useCallback } from 'react';
import { BootState, BootPhase, initialBootState } from './bootState';

// Custom hook to manage splash screen logic, equivalent to an Android ViewModel
export const useSplashViewModel = () => {
    const [bootState, setBootState] = useState<BootState>(initialBootState);

    const startBootSequence = useCallback(() => {
        const run = async () => {
            try {
                // Phase 1: Core Boot (25% of progress)
                await runPhase(BootPhase.CORE_BOOT, 1500, 0.0, 0.25);

                // Phase 2: Audio DSP Hardening (35% of progress)
                await runPhase(BootPhase.AUDIO_DSP_HARDENING, 2000, 0.25, 0.60);

                // Phase 3: Video Engine Sync (20% of progress)
                await runPhase(BootPhase.VIDEO_ENGINE_SYNC, 1200, 0.60, 0.80);

                // Phase 4: AI Copilot Validation with Retry (20% of progress)
                await runAiValidationPhase(0.80, 1.0);

                // Final delay for smooth transition
                await delay(500);
                setBootState({ type: 'Ready' });

            } catch (e) {
                const currentPhase = (bootState.type === 'Loading' ? bootState.phase : BootPhase.CORE_BOOT);
                setBootState({
                    type: 'Error',
                    message: "CRITICAL ENGINE FAILURE",
                    phase: currentPhase
                });
            }
        };

        run();
    }, []);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const runPhase = async (
        phase: BootPhase,
        duration: number,
        startProgress: number,
        endProgress: number
    ) => {
        const startTime = Date.now();
        let elapsedTime = 0;

        while (elapsedTime < duration) {
            elapsedTime = Date.now() - startTime;
            const phaseProgress = Math.min(elapsedTime / duration, 1);
            const totalProgress = startProgress + phaseProgress * (endProgress - startProgress);
            
            setBootState({ type: 'Loading', progress: totalProgress, phase });
            
            await new Promise(requestAnimationFrame);
        }
    };

    const runAiValidationPhase = async (startProgress: number, endProgress: number) => {
        let attempts = 0;
        const maxAttempts = 2;
        let success = false;

        while (attempts < maxAttempts && !success) {
            attempts++;
            setBootState({ type: 'Loading', progress: startProgress, phase: BootPhase.AI_COPILOT_VALIDATION });
            await delay(1000); // Simulate network call

            // Simulate a failure on the first attempt
            if (attempts === 1 && Math.random() > 0.3) { // 70% chance to fail
                setBootState({
                    type: 'Loading',
                    progress: (startProgress + endProgress) / 2,
                    phase: BootPhase.AI_COPILOT_VALIDATION
                });
                await delay(1500); // Wait before retrying
            } else {
                success = true;
                await runPhase(BootPhase.AI_COPILOT_VALIDATION, 500, startProgress, endProgress);
            }
        }

        if (!success) {
            throw new Error(`AI Copilot failed to validate after ${maxAttempts} attempts.`);
        }
    };

    return { bootState, startBootSequence };
};
