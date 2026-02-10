
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BroadcastState, SourceId, VideoSource, AppMode, OperationMode, Product, SystemLogEntry, LogLevel, AudioChannel, BroadcastMacro, ChatMessage, DetectedInput, DroneState, HardwareSwitcherState } from '../types';
import { INITIAL_BROADCAST_STATE } from '../constants';
import { automationEngine } from '../engines/AutomationEngine';

interface BroadcastActions {
  // Switcher Operations
  cut: () => void;
  auto: () => void;
  setPreview: (id: SourceId) => void;
  setProgram: (id: SourceId) => void;
  
  // Source Management
  addSource: (source: VideoSource) => void;
  removeSource: (id: SourceId) => void;
  scanDevices: () => Promise<void>;
  toggleInputManager: (open: boolean) => void;

  // Audio Operations
  setVolume: (id: SourceId | 'master', level: number) => void;
  toggleMute: (id: SourceId | 'master') => void;
  updateAudioChannel: (channel: AudioChannel) => void;
  
  // System Operations
  toggleStream: () => void;
  toggleRecord: () => void;
  setMode: (mode: AppMode) => void;
  setLayout: (layout: OperationMode) => void;
  addSystemLog: (level: LogLevel, module: string, message: string) => void;
  triggerMacro: (macro: BroadcastMacro) => void;

  // Chat Actions
  sendChatMessage: (msg: ChatMessage) => void;
  pinChatMessage: (id: string) => void;
  deleteChatMessage: (id: string) => void;
  
  // Commerce Operations
  toggleProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  startFlashSale: (minutes: number) => void;
  stopFlashSale: () => void;
  nextProduct: () => void;
  simulatePurchase: () => void;
  toggleShipping: () => void;
  toggleBundle: () => void;
  applyDiscount: () => void;
  tickFlashSale: () => void;

  // Hardware Actions
  updateDrone: (updates: Partial<DroneState>) => void;
  updateHardwareSwitcher: (updates: Partial<HardwareSwitcherState>) => void;
}

