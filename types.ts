
export type UUID = string;
export type SourceId = string;
export type SceneId = string;

// --- ENUMS & CONSTANTS ---
export type AppMode = 'GENERAL' | 'SPORTS' | 'PODCAST' | 'SHOPPING' | 'GAMING';
export type OperationMode = 'STUDIO' | 'SINGLE';
export type VideoTransition = 'CUT' | 'FADE' | 'WIPE' | 'STINGER';
export type TallyState = 'PGM' | 'PVW' | 'OFF';

// Expanded Source Types
export type SourceType = 'CAMERA' | 'NDI' | 'SRT' | 'MEDIA' | 'HTML' | 'SCREEN' | 'PTZ' | 'DRONE' | 'REMOTE' | 'GFX' | 'GAME_CAPTURE' | 'AUDIO_ENGINE';

export type SwitcherMode = 'STUDIO' | 'SINGLE';
export type CommercialLayout = 'OFF' | 'SIDE_BY_SIDE' | 'PIP';
export type NavTab = 'HOME' | 'LIVE' | 'GRAPHICS' | 'AUDIO' | 'SYSTEM';
export type MobileDrawer = 'NONE' | 'CAMERAS' | 'AUDIO' | 'OVERLAYS' | 'MACROS' | 'MODE' | 'REPLAY' | 'LOGS';
export type ProductionRole = 'DIRECTOR' | 'AUDIO' | 'PRODUCER' | 'TD';
export type GfxTemplate = 'SCOREBUG' | 'LOWER_THIRD' | 'DUE_UP' | 'INNING_SUMMARY' | 'PITCHER_STATS' | 'FULL_STATS' | 'LOWER_THIRD_PLAYER' | 'NONE';
export type SceneLayout = 'FULL' | 'SPLIT' | 'PIP' | 'GRID' | 'GAME_CAM' | 'SIDE_PANEL';

// Hardware / Audio Types
export type AudioDriverMode = 'DIRECT_USB_ACCESS' | 'AAUDIO_PRO' | 'OPENSL_ES';
export type USBSampleRate = 44100 | 48000 | 88200 | 96000 | 192000;
export type LatencyMode = 'ULTRA_LOW' | 'BALANCED' | 'STABLE' | 'SAFE';
export type HiFiSource = 'TIDAL' | 'QOBUZ' | 'DLNA' | 'LOCAL' | 'SMB';

// --- DRONE & HARDWARE CONTROL ---
export interface DroneState {
    connected: boolean;
    model: string;
    battery: number; // 0-100
    signalStrength: number; // 0-100
    altitude: number; // meters
    speed: number; // m/s
    gimbalPitch: number; // -90 to +20
    iso: number;
    shutter: string;
    recording: boolean;
    // Input Feedback (Visualizing the physical stick)
    stickInput: {
        leftX: number; // -1 to 1
        leftY: number; // -1 to 1 (Gimbal Control)
        rightX: number;
        rightY: number;
    };
}

export interface HardwareSwitcherState {
    isConnected: boolean;
    model: 'ATEM_MINI' | 'ATEM_EXTREME' | 'TRICASTER' | 'VM_CONTROLLER' | 'NONE';
    physicalTBarPosition: number; // 0-100
    activeBus: 'PGM' | 'PVW';
    syncStatus: 'SYNCED' | 'CONFLICT' | 'OFFLINE';
}

// --- INPUT DEVICE MANAGER ---
export interface DetectedInput {
    id: string;
    label: string;
    kind: 'videoinput' | 'audioinput';
    groupId?: string;
}

export interface VideoSourceSettings {
    active: boolean;
    volume: number; // 0.0 - 1.0
    pan: number;    // -1.0 - 1.0
    muted: boolean;
    delayMs: number;
    // Extended settings
    chromaKeyEnabled?: boolean;
    chromaColor?: string;
    virtualSet?: string | null;
    colorCorrection?: {
        brightness: number;
        contrast: number;
        saturation: number;
    };
    ptz?: {
        presets: {pan: number, tilt: number, zoom: number}[];
        current: {pan: number, tilt: number, zoom: number};
    };
}

export interface VideoSourceHealth {
    batteryLevel?: number;
    signalStrength?: number;
    bitrate?: string;
    fps?: number;
    droppedFrames?: number;
    temperature?: number;
}

