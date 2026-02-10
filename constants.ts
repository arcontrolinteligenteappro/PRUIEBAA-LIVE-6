
import { VideoSource, AudioChannel, BroadcastMacro, GraphicsOverlay, ReplayClip, RemoteGuest, StreamDestination, FieldUnit, ChatMessage, SocialComment, UniversalSportsState, BaseballGameState, BaseballPlayer, Product, AudioReferenceState, AudioEngineState, USBAudioDevice, DriverEntry, CarTelemetry, BroadcastState, SwitcherMode, PodcastState, SoundboardItem, PodcastSeries, PodcastEpisode, StreamerState, EngagementAlert, Sponsor, MasterAudioState, DJState, DJTrack, OutputDevice, FootballState, CombatState, VolleyballState, MotorsportsState, DroneState, HardwareSwitcherState } from './types';

const DEFAULT_SETTINGS = {
  active: true, volume: 1, pan: 0, muted: false, delayMs: 0,
  chromaKeyEnabled: false,
  chromaColor: '#00FF00',
  virtualSet: null,
  colorCorrection: { brightness: 0, contrast: 0, saturation: 0 }
};

const DEFAULT_HEALTH = {
  batteryLevel: 100,
  signalStrength: 100,
  bitrate: '15 Mbps',
  fps: 59.94,
  droppedFrames: 0,
  temperature: 35
};

const INITIAL_SYSTEM_STATS = {
    cpu: 12,
    ram: 45,
    temp: 42,
    network: 'STARLINK',
    fps: 59.94
};

// --- AUDIO DEVICE MANAGER (HARDWARE) DATA ---

const MOCK_USB_DEVICE: USBAudioDevice = {
    id: 'usb-1',
    name: 'Scarlett 2i2 USB',
    manufacturer: 'Focusrite',
    type: 'INTERFACE',
    inputs: 2,
    outputs: 2,
    supportedRates: [44100, 48000, 88200, 96000, 192000],
    isHardwareMute: false
};

const MOCK_OUTPUT_DEVICES: OutputDevice[] = [
    { id: 'ph-1', name: 'Phone Speaker', type: 'PHONE', isMasterOutput: false, isMonitorOnly: true, latencyWarning: false },
    { id: 'hp-1', name: 'Wired Headphones', type: 'HEADPHONES', isMasterOutput: true, isMonitorOnly: false, latencyWarning: false },
    { id: 'bt-1', name: 'AirPods Pro', type: 'BLUETOOTH', isMasterOutput: false, isMonitorOnly: true, latencyWarning: true },
];

export const INITIAL_AUDIO_ENGINE_STATE: AudioEngineState = {
    activeDevice: MOCK_USB_DEVICE,
    outputDevices: MOCK_OUTPUT_DEVICES,
    driverMode: 'DIRECT_USB_ACCESS',
    sampleRate: 48000,
    bitDepth: 24,
    bufferSizeFrames: 128, // Low latency target
    isBitPerfect: true,
    cpuLoad: 12,
    dsp: {
        lowLatencyMode: true,
        latencyMode: 'ULTRA_LOW',
        disableAndroidProcessing: true,
        hardwareGainDB: 0,
        monitorMix: 50,
        limiterEngaged: true
    }
};

// --- MASTER AUDIO & DJ ---
export const INITIAL_MASTER_AUDIO: MasterAudioState = {
    masterVolume: 85,
    proModeEnabled: false,
    audioFollowScene: false,
    limiterEnabled: true,
    compressorEnabled: false,
    stereoWidth: 100,
    balance: 0,
    eqLow: 0,
    eqLowMid: 0,
    eqHighMid: 0,
    eqHigh: 0,
    routing: []
};

const MOCK_DJ_LIBRARY: DJTrack[] = [
    { id: 't1', title: 'Cyberpunk Theme', artist: 'Neon Grid', bpm: 128, key: 'Cm', duration: 180, coverUrl: 'https://picsum.photos/100/100?random=500' },
    { id: 't2', title: 'Bass Drop', artist: 'Low Freq', bpm: 140, key: 'Fm', duration: 210, coverUrl: 'https://picsum.photos/100/100?random=501' },
    { id: 't3', title: 'Chill Vibes', artist: 'Lofi Boy', bpm: 90, key: 'Am', duration: 160, coverUrl: 'https://picsum.photos/100/100?random=502' },
];

