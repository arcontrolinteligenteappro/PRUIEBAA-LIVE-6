
import { useBroadcastStore } from '../core/store';

class InputControlEngine {
    private isPolling = false;
    private animationFrameId: number | null = null;

    constructor() {
        this.startPolling();
    }

    private startPolling() {
        if (this.isPolling) return;
        this.isPolling = true;
        this.poll();
    }

    private poll = () => {
        const gamepads = navigator.getGamepads();
        if (!gamepads) {
            this.animationFrameId = requestAnimationFrame(this.poll);
            return;
        }

        // We assume the first gamepad is the Drone/Switcher Controller
        const pad = gamepads[0];
        if (pad && pad.connected) {
            this.processInput(pad);
        }

        this.animationFrameId = requestAnimationFrame(this.poll);
    };

    private processInput(pad: Gamepad) {
        // --- DRONE CONTROL LOGIC ---
        // Mapping: Left Stick Y -> Gimbal Pitch
        // Mapping: Buttons -> Generic
        
        const state = useBroadcastStore.getState();
        const currentDroneState = state.droneState;

        // Stick Deadzone
        const deadzone = 0.1;
        
        let leftX = pad.axes[0];
        let leftY = pad.axes[1]; // Typically Y is inverted on some pads, standard is Down=+1
        let rightX = pad.axes[2];
        let rightY = pad.axes[3];

        if (Math.abs(leftX) < deadzone) leftX = 0;
        if (Math.abs(leftY) < deadzone) leftY = 0;
        if (Math.abs(rightX) < deadzone) rightX = 0;
        if (Math.abs(rightY) < deadzone) rightY = 0;

        // Visual Feedback State
        const stickInput = {
            leftX,
            leftY,
            rightX,
            rightY
        };

        // Gimbal Logic (Rate based)
        // If Stick is pushed up (negative Y), Pitch goes up (negative degrees)
        // Speed factor
        const gimbalRate = 2.0; 
        let newPitch = currentDroneState.gimbalPitch + (leftY * gimbalRate);
        
        // Clamp Pitch (-90 to +20)
        newPitch = Math.max(-90, Math.min(20, newPitch));

        // Update Store only if changed significantly to avoid thrashing
        if (
            Math.abs(currentDroneState.stickInput.leftX - leftX) > 0.01 ||
            Math.abs(currentDroneState.stickInput.leftY - leftY) > 0.01 ||
            Math.abs(currentDroneState.gimbalPitch - newPitch) > 0.1
        ) {
            useBroadcastStore.setState({
                droneState: {
                    ...currentDroneState,
                    gimbalPitch: newPitch,
                    stickInput
                }
            });
        }

        // --- HARDWARE SWITCHER LOGIC (Mock) ---
        // Buttons 0 (A/Cross) -> CUT
        // Buttons 1 (B/Circle) -> AUTO
        
        if (pad.buttons[0].pressed) {
            // Debounce logic needed in real world, simple here
             // useBroadcastStore.getState().cut(); // Commented out to prevent rapid firing in demo loop
        }
    }

    public stop() {
        this.isPolling = false;
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }
}

export const inputControlEngine = new InputControlEngine();