export interface VideoSource {
  id: SourceId;
  name: string;
  type: SourceType;
  previewUrl: string; // URL or Device ID
  settings: VideoSourceSettings;
  tally: TallyState;
  metadata?: any;
  // Extended fields
  isLive?: boolean;
  isPreview?: boolean;
  isIsoRecording?: boolean;
  health?: VideoSourceHealth;
  media?: {
      isPlaying: boolean;
      loop: boolean;
      position: number;
      duration: string;
      remaining: string;
  };
}

// --- MIX EFFECTS (ME) ---
export interface MixEffectState {
  programId: SourceId | null;
  previewId: SourceId | null;
  transition: {
    type: VideoTransition;
    duration: number; // ms
    progress: number; // 0.0 - 1.0
    inProgress: boolean;
  };
  dsk: {
    active: boolean;
    sourceId: SourceId | null;
  };
}

// --- AUDIO ENGINE ---
export interface USBAudioDevice {
    id: string;
    name: string;
    manufacturer: string;
    type: 'INTERFACE' | 'MIC' | 'HEADSET';
    inputs: number;
    outputs: number;
    supportedRates: number[];
    isHardwareMute: boolean;
}

export interface OutputDevice {
    id: string;
    name: string;
    type: 'PHONE' | 'HEADPHONES' | 'BLUETOOTH' | 'HDMI' | 'USB';
    isMasterOutput: boolean;
    isMonitorOnly: boolean;
    latencyWarning: boolean;
}

export interface AudioEngineState {
    activeDevice: USBAudioDevice | null;
    outputDevices: OutputDevice[];
    driverMode: AudioDriverMode;
    sampleRate: USBSampleRate;
    bitDepth: 16 | 24 | 32;
    bufferSizeFrames: number;
    isBitPerfect: boolean;
    cpuLoad: number;
    dsp: {
        lowLatencyMode: boolean;
        latencyMode: LatencyMode;
        disableAndroidProcessing: boolean;
        hardwareGainDB: number;
        monitorMix: number;
        limiterEngaged: boolean;
    };
}

export interface AudioReferenceState {
    active: boolean;
    currentSource: HiFiSource;
    connectedDAC: {
        id: string;
        name: string;
        vendorId: string;
        isUSB: boolean;
        supportedRates: number[];
        isBitPerfectLocked: boolean;
        connectionStatus: 'CONNECTED' | 'DISCONNECTED';
    } | null;
    currentTrack: {
        id: string;
        title: string;
        artist: string;
        album: string;
        coverUrl: string;
        format: string; // MQA, FLAC, DSD
        sampleRate: number;
        bitDepth: number;
        isMQAStudio: boolean;
        duration: number;
    } | null;
    playbackState: 'PLAYING' | 'PAUSED' | 'STOPPED';
    volume: number;
    settings: {
        bypassAndroidAudio: boolean;
        forceUpsampling: boolean;
        bitPerfectMode: boolean;
    };
}

export interface AudioProcessing {
    gain: number;
    delay: number;
    eq80Hz: number;
    eq250Hz: number;
    eq600Hz: number;
    eq4kHz: number;
    eq12kHz: number;
    compressor: {
        enabled: boolean;
        threshold: number;
        ratio: number;
        attack: number;
        release: number;
    };
    limiter: {
        enabled: boolean;
        ceiling: number;
    };
    gateEnabled: boolean;
    deEsserEnabled: boolean;
    micBoost: boolean;
    agcEnabled: boolean;
    pan: number;
}

export interface AudioChannel {
  id: string;
  sourceId: string;
  label: string;
  level: number;
  isMuted: boolean;
  isPfl: boolean;
  isSolo: boolean;
  processing: AudioProcessing;
  meterPeak: number;
}

export interface AudioBus {
  id: string;
  label: string;
  volume: number;
  muted: boolean;
  meter: number; // -60 to 0 dBFS
}

export interface AudioRouting {
    inputId: string;
    outputId: string;
    active: boolean;
}

export interface MasterAudioState {
    masterVolume: number;
    proModeEnabled: boolean;
    audioFollowScene: boolean;
    limiterEnabled: boolean;
    compressorEnabled: boolean;
    stereoWidth: number;
    balance: number;
    eqLow: number;
    eqLowMid: number;
    eqHighMid: number;
    eqHigh: number;
    routing: AudioRouting[];
}

// --- DJ ENGINE ---
export interface DJTrack {
    id: string;
    title: string;
    artist: string;
    bpm: number;
    key: string;
    duration: number;
    coverUrl: string;
}

export interface DJDeckState {
    id: 'A' | 'B';
    track: DJTrack | null;
    isPlaying: boolean;
    isLooping: boolean;
    pitch: number;
    volume: number;
    fxActive: boolean;
}

