let audioContext: AudioContext | null = null;
const audioBuffers: Map<string, AudioBuffer> = new Map();

const OUTER_SOUND_FILES = [
  { note: 'DO', file: '/sounds/DO__1766249463731.wav' },
  { note: 'RE', file: '/sounds/RE_1766249463731.wav' },
  { note: 'MI', file: '/sounds/MI_1766249463731.wav' },
  { note: 'SOL', file: '/sounds/SOL__1766249463730.wav' },
  { note: 'LA', file: '/sounds/LA__1766249463729.wav' },
];

const INNER_SOUND_FILES = [
  { note: 'C', file: '/sounds/inner/C_4_-tub_bell_1766306626209.wav' },
  { note: 'D', file: '/sounds/inner/D_4_-tub_bell_1766306626208.wav' },
  { note: 'E', file: '/sounds/inner/E_4_-tub_bell_1766306626208.wav' },
  { note: 'G', file: '/sounds/inner/G_4_-tub_bell_1766306626208.wav' },
  { note: 'A', file: '/sounds/inner/A_4_-tub_bell_1766306626207.wav' },
];

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
    ...OUTER_SOUND_FILES.map((s, i) => ({ ...s, key: `outer_${i}` })),
    ...INNER_SOUND_FILES.map((s, i) => ({ ...s, key: `inner_${i}` })),
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
}

export function playNote(wallIndex: number, volume: number = 0.5): void {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const bufferIndex = wallIndex % OUTER_SOUND_FILES.length;
  const buffer = audioBuffers.get(`outer_${bufferIndex}`);
  
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

  const bufferIndex = wallIndex % INNER_SOUND_FILES.length;
  const buffer = audioBuffers.get(`inner_${bufferIndex}`);
  
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
  return OUTER_SOUND_FILES[wallIndex % OUTER_SOUND_FILES.length].note;
}

export function getInnerNoteLabel(wallIndex: number): string {
  return INNER_SOUND_FILES[wallIndex % INNER_SOUND_FILES.length].note;
}

export function getAllNotes(): { note: string; file: string }[] {
  return OUTER_SOUND_FILES;
}