export const INITIAL_DJ_STATE: DJState = {
    active: false,
    crossfader: 0,
    syncEnabled: false,
    automixEnabled: false,
    masterVolume: 80,
    duckingEnabled: true,
    library: MOCK_DJ_LIBRARY,
    deckA: { id: 'A', track: MOCK_DJ_LIBRARY[0], isPlaying: false, isLooping: false, pitch: 0, volume: 1, fxActive: false },
    deckB: { id: 'B', track: MOCK_DJ_LIBRARY[1], isPlaying: false, isLooping: false, pitch: 0, volume: 1, fxActive: false }
};

// --- AUDIO REFERENCE ENGINE (ARE) DATA ---

export const INITIAL_ARE_STATE: AudioReferenceState = {
    active: true,
    currentSource: 'TIDAL',
    connectedDAC: {
        id: 'dac-1',
        name: 'AudioQuest DragonFly Cobalt',
        vendorId: '0x21B4',
        isUSB: true,
        supportedRates: [44100, 48000, 88200, 96000],
        isBitPerfectLocked: true,
        connectionStatus: 'CONNECTED'
    },
    currentTrack: {
        id: 'track-1',
        title: 'Hotel California (Live)',
        artist: 'Eagles',
        album: 'Hell Freezes Over',
        coverUrl: 'https://picsum.photos/300/300?random=123',
        format: 'MQA',
        sampleRate: 192000,
        bitDepth: 24,
        isMQAStudio: true,
        duration: 432
    },
    playbackState: 'PLAYING',
    volume: 85,
    settings: {
        bypassAndroidAudio: true,
        forceUpsampling: false,
        bitPerfectMode: true
    }
};

// --- SPONSORS ---
export const INITIAL_SPONSORS: Sponsor[] = [
    { id: 'sp-1', name: 'TechCorp', logoUrl: 'https://picsum.photos/200/200?random=200', type: 'LOGO_CORNER', isActive: true, tier: 'GOLD' },
    { id: 'sp-2', name: 'DrinkEnergy', logoUrl: 'https://picsum.photos/200/200?random=201', type: 'BANNER_BOTTOM', isActive: false, tier: 'SILVER', data: { text: 'Fuel Your Game', subtext: 'Use Code LIVE20' } },
    { id: 'sp-3', name: 'CryptoX', logoUrl: 'https://picsum.photos/200/200?random=202', type: 'TICKER', isActive: false, tier: 'BRONZE', data: { text: 'BTC $45,000 • ETH $3,200 • SOL $110' } },
    { id: 'sp-4', name: 'ShopNow', logoUrl: 'https://picsum.photos/200/200?random=203', type: 'QR', isActive: false, tier: 'GOLD', data: { qrLink: 'https://example.com' } }
];

// --- MOTORSPORTS MOCK DATA ---
const MOCK_LEADERBOARD: DriverEntry[] = [
    { position: 1, number: '1', name: 'VERSTAPPEN', team: 'Red Bull', gap: 'LEADER', tyre: 'SOFT', interval: '0.0', pitStops: 1 },
    { position: 2, number: '44', name: 'HAMILTON', team: 'Mercedes', gap: '+1.240', tyre: 'HARD', interval: '+1.240', pitStops: 1 },
    { position: 3, number: '16', name: 'LECLERC', team: 'Ferrari', gap: '+4.500', tyre: 'MEDIUM', interval: '+3.260', pitStops: 1 },
    { position: 4, number: '14', name: 'ALONSO', team: 'Aston Martin', gap: '+5.100', tyre: 'MEDIUM', interval: '+0.600', pitStops: 2 },
    { position: 5, number: '11', name: 'PEREZ', team: 'Red Bull', gap: '+12.400', tyre: 'SOFT', interval: '+7.300', pitStops: 1 },
];

