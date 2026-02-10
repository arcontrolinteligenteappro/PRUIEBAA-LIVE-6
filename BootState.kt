
package com.arcontrol.arcsl.boot

/**
 * Represents the distinct, sequential phases of the broadcast engine boot sequence.
 * Each phase has a user-facing status message for clear operator feedback.
 */
enum class BootPhase(val message: String) {
    CORE_BOOT("CORE BOOT SEQUENCE INITIATED"),
    AUDIO_DSP_HARDENING("AUDIO DSP HARDENING"),
    VIDEO_ENGINE_SYNC("VIDEO ENGINE SYNC"),
    AI_COPILOT_VALIDATION("AI COPILOT VALIDATION")
}

/**
 * A sealed class representing all possible states of the application boot process.
 * This ensures exhaustive state handling ('when' statements) in the Compose UI, preventing unhandled states.
 */
sealed class BootState {
    /**
     * The boot sequence is actively in progress.
     * @param progress The overall progress from 0.0f to 1.0f.
     * @param phase The current [BootPhase] being processed.
     */
    data class Loading(val progress: Float, val phase: BootPhase) : BootState()

    /**
     * A critical, non-recoverable error occurred during the boot sequence.
     * @param message A user-friendly error message.
     * @param phase The [BootPhase] during which the error occurred.
     */
    data class Error(val message: String, val phase: BootPhase) : BootState()

    /**
     * The boot sequence has completed successfully, and the main application is ready to be displayed.
     */
    data object Ready : BootState()
}