export interface DJState {
    active: boolean;
    crossfader: number;
    syncEnabled: boolean;
    automixEnabled: boolean;
    masterVolume: number;
    duckingEnabled: boolean;
    library: DJTrack[];
    deckA: DJDeckState;
    deckB: DJDeckState;
}

// --- STREAMING & OUTPUT ---
export interface StreamState {
  isStreaming: boolean;
  isRecording: boolean;
  duration: number;
  health: 'GOOD' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  stats: {
    bitrate: number;
    fps: number;
    dropped: number;
  };
}

export interface SystemStats {
    cpu: number;
    ram: number;
    temp: number;
    network: string;
    fps: number;
}

// --- LOGGING & FAILSAFE ---
export type LogLevel = 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';

export interface SystemLogEntry {
    id: string;
    timestamp: Date;
    level: LogLevel;
    module: string;
    message: string;
    code?: string;
}

// --- ASSETS & DATA ---
export interface GraphicsOverlay {
    id: string;
    template: GfxTemplate;
    isActive: boolean;
    data: any;
}

export interface BroadcastMacro {
    id: string;
    label: string;
    type: 'SCENE' | 'AUDIO' | 'GFX' | 'EMERGENCY';
    color: string;
    actions: any[];
}

export interface ReplayClip {
    id: string;
    timestamp: Date;
    camera: string;
    durationSec: number;
    tags: string[];
    thumbnail: string;
}

export interface RemoteGuest {
    id: string;
    name: string;
    email: string;
    status: 'LIVE' | 'WAITING' | 'OFFLINE';
    videoUrl: string;
    audioLevel: number;
    connectionQuality: 'GOOD' | 'FAIR' | 'POOR';
    isOnStage: boolean;
    isIsoRecording: boolean;
    mutedByHost?: boolean;
}

export interface StreamDestination {
    id: string;
    platform: 'YOUTUBE' | 'FACEBOOK' | 'TWITCH' | 'CUSTOM_RTMP';
    name: string;
    status: 'LIVE' | 'CONNECTING' | 'OFFLINE';
    viewers: number;
}

export interface FieldUnit {
    id: string;
    name: string;
    model: string;
    battery: number;
    latencyMs: number;
    bitrateMb: number;
    status: 'ONLINE' | 'OFFLINE';
    isBonding: boolean;
}

export interface ChatMessage {
    id: string;
    sender: string;
    role?: ProductionRole | 'VIEWER' | 'MOD' | 'SUB';
    platform: 'TWITCH' | 'YOUTUBE' | 'FACEBOOK' | 'TIKTOK';
    text: string;
    timestamp: Date;
    avatar?: string;
    color?: string;
    isPinned?: boolean;
    isDeleted?: boolean;
}

export interface SocialComment {
    id: string;
    platform: 'YOUTUBE' | 'TWITCH' | 'LINKEDIN';
    user: string;
    avatar: string;
    message: string;
    isOnAir: boolean;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
    salesCount: number;
    isFeatured: boolean;
    variants?: string[];
    stockStatus: 'GREEN' | 'YELLOW' | 'RED';
}

export interface Sponsor {
    id: string;
    name: string;
    logoUrl: string;
    type: 'LOGO_CORNER' | 'BANNER_BOTTOM' | 'TICKER' | 'QR' | 'FULLSCREEN';
    isActive: boolean;
    tier: 'GOLD' | 'SILVER' | 'BRONZE';
    data?: any;
}

// --- SPECIALIZED DOMAINS ---

// Baseball
export interface BaseballPlayer {
    id: string;
    name: string;
    number: string;
    position: string;
    photoUrl: string;
    avg?: string;
    hr?: number;
    rbi?: number;
    era?: string;
    whip?: string;
    ip?: string;
    so?: number;
    pitches?: string[];
}

export interface BaseballGameState {
    inning: number;
    isTop: boolean;
    balls: number;
    strikes: number;
    outs: number;
    bases: [boolean, boolean, boolean];
    pitcher: BaseballPlayer;
    batter: BaseballPlayer;
    onDeck: BaseballPlayer[];
    inningSummary?: { runs: number, hits: number, errors: number, lob: number };
    pitchCount: number;
    lastPitch?: { type: string, speed: number };
    scoreHome?: number;
    scoreGuest?: number;
}

export interface TimelineMarker {
    id: string;
    time: number;
    label: string;
    type: 'GOAL' | 'FOUL' | 'CARD';
}