const MOCK_TELEMETRY: CarTelemetry = {
    speed: 295,
    rpm: 11500,
    gear: 7,
    throttle: 100,
    brake: 0,
    gForce: { x: 1.2, y: 0.4 }
};

const INITIAL_MOTORSPORTS_STATE: MotorsportsState = {
    leaderboard: MOCK_LEADERBOARD,
    flagStatus: 'GREEN',
    telemetry: MOCK_TELEMETRY,
    trackMapActive: false,
    laps: { current: 42, total: 56 }
};

// --- BASEBALL DATA ---

const MOCK_PITCHER: BaseballPlayer = {
    id: 'p1', name: 'G. Cole', number: '45', position: 'P', photoUrl: 'https://picsum.photos/100/100?random=88',
    era: '2.84', whip: '1.02', ip: '6.2', so: 9, pitches: ['Fastball', 'Slider', 'Knuckle-Curve']
};

const MOCK_BATTER: BaseballPlayer = {
    id: 'b1', name: 'S. Ohtani', number: '17', position: 'DH', photoUrl: 'https://picsum.photos/100/100?random=99',
    avg: '.304', hr: 44, rbi: 95
};

const MOCK_ON_DECK: BaseballPlayer[] = [
    { id: 'b2', name: 'M. Betts', number: '50', position: 'SS', photoUrl: 'https://picsum.photos/100/100?random=98', avg: '.295', hr: 25 },
    { id: 'b3', name: 'F. Freeman', number: '5', position: '1B', photoUrl: 'https://picsum.photos/100/100?random=97', avg: '.310', hr: 20 },
    { id: 'b4', name: 'T. Hernandez', number: '37', position: 'LF', photoUrl: 'https://picsum.photos/100/100?random=96', avg: '.265', hr: 30 },
];

const INITIAL_BASEBALL_DATA: BaseballGameState = {
    inning: 4,
    isTop: false,
    balls: 1,
    strikes: 2,
    outs: 2,
    bases: [true, false, false], // Runner on 1st
    pitcher: MOCK_PITCHER,
    batter: MOCK_BATTER,
    onDeck: MOCK_ON_DECK,
    inningSummary: { runs: 1, hits: 2, errors: 0, lob: 1 },
    pitchCount: 84,
    scoreHome: 2,
    scoreGuest: 1
};

// --- NEW SPORTS MOCK DATA ---

const INITIAL_FOOTBALL_STATE: FootballState = {
    quarter: 4,
    down: 3,
    distance: "5",
    ballOn: 35,
    timeoutsHome: 2,
    timeoutsGuest: 1,
    possession: 'HOME',
    playClock: 12,
    flagActive: false,
    redZone: false
};

const INITIAL_COMBAT_STATE: CombatState = {
    round: 3,
    totalRounds: 5,
    timer: 180,
    knockdownsHome: 1,
    knockdownsGuest: 0,
    warningsHome: 0,
    warningsGuest: 1,
    pointsHome: 19,
    pointsGuest: 18,
    strikes: { home: 45, guest: 32 }
};

const INITIAL_VOLLEYBALL_STATE: VolleyballState = {
    set: 4,
    setsWonHome: 2,
    setsWonGuest: 1,
    timeoutsHome: 1,
    timeoutsGuest: 0,
    serve: 'GUEST',
    rotationHome: 1,
    rotationGuest: 4
};

// --- DRONE STATE ---
export const INITIAL_DRONE_STATE: DroneState = {
    connected: true,
    model: 'DJI MINI 3 PRO',
    battery: 84,
    signalStrength: 92,
    altitude: 45,
    speed: 12,
    gimbalPitch: 0,
    iso: 100,
    shutter: '1/60',
    recording: true,
    stickInput: { leftX: 0, leftY: 0, rightX: 0, rightY: 0 }
};

// --- HARDWARE SWITCHER ---
export const INITIAL_HARDWARE_SWITCHER: HardwareSwitcherState = {
    isConnected: true,
    model: 'ATEM_MINI',
    physicalTBarPosition: 0,
    activeBus: 'PGM',
    syncStatus: 'SYNCED'
};

