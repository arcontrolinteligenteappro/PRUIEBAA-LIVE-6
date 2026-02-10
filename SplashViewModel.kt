
package com.arcontrol.arcsl.boot

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlin.random.Random

class SplashViewModel : ViewModel() {

    private val _bootState = MutableStateFlow<BootState>(
        BootState.Loading(0f, BootPhase.CORE_BOOT)
    )
    val bootState = _bootState.asStateFlow()

    init {
        startBootSequence()
    }

    fun startBootSequence() {
        viewModelScope.launch {
            try {
                // Phase 1: Core Boot (25% of progress)
                runPhase(BootPhase.CORE_BOOT, 1500L, 0.0f, 0.25f)

                // Phase 2: Audio DSP Hardening (35% of progress)
                // This simulates initializing a low-latency audio engine like Oboe.
                runPhase(BootPhase.AUDIO_DSP_HARDENING, 2000L, 0.25f, 0.60f)

                // Phase 3: Video Engine Sync (20% of progress)
                // This simulates preparing MediaCodec and GPU shaders.
                runPhase(BootPhase.VIDEO_ENGINE_SYNC, 1200L, 0.60f, 0.80f)

                // Phase 4: AI Copilot Validation with Retry (20% of progress)
                runAiValidationPhase(0.80f, 1.0f)

                // Final delay for a smooth, deliberate transition to the dashboard
                delay(500)
                _bootState.value = BootState.Ready

            } catch (e: Exception) {
                // In case of any unhandled failure, transition to a clear error state.
                val currentPhase = (_bootState.value as? BootState.Loading)?.phase ?: BootPhase.CORE_BOOT
                _bootState.value = BootState.Error(
                    "CRITICAL ENGINE FAILURE: ${e.message}",
                    currentPhase
                )
            }
        }
    }

    private suspend fun runPhase(
        phase: BootPhase,
        duration: Long,
        startProgress: Float,
        endProgress: Float
    ) {
        val startTime = System.currentTimeMillis()
        var elapsedTime: Long

        // Update progress smoothly over the specified duration.
        do {
            elapsedTime = System.currentTimeMillis() - startTime
            val phaseProgress = (elapsedTime.toFloat() / duration).coerceIn(0f, 1f)
            val totalProgress = startProgress + phaseProgress * (endProgress - startProgress)
            
            _bootState.value = BootState.Loading(totalProgress, phase)
            
            delay(16) // Update at ~60fps for smoothness
        } while (elapsedTime < duration)
    }

    private suspend fun runAiValidationPhase(startProgress: Float, endProgress: Float) {
        var attempts = 0
        val maxAttempts = 2
        var isSuccess = false

        while (attempts < maxAttempts && !isSuccess) {
            attempts++
            _bootState.value = BootState.Loading(startProgress, BootPhase.AI_COPILOT_VALIDATION)
            delay(1000) // Simulate network call or model loading.

            // Simulate a failure on the first attempt (70% chance to fail first time).
            if (attempts == 1 && Random.nextFloat() > 0.3) {
                 _bootState.value = BootState.Loading(
                    (startProgress + endProgress) / 2, // Show some progress but indicate stall
                    BootPhase.AI_COPILOT_VALIDATION
                )
                // In a real app, you might update the message to "RETRYING..."
                delay(1500) // Wait before retrying.
            } else {
                isSuccess = true
                // On success, quickly complete the progress for this phase.
                runPhase(BootPhase.AI_COPILOT_VALIDATION, 500L, startProgress, endProgress)
            }
        }

        if (!isSuccess) {
            throw IllegalStateException("AI Copilot failed to validate after $maxAttempts attempts.")
        }
    }
}
