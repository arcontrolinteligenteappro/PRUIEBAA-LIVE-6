
import { BroadcastState, BroadcastMacro } from '../types';

type StoreGet = () => BroadcastState;
type StoreSet = (partial: Partial<BroadcastState> | ((state: BroadcastState) => Partial<BroadcastState>)) => void;

interface MacroAction {
    type: 'WAIT' | 'CUT' | 'AUTO' | 'CUT_TO_SOURCE' | 'PVW_SOURCE' | 'AUDIO_FADE' | 'AUDIO_MUTE' | 'GFX_UPDATE';
    ms?: number;
    sourceId?: string;
    channelId?: string;
    targetLevel?: number;
    duration?: number;
    overlayId?: string;
    active?: boolean;
}

export class AutomationEngine {
    private isRunning = false;

    /**
     * Executes a macro sequence safely.
     * Guaranteed not to block the main thread UI.
     */
    public async executeMacro(macro: BroadcastMacro, get: StoreGet, set: StoreSet, actions: any) {
        if (this.isRunning) {
            console.warn('[Automation] Macro already running. Queuing not implemented in this version.');
            // In V2: Implement Queue
        }

        this.isRunning = true;
        set({ macroExecuting: macro.id });
        console.log(`[Automation] Starting Macro: ${macro.label}`);

        try {
            for (const action of macro.actions) {
                await this.processAction(action, get, set, actions);
            }
            console.log(`[Automation] Macro Finished: ${macro.label}`);
        } catch (error) {
            console.error(`[Automation] Macro Failed:`, error);
            // Log to system logs if available
            if (actions.addSystemLog) {
                actions.addSystemLog('WARNING', 'AUTOMATION', `Macro ${macro.label} failed: ${error}`);
            }
        } finally {
            this.isRunning = false;
            set({ macroExecuting: null });
        }
    }

    private async processAction(action: MacroAction, get: StoreGet, set: StoreSet, actions: any) {
        switch (action.type) {
            case 'WAIT':
                await new Promise(resolve => setTimeout(resolve, action.ms || 1000));
                break;

            case 'CUT':
                actions.cut();
                break;

            case 'AUTO':
                actions.auto();
                break;

            case 'CUT_TO_SOURCE':
                if (action.sourceId) actions.setProgram(action.sourceId);
                break;

            case 'PVW_SOURCE':
                if (action.sourceId) actions.setPreview(action.sourceId);
                break;

            case 'AUDIO_MUTE':
                if (action.channelId) actions.toggleMute(action.channelId);
                break;

            case 'AUDIO_FADE':
                if (action.channelId && action.targetLevel !== undefined && action.duration) {
                    await this.fadeAudio(action.channelId, action.targetLevel, action.duration, get, set);
                } else if (action.channelId && action.targetLevel !== undefined) {
                    // Instant change
                    const channels = get().audioChannels.map(ch => 
                        ch.id === action.channelId ? { ...ch, level: action.targetLevel! } : ch
                    );
                    set({ audioChannels: channels });
                }
                break;

            case 'GFX_UPDATE':
                if (action.overlayId && action.active !== undefined) {
                    const overlays = get().overlays.map(o => 
                        o.id === action.overlayId ? { ...o, isActive: action.active! } : o
                    );
                    set({ overlays });
                }
                break;

            default:
                console.warn('[Automation] Unknown action type:', action);
        }
    }

    private fadeAudio(channelId: string, targetLevel: number, duration: number, get: StoreGet, set: StoreSet): Promise<void> {
        return new Promise(resolve => {
            const startState = get();
            const channel = startState.audioChannels.find(c => c.id === channelId);
            if (!channel) {
                resolve();
                return;
            }

            const startLevel = channel.level;
            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease In-Out
                const ease = progress < .5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
                
                const currentLevel = startLevel + (targetLevel - startLevel) * ease;

                const currentChannels = get().audioChannels.map(ch => 
                    ch.id === channelId ? { ...ch, level: currentLevel } : ch
                );
                set({ audioChannels: currentChannels });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }
}

export const automationEngine = new AutomationEngine();