// --- UNIVERSAL SPORTS STATE ---
export const INITIAL_SPORTS_STATE: UniversalSportsState = {
    activeSport: 'SOCCER',
    clock: {
        minutes: 45,
        seconds: 0,
        tenths: 0,
        isRunning: false,
        direction: 'UP',
        periodLength: 45
    },
    period: 1,
    periodName: '1st Half',
    activeGraphic: 'SCOREBUG',
    
    home: {
        id: 'home',
        name: 'Real Madrid',
        shortName: 'RMA',
        color: '#FFFFFF',
        score: 2,
        logo: '',
        fouls: 4,
        timeouts: 3
    },
    guest: {
        id: 'guest',
        name: 'Barcelona',
        shortName: 'BAR',
        color: '#AA0000',
        score: 1,
        logo: '',
        fouls: 5,
        timeouts: 2
    },
    possession: 'NEUTRAL',
    
    // Sub-states
    baseball: INITIAL_BASEBALL_DATA,
    football: INITIAL_FOOTBALL_STATE,
    combat: INITIAL_COMBAT_STATE,
    volleyball: INITIAL_VOLLEYBALL_STATE,
    motorsports: INITIAL_MOTORSPORTS_STATE,
    
    soccer: {
        heatMap: { homePressure: 50, guestPressure: 50, activeZone: 'MID' },
        powerPlayActive: false,
        powerPlayTime: 120,
        accumulatedFoulsHome: 0,
        accumulatedFoulsGuest: 0,
        momentum: [40, 45, 60, 55, 70, 65, 50, 45, 30, 40],
        addedTime: 4,
        varStatus: 'NONE'
    },

    basketball: {
        shotClock: 24,
        bonusHome: false,
        bonusGuest: false,
        shotChart: [{x: 10, y: 10, made: true}, {x: 50, y: 80, made: false}],
        lastScorer: { name: 'S. Curry', points: 3, type: '3PT' }
    }
};

// --- PODCAST MOCK DATA ---
const MOCK_SOUNDBOARD: SoundboardItem[] = [
    { id: 'sfx-1', label: 'INTRO', color: 'bg-blue-600', isPlaying: false },
    { id: 'sfx-2', label: 'APPLAUSE', color: 'bg-green-600', isPlaying: false },
    { id: 'sfx-3', label: 'LAUGH', color: 'bg-yellow-600', isPlaying: false },
    { id: 'sfx-4', label: 'RIMSHOT', color: 'bg-purple-600', isPlaying: false },
    { id: 'sfx-5', label: 'CRICKETS', color: 'bg-gray-600', isPlaying: false },
    { id: 'sfx-6', label: 'OUTRO', color: 'bg-red-600', isPlaying: false },
];

const INITIAL_PODCAST_SERIES: PodcastSeries[] = [
    { id: 'series-1', title: 'Tech Talk Daily', host: 'Sarah J.', coverUrl: 'https://picsum.photos/400/400?random=88', language: 'EN', totalEpisodes: 42 },
    { id: 'series-2', title: 'Late Night Chill', host: 'Mike & Dave', coverUrl: 'https://picsum.photos/400/400?random=89', language: 'EN', totalEpisodes: 12 },
];

const INITIAL_PODCAST_EPISODES: PodcastEpisode[] = [
    { 
        id: 'ep-101', seriesId: 'series-1', season: 2, episodeNumber: 5, 
        title: 'The Future of AI in Broadcast', description: 'Discussing generative AI with industry experts.',
        status: 'DRAFT', guests: ['Dr. Smith'], chapters: [],
        script: "INTRO:\nWelcome back to Tech Talk.\n\nTOPIC 1:\nToday we discuss the new Gemini engine..."
    },
    { 
        id: 'ep-100', seriesId: 'series-1', season: 2, episodeNumber: 4, 
        title: 'Mobile Production Workflows', description: 'How to stream from anywhere.',
        status: 'PUBLISHED', guests: ['Jane Doe'], duration: 1840, recordedDate: new Date(),
        chapters: [{id:'c1', timestamp: 0, label: 'Intro', type: 'TOPIC'}, {id:'c2', timestamp: 600, label: 'Gear Review', type: 'TOPIC'}]
    },
];