export const useBroadcastStore = create<BroadcastState & BroadcastActions>()(
  persist(
    (set, get) => ({
      // --- INITIAL STATE ---
      ...INITIAL_BROADCAST_STATE,

      // --- ACTIONS ---
      
      setPreview: (id) => set((state) => {
        const newSources = { ...state.sources };
        if (state.mixEffect.previewId && newSources[state.mixEffect.previewId]) {
           newSources[state.mixEffect.previewId] = { ...newSources[state.mixEffect.previewId], tally: 'OFF' };
        }
        if (newSources[id]) {
           newSources[id] = { ...newSources[id], tally: 'PVW' };
        }
        return {
          sources: newSources,
          mixEffect: { ...state.mixEffect, previewId: id }
        };
      }),

      setProgram: (id) => set((state) => {
        const newSources = { ...state.sources };
        if (state.mixEffect.programId && newSources[state.mixEffect.programId]) {
            newSources[state.mixEffect.programId] = { ...newSources[state.mixEffect.programId], tally: 'OFF' };
        }
        if (newSources[id]) {
            newSources[id] = { ...newSources[id], tally: 'PGM' };
        }
        return {
            sources: newSources,
            mixEffect: { ...state.mixEffect, programId: id }
        };
      }),

      cut: () => {
        const state = get();
        if (!state.mixEffect.previewId) return;
        const newPgm = state.mixEffect.previewId;
        const newPvw = state.mixEffect.programId; 
        const newSources = { ...state.sources };
        if (newPvw && newSources[newPvw]) newSources[newPvw].tally = 'PVW';
        if (newSources[newPgm]) newSources[newPgm].tally = 'PGM';
        set({
          sources: newSources,
          mixEffect: { ...state.mixEffect, programId: newPgm, previewId: newPvw }
        });
      },

      auto: () => {
        const state = get();
        if (state.mixEffect.transition.inProgress || !state.mixEffect.previewId) return;
        set({
            mixEffect: { 
                ...state.mixEffect, 
                transition: { ...state.mixEffect.transition, inProgress: true, progress: 0 } 
            }
        });
        let progress = 0;
        const interval = setInterval(() => {
            progress += 0.1;
            if (progress >= 1) {
                clearInterval(interval);
                get().cut();
                set({
                    mixEffect: { 
                        ...get().mixEffect, 
                        transition: { ...get().mixEffect.transition, inProgress: false, progress: 0 } 
                    }
                });
            } else {
                set({
                    mixEffect: { 
                        ...get().mixEffect, 
                        transition: { ...get().mixEffect.transition, progress } 
                    }
                });
            }
        }, 50);
      },

      // --- SOURCE MANAGEMENT ---
      scanDevices: async () => {
          try {
              // Real browser API access
              const devices = await navigator.mediaDevices.enumerateDevices();
              const detected: DetectedInput[] = devices.map(d => ({
                  id: d.deviceId,
                  label: d.label || `Unknown ${d.kind}`,
                  kind: d.kind as any,
                  groupId: d.groupId
              })).filter(d => d.kind === 'videoinput' || d.kind === 'audioinput');
              
              set({ detectedDevices: detected });
          } catch (e) {
              console.warn("Device scan failed or not supported in this env");
              // Fallback mock devices for demo
              set({ 
                  detectedDevices: [
                      { id: 'mock-cam-1', label: 'Logitech Brio 4K', kind: 'videoinput' },
                      { id: 'mock-mic-1', label: 'Yeti Stereo Mic', kind: 'audioinput' }
                  ] 
              });
          }
      },

      addSource: (source) => set(state => {
          const newSources = { ...state.sources, [source.id]: source };
          const newOrder = [...state.sourceOrder, source.id];
          
          // Also create audio channel
          const newAudio: AudioChannel = {
              id: `aud-${source.id}`,
              sourceId: source.id,
              label: source.name,
              level: 0.8,
              isMuted: false,
              isPfl: false,
              isSolo: false,
              processing: { gain:0, delay:0, eq80Hz:0, eq250Hz:0, eq600Hz:0, eq4kHz:0, eq12kHz:0, compressor:{enabled:false, threshold:-20, ratio:3, attack:10, release:100}, limiter:{enabled:true, ceiling:-1}, gateEnabled:false, deEsserEnabled:false, micBoost:false, agcEnabled:false, pan:0 },
              meterPeak: -60
          };

          return {
              sources: newSources,
              sourceOrder: newOrder,
              audioChannels: [...state.audioChannels, newAudio]
          };
      }),

      removeSource: (id) => set(state => {
          const { [id]: removed, ...remainingSources } = state.sources;
          return {
              sources: remainingSources,
              sourceOrder: state.sourceOrder.filter(sid => sid !== id),
              audioChannels: state.audioChannels.filter(ac => ac.sourceId !== id)
          };
      }),

      toggleInputManager: (open) => set(s => ({ ui: { ...s.ui, showInputManager: open } })),

      // --- AUDIO IMPLEMENTATION ---
      setVolume: (id, level) => {
          if (id === 'master') {
              set(s => ({ masterAudio: { ...s.masterAudio, masterVolume: level * 100 } }));
          } else {
              set(s => ({
                  audioChannels: s.audioChannels.map(ch => ch.sourceId === id ? { ...ch, level } : ch)
              }));
          }
      },

      toggleMute: (id) => {
          if (id === 'master') {
              set(s => ({ masterAudio: { ...s.masterAudio, masterVolume: s.masterAudio.masterVolume === 0 ? 80 : 0 } }));
          } else {
              set(s => ({
                  audioChannels: s.audioChannels.map(ch => (ch.id === id || ch.sourceId === id) ? { ...ch, isMuted: !ch.isMuted } : ch)
              }));
          }
      },

      updateAudioChannel: (updatedChannel) => set(state => ({
          audioChannels: state.audioChannels.map(ch => ch.id === updatedChannel.id ? updatedChannel : ch)
      })),
      
      toggleStream: () => set(s => ({ output: { ...s.output, isStreaming: !s.output.isStreaming, health: !s.output.isStreaming ? 'GOOD' : 'OFFLINE' } })),
      toggleRecord: () => set(s => ({ output: { ...s.output, isRecording: !s.output.isRecording } })),
      
      setMode: (mode) => set({ appMode: mode }),
      setLayout: (layout) => set({ opMode: layout }),

      addSystemLog: (level, module, message) => set((state) => {
          const newLog: SystemLogEntry = {
              id: Math.random().toString(36).substr(2, 9),
              timestamp: new Date(),
              level,
              module,
              message
          };
          return { systemLogs: [newLog, ...state.systemLogs].slice(0, 100) };
      }),

      // --- CHAT ACTIONS ---
      sendChatMessage: (msg) => set(state => ({
          chatMessages: [...state.chatMessages, msg]
      })),

      pinChatMessage: (id) => set(state => ({
          chatMessages: state.chatMessages.map(msg => msg.id === id ? { ...msg, isPinned: !msg.isPinned } : msg),
          // Also update social overlay if pinned
          socialFeed: state.chatMessages.find(m => m.id === id) ? [
              ...state.socialFeed, 
              { 
                  id: `soc-${id}`, 
                  platform: 'TWITCH', // simplified for demo
                  user: state.chatMessages.find(m => m.id === id)?.sender || 'User',
                  avatar: 'U',
                  message: state.chatMessages.find(m => m.id === id)?.text || '',
                  isOnAir: true 
              }
          ] : state.socialFeed
      })),

      deleteChatMessage: (id) => set(state => ({
          chatMessages: state.chatMessages.map(msg => msg.id === id ? { ...msg, isDeleted: true } : msg)
      })),

      // --- AUTOMATION / MACROS ---
      triggerMacro: (macro) => {
          const actions = get(); 
          automationEngine.executeMacro(macro, get, set, actions);
      },

      // --- COMMERCE LOGIC ---
      toggleProduct: (id) => set((state) => ({
          activeProductId: state.activeProductId === id ? null : id
      })),

      updateProduct: (id, updates) => set((state) => ({
          products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
      })),

      startFlashSale: (minutes) => set({
          flashSaleTimeRemaining: minutes * 60
      }),

      stopFlashSale: () => set({
          flashSaleTimeRemaining: null
      }),

      tickFlashSale: () => set((state) => {
          if (state.flashSaleTimeRemaining === null) return {};
          if (state.flashSaleTimeRemaining <= 0) return { flashSaleTimeRemaining: null };
          return { flashSaleTimeRemaining: state.flashSaleTimeRemaining - 1 };
      }),

      nextProduct: () => set((state) => {
          const idx = state.products.findIndex(p => p.id === state.activeProductId);
          let nextId = state.products[0].id;
          if (idx !== -1 && idx < state.products.length - 1) {
              nextId = state.products[idx + 1].id;
          }
          return { activeProductId: nextId };
      }),

      simulatePurchase: () => set((state) => {
          const active = state.products.find(p => p.id === state.activeProductId);
          if (!active) return {};
          const updatedProducts = state.products.map(p => 
              p.id === active.id ? { ...p, stock: Math.max(0, p.stock - 1), salesCount: p.salesCount + 1 } : p
          );
          return {
              socialProofActive: true,
              revenue: state.revenue + active.price,
              products: updatedProducts
          };
      }),

      toggleShipping: () => set((state) => ({ showShipping: !state.showShipping })),
      toggleBundle: () => set((state) => ({ showBundle: !state.showBundle })),
      applyDiscount: () => set((state) => ({ discountActive: !state.discountActive })),

      // --- HARDWARE ---
      updateDrone: (updates) => set((state) => ({ droneState: { ...state.droneState, ...updates } })),
      updateHardwareSwitcher: (updates) => set((state) => ({ hardwareSwitcher: { ...state.hardwareSwitcher, ...updates } })),
    }),
    {
      name: 'arcls-storage',
      partialize: (state) => ({
        appMode: state.appMode,
        opMode: state.opMode,
        sources: state.sources,
        audioChannels: state.audioChannels,
        audioEngine: state.audioEngine,
        masterAudio: state.masterAudio,
        destinations: state.destinations,
        macros: [],
        sponsors: state.sponsors,
        products: state.products,
      }),
    }
  )
);