// --- NEW SPORTS MODELS (V8.6 GOD MODE) ---

export interface FootballState {
    quarter: number;
    down: number;
    distance: string; // "10" or "Goal" or "Inches"
    ballOn: number;
    timeoutsHome: number;
    timeoutsGuest: number;
    possession: 'HOME' | 'GUEST';
    playClock: number;
    flagActive: boolean;
    redZone: boolean;
}

export interface CombatState {
    round: number;
    totalRounds: number;
    timer: number; // Seconds
    knockdownsHome: number;
    knockdownsGuest: number;
    warningsHome: number;
    warningsGuest: number;
    pointsHome: number; // For TKD/Karate
    pointsGuest: number;
    strikes: { home: number, guest: number };
    decision?: string; // TKO, SUB, DEC
}

export interface VolleyballState {
    set: number;
    setsWonHome: number;
    setsWonGuest: number;
    timeoutsHome: number;
    timeoutsGuest: number;
    serve: 'HOME' | 'GUEST';
    rotationHome?: number; // 1-6
    rotationGuest?: number;
}

export interface DriverEntry {
    position: number;
    number: string;
    name: string;
    team: string;
    gap: string;
    tyre: string;
    interval: string;
    pitStops: number;
}

export interface CarTelemetry {
    speed: number;
    rpm: number;
    gear: number;
    throttle: number;
    brake: number;
    gForce: { x: number, y: number };
}

export interface MotorsportsState {
    leaderboard: DriverEntry[];
    flagStatus: 'GREEN' | 'YELLOW' | 'RED' | 'SC' | 'CHECKERED';
    telemetry: CarTelemetry;
    trackMapActive: boolean;
    laps: { current: number, total: number };
}

// --- UNIVERSAL SPORTS STATE ---
export interface UniversalSportsState {
    activeSport: 'SOCCER' | 'BASEBALL' | 'BASKETBALL' | 'FOOTBALL' | 'MOTORSPORTS' | 'BOXING' | 'MMA' | 'TAEKWONDO' | 'VOLLEYBALL' | 'FUTSAL';
    clock: {
        minutes: number;
        seconds: number;
        tenths: number;
        isRunning: boolean;
        direction: 'UP' | 'DOWN';
        periodLength: number;
    };
    period: number;
    periodName: string;
    activeGraphic: GfxTemplate;
    
    home: {
        id: string;
        name: string;
        shortName: string;
        color: string;
        score: number;
        logo: string;
        fouls: number;
        timeouts: number;
    };
    guest: {
        id: string;
        name: string;
        shortName: string;
        color: string;
        score: number;
        logo: string;
        fouls: number;
        timeouts: number;
    };
    possession: 'HOME' | 'GUEST' | 'NEUTRAL';
    
    // Sub-states (Polymorphic)
    baseball?: BaseballGameState;
    football?: FootballState;
    combat?: CombatState;
    volleyball?: VolleyballState;
    motorsports?: MotorsportsState;
    
    soccer?: {
        heatMap?: any;
        powerPlayActive?: boolean;
        powerPlayTime?: number;
        accumulatedFoulsHome: number; // Futsal
        accumulatedFoulsGuest: number;
        momentum: number[];
        addedTime: number;
        varStatus: 'NONE' | 'CHECKING' | 'REVIEW' | 'DECISION_GOAL' | 'DECISION_NO_GOAL';
    };

    basketball?: {
        shotClock: number;
        bonusHome: boolean;
        bonusGuest: boolean;
        shotChart: {x: number, y: number, made: boolean}[];
        lastScorer?: { name: string, points: number, type: string };
    };
    
    showDataLayer?: boolean;
}

// Podcast
export type PodcastLayout = 'SOLO' | 'SPLIT' | 'GRID' | 'PIP';

export interface SoundboardItem {
    id: string;
    label: string;
    color: string;
    isPlaying: boolean;
}

export interface PodcastSeries {
    id: string;
    title: string;
    host: string;
    coverUrl: string;
    language: string;
    totalEpisodes: number;
}

export interface ChapterMarker {
    id: string;
    timestamp: number;
    label: string;
    type: 'TOPIC' | 'HIGHLIGHT' | 'AD';
}

export interface PodcastEpisode {
    id: string;
    seriesId: string;
    season: number;
    episodeNumber: number;
    title: string;
    description: string;
    status: 'DRAFT' | 'PUBLISHED';
    guests: string[];
    chapters: ChapterMarker[];
    script?: string;
    duration?: number;
    recordedDate?: Date;
}