export const INITIAL_PODCAST_STATE: PodcastState = {
    viewMode: 'MANAGER',
    activeSeriesId: null,
    activeEpisodeId: null,
    activeLayout: 'SPLIT',
    activeSpeakerId: 'host',
    autoDucking: true,
    soundboard: MOCK_SOUNDBOARD,
    recordingMode: 'RECORD',
    isMasterRecording: false,
    recordingDuration: 0,
};

// --- GAMING / STREAMER MOCK DATA ---
const MOCK_ALERTS: EngagementAlert[] = [
    { id: 'alert-1', type: 'SUB', user: 'GamerX', message: 'Subscribed Tier 1!', timestamp: new Date(), isActive: false },
    { id: 'alert-2', type: 'DONATION', user: 'Supporter99', amount: '$10.00', message: 'Keep it up!', timestamp: new Date(), isActive: false },
];

export const INITIAL_STREAMER_STATE: StreamerState = {
    activeScene: 'CHATTING',
    activeProfile: 'PRO',
    privacyMode: false,
    safeMode: {
        blurScreen: false,
        hideChat: false,
        muteMic: false,
        muteGame: false,
        censorBeep: false,
        hideOverlay: false,
        hideNotifications: false
    },
    gameSourceId: 'src-7', // Assume game capture
    faceCamId: 'src-1', // Assume main camera
    alerts: MOCK_ALERTS,
    bitrateMode: 'PRO',
    smartBitrateActive: true,
    clipBuffer: { isActive: true, lastClipTime: null }
};

// --- SOURCES ---
const SOURCES_ARRAY: VideoSource[] = [
  { 
    id: 'src-1', name: 'FACE CAM', type: 'CAMERA', previewUrl: 'https://picsum.photos/800/450?random=1', tally: 'PGM',
    settings: { ...DEFAULT_SETTINGS },
    health: { ...DEFAULT_HEALTH, batteryLevel: 85, bitrate: '25 Mbps' },
    isLive: true, isPreview: false, isIsoRecording: true
  },
  { 
    id: 'src-2', name: 'CAM 2 PTZ', type: 'PTZ', previewUrl: 'https://picsum.photos/800/450?random=2', tally: 'PVW',
    settings: { 
      ...DEFAULT_SETTINGS,
      ptz: {
        presets: [{pan:0,tilt:0,zoom:0}, {pan:20,tilt:5,zoom:1.5}, {pan:-20,tilt:0,zoom:1.0}],
        current: {pan:0,tilt:0,zoom:0}
      }
    },
    health: { ...DEFAULT_HEALTH, signalStrength: 92 },
    isLive: false, isPreview: true, isIsoRecording: true
  },
  { 
    id: 'src-3', name: 'DRONE 1', type: 'DRONE', previewUrl: 'https://picsum.photos/800/450?random=3', tally: 'OFF',
    settings: { ...DEFAULT_SETTINGS },
    health: { ...DEFAULT_HEALTH, batteryLevel: 42, signalStrength: 65, bitrate: '8 Mbps' },
    isLive: false, isPreview: false, isIsoRecording: true
  },
  { 
    id: 'src-4', name: 'MEDIA - INTRO', type: 'MEDIA', previewUrl: 'https://picsum.photos/800/450?random=4', tally: 'OFF',
    settings: { ...DEFAULT_SETTINGS },
    media: { isPlaying: false, loop: false, position: 0, duration: '00:30', remaining: '-00:30' },
    isLive: false, isPreview: false
  },
  { 
    id: 'src-5', name: 'DISCORD GUEST', type: 'REMOTE', previewUrl: 'https://picsum.photos/800/450?random=5', tally: 'OFF',
    settings: { ...DEFAULT_SETTINGS },
    health: { ...DEFAULT_HEALTH, signalStrength: 78, bitrate: 'Variable' },
    isLive: false, isPreview: false
  },
  { 
    id: 'src-6', name: 'GFX ENGINE', type: 'GFX', previewUrl: 'https://picsum.photos/800/450?random=6', tally: 'OFF',
    settings: { ...DEFAULT_SETTINGS },
    isLive: false, isPreview: false
  },
  { 
    id: 'src-7', name: 'GAME CAPTURE', type: 'GAME_CAPTURE', previewUrl: 'https://picsum.photos/800/450?random=7', tally: 'OFF',
    settings: { ...DEFAULT_SETTINGS },
    health: { ...DEFAULT_HEALTH, batteryLevel: 100, temperature: 45 },
    isLive: false, isPreview: false
  },
  { 
    id: 'src-8', name: 'ARE - HI-FI AUDIO', type: 'AUDIO_ENGINE', previewUrl: 'https://picsum.photos/800/450?random=8', tally: 'OFF',
    settings: { ...DEFAULT_SETTINGS },
    isLive: false, isPreview: false
  },
];

