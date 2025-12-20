let audioContext: AudioContext | null = null;
const audioBuffers: Map<number, AudioBuffer> = new Map();

const SOUND_FILES = [
  { note: 'C', file: '/sounds/BOS_CCS_Synth_Pad_One_Shot_Celestial_C_1766244226101.wav' },
  { note: 'D', file: '/sounds/BOS_CCS_Synth_Pad_One_Shot_Mute_D_1766244226101.wav' },
  { note: 'E', file: '/sounds/BOS_CCS_Synth_Pad_One_Shot_Celestial_C_2_1766244226100.wav' },
  { note: 'G', file: '/sounds/BOS_CCS_Synth_Pad_One_Shot_Particles_G_1766244226101.wav' },
  { note: 'A', file: '/sounds/BOS_CCS_Synth_Pad_One_Shot_End_A_1766244226100.wav' },
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
  
  const loadPromises = SOUND_FILES.map(async (sound, index) => {
    try {
      const response = await fetch(sound.file);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      audioBuffers.set(index, audioBuffer);
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

  const bufferIndex = wallIndex % SOUND_FILES.length;
  const buffer = audioBuffers.get(bufferIndex);
  
  if (!buffer) {
    console.warn(`Sound buffer not loaded for wall ${wallIndex}`);
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
  return SOUND_FILES[wallIndex % SOUND_FILES.length].note;
}

export function getAllNotes(): { note: string; file: string }[] {
  return SOUND_FILES;
}
