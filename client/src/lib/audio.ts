let audioContext: AudioContext | null = null;
const audioBuffers: Map<string, AudioBuffer> = new Map();

const BASE_URL = "/pentatonic-bouncer";

const OUTER_SOUND_SET_A = [
  { note: 'DO', file: '${BASE_URL}/sounds/DO__1766249463731.wav' },
  { note: 'RE', file: '${BASE_URL}/sounds/RE_1766249463731.wav' },
  { note: 'MI', file: '${BASE_URL}/sounds/MI_1766249463731.wav' },
  { note: 'SOL', file: '${BASE_URL}/sounds/SOL__1766249463730.wav' },
  { note: 'LA', file: '${BASE_URL}/sounds/LA__1766249463729.wav' },
];

const OUTER_SOUND_SET_B = [
  { note: 'DO', file: '${BASE_URL}/sounds/C_1_cloudpad_1766333016766.wav' },
  { note: 'RE', file: '${BASE_URL}/sounds/D_1_cloudpad_1766333016765.wav' },
  { note: 'MI', file: '${BASE_URL}/sounds/E_1_cloudpad_1766333016765.wav' },
  { note: 'SOL', file: '${BASE_URL}/sounds/G_1_cloudpad_1766333016765.wav' },
  { note: 'LA', file: '${BASE_URL}/sounds/A_1_cloudpad_1766333016764.wav' },
];

const INNER_SOUND_SET_A = [
  { note: 'C', file: '${BASE_URL}/sounds/inner/C_4_tub_bell_riv_1766340955097.wav' },
  { note: 'D', file: '${BASE_URL}/sounds/inner/D_4_4_tub_bell_riv_1766340955098.wav' },
  { note: 'E', file: '${BASE_URL}/sounds/inner/E_4_tub_bell_riv_1766340955098.wav' },
  { note: 'G', file: '${BASE_URL}/sounds/inner/G_4_tub_bell_riv_1766340955098.wav' },
  { note: 'C5', file: '${BASE_URL}/sounds/inner/C_5_tub_bell_riv_1766340955098.wav' },
];

const INNER_SOUND_SET_B = [
  { note: 'C', file: '${BASE_URL}/sounds/inner/C_2_tub_bell_riv_1766340998845.wav' },
  { note: 'D', file: '${BASE_URL}/sounds/inner/D_2_tub_bell_riv_1766340998846.wav' },
  { note: 'E', file: '${BASE_URL}/sounds/inner/E_2_tub_bell_riv_1766340998846.wav' },
  { note: 'G', file: '${BASE_URL}/sounds/inner/G_2_tub_bell_riv_1766340998846.wav' },
  { note: 'C3', file: '${BASE_URL}/sounds/inner/C_3_tub_bell_riv_1766340998846.wav' },
];

let cycleStartTime: number = Date.now();
const INNER_CYCLE_DURATION = 10 * 60 * 1000;
const OUTER_CYCLE_DURATION = 13 * 60 * 1000;

function getCurrentInnerSet(): 'A' | 'B' {
  const elapsed = Date.now() - cycleStartTime;
  const cycleCount = Math.floor(elapsed / INNER_CYCLE_DURATION);
  return cycleCount % 2 === 0 ? 'A' : 'B';
}

function getCurrentOuterSet(): 'A' | 'B' {
  const elapsed = Date.now() - cycleStartTime;
  const cycleCount = Math.floor(elapsed / OUTER_CYCLE_DURATION);
  return cycleCount % 2 === 0 ? 'A' : 'B';
}

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export async function resumeAudioContext(): Promise<void> {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
}

export async function preloadSounds(): Promise<void> {
  const ctx = getAudioContext();
  
  const allSounds = [
    ...OUTER_SOUND_SET_A.map((s, i) => ({ ...s, key: `outerA_${i}` })),
    ...OUTER_SOUND_SET_B.map((s, i) => ({ ...s, key: `outerB_${i}` })),
    ...INNER_SOUND_SET_A.map((s, i) => ({ ...s, key: `innerA_${i}` })),
    ...INNER_SOUND_SET_B.map((s, i) => ({ ...s, key: `innerB_${i}` })),
  ];
  
  const loadPromises = allSounds.map(async (sound) => {
    try {
      const response = await fetch(sound.file);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      audioBuffers.set(sound.key, audioBuffer);
    } catch (error) {
      console.error(`Failed to load sound ${sound.file}:`, error);
    }
  });
  
  await Promise.all(loadPromises);
  cycleStartTime = Date.now();
}

export function playNote(wallIndex: number, volume: number = 0.5): void {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const currentSet = getCurrentOuterSet();
  const setFiles = currentSet === 'A' ? OUTER_SOUND_SET_A : OUTER_SOUND_SET_B;
  const bufferIndex = wallIndex % setFiles.length;
  const bufferKey = `outer${currentSet}_${bufferIndex}`;
  const buffer = audioBuffers.get(bufferKey);
  
  if (!buffer) {
    console.warn(`Sound buffer not loaded for outer wall ${wallIndex}`);
    return;
  }
  
  const source = ctx.createBufferSource();
  const gainNode = ctx.createGain();
  
  source.buffer = buffer;
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  
  source.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  source.start(0);
}

export function playInnerNote(wallIndex: number, volume: number = 0.5): void {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const currentSet = getCurrentInnerSet();
  const setFiles = currentSet === 'A' ? INNER_SOUND_SET_A : INNER_SOUND_SET_B;
  const bufferIndex = wallIndex % setFiles.length;
  const bufferKey = `inner${currentSet}_${bufferIndex}`;
  const buffer = audioBuffers.get(bufferKey);
  
  if (!buffer) {
    console.warn(`Sound buffer not loaded for inner wall ${wallIndex}`);
    return;
  }
  
  const source = ctx.createBufferSource();
  const gainNode = ctx.createGain();
  
  source.buffer = buffer;
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  
  source.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  source.start(0);
}

export function getNoteLabel(wallIndex: number): string {
  const currentSet = getCurrentOuterSet();
  const setFiles = currentSet === 'A' ? OUTER_SOUND_SET_A : OUTER_SOUND_SET_B;
  return setFiles[wallIndex % setFiles.length].note;
}

export function getInnerNoteLabel(wallIndex: number): string {
  const currentSet = getCurrentInnerSet();
  const setFiles = currentSet === 'A' ? INNER_SOUND_SET_A : INNER_SOUND_SET_B;
  return setFiles[wallIndex % setFiles.length].note;
}

export function getAllNotes(): { note: string; file: string }[] {
  return OUTER_SOUND_SET_A;
}

export function getCurrentInnerSoundSet(): 'A' | 'B' {
  return getCurrentInnerSet();
}

export function getCurrentOuterSoundSet(): 'A' | 'B' {
  return getCurrentOuterSet();
}