// Convert to Record for Store
export const INITIAL_SOURCES_RECORD: Record<string, VideoSource> = SOURCES_ARRAY.reduce((acc, src) => {
    acc[src.id] = src;
    return acc;
}, {} as Record<string, VideoSource>);

export const INITIAL_SOURCE_ORDER = SOURCES_ARRAY.map(s => s.id);

// --- CLOUD DATA ---

export const INITIAL_GUESTS: RemoteGuest[] = [
  { id: 'guest-1', name: 'Host: Sarah', email: 'sarah@show.com', status: 'LIVE', videoUrl: 'https://picsum.photos/200/200?random=20', audioLevel: 0.7, connectionQuality: 'GOOD', isOnStage: true, isIsoRecording: true },
  { id: 'guest-2', name: 'Guest: Dr. Smith', email: 'doc@science.org', status: 'LIVE', videoUrl: 'https://picsum.photos/200/200?random=21', audioLevel: 0.6, connectionQuality: 'FAIR', isOnStage: true, isIsoRecording: true },
  { id: 'guest-3', name: 'Producer: Mike', email: 'mike@prod.com', status: 'WAITING', videoUrl: 'https://picsum.photos/200/200?random=22', audioLevel: 0.0, connectionQuality: 'GOOD', isOnStage: false, isIsoRecording: false },
];

export const INITIAL_DESTINATIONS: StreamDestination[] = [
  { id: 'dest-1', platform: 'YOUTUBE', name: 'Main Broadcast', status: 'LIVE', viewers: 15403 },
  { id: 'dest-2', platform: 'FACEBOOK', name: 'Social Feed', status: 'LIVE', viewers: 4300 },
  { id: 'dest-3', platform: 'CUSTOM_RTMP', name: 'Backup Server', status: 'LIVE', viewers: 0 },
];

export const INITIAL_UNITS: FieldUnit[] = [
  { id: 'unit-1', name: 'Cam A (Sideline)', model: 'LU800', battery: 84, latencyMs: 800, bitrateMb: 12.5, status: 'ONLINE', isBonding: true },
  { id: 'unit-2', name: 'Drone 1', model: 'LU300', battery: 30, latencyMs: 1200, bitrateMb: 8.2, status: 'ONLINE', isBonding: true },
];

export const INITIAL_CHAT: ChatMessage[] = [
  { id: 'msg-1', sender: 'Director', role: 'DIRECTOR', platform: 'TWITCH', text: 'Standby Camera 2 for reaction', timestamp: new Date() },
  { id: 'msg-2', sender: 'Bob', role: 'AUDIO', platform: 'TWITCH', text: 'Guest 1 mic levels good', timestamp: new Date() },
];

// --- SOCIAL ---

export const INITIAL_SOCIAL: SocialComment[] = [
    { id: 'soc-1', platform: 'YOUTUBE', user: 'SportsFan99', avatar: 'S', message: 'What a play!', isOnAir: false },
    { id: 'soc-2', platform: 'TWITCH', user: 'GamerX', avatar: 'G', message: 'Can we see the replay?', isOnAir: false },
    { id: 'soc-3', platform: 'LINKEDIN', user: 'ProUser', avatar: 'P', message: 'Great production quality.', isOnAir: false },
];

// --- COMMERCE ---