export interface PodcastState {
    viewMode: 'MANAGER' | 'STUDIO';
    activeSeriesId: string | null;
    activeEpisodeId: string | null;
    activeLayout: PodcastLayout;
    activeSpeakerId: string | null;
    autoDucking: boolean;
    soundboard: SoundboardItem[];
    recordingMode: 'LIVE' | 'RECORD' | 'HYBRID'; // Added HYBRID
    isMasterRecording: boolean;
    recordingDuration: number;
}

// Streamer
export type StreamScene = 'STARTING' | 'GAME' | 'CHATTING' | 'BREAK' | 'REPLAY' | 'ENDING';
export type StreamProfile = 'COMPETITIVE' | 'PRO';

export interface StreamerSafeMode {
    blurScreen: boolean;
    hideChat: boolean;
    muteMic: boolean;
    muteGame: boolean;
    censorBeep: boolean;
    hideOverlay: boolean;
    hideNotifications: boolean;
}

export interface EngagementAlert {
    id: string;
    type: 'SUB' | 'DONATION' | 'FOLLOW' | 'RAID';
    user: string;
    message?: string;
    amount?: string;
    timestamp: Date;
    isActive: boolean;
}

export interface StreamerState {
    activeScene: StreamScene;
    activeProfile: StreamProfile;
    privacyMode: boolean;
    safeMode: StreamerSafeMode;
    gameSourceId: string;
    faceCamId: string;
    alerts: EngagementAlert[];
    bitrateMode: 'PRO' | 'EFFICIENT';
    smartBitrateActive: boolean;
    clipBuffer: { isActive: boolean, lastClipTime: Date | null };
}

// --- GLOBAL APP STATE ---
export interface BroadcastState {
  appMode: AppMode;
  opMode: OperationMode;
  activeNavTab: NavTab;
  activeMobileDrawer: MobileDrawer;
  
  // Core Broadcast
  programId: SourceId;
  previewId: SourceId;
  sources: Record<SourceId, VideoSource>; // Sources as Record
  sourceOrder: SourceId[]; // Order of sources
  detectedDevices: DetectedInput[]; // New for Input Manager
  
  // Resources
  audioChannels: AudioChannel[];
  masterLevel: number;
  overlays: GraphicsOverlay[];
  sponsors: Sponsor[];
  replays: ReplayClip[];
  activeReplayId: string | null;
  replaySpeed: number;
  
  // Engines
  mixEffect: MixEffectState;
  audio: {
    master: AudioBus;
    channels: Record<SourceId, AudioBus>;
  };
  output: StreamState;
  
  // System State
  systemStats: SystemStats;
  systemLogs: SystemLogEntry[]; // New Failsafe Log
  activeRole: ProductionRole;
  mode: SwitcherMode;
  transitionProgress: number;
  isAutoTrans: boolean;
  dskActive: boolean;
  recording: boolean;
  isoRecording: boolean;
  streaming: boolean;
  virtualCam: boolean;
  macroExecuting: string | null;

  // External
  guests: RemoteGuest[];
  destinations: StreamDestination[];
  fieldUnits: FieldUnit[];
  
  // Chat
  chatMessages: ChatMessage[];
  showChat: boolean;
  
  // UI State
  editingSourceId: string | null;
  editingAudioId: string | null;
  aspectRatio: '16:9' | '9:16';
  activeLayout: SceneLayout;
  socialFeed: SocialComment[];
  ui: {
    showSettings: boolean;
    showAudioMixer: boolean;
    activeDrawer: string | null;
    showInputManager: boolean; // New
  };
  
  // Specialized Domain States
  sportsState: UniversalSportsState;
  podcastState: PodcastState;
  podcastSeries: PodcastSeries[];
  podcastEpisodes: PodcastEpisode[];
  streamerState: StreamerState;
  droneState: DroneState; // New
  hardwareSwitcher: HardwareSwitcherState; // New
  
  // Timeline & Commerce
  timeline: TimelineMarker[];
  commercialMode: CommercialLayout;
  products: Product[];
  revenue: number;
  activeProductId: string | null;
  flashSaleTimeRemaining: number | null;
  socialProofActive?: boolean; // New
  showShipping?: boolean; // New
  showBundle?: boolean; // New
  discountActive?: boolean; // New
  
  // Advanced Audio
  audioReference: AudioReferenceState;
  audioEngine: AudioEngineState;
  masterAudio: MasterAudioState;
  djState: DJState;
}
