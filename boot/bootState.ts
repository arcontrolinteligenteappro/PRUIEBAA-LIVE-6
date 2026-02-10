
/**
 * Represents the distinct phases of the broadcast engine boot sequence.
 * Each phase has a user-facing status message.
 */
export enum BootPhase {
    CORE_BOOT = "CORE BOOT SEQUENCE INITIATED",
    AUDIO_DSP_HARDENING = "AUDIO DSP HARDENING",
    VIDEO_ENGINE_SYNC = "VIDEO ENGINE SYNC",
    AI_COPILOT_VALIDATION = "AI COPILOT VALIDATION"
}

/**
 * A discriminated union representing the possible states of the application boot process.
 * This allows for exhaustive state handling in the UI.
 */
export type BootState =
    /**
     * The boot sequence is in progress.
     */
    | { type: 'Loading'; progress: number; phase: BootPhase }
    /**
     * An error occurred during the boot sequence.
     */
    | { type: 'Error'; message: string; phase: BootPhase }
    /**
     * The boot sequence has completed successfully and the app is ready.
     */
    | { type: 'Ready' };

export const initialBootState: BootState = {
    type: 'Loading',
    progress: 0,
    phase: BootPhase.CORE_BOOT
};