export const INITIAL_PRODUCTS: Product[] = [
    { id: 'prod-1', name: 'Team Jersey 2024', price: 89.99, imageUrl: 'https://picsum.photos/200/200?random=50', stock: 150, salesCount: 12, isFeatured: true, variants: ['S', 'M', 'L', 'XL'], stockStatus: 'GREEN' },
    { id: 'prod-2', name: 'Signed Basketball', price: 299.99, imageUrl: 'https://picsum.photos/200/200?random=51', stock: 5, salesCount: 1, isFeatured: false, stockStatus: 'RED' },
    { id: 'prod-3', name: 'Season Pass', price: 499.00, imageUrl: 'https://picsum.photos/200/200?random=52', stock: 1000, salesCount: 85, isFeatured: false, stockStatus: 'GREEN' },
    { id: 'prod-4', name: 'Pro Cap', price: 29.99, imageUrl: 'https://picsum.photos/200/200?random=53', stock: 25, salesCount: 120, isFeatured: false, stockStatus: 'YELLOW' },
];

// --- AUDIO ---
export const INITIAL_AUDIO: AudioChannel[] = SOURCES_ARRAY.map(src => ({
  id: `aud-${src.id}`,
  sourceId: src.id,
  label: src.name.split(' - ')[0], 
  level: src.type === 'GFX' || src.type === 'REMOTE' || src.type === 'MEDIA' || src.type === 'AUDIO_ENGINE' ? 0.8 : 0, 
  isMuted: false,
  isPfl: false,
  isSolo: false,
  processing: {
    gain: 0,
    delay: 0,
    eq80Hz: 0,
    eq250Hz: 0,
    eq600Hz: 0,
    eq4kHz: 0,
    eq12kHz: 0,
    compressor: {
        enabled: src.type === 'REMOTE' || src.type === 'CAMERA',
        threshold: -20,
        ratio: 3.0,
        attack: 10,
        release: 100
    },
    limiter: {
        enabled: true,
        ceiling: -1.0
    },
    gateEnabled: src.type === 'CAMERA',
    deEsserEnabled: false,
    micBoost: false,
    agcEnabled: false,
    pan: 0,
  },
  meterPeak: -60,
}));

// --- GRAPHICS ---
export const INITIAL_OVERLAYS: GraphicsOverlay[] = [
  { 
    id: 'gfx-score', 
    template: 'SCOREBUG', 
    isActive: true, 
    data: {} 
  },
  {
      id: 'gfx-due-up',
      template: 'DUE_UP',
      isActive: false,
      data: {}
  },
  {
      id: 'gfx-summary',
      template: 'INNING_SUMMARY',
      isActive: false,
      data: {}
  },
  {
      id: 'gfx-pitcher',
      template: 'PITCHER_STATS',
      isActive: false,
      data: {}
  }
];

// --- REPLAYS ---
export const INITIAL_REPLAYS: ReplayClip[] = [
  { id: 'rep-1', timestamp: new Date(), camera: 'CAM 1', durationSec: 5, tags: ['GOAL'], thumbnail: 'https://picsum.photos/160/90?random=10' },
  { id: 'rep-2', timestamp: new Date(), camera: 'CAM 3', durationSec: 8, tags: ['FOUL'], thumbnail: 'https://picsum.photos/160/90?random=11' },
];

// --- MACROS (AUTOMATION) ---
export const SYSTEM_MACROS: BroadcastMacro[] = [
  {
    id: 'macro-end-inning',
    label: 'END INNING',
    type: 'SCENE',
    color: 'bg-orange-600',
    actions: [
      { type: 'AUDIO_FADE', channelId: 'aud-src-1', targetLevel: 0, duration: 500 },
      { type: 'CUT_TO_SOURCE', sourceId: 'src-4' }, // Replay
      { type: 'GFX_UPDATE', overlayId: 'gfx-score', active: false },
      { type: 'GFX_UPDATE', overlayId: 'gfx-summary', active: true },
      { type: 'WAIT', ms: 5000 },
      { type: 'GFX_UPDATE', overlayId: 'gfx-summary', active: false },
    ]
  },
  {
    id: 'macro-new-pitcher',
    label: 'NEW PITCHER',
    type: 'SCENE',
    color: 'bg-blue-600',
    actions: [
      { type: 'CUT_TO_SOURCE', sourceId: 'src-5' }, // Bullpen Cam
      { type: 'GFX_UPDATE', overlayId: 'gfx-score', active: true },
      { type: 'GFX_UPDATE', overlayId: 'gfx-pitcher', active: true },
      { type: 'WAIT', ms: 4000 },
      { type: 'GFX_UPDATE', overlayId: 'gfx-pitcher', active: false },
    ]
  }
];

