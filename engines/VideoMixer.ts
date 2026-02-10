
import { VideoSource, SourceId, MixEffectState } from '../types';

/**
 * VideoMixer Engine
 * Responsible for handling the "Metal/OpenGL/Canvas" logic abstractly.
 * In a real React Native app, this would bridge to C++ MediaCodec/VideoToolbox.
 */
export class VideoMixerEngine {
  private sources: Map<SourceId, VideoSource> = new Map();
  private meState: MixEffectState;

  constructor() {
    this.meState = {
      programId: null,
      previewId: null,
      transition: { type: 'CUT', duration: 0, progress: 0, inProgress: false },
      dsk: { active: false, sourceId: null }
    };
  }

  public registerSource(source: VideoSource) {
    this.sources.set(source.id, source);
    console.log(`[VideoMixer] Source Registered: ${source.id}`);
  }

  public getProgramFeed(): string {
    // Returns the URL/Texture ID of the current Program
    if (this.meState.programId) {
        return this.sources.get(this.meState.programId)?.previewUrl || '';
    }
    return '';
  }

  public getPreviewFeed(): string {
    if (this.meState.previewId) {
        return this.sources.get(this.meState.previewId)?.previewUrl || '';
    }
    return '';
  }

  /**
   * Calculates the actual frame to render based on transition state.
   * This mimics what a shader would do.
   */
  public getRenderState() {
    return {
        layerA: this.getProgramFeed(),
        layerB: this.getPreviewFeed(),
        mix: this.meState.transition.progress,
        shader: this.meState.transition.type
    };
  }
}

export const videoMixer = new VideoMixerEngine();