export const MOCK_RUNDOWN = [
  { time: '10:00:00', segment: 'OPENING', source: 'GFX MAIN', notes: 'Music bed start' },
  { time: '10:01:00', segment: 'WELCOME', source: 'CAM 1', notes: 'Talent Intro' },
  { time: '10:05:00', segment: 'HIGHLIGHTS', source: 'REPLAY A', notes: 'Voiceover live' },
];

export const INITIAL_BROADCAST_STATE: BroadcastState = {
    appMode: 'GENERAL',
    opMode: 'STUDIO',
    activeNavTab: 'HOME',
    activeMobileDrawer: 'NONE',
    systemStats: INITIAL_SYSTEM_STATS,
    systemLogs: [],
    programId: 'src-1',
    previewId: 'src-2',
    sources: INITIAL_SOURCES_RECORD,
    sourceOrder: INITIAL_SOURCE_ORDER,
    audioChannels: INITIAL_AUDIO,
    masterLevel: 0.8,
    overlays: INITIAL_OVERLAYS,
    sponsors: INITIAL_SPONSORS,
    replays: INITIAL_REPLAYS,
    activeReplayId: null,
    replaySpeed: 1.0,
    activeRole: 'TD', 
    mode: 'STUDIO',
    mixEffect: {
        programId: 'src-1',
        previewId: 'src-2',
        transition: { type: 'CUT', duration: 0, progress: 0, inProgress: false },
        dsk: { active: false, sourceId: null }
    },
    audio: {
        master: { id: 'master', label: 'MASTER', volume: 0.8, muted: false, meter: -20 },
        channels: {} 
    },
    output: {
        isStreaming: false,
        isRecording: false,
        duration: 0,
        health: 'OFFLINE',
        stats: { bitrate: 0, fps: 60, dropped: 0 }
    },
    transitionProgress: 0,
    isAutoTrans: false,
    dskActive: false,
    recording: true,
    isoRecording: true,
    streaming: true,
    virtualCam: false,
    macroExecuting: null,
    guests: INITIAL_GUESTS,
    destinations: INITIAL_DESTINATIONS,
    fieldUnits: INITIAL_UNITS,
    chatMessages: INITIAL_CHAT,
    showChat: false,
    editingSourceId: null,
    editingAudioId: null, 
    aspectRatio: '16:9',
    activeLayout: 'FULL',
    socialFeed: INITIAL_SOCIAL,
    sportsState: INITIAL_SPORTS_STATE, 
    podcastState: INITIAL_PODCAST_STATE,
    podcastSeries: INITIAL_PODCAST_SERIES,
    podcastEpisodes: INITIAL_PODCAST_EPISODES,
    streamerState: INITIAL_STREAMER_STATE,
    droneState: INITIAL_DRONE_STATE,
    hardwareSwitcher: INITIAL_HARDWARE_SWITCHER,
    timeline: [],
    commercialMode: 'OFF', 
    products: INITIAL_PRODUCTS,
    revenue: 14250,
    activeProductId: null,
    flashSaleTimeRemaining: null,
    socialProofActive: false,
    showShipping: false,
    showBundle: false,
    discountActive: false,
    audioReference: INITIAL_ARE_STATE, 
    audioEngine: INITIAL_AUDIO_ENGINE_STATE, 
    masterAudio: INITIAL_MASTER_AUDIO,
    djState: INITIAL_DJ_STATE,
    ui: {
        showSettings: false,
        showAudioMixer: false,
        activeDrawer: null,
        showInputManager: false
    },
    detectedDevices: [] // Initial detected devices
};
